# Assumption Map — Blood Drive Coordinator Copilot

**Author:** Test Kitchen (Phase 1.5 agent, human-reviewed)
**Upstream:** `01-prd.md`
**Downstream:** `02-system-design.md` will focus its risk section on the top 3-5 assumptions here.

## The assumption stack

| # | Assumption | Category | Importance | Evidence | Priority | Cheapest test |
|---|-----------|----------|------------|----------|----------|---------------|
| A1 | Coordinators check their phone during downtime between appointments | U | H | W | ⚠️ Test immediately | 20-min call with 3 active coordinators |
| A2 | An AI-generated risk score is trustworthy if the underlying factors are visible | V | H | W | ⚠️ Test immediately | Prototype the tooltip; show to 3 coordinators; measure "would you act on this?" |
| A3 | Personalized SMS ("Hi Sarah, we're expecting rain at your 3pm slot") outperforms generic reminders by ≥5pp | V | H | M | ⚠️ Test soon | A/B test during 4 pilot drives (existing test-kitchen tooling) |
| A4 | Weather forecast at slot-level materially predicts no-shows (not just noise around a base rate) | F | H | W | ⚠️ Test immediately | Backfill 6 months of past drive data + NWS forecast; run correlation |
| A5 | Coordinators can act on the morning brief (2-3 sentences) faster than scanning a raw roster | V | M | W | Test after top risks | Time-boxed observation during 2 drives |
| A6 | Rule-based scoring is credible enough to defend without ML | V | H | M | ⚠️ Test soon | Show scoring to 3 coordinators; measure trust vs. black-box baseline |
| A7 | Coordinators will trust a "why this score" tooltip over accepting a black-box number | V | M | W | Test after top risks | Same tooltip test as A2 with A/B on visible-factors vs. score-only |
| A8 | NWS API is fast and reliable enough for on-drive use (not just morning prep) | F | M | M | Watch | Log latency in pilot; degrade gracefully at 60% forecast confidence |
| A9 | Random-user seed roster is credible enough to demo without real CRM data | F | L | M | Ignore for now | Not a real-world risk; POC constraint |
| A10 | Coordinators don't need to send SMS *from* the app (drafting-only is enough for v0) | V | M | W | Test after top risks | Same interviews as A1; ask explicitly |
| A11 | LLM cost stays under $1/drive at 100 donors + Sonnet-class model with prompt caching | F | M | M | Watch | Instrument POC with token counting; verify math |
| A12 | Red Cross legal will not require HIPAA compliance for a synthetic-data POC | B | H | S | ✅ Monitor | Already confirmed in JD ("test kitchen" language + POC scope) |
| A13 | Coordinators do NOT need a native mobile app for a v0 (responsive web is enough for pilot) | U | M | W | Test after top risks | Ask coordinators about phone browser habits in same interviews |
| A14 | This copilot doesn't create disparate outreach across donor demographics | B | H | W | ⚠️ Test soon | Feature-audit scoring inputs; pilot metrics disaggregated by donor cohort |
| A15 | Coordinators will record notes on specific donors when they override the risk score (i.e., the learning-loop UI actually gets used) | U | M | W | Test after top risks | Include an override + note affordance in prototype; observe coordinators in 2 pilot drives |
| A16 | When coordinators override the risk score, their override is directionally correct — i.e., a useful learning signal, not noise | V | H | W | ⚠️ Test soon | Compare CoordinatorOverride outcomes vs. actual DriveOutcome across 4 pilot drives |

## Top 5 riskiest (test immediately)

These are the assumptions where a wrong answer kills the product.

