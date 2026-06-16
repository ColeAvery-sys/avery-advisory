# ATLAS Discord Bot

This bot handles three things:

1. Replies to any Discord message that starts with `Hey Atlas`
2. Optionally attaches a Hazel-generated voice reply
3. Sends missed check-in reminders to Mr. Avery at `3:30 PM` and `9:30 PM`

## Required configuration

Add these values in `.env`, `.env.local`, or `.env.discord`:

```env
DISCORD_BOT_TOKEN=
DISCORD_OWNER_USER_ID=
DISCORD_HEY_ATLAS_RESPONSE_MODE=text
ATLAS_TIMEZONE=America/New_York
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=YyqkX0AHv8W5D1vxG9lR
ELEVENLABS_MODEL_ID=eleven_multilingual_v2
ELEVENLABS_OUTPUT_FORMAT=mp3_44100_192
```

## Response modes

- `text`: send only a text reply
- `voice`: send only a voice attachment when ElevenLabs is configured
- `both`: send both text and voice

## Check-in behavior

- `Hey Atlas check in` from Mr. Avery records a check-in
- If no check-in is recorded by `3:30 PM`, the bot DMs a reminder
- If no check-in is recorded after `3:30 PM` by `9:30 PM`, the bot DMs another reminder

## Local preview

```powershell
python scripts\atlas_discord_bot.py --print-sample
```

## Install bot at Windows logon

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\install_atlas_discord_bot_task.ps1"
```
