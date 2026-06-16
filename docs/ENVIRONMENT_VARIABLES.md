# Environment Variables

Generated: 2026-05-28

## Current Variables Used

No project-specific environment variables are currently used by ATLAS source files.

The repo is local-first and does not currently call external APIs, run paid asset generation, send messages, publish content, or start an HTTP server.

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

## Example `.env.example`

```env
ATLAS_LOCAL_ONLY=true
ATLAS_PORT=3000
PUBLIC_SITE_BASE_URL=https://example.com

# Paid or sensitive APIs stay empty until explicitly configured.
ELEVENLABS_API_KEY=
OPENAI_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GMAIL_DRAFTS_ENABLED=false
```

## Safety Notes

- Never commit real API keys, access tokens, passwords, private emails, or phone numbers.
- Public/client-facing actions still require Cole approval even if an API key exists.
- Paid generation, ad spending, publishing, customer messaging, and price changes need explicit approval gates.

