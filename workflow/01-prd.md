# PRD — Blood Drive Coordinator Copilot

**Author:** Test Kitchen (Phase 1 agent, human-reviewed)
**Version:** v3 (see Change Log)
**Status:** Draft — awaiting Phase 2
**Companion artifacts:** `00-opportunity-brief.md`, `01b-assumption-map.md`

## 1. Problem

Blood drive coordinators run donor collection drives at schools, community centers, and workplaces, where a share of scheduled donors don't show up. General healthcare no-show research reports rates averaging ~23% (range 10-42%)¹; Red Cross does not publish drive-level figures, but coordinator anecdote and post-COVID donor-behavior research suggest a similar magnitude for blood drives². Missed appointments compound: no-show donors are 2.5× less likely to schedule another donation³, so a single missed appointment often means a lost donor, not just a missed unit. Coordinators currently manage this by overbooking on intuition; new coordinators (of which there are many post-pandemic) don't yet have that intuition.

## 2. Users

**Primary user: Blood Drive Coordinator.** Red Cross staff or contractor. Runs multiple drives per month across a region, mostly at schools and community sites. Arrives 60-90 min before doors open, sets up the space, greets donors, monitors the roster, packs up, and reports the count. Works from a phone and a laptop. Non-technical but comfortable with modern apps. Cannot use a tool that adds work; will use a tool that shortens morning prep or catches a risk they'd have missed.

**Secondary user: Regional Collections Manager.** Aggregates across many drives, watches which are at risk this week. Not the primary user for v0 but eventually needs a rollup view.

## 3. Solution overview

**Blood Drive Coordinator Copilot** is a lightweight web app that helps a coordinator arrive at their drive knowing which donors are most likely to no-show and what to send them to change that. It replaces a paper roster and a generic SMS blast with a risk-scored roster, a one-glance morning briefing, and a personalized message drafted for each high-risk donor. The coordinator stays in control — every score is explainable, every message is reviewed before sending — but the morning prep goes from ~90 minutes of manual work to ~15 minutes of high-leverage judgment.

## 4. Current-state workflow

1. **Night before.** Coordinator gets the roster via email attachment or CRM print. Reviews on paper. 🩸 *No signal on who is at risk.*
2. **Morning of drive.** Arrives 60-90 min early, sets up the room, re-prints the roster. 🩸 *No forecast of the day's risk (weather, no-show mix).*
3. **Pre-doors.** Sends a generic reminder SMS to the whole roster. 🩸 *Same message to first-timers and 20-year veterans — no personalization, low uplift.*
4. **During drive.** Hands-on with donor screening. Checks phone occasionally. 🩸 *If attendance is running under, scrambles to find walk-ins with no visibility into who's still likely to arrive.*
5. **End of drive.** Packs up. Reports collection count to regional manager. 🩸 *No structured way to learn from what worked and what didn't.*

## 5. Future-state workflow (with the Copilot)

1. **Night before.** Coordinator opens the Copilot and sees a Morning Brief for tomorrow's drive: a 2-sentence summary highlighting the day's biggest risks (e.g., "Rain forecast during the 3pm block; first-timers concentrated in that window").
2. **Morning of drive.** Opens the app on their phone during setup. Roster is sorted by predicted no-show risk with a visible "why" tag on each donor. Decides overbook count with confidence.
3. **Pre-doors.** For each high-risk donor, Copilot has drafted a personalized SMS citing the donor's specific slot and any relevant context. Coordinator reviews, edits, and sends.
4. **During drive.** Glances at Copilot during downtime. If attendance runs under target, Copilot has already flagged which nearby walk-ins to invite from a standby list.
5. **End of drive.** Opens Post-Drive Recap: predicted vs actual, what worked, one-line notes on what to try next time. Insights carry into the next drive.

## 6. Capabilities the product provides

- The coordinator **can see, for each scheduled donor, a predicted no-show risk with the specific reasons that produced it** (e.g., first-time donor + rainy 3pm slot).
- The coordinator **can read a 2-3 sentence Morning Brief** that summarizes the day's biggest risks in plain language.
- The coordinator **can generate a personalized SMS draft for any donor** citing that donor's name, slot, and relevant context — then edit and send.
- The coordinator **can override any risk score with one click and explain why**, so the system learns from their judgment over time.
- The coordinator **can view a Post-Drive Recap** showing predicted vs actual outcomes and one-line lessons per drive.
- A stakeholder **can click through the whole experience without narration** and understand what the coordinator would do.

## 7. Hypotheses to test

- **H1:** Coordinators trust the risk score enough to act on it *only when* the underlying reasons are visible. — measurable via observation + click-through on high-risk donors during pilot. (tests: risk-with-reasons capability)
- **H2:** Personalized SMS reminders to high-risk donors lift *that segment's* attendance vs. matched control. — measurable via A/B on the high-risk cohort during pilot drives. (tests: personalized SMS capability, focused on the segment we can actually influence)
- **H3:** Weather forecast at slot-level is a materially useful signal for no-show prediction (not just noise around a base rate). — measurable via backfill correlation or observed pilot outcomes. (tests: signal quality behind the score)
- **H4:** Coordinators read the Morning Brief before scanning the roster when it's the first thing they see. — measurable via observation. (tests: Morning Brief capability)
- **H5:** Coordinators using the Copilot hit their drive's collection target on a higher share of drives than baseline. — measurable via drive-level target-attainment rate across pilot drives vs. matched historical baseline. (tests: whole product; this is the outcome the coordinator is graded on)

## 8. Success metrics (test-kitchen scope)

We measure the outcome we're trying to move — *hitting drive targets* — not the environmental condition (no-show rate) that varies day to day.