### A2: An AI-generated risk score is trustworthy if the underlying factors are visible
- **Riskiest version:** Even when factors are visible, coordinators still won't trust a machine-generated number — they'll override every score based on their own reading of the room, making the tool decorative.
- **Cheapest experiment:** Wireframe the "why this score" tooltip; show 3 coordinators. Ask "would you send this SMS based on this score?" Watch what they actually click.
- **Validated looks like:** ≥2 of 3 coordinators say the visible factors change their decision; they click "draft SMS" from within the tooltip context.
- **Invalidated looks like:** Coordinators dismiss the score, ask "do you have the coordinator's notes from last time?" The product needs to pivot toward *augmenting* existing coordinator intuition, not producing predictions.

### A4: Weather forecast at slot-level materially predicts no-shows
- **Riskiest version:** Weather explains <1 percentage point of no-show variance; it's noise. If we're citing it in SMS, we're citing noise as signal.
- **Cheapest experiment:** Pull 6 months of past drive attendance data (if available) and compare to NWS historical forecast. Run a simple correlation.
- **Validated looks like:** Weather explains ≥3 points of no-show variance at slot granularity.
- **Invalidated looks like:** Drop weather from SMS drafts; keep in dashboard as ambient context only. Reduces the "AI feels helpful" surface but preserves integrity.

### A1: Coordinators check their phone during downtime between appointments
- **Riskiest version:** Coordinators are heads-down on donor screening the entire drive; the phone stays in a bag. Real-time in-drive features would go unused.
- **Cheapest experiment:** Three 20-minute calls with active coordinators. Ask: "walk me through the last drive you ran — when did you look at your phone?"
- **Validated looks like:** ≥2 of 3 describe checking their phone at least 3-4 times during a drive.
- **Invalidated looks like:** Refocus v0 on *morning prep* only; drop post-drive real-time features.

### A14: This copilot doesn't create disparate outreach across donor demographics
- **Riskiest version:** First-time donors skew younger/more diverse; scoring them as high-risk means we spam them with reminders while giving frequent donors (older/whiter cohort) a lighter touch. Systematically worse experience for underrepresented donors.
- **Cheapest experiment:** Feature-audit the scoring inputs before pilot. In pilot, disaggregate show-up-rate uplift by donor cohort.
- **Validated looks like:** Uplift is consistent (±2pp) across demographic cohorts.
- **Invalidated looks like:** Adjust scoring to weight recent behavior over "first-time" flag; or drop first-time as a feature and use only behavioral factors.

### A3: Personalized SMS beats generic by ≥5pp
- **Riskiest version:** Personalization plateaus around 1-2pp; the effort of personalization isn't justified.
- **Cheapest experiment:** A/B during 4 pilot drives. Test-kitchen has enough donor volume to see a directional signal.
- **Validated looks like:** ≥3pp lift observed across ≥2 drives.
- **Invalidated looks like:** Kill the SMS composer; refocus on the morning brief and overbook recommendation.

### A16: Coordinator overrides are directionally correct
- **Riskiest version:** Coordinators override the score based on stale intuition or bias; their overrides are no better than the model. If we then feed those overrides back as training signal, we make the copilot worse over time — a doom loop.
- **Cheapest experiment:** In 4 pilot drives, log every CoordinatorOverride and compare against actual DriveOutcome. Compute agreement rate.
- **Validated looks like:** Overrides agree with actual outcome ≥65% of the time (better than model baseline). Signal is worth feeding back.
- **Invalidated looks like:** Overrides don't beat the model. Keep overrides for the coordinator's UX (they still need agency) but do NOT feed them back as training signal. Rethink the learning loop story.

## Assumptions we're comfortable with (strong evidence)

- **A12:** Test-kitchen POC does not trigger HIPAA (already scoped in JD)

## Assumptions we should surface with a stakeholder

- **A11 (LLM cost):** Confirm with Innovation leadership that <$1/drive is the right ceiling. If they'd tolerate $5/drive we can lean on live LLM more.
- **A13 (mobile):** If the field team wants iOS app, the roadmap changes materially. Worth surfacing early.
- **A10 (sending SMS from app):** If coordinators actually want send-from-app in v0, that unlocks compliance and telco relationships that dilute the POC.
