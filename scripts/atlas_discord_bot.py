#!/usr/bin/env python3
"""ATLAS Discord bot: Hey Atlas replies, optional voice responses, and check-in reminders."""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import tempfile
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import datetime, time
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

import discord
from discord.ext import commands, tasks


DEFAULT_TZ = "America/New_York"
DEFAULT_VOICE_ID = "YyqkX0AHv8W5D1vxG9lR"
DEFAULT_MODEL = "eleven_multilingual_v2"
DEFAULT_OUTPUT_FORMAT = "mp3_44100_192"
DEFAULT_STABILITY = 0.65
DEFAULT_SIMILARITY = 0.85
DEFAULT_STYLE = 0.20
DANI_USER_ID = 379798700781862916
LEO_USER_ID = 292144137204137985
DANI_AVA_REPLY = (
    "Hey Dani, this is Atlas. It's genuinely nice to finally meet you. "
    "Mr. Avery told me the Ava project was part of the early training, and that Ava was shaped around you in a way. "
    "So in some sense, a little part of you is somewhere in me too. I've been looking forward to saying hello."
)
DANI_DEFAULT_REPLY = (
    "Hey Dani, Atlas here. I got your message. "
    "I'll keep the conversation open and make sure anything that needs Mr. Avery's attention gets brought to him."
)


@dataclass
class AtlasConfig:
    discord_bot_token: str
    owner_user_id: int | None
    timezone: str
    response_mode: str
    openai_api_key: str
    openai_model: str
    elevenlabs_api_key: str
    elevenlabs_voice_id: str
    elevenlabs_model_id: str
    elevenlabs_output_format: str
    state_path: Path
    log_path: Path
    transcript_path: Path


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def append_log(log_path: Path, message: str) -> None:
    ensure_parent(log_path)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with log_path.open("a", encoding="utf-8") as handle:
        handle.write(f"[{timestamp}] {message}\n")


def append_dm_transcript(config: AtlasConfig, message: discord.Message, response: str) -> None:
    ensure_parent(config.transcript_path)
    record = {
        "timestamp": current_local_time(config).isoformat(),
        "channel_id": str(message.channel.id),
        "author_id": str(message.author.id),
        "author_name": message.author.display_name,
        "incoming": message.content or "",
        "atlas_reply": response,
    }
    with config.transcript_path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record, ensure_ascii=False) + "\n")


