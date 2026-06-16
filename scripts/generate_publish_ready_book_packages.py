from __future__ import annotations

import importlib.util
from datetime import date
from pathlib import Path
from xml.sax.saxutils import escape
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parent.parent
SOURCE_SCRIPT = ROOT / "scripts" / "generate_first_final_book_drafts.py"
OUT_DIR = ROOT / "atlas_ops" / "exports" / "books" / "publish_ready"


def load_source_module():
    spec = importlib.util.spec_from_file_location("first_final_book_drafts", SOURCE_SCRIPT)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Could not load {SOURCE_SCRIPT}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


SRC = load_source_module()


def slugify(text: str) -> str:
    text = text.lower()
    out = []
    last_underscore = False
    for ch in text:
        if ch.isalnum():
            out.append(ch)
            last_underscore = False
        elif not last_underscore:
            out.append("_")
            last_underscore = True
    slug = "".join(out).strip("_")
    return slug or "book"


def paragraph(text: str, style: str | None = None) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    parts = text.split("\n")
    runs = "".join(
        f"<w:r><w:t xml:space=\"preserve\">{escape(part)}</w:t></w:r>"
        + ("<w:r><w:br/></w:r>" if i < len(parts) - 1 else "")
        for i, part in enumerate(parts)
    )
    style_xml = f"<w:pPr><w:pStyle w:val=\"{style}\"/></w:pPr>" if style else ""
    return f"<w:p>{style_xml}{runs}</w:p>"


def page_break() -> str:
    return "<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>"


def styles_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:after="160" w:line="276" w:lineRule="auto"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Garamond" w:hAnsi="Garamond"/><w:sz w:val="24"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:qFormat/>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr>
    <w:rPr><w:b/><w:rFonts w:ascii="Garamond" w:hAnsi="Garamond"/><w:sz w:val="44"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:qFormat/>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr>
    <w:rPr><w:i/><w:rFonts w:ascii="Garamond" w:hAnsi="Garamond"/><w:sz w:val="28"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>
    <w:pPr><w:spacing w:before="300" w:after="160"/></w:pPr>
    <w:rPr><w:b/><w:rFonts w:ascii="Garamond" w:hAnsi="Garamond"/><w:sz w:val="32"/></w:rPr>
  </w:style>
