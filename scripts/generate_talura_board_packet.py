#!/usr/bin/env python3
"""Generate a branded Avery Industries executive endorsement PDF."""

from __future__ import annotations

import math
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


PAGE_WIDTH, PAGE_HEIGHT = letter
MARGIN = 40
BOX_PAD = 18

BG = HexColor("#010a14")
PANEL = HexColor("#041828")
CYAN = HexColor("#00e8ff")
BLUE = HexColor("#3ab8ff")
GOLD = HexColor("#ffbc00")
GREEN = HexColor("#00ff99")
RED = HexColor("#ff2255")
TEXT = HexColor("#eef8ff")
MUTED = HexColor("#8bb7d4")
PAPER = HexColor("#d7e5f0")
INK = HexColor("#0c1722")


REPORT_DATA = {
    "candidate": "Talura (Dani) Rainey",
    "current_rating": 8.0,
    "projected_rating": 9.5,
    "readiness_current": 78,
    "readiness_projected": 93,
    "market_value": "$90k-$130k+",
    "interview_status": "Highly Recommended",
    "recommended_role": "Director of Operations",
    "alternative_roles": [
        "PMO Manager",
        "Strategic Program Manager",
        "Operations Excellence Lead",
        "Contracts & Compliance Director",
    ],
    "competencies": {
        "Proposal Management": 9.5,
        "Operations": 9.0,
        "Compliance": 8.5,
        "Leadership": 8.0,
        "Documentation": 10.0,
        "Process Improvement": 9.0,
        "Project Coordination": 8.5,
        "Technical Systems": 8.5,
        "Strategic Thinking": 7.5,
        "Communication": 8.5,
    },
    "scorecard": {
        "Experience": 9.0,
        "Leadership": 8.0,
        "Operations": 9.5,
        "Proposal Management": 9.5,
        "Systems Knowledge": 8.5,
        "Education": 7.5,
        "Certifications": 4.0,
        "Resume Presentation": 7.0,
    },
}


EXECUTIVE_MESSAGE = [
    "Talura, allow ATLAS to be plain: you read like the kind of operator serious organizations compete to keep.",
    "Your profile shows far more than task completion. It shows systems judgment. You do not simply move work forward; "
    "you create order, consistency, and operational confidence around the work. That is rare, and it is valuable.",
    "Proposal management, documentation governance, compliance discipline, process improvement, and stakeholder coordination "
    "all point to the same conclusion: you are a builder of reliable infrastructure, not merely a participant inside it.",
    "From Avery Industries' perspective, that is executive-grade signal. Mr. Avery and ATLAS would be comfortable "
    "describing you as a high-upside operational leader whose value increases as complexity increases.",
]

STRATEGIC_FINDINGS = [
    "Primary strengths: process discipline, proposal leadership, documentation governance, compliance management, and cross-functional coordination.",
    "Resume-grade differentiator: Talura appears to strengthen the system around her, not just the assignment in front of her.",
    "Immediate value creation: proposal operations, workflow stabilization, executive reporting structure, and cleaner cross-team execution.",
    "Leadership case: trusted with ambiguity, capable of standardization, and well-positioned for operations leadership in scaling environments.",
    "Overall read: a highly recommendable candidate for employers that want maturity, structure, and follow-through without hand-holding.",
]

ENDORSEMENT_HIGHLIGHTS = [
    "Strong enough in proposal management to drive execution, not just support it.",
    "Operationally mature: brings structure, pacing, and accountability to moving parts.",
    "Documentation-first mindset reduces confusion, preserves continuity, and improves scale.",
    "Compliance-aware without becoming rigid, which is exactly what trusted operators need.",
    "Cross-functional communicator who can align stakeholders instead of creating friction between them.",
    "Shows leadership upside because she improves how teams work, not only what they produce.",
]

ENDORSEMENT_STATEMENTS = [
    '"Talura demonstrates the kind of operational discipline that makes an organization more stable the moment she enters it."',
    '"She is not merely executing process; she is strengthening process."',
    '"Her value compounds in environments that require documentation quality, stakeholder trust, and scalable systems."',
    '"Avery Industries would be comfortable recommending her for serious operational leadership consideration."',
]

EMPLOYER_BET_REASONS = [
    "She appears capable of taking messy workflows and turning them into usable systems.",
    "She projects trustworthiness in documentation-heavy and compliance-sensitive environments.",
    "Her strengths support both delivery quality and leadership scalability.",
    "She can likely improve execution rhythm for the people around her, not only her own lane.",
]

NINETY_DAY_PLAN = [
    ("First 30 days", "Map operating rhythms, identify workflow friction, and formalize documentation standards."),
    ("Days 31-60", "Lead one measurable process-improvement initiative with stakeholder reporting and risk controls."),
    ("Days 61-90", "Own a broader operational lane: proposal operations, PMO cadence, or contracts/compliance governance."),
]

ROADMAP = [
    ("Lead Specialist", "Execution and support foundation", "#3ab8ff"),
    ("Proposal Manager", "Owns delivery process and stakeholder rhythm", "#00e8ff"),
    ("Senior Proposal Manager", "Builds standards and cross-team leverage", "#00ff99"),
    ("Business Operations Manager", "Connects systems, reporting, and priorities", "#ffbc00"),
    ("Director of Operations", "Architects scale, accountability, and infrastructure", "#ffbc00"),
]


