import subprocess
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "personal_portfolio"
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
DATE = "June 3, 2026"
NAME = "Cole Avery"
TITLE = "Founder, CEO, AI Systems Architect"


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    metrics = collect_metrics()

    packet_html = OUT / "cole_avery_personal_portfolio.html"
    deck_html = OUT / "cole_avery_personal_brand_deck.html"
    packet_pdf = OUT / "cole_avery_personal_portfolio.pdf"
    deck_pdf = OUT / "cole_avery_personal_brand_deck.pdf"
    markdown = OUT / "cole_avery_personal_portfolio.md"

    packet_html.write_text(render_packet_html(metrics), encoding="utf-8")
    deck_html.write_text(render_deck_html(metrics), encoding="utf-8")
    markdown.write_text(render_markdown(metrics), encoding="utf-8")

    print_to_pdf(packet_html, packet_pdf)
    print_to_pdf(deck_html, deck_pdf)

    print(packet_pdf)
    print(deck_pdf)


def collect_metrics():
    return {
        "ts_modules": len(list(ROOT.glob("*.ts"))),
        "test_files": len(list(ROOT.glob("*.test.ts"))) + len(list(ROOT.glob("*.test.js"))),
        "batch_docs": len(list(ROOT.glob("BATCH_*.md"))),
        "ops_files": len([p for p in (ROOT / "atlas_ops").rglob("*") if p.is_file()]) if (ROOT / "atlas_ops").exists() else 0,
        "indexed_files": count_indexed_files(),
        "portfolio_assets": len([p for p in (ROOT / "docs" / "business_portfolio").glob("*") if p.is_file()]) if (ROOT / "docs" / "business_portfolio").exists() else 0,
        "date": datetime.now().strftime("%Y-%m-%d"),
    }


def count_indexed_files():
    index = ROOT / "docs" / "FILE_DATE_INDEX.md"
    if not index.exists():
        return 0
    return sum(1 for line in index.read_text(encoding="utf-8").splitlines() if line.startswith("| ") and "`" in line)


def print_to_pdf(source: Path, target: Path):
    if not CHROME.exists():
        raise FileNotFoundError(f"Chrome not found: {CHROME}")
    subprocess.run(
        [
            str(CHROME),
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={target}",
            source.resolve().as_uri(),
        ],
        check=True,
    )