</w:styles>"""


def write_docx(
    path: Path,
    title: str,
    subtitle: str,
    copyright_text: str,
    package_note: str,
    sections: list[tuple[str, list[str]]],
) -> None:
    body = [
        paragraph(title, "Title"),
        paragraph(subtitle, "Subtitle"),
        paragraph("Author: Cole Avery"),
        paragraph(f"Copyright notice: {copyright_text}"),
        paragraph(f"Publication note: {package_note}"),
        paragraph(f"Edition prepared on {date.today().isoformat()}"),
        page_break(),
    ]
    for heading, paras in sections:
        body.append(paragraph(heading, "Heading1"))
        for para in paras:
            body.append(paragraph(para))
        body.append(page_break())
    document = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {''.join(body)}
    <w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>
  </w:body>
</w:document>"""
    with ZipFile(path, "w", ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>""")
        z.writestr("_rels/.rels", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>""")
        z.writestr("word/_rels/document.xml.rels", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>""")
        z.writestr("word/styles.xml", styles_xml())
        z.writestr("word/document.xml", document)


PUBLISH_INFO = {
    "The Avery Notes": {
        "folder": "the_avery_notes",
        "subtitle": "Meditations of a Modern Polymath - Volume I",
        "author": "Cole Avery",
        "category": "Literary nonfiction / philosophical memoir",
        "package_note": "Best treated as a literary memoir/essay volume. Final consumer release should keep the prose sharp, restrained, and lightly redesigned for a 6x9 trade format.",
        "cover_direction": "Minimal monochrome cover, serif title, matte finish, understated author mark.",
        "keywords": ["memoir", "philosophy", "discipline", "technology", "identity", "modern life"],
        "blurb": "A field record from a builder trying to stay human inside the modern machine. The book moves through identity, algorithmic life, discipline, love, mortality, and the cost of performance.",
        "rights": "Original manuscript by Cole Avery. Source material comes from the user's own draft notes and no external borrowings were detected in the source doc.",
        "format": "Best as a 6x9 trade paperback and ebook. Garamond or a similar serif body face works well.",
    },
    "The Dojo Cookbook": {
        "folder": "the_dojo_cookbook",
        "subtitle": "Volume One: Ashes and Appetite",
        "author": "Cole Avery",
        "category": "Shonen / action / found-family fiction",
        "package_note": "Strongest as a publishable illustrated novel or manga-style text book once visual assets are assigned.",
        "cover_direction": "Warm food-forward cover with motion and community cues, high contrast, no clutter.",
        "keywords": ["shonen", "food", "martial arts", "community", "found family", "mutual aid"],
        "blurb": "A hungry fighter learns that strength is communal, food is not a reward, and the people around you are not distractions from the story, they are the story.",
        "rights": "Original fiction based on the user's draft manuscript. Martial arts, food, and found-family themes are genre conventions; no external text borrowings were detected.",
        "format": "Best as an illustrated paperback, manga adaptation, or ebook. Plan for 6x9 trim if prose-first, larger if art-first.",
    },
    "Pandemic Novel": {
        "folder": "pandemic_novel",
        "subtitle": "A Family Under Lockdown",
        "author": "Cole Avery",
        "category": "Domestic suspense / speculative fiction",
        "package_note": "Needs one final continuity pass on names, chapter cadence, and the emotional arc before release.",
        "cover_direction": "Cinematic rural isolation, cold light, understated disaster imagery, no stock-photo feel.",
        "keywords": ["pandemic", "family drama", "lockdown", "medical suspense", "survival", "domestic fiction"],
        "blurb": "A farmhouse becomes a pressure cooker when lockdown, rationing, and illness force one family to choose between fear and responsibility.",
        "rights": "Original manuscript by the user. No external source text was detected in the draft material; the pandemic setting is a fictional premise.",
        "format": "Best for ebook and 6x9 trade paperback with a restrained cinematic cover.",
    },
    "Salvation: Book 1": {
        "folder": "salvation_book_1",
        "subtitle": "The Chosen Vine",
        "author": "Cole Avery",
        "category": "Gothic psychological romance / suspense",
        "package_note": "The text is strong, but the ending should get one final tension pass before a commercial release.",
        "cover_direction": "Dark botanical cover with a single vine motif, subdued gold or green accents, elegant serif typography.",
        "keywords": ["gothic", "psychological", "cult fiction", "religion", "obsession", "forbidden attraction"],
        "blurb": "A faithful girl meets a man who seems to understand the fracture inside her before she does. The more seen she feels, the harder it becomes to tell salvation from surrender.",
        "rights": "Original prose draft by the user. Religious language and cult imagery are thematic choices, not sourced text. No external borrowings were detected.",
        "format": "Best as an ebook and 6x9 trade paperback with a moody dark cover.",
    },
    "The Book of the Twice-Born King": {
        "folder": "the_book_of_the_twice_born_king",
        "subtitle": "The First Vine: Of Awakening",
        "author": "Cole Avery",
        "category": "Mythic fantasy / sacred text fiction",
        "package_note": "Ready as a premium mythic text; keep the chapter cadence clean and formal in the final layout.",
        "cover_direction": "Symbolic crown-and-root imagery, premium paper look, high-contrast gold and green.",
        "keywords": ["mythic fantasy", "scripture", "prophecy", "roots", "rebirth", "king"],
        "blurb": "A scripture-shaped fantasy about a vine that awakens below the world and a twice-born king who refuses the throne in order to awaken the sleeping.",
        "rights": "Original prose pastiche by the user. The biblical cadence is stylistic influence only, not a quotation of protected text. No external borrowings were detected.",
        "format": "Best as a premium paperback or ebook with chapter-like design.",
    },
    "Olympus Rewritten": {
        "folder": "olympus_rewritten",
        "subtitle": "A Mythic Romance Anthology",
        "author": "Cole Avery",
        "category": "Mythic romance / anthology fiction",
        "package_note": "Works as a clean anthology package once the chapter order is finalized and the tone remains centered on repair and consent.",
        "cover_direction": "Luminous marble-and-constellation cover with a premium anthology feel.",
        "keywords": ["mythology", "romance", "anthology", "consent", "constellations", "repair"],
        "blurb": "Olympian relationships become literal constellations when honesty, consent, and repair replace jealousy and possession. A temple of many binds the stories together.",
        "rights": "Uses public-domain mythological figures and an original plot/prose structure. No copyrighted retellings or external text borrowings were detected.",
        "format": "Best as a trade paperback or illustrated ebook with a refined interior layout.",
    },
    "Black Halo": {
        "folder": "black_halo",
        "subtitle": "Manga Pilot: Authority Claimed From Below",
        "author": "Cole Avery",
        "category": "Dark shonen / occult action fiction",
        "package_note": "Best published as an issue-zero, pilot booklet, or illustrated proof-of-concept until the first chapter sequence is expanded.",
        "cover_direction": "Black, gold, and crimson symbolic cover with strong halo iconography and high contrast.",
        "keywords": ["anime", "occult", "angels", "demons", "rebellion", "found family"],
        "blurb": "A boy with a forbidden halo becomes proof that holiness is not granted from above. The state wants a monster. His friends want a person.",
        "rights": "Original IP based on the user's Black Halo notes and worldbuilding. The empty 'Manga Black Halo' doc was not used as source text; no external borrowings were detected.",
        "format": "Best as a pilot booklet, graphic novel issue, or illustrated book.",
    },
}


def manuscript_sections(book_title: str, sections: list[tuple[str, list[str]]]) -> list[tuple[str, list[str]]]:
    return sections


def package_text(info: dict[str, object]) -> str:
    keywords = ", ".join(info["keywords"])  # type: ignore[index]
    return "\n".join(
        [
            f"Title: {info['title']}",
            f"Subtitle: {info['subtitle']}",
            f"Author: {info['author']}",
            f"Category: {info['category']}",
            f"Package note: {info['package_note']}",
            f"Cover direction: {info['cover_direction']}",
            f"Keywords: {keywords}",
            "",
            "Back-cover copy:",
            str(info["blurb"]),
            "",
            "Rights check:",
            str(info["rights"]),
            "",
            "Format notes:",
            str(info["format"]),
        ]
    )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    index_lines = [
        "# Publish-Ready Book Packages",
        "",
        f"Generated for Mr. Avery on {date.today().isoformat()}.",
        "",
    ]
    for book in SRC.BOOKS:
        title = book["title"]
        info = PUBLISH_INFO[title]
        folder = OUT_DIR / str(info["folder"])
        folder.mkdir(parents=True, exist_ok=True)

        manuscript_path = folder / "manuscript.docx"
        write_docx(
            manuscript_path,
            title,
            str(info["subtitle"]),
            f"Copyright (c) {date.today().year} Cole Avery. All rights reserved.",
            str(info["package_note"]),
            manuscript_sections(title, book["sections"]),
        )

        metadata_path = folder / "metadata.md"
        metadata_path.write_text(package_text({"title": title, **info}), encoding="utf-8")

        readme_path = folder / "README.md"
        readme_path.write_text(
            "\n".join(
                [
                    f"# {title}",
                    "",
                    f"File: `manuscript.docx`",
                    f"Subtitle: {info['subtitle']}",
                    f"Category: {info['category']}",
                    "",
                    "This folder contains the publish-ready package for the manuscript, including rights notes and back-cover copy.",
                ]
            ),
            encoding="utf-8",
        )

        index_lines.append(f"- `{folder.relative_to(OUT_DIR)}`")
    (OUT_DIR / "README.md").write_text("\n".join(index_lines), encoding="utf-8")
    print(f"Generated publish-ready packages in {OUT_DIR}")


if __name__ == "__main__":
    main()