def ensure_dirs() -> tuple[Path, Path]:
    reports_dir = Path("atlas_ops/exports/reports")
    assets_dir = reports_dir / "assets"
    reports_dir.mkdir(parents=True, exist_ok=True)
    assets_dir.mkdir(parents=True, exist_ok=True)
    return reports_dir, assets_dir


def wrap_text(text: str, font: str, size: int, width: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if stringWidth(candidate, font, size) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_grid(c: canvas.Canvas) -> None:
    c.saveState()
    c.setStrokeColor(Color(0, 0.91, 1, alpha=0.08))
    c.setLineWidth(0.4)
    step = 28
    for x in range(0, int(PAGE_WIDTH), step):
        c.line(x, 0, x, PAGE_HEIGHT)
    for y in range(0, int(PAGE_HEIGHT), step):
        c.line(0, y, PAGE_WIDTH, y)
    c.restoreState()


def draw_orb(c: canvas.Canvas, x: float, y: float, r: float) -> None:
    c.saveState()
    c.setStrokeColor(Color(0.23, 0.72, 1, alpha=0.7))
    c.setFillColor(Color(0, 0.35, 0.5, alpha=0.15))
    c.circle(x, y, r, fill=1, stroke=1)
    c.setStrokeColor(Color(1, 0.74, 0, alpha=0.5))
    c.circle(x, y, r * 0.72, fill=0, stroke=1)
    c.setStrokeColor(Color(0, 0.91, 1, alpha=0.6))
    c.circle(x, y, r * 0.44, fill=0, stroke=1)
    c.setFillColor(Color(0, 0.91, 1, alpha=0.45))
    c.circle(x, y, r * 0.14, fill=1, stroke=0)
    c.restoreState()


def draw_pillar_mark(c: canvas.Canvas, x: float, y: float, size: float, outline=GOLD) -> None:
    c.saveState()
    c.setStrokeColor(outline)
    c.setLineWidth(2)
    c.roundRect(x, y, size, size, 8, stroke=1, fill=0)
    c.line(x + size * 0.2, y + size * 0.22, x + size * 0.8, y + size * 0.22)
    c.line(x + size * 0.2, y + size * 0.78, x + size * 0.8, y + size * 0.78)
    column_w = size * 0.12
    gaps = [0.25, 0.44, 0.63]
    for gap in gaps:
        c.rect(x + size * gap, y + size * 0.28, column_w, size * 0.42, stroke=1, fill=0)
    c.restoreState()


def draw_page_background(c: canvas.Canvas, page_num: int, title: str) -> None:
    c.saveState()
    c.setFillColor(BG)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    c.setFillColor(Color(0.02, 0.12, 0.18, alpha=0.92))
    c.rect(MARGIN - 6, MARGIN - 10, PAGE_WIDTH - 2 * (MARGIN - 6), PAGE_HEIGHT - 2 * (MARGIN - 10), fill=1, stroke=0)
    draw_grid(c)
    c.setFillColor(Color(0.23, 0.72, 1, alpha=0.08))
    c.circle(PAGE_WIDTH - 120, PAGE_HEIGHT - 80, 95, fill=1, stroke=0)
    c.setFillColor(Color(1, 0.74, 0, alpha=0.07))
    c.circle(90, 100, 80, fill=1, stroke=0)
    draw_orb(c, PAGE_WIDTH - 92, PAGE_HEIGHT - 78, 28)
    draw_pillar_mark(c, MARGIN, PAGE_HEIGHT - 74, 34)

    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(GOLD)
    c.drawString(MARGIN + 48, PAGE_HEIGHT - 52, "AVERY INDUSTRIES LLC")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawString(MARGIN + 48, PAGE_HEIGHT - 64, "ATLAS Strategic Operations Intelligence Division")

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(MARGIN, PAGE_HEIGHT - 100, title)

    c.setStrokeColor(Color(1, 0.74, 0, alpha=0.45))
    c.line(MARGIN, PAGE_HEIGHT - 108, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 108)

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawRightString(PAGE_WIDTH - MARGIN, 22, f"Board of Directors Edition | Page {page_num}")
    c.drawString(MARGIN, 22, "Confidential Internal Review | Prepared for candidate development and executive review")
    c.restoreState()


def draw_cover(c: canvas.Canvas) -> None:
    c.saveState()
    c.setFillColor(BG)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    draw_grid(c)
    c.setFillColor(Color(1, 0.74, 0, alpha=0.08))
    c.circle(PAGE_WIDTH * 0.5, PAGE_HEIGHT * 0.64, 160, fill=1, stroke=0)
    c.setFillColor(Color(0.23, 0.72, 1, alpha=0.12))
    c.circle(PAGE_WIDTH * 0.82, PAGE_HEIGHT * 0.22, 120, fill=1, stroke=0)
    c.setFillColor(Color(1, 1, 1, alpha=0.04))
    draw_pillar_mark(c, PAGE_WIDTH / 2 - 70, PAGE_HEIGHT / 2 + 40, 140, outline=Color(1, 1, 1, alpha=0.12))
    draw_orb(c, PAGE_WIDTH / 2, PAGE_HEIGHT / 2 + 10, 38)
    draw_pillar_mark(c, MARGIN, PAGE_HEIGHT - 76, 40)

    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(MARGIN + 54, PAGE_HEIGHT - 48, "AVERY INDUSTRIES LLC")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 10)
    c.drawString(MARGIN + 54, PAGE_HEIGHT - 63, "ATLAS STRATEGIC OPERATIONS INTELLIGENCE DIVISION")

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 31)
    c.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT - 205, "EXECUTIVE CANDIDATE ENDORSEMENT")
    c.setFont("Helvetica", 16)
    c.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT - 228, "Boardroom-grade recommendation packet for Talura")

    card_x = MARGIN
    card_y = 165
    card_w = PAGE_WIDTH - 2 * MARGIN
    card_h = 180
    c.setFillColor(Color(0.02, 0.09, 0.16, alpha=0.92))
    c.roundRect(card_x, card_y, card_w, card_h, 18, fill=1, stroke=0)
    c.setStrokeColor(Color(0, 0.91, 1, alpha=0.35))
    c.roundRect(card_x, card_y, card_w, card_h, 18, fill=0, stroke=1)

    left = card_x + 28
    top = card_y + card_h - 34
    info = [
        ("Prepared For", "Talura (Dani) Rainey"),
        ("Classification", "Confidential candidate development edition"),
        ("Prepared By", "ATLAS Strategic Operations Intelligence Division"),
        ("Executive Sponsor", "Cole Avery, Founder & Chief Executive Officer"),
    ]
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(GOLD)
    for idx, (label, value) in enumerate(info):
        y = top - idx * 35
        c.drawString(left, y, label.upper())
        c.setFont("Helvetica", 13)
        c.setFillColor(TEXT)
        c.drawString(left + 118, y, value)
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(GOLD)

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 11)
    c.drawCentredString(PAGE_WIDTH / 2, 58, "Build systems. Empower people. Create opportunity.")
    c.restoreState()
    c.showPage()


