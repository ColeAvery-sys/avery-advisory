# Avery Advisory UX Audit

Date: 2026-06-17

## Scope

Production UX audit of the Avery Advisory site with focus on desktop/mobile responsiveness, accessibility, and production-facing usability.

## What I Checked

- Header navigation
- Hero section
- Service cards
- Pricing cards
- Contact form
- Footer
- Legal pages
- Viewport behavior
- Mobile usability
- SEO-facing page structure

## Lighthouse

### Desktop

- Current score: Not captured
- Updated score: Not captured
- Status: Verification gap

### Mobile

- Current score: Not captured
- Updated score: Not captured
- Status: Verification gap

### Notes

I attempted to run Lighthouse against the local and live site, but the CLI run failed in this workspace due a Chrome temp-directory cleanup permission error. Because the result file was not produced, I am not fabricating performance numbers.

## Verified UI Findings

### 1. Hero layout is visually strong on desktop

- Severity: Low
- Priority: P3
- Status: Acceptable

The hero structure reads clearly and the primary CTA is easy to find. The right-side executive card supports the brand and does not create horizontal overflow at desktop width.

### 2. Contact form controls needed mobile-friendly sizing

- Severity: Low
- Priority: P3
- Status: Fixed

Inputs and textarea previously used the default text size, which can be awkward on mobile browsers and can trigger zoom behavior on iPhone-style browsers. Button heights also benefited from a larger minimum tap target.

Fix applied:
- Added `text-base` and larger minimum heights to form inputs
- Increased textarea height and line spacing
- Added minimum button height to the draft email CTA

### 3. Desktop overflow check passed

- Severity: Low
- Priority: P3
- Status: Verified

I checked the local page at a desktop viewport and found no horizontal overflow:
- viewport width: 1280
- body scroll width: 1280
- document scroll width: 1280
- overflow-x: false

### 4. Mobile viewport behavior still needs a real device pass

- Severity: Medium
- Priority: P2
- Status: Verification gap

The layout uses responsive Tailwind classes, but I was not able to complete a full mobile screenshot pass in the browser bridge during this audit. The page should still be tested on the standard small viewport sizes before launch sign-off.

Exact sizes to verify:
- 320px
- 375px
- 390px
- 414px
- 768px
- 1024px
- 1440px

## Accessibility Observations

### 1. Visible labels are present in the contact form

- Severity: Low
- Priority: P3
- Status: Good

The contact form uses visible labels, not placeholder-only inputs. That helps usability and accessibility.

### 2. Button and link targets are reasonable

- Severity: Low
- Priority: P3
- Status: Good

Main CTA buttons and footer actions are readable and have clear labels.

### 3. Further manual accessibility checks are still recommended

- Severity: Medium
- Priority: P2
- Status: Recommended

Before launch, confirm:
- keyboard navigation order
- focus styles
- contrast on gold-on-dark elements
- screen reader heading structure

## Page-Level Notes

### Header navigation

- Good on desktop
- Mobile menu still needs a final hand-check for tap comfort and menu stacking

### Hero section

- Strong hierarchy
- Responsive in code
- No desktop overflow detected

### Service cards

- Clear card structure
- Suitable for selling services without overcrowding

### Pricing cards

- Stronger conversion emphasis after the featured-card treatment
- Best-value tier is visually prioritized

### Contact form

- Improved with mobile-friendly sizing fixes
- Still the most important conversion surface to test on a real phone

### Footer

- Strong executive hierarchy
- Good contact visibility
- No major layout issue observed in code review

### Legal pages

- Present and reachable
- SEO-friendly metadata structure exists

## Fixes Applied During Audit

- Increased contact form input text size
- Added minimum height to form controls
- Improved textarea usability
- Added a larger tap target for the submit button

## Remaining Risks

1. Lighthouse metrics were not captured due tool/runtime failure
2. Mobile layout should be verified on a real narrow viewport
3. Accessibility should get one final keyboard/screen-reader pass

## Before / After Summary

### Before

- Form controls were a little small for mobile comfort
- No audit-time Lighthouse numbers were available
- Mobile behavior had not been confirmed with a real viewport pass

### After

- Form controls are easier to tap and read on mobile
- Desktop overflow checks passed
- Production UX now has fewer low-risk mobile friction points

## Recommended Next Step

Run the lead capture build only after the mobile viewport pass is complete, so the first conversion system lands on top of a stable UX foundation.
