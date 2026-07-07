import { PHASES } from '../../data/workflow-artifacts'
import AgentPipelineViz from './AgentPipelineViz'
import DataModelGrowthViz from './DataModelGrowthViz'
import ApiIntegrationMapViz from './ApiIntegrationMapViz'
import PhaseCard from './PhaseCard'

export default function ProcessPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-rc-ink">
          How this was built
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-rc-slate leading-relaxed">
          Six Claude Code sub-agents, one per phase, human-gated between phases.
          Each agent produces a real artifact (PRD, assumption map, system design,
          wireframes, design spec, code). Every artifact was reviewed and iterated
          by a human before the next phase ran. The final product below is the
          output of the workflow above.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-mono text-rc-slate">
          <span>6 agents</span>
          <span>·</span>
          <span>3 days</span>
          <span>·</span>
          <span>github.com/ditto-tac/arc-bdcoordinator</span>
        </div>
      </header>

      <div className="space-y-4 md:space-y-6">
        <AgentPipelineViz />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <DataModelGrowthViz />
          <ApiIntegrationMapViz />
        </div>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-rc-slate">
            Phase cards
          </h2>
          <div className="space-y-3">
            {PHASES.map((phase, i) => (
              <PhaseCard key={phase.id} phase={phase} defaultOpen={i === 0} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
