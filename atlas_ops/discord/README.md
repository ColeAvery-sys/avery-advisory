# ATLAS Daily Discord Update

This automation sends a daily 3:00 PM Discord DM using a Discord bot, not a personal self-bot.

## Files

- `scripts/discord_daily_update_sender.ps1`
- `scripts/install_discord_daily_update_task.ps1`
- `atlas_ops/discord/Catherine_daily_update.txt`
- `atlas_ops/logs/discord_daily_update.log`

## Required configuration

Set these in `.env`, `.env.local`, or `.env.discord`:

```env
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_TARGET_USER_ID=the_numeric_discord_user_id
DISCORD_DAILY_MESSAGE_FILE=atlas_ops\discord\Catherine_daily_update.txt
```

## Important Discord requirement

The bot can only DM the target user if the bot and that user share a server, and the user's Discord privacy settings allow DMs from that server.

## Preview the message

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\discord_daily_update_sender.ps1" -DryRun
```

## Install or refresh the 3 PM task

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\install_discord_daily_update_task.ps1"
```
