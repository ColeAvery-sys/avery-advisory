# ATLAS Recruiter

Local recruiting operations surface for Avery Industries LLC.

## What It Does

- Stores a file-backed recruiter profile with resume text, LinkedIn text, salary target, and remote-only preference.
- Scores imported jobs and ranks the best matches.
- Produces the top 20 applications per day.
- Generates draft cover letters and draft answers to application questions.
- Tracks saved jobs, applications, responses, interviews, and follow-ups.
- Keeps every outbound application or follow-up action approval-gated.

## Run

```bash
npm run recruiter:os
```

Open:

```text
http://localhost:8798/
```

## Data

The source of truth is stored at:

```text
atlas_ops/logs/atlas_recruiter_master.json
```

## Validation Checklist

1. Confirm the dashboard loads without errors.
2. Edit the recruiter profile and confirm the changes persist after refresh.
3. Import a JSON job batch and confirm the ranked list updates.
4. Confirm the top 20 queue is capped at 20 items.
5. Confirm application, response, interview, and follow-up actions stay draft-only until approved.

## Release Rule

Do not auto-submit applications or follow-ups. Review manually first and use explicit approval before any external action.