def render_packet_html(metrics):
    return f"""<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>{NAME} Personal Portfolio</title>
  <style>
    @page {{ size: Letter; margin: 0.42in; }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: #141b24;
      background: #eef2f5;
      line-height: 1.42;
    }}
    .page {{
      min-height: 10in;
      page-break-after: always;
      background: #fff;
      padding: 0.42in;
      position: relative;
      overflow: hidden;
    }}
    .cover {{
      color: white;
      background:
        linear-gradient(135deg, rgba(8,13,24,0.96), rgba(21,50,71,0.92)),
        radial-gradient(circle at 80% 22%, rgba(76,154,127,0.5), transparent 28%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }}
    .brandmark {{
      width: 76px;
      height: 76px;
      display: grid;
      place-items: center;
      border: 2px solid rgba(255,255,255,0.7);
      font-weight: 900;
      font-size: 26px;
    }}
    .kicker {{
      text-transform: uppercase;
      letter-spacing: 1.3px;
      font-size: 10px;
      font-weight: 800;
      color: #5f7388;
      margin-bottom: 8px;
    }}
    .cover .kicker {{ color: #cde4f7; }}
    h1, h2, h3 {{ margin: 0; letter-spacing: 0; }}
    h1 {{ font-size: 48px; line-height: 1.02; max-width: 690px; }}
    h2 {{ font-size: 27px; margin-bottom: 14px; color: #101827; }}
    h3 {{ font-size: 15px; margin-bottom: 6px; color: #1e344f; }}
    .subtitle {{ font-size: 19px; max-width: 670px; color: rgba(255,255,255,0.88); margin-top: 15px; }}
    .cover-panel {{
      width: 54%;
      margin-left: auto;
      background: rgba(255,255,255,0.94);
      color: #101827;
      padding: 22px;
      border-radius: 6px;
    }}
    .grid {{ display: grid; gap: 14px; }}
    .cols-2 {{ grid-template-columns: 1fr 1fr; }}
    .cols-3 {{ grid-template-columns: 1fr 1fr 1fr; }}
    .card {{
      border: 1px solid #dce3ea;
      border-radius: 6px;
      padding: 15px;
      background: white;
    }}
    .dark {{
      background: #101827;
      color: white;
      border: 0;
    }}
    .dark h3 {{ color: #cde4f7; }}
    .metric {{
      background: #101827;
      color: white;
      min-height: 96px;
      padding: 14px;
      border-radius: 6px;
    }}
    .metric strong {{
      display: block;
      font-size: 28px;
      color: #cde4f7;
      margin-bottom: 4px;
    }}
    .bar {{
      height: 10px;
      background: #dce3ea;
      border-radius: 999px;
      overflow: hidden;
      margin-top: 6px;
    }}
    .bar span {{
      display: block;
      height: 100%;
      background: linear-gradient(90deg, #2d6b88, #4d9a7f);
    }}
    .chart {{
      display: grid;
      gap: 8px;
      margin-top: 8px;
    }}
    .chart-row {{
      display: grid;
      grid-template-columns: 92px 1fr 64px;
      gap: 8px;
      align-items: center;
      font-size: 11px;
    }}
    .chart-track {{
      height: 11px;
      border-radius: 999px;
      background: #dce3ea;
      overflow: hidden;
    }}
    .chart-track span {{
      display: block;
      height: 100%;
      background: linear-gradient(90deg, #1e344f, #2d6b88, #4d9a7f);
    }}
    table {{ width: 100%; border-collapse: collapse; font-size: 11px; }}
    th {{ text-align: left; background: #101827; color: white; padding: 8px; }}
    td {{ border-bottom: 1px solid #dce3ea; padding: 8px; vertical-align: top; }}
    ul {{ margin: 7px 0 0 18px; padding: 0; }}
    li {{ margin: 4px 0; }}
    .tag {{
      display: inline-block;
      padding: 4px 8px;
      border-radius: 999px;
      background: #e9f1f7;
      color: #1e344f;
      font-weight: 800;
      font-size: 10px;
      margin: 3px 3px 0 0;
    }}
    .section-band {{
      background: #e9f1f7;
      border-left: 5px solid #2d6b88;
      padding: 14px;
      margin: 10px 0 14px;
    }}
    .note {{
      font-size: 11px;
      color: #5f6b77;
      border-top: 1px solid #dce3ea;
      margin-top: 12px;
      padding-top: 8px;
    }}
    .footer {{
      position: absolute;
      bottom: 0.22in;
      left: 0.42in;
      right: 0.42in;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #e5e9ee;
      padding-top: 8px;
      color: #8b97a5;
      font-size: 10px;
    }}
  </style>
</head>
<body>
  {cover_page()}
  {identity_page(metrics)}
  {metrics_page(metrics)}
  {social_reach_page()}
  {systems_architect_page()}
  {brand_positioning_page()}
  {technical_portfolio_page()}
  {leadership_page()}
  {public_persona_page()}
  {next_level_page()}
</body>
</html>"""


def page(title, body, subtitle=None):
    subtitle_html = f"<div class='section-band'>{subtitle}</div>" if subtitle else ""
    return f"""<section class="page">
  <div class="kicker">Cole Avery Personal Portfolio</div>
  <h2>{title}</h2>
  {subtitle_html}
  {body}
  <div class="footer"><span>{NAME}</span><span>{DATE}</span></div>
</section>"""


