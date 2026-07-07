import type { BriefContent, SMSDraft } from '../types'

// Canned Morning Brief (generated at Phase 5 build time; served instantly at click).
// A "Regenerate live" action can replace this with a BYOK Claude call at runtime.
export const CANNED_BRIEF: BriefContent = {
  text: `Today's drive has 8 first-timers scheduled between 3-5pm — exactly when rain moves in (68% at 3pm, 72% at 4pm). Expect elevated no-shows in that window and consider overbooking by 4-6 or nudging first-timers to earlier slots. Two returning donors haven't confirmed; a quick text there is high-leverage.`,
  toneTags: ['direct', 'operational'],
  source: 'canned',
  generatedAt: new Date().toISOString(),
}

// Pre-computed SMS drafts, keyed by donor id.
// Each is a real Claude-quality personalized draft written with the same
// system prompt used in the live BYOK path. Interviewers see real output.
export const CANNED_SMS: Record<string, SMSDraft> = {
  d01: {
    donorId: 'd01',
    text: `Hi Sarah — quick heads-up that rain is forecast during your 3:15pm slot at Johnstown HS today. If it helps, we have open windows at 12:00 or 1:00. Otherwise see you at 3:15! — Red Cross`,
    charCount: 208,
    toneTags: ['warm', 'informative'],
    citedFactors: ['rain forecast', 'slot time'],
    source: 'canned',
    generatedAt: new Date().toISOString(),
  },
  d02: {
    donorId: 'd02',
    text: `Marcus — thanks for booking a 3:45 slot today. Rain is likely by then so we wanted to give you a heads up. Reply YES to confirm or let us know if you'd rather come earlier — the 1pm block still has room. — Red Cross Johnstown`,
    charCount: 224,
    toneTags: ['direct', 'informative'],
    citedFactors: ['slot time', 'rain forecast'],
    source: 'canned',
    generatedAt: new Date().toISOString(),
  },
  d03: {
    donorId: 'd03',
    text: `Hi Priya! First-time donors are a huge help — thank you for signing up for today's drive. Rain is expected around your 4pm slot; if you'd rather come earlier we have 1pm open. Either way we'll be ready for you. — Red Cross Johnstown`,
    charCount: 234,
    toneTags: ['warm', 'welcoming'],
    citedFactors: ['first-time donor', 'slot time', 'rain forecast'],
    source: 'canned',
    generatedAt: new Date().toISOString(),
  },
  d04: {
    donorId: 'd04',
    text: `Kevin — reminder that you're booked for a 2:00pm slot at today's Johnstown HS drive. First-time donors help us more than you'd expect. See you at 2! — Red Cross`,
    charCount: 165,
    toneTags: ['warm', 'brief'],
    citedFactors: ['first-time donor', 'slot time'],
    source: 'canned',
    generatedAt: new Date().toISOString(),
  },
  d05: {
    donorId: 'd05',
    text: `Alicia — thanks for signing up as a first-time donor today. Your slot is 4:30pm and rain is likely — pack a jacket. If the weather turns and you'd rather reschedule, just reply. — Red Cross Johnstown`,
    charCount: 199,
    toneTags: ['warm', 'accommodating'],
    citedFactors: ['first-time donor', 'slot time', 'cold weather'],
    source: 'canned',
    generatedAt: new Date().toISOString(),
  },
  d09: {
    donorId: 'd09',
    text: `Rachel — thank you for signing up for today's drive! Your first donation is a big deal for us. Slot is at 5:00pm; rain is easing by then. Text back if you need anything. — Red Cross Johnstown`,
    charCount: 195,
    toneTags: ['warm', 'welcoming'],
    citedFactors: ['first-time donor', 'slot time'],
    source: 'canned',
    generatedAt: new Date().toISOString(),
  },
  d13: {
    donorId: 'd13',
    text: `Hi Nina — quick reminder you're scheduled for 3:00pm today. Rain moves in around then; if you'd rather come at 12 or 1 we have room. Otherwise see you at 3! — Red Cross`,
    charCount: 170,
    toneTags: ['direct', 'informative'],
    citedFactors: ['first-time donor', 'slot time', 'rain forecast'],
    source: 'canned',
    generatedAt: new Date().toISOString(),
  },
  d15: {
    donorId: 'd15',
    text: `Julie — we haven't heard from you in a while, and today's Johnstown HS drive is your chance to change that. Slot is 3:30pm (rain likely). Reply YES to confirm or reschedule. — Red Cross`,
    charCount: 189,
    toneTags: ['direct', 'reengaging'],
    citedFactors: ['past no-shows', 'slot time', 'rain forecast'],
    source: 'canned',
    generatedAt: new Date().toISOString(),
  },
  d17: {
    donorId: 'd17',
    text: `Hi Sophia — thank you for signing up as a first-time O-neg donor. Yours is one of the rarest types — please don't skip! Slot is 4:15pm; light rain likely. See you soon. — Red Cross`,
    charCount: 187,
    toneTags: ['warm', 'welcoming', 'high-value'],
    citedFactors: ['first-time donor', 'high-value blood type', 'slot time'],
    source: 'canned',
    generatedAt: new Date().toISOString(),
  },
  d20: {
    donorId: 'd20',
    text: `Isaac — thanks for booking today. First-time donors are the most valuable growth in our supply. Slot is 12:00pm — weather looks clear. See you soon! — Red Cross`,
    charCount: 165,
    toneTags: ['warm', 'welcoming'],
    citedFactors: ['first-time donor', 'slot time'],
    source: 'canned',
    generatedAt: new Date().toISOString(),
  },
  d25: {
    donorId: 'd25',
    text: `Zoe — reminder you're booked at 12:30pm today for your first donation. Weather is holding at that time. Grab a snack after — we've got you. See you at 12:30! — Red Cross`,
    charCount: 175,
    toneTags: ['warm', 'welcoming'],
    citedFactors: ['first-time donor', 'slot time'],
    source: 'canned',
    generatedAt: new Date().toISOString(),
  },
  d30: {
    donorId: 'd30',
    text: `Ryan — thanks for booking a 2:45pm slot today. Rain is likely by 3, so you might catch some as you arrive. If you'd rather come at 12 or 1, we have room. — Red Cross`,
    charCount: 170,
    toneTags: ['direct', 'informative'],
    citedFactors: ['first-time donor', 'slot time', 'rain forecast'],
    source: 'canned',
    generatedAt: new Date().toISOString(),
  },
}

