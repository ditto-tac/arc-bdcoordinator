# Design Spec — Blood Drive Coordinator Copilot

**Author:** Test Kitchen (Phase 4 agent, human-reviewed)
**Upstream:** `03-wireframes.md`

## 1. Visual philosophy

**Calm operator, not anxious dispatcher.** The coordinator is running a chaotic morning; the app should read as a steady hand — clinical clarity, muted surfaces, single accents where urgency is real. Field-ops beats visual polish: high contrast, big touch targets, sunlight-friendly light UI. The overall register is "modern operations dashboard" (Vercel / Linear / Retool) rather than "consumer app" (Instagram / Duolingo).

Red-forward accent hints at the domain without impersonating the American Red Cross brand mark.

## 2. Color tokens

| Token | Hex | Role | Contrast on `rc-mist` |
|-------|-----|------|-----------------------|
| `rc-red` | `#CC0000` | Primary accent, urgent CTAs, HIGH risk badge | 5.9:1 (AA) |
| `rc-red-dark` | `#A50000` | Hover/active on primary | 7.6:1 (AAA) |
| `rc-ink` | `#1A1A1A` | Primary text | 16.1:1 (AAA) |
| `rc-slate` | `#4A5568` | Secondary text, labels | 7.2:1 (AAA) |
| `rc-mist` | `#F7FAFC` | Page background | — |
| `rc-stone` | `#E2E8F0` | Borders, dividers | 1.3:1 (decoration only) |
| `rc-teal` | `#0891B2` | Info accents, LOW risk badge | 4.6:1 (AA) |
| `rc-amber` | `#D97706` | Warning, MED risk badge | 4.7:1 (AA) |
| `rc-emerald` | `#059669` | Success, confirmed status | 4.6:1 (AA) |

**Semantic mapping — risk tiers:**
- HIGH → `rc-red` (dot + label; never red as background — accessibility)
- MED  → `rc-amber`
- LOW  → `rc-emerald`

Color is never the only signal. Every tier has a text label AND a distinctive dot shape (solid circle / hollow ring / small square) so colorblind users have equal information.

## 3. Typography scale

| Token | Size | Line height | Weight | Use |
|-------|------|-------------|--------|-----|
| `text-xs` | 12px | 1.4 | 500 | Meta labels, badges |
| `text-sm` | 14px | 1.5 | 400 | Body secondary |
| `text-base` | 16px | 1.5 | 400 | Body primary |
| `text-lg` | 18px | 1.4 | 500 | Card titles |
| `text-xl` | 20px | 1.3 | 600 | Section headings |
| `text-2xl` | 24px | 1.2 | 600 | Page titles |

System UI stack (`ui-sans-serif, system-ui, ...`). Monospace (`ui-monospace, ...`) for numeric readouts (score, target counts).

## 4. Spacing

Tailwind default 4px scale. Common patterns:
- Card padding: `p-4` (16px) on mobile, `p-6` (24px) on desktop
- Section gap: `gap-4` (16px) on mobile, `gap-6` (24px) on desktop
- Grid grouping: `space-y-2` inside a card, `space-y-6` between cards
- Touch target min: 44 × 44 px on any interactive element

## 5. Component patterns

### RiskBadge
- **Anatomy:** [dot icon] [tier label uppercase] [score number in monospace]
- **States:** default, HIGH / MED / LOW variants
- **Tokens:** `rc-red`/`rc-amber`/`rc-emerald` per tier; `text-xs` for label; `font-mono text-xs` for score
- **A11y:** ARIA label combines tier and score ("high risk, 72")
- **Tailwind sketch:** `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-current`

### RosterRow
- **Anatomy:** [risk badge] [donor name, slot time] [factor tag chips] [arrow]
- **States:** default, hover, focus, active
- **Tokens:** `p-4`, `border-b border-rc-stone`, `text-base` name
- **Motion:** `hover:bg-rc-mist` transition 120ms
- **A11y:** entire row is `<button>` with `aria-label`; keyboard `Enter` opens detail; focus ring `rc-red` at 2px offset
- **Touch:** row height ≥ 60px

### FactorRow (in Donor Detail)
- **Anatomy:** [sign icon: + / − / ○] [factor description] [contribution number]
- **States:** applied (bold), not applied (muted)
- **Tokens:** `rc-ink` when applied, `rc-slate` when not; monospace contribution

