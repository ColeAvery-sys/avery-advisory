# Environment Variables

Generated: 2026-06-17

## Current Variables Used

Project-specific environment variables currently used by the Avery Advisory site and ATLAS tooling include:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_STRATEGY_LINK`
- `NEXT_PUBLIC_STRIPE_AUDIT_LINK`
- `NEXT_PUBLIC_STRIPE_CUSTOM_LINK`
- `ATLAS_LOCAL_ONLY`
- `ATLAS_PORT`
- `PUBLIC_SITE_BASE_URL`

## Recommended Future Variables

These are placeholders only. Do not put real secrets in documentation or source control.

| Variable | Required | Purpose |
| --- | --- | --- |
| `ATLAS_LOCAL_ONLY` | Optional | When `true`, disables live external actions and keeps ATLAS in local/draft mode. |
| `ATLAS_PORT` | Optional | Future local app/server port if a web service is added. |
| `ELEVENLABS_API_KEY` | Optional | Future ElevenLabs API key. Must only be used behind approval and credit guards. |
| `OPENAI_API_KEY` | Optional | Future AI API key. Must not be exposed to browser/client code. |
| `GOOGLE_CLIENT_ID` | Optional | Future Google integration placeholder. |
| `GOOGLE_CLIENT_SECRET` | Optional | Future Google integration placeholder. |
| `GMAIL_DRAFTS_ENABLED` | Optional | Future switch for Gmail draft staging. Should never auto-send. |
| `PUBLIC_SITE_BASE_URL` | Optional | Future public website URL for generated links and CTAs. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | Public Stripe config for front-end readiness and Stripe-aware UI states. |
| `NEXT_PUBLIC_STRIPE_STRATEGY_LINK` | Optional | Stripe payment link for the strategy session. |
| `NEXT_PUBLIC_STRIPE_AUDIT_LINK` | Optional | Stripe payment link for the consolidation audit. |
| `NEXT_PUBLIC_STRIPE_CUSTOM_LINK` | Optional | Stripe payment link for custom projects. |

## Example `.env.example`

```env
ATLAS_LOCAL_ONLY=true
ATLAS_PORT=3000
PUBLIC_SITE_BASE_URL=https://example.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Paid or sensitive APIs stay empty until explicitly configured.
ELEVENLABS_API_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_STRIPE_STRATEGY_LINK=
NEXT_PUBLIC_STRIPE_AUDIT_LINK=
NEXT_PUBLIC_STRIPE_CUSTOM_LINK=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GMAIL_DRAFTS_ENABLED=false
```

## Safety Notes

- Never commit real API keys, access tokens, passwords, private emails, or phone numbers.
- Public/client-facing actions still require Cole approval even if an API key exists.
- Paid generation, ad spending, publishing, customer messaging, and price changes need explicit approval gates.
