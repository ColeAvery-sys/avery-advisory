#!/usr/bin/env python3
"""Generate an MP3 from text or a PDF using the ElevenLabs TTS API."""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


DEFAULT_MODEL = "eleven_multilingual_v2"
DEFAULT_OUTPUT_FORMAT = "mp3_44100_128"
DEFAULT_OUTPUT_DIR = Path("atlas_ops/exports/audio")
DEFAULT_ATLAS_VOICE_ID = "YyqkX0AHv8W5D1vxG9lR"
DEFAULT_STABILITY = 0.65
DEFAULT_SIMILARITY_BOOST = 0.85
DEFAULT_STYLE = 0.20


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate an ElevenLabs MP3 from a text file, PDF, or raw text."
    )
    parser.add_argument(
        "--input-file",
        type=Path,
        help="Path to a .txt, .md, or .pdf file to read.",
    )
    parser.add_argument(
        "--text",
        help="Raw text to synthesize. Use this instead of --input-file when needed.",
    )
    parser.add_argument(
        "--voice-id",
        default=os.environ.get("ELEVENLABS_VOICE_ID", DEFAULT_ATLAS_VOICE_ID),
        help="ElevenLabs voice ID. Falls back to ELEVENLABS_VOICE_ID, then the ATLAS default voice.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Output MP3 path. Defaults to atlas_ops/exports/audio/<input-name>.mp3",
    )
    parser.add_argument(
        "--model-id",
        default=DEFAULT_MODEL,
        help=f"ElevenLabs model ID. Defaults to {DEFAULT_MODEL}.",
    )
    parser.add_argument(
        "--output-format",
        default=DEFAULT_OUTPUT_FORMAT,
        help=f"ElevenLabs output format. Defaults to {DEFAULT_OUTPUT_FORMAT}.",
    )
    parser.add_argument(
        "--stability",
        type=float,
        default=DEFAULT_STABILITY,
        help=f"Voice stability from 0.0 to 1.0. Defaults to {DEFAULT_STABILITY}.",
    )
    parser.add_argument(
        "--similarity-boost",
        type=float,
        default=DEFAULT_SIMILARITY_BOOST,
        help=f"Voice similarity boost from 0.0 to 1.0. Defaults to {DEFAULT_SIMILARITY_BOOST}.",
    )
    parser.add_argument(
        "--style",
        type=float,
        default=DEFAULT_STYLE,
        help=f"Voice style exaggeration from 0.0 to 1.0. Defaults to {DEFAULT_STYLE}.",
    )
    return parser.parse_args()


def extract_text(input_file: Path) -> str:
    suffix = input_file.suffix.lower()
    if suffix == ".pdf":
        from pypdf import PdfReader

        reader = PdfReader(str(input_file))
        return "\n\n".join((page.extract_text() or "").strip() for page in reader.pages).strip()

    return input_file.read_text(encoding="utf-8").strip()


def build_output_path(input_file: Path | None, requested_output: Path | None) -> Path:
    if requested_output:
        return requested_output

    stem = input_file.stem if input_file else "elevenlabs_output"
    output_dir = DEFAULT_OUTPUT_DIR
    output_dir.mkdir(parents=True, exist_ok=True)
    return output_dir / f"{stem}.mp3"


def generate_audio(
    *,
    api_key: str,
    voice_id: str,
    text: str,
    model_id: str,
    output_format: str,
    stability: float,
    similarity_boost: float,
    style: float,
    output_path: Path,
) -> None:
    query = urllib.parse.urlencode({"output_format": output_format})
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?{query}"
    payload = json.dumps(
        {
            "text": text,
            "model_id": model_id,
            "voice_settings": {
                "stability": stability,
                "similarity_boost": similarity_boost,
                "style": style,
            },
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "xi-api-key": api_key,
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            audio_bytes = response.read()
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"ElevenLabs request failed with HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Could not reach ElevenLabs: {exc.reason}") from exc

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(audio_bytes)


def main() -> int:
    args = parse_args()

    if not args.text and not args.input_file:
        print("Provide either --text or --input-file.", file=sys.stderr)
        return 2

    api_key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not api_key:
        print("ELEVENLABS_API_KEY is not set.", file=sys.stderr)
        return 2

    voice_id = args.voice_id.strip()
    if not voice_id:
        print("Provide --voice-id or set ELEVENLABS_VOICE_ID.", file=sys.stderr)
        return 2

    input_text = args.text.strip() if args.text else extract_text(args.input_file)
    if not input_text:
        print("No text was extracted from the source.", file=sys.stderr)
        return 2

    output_path = build_output_path(args.input_file, args.output)
    generate_audio(
        api_key=api_key,
        voice_id=voice_id,
        text=input_text,
        model_id=args.model_id,
        output_format=args.output_format,
        stability=args.stability,
        similarity_boost=args.similarity_boost,
        style=args.style,
        output_path=output_path,
    )

    print(output_path.resolve())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
