# Methodology — How this was built

Leslie's take on why a six-agent, human-gated workflow was the right shape for a 3-day test-kitchen POC.

## Why agents at all

Traditional "PM + designer + engineer" hand-offs on a real feature take 2-6 weeks of calendar time. A lot of that isn't the *work* — it's the coordination, translation, and waiting.

A test-kitchen team's job is different: rapid experimentation, cheap validation, clear kill/keep signal. What I wanted to test with this project is whether specialized AI sub-agents could act as *specialists on tap* — each with a tight remit, so a PM can compress those two weeks into two or three days while staying honest about the tradeoffs at every gate.

## The six agents

Each is a Claude Code sub-agent defined in `.claude/agents/*.md`. Every agent has:
- **A focused role** (one job, done well)
- **An input contract** (exactly what upstream artifact it reads)
- **An output contract** (exactly where its artifact lives, and its format)
- **A handoff note** (what the next agent needs)

| # | Agent | Job | Output |
|---|-------|-----|--------|
| 1 | `phase-1-prd` | Turn opportunity brief into capability-forward PRD | `workflow/01-prd.md` |
| 1.5 | `phase-1b-assumption-map` | VUBF-classify assumptions, rank by importance × evidence | `workflow/01b-assumption-map.md` |
| 2 | `phase-2-system-design` | Lean architecture + data model + APIs + LLM strategy | `workflow/02-system-design.md` |
| 3 | `phase-3-wireframe` | ASCII wireframes + user flows + component inventory | `workflow/03-wireframes.md` |
| 4 | `phase-4-design` | Design tokens + motion + accessibility contract + Tailwind config | `workflow/04-design-spec.md` |
| 5 | `phase-5-build` | React app + build changelog | `src/` + `workflow/05-build-notes.md` |

## The two things I did NOT let the agents do

**1. I never let an agent produce a metric or claim without sourcing it.** Every number in the PRD is either cited from a public source or explicitly tagged as an assumption to test. The `phase-1-prd` agent has this baked into its operating principles.

**2. I never let an agent dictate architecture from a PRD.** The PRD describes capabilities and behavior only. Tech choices live in Phase 2. This lets the PRD survive a v1 that swaps out any specific technology.

Both principles were reinforced through iteration — the first draft of `phase-1-prd` mentioned "static site" and "BYOK toggle" in the PRD, which was wrong. I moved those to Phase 2 in v2 and added the "no tech in PRD" principle to the agent so this won't happen again.

## Human gates that mattered

Between every phase, I read the output, edited, and iterated *before* invoking the next agent. Four moments where the human review changed the shape of the product:

1. **PRD v3 — reframed success metrics.** First draft measured no-show rate. Right question, wrong metric — coordinators are graded on hitting their collection target *despite* whatever the day's no-show rate happens to be. Reframed around Target Attainment; added H5.
2. **Assumption map — added A15 & A16 after Phase 2 review.** Once the system design proposed a `CoordinatorOverride` entity for the learning loop, I realized we hadn't asked *whether* coordinator overrides are directionally correct. If they aren't, feeding them back is a doom loop. Added the assumption; added the "compare overrides to actual outcomes" experiment.
3. **System design v2 — thickened the data model.** The initial model captured `first_time` and `past_no_shows` but nothing about ongoing message history, preferences, or per-drive outcomes. Extended the model to support a real returning-donor loop from day one; updated the Phase 2 agent's operating principles so future test-kitchen projects don't have to relearn this.
4. **Design spec — deferred dark mode.** Coordinators work under fluorescent gym lighting. Light UI is more legible. Cheap decision, cheaper than shipping both.

## What the workflow is not

- **Not a magic factory.** It's still my judgment at every gate. The agents are amplifiers, not autopilot.
- **Not "replace the team."** It's the right shape for a fast test-kitchen POC where the team is 1 PM + 1-2 engineers. Real product-scale work needs real product-scale roles.
- **Not stateless.** The artifacts *are* the state. Every phase reads what came before. This is why they're markdown files and not conversation history — I want them versionable, editable, and inspectable by any teammate later.

## What I'd change next time

- **A Phase 6 — pilot design.** After the build, before running with real users, an agent that turns the assumption map + build notes into a concrete 4-drive pilot plan (control cohort, sample sizes, what we measure, kill/keep criteria). This is the piece that closes the test-kitchen loop.
- **A Phase 0 — problem selection.** The opportunity brief was a one-page seed I wrote in ~30 minutes. A structured "problem selection" agent that asks the PM the right questions upfront (jobs-to-be-done, existing solutions, stakeholder alignment) would compress that.
- **Every artifact links to its source assumption.** Right now the wireframes reference the system design; the system design references the assumption map. Adding a small link discipline ("each capability line → the H it tests → the A it addresses") would make the audit story tighter.

## How to reproduce

See [`docs/run-workflow.md`](./run-workflow.md) for the exact commands and prompts.