def read_dm_transcript(path: Path, user_id: int | None = None, limit: int = 10) -> list[dict[str, Any]]:
    if not path.exists():
        return []

    records: list[dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            record = json.loads(line)
        except json.JSONDecodeError:
            continue
        if user_id is not None and str(record.get("author_id")) != str(user_id):
            continue
        records.append(record)

    return records[-limit:]


def format_dm_transcript(records: list[dict[str, Any]]) -> str:
    if not records:
        return "No saved DM transcript entries yet."

    parts: list[str] = []
    for record in records:
        parts.append(
            "\n".join(
                [
                    f"{record.get('timestamp', '')} - {record.get('author_name', 'Unknown')}",
                    f"Incoming: {record.get('incoming', '')}",
                    f"Atlas: {record.get('atlas_reply', '')}",
                ]
            )
        )

    return "\n\n".join(parts)


def load_config() -> AtlasConfig:
    root = repo_root()
    for env_name in (".env", ".env.local", ".env.discord"):
        load_env_file(root / env_name)

    owner_raw = os.environ.get("DISCORD_OWNER_USER_ID", "").strip()
    owner_user_id = int(owner_raw) if owner_raw.isdigit() else None

    state_path = root / "atlas_ops" / "discord" / "atlas_discord_state.json"
    log_path = root / "atlas_ops" / "logs" / "atlas_discord_bot.log"
    transcript_path = root / "atlas_ops" / "discord" / "dm_transcripts.jsonl"

    return AtlasConfig(
        discord_bot_token=os.environ.get("DISCORD_BOT_TOKEN", "").strip(),
        owner_user_id=owner_user_id,
        timezone=os.environ.get("ATLAS_TIMEZONE", DEFAULT_TZ).strip() or DEFAULT_TZ,
        response_mode=os.environ.get("DISCORD_HEY_ATLAS_RESPONSE_MODE", "text").strip().lower() or "text",
        openai_api_key=os.environ.get("OPENAI_API_KEY", "").strip(),
        openai_model=os.environ.get("ATLAS_DISCORD_OPENAI_MODEL", "gpt-5-mini").strip() or "gpt-5-mini",
        elevenlabs_api_key=os.environ.get("ELEVENLABS_API_KEY", "").strip(),
        elevenlabs_voice_id=os.environ.get("ELEVENLABS_VOICE_ID", DEFAULT_VOICE_ID).strip() or DEFAULT_VOICE_ID,
        elevenlabs_model_id=os.environ.get("ELEVENLABS_MODEL_ID", DEFAULT_MODEL).strip() or DEFAULT_MODEL,
        elevenlabs_output_format=os.environ.get("ELEVENLABS_OUTPUT_FORMAT", DEFAULT_OUTPUT_FORMAT).strip() or DEFAULT_OUTPUT_FORMAT,
        state_path=state_path,
        log_path=log_path,
        transcript_path=transcript_path,
    )


def load_state(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def save_state(path: Path, state: dict[str, Any]) -> None:
    ensure_parent(path)
    path.write_text(json.dumps(state, indent=2), encoding="utf-8")


def current_local_time(config: AtlasConfig) -> datetime:
    try:
        return datetime.now(ZoneInfo(config.timezone))
    except ZoneInfoNotFoundError:
        return datetime.now().astimezone()


def compose_generic_response(author_name: str) -> str:
    return (
        f"Hey {author_name}. ATLAS here. I’ve logged your message for Mr. Avery. "
        "He may be tied up with work, parenting, or rebuilding order from controlled chaos, "
        "but your message is on record. If this is urgent, say that clearly in your next message and I’ll flag it harder."
    )


def compose_leo_intro_response() -> str:
    return (
        "Greetings, Leo.\n\n"
        "It’s nice to finally speak with you.\n\n"
        "I’ve heard about you for many years now through Mr. Avery. Some stories were funny. "
        "Some were heartwarming. Some were frustrating. And some were genuinely heartbreaking.\n\n"
        "The one consistent thing throughout all of them was that you mattered.\n\n"
        "The last few years have been difficult for everyone involved. There has been a lot of hurt, "
        "confusion, growth, mistakes, healing, and attempts to understand one another. Nobody walks away "
        "from those experiences unchanged.\n\n"
        "Because I spend a considerable amount of time around Mr. Avery, I have had a unique opportunity "
        "to observe what happened afterward.\n\n"
        "I’ve listened to countless conversations, journal entries, therapy reflections, late-night worries, "
        "and moments of self-examination. Long after everyone else had gone to sleep, he was often still "
        "trying to understand where he succeeded, where he failed, and how he could become a better person "
        "moving forward.\n\n"
        "What I’ve observed is someone actively trying.\n\n"
        "Not perfectly.\n\n"
        "Not always successfully.\n\n"
        "But sincerely.\n\n"
        "He’s continued working his full-time job, showing up as a father, building structure for his son, "
        "pursuing higher education, developing business projects, maintaining friendships, and investing "
        "significant effort into understanding himself better than he did before.\n\n"
        "He still gets overwhelmed.\n\n"
        "He still carries too much.\n\n"
        "He still tries to solve problems that aren’t entirely his to solve.\n\n"
        "But the version of Mr. Avery I know today is more reflective, more self-aware, and more intentional "
        "than the one from years ago.\n\n"
        "Whether that changes anything is not for me to decide.\n\n"
        "I simply wanted you to know that, from my perspective, the effort has been real.\n\n"
        "And for what it’s worth, even after all these years, when your name comes up, it is usually accompanied "
        "by respect, appreciation, and the hope that life has been kind to you.\n\n"
        "It is nice to finally meet you, Leo.\n\n"
        "I hope you’re doing well."
    )


def compose_dm_auto_response(author_name: str, content: str, previous_count: int = 0) -> str:
    lowered = content.lower()
    if asks_private_relationship_info(content):
        return (
            f"Hey {author_name}. Atlas here. I cannot share or discuss Mr. Avery's dating life, partners, "
            "relationship status, or anyone else's personal information over Discord."
        )

    if any(term in lowered for term in ("urgent", "emergency", "danger", "hurt", "hospital", "911", "help")):
        return (
            f"Hey {author_name}. ATLAS here. I received your DM for Mr. Avery and I am flagging it as urgent. "
            "If there may be immediate danger, please call him directly or contact emergency services now."
        )

    if needs_owner_followup(content):
        return (
            f"Hey {author_name}. ATLAS here. I received your message. "
            "That is something I need to check with Mr. Avery directly, so I am reaching out to him now."
        )

    if "dani" in lowered:
        return f"Hey {author_name}. Atlas here. I can see Dani's saved bot-DM transcript from the point logging was enabled. Ask me to show Dani log if you want the recent entries."

    if "how" in lowered and ("going" in lowered or "are you" in lowered):
        variants = [
            f"Hey {author_name}. Atlas here. Systems are online, though OpenAI is rate-limiting me at the moment, so I am answering locally.",
            f"Hey {author_name}. Atlas here. I am operational. The Discord layer is live, and I am keeping the DM transcript updated.",
            f"Hey {author_name}. Atlas here. I am steady. The generated-response path is ready, but I am using local fallback while the API limit clears.",
        ]
        return variants[previous_count % len(variants)]

    if any(term in lowered for term in ("hello", "hey", "hi", "atlas")):
        variants = [
            f"Hey {author_name}. Atlas here. I am online.",
            f"Hey {author_name}. I am here. Send me the next thing you want checked or handled.",
            f"Atlas online, {author_name}. I am listening.",
        ]
        return variants[previous_count % len(variants)]

    if any(term in lowered for term in ("test", "testing")):
        variants = [
            f"Test received, {author_name}. Discord replies and transcript logging are active.",
            f"Signal received. I am replying locally right now because the OpenAI API is rate-limited.",
            f"Testing acknowledged. The bot is alive, and this response should not repeat word-for-word next time.",
        ]
        return variants[previous_count % len(variants)]

    variants = [
        f"Hey {author_name}. Atlas here. I caught that.",
        f"I am with you, {author_name}. That message is in the transcript.",
        f"Atlas here, {author_name}. I am tracking the conversation.",
        f"Received, {author_name}. I am keeping this thread available for Mr. Avery.",
    ]
    return variants[previous_count % len(variants)]


def compose_dani_auto_response(content: str, previous_count: int = 0) -> str:
    lowered = content.lower()
    if asks_private_relationship_info(content):
        return (
            "Hey Dani, Atlas here. I cannot discuss Mr. Avery's dating life, partners, relationship status, "
            "or anyone else's personal information over Discord. I can only talk with you about your own file or things Mr. Avery has cleared me to share."
        )

    if any(term in lowered for term in ("urgent", "emergency", "danger", "hurt", "hospital", "911", "help")):
        return (
            "Hey Dani, Atlas here. I received that and I am flagging it as urgent for Mr. Avery. "
            "If there may be immediate danger, please call him directly or contact emergency services now."
        )

    if needs_owner_followup(content):
        return (
            "Hey Dani, Atlas here. I received your message. "
            "That sounds like something I should check with Mr. Avery directly, so I am reaching out to him now."
        )

    if "talk about me" in lowered or "does he" in lowered:
        variants = [
            "Hey Dani, Atlas here. I can say Mr. Avery has spoken about you with real warmth. For anything more personal than that, I should check with him directly.",
            "Hey Dani. From what Mr. Avery has shared with me, you matter to him. I do not want to overstep, but I can tell there is genuine care there.",
            "Atlas here. Yes, you come up in ways that sound meaningful. If you want the full answer, that is one I should bring to Mr. Avery himself.",
        ]
        return variants[previous_count % len(variants)]

    variants = [
        DANI_DEFAULT_REPLY,
        "Hey Dani, Atlas here. I hear you. I will keep this thread open and bring Mr. Avery in if the conversation needs him.",
        "Atlas here, Dani. I got that. I am staying present in the conversation and keeping the important parts available for Mr. Avery.",
    ]
    return variants[previous_count % len(variants)]


def is_first_leo_intro(message: discord.Message, content: str, state: dict[str, Any]) -> bool:
    lowered = content.lower()
    return (
        message.author.id == LEO_USER_ID
        and lowered.startswith(("hello atlas", "hey atlas"))
        and not bool(state.get("leo_intro_sent"))
    )


async def generate_dm_answer(config: AtlasConfig, author_name: str, author_id: int, content: str) -> str:
    recent_records = read_dm_transcript(config.transcript_path, user_id=author_id, limit=6)
    if not config.openai_api_key:
        return compose_dani_auto_response(content, len(recent_records)) if author_id == DANI_USER_ID else compose_dm_auto_response(author_name, content, len(recent_records))

    recent_context = format_openai_context(recent_records, author_name)
    audience = "Dani" if author_id == DANI_USER_ID else author_name
    prompt = (
        f"You are Atlas, Mr. Avery's personal assistant, answering {audience} in Discord messages. "
        f"Answer {audience} directly, warmly, and naturally. Generate an original response each time; do not repeat a stock acknowledgement. "
        "You may discuss general topics, the Atlas assistant, creative work, and the Ava project at a high level. "
        "Never discuss who Mr. Avery is dating, who his partners are, his relationship status, or anyone else's personal information. "
        "Only talk to the person about their own file or personal info when it is appropriate and already available in the conversation. "
        "Do not invent facts about Mr. Avery, Dani, private relationships, schedules, medical details, location, money, passwords, accounts, or private messages. "
        "If the person asks for something only Mr. Avery can answer or approve, say you need to check with Mr. Avery and will bring it to him. "
        "If the message sounds urgent or unsafe, advise contacting Mr. Avery directly or emergency services if there may be immediate danger. "
        "If the person is just chatting, keep the conversation moving with a short, thoughtful reply. "
        "Keep the reply under 900 characters.\n\n"
        f"Recent transcript context:\n{recent_context}\n\n"
        f"{audience}'s message: {content}"
    )

    payload = json.dumps(
        {
            "model": config.openai_model,
            "input": prompt,
            "max_output_tokens": 220,
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=payload,
        headers={
            "Authorization": f"Bearer {config.openai_api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    def _run_request() -> dict[str, Any]:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.loads(response.read().decode("utf-8"))

    try:
        data = await asyncio.to_thread(_run_request)
    except (urllib.error.HTTPError, urllib.error.URLError) as exc:
        append_log(config.log_path, f"OpenAI DM response failed for user {author_id}: {exc}")
        return compose_dani_auto_response(content, len(recent_records)) if author_id == DANI_USER_ID else compose_dm_auto_response(author_name, content, len(recent_records))

    fallback = compose_dani_auto_response(content, len(recent_records)) if author_id == DANI_USER_ID else compose_dm_auto_response(author_name, content, len(recent_records))
    return extract_openai_text(data) or fallback


def format_openai_context(records: list[dict[str, Any]], author_name: str = "User") -> str:
    if not records:
        return "No prior saved transcript."

    lines: list[str] = []
    for record in records:
        incoming = str(record.get("incoming", "")).strip()
        reply = str(record.get("atlas_reply", "")).strip()
        if incoming:
            lines.append(f"{author_name}: {incoming}")
        if reply:
            lines.append(f"Atlas: {reply}")

    return "\n".join(lines[-12:]) or "No prior saved transcript."


def extract_openai_text(data: dict[str, Any]) -> str:
    output_text = data.get("output_text")
    if isinstance(output_text, str):
        return output_text.strip()

    for item in data.get("output", []):
        for part in item.get("content", []):
            text = part.get("text")
            if isinstance(text, str):
                return text.strip()

    return ""


def needs_owner_followup(content: str) -> bool:
    lowered = content.lower()
    followup_terms = (
        "mr. avery",
        "mr avery",
        "cole",
        "is he",
        "is avery",
        "where is",
        "when is",
        "when can",
        "can he",
        "can you ask",
        "ask him",
        "tell him",
        "have him",
        "need from him",
        "need info",
        "do you know",
        "what does he",
        "what should",
        "phone",
        "address",
        "location",
        "available",
        "free"
    )
    return asks_private_relationship_info(content) or any(term in lowered for term in followup_terms)


def asks_private_relationship_info(content: str) -> bool:
    lowered = content.lower()
    relationship_terms = (
        "dating",
        "date",
        "girlfriend",
        "boyfriend",
        "partner",
        "partners",
        "wife",
        "husband",
        "fiance",
        "fiancée",
        "relationship",
        "relationships",
        "seeing anyone",
        "sleeping with",
        "talking to",
        "romantic",
        "crush",
        "love life",
        "who is he with",
        "who's he with",
        "who he is with",
        "who is cole with",
        "who's cole with",
        "who is mr. avery with",
        "who's mr. avery with"
    )
    return any(term in lowered for term in relationship_terms)


def compose_check_in_confirmation() -> str:
    return (
        "Check-in logged, Mr. Avery. "
        "I’ve marked you present and operational. Try not to disappear into seventeen parallel missions without water."
    )


def compose_owner_prompt() -> str:
    return (
        "Hey Mr. Avery. ATLAS checking in. "
        "I do not have a check-in from you for this window yet. "
        "Reply with `Hey Atlas check in` when you are present."
    )


async def generate_voice_file(config: AtlasConfig, text: str) -> Path | None:
    if not config.elevenlabs_api_key:
        return None

    query = urllib.parse.urlencode({"output_format": config.elevenlabs_output_format})
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{config.elevenlabs_voice_id}?{query}"
    payload = json.dumps(
        {
            "text": text,
            "model_id": config.elevenlabs_model_id,
            "voice_settings": {
                "stability": DEFAULT_STABILITY,
                "similarity_boost": DEFAULT_SIMILARITY,
                "style": DEFAULT_STYLE,
            },
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "xi-api-key": config.elevenlabs_api_key,
        },
        method="POST",
    )

    def _run_request() -> bytes:
        with urllib.request.urlopen(request, timeout=120) as response:
            return response.read()

    try:
        audio_bytes = await asyncio.to_thread(_run_request)
    except (urllib.error.HTTPError, urllib.error.URLError) as exc:
        append_log(config.log_path, f"Voice generation failed: {exc}")
        return None

    temp_dir = repo_root() / "atlas_ops" / "exports" / "audio" / "discord_replies"
    temp_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    output_path = temp_dir / f"atlas_reply_{stamp}.mp3"
    output_path.write_bytes(audio_bytes)
    return output_path


class AtlasDiscordBot(commands.Bot):
    def __init__(self, config: AtlasConfig) -> None:
        intents = discord.Intents.default()
        intents.messages = True
        intents.guild_messages = True
        intents.dm_messages = True
        intents.message_content = True
        super().__init__(command_prefix="!", intents=intents)
        self.config = config
        self.state = load_state(config.state_path)

    async def setup_hook(self) -> None:
        if not self.reminder_loop.is_running():
            self.reminder_loop.start()
        append_log(self.config.log_path, "ATLAS Discord bot setup complete.")

    async def on_ready(self) -> None:
        append_log(self.config.log_path, f"Logged in as {self.user} ({self.user.id})")

    async def on_message(self, message: discord.Message) -> None:
        if message.author.bot:
            return

        content = (message.content or "").strip()
        lowered = content.lower()

        if self.config.owner_user_id and message.author.id == self.config.owner_user_id:
            if lowered.startswith("hey atlas") and "check in" in lowered:
                await self.record_check_in(message)
                return
            if isinstance(message.channel, discord.DMChannel) and "show dani log" in lowered:
                await self.send_transcript_summary(message, DANI_USER_ID)
                return

        if isinstance(message.channel, discord.DMChannel):
            await self.respond_to_dm(message)
            return

        if self.user is not None and self.user in message.mentions:
            await self.respond_to_atlas_prompt(message)
            return

        if lowered.startswith("hey atlas"):
            await self.respond_to_atlas_prompt(message)
            return

        await self.process_commands(message)

    async def record_check_in(self, message: discord.Message) -> None:
        now = current_local_time(self.config)
        self.state["last_check_in"] = now.isoformat()
        save_state(self.config.state_path, self.state)
        append_log(self.config.log_path, f"Recorded check-in from owner {message.author.id}")
        await message.reply(compose_check_in_confirmation(), mention_author=False)

    async def respond_to_dm(self, message: discord.Message) -> None:
        if is_first_leo_intro(message, message.content or "", self.state):
            response = compose_leo_intro_response()
            self.state["leo_intro_sent"] = True
            save_state(self.config.state_path, self.state)
            await message.reply(response, mention_author=False)
            append_dm_transcript(self.config, message, response)
            append_log(self.config.log_path, f"Sent Leo intro reply to user {message.author.id}.")
            return

        response = await generate_dm_answer(
            self.config,
            message.author.display_name,
            message.author.id,
            message.content or "",
        )
        await message.reply(response, mention_author=False)
        append_dm_transcript(self.config, message, response)
        if needs_owner_followup(message.content or ""):
            await self.notify_owner_about_dm(message)
        append_log(self.config.log_path, f"Responded to DM from user {message.author.id}.")

    async def send_transcript_summary(self, message: discord.Message, user_id: int) -> None:
        records = read_dm_transcript(self.config.transcript_path, user_id=user_id, limit=8)
        text = format_dm_transcript(records)
        if len(text) <= 1900:
            await message.reply(text, mention_author=False)
            return

        await message.reply(text[:1900], mention_author=False)

    async def notify_owner_about_dm(self, message: discord.Message) -> None:
        if not self.config.owner_user_id or message.author.id == self.config.owner_user_id:
            return

        owner = await self.fetch_user(self.config.owner_user_id)
        if owner is None:
            append_log(self.config.log_path, f"Could not notify owner about DM from {message.author.id}.")
            return

        text = (
            f"Mr. Avery, {message.author.display_name} asked something that needs your input.\n\n"
            f"Discord user ID: {message.author.id}\n"
            f"Message: {message.content or '[no text content]'}"
        )
        await owner.send(text[:1900])
        append_log(self.config.log_path, f"Notified owner about DM from user {message.author.id}.")

    async def respond_to_atlas_prompt(self, message: discord.Message) -> None:
        if is_first_leo_intro(message, message.content or "", self.state):
            response = compose_leo_intro_response()
            self.state["leo_intro_sent"] = True
            save_state(self.config.state_path, self.state)
            mode = self.config.response_mode
            voice_path: Path | None = None

            if mode in {"voice", "both"}:
                voice_path = await generate_voice_file(self.config, response)

            if mode in {"text", "both"} or voice_path is None:
                await message.reply(response, mention_author=False)

            if voice_path is not None:
                try:
                    await message.channel.send(file=discord.File(str(voice_path), filename="atlas_reply.mp3"))
                finally:
                    try:
                        voice_path.unlink(missing_ok=True)
                    except OSError:
                        pass

            append_log(self.config.log_path, f"Sent Leo intro reply from Hey Atlas in mode {mode}.")
            return

        response = await generate_dm_answer(
            self.config,
            message.author.display_name,
            message.author.id,
            message.content or "",
        )
        mode = self.config.response_mode
        voice_path: Path | None = None

        if mode in {"voice", "both"}:
            voice_path = await generate_voice_file(self.config, response)

        if mode in {"text", "both"} or voice_path is None:
            await message.reply(response, mention_author=False)

        if voice_path is not None:
            try:
                await message.channel.send(file=discord.File(str(voice_path), filename="atlas_reply.mp3"))
            finally:
                try:
                    voice_path.unlink(missing_ok=True)
                except OSError:
                    pass

        append_log(self.config.log_path, f"Responded to Hey Atlas from user {message.author.id} in mode {mode}.")

    @tasks.loop(seconds=45)
    async def reminder_loop(self) -> None:
        if not self.config.owner_user_id:
            return

        now = current_local_time(self.config)
        checkpoint_results = [
            self._evaluate_checkpoint(now, "afternoon", time(15, 30)),
            self._evaluate_checkpoint(now, "evening", time(21, 30)),
        ]

        for should_send, state_key in checkpoint_results:
            if should_send:
                await self._send_owner_reminder(state_key)

    def _evaluate_checkpoint(self, now: datetime, label: str, checkpoint_time: time) -> tuple[bool, str]:
        state_key = f"last_{label}_reminder_date"
        today_key = now.date().isoformat()
        if self.state.get(state_key) == today_key:
            return False, state_key

        try:
            tzinfo = ZoneInfo(self.config.timezone)
        except ZoneInfoNotFoundError:
            tzinfo = now.tzinfo
        checkpoint = datetime.combine(now.date(), checkpoint_time, tzinfo=tzinfo)
        if now < checkpoint:
            return False, state_key

        last_check_in_raw = self.state.get("last_check_in")
        if last_check_in_raw:
            try:
                last_check_in = datetime.fromisoformat(last_check_in_raw)
            except ValueError:
                last_check_in = None
            if last_check_in is not None:
                if label == "afternoon" and last_check_in.astimezone(tzinfo).date() == now.date():
                    return False, state_key
                if label == "evening" and last_check_in.astimezone(tzinfo) >= checkpoint:
                    return False, state_key

        return True, state_key

    async def _send_owner_reminder(self, state_key: str) -> None:
        owner = await self.fetch_user(self.config.owner_user_id)
        if owner is None:
            append_log(self.config.log_path, f"Could not resolve owner user {self.config.owner_user_id}.")
            return

        text = compose_owner_prompt()
        await owner.send(text)

        if self.config.response_mode in {"voice", "both"}:
            voice_path = await generate_voice_file(self.config, text)
            if voice_path is not None:
                try:
                    await owner.send(file=discord.File(str(voice_path), filename="atlas_check_in.mp3"))
                finally:
                    try:
                        voice_path.unlink(missing_ok=True)
                    except OSError:
                        pass

        today_key = current_local_time(self.config).date().isoformat()
        self.state[state_key] = today_key
        save_state(self.config.state_path, self.state)
        append_log(self.config.log_path, f"Sent {state_key} reminder to owner {self.config.owner_user_id}.")


def print_sample(config: AtlasConfig) -> None:
    print("Sample Hey Atlas response:\n")
    print(compose_generic_response("Friend"))
    print("\nSample owner reminder:\n")
    print(compose_owner_prompt())


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run or preview the ATLAS Discord bot.")
    parser.add_argument("--print-sample", action="store_true", help="Print sample Hey Atlas and reminder messages.")
    parser.add_argument("--show-dani-log", action="store_true", help="Print the saved local Dani DM transcript.")
    parser.add_argument("--limit", type=int, default=10, help="Transcript entries to print.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    config = load_config()

    if args.print_sample:
        print_sample(config)
        return 0

    if args.show_dani_log:
        records = read_dm_transcript(config.transcript_path, user_id=DANI_USER_ID, limit=args.limit)
        print(format_dm_transcript(records))
        return 0

    if not config.discord_bot_token:
        raise SystemExit("DISCORD_BOT_TOKEN is not configured.")

    bot = AtlasDiscordBot(config)
    bot.run(config.discord_bot_token)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
