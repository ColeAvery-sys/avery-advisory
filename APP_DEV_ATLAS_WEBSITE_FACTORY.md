# ATLAS Website Factory

This packet turns ATLAS, Codex, Cursor, and Vercel into a repeatable website-building workflow for AveryTech and Avery Industries LLC.

## Operating Model

- ATLAS = planner and product manager.
- Codex = builder, bug fixer, repo question answerer, and PR-style change maker.
- Cursor = live workshop for inspecting, steering, visual polish, and product judgment.
- Vercel = publish and preview path for websites.

## Website Factory Pipeline

```txt
Idea -> ATLAS Website Brief -> Codex First Build -> Cursor Polish -> Vercel Preview -> Human Approval -> Publish -> ATLAS logs improvements
```

## Default Stack

- Next.js
- TypeScript
- Tailwind CSS
- App Router
- Vercel-ready deployment
- No backend unless explicitly requested
- No auth yet
- No payments yet
- No database yet
- Placeholder form handlers first

## Core Product Philosophy

The websites are for a founder-led tech, media, service, and disability-aid company.

They should feel:

- Ethical tech company
- Founder-led startup
- Clean but cinematic
- Accessible
- Slightly mythic where appropriate
- Practical enough to sell services
- Not generic SaaS filler
- Not fake corporate
- Not chaotic

## Primary Brand Entities

1. AveryTech: disability-aid, ethical automation, apps, and technology company.
2. ATLAS HQ: internal operating system and automation command center for Avery Industries LLC.
3. ATLAS Creator Logistics: content infrastructure division for editing, clips, creator logistics, and media operations.
4. Bare Minimum Journal: easy journaling app for executive dysfunction. Tagline: "A journal for when journaling is too much."
5. The New Prometheus: founder philosophy, technology, politics, ethics, and mythology channel.

## Recommended Code Structure

```txt
/src
  /app
    /(marketing)
      /page.tsx
      /averytech/page.tsx
      /creator-logistics/page.tsx
      /bare-minimum-journal/page.tsx
      /new-prometheus/page.tsx
      /portfolio/page.tsx
      /contact/page.tsx
      /privacy/page.tsx
  /components
    /layout
      Header.tsx
      Footer.tsx
      PageShell.tsx
    /sections
      HeroSection.tsx
      ProblemSolutionSection.tsx
      FeatureGrid.tsx
      CTASection.tsx
      FAQSection.tsx
      PricingSection.tsx
      ServicePackages.tsx
      ProjectShowcase.tsx
      FounderNote.tsx
      IntakePreview.tsx
    /ui
      Button.tsx
      Card.tsx
      Badge.tsx
      SectionLabel.tsx
  /content
    brands.ts
    pages.ts
    services.ts
    faqs.ts
    projects.ts
  /lib
    site.ts
    utils.ts
```

## Build Requirements

1. Professional homepage for ATLAS Website Factory.
2. Landing page for AveryTech.
3. Landing page for ATLAS Creator Logistics.
4. Landing page for Bare Minimum Journal.
5. Landing page for The New Prometheus.
6. Contact/intake page with placeholder form.
7. Privacy page with basic placeholder language.
8. Responsive layouts for all pages.
9. Reusable content objects where possible.
10. Simple Tailwind styling.
11. Comments where future integrations go.

## Global Navigation

- AveryTech
- Creator Logistics
- Bare Minimum Journal
- New Prometheus
- Portfolio
- Contact

Global CTA: `Start a Project`

## Priority Websites

| Priority | Website | Purpose |
| ---: | --- | --- |
| 1 | ATLAS Creator Logistics / Editing Services | Fast revenue |
| 2 | AveryTech main site | Company legitimacy |
| 3 | Bare Minimum Journal waitlist | Disability app validation |
| 4 | The New Prometheus page | Founder PR campaign |
| 5 | Grant/project portfolio page | Credibility |
| 6 | Case study pages | Trust |
| 7 | Simple client intake portal | Lead automation |

## Page Briefs

### AveryTech

Goal: make AveryTech look like a real ethical technology company focused on disability aid, automation, apps, and accessible tools.

Hero headline: `Building technology that gives people more room to breathe.`

Subheadline: `AveryTech creates disability-aid tools, ethical automation systems, and human-centered apps for people who are tired of software that treats overwhelm like a personal failure.`

Primary CTA: `View Projects`

Secondary CTA: `Start a Conversation`

Sections:

- Problem: most tools are built for people who already have energy, clarity, and executive function.
- Solution: AveryTech builds tools that reduce friction instead of adding pressure.
- Focus areas: disability-aid apps, executive dysfunction tools, ethical automation, creator/business systems, assistive technology experiments.
- Founder note.
- Project cards.
- CTA.

