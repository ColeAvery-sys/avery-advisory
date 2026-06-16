from __future__ import annotations

from datetime import date
from pathlib import Path
from xml.sax.saxutils import escape
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "atlas_ops" / "exports" / "books" / "publish_ready_batch_2"


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
    return "".join(out).strip("_") or "book"


def paragraph(text: str, style: str | None = None) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    parts = text.split("\n")
    runs = "".join(
        f'<w:r><w:t xml:space="preserve">{escape(part)}</w:t></w:r>'
        + ("<w:r><w:br/></w:r>" if i < len(parts) - 1 else "")
        for i, part in enumerate(parts)
    )
    style_xml = f'<w:pPr><w:pStyle w:val="{style}"/></w:pPr>' if style else ""
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


BOOKS = [
    {
        "title": "Scriblings of a Polymath",
        "folder": "scribblings_of_a_polymath",
        "subtitle": "Essays on Becoming, Desire, and the Modern Self",
        "category": "Literary essays / cultural criticism",
        "package_note": "Best published as a compact essay chapbook after one final pass to smooth the most volatile edges.",
        "cover_direction": "Quiet editorial cover with a strong title block and textured neutral paper tone.",
        "keywords": ["essays", "identity", "transformation", "myth", "culture", "selfhood"],
        "blurb": "A compact essay collection about becoming oneself under pressure, how identity is shaped through struggle, and why modern culture keeps mistaking performance for truth.",
        "rights": "Original essay material by Cole Avery. The source document was a personal draft collection and no external text borrowings were detected.",
        "format": "Best as a slim trade paperback or ebook chapbook with restrained typography.",
        "sections": [
            ("Editorial Position", [
                "This package turns the source notes into a coherent essay chapbook. The voice stays reflective and direct, but the structure is cleaner: one essay on identity and transformation, one on cultural extraction, and a closing note on reverence versus consumption.",
            ]),
            ("Essay I - Becoming", [
                "A person is not born finished. The draft material argues that identity is something chosen, pressured, and refined over time. The strongest version of the piece treats becoming as an active discipline rather than a passive state.",
                "The through-line is simple: what survives scrutiny is not aesthetics alone, but the courage to keep becoming when the world insists on a narrower shape.",
            ]),
            ("Essay II - Extraction and Reverence", [
                "The second essay distinguishes between seeing someone as a symbol and honoring them as a person. It critiques the modern habit of extracting energy, attention, and image from people without keeping the meaning that made them compelling in the first place.",
                "The final point lands on a useful principle for the finished book: power without reverence becomes consumption; power with reverence becomes culture.",
            ]),
            ("Closing Note", [
                "The collection works best when published as a concise philosophical volume rather than a bloated manifesto. It is strongest when it stays personal, humane, and specific.",
            ]),
        ],
    },
    {
        "title": "Why You're Losing to Losers",
        "folder": "why_youre_losing_to_losers",
        "subtitle": "A Manifesto for Efficient Creation",
        "category": "Business essay / creator economy",
        "package_note": "Needs one compression pass in the essay body, but the core structure is strong enough for a short-form release.",
        "cover_direction": "Bold typographic cover, high contrast, no illustration required.",
        "keywords": ["creator economy", "efficiency", "systems", "content", "motivation", "workflow"],
        "blurb": "A hard-edged essay on why talent is not enough, why systems beat effort, and how creators lose time by trying to reinvent every post from scratch.",
        "rights": "Original creator essay by Cole Avery. The source text is a self-authored draft and no outside material was detected.",
        "format": "Best as a short trade paperback, ebook, or downloadable lead magnet.",
        "sections": [
            ("Manifesto", [
                "The core argument is that creators lose because they stay manual for too long. Efficiency is presented not as a corporate buzzword, but as a survival skill in a machine-like attention economy.",
                "The cleaned version should keep the direct tone while removing redundancy and turning the rant into a usable framework.",
            ]),
            ("The System Problem", [
                "The draft warns that posting harder is not the same as building leverage. The better move is to turn one idea into many outputs and one hour into a repeatable workflow.",
                "The book should keep the line that creation is not optional anymore. It is how people remain human when systems are designed to outpace them.",
            ]),
            ("Four-Panel Comic", [
                "Panel 1: a tired creator buried under notifications and pressure to post more.",
                "Panel 2: a faceless machine turning ideas into endless content.",
                "Panel 3: the creator slumped while the machine grows larger behind them.",
                "Panel 4: a simple, strong final hit about creating because expression matters, not because the algorithm demands it.",
            ]),
        ],
    },
    {
        "title": "Between the Lines",
        "folder": "between_the_lines",
        "subtitle": "A Short Experimental Manga About Escape",
        "category": "Experimental manga / visual narrative",
        "package_note": "Text is ready; the missing piece is actual illustration and layout production.",
        "cover_direction": "High-contrast black-and-white cover, nearly no copy, TV-screen framing device.",
        "keywords": ["manga", "visual storytelling", "escape", "negative space", "coming of age"],
        "blurb": "A concept manga built around mirrored black-and-white worlds, where a child watching TV and an anime hero become the same story from opposite sides.",
        "rights": "Original visual-story concept by Cole Avery. No third-party story text was used.",
        "format": "Best as a digital comic or printed zine with a strong visual grid.",
        "sections": [
            ("Concept", [
                "This is a page design book as much as a story. The panel layout carries the emotional reveal: the real world is black-dominant, the anime world is white-dominant, and the negative space tells the reader what the character cannot say directly.",
            ]),
            ("Page Sequence", [
                "Pages one through four alternate between the real room, the anime world, and the adult artist drawing the whole thing.",
                "The final page resolves into a CRT television shape, and the power light becomes the child's silhouette.",
            ]),
            ("Final Line", [
                "The ending lands on a simple thesis: some kids escape into TV, but others escape into the panels themselves.",
            ]),
        ],
    },
    {
        "title": "What You Call Freedom",
        "folder": "what_you_call_freedom",
        "subtitle": "A Lyric Duel Between Lucifer and Zane",
        "category": "Lyric poem / song text",
        "package_note": "Publishing-ready as a lyric booklet now; it becomes stronger if paired with recorded music or a soundtrack release.",
        "cover_direction": "Dark pop cover with stage-light contrast and a dramatic lyric-sheet aesthetic.",
        "keywords": ["lyrics", "duet", "freedom", "rebellion", "mythic", "dark pop"],
        "blurb": "A lyric sheet framed as a confrontation between a rebel and the figure who believes rebellion can become a new form of domination.",
        "rights": "Original song lyric draft by Cole Avery. The material is self-authored and does not borrow outside text.",
        "format": "Best as a lyric chapbook, soundtrack booklet, or supplemental story text.",
        "sections": [
            ("Song Structure", [
                "The source is already close to final: verses, pre-chorus, chorus, bridge, and final verse. The publishing job is primarily formatting and presentation.",
            ]),
            ("Core Theme", [
                "The song's argument is that power can distort liberation when one person decides what freedom should look like for everyone else.",
                "That makes it useful as a companion piece to the Black Halo material because it captures the conflict between idealism, control, and moral compromise.",
            ]),
        ],
    },
    {
        "title": "Pluto Dies Writing",
        "folder": "pluto_dies_writing",
        "subtitle": "Greed District, Scene One",
        "category": "Dark fantasy / character vignette",
        "package_note": "Works cleanly as a short chapbook chapter, but would benefit from expansion if you want it sold as a standalone novella.",
        "cover_direction": "Neon casino imagery with ruined gold accents and a single character focus.",
        "keywords": ["dark fantasy", "greed district", "character monologue", "devil fiction", "vignette"],
        "blurb": "A short character piece set inside the Hypno Casino, where the King of Greed realizes sacrifice has finally made him human.",
        "rights": "Original prose vignette by Cole Avery. The draft is self-authored and does not use external source text.",
        "format": "Best as a short story, chapbook, or bonus volume in a larger mythic-fiction line.",
        "sections": [
            ("The Scene", [
                "The piece opens in the ruined luxury of the Hypno Casino after a violent collapse. Pluto, bruised and nearly spent, protects a vulnerable companion and realizes the district's endless appetite means nothing if he cannot choose one person over the machine.",
                "The scene works because it turns greed into sacrifice instead of reward.",
            ]),
            ("Publishing Note", [
                "This reads best as a sharp novella chapter or a prologue volume. It is short, but it has a complete emotional turn and a strong visual identity.",
            ]),
        ],
    },
    {
        "title": "Sacred Texts of the Pagan Temple of Dionysus",
        "folder": "sacred_texts_of_the_pagan_temple_of_dionysus",
        "subtitle": "A Codex of Liberation, Community, and Ritual",
        "category": "Mythic doctrine / worldbook",
        "package_note": "Best published as a worldbook or codex; keep the doctrinal framing clearly fictional and brand-safe.",
        "cover_direction": "Ceremonial cover with laurel, cup, and vine imagery; premium paper treatment.",
        "keywords": ["myth", "doctrine", "ritual", "community", "Dionysus", "worldbuilding"],
        "blurb": "A structured sacred-text volume that turns the Dionysian worldbuilding into a clean doctrine of liberation, reciprocity, and creative practice.",
        "rights": "Original mythic doctrine and worldbuilding by Cole Avery. The text uses public mythological figures and original prose structure; no external borrowings were detected.",
        "format": "Best as a premium paperback or ebook with strong section hierarchy.",
        "sections": [
            ("Codex Structure", [
                "The source material already divides itself into four books: the mythic age, the mortal age, the living age, and the doctrinal age. That gives the finished book a clear spine.",
            ]),
            ("Book I - The Old Vines", [
                "Control is named as the old harm. Suppression becomes the source of corruption, and Dionysus arrives as the figure who says what is hidden does not disappear; it poisons.",
            ]),
            ("Book II - The Broken House", [
                "This section shifts into a tragic mortal story about leaving a house of still air and choosing movement over obedience.",
            ]),
            ("Book III - The Wild Gospel", [
                "Identity is presented as motion, not a fixed assignment. Love is framed as truth rather than ownership.",
            ]),
            ("Book IV - The Laws of the Feast", [
                "The doctrinal section is the most publishable material in the source: live fully, feel deeply, connect freely without shame. The rest of the text builds outward from that line.",
            ]),
        ],
    },
    {
        "title": "Eclipse Garden: The Great Fissure",
        "folder": "eclipse_garden_the_great_fissure",
        "subtitle": "A Mythic Fantasy Bible",
        "category": "Mythic fantasy / series bible",
        "package_note": "This is publishable as a pitch bible or companion book, but it is not yet a full consumer novel.",
        "cover_direction": "Epic landscape cover with the mountain fissure and relic glow, designed like a premium series bible.",
        "keywords": ["mythic fantasy", "series bible", "Olympus", "Appalachia", "relics", "rebellion"],
        "blurb": "A high-concept series bible where Olympus rises beneath Appalachia, divine relics awaken in mortals, and rebellion becomes a sacred response to tyranny.",
        "rights": "Original worldbuilding by Cole Avery. The concept draws on Greek myth and Appalachian imagery, which are public-domain or broadly cultural references, not copied source text.",
        "format": "Best as a premium paperback or pitch book with bold section dividers.",
        "sections": [
            ("Premise", [
                "In the source draft, a total solar eclipse triggers the eruption of Olympus beneath the Appalachian mountains. The resulting fissure splits the world, awakens gods, and forces humanity to decide whether proof of divinity is salvation or a new form of oppression.",
            ]),
            ("Core Themes", [
                "Faith versus freedom, mortality as divinity, rebellion as worship, and grief as the glue that binds the cast together.",
            ]),
            ("Relic System", [
                "The relic tiers move from spark to blood to soul to divine. Each relic reflects virtue and flaw at the same time, which gives the power system a moral cost instead of just a scaling ladder.",
            ]),
            ("Broken Flame", [
                "The rebellion group works because it reads like a real team: mentors, tacticians, mortal prodigies, healers, and a moral center that does not depend on anyone being perfect.",
            ]),
        ],
    },
]


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
        "# Publish-Ready Book Packages - Batch 2",
        "",
        f"Generated for Mr. Avery on {date.today().isoformat()}.",
        "",
    ]

    for book in BOOKS:
        folder = OUT_DIR / str(book["folder"])
        folder.mkdir(parents=True, exist_ok=True)

        manuscript_path = folder / "manuscript.docx"
        write_docx(
            manuscript_path,
            str(book["title"]),
            str(book["subtitle"]),
            f"Copyright (c) {date.today().year} Cole Avery. All rights reserved.",
            str(book["package_note"]),
            book["sections"],  # type: ignore[arg-type]
        )

        metadata = {
            "title": book["title"],
            "subtitle": book["subtitle"],
            "author": "Cole Avery",
            "category": book["category"],
            "package_note": book["package_note"],
            "cover_direction": book["cover_direction"],
            "keywords": book["keywords"],
            "blurb": book["blurb"],
            "rights": book["rights"],
            "format": book["format"],
        }

        (folder / "metadata.md").write_text(package_text(metadata), encoding="utf-8")
        (folder / "README.md").write_text(
            "\n".join(
                [
                    f"# {book['title']}",
                    "",
                    "File: `manuscript.docx`",
                    f"Subtitle: {book['subtitle']}",
                    f"Category: {book['category']}",
                    "",
                    "This folder contains the publish-ready package for the manuscript, including rights notes and back-cover copy.",
                ]
            ),
            encoding="utf-8",
        )

        index_lines.append(f"- `{book['folder']}`")

    (OUT_DIR / "README.md").write_text("\n".join(index_lines), encoding="utf-8")


if __name__ == "__main__":
    main()
