from __future__ import annotations

import html
import math
import re
import shutil
import textwrap
import zipfile
from dataclasses import dataclass
from datetime import date
from hashlib import sha1
from pathlib import Path
from typing import Iterable
from xml.etree import ElementTree as ET

from PIL import Image, ImageDraw, ImageFilter, ImageFont
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import portrait
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIRS = [
    ROOT / "atlas_ops" / "exports" / "books" / "publish_ready",
    ROOT / "atlas_ops" / "exports" / "books" / "publish_ready_batch_2",
]
OUT_DIR = ROOT / "atlas_ops" / "exports" / "books" / "final_release"

AUTHOR_BIO = (
    "Cole Avery is an independent writer and creator working across memoir, "
    "fiction, mythology, visual storytelling, and systems-driven creative work."
)
PUBLISHER = "Avery Industries LLC"
IMPRINT = "Avery Publishing"
ISBN_STATUS = "Not assigned yet"

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W}


@dataclass
class BookPackage:
    title: str
    subtitle: str
    author: str
    category: str
    package_note: str
    cover_direction: str
    keywords: list[str]
    blurb: str
    rights: str
    format_notes: str
    source_dir: Path
    slug: str
    manuscript_path: Path
    metadata_path: Path
    cover_path: Path
    epub_path: Path
    pdf_path: Path
    release_path: Path


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


def parse_metadata(path: Path) -> dict[str, str]:
    fields: dict[str, str] = {}
    lines = path.read_text(encoding="utf-8").splitlines()
    current_key: str | None = None
    sections: dict[str, list[str]] = {
        "Back-cover copy": [],
        "Rights check": [],
        "Format notes": [],
    }
    section: str | None = None

    for line in lines:
        if line.startswith("Back-cover copy:"):
            section = "Back-cover copy"
            continue
        if line.startswith("Rights check:"):
            section = "Rights check"
            continue
        if line.startswith("Format notes:"):
            section = "Format notes"
            continue
        if section:
            sections[section].append(line)
            continue
        if ":" in line:
            key, value = line.split(":", 1)
            fields[key.strip()] = value.strip()

    fields["Back-cover copy"] = "\n".join(sections["Back-cover copy"]).strip()
    fields["Rights check"] = "\n".join(sections["Rights check"]).strip()
    fields["Format notes"] = "\n".join(sections["Format notes"]).strip()
    return fields


def parse_docx_blocks(docx_path: Path) -> list[tuple[str, str | tuple[str, str]]]:
    blocks: list[tuple[str, str | tuple[str, str]]] = []
    with zipfile.ZipFile(docx_path) as z:
        root = ET.fromstring(z.read("word/document.xml"))

    body = root.find("w:body", NS)
    if body is None:
        return blocks

    seen_break = False
    for p in body.findall("w:p", NS):
        style_el = p.find("w:pPr/w:pStyle", NS)
        style = style_el.get(f"{{{W}}}val") if style_el is not None else ""
        text_parts = [
            node.text or ""
            for node in p.findall(".//w:t", NS)
        ]
        text = "".join(text_parts).replace("\u000b", "\n").strip()
        has_page_break = p.find(".//w:br[@w:type='page']", NS) is not None or p.find(".//w:br[@type='page']", NS) is not None

        if not seen_break:
            if has_page_break:
                seen_break = True
            continue

        if has_page_break and not text:
            blocks.append(("pagebreak", ""))
            continue

        if not text:
            continue

        if style in {"Heading1", "Heading2", "Heading3", "TITLE", "Title"}:
            blocks.append(("heading", (style, text)))
        else:
            blocks.append(("para", text))

    return blocks


