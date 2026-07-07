# Blood Drive Coordinator Copilot

An interactive POC built for the American Red Cross Innovation Team's TPM interview process.
Two things at once: **a working product** that a coordinator could actually use, and **the AI-driven workflow** that produced it.

- **Product** — `/` route. A field-ops copilot that predicts donor no-shows, drafts personalized reminders, and helps coordinators hit collection targets *despite* the day's no-show rate.
- **Process** — `/process` route. Six Claude Code sub-agents (PRD → Assumption Map → System Design → Wireframes → Design Spec → Build), human-gated between phases. Each phase produced a real artifact you can browse.

Repo: [ditto-tac/arc-bdcoordinator](https://github.com/ditto-tac/arc-bdcoordinator)

---

## Quick start

```bash
git clone https://github.com/ditto-tac/arc-bdcoordinator.git
cd arc-bdcoordinator
npm install
npm run dev
# → open http://localhost:5173
```

Or deploy to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages):

```bash
npm run build
# ships a static bundle in dist/
```

There is no backend. No env vars are required for the default (canned) demo path.

## Live LLM (optional)

Every LLM-generated card has a **Regenerate live** button. It opens a Bring-Your-Own-Key modal, stores your Anthropic API key in `localStorage` (this device only, never transmitted anywhere except Anthropic), and runs live Claude Sonnet 4.5 for that interaction.

- Get a key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
- Cost per session: ~$0.30 at typical use (system prompt caches after first call)
- Clear the key at any time via the "Forget stored key" affordance in the modal

---

## Repo layout

```
.claude/agents/        # 6 Claude Code sub-agents (one per workflow phase)
workflow/              # Living artifacts produced by each phase
  00-opportunity-brief.md
  01-prd.md            # v3 — iterated 3 times
  01b-assumption-map.md
  02-system-design.md
  03-wireframes.md
  04-design-spec.md
  05-build-notes.md
docs/
  methodology.md       # Interviewer-facing narrative
  run-workflow.md      # How to run each phase
src/
  types.ts             # Data model (supports full returning-donor loop)
  data/
    seed.ts            # 30 seeded donors + Johnstown HS drive fixture
    canned-llm.ts      # Pre-computed Claude responses (real output, cached at build time)
    workflow-artifacts.ts  # Raw imports of all workflow/*.md and .claude/agents/*.md
  lib/
    scoring.ts         # Deterministic rule-based no-show scoring
    api/
      llm.ts           # BYOK live path with prompt caching
  components/
    Dashboard.tsx      # Landing product view (roster, brief, weather, stats)
    DriveHeader.tsx
    WeatherWidget.tsx
    AIMorningBrief.tsx
    DonorRoster.tsx
    DonorDetail.tsx    # Slide-in drawer with factor breakdown + override
    SMSComposer.tsx    # Slide-in drawer with tone chips + regenerate live
    RegenerateLiveModal.tsx  # BYOK key entry
    PostDriveRecap.tsx
    RiskBadge.tsx
    process/           # /process route — animated visualizations + phase cards
      ProcessPage.tsx
      AgentPipelineViz.tsx
      DataModelGrowthViz.tsx
      ApiIntegrationMapViz.tsx
      PhaseCard.tsx
      ArtifactViewer.tsx
```

## Tech stack

- **React 18** + **TypeScript strict** + **Vite**
- **Tailwind CSS** with a small design token layer (see `workflow/04-design-spec.md`)
- **Framer Motion** for the /process visualizations
- **react-markdown** + **remark-gfm** for artifact rendering
- **@anthropic-ai/sdk** for the BYOK live path
- **Three free public APIs** called browser-side: [weather.gov (NWS)](https://www.weather.gov/documentation/services-web-api), [Nominatim OSM](https://nominatim.org/release-docs/latest/api/Search/), [randomuser.me](https://randomuser.me/documentation)

## What this is not

- Not a production product. See `workflow/01-prd.md` §9 for the explicit out-of-scope list.
- Not affiliated with the American Red Cross. This is a portfolio / interview artifact built by an outside candidate. The Red Cross visual register is respected but the specific brand mark is not used.

## Credits

Built by Leslie K. Pang for a technical PM interview with the American Red Cross Innovation Team, in collaboration with Claude Opus 4.7. Every sub-agent is a Claude Code `.md` file that any team can copy and adapt.

Licensed for evaluation and educational review purposes.
