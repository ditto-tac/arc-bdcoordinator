import { useEffect, useState } from 'react'
import type { Donor, SMSDraft } from '../types'
import { cannedSMSFor } from '../data/canned-llm'
import { slotTimeForDonor } from '../data/seed'
import { generateSMSLive } from '../lib/api/llm'
import RegenerateLiveModal from './RegenerateLiveModal'

const TONE_OPTIONS = ['Warm', 'Direct', 'Playful'] as const
type Tone = (typeof TONE_OPTIONS)[number]

type Props = {
  donor: Donor
  onClose: () => void
}

export default function SMSComposer({ donor, onClose }: Props) {
  const slot = slotTimeForDonor(donor.id)
  const [draft, setDraft] = useState<SMSDraft>(() =>
    cannedSMSFor(donor.id, donor.name, slot)
  )
  const [tone, setTone] = useState<Tone>('Warm')
  const [text, setText] = useState(draft.text)
  const [sent, setSent] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [regenError, setRegenError] = useState<string | null>(null)

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  const isLive = draft.source === 'live'

  const runLive = async (apiKey: string) => {
    setRegenerating(true)
    setRegenError(null)
    try {
      const liveText = await generateSMSLive(apiKey, donor, slot, tone)
      const nextDraft: SMSDraft = {
        ...draft,
        text: liveText,
        charCount: liveText.length,
        source: 'live',
        toneTags: [tone.toLowerCase(), 'live'],
        generatedAt: new Date().toISOString(),
      }
      setDraft(nextDraft)
      setText(liveText)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setRegenError(msg)
      throw err
    } finally {
      setRegenerating(false)
    }
  }

  if (sent) {
    return (
      <div
        className="fixed inset-0 z-50 flex justify-end"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute inset-0 bg-rc-ink/40"
          aria-label="Close"
        />
        <div className="relative flex w-full max-w-lg flex-col bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-rc-stone px-5 py-3">
            <div className="text-sm font-semibold text-rc-ink">Draft sent (mock)</div>
            <button
              type="button"
              onClick={onClose}
              className="text-xl text-rc-slate hover:text-rc-ink"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 text-center">
            <div className="mx-auto max-w-xs text-4xl">✓</div>
            <div className="mt-4 text-sm font-medium text-rc-ink">
              Mock-sent to {donor.name}
            </div>
            <div className="mt-1 text-xs text-rc-slate">
              Nothing was actually sent — this POC doesn't wire an SMS gateway.
              {' '}
              {donor.name.split(' ')[0]}'s tier would update to CONFIRMED once
              they reply YES.
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-md bg-rc-ink px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Back to roster
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex justify-end"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sms-composer-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute inset-0 bg-rc-ink/40"
          aria-label="Close SMS composer"
        />
        <div className="relative flex w-full max-w-lg flex-col bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-rc-stone px-5 py-3">
            <div id="sms-composer-title" className="text-sm font-semibold text-rc-ink">
              Draft SMS for {donor.name}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-xl text-rc-slate hover:text-rc-ink"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="mb-3 flex items-center gap-3 text-[11px] text-rc-slate">
              <span
                className={`font-mono px-1.5 py-0.5 rounded ${
                  isLive
                    ? 'bg-rc-emerald/10 text-rc-emerald'
                    : 'bg-rc-mist text-rc-slate'
                }`}
              >
                {isLive ? '● live' : '○ canned'}
              </span>
              <span className="font-mono">{text.length} chars</span>
              <span>·</span>
              <span>Personalized</span>
            </div>

            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={6}
              aria-live="polite"
              className="w-full resize-none rounded-md border border-rc-stone bg-white p-3 text-sm text-rc-ink font-mono leading-relaxed focus:border-rc-red focus:outline-none focus:ring-1 focus:ring-rc-red"
              aria-label="SMS draft"
            />

            {regenError && (
              <div className="mt-2 rounded border border-rc-red/30 bg-rc-red/5 px-2 py-1 text-[11px] text-rc-red">
                Live regeneration failed. Showing baseline draft.
              </div>
            )}

            <div className="mt-4">
              <div className="text-[11px] text-rc-slate mb-2">Tone</div>
              <div
                className="flex gap-1.5"
                role="radiogroup"
                aria-label="Message tone"
              >
                {TONE_OPTIONS.map(t => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={tone === t}
                    onClick={() => setTone(t)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      tone === t
                        ? 'border-rc-red bg-rc-red text-white'
                        : 'border-rc-stone bg-white text-rc-ink hover:bg-rc-mist'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[11px] text-rc-slate mb-1">
                Cited factors in this message
              </div>
              <div className="flex flex-wrap gap-1.5">
                {draft.citedFactors.map(f => (
                  <span
                    key={f}
                    className="rounded bg-rc-teal/10 px-1.5 py-0.5 text-[10px] font-medium text-rc-teal"
                  >
                    ● {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-rc-stone bg-rc-mist px-5 py-3">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              disabled={regenerating}
              className="text-xs font-medium text-rc-teal hover:text-rc-red disabled:opacity-40"
            >
              {regenerating ? 'regenerating...' : 'Regenerate live (BYOK) ⟳'}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded px-3 py-1.5 text-xs text-rc-slate hover:text-rc-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setSent(true)}
                className="rounded bg-rc-red px-3 py-1.5 text-xs font-medium text-white hover:bg-rc-red-dark"
              >
                Send (mock) →
              </button>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <RegenerateLiveModal
          onClose={() => setModalOpen(false)}
          onKeyReady={runLive}
          target={`${donor.name}'s SMS draft`}
        />
      )}
    </>
  )
}