def load_packages() -> list[BookPackage]:
    packages: list[BookPackage] = []
    for source_dir in SOURCE_DIRS:
        for book_dir in sorted(source_dir.iterdir()):
            if not book_dir.is_dir():
                continue
            metadata_path = book_dir / "metadata.md"
            manuscript_path = book_dir / "manuscript.docx"
            if not metadata_path.exists() or not manuscript_path.exists():
                continue

            metadata = parse_metadata(metadata_path)
            slug = book_dir.name
            final_dir = OUT_DIR / slug
            packages.append(
                BookPackage(
                    title=metadata["Title"],
                    subtitle=metadata["Subtitle"],
                    author=metadata["Author"],
                    category=metadata["Category"],
                    package_note=metadata.get("Package note", ""),
                    cover_direction=metadata.get("Cover direction", ""),
                    keywords=[k.strip() for k in metadata.get("Keywords", "").split(",") if k.strip()],
                    blurb=metadata["Back-cover copy"],
                    rights=metadata["Rights check"],
                    format_notes=metadata["Format notes"],
                    source_dir=book_dir,
                    slug=slug,
                    manuscript_path=final_dir / "manuscript.docx",
                    metadata_path=final_dir / "metadata.md",
                    cover_path=final_dir / "cover.png",
                    epub_path=final_dir / "ebook.epub",
                    pdf_path=final_dir / "print.pdf",
                    release_path=final_dir / "release.md",
                )
            )
    return packages


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size)


FONT_SERIF = r"C:\Windows\Fonts\georgia.ttf"
FONT_SERIF_BOLD = r"C:\Windows\Fonts\georgiab.ttf"
FONT_SANS = r"C:\Windows\Fonts\arial.ttf"
FONT_SANS_BOLD = r"C:\Windows\Fonts\arialbd.ttf"


