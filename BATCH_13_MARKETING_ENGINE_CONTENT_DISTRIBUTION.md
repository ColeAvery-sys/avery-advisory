# Batch 13: Marketing Engine and Content Distribution System

ATLAS Batch 13 adds local backend logic for marketing planning, content drafting, campaign structure, YouTube workflows, short-form content, New Prometheus channel planning, Creator Logistics promotion, thought leadership, SEO planning, and marketing analytics.

## Core Rule

ATLAS can draft, organize, recommend, prepare, and track marketing work.

ATLAS cannot publish public content automatically. Every public post, campaign, upload package, SEO draft, PR statement, or sensitive claim requires Cole approval before it goes live.

## Modules

- `marketingCommandEngine.ts`: weekly marketing plan, priorities, Cole review queue, and marketing tasks.
- `campaignPlannerEngine.ts`: campaign records, strategy, content pillars, CTAs, and 30-day plans.
- `contentCalendarEngine.ts`: public content records, approval gating, high-review flags, and manual publish marking.
- `creatorLogisticsPromoEngine.ts`: Creator Logistics sales posts, pain points, promo batches, and package comparison content.
- `youtubePipelineEngine.ts`: long-form video planning, hooks, titles, thumbnails, upload packages, and shorts extraction.
- `shortFormClipEngine.ts`: short-form clip ideas, batches, hooks, captions, visual directions, and approval items.
- `newPrometheusChannelEngine.ts`: New Prometheus video ideas, essay outlines, cold opens, thumbnails, shorts, and calendar items.
- `thoughtLeadershipEngine.ts`: AveryTech posts, blogs, newsletters, founder updates, PR statements, and claim validation.
- `seoArticlePlannerEngine.ts`: keyword ideas, article plans, outlines, metadata, internal links, and SEO claim checks.
- `marketingAnalyticsEngine.ts`: marketing events, campaign performance, weak campaign detection, attribution, and reports.

## Safety Rules

1. ATLAS can draft content, campaigns, scripts, captions, emails, and SEO plans.
2. ATLAS cannot publish anything automatically.
3. Every public post requires Cole approval.
4. Client claims require evidence and permission.
5. Testimonials require permission and approval.
6. Disability-related claims must avoid medical promises.
7. Creator Logistics content cannot guarantee growth.
8. Grant or funding content cannot imply guaranteed funding.
9. Political content should be reviewed before publishing.
10. Content involving legal, financial, medical, client, grant, disability, political, or personal matters gets high-review status.
11. Every campaign should connect to a landing page, offer, or strategic goal.
12. Marketing analytics should be honest and should not over-credit weak evidence.

## What This Unlocks

ATLAS can now prepare a weekly marketing plan, draft Creator Logistics promos, create New Prometheus ideas, build YouTube upload packages, generate short-form batches, plan SEO articles, track campaign events, and keep all public content waiting for Cole approval.
