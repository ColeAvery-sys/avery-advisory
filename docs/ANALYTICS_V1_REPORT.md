# Avery Advisory Analytics V1 Report

Date: 2026-06-18

## Objective

Instrument Avery Advisory so visits, leads, CTA clicks, and payment actions can be measured with a simple, production-safe analytics layer.

## Installed Analytics

### Google Analytics 4

- Requires `NEXT_PUBLIC_GA_ID`
- Loads only when the ID is present
- Uses anonymized IP configuration

### Microsoft Clarity

- Requires `NEXT_PUBLIC_CLARITY_ID`
- Loads only when the ID is present

## Events Tracked

### Page Views

- General page view
- `/pay` page view
- `/payment-success`
- `/payment-cancelled`

### Contact Form

- View
- Start
- Submit

### Consultation Form

- View
- Start
- Submit

### Automation Audit Form

- View
- Start
- Submit

### Payments

- Pay Page View
- Strategy Session Click
- Automation Audit Click
- Custom Project Click
- Payment Success
- Payment Cancelled

### CTA Tracking

- Book Consultation
- Contact Us
- Services CTA
- Hero CTA

## Production Safety

- Analytics scripts do not load unless IDs are present
- Events no-op if tracking is unavailable
- Lead and payment flows continue to work if GA or Clarity is missing
- Tracking is limited to explicit user actions already present in the UI

## IDs Required

- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_CLARITY_ID`

## Verification Steps

1. Add the GA4 measurement ID and Clarity project ID in Vercel environment variables
2. Load the site and confirm the scripts appear in the browser network panel
3. Visit the home page and verify one page view event is recorded
4. Open the contact page and confirm each form logs view/start/submit only once per session
5. Open `/pay` and confirm the pay page view event and plan click events fire
6. Submit a form and confirm the lead event trail still writes to `data/lead-events.ndjson`
7. Complete a Stripe checkout and confirm the success and payment event flow

## Dashboard Recommendations

- Use GA4 for top-level traffic, traffic sources, and conversion funnels
- Use Clarity for qualitative session replay and friction analysis
- Track conversion events as custom events in GA4 to distinguish traffic from revenue actions
- Review payment and lead event logs together so analytics stays aligned with actual business outcomes

## Notes

- No CRM was added
- No client portal was added
- No extra marketing stack was introduced
- The implementation stays focused on measurement before scale