def palette_for(book: BookPackage) -> tuple[tuple[int, int, int], tuple[int, int, int], tuple[int, int, int]]:
    title = book.title.lower()
    category = book.category.lower()
    seed = int(sha1(title.encode("utf-8")).hexdigest()[:8], 16)

    if "black halo" in title:
        return (8, 8, 10), (210, 176, 72), (190, 30, 50)
    if "dojo" in title:
        return (38, 25, 18), (240, 162, 60), (247, 231, 204)
    if "pandemic" in title:
        return (30, 39, 49), (199, 214, 226), (120, 160, 138)
    if "salvation" in title:
        return (16, 31, 20), (173, 146, 84), (235, 225, 195)
    if "twice-born" in title:
        return (18, 29, 20), (210, 185, 88), (232, 238, 222)
    if "olympus" in title:
        return (24, 36, 68), (230, 232, 240), (156, 190, 226)
    if "avery notes" in title:
        return (20, 20, 22), (223, 223, 223), (126, 126, 126)
    if "scribblings" in title:
        return (238, 233, 222), (29, 29, 30), (90, 82, 74)
    if "losing to losers" in title:
        return (18, 18, 18), (220, 220, 220), (44, 171, 227)
    if "between the lines" in title:
        return (245, 245, 245), (20, 20, 20), (80, 80, 80)
    if "what you call freedom" in title:
        return (20, 12, 22), (233, 210, 244), (250, 84, 129)
    if "pluto dies" in title:
        return (24, 17, 10), (248, 193, 90), (246, 81, 37)
    if "sacred texts" in title:
        return (18, 35, 23), (231, 210, 122), (221, 234, 217)
    if "eclipse garden" in title:
        return (20, 37, 34), (211, 223, 215), (244, 143, 58)

    if "mythic" in category or "fantasy" in category:
        return (22, 28, 58), (235, 223, 175), (114, 151, 195)
    if "essay" in category:
        return (236, 231, 219), (30, 30, 30), (116, 116, 116)
    if "manga" in category or "shonen" in category:
        return (15, 15, 20), (250, 250, 250), (200, 49, 72)

    base = seed & 0xFF
    return (20 + base % 40, 20 + (base // 2) % 40, 20 + (base // 3) % 40), (230, 230, 230), (140, 100, 170)


def wrap_title(title: str, font_obj: ImageFont.FreeTypeFont, max_width: int, draw: ImageDraw.ImageDraw) -> str:
    words = title.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if draw.textbbox((0, 0), candidate, font=font_obj)[2] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return "\n".join(lines)


def fit_font(draw: ImageDraw.ImageDraw, text: str, max_width: int, max_size: int, min_size: int, font_path: str, bold: bool = False) -> ImageFont.FreeTypeFont:
    for size in range(max_size, min_size - 1, -2):
        f = font(font_path, size)
        lines = text.split("\n")
        width = max(draw.textbbox((0, 0), line, font=f)[2] for line in lines)
        if width <= max_width:
            return f
    return font(font_path, min_size)


def generate_cover(book: BookPackage) -> None:
    bg, fg, accent = palette_for(book)
    img = Image.new("RGB", (1600, 2400), bg)
    draw = ImageDraw.Draw(img)

    # background texture and framing
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    odraw.rectangle((90, 90, 1510, 2310), outline=fg + (70,), width=4)
    odraw.rectangle((118, 118, 1482, 2282), outline=accent + (45,), width=2)
    for i in range(8):
        alpha = 16 - i
        odraw.rectangle((140 + i * 20, 180 + i * 22, 1460 - i * 20, 2200 - i * 22), outline=accent + (alpha,), width=2)
    overlay = overlay.filter(ImageFilter.GaussianBlur(0.3))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    # top label
    label_font = font(FONT_SANS_BOLD, 42)
    label = book.category.upper()
    draw.text((140, 140), label, fill=accent, font=label_font)

    # title
    title_font = fit_font(draw, book.title, 1180, 120, 64, FONT_SERIF_BOLD)
    wrapped_title = wrap_title(book.title, title_font, 1180, draw)
    title_bbox = draw.multiline_textbbox((0, 0), wrapped_title, font=title_font, spacing=18, align="left")
    title_h = title_bbox[3] - title_bbox[1]
    draw.multiline_text((140, 720), wrapped_title, fill=fg, font=title_font, spacing=18, align="left")

    # subtitle
    subtitle_font = fit_font(draw, book.subtitle, 1200, 52, 28, FONT_SERIF)
    sub_top = 720 + title_h + 90
    draw.multiline_text((142, sub_top), book.subtitle, fill=accent, font=subtitle_font, spacing=10, align="left")

    # decorative rule
    draw.rectangle((140, 2000, 1460, 2008), fill=accent)
    draw.rectangle((140, 2024, 1180, 2030), fill=fg)

    # author and imprint
    author_font = font(FONT_SANS_BOLD, 44)
    small_font = font(FONT_SANS, 30)
    draw.text((140, 2070), book.author, fill=fg, font=author_font)
    draw.text((140, 2130), f"{IMPRINT} | {PUBLISHER}", fill=accent, font=small_font)
    draw.text((140, 2185), f"Prepared {date.today().isoformat()}", fill=accent, font=small_font)

    img.save(book.cover_path, format="PNG")


def build_story_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="TitlePageTitle", parent=styles["Title"], fontName="Times-Bold", fontSize=24, leading=28, alignment=TA_CENTER, spaceAfter=10))
    styles.add(ParagraphStyle(name="TitlePageSubtitle", parent=styles["Normal"], fontName="Times-Italic", fontSize=13, leading=16, alignment=TA_CENTER, spaceAfter=8))
    styles.add(ParagraphStyle(name="TitlePageMeta", parent=styles["Normal"], fontName="Times-Roman", fontSize=10, leading=13, alignment=TA_CENTER, spaceAfter=4))
    styles.add(ParagraphStyle(name="BodyTextBook", parent=styles["BodyText"], fontName="Times-Roman", fontSize=10.5, leading=14.5, alignment=TA_JUSTIFY, spaceAfter=6))
    styles.add(ParagraphStyle(name="HeadingBook1", parent=styles["Heading1"], fontName="Times-Bold", fontSize=16, leading=19, spaceBefore=10, spaceAfter=8, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name="HeadingBook2", parent=styles["Heading2"], fontName="Times-Bold", fontSize=13, leading=16, spaceBefore=9, spaceAfter=7, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name="HeadingBook3", parent=styles["Heading3"], fontName="Times-BoldItalic", fontSize=11.5, leading=14, spaceBefore=7, spaceAfter=5, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name="SmallBook", parent=styles["Normal"], fontName="Times-Roman", fontSize=9.5, leading=12, alignment=TA_LEFT, spaceAfter=4))
    return styles