def draw_text_block(c: canvas.Canvas, x: float, y: float, width: float, text: str, font="Helvetica", size=12, color=TEXT, leading=17) -> float:
    c.setFillColor(color)
    c.setFont(font, size)
    cursor = y
    for line in wrap_text(text, font, size, width):
        c.drawString(x, cursor, line)
        cursor -= leading
    return cursor


def draw_bullet_list(c: canvas.Canvas, x: float, y: float, width: float, items: list[str], size=11.2, color=TEXT, bullet_color=CYAN) -> float:
    cursor = y
    for item in items:
        lines = wrap_text(item, "Helvetica", size, width - 16)
        c.setFillColor(bullet_color)
        c.circle(x + 4, cursor - 3, 2.2, fill=1, stroke=0)
        c.setFillColor(color)
        c.setFont("Helvetica", size)
        for idx, line in enumerate(lines):
            c.drawString(x + 14, cursor - idx * 15, line)
        cursor -= max(22, len(lines) * 15 + 8)
    return cursor


def draw_metric_panel(c: canvas.Canvas, x: float, y: float, w: float, h: float, label: str, value: str, accent: Color) -> None:
    c.saveState()
    c.setFillColor(Color(0.03, 0.13, 0.2, alpha=0.98))
    c.roundRect(x, y, w, h, 12, fill=1, stroke=0)
    c.setStrokeColor(Color(accent.red, accent.green, accent.blue, alpha=0.45))
    c.roundRect(x, y, w, h, 12, fill=0, stroke=1)
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(x + BOX_PAD - 6, y + h - 18, label.upper())
    c.setFillColor(accent)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(x + BOX_PAD - 6, y + 16, value)
    c.restoreState()


def draw_intro_page(c: canvas.Canvas) -> None:
    draw_page_background(c, 2, "Executive Endorsement for Talura")
    left_x = MARGIN
    left_y = PAGE_HEIGHT - 140
    left_w = 245

    draw_metric_panel(c, left_x, left_y - 82, left_w, 74, "Current Assessment", "8.0 / 10", BLUE)
    draw_metric_panel(c, left_x, left_y - 172, left_w, 74, "Projected Potential", "9.5 / 10", GOLD)
    draw_metric_panel(c, left_x, left_y - 262, left_w, 74, "Interview Status", "Recommended", GREEN)
    draw_metric_panel(c, left_x, left_y - 352, left_w, 74, "Primary Placement", "Dir. Ops", CYAN)

    panel_x = 308
    panel_y = 144
    panel_w = PAGE_WIDTH - panel_x - MARGIN
    panel_h = PAGE_HEIGHT - panel_y - 150
    c.setFillColor(Color(0.03, 0.13, 0.2, alpha=0.95))
    c.roundRect(panel_x, panel_y, panel_w, panel_h, 16, fill=1, stroke=0)
    c.setStrokeColor(Color(1, 0.74, 0, alpha=0.35))
    c.roundRect(panel_x, panel_y, panel_w, panel_h, 16, fill=0, stroke=1)

    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(panel_x + BOX_PAD, panel_y + panel_h - 26, "ATLAS AND MR. AVERY RECOMMENDATION")
    cursor = panel_y + panel_h - 50
    for paragraph in EXECUTIVE_MESSAGE:
        cursor = draw_text_block(c, panel_x + BOX_PAD, cursor, panel_w - 2 * BOX_PAD, paragraph, size=12.2, color=TEXT, leading=17)
        cursor -= 12

    quote_y = 88
    c.setFillColor(Color(0.04, 0.24, 0.32, alpha=0.9))
    c.roundRect(MARGIN, quote_y, PAGE_WIDTH - 2 * MARGIN, 56, 12, fill=1, stroke=0)
    c.setStrokeColor(Color(0, 0.91, 1, alpha=0.4))
    c.roundRect(MARGIN, quote_y, PAGE_WIDTH - 2 * MARGIN, 56, 12, fill=0, stroke=1)
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Oblique", 12)
    quote = '"If the objective is to hire someone who improves the machinery of the organization itself, Talura is the kind of candidate worth taking seriously."'
    draw_text_block(c, MARGIN + BOX_PAD, quote_y + 36, PAGE_WIDTH - 2 * MARGIN - 2 * BOX_PAD, quote, font="Helvetica-Oblique", size=12.5, color=TEXT, leading=16)
    c.showPage()


