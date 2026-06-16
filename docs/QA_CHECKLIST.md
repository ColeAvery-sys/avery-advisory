# QA Checklist

## Universal Checks
- UI uses `Avery Industries LLC` only
- no `Avery Industries LLC` labels remain
- navigation is clear on desktop and mobile
- logging is present for state changes
- approval gates block outbound actions until approved
- no email/DM/proposal/client delivery is sent automatically
- docs reflect the current state

## Feature Checks
- data loads correctly
- empty states are handled
- error states are visible and readable
- permission states are respected
- audit trail records the action
- the feature matches the intended workflow
- Career OS outputs match the seeded Cole Ends profile
- LinkedIn changes are review-only and never auto-submitted
- resume, LinkedIn, and interview outputs are copy-paste ready
- missing certification output reflects the selected target role
- local save and reset preserve the JSON source of truth

## Release Checks
- tests pass
- build passes if a build step exists
- exports or generated assets are valid
- manual review is complete
- final status is written down

## Validation Format
Use this format for any new feature:
1. What changed
2. How to test it
3. What should happen
4. What would block release