def pdf_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Times-Roman", 9)
    canvas.setFillColor(colors.grey)
    canvas.drawRightString(doc.pagesize[0] - 0.55 * inch, 0.45 * inch, str(doc.page))
    canvas.restoreState()


def render_pdf(book: BookPackage, blocks: list[tuple[str, str | tuple[str, str]]]) -> None:
    styles = build_story_styles()
    page_size = portrait((6 * inch, 9 * inch))
    doc = SimpleDocTemplate(
        str(book.pdf_path),
        pagesize=page_size,
        leftMargin=0.65 * inch,
        rightMargin=0.65 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
        title=book.title,
        author=book.author,
    )

    story: list[object] = []
    story.append(Paragraph(book.title, styles["TitlePageTitle"]))
    story.append(Paragraph(book.subtitle, styles["TitlePageSubtitle"]))
    story.append(Paragraph(book.author, styles["TitlePageMeta"]))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(IMPRINT, styles["TitlePageMeta"]))
    story.append(Paragraph(PUBLISHER, styles["TitlePageMeta"]))
    story.append(Paragraph(f"Prepared {date.today().isoformat()}", styles["TitlePageMeta"]))
    story.append(Spacer(1, 0.25 * inch))
    story.append(Paragraph(f"Publication note: {book.package_note}", styles["SmallBook"]))
    story.append(Paragraph(f"Cover direction: {book.cover_direction}", styles["SmallBook"]))
    story.append(PageBreak())

    story.append(Paragraph(book.title, styles["HeadingBook1"]))
    story.append(Paragraph(book.subtitle, styles["BodyTextBook"]))
    story.append(Paragraph(f"Category: {book.category}", styles["SmallBook"]))
    story.append(Paragraph(f"Keywords: {', '.join(book.keywords)}", styles["SmallBook"]))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph(book.blurb, styles["BodyTextBook"]))
    story.append(Paragraph(book.rights, styles["BodyTextBook"]))
    story.append(PageBreak())

    for kind, payload in blocks:
        if kind == "pagebreak":
            story.append(PageBreak())
            continue
        if kind == "heading":
            style_name, text = payload  # type: ignore[misc]
            if style_name in {"Heading1", "Title"}:
                style = styles["HeadingBook1"]
            elif style_name == "Heading2":
                style = styles["HeadingBook2"]
            else:
                style = styles["HeadingBook3"]
            story.append(Paragraph(html.escape(text), style))
            continue
        if kind == "para":
            story.append(Paragraph(html.escape(str(payload)), styles["BodyTextBook"]))

    story.append(PageBreak())
    story.append(Paragraph("Author Bio", styles["HeadingBook1"]))
    story.append(Paragraph(AUTHOR_BIO, styles["BodyTextBook"]))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("Publisher / Imprint", styles["HeadingBook2"]))
    story.append(Paragraph(f"Publisher: {PUBLISHER}", styles["BodyTextBook"]))
    story.append(Paragraph(f"Imprint: {IMPRINT}", styles["BodyTextBook"]))
    story.append(Paragraph(f"ISBN status: {ISBN_STATUS}", styles["BodyTextBook"]))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("Rights Review", styles["HeadingBook2"]))
    story.append(Paragraph(book.rights, styles["BodyTextBook"]))
    story.append(Paragraph("Final production note: cover, layout, EPUB, and print PDF are included in this package.", styles["BodyTextBook"]))

    doc.build(story, onFirstPage=pdf_page_number, onLaterPages=pdf_page_number)


def xhtml_escape(text: str) -> str:
    return html.escape(text, quote=False)


