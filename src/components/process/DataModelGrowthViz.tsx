import { motion } from 'framer-motion'

type Stage = {
  phase: string
  label: string
  entities: string[]
  note?: string
}

const STAGES: Stage[] = [
  {
    phase: 'Phase 1',
    label: 'PRD — capabilities only',
    entities: ['Coordinator', 'Donor', 'Drive'],
    note: 'Concept entities. No fields yet.',
  },
  {
    phase: 'Phase 2 · v1',
    label: 'System Design — first pass',
    entities: [
      'Drive · Slot',
      'Donor · basic fields',
      'Forecast',
      'RiskScore',
      'SMSDraft',
      'DriveOutcome',
    ],
    note: 'Fields flow into every entity.',
  },
  {
    phase: 'Phase 2 · v2',
    label: 'System Design — returning-donor loop',
    entities: [
      'Donor · +cohort_tags, preferences, deferral',
      'DonorMessage (new)',
      'CoordinatorOverride (new)',
      'DriveOutcome · per-donor',
    ],
    note: 'Added after reviewer flagged the model was thin on repeated donors.',
  },
  {
    phase: 'Phase 3-4',
    label: 'Wireframes & Design',
    entities: [
      '(model unchanged — components spec\'d against existing entities)',
    ],
    note: 'Wireframes reference the entity fields. Design spec maps tokens to component types.',
  },
  {
    phase: 'Phase 5',
    label: 'Build — entities become code',
    entities: [
      'src/types.ts · TypeScript interfaces',
      'src/data/seed.ts · realistic mock data',
      'src/lib/scoring.ts · deterministic scoring',
      'src/data/canned-llm.ts · pre-computed responses',
    ],
    note: 'The model shape from Phase 2 lives on in production code.',
  },
]

export default function DataModelGrowthViz() {
  return (
    <div className="rounded-lg border border-rc-stone bg-white p-5 md:p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-rc-ink">Data model growth</h3>
        <span className="text-[11px] text-rc-slate">how the schema grew across phases</span>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-1 bottom-1 w-px bg-rc-stone" aria-hidden />

        <div className="space-y-4 md:space-y-5">
          {STAGES.map((stage, i) => (
            <motion.div
              key={stage.phase}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.15, duration: 0.35 }}
              className="relative pl-8"
            >
              <div
                className="absolute left-2 top-1.5 h-2 w-2 rounded-full bg-rc-red ring-4 ring-white"
                aria-hidden
              />
              <div className="text-[11px] font-mono text-rc-slate uppercase tracking-wider">
                {stage.phase}
              </div>
              <div className="text-sm font-semibold text-rc-ink">{stage.label}</div>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {stage.entities.map((e, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.15 + 0.1 + j * 0.04, duration: 0.2 }}
                    className="rounded border border-rc-stone bg-rc-mist px-2 py-0.5 text-[11px] font-mono text-rc-ink"
                  >
                    {e}
                  </motion.li>
                ))}
              </ul>
              {stage.note && (
                <div className="mt-1.5 text-[11px] text-rc-slate italic">
                  {stage.note}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
