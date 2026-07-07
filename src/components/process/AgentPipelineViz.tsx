import { motion } from 'framer-motion'
import { PHASES } from '../../data/workflow-artifacts'

export default function AgentPipelineViz() {
  return (
    <div className="rounded-lg border border-rc-stone bg-white p-5 md:p-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-rc-ink">Agent pipeline</h3>
        <span className="text-[11px] text-rc-slate">6 agents · human-gated between phases</span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-1 min-w-max">
          {PHASES.map((phase, i) => (
            <div key={phase.id} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, duration: 0.4, ease: 'easeOut' }}
                className="flex w-24 md:w-28 flex-col items-center rounded-lg border border-rc-stone bg-rc-mist p-2 md:p-3"
              >
                <div className="text-2xl md:text-3xl" aria-hidden>
                  {phase.icon}
                </div>
                <div className="mt-1 text-[10px] md:text-[11px] font-mono text-rc-slate">
                  Phase {phase.index}
                </div>
                <div className="mt-0.5 text-center text-[11px] md:text-xs font-semibold text-rc-ink leading-tight">
                  {phase.title}
                </div>
              </motion.div>

              {i < PHASES.length - 1 && (
                <div className="flex flex-col items-center px-1 md:px-2">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.15 + 0.1, duration: 0.25 }}
                    className="h-[2px] w-4 md:w-6 bg-rc-red origin-left"
                  />
                  <div className="mt-1 text-[9px] font-mono text-rc-slate" title="Human review gate">
                    ⏸
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-[11px] text-rc-slate leading-relaxed">
        Every arrow is a human review gate. After each phase's agent produces its
        artifact, Leslie reads it, edits, iterates, then invokes the next agent
        with the reviewed input. The workflow's memory lives in the artifacts,
        not in a shared conversation.
      </p>
    </div>
  )
}
