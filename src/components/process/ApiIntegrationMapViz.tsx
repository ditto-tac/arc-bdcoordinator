import { motion } from 'framer-motion'

type Node = {
  id: string
  label: string
  sublabel: string
  x: number
  y: number
  role: string
}

const NODES: Node[] = [
  { id: 'nws', label: 'NWS', sublabel: 'api.weather.gov', x: 12, y: 24, role: 'hourly forecast' },
  { id: 'osm', label: 'OSM', sublabel: 'Nominatim', x: 12, y: 76, role: 'geocoding' },
  { id: 'ru', label: 'randomuser.me', sublabel: 'seeded donors', x: 88, y: 24, role: 'realistic personas' },
  { id: 'claude', label: 'Claude', sublabel: 'Sonnet 4.6 · BYOK', x: 88, y: 76, role: 'live regenerate' },
]

const CENTER = { x: 50, y: 50 }

export default function ApiIntegrationMapViz() {
  return (
    <div className="rounded-lg border border-rc-stone bg-white p-5 md:p-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-rc-ink">API integration map</h3>
        <span className="text-[11px] text-rc-slate">
          all client-side · no backend
        </span>
      </div>

      <div className="relative w-full" style={{ paddingTop: '52%' }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          {NODES.map((n, i) => (
            <motion.line
              key={n.id}
              x1={n.x}
              y1={n.y}
              x2={CENTER.x}
              y2={CENTER.y}
              stroke="#CC0000"
              strokeWidth="0.25"
              strokeDasharray="1.5 1"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.7 }}
            />
          ))}
        </svg>

        {/* Center app node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="absolute z-10 flex h-14 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-lg border-2 border-rc-red bg-white shadow-sm"
          style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
        >
          <div className="text-[10px] font-mono uppercase text-rc-slate">SPA</div>
          <div className="text-xs font-semibold text-rc-ink">Copilot</div>
        </motion.div>

        {/* External nodes */}
        {NODES.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.35 }}
            className="absolute z-10 flex w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-md border border-rc-stone bg-rc-mist px-2 py-1.5 text-center"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <div className="text-[10px] font-semibold text-rc-ink">{n.label}</div>
            <div className="text-[9px] text-rc-slate leading-tight">{n.sublabel}</div>
            <div className="mt-0.5 text-[8px] italic text-rc-slate">{n.role}</div>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-[11px] text-rc-slate leading-relaxed">
        Every arrow is a browser-side fetch. NWS is real hourly forecast for
        Johnstown, PA. OSM handles geocoding. randomuser.me seeded the roster at
        build time. Claude is only called when an interviewer clicks "Regenerate
        live" and provides an API key.
      </p>
    </div>
  )
}