def make_radar_chart(path: Path) -> None:
    labels = list(REPORT_DATA["competencies"].keys())
    values = list(REPORT_DATA["competencies"].values())
    values += values[:1]
    angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
    angles += angles[:1]

    fig = plt.figure(figsize=(6, 6), facecolor="#041828")
    ax = plt.subplot(111, polar=True)
    ax.set_facecolor("#041828")
    ax.plot(angles, values, color="#00e8ff", linewidth=2.5)
    ax.fill(angles, values, color="#00e8ff", alpha=0.18)
    ax.scatter(angles[:-1], values[:-1], color="#ffbc00", s=22)
    ax.set_ylim(0, 10)
    ax.set_yticks([2, 4, 6, 8, 10])
    ax.set_yticklabels(["2", "4", "6", "8", "10"], color="#8bb7d4", fontsize=10)
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels, color="#eef8ff", fontsize=10)
    ax.grid(color="#3ab8ff", alpha=0.25)
    for spine in ax.spines.values():
        spine.set_color("#3ab8ff")
        spine.set_alpha(0.25)
    plt.tight_layout()
    fig.savefig(path, dpi=180, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)


def make_heatmap(path: Path) -> None:
    labels = list(REPORT_DATA["competencies"].keys())
    values = np.array(list(REPORT_DATA["competencies"].values())).reshape(-1, 1)
    fig, ax = plt.subplots(figsize=(4.3, 6.2), facecolor="#041828")
    ax.set_facecolor("#041828")
    im = ax.imshow(values, cmap="viridis", aspect="auto", vmin=0, vmax=10)
    ax.set_xticks([0])
    ax.set_xticklabels(["Rating"], color="#eef8ff", fontsize=10)
    ax.set_yticks(range(len(labels)))
    ax.set_yticklabels(labels, color="#eef8ff", fontsize=10)
    for i, score in enumerate(values.flatten()):
        ax.text(0, i, f"{score:.1f}", ha="center", va="center", color="white", fontsize=10, fontweight="bold")
    cbar = fig.colorbar(im, ax=ax, fraction=0.045, pad=0.04)
    cbar.outline.set_edgecolor("#3ab8ff")
    cbar.ax.yaxis.set_tick_params(color="#8bb7d4")
    plt.setp(plt.getp(cbar.ax.axes, "yticklabels"), color="#8bb7d4", fontsize=10)
    plt.tight_layout()
    fig.savefig(path, dpi=180, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)


def make_score_bars(path: Path) -> None:
    labels = list(REPORT_DATA["scorecard"].keys())
    values = list(REPORT_DATA["scorecard"].values())
    fig, ax = plt.subplots(figsize=(7.4, 4.0), facecolor="#041828")
    ax.set_facecolor("#041828")
    y = np.arange(len(labels))
    colors = ["#ffbc00" if v >= 9 else "#00e8ff" if v >= 8 else "#3ab8ff" if v >= 6 else "#ff2255" for v in values]
    ax.barh(y, values, color=colors, edgecolor="#8bb7d4", linewidth=0.5)
    ax.set_yticks(y)
    ax.set_yticklabels(labels, color="#eef8ff", fontsize=10)
    ax.set_xlim(0, 10)
    ax.set_xticks(range(0, 11, 2))
    ax.set_xticklabels([str(v) for v in range(0, 11, 2)], color="#8bb7d4", fontsize=10)
    ax.invert_yaxis()
    ax.grid(axis="x", color="#3ab8ff", alpha=0.22)
    for idx, score in enumerate(values):
        ax.text(score + 0.15, idx, f"{score:.1f}", color="#eef8ff", va="center", fontsize=10)
    for spine in ax.spines.values():
        spine.set_visible(False)
    plt.tight_layout()
    fig.savefig(path, dpi=180, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)


