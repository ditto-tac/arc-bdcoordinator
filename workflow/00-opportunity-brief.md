# Opportunity Brief — Blood Drive Coordinator Copilot

**Author:** Leslie (PM, Test Kitchen)
**Status:** Seed input for Phase 1
**Date:** 2026-07-06

## The opportunity

Blood drive coordinators run collection drives at high schools, community centers, and workplaces — 50-150 donor appointments per drive, often only 1-2 coordinators on site. When ~20% of scheduled donors don't show up, the drive misses its collection target. Missing target means missing units of blood entering the supply chain for hospitals.

Coordinators currently manage this by "overbooking" — accepting more appointments than slots, hoping the no-show rate absorbs the surplus. This is guesswork. Some drives get slammed with walk-ins on top of full attendance; others sit half-empty when the no-show rate spikes (bad weather, first-timer-heavy roster, competing local events).

Coordinators have no tool that combines:
- Who's scheduled and what we know about their likelihood to show
- What's happening today that could shift no-show rate (weather, day of week, drive location context)
- What to send to which donors *this morning* to nudge attendance without spamming

They rely on tribal knowledge, a paper roster, and manual SMS blasts. This is a place where a light AI copilot could compress a coordinator's morning prep from ~90 min to ~15 min, and lift attendance ~3-5 percentage points across a drive.

## Who feels this

Primary: **Blood Drive Coordinator** — Red Cross staff or contractor, often responsible for 3-8 drives per month across a region. Field-based. Works out of a laptop and phone in gymnasiums, church basements, and mobile units. Non-technical but comfortable with modern apps.

Secondary: **Regional Collections Manager** — tracks aggregate targets across ~20-40 drives per month; wants to know which drives are at risk this week.

## Why now

Two shifts:
1. **AI is finally cheap enough** to run personalized reasoning per donor at scale (Claude Haiku/Sonnet class models under a cent per interaction with caching).
2. **Coordinator turnover has been high post-pandemic** — new coordinators lose the tribal-knowledge advantage that experienced coordinators had. A copilot levels them up.

## What we already know

- Public no-show rates for blood drives range 15-25% (industry estimate; needs sourcing)
- Weather is a documented driver of collection outcomes at outdoor and mobile drives
- Personalized reminders (name, appointment time, location) outperform generic blasts (marketing standard)
- Red Cross's Biomedical Services team is actively investing in the Innovation "test kitchen" model

## What we don't know

- Do coordinators actually check a screen during the drive, or are they hands-on-donors the whole time?
- What's the current state of donor CRM data (Hemasphere, other)? Do we have per-donor attendance history?
- Will coordinators trust an AI-generated risk score, or do they need to see the underlying reasoning?
- How do coordinators currently handle inbound texts from donors (cancellations, questions)?

## Constraints

- **Test kitchen budget:** 1 PM (Leslie), 1-2 engineers, ~2 weeks to a first working prototype
- **Deployment:** must be lightweight — no new backend infra; static site OK for v0
- **Data:** no live donor CRM access for v0 — use realistic synthetic data
- **Compliance:** no PHI in this POC; anything real would need HIPAA-safe pipes
- **Field context:** must work on a phone browser (coordinators are mobile)
- **Cost:** LLM cost per drive should be under $1

## What "successful test-kitchen POC" looks like

- A drive coordinator can open the app on their phone the morning of a drive, see the roster with a risk score per donor, get an AI-drafted personalized SMS reminder for each high-risk donor, and understand the "why" behind the score.
- Interactive enough that a stakeholder can click through it end-to-end without narration.
- Clean enough that the Innovation team can imagine extending the same pattern to donor eligibility screening, supply forecasting, or adverse-reaction intake.

## Handoff to Phase 1 (PRD)

The PRD agent should turn this into a structured PRD with concrete hypotheses, in-scope/out-of-scope calls, and measurable POC success criteria. It should push back on any assumptions above that feel weakly supported.
