# Avery Advisory Lead Capture V1 Report

Date: 2026-06-17

## Objective

Convert the Avery Advisory website from a brochure site into a lead-generating intake system that sends every qualified submission to Cole.

## What Was Built

### 1. Contact Form

- Name
- Email
- Company
- Message

### 2. Consultation Request Form

- Name
- Email
- Company
- Phone
- Business Size
- Current Challenges
- Preferred Meeting Time

### 3. Automation Audit Request Form

- Name
- Email
- Company
- Website
- Monthly Revenue Range
- Team Size
- Current Tools
- Biggest Bottleneck

## Submission Flow

1. Visitor opens one of the lead forms
2. Form view event is logged
3. First interaction logs a form-start event
4. Submission is validated on the client and server
5. Honeypot spam field is checked server-side
6. Submission is stored
7. Notification email is sent to Cole when Resend is configured
8. User is redirected to `/thank-you`

## Storage Location

### Local audit storage

- `data/lead-submissions.json`
- `data/lead-events.ndjson`

The local file store gives the site a simple append/read trail for development and audit visibility.

### Notification target

- `alphapotentiallive@gmail.com`

## Notification Flow

- Primary notification is sent by Resend when `RESEND_API_KEY` is configured
- Sender address is controlled by `RESEND_FROM_EMAIL`
- Recipient is the primary Avery Advisory inbox

If Resend is not configured, the submission is still stored and the API returns a notification status indicating that email sending is not active yet.

## Analytics Tracked

- Form views
- Form starts
- Form completions

These events are appended to the same local lead-event stream so the intake path can be reviewed without a CRM.

## Success Page

- `/thank-you`

## Low-Risk Fixes Applied

- Made the forms mobile-friendly
- Added success and error states
- Added honeypot spam protection
- Added a clean thank-you page

## Remaining Manual Setup

1. Set `RESEND_API_KEY` in Vercel
2. Set `RESEND_FROM_EMAIL` to a verified sender in Resend
3. Confirm the notification inbox is monitored
4. Decide whether the local file store should later be replaced with Google Sheets or Supabase for long-term persistence

## Notes

- No CRM was built
- No client portal was built
- No dashboard layer was added
- The implementation stays focused on getting leads into the inbox first