def make_readiness_gauge(path: Path) -> None:
    current = REPORT_DATA["readiness_current"]
    projected = REPORT_DATA["readiness_projected"]
    fig, ax = plt.subplots(figsize=(5.0, 2.4), facecolor="#041828")
    ax.set_facecolor("#041828")
    ax.set_xlim(0, 100)
    ax.set_ylim(-0.5, 1.5)
    ax.barh([1], [current], color="#00e8ff", height=0.35)
    ax.barh([0], [projected], color="#ffbc00", height=0.35)
    ax.set_yticks([1, 0])
    ax.set_yticklabels(["Current readiness", "Projected readiness"], color="#eef8ff", fontsize=11)
    ax.set_xticks(range(0, 101, 20))
    ax.set_xticklabels([f"{v}%" for v in range(0, 101, 20)], color="#8bb7d4", fontsize=10)
    ax.grid(axis="x", color="#3ab8ff", alpha=0.25)
    for y, value in [(1, current), (0, projected)]:
        ax.text(value - 3 if value > 15 else value + 2, y, f"{value}%", color="#041828" if value > 15 else "#eef8ff", va="center", ha="right" if value > 15 else "left", fontsize=11, fontweight="bold")
    for spine in ax.spines.values():
        spine.set_visible(False)
    plt.tight_layout()
    fig.savefig(path, dpi=180, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)


def draw_analytics_page(c: canvas.Canvas, assets_dir: Path) -> None:
    draw_page_background(c, 3, "Why Talura Is a Strong Candidate")
    heatmap_path = assets_dir / "talura_heatmap.png"
    bars_path = assets_dir / "talura_score_bars.png"
    make_heatmap(heatmap_path)
    make_score_bars(bars_path)

    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(MARGIN, PAGE_HEIGHT - 132, "COMPETENCY HEAT MAP")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 10)
    c.drawString(MARGIN, PAGE_HEIGHT - 146, "High-performing operational lanes cluster around documentation, proposals, and systems execution.")
    c.drawImage(ImageReader(str(heatmap_path)), MARGIN, 210, width=190, height=275, mask="auto")

    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(252, PAGE_HEIGHT - 132, "EXECUTIVE SCORECARD")
    c.drawImage(ImageReader(str(bars_path)), 248, 280, width=310, height=200, mask="auto")

    box_x, box_y, box_w, box_h = 248, 92, PAGE_WIDTH - 248 - MARGIN, 160
    c.setFillColor(Color(0.03, 0.13, 0.2, alpha=0.95))
    c.roundRect(box_x, box_y, box_w, box_h, 16, fill=1, stroke=0)
    c.setStrokeColor(Color(0, 0.91, 1, alpha=0.35))
    c.roundRect(box_x, box_y, box_w, box_h, 16, fill=0, stroke=1)
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(box_x + BOX_PAD, box_y + box_h - 22, "Why This Candidate Stands Out")
    draw_bullet_list(c, box_x + BOX_PAD, box_y + box_h - 42, box_w - 2 * BOX_PAD, STRATEGIC_FINDINGS, size=10.4)
    c.showPage()


