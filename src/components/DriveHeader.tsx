import { DRIVE, DONORS } from '../data/seed'

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function DriveHeader() {
  return (
    <div className="rounded-lg border border-rc-stone bg-white px-5 py-4 md:px-6 md:py-5">
      <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
        <div>
          <div className="text-lg md:text-xl font-semibold text-rc-ink">{DRIVE.name}</div>
          <div className="text-xs md:text-sm text-rc-slate mt-0.5">{DRIVE.addr}</div>
        </div>
        <div className="flex items-center gap-4 text-xs md:text-sm text-rc-slate">
          <span>{formatDate(DRIVE.date)}</span>
          <span className="text-rc-stone">·</span>
          <span>
            target <span className="font-mono font-semibold text-rc-ink">{DRIVE.targetUnits}</span> units
          </span>
          <span className="text-rc-stone">·</span>
          <span>
            <span className="font-mono font-semibold text-rc-ink">{DONORS.length}</span> booked
          </span>
        </div>
      </div>
    </div>
  )
}
