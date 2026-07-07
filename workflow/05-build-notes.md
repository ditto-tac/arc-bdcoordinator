# Build Notes — Blood Drive Coordinator Copilot

**Author:** Test Kitchen (Phase 5 agent, human-reviewed)
**Upstream:** `01-prd.md` (v3), `01b-assumption-map.md`, `02-system-design.md`, `03-wireframes.md`, `04-design-spec.md`

## What got built (v0)

**Product (`/` route):**
- `Dashboard` — landing view with two tabs (Today's drive / Post-drive recap)
- `DriveHeader` — drive name, address, date, target, slot count
- `WeatherWidget` — 6-hour hourly forecast with condition icons, precip %, and confidence markers
- `AIMorningBrief` — canned Claude Morning Brief with a "Regenerate live" (BYOK) action
- `DonorRoster` — 30 seeded donors with risk badges, sortable (Risk / Slot / Name), filterable (tier), roster tier counts
- Four stat tiles (Target / Booked / Predicted no-shows / Overbook suggestion)
- `DonorDetail` (drawer) — risk score with full factor breakdown (applied AND not applied factors), coordinator override form
- `SMSComposer` (drawer) — LLM-drafted personalized SMS, tone chips (Warm/Direct/Playful), cited factors row, "Regenerate live" (BYOK), mock send with success state
- `PostDriveRecap` — target attainment, per-tier prediction accuracy, factor accuracy, cohort attendance bars, one-line lessons
- `RegenerateLiveModal` — BYOK API key entry with localStorage persistence and clear scope messaging

**Process (`/process` route):**
- `AgentPipelineViz` — 6 phases as a stagger-fade-in horizontal flow with human-review gates
- `DataModelGrowthViz` — vertical timeline showing schema evolution across phases
- `ApiIntegrationMapViz` — SVG network graph with SPA at center connecting to 4 external APIs
- `PhaseCard` — collapsible card per phase, toggles between the output artifact and the agent prompt itself (rendered from the actual `workflow/*.md` and `.claude/agents/*.md` files)
- `ArtifactViewer` — react-markdown + remark-gfm rendering with Tailwind-styled components

**Foundation:**
- `src/types.ts` — full TypeScript data model including returning-donor loop entities (`DonorMessage`, `CoordinatorOverride`, `DriveOutcome`)
- `src/data/seed.ts` — Johnstown HS drive fixture, 30 hand-authored donors with deliberate slot assignments so canned SMS templates reference real times
- `src/data/canned-llm.ts` — pre-computed Morning Brief + 12 personalized SMS drafts (real Claude quality, baked at build time)
- `src/lib/scoring.ts` — deterministic rule-based no-show scoring with visible factor breakdown
- `src/lib/api/llm.ts` — Anthropic browser SDK with prompt caching on system prompts
- Tailwind config with the design tokens from Phase 4

## What got cut and why

- **Live NWS API fetch**. The design supports it (`src/lib/api/weather.ts` was scaffolded), but I opted for the seeded forecast to keep the demo deterministic. Real NWS integration is a small addition when it earns its place.
- **Nominatim OSM geocode**. Same reason. Johnstown HS is a fixed drive; no live geocoding needed for v0. Kept as a scaffold for v1.
- **Multi-drive rollup for regional managers**. Explicitly out of scope in PRD §9.
- **Slot-level LLM Morning Brief per hour band**. Prompt design supports it; only shipped one brief for the demo.

## Deviations from the design spec

- **Framer Motion moving dots on API map**. Design spec called for dots traveling along the edges from external APIs into the app; SVG cx/cy animation with framer-motion had CSS-length errors. Fell back to dashed animated line-draw. Cleaner visually anyway.
- **Sort dropdown instead of segmented control**. Wireframe showed a segmented control for sort options. Native select was faster to ship and accessible by default.

## Interactivity surface (demo script)

1. Land on `/`. Roster is sorted by Risk — HIGH donors at top.
2. Read the AI Morning Brief. Note the source badge shows `○ canned`.
3. Click `regenerate ⟳` on the brief. BYOK modal opens. Paste an Anthropic key. Live Claude call replaces the text; badge flips to `● live`.
4. Click any HIGH donor (e.g. Sarah T.). Drawer slides in with:
   - Risk badge + score
   - "Why this score" panel with applied and not-applied factors
   - Coordinator override affordance
   - History (first-time donor note or donation cadence)
5. Click `Draft SMS →`. SMS Composer slides in with a canned personalized draft.
6. Try tone chips. Click `Regenerate live (BYOK) ⟳`. Live Claude replaces the text.
7. Click `Send (mock)`. Success state confirms nothing was actually sent.
8. Back to roster. Switch to `Post-drive recap` tab.
9. Read attainment, tier accuracy, cohort attendance bars, one-line lessons.
10. Navigate to `How it was built`. Watch the agent pipeline stagger-fade in.
11. Scroll through the data model growth timeline.
12. Watch API integration map draw its edges.
13. Expand any phase card. Read the actual `workflow/*.md` artifact or the agent prompt.

## Where the ⚠️ assumptions surface

| Assumption | Where a stakeholder notices | Design decision |
|---|---|---|
| A2 (trust hinges on visible reasons) | Every risk badge → "Why this score" panel | Applied factors shown in bold; not-applied factors shown muted so absence is visible |
| A4 (weather is a useful signal) | Weather widget + factor breakdown | Weather is one named factor in the score, not diffuse. Post-drive recap tracks factor accuracy. |
| A1 (coordinators check phone) | Roster + drawers work on 375px mobile | Mobile-first layout everywhere; drawer becomes full-screen sheet on mobile |
| A14 (disparate outreach) | Post-drive recap → cohort attendance bars | Attendance disaggregated by cohort tag; coordinator sees any gap immediately |
| A3 (personalization lift) | SMS composer `source` badge | Every draft carries a `canned` or `live` badge; A/B measurable in pilot |
| A16 (overrides are directionally correct) | Post-drive recap lesson row | "Coordinator overrode Kevin M. → Kevin did no-show → override was directionally correct" pattern surfaces every drive |

## Next iteration (top 3 for a v1)

1. **Live NWS + Nominatim** — swap seeded forecast for live weather, and support any coordinator-supplied drive address.
2. **A "why not this score" affordance** on the roster row itself — reduce the click count for confident coordinators.
3. **Serverless proxy for live LLM** — remove the BYOK friction if the Innovation team wants stakeholders to access without keys. Rate-limited, per-drive budget cap.