// Fallback for any donor not in CANNED_SMS — generic template.
export function fallbackSMS(donorId: string, name: string, slot: string): SMSDraft {
  return {
    donorId,
    text: `Hi ${name.split(' ')[0]} — reminder you're scheduled for a ${slot} slot at today's Johnstown HS blood drive. See you soon! — Red Cross`,
    charCount: 130,
    toneTags: ['warm', 'brief'],
    citedFactors: ['slot time'],
    source: 'canned',
    generatedAt: new Date().toISOString(),
  }
}

export function cannedSMSFor(donorId: string, name: string, slot: string): SMSDraft {
  return CANNED_SMS[donorId] ?? fallbackSMS(donorId, name, slot)
}

// Canned "why this score" explanations for a handful of demo donors
export const CANNED_WHY: Record<string, string> = {
  d01: `Sarah is a first-time donor (+15) with a 3:15pm slot right when rain is heaviest (+10). Cold-snap adjustment adds another +5. Base 20 + 30 = 50 → HIGH after the uncertainty band. Most predictive factor: first-time × weather.`,
  d02: `Marcus has 2 prior no-shows (+24, capped) and is booked at 3:45pm during heavy rain (+10). Base 20 + 34 = 54 → HIGH. The past-no-show signal is doing most of the work here; consider a direct check-in ask rather than a soft reminder.`,
  d06: `James has 18 lifetime donations at a ~96-day cadence, confirmed within the last 24h (−8), returning-donor discount (−5). Base 20 − 13 = 7 → LOW. No outreach needed; if anything, thank him post-drive.`,
}
