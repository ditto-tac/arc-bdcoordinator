import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { WorkflowPhase } from '../../data/workflow-artifacts'
import ArtifactViewer from './ArtifactViewer'

type Props = {
  phase: WorkflowPhase
  defaultOpen?: boolean
}

type Tab = 'output' | 'agent'

export default function PhaseCard({ phase, defaultOpen }: Props) {
  const [open, setOpen] = useState(!!defaultOpen)
  const [tab, setTab] = useState<Tab>('output')

  return (
    <div
      id={phase.id}
      className="rounded-lg border border-rc-stone bg-white overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-rc-mist focus:outline-none focus-visible:ring-2 focus-visible:ring-rc-red"
      >
        <div className="text-2xl md:text-3xl leading-none" aria-hidden>
          {phase.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] font-mono uppercase text-rc-slate">
              Phase {phase.index}
            </span>
            <span className="text-base font-semibold text-rc-ink">{phase.title}</span>
          </div>
          <div className="mt-0.5 text-xs text-rc-slate">
            <span className="font-mono">.claude/agents/{phase.agentName}.md</span>
            <span className="mx-2">→</span>
            <span className="font-mono">{phase.outputPath}</span>
          </div>
        </div>
        <div className="text-rc-slate text-sm" aria-hidden>
          {open ? '▲' : '▼'}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-rc-stone"
          >
            <div className="p-4 md:p-5 space-y-4">
              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-wide text-rc-slate mb-1">
                  Agent role
                </h4>
                <p className="text-sm text-rc-ink leading-relaxed">{phase.agentRole}</p>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="rounded border border-rc-stone bg-rc-mist p-2.5">
                  <div className="text-[10px] font-semibold uppercase text-rc-slate">
                    Input
                  </div>
                  <div className="mt-1 font-mono text-rc-ink text-[11px]">
                    {phase.inputSummary}
                  </div>
                </div>
                <div className="rounded border border-rc-stone bg-rc-mist p-2.5">
                  <div className="text-[10px] font-semibold uppercase text-rc-slate">
                    Output
                  </div>
                  <div className="mt-1 font-mono text-rc-ink text-[11px]">
                    {phase.outputPath}
                  </div>
                </div>
                <div className="rounded border border-rc-red/20 bg-rc-red/5 p-2.5">
                  <div className="text-[10px] font-semibold uppercase text-rc-red">
                    Human edits
                  </div>
                  <div className="mt-1 text-rc-ink text-[11px] leading-relaxed">
                    {phase.humanEdits}
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-2 flex gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setTab('output')}
                    className={`px-2.5 py-1 rounded ${
                      tab === 'output'
                        ? 'bg-rc-ink text-white'
                        : 'text-rc-slate hover:text-rc-ink'
                    }`}
                  >
                    Output artifact
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('agent')}
                    className={`px-2.5 py-1 rounded ${
                      tab === 'agent'
                        ? 'bg-rc-ink text-white'
                        : 'text-rc-slate hover:text-rc-ink'
                    }`}
                  >
                    Agent prompt
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto rounded border border-rc-stone bg-rc-mist/50 p-3">
                  <ArtifactViewer
                    markdown={
                      tab === 'output'
                        ? phase.artifactMarkdown
                        : phase.agentPromptMarkdown
                    }
                    compact
                  />
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
