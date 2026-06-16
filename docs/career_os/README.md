# ATLAS Career OS

Local Career OS for Avery Industries LLC.

## What It Does

- Stores a master career profile for Cole Ends.
- Generates LinkedIn rewrite packages by target role.
- Generates ATS resume markdown.
- Generates interview prep markdown.
- Produces copy-paste ready headline, about, experience, skills, and featured text.
- Keeps LinkedIn automation review-only and approval-gated.
- Includes an optional Playwright review helper at `scripts/career_os_linkedin_playwright.mjs`.

## Run

```bash
npm run career:os
```

Open:

```text
http://localhost:8799/
```

## Data

The source of truth is stored at:

```text
atlas_ops/logs/career_os_master.json
```

## Validation Checklist

1. Confirm the dashboard loads without errors.
2. Switch between target roles and verify the outputs change.
3. Save a profile edit and confirm it persists after refresh.
4. Confirm the LinkedIn automation plan remains review-only.
5. Copy the generated text into a draft document and verify formatting.

## Release Rule

Do not auto-submit LinkedIn changes. Review manually first and use explicit approval before any external action.