### ATLAS Creator Logistics

Goal: sell content editing and creator logistics services.

Hero headline: `Content infrastructure for creators who are drowning in footage.`

Subheadline: `We help creators turn raw ideas, streams, long-form videos, and scattered assets into organized, edited, reusable content systems.`

Primary CTA: `Request a Creator Logistics Packet`

Services:

- Long-form video editing coordination
- Short-form clip packaging
- Timestamp and highlight organization
- Content calendar support
- Asset organization
- Caption and title suggestions
- Weekly delivery workflow
- Outsourced editing coordination

Disclaimer: `ATLAS Creator Logistics may use a blended workflow of human editors, internal systems, and approved AI-assisted organization tools. Final creative direction remains human-led.`

Package cards:

- Starter Cleanup
- Weekly Clip Engine
- Full Creator Logistics
- Custom Media Ops

Use `Quote-based` instead of exact prices until Cole approves pricing.

### Bare Minimum Journal

Goal: waitlist landing page for the executive dysfunction journaling app.

Hero headline: `A journal for when journaling is too much.`

Subheadline: `Bare Minimum Journal is a shame-free check-in app for low-energy days, executive dysfunction, burnout, and overloaded brains.`

Primary CTA: `Join the Waitlist`

Sections:

- Problem: traditional journaling asks too much.
- Solution: one tiny prompt. One word counts.
- Features: one-tap check-ins, Low Battery Mode, Brain Dump, Make It Smaller, shame-free history, voice journaling planned.
- Safety note: `This app is not therapy, diagnosis, or emergency support. It is a self-reflection and accessibility tool.`
- Waitlist placeholder form.

### The New Prometheus

Goal: founder/philosophy/media channel landing page.

Hero headline: `Fire, technology, rebellion, and the ethics of building the future.`

Subheadline: `The New Prometheus is Cole Avery's philosophy and technology media project about invention, power, disability, labor, mythology, and building tools that serve people instead of consuming them.`

Primary CTA: `Explore the Channel`

Sections:

- Themes: Greek myth and technology, leftist tech ethics, disability and dignity, automation and labor, founder philosophy, anti-burnout creativity.
- Featured essay placeholders.
- Newsletter placeholder.
- CTA.

### Portfolio

Goal: show projects without pretending they are all finished.

Use status badges:

- Concept
- MVP
- In development
- Service
- Research
- Future build

Project cards:

- Bare Minimum Journal
- ATLAS Creator Logistics
- Jax Mission Control
- Aphantasia VR Experience
- Creator Logistics Packet
- ATLAS Intake System
- The New Prometheus
- Disability-aid automation research

### Contact

Fields:

- Name
- Email
- Project type
- Budget range
- Timeline
- What do you need help with?

For now, prevent actual submission and show: `Form backend not connected yet.`

## Master Codex Prompt

```txt
PROJECT: ATLAS Website Factory

Build a reusable website factory system for AveryTech / ATLAS HQ.

Use:
- Next.js
- TypeScript
- Tailwind CSS
- App Router
- Vercel-ready deployment
- No backend yet unless explicitly requested
- No authentication
- No payment system
- No database
- Placeholder form handlers

Build pages:
1. Home
2. AveryTech
3. ATLAS Creator Logistics
4. Bare Minimum Journal
5. The New Prometheus
6. Portfolio
7. Contact
8. Privacy

Build reusable:
- Header
- Footer
- PageShell
- HeroSection
- ProblemSolutionSection
- FeatureGrid
- CTASection
- FAQSection
- PricingSection
- ServicePackages
- ProjectShowcase
- FounderNote
- IntakePreview
- Button
- Card
- Badge
- SectionLabel
- Content data files

Rules:
- Mobile-first
- Accessible
- Clean component structure
- Strong conversion copy
- No fake claims
- No medical claims
- No legal promises
- No backend unless asked
- No payments unless asked
- No auth unless asked
- Use placeholder images/assets
- Make it easy to replace copy later
- Add comments where future backend/API/automation hooks would go

Quality check:
- Run npm run lint if available
- Run npm run build
- Fix errors

Deliver:
1. Working site
2. Clear file structure
3. Reusable components
4. Basic README with how to run locally
5. Notes on what to improve next
```

## Review And Polish Prompt

```txt
Review the ATLAS Website Factory codebase.

Act as:
1. Senior frontend engineer
2. Conversion-focused landing page designer
3. Accessibility reviewer
4. Startup product manager

Check for:
- Broken routes
- Bad mobile layout
- Repeated copy that should be content-driven
- Components that are too specific
- Weak CTAs
- Accessibility issues
- Poor contrast
- Too many words on mobile
- Missing README instructions
- Any fake or legally risky claims

Then implement the top 10 improvements.

Rules:
- Keep the site simple.
- Do not add backend.
- Do not add authentication.
- Do not add payment.
- Do not add external services.
- Do not add complicated animations.
- Do not delete the brand pages.
- Make the design feel more premium and less template-like.
```