def blocks_to_html(book: BookPackage, blocks: list[tuple[str, str | tuple[str, str]]]) -> str:
    parts = []
    for kind, payload in blocks:
        if kind == "pagebreak":
            parts.append('<hr class="pagebreak"/>')
            continue
        if kind == "heading":
            style_name, text = payload  # type: ignore[misc]
            level = 1 if style_name in {"Heading1", "Title"} else 2 if style_name == "Heading2" else 3
            parts.append(f"<h{level}>{xhtml_escape(text)}</h{level}>")
        elif kind == "para":
            parts.append(f"<p>{xhtml_escape(str(payload))}</p>")
    return "\n".join(parts)


def render_epub(book: BookPackage, blocks: list[tuple[str, str | tuple[str, str]]]) -> None:
    oebps = book.source_dir / "_epub_tmp"
    if oebps.exists():
        shutil.rmtree(oebps)
    (oebps / "META-INF").mkdir(parents=True, exist_ok=True)
    (oebps / "OEBPS").mkdir(parents=True, exist_ok=True)

    (oebps / "mimetype").write_text("application/epub+zip", encoding="utf-8")
    (oebps / "META-INF" / "container.xml").write_text(
        """<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>""",
        encoding="utf-8",
    )

    css = """
    body { font-family: serif; line-height: 1.45; margin: 1.2em; color: #111; }
    h1 { text-align: center; margin: 1.0em 0 0.2em; }
    h2 { margin: 1.0em 0 0.3em; }
    h3 { margin: 0.8em 0 0.3em; font-style: italic; }
    p { margin: 0 0 0.8em; }
    .meta { text-align: center; font-size: 0.95em; color: #444; }
    .cover { text-align: center; }
    .cover img { max-width: 100%; height: auto; }
    hr.pagebreak { page-break-after: always; border: 0; height: 1px; }
    """
    (oebps / "OEBPS" / "style.css").write_text(css, encoding="utf-8")

    title_xhtml = f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>{xhtml_escape(book.title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
<div class="cover">
<img src="cover.png" alt="{xhtml_escape(book.title)} cover"/>
</div>
<h1>{xhtml_escape(book.title)}</h1>
<p class="meta">{xhtml_escape(book.subtitle)}</p>
<p class="meta">{xhtml_escape(book.author)}</p>
<p>{xhtml_escape(book.package_note)}</p>
<p>{xhtml_escape(book.cover_direction)}</p>
<p>{xhtml_escape(book.blurb)}</p>
<hr class="pagebreak"/>
</body></html>"""

    body_html = f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>{xhtml_escape(book.title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
{blocks_to_html(book, blocks)}
</body></html>"""

    back_html = f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>{xhtml_escape(book.title)} - Back Matter</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
<h1>Back Matter</h1>
<h2>Author Bio</h2>
<p>{xhtml_escape(AUTHOR_BIO)}</p>
<h2>Publisher / Imprint</h2>
<p>Publisher: {xhtml_escape(PUBLISHER)}</p>
<p>Imprint: {xhtml_escape(IMPRINT)}</p>
<p>ISBN status: {xhtml_escape(ISBN_STATUS)}</p>
<h2>Rights Review</h2>
<p>{xhtml_escape(book.rights)}</p>
</body></html>"""

    nav_html = f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>Navigation</title></head>
<body>
<nav epub:type="toc" id="toc">
  <ol>
    <li><a href="title.xhtml">{xhtml_escape(book.title)}</a></li>
    <li><a href="body.xhtml">Manuscript</a></li>
    <li><a href="back.xhtml">Back Matter</a></li>
  </ol>
</nav>
</body></html>"""

    (oebps / "OEBPS" / "title.xhtml").write_text(title_xhtml, encoding="utf-8")
    (oebps / "OEBPS" / "body.xhtml").write_text(body_html, encoding="utf-8")
    (oebps / "OEBPS" / "back.xhtml").write_text(back_html, encoding="utf-8")
    (oebps / "OEBPS" / "nav.xhtml").write_text(nav_html, encoding="utf-8")
    shutil.copy2(book.cover_path, oebps / "OEBPS" / "cover.png")

    opf = f"""<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="3.0" xml:lang="en">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">urn:uuid:{sha1(book.title.encode()).hexdigest()}</dc:identifier>
    <dc:title>{xhtml_escape(book.title)}</dc:title>
    <dc:language>en</dc:language>
    <dc:creator>{xhtml_escape(book.author)}</dc:creator>
    <dc:publisher>{xhtml_escape(PUBLISHER)}</dc:publisher>
    <meta property="dcterms:modified">{date.today().isoformat()}T00:00:00Z</meta>
    <meta property="title-type">main</meta>
    <meta property="file-as">{xhtml_escape(book.author)}</meta>
    <meta property="cover">cover</meta>
    <meta property="subject">{xhtml_escape(book.category)}</meta>
    <meta property="description">{xhtml_escape(book.blurb)}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="css" href="style.css" media-type="text/css"/>
    <item id="title" href="title.xhtml" media-type="application/xhtml+xml"/>
    <item id="body" href="body.xhtml" media-type="application/xhtml+xml"/>
    <item id="back" href="back.xhtml" media-type="application/xhtml+xml"/>
    <item id="cover" href="cover.png" media-type="image/png" properties="cover-image"/>
  </manifest>
  <spine>
    <itemref idref="title"/>
    <itemref idref="body"/>
    <itemref idref="back"/>
  </spine>
</package>"""
    (oebps / "OEBPS" / "content.opf").write_text(opf, encoding="utf-8")

    with zipfile.ZipFile(book.epub_path, "w") as z:
        z.writestr("mimetype", "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        for rel in ["META-INF/container.xml", "OEBPS/content.opf", "OEBPS/nav.xhtml", "OEBPS/style.css", "OEBPS/title.xhtml", "OEBPS/body.xhtml", "OEBPS/back.xhtml", "OEBPS/cover.png"]:
            z.write(oebps / rel, rel)

    shutil.rmtree(oebps)


def release_manifest(book: BookPackage) -> str:
    lines = [
        f"# {book.title}",
        "",
        f"Subtitle: {book.subtitle}",
        f"Author: {book.author}",
        f"Category: {book.category}",
        "",
        "Included assets:",
        "- `manuscript.docx`",
        "- `metadata.md`",
        "- `cover.png`",
        "- `ebook.epub`",
        "- `print.pdf`",
        "",
        "Production notes:",
        f"- {book.package_note}",
        f"- Cover direction: {book.cover_direction}",
        f"- Format notes: {book.format_notes}",
        "",
        "Rights review:",
        f"- {book.rights}",
        "",
        "Publisher information:",
        f"- Publisher: {PUBLISHER}",
        f"- Imprint: {IMPRINT}",
        f"- Author bio: {AUTHOR_BIO}",
        f"- ISBN status: {ISBN_STATUS}",
    ]
    return "\n".join(lines)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    packages = load_packages()
    for book in packages:
        book.source_dir and book.source_dir.mkdir(parents=True, exist_ok=True)
        final_dir = book.pdf_path.parent
        final_dir.mkdir(parents=True, exist_ok=True)

        shutil.copy2(book.source_dir / "manuscript.docx", book.manuscript_path)
        shutil.copy2(book.source_dir / "metadata.md", book.metadata_path)

        generate_cover(book)
        blocks = parse_docx_blocks(book.source_dir / "manuscript.docx")
        render_pdf(book, blocks)
        render_epub(book, blocks)
        book.release_path.write_text(release_manifest(book), encoding="utf-8")

    summary = [
        "# Final Release Packages",
        "",
        f"Generated for Mr. Avery on {date.today().isoformat()}.",
        "",
        f"Publisher: {PUBLISHER}",
        f"Imprint: {IMPRINT}",
        f"Author bio: {AUTHOR_BIO}",
        f"ISBN status: {ISBN_STATUS}",
        "",
        "Books:",
    ]
    for book in packages:
        summary.append(f"- `{book.slug}`")
    (OUT_DIR / "README.md").write_text("\n".join(summary), encoding="utf-8")


if __name__ == "__main__":
    main()
