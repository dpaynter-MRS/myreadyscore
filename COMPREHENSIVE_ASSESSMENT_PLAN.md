# Comprehensive Assessment rollout

## Phase 1 — implemented

- Preserve the existing nine-question Quick Ready Score and lead funnel.
- Keep the comprehensive assessment free during validation and unlock it immediately after email capture.
- Cover 72 questions across 12 equal-weight readiness categories.
- Skip non-applicable dependent, pet, and powered-medical-equipment questions.
- Save progress and results in the browser so users can pause and resume.
- Generate a personalized, prioritized roadmap and print-ready report.
- Keep detailed household answers on the device; D1 continues to store only lead and quick-score data.

## Scoring model

- Confirmed answer values: complete/tested 100, mostly 70, partly 35, not yet 0.
- “Not sure” is excluded from the readiness calculation and reported separately through an answer-confidence percentage and verification tasks.
- Presence/eligibility questions do not affect the score.
- Each category score is the mean of its applicable scored questions.
- The overall score is the mean of the 12 applicable category scores, preventing categories with more conditional questions from dominating.
- Roadmap priority combines gap size with safety impact. Timing then groups actions into Fix first, Build this month, and Strengthen next.
- Reports record assessment, scoring-method, and content-review versions.
- Category-level evidence links point to reviewed FEMA/Ready.gov, CDC, NWS, USFA, and CISA guidance.

## Phase 2 — recommended after funnel validation

- Add an authenticated resume link and encrypted server-side progress synchronization.
- Add report email delivery and optional PDF generation.
- Add local-hazard personalization using ZIP/region with explicit consent.
- Add analytics for category completion and drop-off without recording sensitive answers.
- Add content review by emergency-management, medical, disability-access, and animal-care subject-matter experts.

## Phase 3 — productization

- Household accounts with shared progress and annual reassessment.
- Task completion that increases the score over time.
- Maintenance reminders for expiring supplies, drills, and document reviews.
- Paid plan options, household member roles, and richer report history.

## Product decisions still open

1. Whether server-side household-answer storage is desirable; this changes privacy, authentication, deletion, and security requirements.
2. Whether recommendations remain product/affiliate-led or shift toward a broader task-first plan.

## Current product decision

The comprehensive assessment is free during the validation phase. There is no payment or subscription gate. Monetization will be reconsidered only after completion, engagement, and user-feedback data establish demand.