## Website Brief Generator Prompt

```txt
FEATURE: Website Brief Generator Template

Add a /brief-template page to the ATLAS Website Factory.

Purpose:
This page should show the internal template AveryTech/ATLAS uses before building any new website.

Include sections:
1. Project Name
2. Website Type
3. Business Goal
4. Target Audience
5. Main Offer
6. Primary CTA
7. Pages Needed
8. Brand Vibe
9. Required Sections
10. Assets Available
11. Things to Avoid
12. Future Integrations
13. Launch Checklist

Also create:
/docs/website-brief-template.md

The markdown file should be copy/paste friendly for future Codex prompts.

Add link to this page in the footer under "Internal Tools."

No backend needed.
```

## Launch Checklist Prompt

```txt
FEATURE: Website Launch Checklist

Add a /launch-checklist page and /docs/launch-checklist.md.

Checklist should include:

PRE-LAUNCH:
- Check mobile layout
- Check desktop layout
- Check all links
- Check CTAs
- Check spelling
- Check contact form status
- Check privacy page
- Check disclaimers
- Check accessibility contrast
- Check page titles
- Check meta descriptions
- Check Open Graph preview placeholders
- Check favicon placeholder
- Check no fake claims
- Check no real client claims unless verified

VERCEL:
- Connect GitHub repo
- Import project into Vercel
- Confirm build command
- Confirm environment variables if any
- Deploy preview
- Review preview URL
- Connect custom domain later

POST-LAUNCH:
- Add analytics
- Submit sitemap later
- Create first social post
- Add website to grant/company documents
- Capture screenshots for portfolio
- Add improvements to backlog

Make the checklist visually clean on the page.
```

## Basic SEO Metadata Prompt

```txt
FEATURE: Basic SEO Metadata

Add metadata for each major page using Next.js App Router metadata.

Pages:
- Home
- AveryTech
- Creator Logistics
- Bare Minimum Journal
- The New Prometheus
- Portfolio
- Contact
- Privacy

Each page should have:
- title
- description
- Open Graph title
- Open Graph description

Use honest descriptions.
No fake claims.
No medical or legal promises.
```

## Future Automation Hooks Prompt

```txt
FEATURE: Future Automation Hooks

Add a /docs/automation-hooks.md file.

Document future integrations for:
1. Contact form to email
2. Contact form to Google Sheet
3. Contact form to Make.com webhook
4. Waitlist form to email list
5. Project intake to ATLAS Intake server
6. Creator Logistics lead to CRM
7. Bare Minimum Journal waitlist to product database
8. Portfolio updates from content file
9. Blog/CMS integration later

Add code comments in the contact form and waitlist form showing where webhook calls would go later.

Do not connect real webhooks yet.
Do not add secrets.
Do not add environment variables yet unless required for placeholders.
```

## Cursor Polish Prompt

```txt
You are now the visual/product polish layer for ATLAS Website Factory.

Review the full website locally.

Focus on:
1. Does this look like a real company?
2. Does it feel premium enough for AveryTech?
3. Does Creator Logistics clearly sell a service?
4. Does Bare Minimum Journal feel gentle and accessible?
5. Does The New Prometheus feel mythic, philosophical, and tech-forward?
6. Is the mobile layout clean?
7. Are CTAs obvious?
8. Is there too much text?
9. Are there sections that feel generic?
10. Is anything legally risky or overpromising?

Make a prioritized improvement plan first.
Then implement the top fixes.

Do not add backend.
Do not add payments.
Do not add auth.
Do not add complicated animation libraries.
```

## Local Command Checklist

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

Before publishing:

```bash
npm run build
```

Then push to GitHub and connect to Vercel.

## Future Website Folder Template

```txt
/project-name
  /brief
    website-brief.md
    brand-voice.md
    offer.md
    target-audience.md
  /copy
    homepage-copy.md
    about-copy.md
    faq.md
  /design
    colors.md
    layout-notes.md
    image-prompts.md
  /build
    codex-prompt.md
    cursor-polish-prompt.md
    qa-checklist.md
  /launch
    vercel-checklist.md
    seo-checklist.md
    analytics-checklist.md
```

## Repo Strategy

For now, separate repos are recommended:

```txt
averytech-site
atlas-creator-logistics
bare-minimum-journal
new-prometheus
```

Separate repos are easier for Codex/Cursor to understand, easier to deploy, and less likely to become a chaotic monorepo.

Recommended first build: `atlas-creator-logistics`, because it is the fastest cash path.

