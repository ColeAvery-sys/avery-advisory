# Creator Logistics V1 Report

Date: 2026-06-18

## Objective

Add Creator Logistics as a service offering under Avery Advisory so the site can sell the most established creator-service offer without splitting into a separate brand.

## Routes Added

- `/creator-logistics`

## Service Offerings

### Starter Package

- $750/month
- 2 long-form edits
- 4 shorts
- Thumbnail support
- Upload assistance

### Growth Package

- $1,500/month
- 4 long-form edits
- 10 shorts
- Thumbnail design
- SEO optimization
- Analytics review

### Operator Package

- $2,500/month
- 8 long-form edits
- 20 shorts
- Thumbnail strategy
- Channel management
- Upload scheduling
- Monthly strategy call

## Stripe Products Required

These require Stripe price IDs to be created and connected in environment variables.

- `STRIPE_PRICE_CREATOR_STARTER`
- `STRIPE_PRICE_CREATOR_GROWTH`
- `STRIPE_PRICE_CREATOR_OPERATOR`

## Payment Flow

1. Visitor opens `/creator-logistics`
2. Visitor reviews the package options
3. Visitor clicks through to `/pay` or booking
4. Stripe Checkout uses the plan-specific price ID for subscriptions
5. Payment success is logged and can trigger notification

## Remaining Setup

1. Create the three Stripe subscription prices
2. Store the price IDs in Vercel environment variables
3. Verify webhook behavior for recurring subscription payments
4. Add actual portfolio examples or case studies later if available

## Notes

- The page stays under the Avery Advisory domain
- No separate website was created
- No CRM was added
- No portal was added
- No unrelated software was built
