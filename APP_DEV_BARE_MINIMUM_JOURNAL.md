# App Dev Side Quest: Bare Minimum Journal

This is a small app-development packet for a future standalone MVP. It should stay separate from the main ATLAS HQ batch plan.

## Project

Bare Minimum Journal / Easy Journaling App for Executive Dysfunction

## Goal

Build a simple mobile-first web app MVP for a shame-free journaling tool made for executive dysfunction, ADHD, burnout, overwhelm, and low-energy days.

## Philosophy

This is not a productivity app.

This is not therapy.

This app should reduce friction, shame, and decision fatigue.

Core message:

```txt
One word counts.
```

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- `localStorage` for the first MVP

No backend, auth, payments, complex dashboard, AI API calls, notifications, medical claims, or diagnosis features in the first version.

## App Name

Bare Minimum Journal

## Tagline

A journal for when journaling is too much.

## Core Screens

1. Home
2. Check In
3. Brain Dump
4. Make It Smaller
5. History
6. Settings

## Home

Show:

- Title: `Bare Minimum Journal`
- Subtitle: `One word counts.`
- Buttons: `Check In`, `Dump It`, `Make It Smaller`, `History`
- Comfort line: `Anything you manage to write counts.`

## Check In

Show one random prompt from a prompt bank.

Example prompts:

- What is one thing in your head right now?
- What feels too loud today?
- What would make today 5% easier?
- What emotion is driving the bus?
- What is the smallest next step?
- What do you wish someone understood?
- What does your body need?
- What are you avoiding?
- What is one tiny win?

Buttons:

- Save
- I don't know
- Skip, but count it

If the user taps `I don't know` or `Skip, but count it`, save an entry anyway.

## Brain Dump

Title: `Dump It`

Subtitle: `No organizing. Just unload.`

Provide a large text area and a `Save Brain Dump` button.

After saving, show placeholder organization:

- Feeling: Not analyzed yet
- Need: Not analyzed yet
- Tiny step: Take one breath and drink water
- Can wait: Everything else for 10 minutes

Later this can become AI-powered.

## Make It Smaller

User enters an overwhelming task.

Return a rule-based tiny step:

- `clean`: Pick up 3 things
- `laundry`: Put clothes in one pile
- `dishes`: Move 3 dishes to the sink
- `shower`: Sit in the bathroom for 30 seconds
- `email`: Open the inbox only
- `food/eat`: Get any food visible
- `work`: Open the document only
- default: Touch the thing related to the task for 10 seconds

Also return:

```txt
Even smaller: stand up and look at it.
That counts.
```

## History

Show saved entries as cards.

Each card should show:

- Date/time
- Entry type
- Prompt if available
- Text preview
- Tiny step if available

Avoid productivity language.

Do not show failed streaks.

Show a simple stat:

```txt
You came back X times.
```

## Settings

Toggles:

- Low Battery Mode
- Larger Text
- Gentle Language

For MVP, toggles can save to `localStorage`. Only Low Battery Mode needs behavior in v1: it should make prompts shorter.

## Data Model

```ts
type JournalEntry = {
  id: string;
  createdAt: string;
  mode: "check_in" | "brain_dump" | "tiny_step";
  prompt?: string;
  text?: string;
  mood?: number;
  energy?: number;
  stress?: number;
  tags?: string[];
  tinyStep?: string;
};
```

## Local Storage

Entries:

```txt
bare_minimum_journal_entries
```

Settings:

```txt
bare_minimum_journal_settings
```

## Design Style

- Calm
- Soft
- Simple
- Mobile-first
- Big buttons
- Low clutter
- No guilt
- No streak loss
- No red error-style shame language
- Accessible contrast
- Rounded cards
- Readable text

## First Codex Build Prompt

```txt
PROJECT: Bare Minimum Journal / Easy Journaling App for Executive Dysfunction

GOAL:
Build a simple mobile-first web app MVP for a shame-free journaling tool made for executive dysfunction, ADHD, burnout, overwhelm, and low-energy days.

TECH STACK:
Use Next.js + TypeScript + Tailwind CSS.
Use localStorage for the first MVP.
No backend yet.
No auth yet.
No payments yet.
No complex dashboard yet.

FIRST DELIVERABLE:
Create the full working MVP with navigation between screens.
Use clean components.
Keep everything localStorage-based.
Add comments where AI features will go later.

DO NOT BUILD YET:
- Login
- Cloud sync
- Subscription
- Therapist dashboard
- AI API calls
- Notifications
- Medical claims
- Diagnosis features
```

## Review Prompt After V1 Exists

```txt
Review the Bare Minimum Journal MVP for executive dysfunction UX.

Check for:
1. Too many choices
2. Shame-based language
3. Overwhelming screens
4. Missing accessibility basics
5. Broken localStorage behavior
6. Mobile layout issues
7. Places where Low Battery Mode should simplify the UI

Then make a prioritized fix list and implement the top 5 fixes.
```

## Future AI Placeholder Prompt

```txt
Add placeholder architecture for future AI features without connecting to any API yet.

Create service files for:
- organizeBrainDump()
- makeTaskSmaller()
- reflectOnJournalEntry()

Each function should currently return mock responses.
Add clear comments showing where an OpenAI or other LLM call would go later.
Do not add API keys.
Do not expose secrets.
Do not build backend yet.
```

## Scope Boundary

Give Codex only this MVP packet when building the app. Do not include grant plans, revenue models, therapist dashboards, or the broader ATLAS roadmap until the first app version works.
