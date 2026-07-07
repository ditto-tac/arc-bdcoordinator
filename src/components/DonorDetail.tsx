import { useEffect, useState } from 'react'
import type { Donor, OverrideReason, RiskScore, Tier } from '../types'
import RiskBadge from './RiskBadge'
import { slotTimeForDonor } from '../data/seed'

const REASON_OPTIONS: { value: OverrideReason; label: string }[] = [
  { value: 'coord_knowledge', label: 'I know this donor personally' },
  { value: 'donor_confirmed', label: 'Donor confirmed verbally / via phone' },
  { value: 'other', label: 'Other' },
]

type Props = {
  donor: Donor
  score: RiskScore
  onClose: () => void
  onDraftSMS: () => void
  onOverride?: (newTier: Tier, reason: OverrideReason, note: string) => void
}

export default function DonorDetail({ donor, score, onClose, onDraftSMS, onOverride }: Props) {
  const [showOverride, setShowOverride] = useState(false)
  const [pendingTier, setPendingTier] = useState<Tier | null>(null)
  const [reason, setReason] = useState<OverrideReason>('coord_knowledge')
  const [note, setNote] = useState('')

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  const slot = slotTimeForDonor(donor.id)
  const applied = score.factors.filter(f => f.applied)
  const notApplied = score.factors.filter(f => !f.applied)

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="donor-detail-title"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-rc-ink/30"
        aria-label="Close donor detail"
      />
      <div className="relative flex w-full max-w-lg flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-rc-stone px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-rc-slate hover:text-rc-ink"
          >
            ← Back to roster
          </button>
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="donor-detail-title" className="text-xl font-semibold text-rc-ink">
                {donor.name}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <RiskBadge tier={score.tier} score={score.score} size="md" />
                <span className="text-xs text-rc-slate">
                  {slot} slot · {donor.bloodType} ·{' '}
                  {donor.firstTime ? 'first-time donor' : `${donor.donationCount} prior donations`}
                </span>
              </div>
              <div className="mt-1 text-xs text-rc-slate">
                {donor.distanceMi} mi from site · {donor.preferredChannel} preferred
              </div>
            </div>
            <button
              type="button"
              onClick={onDraftSMS}
              className="rounded-md bg-rc-red px-3 py-2 text-sm font-medium text-white hover:bg-rc-red-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-rc-red focus-visible:ring-offset-2 whitespace-nowrap"
            >
              Draft SMS →
            </button>
          </div>

          <section className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-rc-slate mb-2">
              Why this score
            </h3>
            <ul className="rounded-md border border-rc-stone">
              {applied.map((f, i) => (
                <li
                  key={`a${i}`}
                  className="flex items-center justify-between border-b border-rc-stone px-3 py-2 last:border-b-0"
                >
                  <span className="flex items-center gap-2 text-sm text-rc-ink">
                    <span
                      className={`inline-block h-4 w-4 rounded-full text-center text-[10px] font-mono ${
                        f.contribution > 0
                          ? 'bg-rc-red/10 text-rc-red'
                          : 'bg-rc-emerald/10 text-rc-emerald'
                      }`}
                    >
                      {f.contribution > 0 ? '+' : '−'}
                    </span>
                    {f.label}
                  </span>
                  <span className="font-mono text-xs text-rc-slate">
                    {f.contribution > 0 ? '+' : ''}
                    {f.contribution}
                  </span>
                </li>
              ))}
              {notApplied.map((f, i) => (
                <li
                  key={`n${i}`}
                  className="flex items-center justify-between border-b border-rc-stone px-3 py-2 opacity-50 last:border-b-0"
                >
                  <span className="flex items-center gap-2 text-sm text-rc-slate">
                    <span className="inline-block h-4 w-4 rounded-full bg-rc-mist text-center text-[10px] font-mono text-rc-slate">
                      ○
                    </span>
                    {f.label}
                  </span>
                  <span className="font-mono text-xs text-rc-slate">
                    (not applied)
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2 text-[11px] text-rc-slate font-mono">
              Base 20 + {score.factors.filter(f => f.applied).reduce((a, f) => a + f.contribution, 0)} = {score.score} → {score.tier.toUpperCase()}
            </div>
          </section>

          <section className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-rc-slate">
                Coordinator override
              </h3>
              {!showOverride && (
                <button
                  type="button"
                  onClick={() => setShowOverride(true)}
                  className="text-xs text-rc-teal hover:text-rc-red font-medium"
                >
                  Override score →
                </button>
              )}
            </div>
            {showOverride && (
              <div className="rounded-md border border-rc-stone p-3">
                <div className="text-xs text-rc-slate mb-2">
                  Current tier: <span className="font-semibold text-rc-ink">{score.tier}</span>
                </div>
                <div className="flex gap-2 mb-3">
                  {(['High', 'Med', 'Low'] as Tier[])
                    .filter(t => t !== score.tier)
                    .map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPendingTier(t)}
                        className={`rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
                          pendingTier === t
                            ? 'border-rc-red bg-rc-red text-white'
                            : 'border-rc-stone bg-white text-rc-ink hover:bg-rc-mist'
                        }`}
                      >
                        Set {t}
                      </button>
                    ))}
                </div>
                <label className="text-[11px] text-rc-slate">
                  Reason
                  <select
                    value={reason}
                    onChange={e => setReason(e.target.value as OverrideReason)}
                    className="mt-1 w-full rounded border border-rc-stone bg-white px-2 py-1 text-xs text-rc-ink"
                  >
                    {REASON_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="mt-2 block text-[11px] text-rc-slate">
                  Note (optional)
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value.slice(0, 200))}
                    maxLength={200}
                    rows={2}
                    className="mt-1 w-full rounded border border-rc-stone bg-white px-2 py-1 text-xs text-rc-ink"
                    placeholder="e.g. Sarah called and confirmed she's on her way"
                  />
                </label>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOverride(false)
                      setPendingTier(null)
                      setNote('')
                    }}
                    className="text-xs text-rc-slate hover:text-rc-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!pendingTier}
                    onClick={() => {
                      if (!pendingTier) return
                      onOverride?.(pendingTier, reason, note)
                      setShowOverride(false)
                      setPendingTier(null)
                      setNote('')
                    }}
                    className="rounded bg-rc-ink px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40 hover:bg-black"
                  >
                    Save override
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-rc-slate mb-2">
              History
            </h3>
            <div className="rounded-md border border-rc-stone p-3 text-sm text-rc-slate">
              {donor.firstTime ? (
                <>No prior donations. First-time donor.</>
              ) : (
                <>
                  {donor.donationCount} lifetime donations · cadence ~
                  {donor.cadenceDaysAvg} days · last on{' '}
                  {donor.lastDonation}
                  {donor.pastNoShows > 0 && (
                    <div className="mt-1 text-rc-amber">
                      {donor.pastNoShows} past no-show{donor.pastNoShows > 1 && 's'}
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