**Primary outcome:**
- **Target Attainment Rate.** Share of pilot drives collecting ≥100% of their assigned unit target. Baseline: matched historical drives at the same sites where available; otherwise a matched-drive control cohort during the pilot period.

**Secondary — behavioral signal on the segment we can influence (tests H2):**
- **High-Risk Attendance Lift.** Attendance rate of high-risk donors who received a Copilot-drafted personalized SMS, versus a matched control cohort (generic SMS or none). Directional read given small pilot n.

**Secondary — trust signal (tests H1):**
- ≥2 of 3 coordinators say the Copilot's risk explanations informed how they set overbook and outreach decisions for the drive.

**Secondary — efficiency:**
- Coordinator morning prep time reduced from ~90 min to ≤30 min.

**Diagnostic (not a KPI):**
- **Overbook accuracy.** |predicted no-show count − actual no-show count| ÷ drive target. Tells us whether the copilot is helping coordinators calibrate their overbook, and where the score is systematically over/under.
- **Environmental no-show rate.** Tracked for context — but explicitly not our success criterion. If the copilot works, target attainment improves *regardless* of the day's no-show rate.

**Adoption gate:**
- ≥3 coordinators complete a pilot drive using the app end-to-end (baseline: 0).

## 9. Out of scope (v0)

- **Multi-drive rollup for regional managers.** Not needed to test H1-H4.
- **Live donor CRM integration.** POC uses synthetic data; live CRM triggers compliance work.
- **Actual SMS sending.** Drafting is the intervention we care about; sending is a separate compliance/telco path.
- **Personalized model per coordinator.** Rule-based scoring is enough to test whether the UX around AI works.
- **Donor-facing features.** Eligibility screening, self-booking, etc. are separate opportunities.
- **Authentication, multi-user, or role-based access.** One seeded coordinator identity.
- **Native mobile app.** Responsive web is enough for the pilot.

## 10. Open questions & decisions to iterate

**Resolved:**
- **Prep-time-focused v0.** SMS drafting happens in the morning; during-drive live features deferred. Reason: A1 (coordinators-check-phone) unverified until pilot; morning prep is a safer bet.

**Open:**
- How should we cite the reason for outreach without appearing to make a medical or personal judgment? *Default: behavioral language only ("we noticed you haven't confirmed yet").*
- What's the escalation path when a donor replies to a Copilot-drafted SMS? *Default: mock inbound / out of scope for v0.*
- How do we visually surface uncertainty in the score? *Default: 3-tier badges (High/Med/Low) plus a "why" panel.*
- Do we need a coordinator "confirm before sending" gate on the SMS composer? *Default: yes; sending is always human-triggered.*

## 11. Risks

- **Product risk — Coordinators bypass the roster.** They may glance only at the Morning Brief and skip the per-donor detail, which is where the personalization value lives. *Mitigation:* measure engagement in pilot; if this holds, re-design the roster to be inside the brief.
- **Signal risk — Wrong weather callout.** A rain-cited SMS that turns out sunny hurts trust more than a generic SMS. *Mitigation:* only cite weather when the forecast confidence is high; degrade gracefully to a generic reminder otherwise.
- **Ethical risk — Disparate outreach.** First-time donors skew younger and more diverse; scoring first-timers as high-risk means more nudges to that cohort. Unchecked, this creates a systematically different experience by demographic. *Mitigation:* input audit before pilot; disaggregate outcomes by cohort; if the gap appears, reweight or drop features.

## Change log

| Version | Date | Change | Reason |
|---------|------|--------|--------|
| v1 | 2026-07-06 | Initial draft | Seeded from `00-opportunity-brief.md` |
| v2 | 2026-07-06 | Restructured to solution-forward (§3), current/future state workflows (§4-§5), capability language (§6); softened no-show sourcing with citations; removed implementation details (LLM strategy, hosting choices — moved to Phase 2); added `[Resolved]` sub-list in §10 | Reviewer feedback: PRD should be capability-forward and behavior-only; PRD is a living artifact, not a blueprint |
| v3 | 2026-07-06 | Reframed success metrics around Target Attainment (the outcome coordinators are graded on) rather than no-show rate (the environment). Added H5 (target attainment). Refined H2 to focus on the high-risk cohort (the segment the copilot can influence). Moved no-show rate to Diagnostic. | Reviewer feedback: "no-show rate isn't ours to control — measure how well we compensated for it." Agent also updated with a new operating principle: measure the goal, not the environment. |

## PM notes for the reviewer

- The Morning Brief is currently the load-bearing capability for demo — if H4 fails in the pilot, we'd rebuild v1 around the roster-first pattern instead. Worth flagging in the interview close.
- I moved anything that named a specific technology (models, hosting, prompt strategy) out of the PRD into Phase 2, where it belongs. This makes the PRD portable across implementation choices — if a v1 build wants to try a different model or a different platform, the PRD still holds.
- Kept the Sirdifield 2.5× retention citation prominent in §1 because it's the strongest lever for "why does this matter beyond one drive."
- On metrics: worth calling out in the interview that we're measuring "did the coordinator hit target *despite* no-shows," not "did no-shows go down." Any interviewer with ops instincts will notice the distinction and it's a signal that the PM understands what their user is graded on.

---

**Footnotes**

1. [Evaluation of no-show rate in outpatient clinics — systematic review, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11231932/) — reports ~23% average, 10-42% range across healthcare settings.
2. [Using automation to manage donor engagement during COVID-19, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8897834/) — documents pandemic-era donor participation drops and drive-cancellation drivers.
3. [Sirdifield et al., "Poor appointment-keeping behaviour among repeat blood donors," 2013 (PubMed)](https://pubmed.ncbi.nlm.nih.gov/25040890/) — no-show donors are 2.5× less likely to schedule again.