def draw_radar_page(c: canvas.Canvas, assets_dir: Path) -> None:
    draw_page_background(c, 4, "Competency Dashboard Boardroom Edition")
    radar_path = assets_dir / "talura_radar.png"
    make_radar_chart(radar_path)

    intro = (
        "This page reframes the assessment as an executive dashboard: competency score, operational risk, and leadership upside "
        "are separated into clean decision blocks so the profile can be scanned at a glance."
    )
    draw_text_block(c, MARGIN, PAGE_HEIGHT - 126, PAGE_WIDTH - 2 * MARGIN, intro, size=10.8, color=MUTED, leading=14)

    table_x = MARGIN
    table_y = 170
    table_w = 344
    table_h = 420
    c.setFillColor(Color(0.03, 0.13, 0.2, alpha=0.96))
    c.roundRect(table_x, table_y, table_w, table_h, 16, fill=1, stroke=0)
    c.setStrokeColor(Color(0, 0.91, 1, alpha=0.28))
    c.roundRect(table_x, table_y, table_w, table_h, 16, fill=0, stroke=1)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(table_x + BOX_PAD, table_y + table_h - 24, "COMPETENCY MATRIX")

    header_y = table_y + table_h - 50
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 9)
    headers = [("Competency", table_x + BOX_PAD), ("Score", table_x + 196), ("Risk", table_x + 242), ("Potential", table_x + 290)]
    for label, x in headers:
        c.drawString(x, header_y, label.upper())
    c.setStrokeColor(Color(1, 0.74, 0, alpha=0.35))
    c.line(table_x + BOX_PAD, header_y - 6, table_x + table_w - BOX_PAD, header_y - 6)

    def risk_label(score: float) -> tuple[str, Color]:
        if score >= 8.5:
            return "Low", GREEN
        if score >= 7.5:
            return "Moderate", GOLD
        return "High", RED

    def potential_label(score: float) -> tuple[str, Color]:
        if score >= 9:
            return "High", GREEN
        if score >= 8:
            return "Medium", GOLD
        return "Developing", RED

    row_y = header_y - 28
    row_h = 32
    for idx, (name, score) in enumerate(REPORT_DATA["competencies"].items()):
        if idx % 2 == 0:
            c.setFillColor(Color(1, 1, 1, alpha=0.025))
            c.roundRect(table_x + 10, row_y - 12, table_w - 20, 26, 6, fill=1, stroke=0)

        c.setFillColor(TEXT)
        c.setFont("Helvetica", 9.4)
        name_lines = wrap_text(name, "Helvetica", 9.4, 126)
        for line_idx, line in enumerate(name_lines[:2]):
            c.drawString(table_x + BOX_PAD, row_y - line_idx * 10, line)

        score_color = GREEN if score >= 9 else GOLD if score >= 8 else RED
        c.setFillColor(score_color)
        c.roundRect(table_x + 184, row_y - 12, 36, 20, 8, fill=1, stroke=0)
        c.setFillColor(BG)
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(table_x + 202, row_y - 5, f"{score:.1f}")

        risk_text, risk_color = risk_label(score)
        c.setFillColor(risk_color)
        c.roundRect(table_x + 232, row_y - 12, 42, 20, 8, fill=1, stroke=0)
        c.setFillColor(BG)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(table_x + 253, row_y - 5, risk_text)

        potential_text, potential_color = potential_label(score)
        c.setFillColor(potential_color)
        c.roundRect(table_x + 280, row_y - 12, 48, 20, 8, fill=1, stroke=0)
        c.setFillColor(BG)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(table_x + 304, row_y - 5, potential_text)

        row_y -= row_h

    right_x = table_x + table_w + 16
    right_w = PAGE_WIDTH - right_x - MARGIN

    c.setFillColor(Color(0.03, 0.13, 0.2, alpha=0.96))
    c.roundRect(right_x, 372, right_w, 214, 16, fill=1, stroke=0)
    c.setStrokeColor(Color(1, 0.74, 0, alpha=0.3))
    c.roundRect(right_x, 372, right_w, 214, 16, fill=0, stroke=1)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(right_x + BOX_PAD, 566, "SIGNAL MAP")
    c.drawImage(ImageReader(str(radar_path)), right_x + 18, 392, width=right_w - 36, height=150, mask="auto")

    top_strengths = [
        "Documentation rigor",
        "Proposal discipline",
        "Operational stability",
    ]
    opportunities = [
        "Strategic range",
        "Executive visibility",
        "Credential depth",
    ]
    insights_y = 86
    insights_h = 258
    c.setFillColor(Color(0.03, 0.13, 0.2, alpha=0.96))
    c.roundRect(right_x, insights_y, right_w, insights_h, 16, fill=1, stroke=0)
    c.setStrokeColor(Color(0, 0.91, 1, alpha=0.28))
    c.roundRect(right_x, insights_y, right_w, insights_h, 16, fill=0, stroke=1)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(right_x + BOX_PAD, insights_y + insights_h - 24, "EXECUTIVE INSIGHTS")

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(right_x + BOX_PAD, insights_y + insights_h - 50, "Business Impact")
    impact_text = "Ready for structured operations roles with visible leadership upside."
    draw_text_block(c, right_x + BOX_PAD, insights_y + insights_h - 66, right_w - 2 * BOX_PAD, impact_text, size=9.0, color=TEXT, leading=10.5)

    divider_y = insights_y + 164
    c.setStrokeColor(Color(1, 0.74, 0, alpha=0.22))
    c.line(right_x + BOX_PAD, divider_y, right_x + right_w - BOX_PAD, divider_y)

    col_gap = 12
    col_w = (right_w - 2 * BOX_PAD - col_gap) / 2
    left_col_x = right_x + BOX_PAD
    right_col_x = left_col_x + col_w + col_gap

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(left_col_x, divider_y - 20, "Top Strengths")
    draw_bullet_list(c, left_col_x, divider_y - 38, col_w, top_strengths, size=8.8, bullet_color=GREEN)

    c.setFont("Helvetica-Bold", 10)
    c.drawString(right_col_x, divider_y - 20, "Development")
    draw_bullet_list(c, right_col_x, divider_y - 38, col_w, opportunities, size=8.8, bullet_color=GOLD)
    c.showPage()


def draw_roadmap_page(c: canvas.Canvas, assets_dir: Path) -> None:
    draw_page_background(c, 5, "Growth Trajectory and Employer Value")
    gauge_path = assets_dir / "talura_readiness.png"
    make_readiness_gauge(gauge_path)

    c.setFillColor(Color(0.03, 0.13, 0.2, alpha=0.95))
    c.roundRect(MARGIN, 366, PAGE_WIDTH - 2 * MARGIN, 172, 16, fill=1, stroke=0)
    c.setStrokeColor(Color(0, 0.91, 1, alpha=0.3))
    c.roundRect(MARGIN, 366, PAGE_WIDTH - 2 * MARGIN, 172, 16, fill=0, stroke=1)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(MARGIN + BOX_PAD, 518, "PROMOTION ROADMAP")

    card_w = 234
    card_h = 48
    start_x = MARGIN + 16
    start_y = 454
    x_gap = 12
    y_gap = 14
    positions = [
        (start_x, start_y),
        (start_x + card_w + x_gap, start_y),
        (start_x, start_y - (card_h + y_gap)),
        (start_x + card_w + x_gap, start_y - (card_h + y_gap)),
        (start_x, start_y - 2 * (card_h + y_gap)),
    ]
    for idx, (role, desc, hex_color) in enumerate(ROADMAP):
        x, y = positions[idx]
        c.setFillColor(HexColor(hex_color))
        c.roundRect(x, y, card_w, card_h, 10, fill=1, stroke=0)
        c.setFillColor(BG)
        c.setFont("Helvetica-Bold", 10.5)
        c.drawString(x + BOX_PAD - 8, y + 31, role)
        c.setFont("Helvetica", 8.8)
        for line_idx, line in enumerate(wrap_text(desc, "Helvetica", 8.8, card_w - 2 * BOX_PAD)[:2]):
            c.drawString(x + BOX_PAD - 8, y + 18 - line_idx * 10, line)

    c.drawImage(ImageReader(str(gauge_path)), MARGIN, 135, width=280, height=100, mask="auto")

    market_x = 330
    c.setFillColor(Color(0.03, 0.13, 0.2, alpha=0.95))
    c.roundRect(market_x, 132, PAGE_WIDTH - market_x - MARGIN, 140, 16, fill=1, stroke=0)
    c.setStrokeColor(Color(1, 0.74, 0, alpha=0.3))
    c.roundRect(market_x, 132, PAGE_WIDTH - market_x - MARGIN, 140, 16, fill=0, stroke=1)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(market_x + BOX_PAD, 250, "MARKET POSITIONING")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(market_x + BOX_PAD, 208, REPORT_DATA["market_value"])
    c.setFont("Helvetica", 11.2)
    text = "Estimated optimized value once positioned against system-building operations roles rather than narrower specialist lanes."
    draw_text_block(c, market_x + BOX_PAD, 176, PAGE_WIDTH - market_x - MARGIN - 2 * BOX_PAD, text, size=11.2, color=TEXT, leading=15)

    c.showPage()