def cover_page():
    return f"""<section class="page cover">
  <div>
    <div class="brandmark">CA</div>
    <div style="margin-top: 86px;">
      <div class="kicker">Founder-inventor portfolio</div>
      <h1>{NAME}</h1>
      <div class="subtitle">{TITLE}. Builder of ATLAS, Avery Industries, Creator Logistics, and an Ethical AI operating system designed around human approval, creator rights, and accessibility.</div>
    </div>
  </div>
  <div class="cover-panel">
    <h3>Personal Brand Thesis</h3>
    <p>Cole Avery is positioned as a founder-inventor: part systems architect, part creative director, part operator, building a company OS for ethical AI, accessibility, media, and creator-economy infrastructure.</p>
    <p class="note">Tone target: real-world inventor/operator. Confident, technical, cinematic, and grounded in artifacts.</p>
  </div>
  <div style="font-size:12px;color:rgba(255,255,255,0.75);">Prepared {DATE} | Personal portfolio packet</div>
</section>"""


def identity_page(metrics):
    body = f"""
    <div class="grid cols-2">
      <div class="card dark">
        <h3>Who Cole is</h3>
        <p>Founder, CEO, AI systems architect, software builder, digital marketing strategist, and creative technologist. The personal brand centers on building Avery Industries as a real operating company, not just a collection of ideas.</p>
      </div>
      <div class="card">
        <h3>Signature positioning</h3>
        <ul>
          <li>Ethical AI operator.</li>
          <li>Accessibility technology founder.</li>
          <li>Creator economy systems builder.</li>
          <li>Media and IP strategist.</li>
          <li>Founder-led company architect.</li>
        </ul>
      </div>
    </div>
    <div class="section-band"><strong>Brand line:</strong> Cole Avery builds human-centered systems for people who need technology to reduce complexity, not add to it.</div>
    <div class="grid cols-3">
      <div class="card"><h3>Technical Mind</h3><p>Builds modular backend systems, operating logic, automations, data schemas, and approval-gated workflows.</p></div>
      <div class="card"><h3>Creative Mind</h3><p>Develops brands, media channels, publishing catalogs, music identities, games, and IP systems.</p></div>
      <div class="card"><h3>Operator Mind</h3><p>Prioritizes revenue, daily reports, task boards, repeatable SOPs, and delegation structures.</p></div>
    </div>
    """
    return page("Founder Identity", body)


def metrics_page(metrics):
    body = f"""
    <div class="grid cols-3">
      <div class="metric"><strong>{metrics['ts_modules']}</strong>TypeScript system modules in the ATLAS/Avery workspace</div>
      <div class="metric"><strong>{metrics['test_files']}</strong>Test files supporting the local backend systems</div>
      <div class="metric"><strong>{metrics['batch_docs']}</strong>Roadmap/build batch documents organized into a company OS</div>
      <div class="metric"><strong>{metrics['indexed_files']}</strong>Tracked files in the ADHD-friendly file index</div>
      <div class="metric"><strong>{metrics['ops_files']}</strong>Operations files under `atlas_ops`</div>
      <div class="metric"><strong>{metrics['portfolio_assets']}</strong>Business portfolio assets already generated</div>
    </div>
    <div class="section-band"><strong>Data analyst note:</strong> these are build-system and documentation metrics from the local workspace. They demonstrate execution and operating-system depth, not revenue or customer traction.</div>
    <table>
      <tr><th>Capability</th><th>Evidence</th><th>Signal</th></tr>
      <tr><td>Systems architecture</td><td>Hundreds of modular backend engines</td><td>Can decompose a large company vision into functional systems</td></tr>
      <tr><td>Operating discipline</td><td>Daily report, task board, charter, approvals, ADHD indexes</td><td>Understands execution infrastructure</td></tr>
      <tr><td>Ethical AI governance</td><td>Approval gates, asset rights, human sovereignty, rights-aware portfolio language</td><td>Builds with risk controls instead of hype</td></tr>
      <tr><td>Creative breadth</td><td>Media, publishing, music, interactive, collectibles catalogs</td><td>Can connect technology to culture and IP</td></tr>
    </table>
    """
    return page("Founder Metrics Dashboard", body, "The goal is not to look busy. The goal is to show proof of architecture, execution range, and operating depth.")


