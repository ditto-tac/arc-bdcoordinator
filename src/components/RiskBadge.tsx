import type { Tier } from '../types'

const TIER_STYLES: Record<Tier, { dot: string; text: string; ring: string; label: string }> = {
  High: {
    dot: 'bg-rc-red',
    text: 'text-rc-red',
    ring: 'ring-rc-red/30',
    label: 'HIGH',
  },
  Med: {
    dot: 'bg-rc-amber',
    text: 'text-rc-amber',
    ring: 'ring-rc-amber/30',
    label: 'MED',
  },
  Low: {
    dot: 'bg-rc-emerald',
    text: 'text-rc-emerald',
    ring: 'ring-rc-emerald/30',
    label: 'LOW',
  },
}

type Props = {
  tier: Tier
  score?: number
  showScore?: boolean
  size?: 'sm' | 'md'
}

export default function RiskBadge({ tier, score, showScore = true, size = 'sm' }: Props) {
  const style = TIER_STYLES[tier]
  const height = size === 'sm' ? 'h-5 text-[10px]' : 'h-7 text-xs'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 ring-1 ring-inset bg-white ${style.ring} ${style.text} font-medium tracking-wide ${height}`}
      aria-label={`${tier} risk${score !== undefined ? `, ${score} of 100` : ''}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden />
      <span>{style.label}</span>
      {showScore && score !== undefined && (
        <span className="font-mono opacity-70">{score}</span>
      )}
    </span>
  )
}
