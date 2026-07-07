import opportunityBrief from '../../workflow/00-opportunity-brief.md?raw'
import prd from '../../workflow/01-prd.md?raw'
import assumptionMap from '../../workflow/01b-assumption-map.md?raw'
import systemDesign from '../../workflow/02-system-design.md?raw'
import wireframes from '../../workflow/03-wireframes.md?raw'
import designSpec from '../../workflow/04-design-spec.md?raw'

import prdAgent from '../../.claude/agents/phase-1-prd.md?raw'
import assumptionAgent from '../../.claude/agents/phase-1b-assumption-map.md?raw'
import systemDesignAgent from '../../.claude/agents/phase-2-system-design.md?raw'
import wireframeAgent from '../../.claude/agents/phase-3-wireframe.md?raw'
import designAgent from '../../.claude/agents/phase-4-design.md?raw'
import buildAgent from '../../.claude/agents/phase-5-build.md?raw'

export type WorkflowPhase = {
  id: string
  index: string
  title: string
  agentName: string
  agentRole: string
  inputSummary: string
  outputPath: string
  humanEdits: string
  artifactMarkdown: string
  agentPromptMarkdown: string
  icon: string
}

export const PHASES: WorkflowPhase[] = [
  {
    id: 'phase-1',
    index: '1',
    title: 'PRD',
    agentName: 'phase-1-prd',
    agentRole:
      'Senior product strategist embedded in the Red Cross Innovation test kitchen. Turns opportunity briefs into capability-forward PRDs that a small team can build in 1-2 weeks.',
    inputSummary: 'workflow/00-opportunity-brief.md',
    outputPath: 'workflow/01-prd.md',
    humanEdits:
      'Iterated to v3. Restructured for current/future-state workflows, moved tech out to Phase 2, reframed success metrics around Target Attainment (not no-show rate).',
    artifactMarkdown: prd,
    agentPromptMarkdown: prdAgent,
    icon: '📝',
  },
  {
    id: 'phase-1b',
    index: '1.5',
    title: 'Assumption Map',
    agentName: 'phase-1b-assumption-map',
    agentRole:
      'Senior product strategist specializing in de-risking early-stage ideas. Extracts assumptions across VUBF categories and ranks by importance × evidence.',
    inputSummary: 'workflow/01-prd.md',
    outputPath: 'workflow/01b-assumption-map.md',
    humanEdits:
      'Added A15/A16 after reviewer flagged that the learning loop needed a "coordinator overrides are directionally correct" assumption to test.',
    artifactMarkdown: assumptionMap,
    agentPromptMarkdown: assumptionAgent,
    icon: '🎯',
  },
  {
    id: 'phase-2',
    index: '2',
    title: 'System Design',
    agentName: 'phase-2-system-design',
    agentRole:
      'Pragmatic solutions architect proposing the smallest system that validates the PRD hypotheses. Prefers client-side + free public APIs for test-kitchen POCs.',
    inputSummary: 'workflow/01-prd.md + 01b-assumption-map.md',
    outputPath: 'workflow/02-system-design.md',
    humanEdits:
      'Extended data model with returning-donor loop entities (DonorMessage, CoordinatorOverride, DriveOutcome) after reviewer asked how the copilot improves over time.',
    artifactMarkdown: systemDesign,
    agentPromptMarkdown: systemDesignAgent,
    icon: '📄',
  },
  {
    id: 'phase-3',
    index: '3',
    title: 'Wireframes',
    agentName: 'phase-3-wireframe',
    agentRole:
      'UX designer producing lo-fi ASCII wireframes and user-flow diagrams. Lo-fi is a feature: it forces alignment on hierarchy before pixels.',
    inputSummary: 'workflow/01-prd.md + 02-system-design.md + 01b-assumption-map.md',
    outputPath: 'workflow/03-wireframes.md',
    humanEdits: 'Accepted as authored. 6 screens with default/loading/empty/error state sketches.',
    artifactMarkdown: wireframes,
    agentPromptMarkdown: wireframeAgent,
    icon: '📐',
  },
  {
    id: 'phase-4',
    index: '4',
    title: 'Design Spec',
    agentName: 'phase-4-design',
    agentRole:
      'Senior product designer for field-facing operational tools. Converts wireframes into design tokens, motion, accessibility contract, and Tailwind config.',
    inputSummary: 'workflow/03-wireframes.md',
    outputPath: 'workflow/04-design-spec.md',
    humanEdits:
      'Tightened for a 3-day POC; deferred dark mode (coordinators work in stadium lighting — light UI is more legible).',
    artifactMarkdown: designSpec,
    agentPromptMarkdown: designAgent,
    icon: '🎨',
  },
  {
    id: 'phase-5',
    index: '5',
    title: 'Build',
    agentName: 'phase-5-build',
    agentRole:
      'Senior full-stack engineer building a test-kitchen POC. Ship over polish. React 18+ patterns, TypeScript strict, hooks with discipline, canned LLM output at build time with a BYOK live path.',
    inputSummary: 'all upstream workflow/*.md',
    outputPath: 'src/ + workflow/05-build-notes.md',
    humanEdits:
      'In progress. Rule-based scoring live, canned LLM responses in place, interactive dashboard + donor detail + SMS composer + recap all working.',
    artifactMarkdown:
      '<pending — Phase 5 in flight. Build notes will land here after the app is done.>',
    agentPromptMarkdown: buildAgent,
    icon: '💻',
  },
]

export const OPPORTUNITY_BRIEF = opportunityBrief