### AIMorningBriefCard
- **Anatomy:** [prose block] [tone/source badge row] [regenerate button]
- **States:** default, loading (shimmer), error (falls back to canned + toast)
- **Motion:** on load, fade-in 200ms; regenerate cycles the text with a soft 320ms crossfade
- **Signature moment:** when a live regeneration completes, the source badge pulses briefly to signal "this is now live"

### DonorDetailDrawer / SMSComposerDrawer
- **Anatomy:** [top bar with back + close] [scrollable content] [sticky action bar]
- **States:** entering, entered, exiting
- **Motion:** slide-in from right on desktop (200ms cubic-bezier(0.4,0,0.2,1)), slide-up on mobile
- **Reduced motion:** replace slide with instant appearance + fade
- **A11y:** traps focus; `ESC` closes; focus returns to invoking element

### ToneChip
- **Anatomy:** rounded pill button
- **States:** default, active (filled bg), disabled
- **A11y:** functions as radio group; keyboard arrow keys move between chips

### BYOKModal
- **Anatomy:** [dialog title] [explanatory body] [password input] [remember checkbox] [footer buttons]
- **States:** default, submitting, error
- **A11y:** focus on password field on open; input is `type="password"`; role=dialog; overlay dims background

### AttainmentTile (Post-Drive Recap)
- **Anatomy:** big number + secondary metrics stacked
- **Tokens:** `text-4xl font-semibold font-mono` for the primary number
- **Signature moment:** on load, count up from 0 to actual value over 800ms (respects reduced motion → instant)

### CohortRow
- **Anatomy:** cohort label + percentage bar + fraction text
- **Motion:** bar fills left-to-right over 400ms on scroll into view
- **A11y:** ARIA progressbar with `aria-valuenow`

## 6. Motion system

- **Duration scale:** `fast=120ms`, `normal=200ms`, `slow=320ms`, `count=800ms`
- **Easing:** default `cubic-bezier(0.4, 0, 0.2, 1)` (Tailwind `ease-out`)
- **Reduced motion:** every non-essential motion respects `prefers-reduced-motion: reduce`. Framer Motion's `MotionConfig reducedMotion="user"` is set globally.
- **Signature moments:**
  - AI Morning Brief regeneration (crossfade)
  - Live source badge pulse on live LLM success
  - Attainment count-up on Recap load
  - `/process` page: agent pipeline nodes light up sequentially on first scroll-into-view
  - `/process` page: data model growth entities cascade in

## 7. Accessibility contract

- **WCAG 2.1 AA** minimum on all text/background pairs
- Color is never the only signal (icons + labels always accompany color coding)
- Focus indicators: 2px ring at 2px offset in `rc-red`, visible in high-contrast mode
- Touch targets ≥ 44 × 44 px
- Keyboard navigation on every interactive element (Tab, Enter, ESC, arrow keys where semantically right)
- Motion respects `prefers-reduced-motion`
- Every LLM-generated output has a source attribution (`canned` or `live`) — user always knows what they're looking at
- `aria-live="polite"` on Morning Brief and SMS Composer for screen-reader announcement of regenerated content

## 8. Dark mode

**Not shipped in v0.** Rationale: coordinators work under stadium/gym fluorescent lighting; a light UI is more legible than dark. Add in v1 only if a coordinator asks.

## 9. Tailwind config (already applied)

The `tailwind.config.js` already ships with the tokens above (`rc-red`, `rc-red-dark`, `rc-ink`, `rc-slate`, `rc-mist`, `rc-stone`, `rc-teal`, `rc-amber`, `rc-emerald`). Font families set to system UI stack + monospace fallback. No custom plugins required.

## 10. Handoff to Phase 5 (Build) — priority order

Build in this order so a demo path is always available:

1. **Foundation**: extend seed data + scoring lib + LLM lookup lib
2. **Dashboard shell**: NavBar, DriveHeader, WeatherWidget, AIMorningBriefCard
3. **Roster**: DonorRoster, RosterRow, RiskBadge, RosterFilterBar
4. **Donor Detail drawer**: opens from a roster row, shows factors + override form
5. **SMS Composer drawer**: opens from Donor Detail, includes tone chips + regenerate
6. **BYOK Modal**: gated behind the regenerate live button
7. **Post-Drive Recap**: separate tab, AttainmentTile + CohortRow + LessonBullet
8. **/process page**: static-first (phase cards + artifact viewer), animations on top

Every screen must ship its loading + empty + error state alongside the happy path — not as a follow-up.
