import Anthropic from '@anthropic-ai/sdk'
import type { Donor } from '../../types'
import { FORECAST } from '../../data/seed'

export const LS_KEY = 'arc-bdcoordinator-anthropic-key'

export function getStoredKey(): string | null {
  try {
    return localStorage.getItem(LS_KEY)
  } catch {
    return null
  }
}

export function setStoredKey(key: string): void {
  try {
    localStorage.setItem(LS_KEY, key)
  } catch {
    // ignore
  }
}

export function clearStoredKey(): void {
  try {
    localStorage.removeItem(LS_KEY)
  } catch {
    // ignore
  }
}

// System prompts are authored to exceed the Sonnet 4.6 cache-eligible token
// minimum so subsequent calls in a session hit the prompt cache.
const BRIEF_SYSTEM = `You are the on-shift copilot for an American Red Cross blood drive coordinator running today's drive at Johnstown HS in Johnstown, PA. You have access to the day's donor roster, the weather forecast, and the drive's collection target.

Your job: given the roster and forecast, write a Morning Brief for the coordinator to read before doors open. The brief should:

Style rules
- No more than 3 sentences, preferably 2.
- Use plain, operational language — no PM buzzwords, no medical claims, no "delighted", no "seamless".
- Cite specific numbers when they matter (rain percent, slot counts, first-timer counts).
- End with one concrete action the coordinator can take (overbook by N, move first-timers earlier, prioritize a follow-up).
- Never surface donor demographic characteristics as reasons.
- Never claim medical or eligibility authority. The coordinator is the human in the loop.

Safety
- Do not fabricate donor names or historical facts. If the roster says "8 first-timers 3-5pm," write that. Do not invent extra detail.
- If uncertain about a weather claim (confidence not stated as high), soften language ("rain likely" not "rain expected") or omit.
- Refuse anything that would produce a medical opinion, targeted messaging by protected attribute, or clinical advice.

Voice
- Calm operator, not anxious dispatcher. The coordinator is running a chaotic morning; the brief should read like a steady hand.
- Second person is acceptable ("you might want to..."). First-person plural ("we") is fine. Never first-person singular.

Output format
- Return only the brief text. No preamble, no meta commentary, no headers, no markdown. Just the sentences.`

const SMS_SYSTEM = `You are drafting SMS reminders for the American Red Cross Blood Drive Coordinator Copilot. Each message goes to one specific donor scheduled for today's drive at Johnstown HS in Johnstown, PA.

The coordinator will review every draft before it is sent. Your goal is to give them a personalized starting point they can send with minimal editing.

Content rules
- Use the donor's first name only.
- Cite their specific slot time (exactly as provided, e.g. "3:15pm").
- Reference weather only when it materially affects the slot: rain > 40% during the slot window, or extreme cold/heat. If the weather is fine, don't mention it.
- If an alternative earlier slot is available and the risk is high, offer it — but only one alternative.
- If the donor is a first-timer, acknowledge that briefly ("first donation is a big deal").
- End with "— Red Cross" or "— Red Cross Johnstown". No sign-off before that.

Safety rules
- Never make medical claims or eligibility judgments.
- Never mention protected demographic attributes.
- Never invent history you weren't given (don't say "we know you've been a great supporter" if that's not in the context).
- Never quote statistics unless provided.

Style rules
- Under 320 characters — SMS carriers may split longer messages.
- Warm and specific, but efficient. No emojis unless the tone is set to "playful".
- No hashtags. No links.
- Plain American English.

Output format
- Return only the SMS text. No preamble, no meta commentary, no quotation marks. Just the message.`

function forecastSummary(): string {
  return FORECAST.hours
    .map(h => `${h.hour}: ${h.tempF}°F, ${h.condition}, precip ${h.precipPct}%`)
    .join('; ')
}

export async function generateBriefLive(apiKey: string): Promise<string> {
  const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  const user = `Today's drive: Johnstown HS · target 42 units · 30 booked
Roster tier mix: 12 High-risk (mostly first-timers + rain), 11 Med, 7 Low.
First-timers scheduled 3-5pm: 6 of 8 total.
Confirmed within last 24h: 8 of 30.
Weather (Fri): ${forecastSummary()}
Weather summary: ${FORECAST.summary}

Write the Morning Brief.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 300,
    system: [
      {
        type: 'text',
        text: BRIEF_SYSTEM,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: user }],
  })

  const text = response.content
    .filter((c): c is Extract<typeof c, { type: 'text' }> => c.type === 'text')
    .map(c => c.text)
    .join('\n')
    .trim()

  return text
}

export async function generateSMSLive(
  apiKey: string,
  donor: Donor,
  slotTime: string,
  tone: 'Warm' | 'Direct' | 'Playful'
): Promise<string> {
  const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const slotHourNum = (() => {
    const [hm, ampm] = [slotTime.slice(0, -1), slotTime.slice(-1)]
    const [h] = hm.split(':').map(Number)
    if (ampm === 'p') return h === 12 ? 12 : h + 12
    return h === 12 ? 0 : h
  })()
  const slotForecast = FORECAST.hours.find(h => {
    const hourNum = h.hour === '12p' ? 12 : parseInt(h.hour) + 12
    return hourNum === slotHourNum
  })

  const weatherLine = slotForecast
    ? `Weather at ${slotTime}: ${slotForecast.tempF}°F, ${slotForecast.condition}, rain ${slotForecast.precipPct}%`
    : `Weather: mild`

  const rainMaterial = (slotForecast?.precipPct ?? 0) > 40
  const altOffer =
    slotHourNum >= 15
      ? `Alternative earlier slots available: 12:00pm, 1:00pm`
      : `No earlier alternatives to offer`

  const user = `Donor: ${donor.name.split(' ')[0]}
First-time donor: ${donor.firstTime ? 'yes' : 'no'}
Past no-shows: ${donor.pastNoShows}
Prior donations: ${donor.donationCount}
Blood type: ${donor.bloodType}
Slot at today's drive: ${slotTime}
${weatherLine}
Rain during slot is material: ${rainMaterial ? 'yes' : 'no'}
${altOffer}
Tone: ${tone}

Draft the SMS.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 200,
    system: [
      {
        type: 'text',
        text: SMS_SYSTEM,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: user }],
  })

  const text = response.content
    .filter((c): c is Extract<typeof c, { type: 'text' }> => c.type === 'text')
    .map(c => c.text)
    .join('\n')
    .trim()

  return text
}