def social_reach_page():
    body = """
    <div class="grid cols-3">
      <div class="metric"><strong>50M+</strong>Reported cross-platform views across multiple campaigns</div>
      <div class="metric"><strong>5</strong>Major traffic channels: X/Twitter, Facebook, Reddit, YouTube, Twitch</div>
      <div class="metric"><strong>100%</strong>Reported 5-star quality rating for editing-service delivery</div>
    </div>
    <div class="grid cols-2" style="margin-top:14px;">
      <div class="card">
        <h3>Reported traffic distribution</h3>
        <div class="chart">
          <div class="chart-row"><span>YouTube</span><div class="chart-track"><span style="width:92%"></span></div><span>High</span></div>
          <div class="chart-row"><span>Reddit</span><div class="chart-track"><span style="width:78%"></span></div><span>High</span></div>
          <div class="chart-row"><span>Facebook</span><div class="chart-track"><span style="width:70%"></span></div><span>Strong</span></div>
          <div class="chart-row"><span>X/Twitter</span><div class="chart-track"><span style="width:66%"></span></div><span>Strong</span></div>
          <div class="chart-row"><span>Twitch</span><div class="chart-track"><span style="width:48%"></span></div><span>Niche</span></div>
        </div>
        <p class="note">Distribution is presentation-modeling, not an analytics export. Replace with exact platform percentages when source reports are attached.</p>
      </div>
      <div class="card dark">
        <h3>Creator Logistics proof angle</h3>
        <p>Creator Logistics should be positioned as the commercial proof that Cole can turn attention into service demand: editing, shorts, creator operations, upload prep, and content infrastructure.</p>
        <ul>
          <li>High-traffic campaign experience.</li>
          <li>100% reported 5-star editing quality rating.</li>
          <li>Creator-service workflow ready for lead capture and delivery tracking.</li>
        </ul>
      </div>
    </div>
    <div class="section-band"><strong>Diligence action:</strong> attach analytics screenshots, platform exports, client reviews, and project examples before using the 50M+ and 100% 5-star claims in a formal investor or client packet.</div>
    """
    return page("Social Reach and Creator Logistics Proof", body, "Cole's personal brand should lead with real distribution experience: large-scale cross-platform traffic plus a service path that can convert attention into revenue.")


def systems_architect_page():
    body = """
    <table>
      <tr><th>System</th><th>What it proves</th><th>Personal brand value</th></tr>
      <tr><td>ATLAS HQ</td><td>Ability to design a company operating system</td><td>Chief systems architect credibility</td></tr>
      <tr><td>Master Task Board</td><td>Can turn vision into a usable temporary database</td><td>Practical operator, not only visionary</td></tr>
      <tr><td>Daily Executive Report</td><td>Can summarize company health for executive decisions</td><td>CEO discipline and focus</td></tr>
      <tr><td>Creator Logistics</td><td>Service-led revenue strategy</td><td>Commercial instincts and cash-flow focus</td></tr>
      <tr><td>AveryTech / ATLAS Assist / EchoFrame</td><td>Mission-driven product direction</td><td>Accessibility founder and ethical AI builder</td></tr>
      <tr><td>Business Portfolio Packet</td><td>Investor-facing communication</td><td>Can package complexity into credible narrative</td></tr>
    </table>
    """
    return page("Systems Architect Portfolio", body)


