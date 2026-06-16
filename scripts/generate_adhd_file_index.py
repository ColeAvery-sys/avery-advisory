from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "FILE_DATE_INDEX.md"
EXCLUDED_DIRS = {"dist", "node_modules", ".git"}


def main():
    files = []
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        if any(part in EXCLUDED_DIRS for part in path.parts):
            continue
        if path == OUTPUT:
            continue
        stat = path.stat()
        rel = path.relative_to(ROOT).as_posix()
        files.append(
            {
                "path": rel,
                "modified": datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d"),
                "category": categorize(rel),
            }
        )

    files.sort(key=lambda item: (item["category"], item["path"].lower()))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(render(files), encoding="utf-8")
    print(f"Wrote {OUTPUT}")
    print(f"Indexed {len(files)} files.")


def categorize(path: str) -> str:
    lower = path.lower()
    if lower.startswith("atlas_ops/"):
        return "Ops"
    if lower.startswith("docs/"):
        return "Docs"
    if lower.startswith("executive reports/"):
        return "Executive Reports"
    if lower.startswith("scripts/"):
        return "Scripts"
    if lower.endswith(".test.ts") or lower.endswith(".test.js"):
        return "Tests"
    if lower.endswith(".demo.ts") or lower.endswith(".demo.js"):
        return "Demos"
    if lower.endswith(".md"):
        return "Roadmap Docs"
    if lower.endswith(".ts") or lower.endswith(".js"):
        return "Systems"
    if lower.endswith(".csv"):
        return "CSV"
    if lower.endswith(".xlsx"):
        return "Workbook"
    return "Other"


def render(files):
    today = datetime.now().strftime("%Y-%m-%d")
    lines = [
        "# File Date Index",
        "",
        f"Generated: {today}",
        "",
        "Purpose: dated file inventory for ADHD-friendly navigation and maintenance.",
        "",
        "Rules:",
        "",
        "- Use this when you cannot remember what exists.",
        "- Do not rename source files just to organize them; use this index first.",
        "- Ignore `dist/` and `node_modules/`; they are generated/dependency folders.",
        "",
        "| Category | Modified | File |",
        "| --- | --- | --- |",
    ]
    for item in files:
        lines.append(f"| {item['category']} | {item['modified']} | `{item['path']}` |")
    lines.append("")
    return "\n".join(lines)


if __name__ == "__main__":
    main()
