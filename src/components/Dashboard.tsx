import { useMemo, useState } from 'react'
import { DONORS, FORECAST } from '../data/seed'
import { scoreAll, summarizeRoster } from '../lib/scoring'
import DriveHeader from './DriveHeader'
import WeatherWidget from './WeatherWidget'
import AIMorningBrief from './AIMorningBrief'
import DonorRoster from './DonorRoster'
import DonorDetail from './DonorDetail'
import SMSComposer from './SMSComposer'
import PostDriveRecap from './PostDriveRecap'

type Tab = 'today' | 'recap'

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('today')
  const [selectedDonorId, setSelectedDonorId] = useState<string | null>(null)
  const [composingDonorId, setComposingDonorId] = useState<string | null>(null)

  const scores = useMemo(() => scoreAll(DONORS, FORECAST), [])
  const summary = useMemo(() => summarizeRoster(scores), [scores])

  const selectedDonor = selectedDonorId
    ? DONORS.find(d => d.id === selectedDonorId) ?? null
    : null
  const selectedScore = selectedDonor
    ? scores.find(s => s.donorId === selectedDonor.id) ?? null
    : null

  const composingDonor = composingDonorId
    ? DONORS.find(d => d.id === composingDonorId) ?? null
    : null

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-4 flex items-center gap-1 text-sm">
        <button
          type="button"
          onClick={() => setTab('today')}
          className={`px-3 py-1.5 rounded-md ${
            tab === 'today'
              ? 'bg-white border border-rc-stone text-rc-ink font-medium'
              : 'text-rc-slate hover:text-rc-ink'
          }`}
        >
          Today's drive
        </button>
        <button
          type="button"
          onClick={() => setTab('recap')}
          className={`px-3 py-1.5 rounded-md ${
            tab === 'recap'
              ? 'bg-white border border-rc-stone text-rc-ink font-medium'
              : 'text-rc-slate hover:text-rc-ink'
          }`}
        >
          Post-drive recap
        </button>
      </div>

      {tab === 'today' && (
        <div className="space-y-4 md:space-y-6">
          <DriveHeader />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <WeatherWidget forecast={FORECAST} />
            </div>
            <div className="md:col-span-2">
              <AIMorningBrief />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <StatTile label="Target" value={String(summary.driveTarget)} suffix="units" />
            <StatTile label="Booked" value={String(DONORS.length)} suffix="slots" />
            <StatTile
              label="Predicted no-shows"
              value={String(summary.predictedNoShows)}
              tone="warn"
            />
            <StatTile
              label="Overbook suggestion"
              value={`+${summary.overbookRecommendation}`}
              tone="accent"
            />
          </div>
          <DonorRoster
            donors={DONORS}
            scores={scores}
            onSelectDonor={setSelectedDonorId}
          />
        </div>
      )}

      {tab === 'recap' && <PostDriveRecap />}

      {selectedDonor && selectedScore && (
        <DonorDetail
          donor={selectedDonor}
          score={selectedScore}
          onClose={() => setSelectedDonorId(null)}
          onDraftSMS={() => setComposingDonorId(selectedDonor.id)}
        />
      )}
      {composingDonor && (
        <SMSComposer
          donor={composingDonor}
          onClose={() => setComposingDonorId(null)}
        />
      )}
    </div>
  )
}

function StatTile({
  label,
  value,
  suffix,
  tone,
}: {
  label: string
  value: string
  suffix?: string
  tone?: 'warn' | 'accent'
}) {
  const toneClass =
    tone === 'warn'
      ? 'text-rc-amber'
      : tone === 'accent'
      ? 'text-rc-red'
      : 'text-rc-ink'
  return (
    <div className="rounded-lg border border-rc-stone bg-white p-3 md:p-4">
      <div className="text-[11px] uppercase tracking-wide text-rc-slate">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`text-xl md:text-2xl font-semibold font-mono ${toneClass}`}>
          {value}
        </span>
        {suffix && <span className="text-[11px] text-rc-slate">{suffix}</span>}
      </div>
    </div>
  )
}