def brand_positioning_page():
    body = """
    <div class="grid cols-2">
      <div class="card dark">
        <h3>The archetype</h3>
        <p>Founder-inventor with a command center mindset: ambitious, technical, theatrical enough to be memorable, but grounded in systems, documentation, and approval controls.</p>
      </div>
      <div class="card">
        <h3>What to avoid</h3>
        <ul>
          <li>Unverifiable genius claims.</li>
          <li>Fake traction.</li>
          <li>Overpromising AI capability.</li>
          <li>Presenting every future division as already operational.</li>
        </ul>
      </div>
      <div class="card">
        <h3>What to emphasize</h3>
        <ul>
          <li>Founder-created systems.</li>
          <li>Ethical AI and creator rights.</li>
          <li>Accessibility mission.</li>
          <li>Creator Logistics revenue path.</li>
          <li>ATLAS as operational leverage.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Signature phrases</h3>
        <span class="tag">Ethical AI operator</span>
        <span class="tag">Founder-inventor</span>
        <span class="tag">Systems architect</span>
        <span class="tag">Accessibility technologist</span>
        <span class="tag">Creator economy builder</span>
      </div>
    </div>
    """
    return page("Personal Brand Architecture", body, "This is the professional version of the “real-life tech mastermind” brand: impressive, ambitious, and still credible.")


def technical_portfolio_page():
    body = """
    <div class="grid cols-2">
      <div class="card">
        <h3>Engineering strengths</h3>
        <ul>
          <li>TypeScript backend systems.</li>
          <li>Local-first prototypes.</li>
          <li>Workflow automation design.</li>
          <li>Approval-gated architecture.</li>
          <li>Data structures and operating schemas.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Product strengths</h3>
        <ul>
          <li>Accessibility products.</li>
          <li>Executive dysfunction tools.</li>
          <li>Creator operations software.</li>
          <li>AI assistant workflows.</li>
          <li>Research and grant readiness systems.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Creative technology strengths</h3>
        <ul>
          <li>Media brand systems.</li>
          <li>Music and publishing catalog strategy.</li>
          <li>Game and interactive product roadmaps.</li>
          <li>Collectibles and IP monetization logic.</li>
        </ul>
      </div>
      <div class="card dark">
        <h3>Founder edge</h3>
        <p>Cole can connect software architecture, ethical AI, media, accessibility, and business operations into one coherent company system.</p>
      </div>
    </div>
    """
    return page("Technical and Creative Portfolio", body)


def leadership_page():
    body = """
    <table>
      <tr><th>Leadership Role</th><th>How Cole Shows It</th><th>Next Proof Point</th></tr>
      <tr><td>CEO</td><td>Defines company structure, priorities, and approval rules</td><td>Daily executive reports and focused execution</td></tr>
      <tr><td>AI Engineer</td><td>Builds modular ATLAS systems and governance rules</td><td>Working dashboard connected to Master Task Board</td></tr>
      <tr><td>Product Strategist</td><td>Prioritizes ATLAS Assist, EchoFrame, Creator Logistics CRM</td><td>Prototype and user/pilot feedback</td></tr>
      <tr><td>Marketing Strategist</td><td>Maps channels, brands, creator services, public authority</td><td>One high-converting Creator Logistics offer</td></tr>
      <tr><td>Creative Director</td><td>Maintains media, music, publishing, game, and collectible pipelines</td><td>One focused public-facing flagship brand</td></tr>
    </table>
    """
    return page("Leadership Profile", body)


def public_persona_page():
    body = """
    <div class="grid cols-3">
      <div class="card"><h3>Editor ColeTrain</h3><p>Cash-flow persona for creator services, editing, YouTube operations, and case studies.</p><div class="bar"><span style="width:95%"></span></div></div>
      <div class="card"><h3>Atlas Protocol</h3><p>Ethical AI, future technology, accessibility, systems thinking, and AveryTech trust.</p><div class="bar"><span style="width:92%"></span></div></div>
      <div class="card"><h3>The New Prometheus</h3><p>Founder authority, philosophy, leadership, psychology, myth, and public-intellectual identity.</p><div class="bar"><span style="width:90%"></span></div></div>
      <div class="card"><h3>Avery Industries</h3><p>Company-building-in-public, recruiting, investor trust, and corporate PR.</p><div class="bar"><span style="width:82%"></span></div></div>
      <div class="card"><h3>Lord Dionysus</h3><p>Music identity with folk, blues, Americana, mythology, and personal storytelling.</p><div class="bar"><span style="width:74%"></span></div></div>
      <div class="card"><h3>Studio ColeTrain</h3><p>Animation, behind-the-scenes, personal production studio, and future IP development.</p><div class="bar"><span style="width:78%"></span></div></div>
    </div>
    <div class="note">Priority recommendation: lead with Editor ColeTrain for revenue, Atlas Protocol for Ethical AI, and The New Prometheus for founder authority.</div>
    """
    return page("Public Persona Map", body)