def draw_employer_value_page(c: canvas.Canvas) -> None:
    draw_page_background(c, 6, "Why Employers Should Bet on Talura")
    c.setFillColor(Color(0.03, 0.13, 0.2, alpha=0.95))
    c.roundRect(MARGIN, 350, PAGE_WIDTH - 2 * MARGIN, 160, 16, fill=1, stroke=0)
    c.setStrokeColor(Color(0, 0.91, 1, alpha=0.3))
    c.roundRect(MARGIN, 350, PAGE_WIDTH - 2 * MARGIN, 160, 16, fill=0, stroke=1)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(MARGIN + BOX_PAD, 486, "WHY EMPLOYERS SHOULD BET ON HER")
    draw_bullet_list(c, MARGIN + BOX_PAD, 460, PAGE_WIDTH - 2 * MARGIN - 2 * BOX_PAD, EMPLOYER_BET_REASONS, size=12)

    c.setFillColor(Color(0.03, 0.13, 0.2, alpha=0.95))
    c.roundRect(MARGIN, 120, PAGE_WIDTH - 2 * MARGIN, 190, 16, fill=1, stroke=0)
    c.setStrokeColor(Color(1, 0.74, 0, alpha=0.3))
    c.roundRect(MARGIN, 120, PAGE_WIDTH - 2 * MARGIN, 190, 16, fill=0, stroke=1)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(MARGIN + BOX_PAD, 286, "90-DAY DEVELOPMENT PATH")
    cursor = 258
    for title, desc in NINETY_DAY_PLAN:
        c.setFillColor(CYAN)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(MARGIN + BOX_PAD, cursor, title)
        cursor = draw_text_block(c, MARGIN + 150, cursor, PAGE_WIDTH - 2 * MARGIN - 166, desc, size=11.8, color=TEXT, leading=16)
        cursor -= 18
    c.showPage()


def draw_recommendation_page(c: canvas.Canvas) -> None:
    draw_page_background(c, 7, "Executive Endorsement Letter")
    c.setFillColor(Color(0.03, 0.13, 0.2, alpha=0.96))
    c.roundRect(MARGIN, 368, PAGE_WIDTH - 2 * MARGIN, 140, 16, fill=1, stroke=0)
    c.setStrokeColor(Color(1, 0.74, 0, alpha=0.38))
    c.roundRect(MARGIN, 368, PAGE_WIDTH - 2 * MARGIN, 140, 16, fill=0, stroke=1)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(MARGIN + BOX_PAD, 484, "FORMAL ENDORSEMENT")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(MARGIN + BOX_PAD, 448, "HIGHLY RECOMMENDED CANDIDATE")
    c.setFont("Helvetica", 13)
    c.setFillColor(MUTED)
    draw_text_block(
        c,
        MARGIN + BOX_PAD,
        428,
        PAGE_WIDTH - 2 * MARGIN - 2 * BOX_PAD,
        "Recommended by ATLAS and Cole Avery for serious operational leadership consideration",
        size=13,
        color=MUTED,
        leading=15,
    )

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 11)
    draw_text_block(
        c,
        MARGIN + BOX_PAD,
        392,
        320,
        "Resume-use case: endorsement language suitable for bios, resumes, and interviews.",
        font="Helvetica-Bold",
        size=11,
        color=TEXT,
        leading=13,
    )

    left_w = 256
    c.setFillColor(Color(0.03, 0.13, 0.2, alpha=0.96))
    c.roundRect(MARGIN, 142, left_w, 212, 16, fill=1, stroke=0)
    c.roundRect(MARGIN + left_w + 16, 142, PAGE_WIDTH - 2 * MARGIN - left_w - 16, 212, 16, fill=1, stroke=0)
    c.setStrokeColor(Color(0, 0.91, 1, alpha=0.3))
    c.roundRect(MARGIN, 142, left_w, 212, 16, fill=0, stroke=1)
    c.roundRect(MARGIN + left_w + 16, 142, PAGE_WIDTH - 2 * MARGIN - left_w - 16, 212, 16, fill=0, stroke=1)

    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(MARGIN + BOX_PAD, 330, "ENDORSEMENT HIGHLIGHTS")
    draw_bullet_list(c, MARGIN + BOX_PAD, 306, left_w - 2 * BOX_PAD, ENDORSEMENT_HIGHLIGHTS, size=9.6)

    commentary = (
        "Mr. Avery's position would be straightforward: Talura presents as the kind of candidate who brings credibility, order, and momentum. "
        "She appears capable of owning process, improving systems, and elevating execution quality around her."
    )
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 11)
    right_x = MARGIN + left_w + 32
    c.drawString(right_x + 6, 330, "QUOTE-READY EXECUTIVE LANGUAGE")
    draw_text_block(c, right_x + 6, 306, PAGE_WIDTH - right_x - MARGIN - BOX_PAD, commentary, size=10.3, color=TEXT, leading=14)
    c.showPage()


