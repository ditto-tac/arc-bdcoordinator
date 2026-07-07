import { useMemo, useState } from 'react'
import type { Donor, RiskScore, Tier } from '../types'
import RiskBadge from './RiskBadge'
import { slotTimeForDonor } from '../data/seed'

type SortKey = 'risk' | 'slot' | 'name'
type FilterKey = 'all' | 'High' | 'Med' | 'Low'

const TIER_ORDER: Record<Tier, number> = { High: 0, Med: 1, Low: 2 }

type Props = {
  donors: Donor[]
  scores: RiskScore[]
  onSelectDonor: (donorId: string) => void
}

export default function DonorRoster({ donors, scores, onSelectDonor }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('risk')
  const [filter, setFilter] = useState<FilterKey>('all')

  const scoreById = useMemo(() => {
    const map = new Map<string, RiskScore>()
    for (const s of scores) map.set(s.donorId, s)
    return map
  }, [scores])

  const counts = useMemo(() => {
    const c = { High: 0, Med: 0, Low: 0 }
    for (const s of scores) c[s.tier]++
    return c
  }, [scores])

  const rows = useMemo(() => {
    const base = donors
      .map(d => ({ donor: d, score: scoreById.get(d.id)! }))
      .filter(x => filter === 'all' || x.score.tier === filter)

    if (sortKey === 'risk') {
      base.sort((a, b) => {
        const t = TIER_ORDER[a.score.tier] - TIER_ORDER[b.score.tier]
        return t !== 0 ? t : b.score.score - a.score.score
      })
    } else if (sortKey === 'slot') {
      base.sort((a, b) =>
        slotTimeForDonor(a.donor.id).localeCompare(slotTimeForDonor(b.donor.id))
      )
    } else {
      base.sort((a, b) => a.donor.name.localeCompare(b.donor.name))
    }

    return base
  }, [donors, scoreById, filter, sortKey])

  return (
    <div className="rounded-lg border border-rc-stone bg-white">
      <div className="flex flex-col gap-2 border-b border-rc-stone p-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm font-semibold text-rc-ink">Donor roster</div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-rc-slate">
          <label className="flex items-center gap-1.5">
            Sort
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value as SortKey)}
              className="rounded border border-rc-stone bg-white px-2 py-1 text-xs text-rc-ink"
            >
              <option value="risk">Risk</option>
              <option value="slot">Slot</option>
              <option value="name">Name</option>
            </select>
          </label>
          <label className="flex items-center gap-1.5">
            Filter
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as FilterKey)}
              className="rounded border border-rc-stone bg-white px-2 py-1 text-xs text-rc-ink"
            >
              <option value="all">All</option>
              <option value="High">High only</option>
              <option value="Med">Med only</option>
              <option value="Low">Low only</option>
            </select>
          </label>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-rc-red">{counts.High} High</span>
            <span className="text-rc-amber">{counts.Med} Med</span>
            <span className="text-rc-emerald">{counts.Low} Low</span>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-rc-stone">
        {rows.map(({ donor, score }) => (
          <li key={donor.id}>
            <button
              type="button"
              onClick={() => onSelectDonor(donor.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-rc-mist focus:bg-rc-mist focus:outline-none focus-visible:ring-2 focus-visible:ring-rc-red focus-visible:ring-offset-2 transition-colors"
            >
              <RiskBadge tier={score.tier} score={score.score} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-rc-ink truncate">
                    {donor.name}
                  </span>
                  <span className="text-xs text-rc-slate font-mono">
                    {slotTimeForDonor(donor.id)}
                  </span>
                  <span className="text-[10px] text-rc-slate">·</span>
                  <span className="text-[10px] text-rc-slate uppercase tracking-wide">
                    {donor.bloodType}
                  </span>
                </div>
                <div className="mt-0.5 flex flex-wrap gap-1.5 text-[11px] text-rc-slate">
                  {score.topFactors.map((f, i) => (
                    <span key={i}>
                      {i > 0 && <span className="text-rc-stone">·</span>} {f}
                    </span>
                  ))}
                  {score.topFactors.length === 0 && (
                    <span className="text-rc-slate/60">no risk factors applied</span>
                  )}
                </div>
              </div>
              <span className="text-rc-slate" aria-hidden>→</span>
            </button>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="p-6 text-center text-sm text-rc-slate">
            No donors match this filter.
          </li>
        )}
      </ul>
    </div>
  )
}