def next_level_page():
    body = """
    <div class="grid cols-2">
      <div class="card dark">
        <h3>To look like a serious tech founder</h3>
        <ul>
          <li>Ship one public ATLAS demo.</li>
          <li>Close one Creator Logistics client.</li>
          <li>Publish one polished founder essay or video.</li>
          <li>Show one dashboard screenshot.</li>
          <li>Document one measurable user/customer result.</li>
        </ul>
      </div>
      <div class="card">
        <h3>To earn the “mastermind” brand</h3>
        <ul>
          <li>Keep claims evidence-backed.</li>
          <li>Show artifacts, not slogans.</li>
          <li>Lead with operating systems.</li>
          <li>Make ethical AI concrete.</li>
          <li>Protect focus and ship.</li>
        </ul>
      </div>
    </div>
    <div class="section-band"><strong>Personal brand north star:</strong> Cole Avery is the founder building the command center for ethical AI, accessibility technology, creator infrastructure, and future media/IP systems.</div>
    """
    return page("Next-Level Proof Plan", body)


def render_deck_html(metrics):
    slides = [
        ("Cole Avery", "Founder, CEO, AI systems architect, and creative technologist building Avery Industries and ATLAS.", "Personal Brand Deck"),
        ("The Archetype", "A founder-inventor with a command center mindset: technical, creative, strategic, and execution-focused.", "Positioning"),
        ("The Proof", f"{metrics['ts_modules']} TypeScript modules, {metrics['test_files']} test files, {metrics['batch_docs']} roadmap docs, and {metrics['indexed_files']} indexed files in the Avery/ATLAS workspace.", "Build Metrics"),
        ("Distribution Proof", "Reported 50M+ cross-platform views across X/Twitter, Facebook, Reddit, YouTube, and Twitch campaigns, with Creator Logistics positioned to turn attention into revenue.", "Social Reach"),
        ("The Company OS", "ATLAS coordinates tasks, agents, approvals, reports, memory, ideas, and executive decisions.", "Systems Architecture"),
        ("Ethical AI Operator", "Cole’s AI thesis centers on creator rights, founder-created/approved materials, human approval, accessibility, and sustainable compute.", "Ethical AI"),
        ("Revenue Edge", "Creator Logistics and Editor ColeTrain create the near-term cash path through editing, shorts, channel systems, and creator operations.", "Commercial Strategy"),
        ("AveryTech Mission", "ATLAS Assist, EchoFrame, executive dysfunction tools, smart glasses support, and accessibility software form the product mission.", "Product Strategy"),
        ("Public Brand Stack", "Editor ColeTrain for cash flow, Atlas Protocol for Ethical AI, The New Prometheus for founder authority, Avery Industries for company trust.", "Media Strategy"),
        ("Next Proof Points", "Ship demo, close client, publish founder essay/video, show dashboard, document measurable result.", "Execution Plan"),
    ]
    body = "\n".join(deck_slide(title, text, kicker) for title, text, kicker in slides)
    return f"""<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>{NAME} Personal Brand Deck</title>
  <style>
    @page {{ size: Letter landscape; margin: 0; }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; font-family: Arial, Helvetica, sans-serif; background:#0b111d; }}
    .slide {{
      width: 11in;
      height: 8.5in;
      page-break-after: always;
      padding: 0.62in;
      position: relative;
      overflow: hidden;
      color: #111827;
      background:
        radial-gradient(circle at 83% 20%, rgba(77,154,127,0.28), transparent 24%),
        linear-gradient(116deg, #ffffff 0%, #ffffff 60%, #dfeaf1 60%, #b8cbd8 100%);
    }}
    .slide:before {{ content:""; position:absolute; left:0; top:0; width:0.2in; height:100%; background:#101827; }}
    .mark {{ position:absolute; right:0.62in; top:0.52in; width:62px; height:62px; border:2px solid #101827; display:grid; place-items:center; font-weight:900; }}
    .kicker {{ color:#2d6b88; text-transform:uppercase; font-weight:900; letter-spacing:1.2px; font-size:13px; }}
    h1 {{ font-size:58px; line-height:1.02; letter-spacing:0; margin:1.15in 0 0.25in; max-width:7.7in; }}
    p {{ font-size:25px; line-height:1.28; max-width:7.7in; color:#354252; margin:0; }}
    .chip {{ position:absolute; right:0.62in; bottom:0.64in; width:2.5in; background:#101827; color:white; padding:15px; border-radius:6px; font-size:13px; line-height:1.35; }}
    .footer {{ position:absolute; left:0.62in; bottom:0.35in; right:0.62in; display:flex; justify-content:space-between; color:#7d8a99; font-size:12px; }}
  </style>
</head>
<body>{body}</body>
</html>"""


