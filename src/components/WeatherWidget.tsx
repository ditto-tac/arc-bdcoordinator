import type { Forecast } from '../types'

const CONDITION_ICON: Record<string, string> = {
  'Sunny': '☀',
  'Cloudy': '☁',
  'Mostly Cloudy': '☁',
  'Rain': '☔',
  'Rain likely': '☔',
  'Snow': '❄',
}

function iconFor(condition: string): string {
  return CONDITION_ICON[condition] ?? '☁'
}

type Props = {
  forecast: Forecast
  stale?: boolean
}

export default function WeatherWidget({ forecast, stale }: Props) {
  return (
    <div className="rounded-lg border border-rc-stone bg-white p-4 md:p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-sm font-semibold text-rc-ink">Weather</div>
        <div className="text-xs text-rc-slate font-mono">
          {forecast.highF}° / {forecast.lowF}°
        </div>
      </div>
      {stale && (
        <div className="mb-2 rounded-md bg-rc-amber/10 px-2 py-1 text-[11px] text-rc-amber">
          ⚠ Live weather unavailable · showing cached forecast
        </div>
      )}
      <div className="text-xs text-rc-slate mb-3">{forecast.summary}</div>
      <div className="grid grid-cols-6 gap-1 md:gap-2">
        {forecast.hours.map(h => {
          const heavy = h.precipPct > 40
          return (
            <div
              key={h.hour}
              className={`flex flex-col items-center rounded p-1.5 ${
                heavy ? 'bg-rc-amber/10' : 'bg-rc-mist'
              }`}
              title={`${h.condition} · confidence ${h.confidence}`}
            >
              <span className="text-[10px] text-rc-slate font-mono">{h.hour}</span>
              <span className="text-lg leading-none my-0.5" aria-hidden>
                {iconFor(h.condition)}
              </span>
              <span
                className={`text-[10px] font-mono font-medium ${
                  heavy ? 'text-rc-amber' : 'text-rc-slate'
                }`}
              >
                {h.confidence === 'low' && '~'}
                {h.precipPct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
