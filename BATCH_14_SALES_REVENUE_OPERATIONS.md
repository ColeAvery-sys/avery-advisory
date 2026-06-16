# Batch 14: Sales System and Revenue Operations

ATLAS Batch 14 adds local backend logic for converting attention into qualified leads, draft proposals, quote recommendations, sales call preparation, follow-up planning, and revenue forecasts.

## Core Rule

ATLAS can qualify, score, draft, recommend, prepare, and track deals.

ATLAS cannot close deals, promise final pricing, send contracts, request payment, or contact people without Cole approval.

## Modules

- `salesCommandEngine.ts`: sales plans, hot leads, follow-ups due, stuck deals, recommendations, and sales tasks.
- `leadScoringEngine.ts`: lead score, quality label, recommended offer, risk flags, and next best action.
- `dealPipelineEngine.ts`: local deal records, stages, follow-ups, weighted probability, and approved win marking.
- `pricingCalculatorEngine.ts`: quote ranges, package recommendation, rush fee, margin estimate, and scope warnings.
- `proposalBuilderEngine.ts`: proposal drafts, claim validation, approval handling, checklist, and Markdown export.
- `salesScriptEngine.ts`: discovery, outreach, follow-up, partner call scripts, close questions, and SOP saving.
- `objectionHandlingEngine.ts`: objection records, draft responses, proof attachment, risk flags, and winning response tracking.
- `followUpSequenceEngine.ts`: draft-only follow-up sequences, next follow-up lookup, manual sent marking, and stop rules.
- `salesCallPrepEngine.ts`: call brief, qualification questions, offer recommendation, red flags, and follow-up draft.
- `revenueForecastEngine.ts`: confirmed revenue, weighted pipeline, grants, speculative opportunities, overdue invoices, and scenarios.

## Safety Rules

1. ATLAS can score leads, prepare scripts, draft proposals, calculate quotes, and recommend next actions.
2. ATLAS cannot automatically contact leads.
3. ATLAS cannot automatically accept clients.
4. ATLAS cannot automatically close deals.
5. ATLAS cannot promise final pricing without Cole approval.
6. ATLAS cannot send contracts automatically.
7. ATLAS cannot request payment automatically.
8. ATLAS cannot guarantee creator growth, funding, sales results, or medical outcomes.
9. Every client-facing proposal, quote, script, follow-up, or close message requires Cole approval.
10. Pricing discounts require Cole approval.
11. Grants, speculative opportunities, and confirmed revenue must stay separate.
12. Revenue forecasts show conservative numbers first.

## What This Unlocks

ATLAS can now identify hot leads, prepare approved sales actions, draft proposals and quotes, build follow-up sequences, prepare Cole for sales calls, and forecast revenue without treating speculative opportunities as real money.
