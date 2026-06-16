# Atlas iPhone Text Assistant

This setup lets Mr. Avery's iPhone answer trusted texts that start with `Hey Atlas` and send a missed-check-in message when needed.

## What Is Included

- `atlas_text_assistant_config.json`: trusted contacts, safety rules, check-in timing, and default wording.
- `scripts/atlas_text_assistant_server.js`: local webhook server for iPhone Shortcuts.
- `SHORTCUTS_SETUP.md`: exact iPhone Shortcut steps.
- `atlas_text_assistant_outbox.json`: created automatically when Atlas queues outbound messages.

## Default Behavior

- Trusted contact: Apollo, `+1 (304) 210-6359`
- Trigger phrase: `Hey Atlas`
- Check-in window: every 4 hours
- Missed-check-in delay: 1 hour
- Missed-check-in message: Mr. Avery is busy and will message as soon as he is free.

## Required Secrets

Add these to your local environment or `.env` file when ready:

```text
OPENAI_API_KEY=your_openai_api_key
ATLAS_WEBHOOK_SECRET=make-a-long-private-secret
ATLAS_TEXT_ASSISTANT_PORT=8787
ATLAS_TEXT_ASSISTANT_MODEL=gpt-5-mini
```

The server has a safe fallback if `OPENAI_API_KEY` is missing, but conversational answers need the OpenAI API key.

## Start Locally

```powershell
npm run atlas:text-assistant
```

Local URL:

```text
http://localhost:8787
```

For iPhone use away from the same computer, deploy this server to a public HTTPS host or expose it through a trusted tunnel. Put that HTTPS URL into the Shortcuts.

## Queue The Apollo Test Message

```powershell
Invoke-RestMethod -Uri "http://localhost:8787/atlas/outbox/queue-apollo-test" -Method Post -Headers @{ Authorization = "Bearer YOUR_ATLAS_WEBHOOK_SECRET" }
```

Then run the `Atlas Send Outbox` Shortcut on your iPhone.
