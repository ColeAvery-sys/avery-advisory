# Avery Advisory Stripe Integration V1 Report

Date: 2026-06-18

## Objective

Convert Avery Advisory from a lead-only site into a payment-capable business flow with checkout, webhook logging, and inbox notification on successful payment.

## Scope Delivered

### Products

- Strategy Session - $150
- Automation Audit - $500
- Custom Project Deposit - $1,000

### Pages

- `/pay`
- `/payment-success`
- `/payment-cancelled`

### API Routes

- `/api/stripe/checkout`
- `/api/stripe/webhook`

### Logging

- `data/payment-events.ndjson`

## Payment Flow

1. Visitor opens `/pay`
2. Visitor selects a payment option
3. The browser requests `/api/stripe/checkout`
4. The server creates a Stripe Checkout Session
5. Stripe redirects the visitor to the hosted checkout
6. Stripe sends a webhook after successful payment
7. The webhook logs the payment event
8. If Resend is configured, Avery Advisory receives an inbox notification
9. The user lands on `/payment-success`

## Storage Location

- Payment event log: `data/payment-events.ndjson`

This keeps the payment record simple and auditable without building a CRM or invoice system.

## Notification Flow

- Primary inbox: `alphapotentiallive@gmail.com`
- Notification sends only after a paid checkout event
- The webhook uses `RESEND_API_KEY` and `RESEND_FROM_EMAIL` when available

## Remaining Manual Setup

1. Set `STRIPE_SECRET_KEY`
2. Set `STRIPE_WEBHOOK_SECRET`
3. Set `RESEND_API_KEY`
4. Set `RESEND_FROM_EMAIL`
5. Create the three Stripe products or confirm the inline checkout pricing is accepted
6. Add the webhook endpoint in Stripe and subscribe to `checkout.session.completed`

## Notes

- No CRM was built
- No client portal was built
- No subscriptions were added
- No dashboard layer was added
- No ATLAS automation was added