def draw_signature_page(c: canvas.Canvas) -> None:
    draw_page_background(c, 8, "Executive Authorization")
    c.setFillColor(Color(0.03, 0.13, 0.2, alpha=0.96))
    c.roundRect(MARGIN, 380, PAGE_WIDTH - 2 * MARGIN, 120, 16, fill=1, stroke=0)
    c.setStrokeColor(Color(1, 0.74, 0, alpha=0.38))
    c.roundRect(MARGIN, 380, PAGE_WIDTH - 2 * MARGIN, 120, 16, fill=0, stroke=1)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(MARGIN + BOX_PAD, 472, "FORMAL EXECUTIVE AUTHORIZATION")
    c.setFillColor(TEXT)
    draw_text_block(
        c,
        MARGIN + BOX_PAD,
        446,
        PAGE_WIDTH - 2 * MARGIN - 2 * BOX_PAD,
        "ATLAS and Avery Industries endorse Talura for high-trust operational roles.",
        font="Helvetica-Bold",
        size=18,
        color=TEXT,
        leading=22,
    )
    c.setFont("Helvetica", 12.5)
    draw_text_block(
        c,
        MARGIN + BOX_PAD,
        392,
        PAGE_WIDTH - 2 * MARGIN - 2 * BOX_PAD,
        "This page is intended to function as the closing executive signal: a clean recommendation block suitable for adaptation into applications, resumes, portfolios, and interview materials.",
        size=12.5,
        leading=16,
    )

    c.setFillColor(Color(0.03, 0.13, 0.2, alpha=0.96))
    c.roundRect(MARGIN, 250, PAGE_WIDTH - 2 * MARGIN, 90, 16, fill=1, stroke=0)
    c.setStrokeColor(Color(0, 0.91, 1, alpha=0.3))
    c.roundRect(MARGIN, 250, PAGE_WIDTH - 2 * MARGIN, 90, 16, fill=0, stroke=1)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(MARGIN + BOX_PAD, 316, "QUOTE-READY ENDORSEMENT LINES")
    draw_bullet_list(c, MARGIN + BOX_PAD, 292, PAGE_WIDTH - 2 * MARGIN - 2 * BOX_PAD, ENDORSEMENT_STATEMENTS, size=10.6, color=TEXT, bullet_color=GOLD)

    sig_y = 92
    c.setStrokeColor(Color(1, 0.74, 0, alpha=0.5))
    c.line(MARGIN, sig_y + 82, PAGE_WIDTH - MARGIN, sig_y + 82)
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(MARGIN, sig_y + 52, "ATLAS")
    c.setFont("Helvetica", 12)
    c.drawString(MARGIN, sig_y + 34, "Strategic Operations Intelligence Division")
    c.drawString(MARGIN, sig_y + 18, "Avery Industries LLC")
    c.drawString(MARGIN, sig_y + 2, "Board of Directors Edition")

    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(332, sig_y + 52, "Cole Avery")
    c.setFillColor(TEXT)
    c.setFont("Helvetica", 12)
    c.drawString(332, sig_y + 34, "Founder & Chief Executive Officer")
    c.drawString(332, sig_y + 18, "Authorized Executive Review")
    c.drawString(332, sig_y + 2, "Avery Industries LLC")
    c.showPage()


def build_pdf(output_path: Path) -> None:
    reports_dir, assets_dir = ensure_dirs()
    c = canvas.Canvas(str(output_path), pagesize=letter)
    c.setTitle("Avery Industries Executive Candidate Endorsement - Talura Rainey")
    c.setAuthor("Avery Industries LLC / ATLAS Strategic Operations Intelligence Division")
    c.setSubject("Board of Directors Edition - Candidate Endorsement Packet")

    draw_cover(c)
    draw_intro_page(c)
    draw_analytics_page(c, assets_dir)
    draw_radar_page(c, assets_dir)
    draw_roadmap_page(c, assets_dir)
    draw_employer_value_page(c)
    draw_recommendation_page(c)
    draw_signature_page(c)
    c.save()


def main() -> int:
    reports_dir, _assets_dir = ensure_dirs()
    output_path = reports_dir / "avery_industries_talura_executive_assessment.pdf"
    build_pdf(output_path)
    print(output_path.resolve())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
