# Run the workflow

How to re-run any phase from Claude Code, and how to invoke the whole chain from scratch.

## Prerequisites

- [Claude Code](https://claude.com/product/claude-code) installed
- Your working directory is this repo (`arc-bdcoordinator/`)

Claude Code auto-loads sub-agents from `.claude/agents/*.md` in the current project directory.

## Run from scratch

You'll need one input: an **opportunity brief** at `workflow/00-opportunity-brief.md`. The one in this repo describes the Blood Drive Coordinator no-show problem — but you can replace it with any other blood-services opportunity (donor eligibility, supply forecasting, adverse-reaction intake) and re-run the whole chain.

Then, from Claude Code:

```
# Phase 1 — PRD
Use the phase-1-prd agent to read workflow/00-opportunity-brief.md and produce workflow/01-prd.md.
```

Review the PRD. Edit anywhere you disagree. Then:

```
# Phase 1.5 — Assumption Map
Use the phase-1b-assumption-map agent to read workflow/01-prd.md and produce workflow/01b-assumption-map.md.
```

Review. Iterate if the top-priority assumptions don't feel right. Then:

```
# Phase 2 — System Design
Use the phase-2-system-design agent to read workflow/01-prd.md and workflow/01b-assumption-map.md and produce workflow/02-system-design.md.
```

Review the architecture. Verify the API integrations still work by reading the docs it cites. Then:

```
# Phase 3 — Wireframes
Use the phase-3-wireframe agent to read workflow/01-prd.md and workflow/02-system-design.md and produce workflow/03-wireframes.md.
```

Review the flows and empty/loading/error states. Then:

```
# Phase 4 — Design Spec
Use the phase-4-design agent to read workflow/03-wireframes.md and produce workflow/04-design-spec.md.
```

Review the tokens and confirm accessibility contract. Then:

```
# Phase 5 — Build
Use the phase-5-build agent to read every workflow/*.md and build the React app in src/. Write workflow/05-build-notes.md.
```

The build agent will scaffold the project (if not scaffolded), install dependencies, and produce the interactive product.

## Re-run a single phase

Any phase can be re-run on its own — the agent reads the *current* state of the upstream artifacts, not a snapshot. If you update the PRD after Phase 2 has already run, re-invoke Phase 2 to regenerate the system design. Same for downstream phases.

The change log at the bottom of each artifact captures the history of what changed and why.

## Adapt an agent

Each `.claude/agents/*.md` file is a plain text prompt. Edit the "Operating principles" or "Output" sections to steer the agent's behavior for your team. Two examples from this project:

- **After PRD v2 mentioned tech**: added `phase-1-prd` operating principle *"A PRD is behavior, not technology."*
- **After Phase 2 data model was thin**: added `phase-2-system-design` operating principle *"Design the data model for the returning-user loop from day one."*

These are the moments where a workflow gets sharper. Capture them in the agent, not just in your head.

## Notes on token budget

Every artifact stays under ~1500 words on purpose. This keeps each phase's context small enough that the downstream agent can read *all* upstream artifacts without hitting context limits. A team that added a Phase 6 (pilot design) or Phase 7 (analysis) could still keep the whole chain running end-to-end within a single session.