def deck_slide(title, text, kicker):
    return f"""<section class="slide">
  <div class="mark">CA</div>
  <div class="kicker">{kicker}</div>
  <h1>{title}</h1>
  <p>{text}</p>
  <div class="chip">Founder-inventor | Ethical AI | Accessibility tech | Creator infrastructure</div>
  <div class="footer"><span>{NAME}</span><span>{DATE}</span></div>
</section>"""


def render_markdown(metrics):
    return f"""# {NAME} Personal Portfolio

Prepared: {DATE}

## Positioning

{NAME} is a founder, CEO, AI systems architect, software builder, digital marketing strategist, and creative technologist.

Personal brand: founder-inventor building the command center for Ethical AI, accessibility technology, creator infrastructure, and future media/IP systems.

## Metrics

- TypeScript modules: {metrics['ts_modules']}
- Test files: {metrics['test_files']}
- Roadmap/build batch documents: {metrics['batch_docs']}
- Indexed workspace files: {metrics['indexed_files']}
- Operations files: {metrics['ops_files']}
- Business portfolio assets: {metrics['portfolio_assets']}
- Reported cross-platform campaign views: 50M+
- Reported Creator Logistics editing quality: 100% 5-star rating

Workspace metrics are build and operating-system metrics, not revenue metrics. Social and service-quality metrics should be treated as reported metrics until backed by screenshots, exports, reviews, or testimonials.

## Brand Pillars

- Ethical AI operator.
- Accessibility technology founder.
- Creator economy systems builder.
- Founder-led company architect.
- Creative technologist.

## Social Reach and Creator Logistics

Reported reach:

- X/Twitter.
- Facebook.
- Reddit.
- YouTube.
- Twitch.
- 50M+ total reported views across multiple campaigns.

Creator Logistics proof angle:

- Editing-service quality positioned as 100% 5-star based on reported service reviews.
- High-traffic campaign experience supports the Creator Logistics offer.
- Attach proof before formal investor/client use.

## Priority Public Personas

1. Editor ColeTrain: revenue and Creator Logistics.
2. Atlas Protocol: Ethical AI and AveryTech.
3. The New Prometheus: founder authority.
4. Avery Industries: company-building trust.

## Next Proof Points

- Ship one public ATLAS demo.
- Close one Creator Logistics client.
- Publish one polished founder essay or video.
- Show one dashboard screenshot.
- Document one measurable customer or user result.
"""


if __name__ == "__main__":
    main()
