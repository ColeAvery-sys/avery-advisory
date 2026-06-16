from __future__ import annotations

from datetime import date
from pathlib import Path
from xml.sax.saxutils import escape
from zipfile import ZIP_DEFLATED, ZipFile


OUT_DIR = Path("atlas_ops/exports/books/first_final_drafts")


def p(text: str, style: str | None = None) -> str:
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
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>
    <w:pPr><w:spacing w:before="220" w:after="120"/></w:pPr>
    <w:rPr><w:b/><w:rFonts w:ascii="Garamond" w:hAnsi="Garamond"/><w:sz w:val="27"/></w:rPr>
  </w:style>
</w:styles>"""


def write_docx(path: Path, title: str, subtitle: str, sections: list[tuple[str, list[str]]]) -> None:
    body = [
        p(title, "Title"),
        p(subtitle, "Subtitle"),
        p("First-final draft packet prepared by ATLAS for Mr. Avery."),
        p(f"Generated: {date.today().isoformat()}"),
        page_break(),
    ]
    for heading, paragraphs in sections:
        body.append(p(heading, "Heading1"))
        for para in paragraphs:
            body.append(p(para))
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


def chapter(title: str, summary: str, scene: str) -> str:
    return f"{title}\n\nDraft direction: {summary}\n\nRepresentative prose:\n{scene}"


BOOKS = [
    {
        "file": "The_Avery_Notes_First_Final_Draft.docx",
        "title": "The Avery Notes",
        "subtitle": "Meditations of a Modern Polymath - Volume I",
        "sections": [
            ("Editorial Position", [
                "This first-final draft keeps the manuscript as a living archive: part philosophy, part confession, part systems analysis. The strongest version is not a generic self-help book. It is a field record from a builder studying modern life while still inside it.",
                "The final structure is twenty entries arranged as a movement from fragmentation to integration: polymath identity, the internet, discipline, love, masculinity, grief, and what remains when performance falls away.",
            ]),
            ("Clean Book Draft", [
                chapter("Introduction - Field Notes From the Labyrinth", "Open with the existing claim that this is not a self-help book, then sharpen the promise: the reader is being invited into an honest record, not a doctrine.", "This is not a self-help book. It is a record. Some pages came from discipline. Some came from collapse. Some came from the kind of night where the mind refuses sleep because the pattern is almost visible and the body cannot rest until it names what it sees."),
                chapter("Entry I - The Polymath Problem", "Define the polymath as a collector of patterns rather than a person who knows everything.", "The modern world asks a child what he wants to be before it asks what kind of mind he has. Mine never moved in one lane. It crossed mythology, business, psychology, branding, technology, love, cults, discipline, and the quiet mechanics of power."),
                chapter("Entry II - The Internet Entered the Nervous System", "Explain algorithmic life as an environment that reshapes people while pretending to be a tool.", "People think they use the internet. That is only half true. The internet uses attention, and attention is the gate through which desire, fear, belief, identity, and memory are quietly rearranged."),
                chapter("Entry III - Discipline Without Mercy", "Keep the strongest idea: discipline built on self-hatred is fear wearing armor.", "For years I treated myself like an employee I secretly despised. I demanded more, rewarded less, and called the cruelty ambition because the output looked impressive from a distance."),
                chapter("Entry IV - Ambition Is Not a Home", "Move from performance into the emotional cost of attaching worth to usefulness.", "A man can build a kingdom and still be homeless inside himself if every room was designed to impress people who never learned how to love him without proof."),
                chapter("Entry V - What Survives", "Close the volume with mortality, love, and presence as the real argument.", "If these notes survive me, let them be human. Not polished into fake certainty. Not cleaned until the ache disappears. Human enough that someone else can read them and feel less alone inside the same strange era."),
            ]),
            ("Next Editorial Pass", [
                "Expand Entries IV-XVIII from the existing note fragments, then standardize entry headings and remove duplicate phrases. The strongest commercial position is literary nonfiction / philosophical memoir, not productivity.",
            ]),
        ],
    },
    {
        "file": "The_Dojo_Cookbook_First_Final_Draft.docx",
        "title": "The Dojo Cookbook",
        "subtitle": "Volume One: Ashes and Appetite",
        "sections": [
            ("Book Position", [
                "A shonen-inspired story about food, fighting, community, self-acceptance, and standing up to systems that punish need. The book works best as a manga script / illustrated middle-grade-to-YA hybrid.",
                "Core sentence: No one survives alone. Strength is what people build together.",
            ]),
            ("Cast", [
                "Marcus Thorn is the heart: kind, loud, stubborn, hungry, and convinced he has to earn care. Philly is the mentor who feeds before judging. Sable turns knowledge into liberation. Buttermilk proves joy is fuel. Kip shows that difference is not inefficiency. Warden Aurelius is order without empathy.",
            ]),
            ("Volume One Draft", [
                chapter("Chapter 1 - Hunger Is Not a Crime", "Marcus loses a fight because he is underfed, then returns home to a house where food is treated as a reward for winning.", "Marcus hit the ground hard enough to taste dust. Around him, the square kept laughing. His stamina bar flickered in his imagination, not empty because he was weak, but empty because no one had let him fill it."),
                chapter("Chapter 2 - No One Comes", "The house fire destroys Marcus's old life. The neighbors watch and do nothing because everyone has been trained to call survival someone else's problem.", "The house burned loud. The street stayed quiet. Windows opened, faces appeared, and then each face disappeared behind glass as if his disaster were weather passing through someone else's town."),
                chapter("Chapter 3 - Someone Does", "Philly enters with food, not a lecture, and breaks the rule Marcus has lived under.", "Philly knelt in the ash and held out a bowl. Marcus stared at the steam like it might vanish if he wanted it too badly. 'Why?' he asked. Philly answered like the world should have been simple. 'Because you're hungry.'"),
                chapter("Chapter 4 - The Dojo Without Walls", "Marcus learns a training space with no fees, no ranks, and no shame. Sable introduces the idea that losing can be data instead of failure.", "There were no trophies in Philly's dojo because there were no walls to hang them on. There was grass, chalk lines, mismatched mats, a pot of rice, and people who clapped when someone learned to fall without breaking."),
                chapter("Chapter 5 - Eat Together", "Buttermilk turns the kitchen into the emotional center of the story.", "Buttermilk did not ask who deserved seconds. She asked who was still hungry, and that small difference made Marcus feel more exposed than any fight had."),
                chapter("Chapter 6 - Kip", "Kip joins the party and teaches Marcus patience, apology, and communication beyond words.", "Kip tapped twice on the table, then once on the bowl. Sable watched, translated, and said, 'He is asking if you are safe now.' Marcus looked at the food, then at the people around it. 'I think I'm learning how to be.'"),
                chapter("Chapter 7 - Standing Up", "Marcus fights for the dojo and wins because he lets the community support him.", "He did not rush first. He breathed. He remembered Sable's footwork, Buttermilk's packed meal, Kip's silent cheer, Philly's hand on his shoulder. This time, strength did not arrive as rage. It arrived as everyone."),
                chapter("Chapter 8 - A City That Works", "End with Aurelius's clean, joyless city and the ideological threat of perfect order.", "In Aurelius's city, no one went hungry. No one sang either. The meals arrived measured, balanced, identical, and silent. The Warden watched the city function and said, 'Disorder creates suffering.' Far away, Marcus laughed around a crowded table, proving him wrong without knowing it."),
            ]),
        ],
    },
    {
        "file": "Pandemic_Novel_First_Final_Draft.docx",
        "title": "Pandemic Novel",
        "subtitle": "A Family Under Lockdown",
        "sections": [
            ("Book Position", [
                "The existing draft has a strong domestic-apocalypse engine: a small farmhouse, ration trucks, a child born into crisis, a marriage strained by fear, and a nurse sister carrying medical truth into the house.",
                "The clean final draft should center Lex as the emotional anchor, Dawson as a protector at risk of becoming reckless, and Teghan as the bridge between family love and institutional collapse.",
            ]),
            ("First-Final Draft", [
                chapter("Chapter 1 - Milk", "Open on Lex cleaning glass from Dawson's hands after he breaks into a neighbor's house for milk.", "Alexa Grey had practiced the art of biting her tongue for most of the lockdown. That night, with her husband's blood on a dish towel and stolen milk sweating on the counter, she discovered practice did not make silence easier."),
                chapter("Chapter 2 - The House That Stayed the Same", "Establish the farmhouse as sanctuary while the nation moves toward martial control.", "The hallway still held wedding pictures, baby pictures, and crooked frames from a life that believed tomorrow would resemble yesterday. Outside, the country had become trucks, checkpoints, and rules. Inside, Lex kept wiping counters as if cleanliness could hold the world together."),
                chapter("Chapter 3 - Teghan at the Door", "Teghan arrives from the hospital with news about their father and the blood-type pattern.", "The knock came after midnight. Dawson reached for the pistol before he reached for the knob, then hated himself for how natural the motion felt. Through the peephole he saw Teghan shaking in the cold, and the old world came back for one second wearing his sister-in-law's face."),
                chapter("Chapter 4 - Six Weeks", "Teghan moves in, bringing grief, medical knowledge, and the threat of returning to work.", "Six weeks sounded like mercy until Lex heard the limit inside it. Six weeks of her sister safe on the couch. Six weeks before the hospital could claim her again. Six weeks before the house had to decide whether fear was stronger than family."),
                chapter("Chapter 5 - Rations", "Breakfast becomes the pressure point: eggs counted, supplies negotiated, pride challenged.", "Lex counted eleven eggs and called it a victory because the new world had made small arithmetic holy. One more day until the ration truck. One more day of convincing Dawson that waiting was not the same thing as failing."),
                chapter("Chapter 6 - The Neighborhood", "Dawson tries to turn guilt into community care while quarantine makes even kindness illegal.", "He wanted to check on the old people down the road. He wanted to fix something with his hands. He wanted the world to give him one problem that a man with a truck and tools could still solve."),
                chapter("Chapter 7 - Positive", "Dennis's condition worsens and the family faces the cost of not being allowed near the sick.", "Grief had become procedural. No visiting. No waiting room. No hand to hold. Just updates, numbers, and a nurse's voice trying not to crack while saying a father might not survive the night."),
                chapter("Chapter 8 - The Truck Does Not Come", "The ration truck misses its window, forcing Dawson, Lex, and Teghan into a moral decision.", "By dusk the driveway was empty. Dawson stood at the window long after Lex stopped asking him to sit down. Hunger was one thing. Watching your wife pretend not to be scared was another."),
                chapter("Chapter 9 - Outside", "The family breaks quarantine for a neighbor, transforming Dawson's recklessness into chosen responsibility.", "This time Dawson did not leave to steal. He left because Mrs. Harlan's porch light had been blinking for twenty minutes, and in the country a blinking porch light meant someone had run out of ways to ask."),
                chapter("Chapter 10 - What Normal Costs", "End with the family no longer waiting for the old world, but building rules for the new one.", "Normal did not return. Something smaller and harder did: a schedule, a pantry list, names checked by window light, and three adults deciding that fear could make them careful without making them cruel."),
            ]),
        ],
    },
    {
        "file": "Salvation_Book_1_First_Final_Draft.docx",
        "title": "Salvation: Book 1",
        "subtitle": "The Chosen Vine",
        "sections": [
            ("Book Position", [
                "This first-final draft reframes the material as gothic psychological suspense: desire versus doctrine, the danger of being seen by the wrong person, and the cost of confusing intensity with salvation.",
                "Important safety direction for the finished novel: Silas should remain seductive and psychologically precise, but the narrative should not excuse coercion or cult control. Evelyn's choices can be emotionally truthful without making manipulation look healthy.",
            ]),
            ("First-Final Draft", [
                chapter("Chapter 1 - The Plan", "Evelyn introduces the rules that shaped her and the quiet restlessness underneath obedience.", "There are rules for everything. Rules for what you wear. Rules for what you say. Rules for what you are allowed to want before wanting becomes a confession."),
                chapter("Chapter 2 - Coordinates", "The mission opportunity arrives with coordinates instead of a normal address.", "The paperwork was precise until it mattered. Packing list. Schedule. Emergency contact. Then, where a town should have been, there were only coordinates. Ivy called it adventurous. Lily called it providence. Evelyn called it nothing because the word fear felt too honest."),
                chapter("Chapter 3 - The Clearing", "Evelyn, Ivy, and Lily reach the clearing where The Vine's influence begins.", "The trees did not open so much as step aside. In the clearing, the air felt older than weather. Evelyn had the strange thought that places could wait the way people did."),
                chapter("Chapter 4 - Silas", "Silas saves Evelyn, refuses her gratitude, and creates the first emotional hook.", "He did not look like a monster. That was the first danger. He looked calm, almost tired, as if he had already forgiven the world for misunderstanding him and expected Evelyn to catch up."),
                chapter("Chapter 5 - Different or Honest", "Silas names Evelyn's internal conflict, making her feel seen.", "'Different,' he repeated. 'Or honest?' Evelyn hated him for the question because it felt less like temptation than recognition."),
                chapter("Chapter 6 - Ivy Leans Forward", "Ivy is drawn to the freedom of The Vine while Lily resists.", "Ivy touched the leaf-marked gate like it was a dare. Lily whispered that they should go home. Evelyn stood between them and realized the most frightening path was the one that made both girls sound right."),
                chapter("Chapter 7 - The First Teaching", "The Vine's language of freedom begins to blur with control.", "No one ordered them to stay. That was the genius of it. Doors remained unlocked. Paths remained visible. Every choice was framed until leaving felt like betrayal and staying felt like bravery."),
                chapter("Chapter 8 - Cracks", "Evelyn starts lying to herself in the language of faith.", "She told herself she was studying danger so she could understand it. She told herself understanding was not desire. She told herself desire was not surrender. By morning, every sentence sounded rehearsed."),
                chapter("Chapter 9 - The Vine", "Evelyn discovers Silas leads a group, not a retreat, and the emotional stakes become explicit.", "The symbol was everywhere once she knew how to see it: carved under tables, stitched into hems, pressed into wax, hidden in the way followers paused before saying his name."),
                chapter("Chapter 10 - Follow", "End Book 1 with Evelyn choosing to remain while the reader understands the danger.", "Silas offered no hand. He knew better than to make the choice look like his. Evelyn stepped forward anyway, and the clearing seemed to breathe around her like something rooted had finally found water."),
            ]),
        ],
    },
    {
        "file": "The_Book_of_the_Twice_Born_King_First_Final_Draft.docx",
        "title": "The Book of the Twice-Born King",
        "subtitle": "The First Vine: Of Awakening",
        "sections": [
            ("Book Position", [
                "This draft keeps the scripture-like voice but gives the book a cleaner arc: awakening, followers, descent, second birth, and the unresolved crown.",
                "Best form: mythic fantasy scripture / in-world sacred text, with short numbered chapters and interludes from later districts to show how the myth infects history.",
            ]),
            ("First-Final Draft", [
                chapter("Chapter 1 - Of Awakening", "The Vine stirs beneath the world and the child not born of woman emerges laughing.", "And it came to pass that beneath the roots of the first wild hill, where no temple had stood, there stirred a thing which was called the Vine. And it descended not from above, neither was it formed by the hands of man, but it grew."),
                chapter("Chapter 2 - Of Questions", "The Uncrowned One's presence makes obedience taste false.", "And the Vine whispered not commandments, but questions; and questions are more terrible than kings. For a command may be refused, but a question entereth the heart and buildeth a room there."),
                chapter("Chapter 3 - Of the First Followers", "People gather without being summoned, drawn by the possibility that life was not meant to kneel.", "They came with empty bowls, broken tools, hidden wounds, and songs they had been forbidden to sing. And he received them not as subjects, but as witnesses."),
                chapter("Chapter 4 - Of the Closed Sky", "Priests and rulers name him blasphemy because his power grows from below.", "The keepers of the high altars tore their garments and cried, 'He hath no authority.' But the roots beneath their stones answered, 'Neither had ye, save what fear lent you.'"),
                chapter("Chapter 5 - Of the Breaking", "The chosen must descend beneath silence deeper than death.", "For the First Birth was not the end. The chosen must be broken where no crowd may praise him, and must descend where even the Vine speaketh only in pressure and dark water."),
                chapter("Chapter 6 - Of the Second Birth", "He rises changed, not as a ruler but as a force the world cannot contain.", "And when he rose, the earth did not open. It remembered. The roots drew back as servants and as kin, and the laughter that came from him was no longer the laughter of a child, but of a storm learning its name."),
                chapter("Chapter 7 - Of the Unthroned King", "The crown is refused because rule is not the mission; awakening is.", "They brought him gold and iron and bone, and each crown was heavier than the last. But he cast them down and said, 'A throne is a grave for the living if the people kneel around it.'"),
                chapter("Chapter 8 - Of the Greed District", "Later-world fragment: Pluto's district misreads the Vine as appetite and spectacle.", "In the Greed District, they sold counterfeit roots in velvet boxes and called hunger holiness. Yet even there, beneath the casino lights, one true shoot split the marble floor."),
                chapter("Chapter 9 - Of the Sleeping", "The book returns to those still waiting for permission to live.", "And many remained asleep, for sleep is often kinder than knowledge at first. But beneath each house, each market, each prison, the Vine continued without ceasing."),
                chapter("Chapter 10 - Of the King Yet Uncrowned", "End with prophecy: the Twice-Born King walks among the sleeping.", "Thus began the record of the Twice-Born King, who walketh yet unthroned among the sleeping. And blessed are they who wake before the crown is offered, for they shall know him as brother before men name him lord."),
            ]),
        ],
    },
    {
        "file": "Olympus_Rewritten_First_Final_Draft.docx",
        "title": "Olympus Rewritten",
        "subtitle": "A Mythic Romance Anthology",
        "sections": [
            ("Book Position", [
                "A luminous mythic anthology where divine power grows through honesty, consent, repair, and bonds that do not require ownership. The Temple of Many ties all arcs together.",
                "The first-final draft keeps the four-arc, sixteen-chapter structure and cleans the tone toward healing fantasy rather than explicit romance.",
            ]),
            ("First-Final Draft", [
                chapter("Chapter 1 - The Underworld That Does Not Sleep", "Persephone names the wound of being divided between worlds.", "The Underworld was not cruel. That was the harder truth. Cruelty would have been easier to hate. It was beautiful, solemn, and lonely by design, and Persephone had grown tired of being called a season when she was a soul."),
                chapter("Chapter 2 - The Gardener of Quiet Doors", "A mortal gardener-priest arrives as mediator, not prize.", "The Gardener touched the black soil and waited for permission before planting anything in it. Hades watched that small courtesy as if it were a language he had forgotten he knew."),
                chapter("Chapter 3 - Winter Is a Language", "The triad learns that secrecy fractures the fields.", "When Persephone hid her fear, the asphodel split. Not from anger. From pressure. The world had grown tired of gods calling silence peace."),
                chapter("Chapter 4 - The Third Bloom Rite", "The first constellation forms and the Underworld gains Bloomnight.", "Three truths were spoken. Three lights answered. Beneath them, winter did not end; it opened, and blue-white flowers rose like stars learning to grow downward."),
                chapter("Chapter 5 - Moon Oaths", "Artemis defends non-romantic devotion as sacred.", "'Your love is not lesser,' Hestia told her. 'It is lunar.' Artemis looked away before anyone could see how badly she had needed a god to say it."),
                chapter("Chapter 6 - The Hunt Without Possession", "The devotion circle practices belonging without ownership.", "The hunters did not swear to be claimed. They swore to witness, protect, and return. Under Artemis, that was enough to make the moon sharpen."),
                chapter("Chapter 7 - The Silver Fracture", "A hidden injury teaches the circle that usefulness is not worth self-erasure.", "The novice fell before the beast did. Artemis knelt beside them, not furious at weakness, but furious at the world that had taught them to hide pain from love."),
                chapter("Chapter 8 - The Circle of the Unclaimed", "The circle forms a silver crest.", "Their constellation did not burn hot. It cooled. It steadied. It made every lonely watcher understand that devotion could be a shelter without becoming a cage."),
                chapter("Chapter 9 - The Festival With Rules", "Dionysus teaches freedom with care.", "Dionysus arrived laughing, but the first thing he taught was not wine. It was asking. The second was listening. The third was agreement. The fourth was aftercare."),
                chapter("Chapter 10 - The Threaded Dance", "Consent becomes visible as golden threads.", "The music bent when everyone wanted it to. Vines bloomed from stone. Golden threads crossed wrist to wrist, not binding, only showing where trust had chosen to shine."),
                chapter("Chapter 11 - When the Threads Snap", "Pressure corrupts the revel and Dionysus stops everything to ground the crowd.", "The god of ecstasy raised one hand, and the music died. 'No joy is holy enough to ignore harm,' he said, and the frightened crowd breathed because someone had finally made safety louder than spectacle."),
                chapter("Chapter 12 - The Covenant of Many Cups", "Repair, accountability, and boundaries transform the grove.", "They did not exile the one who harmed. They did not excuse him either. The grove lit only after apology met consequence and consequence met care."),
                chapter("Chapter 13 - Roads That Remember", "Hermes's half-truths make the roads collapse.", "A road can forgive distance. It cannot forgive being used to avoid arrival. Hermes learned this when three letters reached the wrong hearts at once."),
                chapter("Chapter 14 - The Map of Honest Distance", "Hermes learns transparency is not loss of freedom.", "For the first time, Hermes wrote a message without cleverness. It felt naked. It also arrived."),
                chapter("Chapter 15 - The Realm-Bridge Rite", "Partners across realms build structure and resist sabotage.", "Truth did not erase distance. It made distance navigable, and the bridge held because every person standing on it knew where they had agreed to meet."),
                chapter("Chapter 16 - Olympus Rewritten", "All constellations flare, exposing the old order and making repair sacred.", "The sky did not fall. It rearranged itself. Olympus remained Olympus, but the throne was no longer the center. The hearth was."),
            ]),
        ],
    },
    {
        "file": "Black_Halo_First_Final_Draft.docx",
        "title": "Black Halo",
        "subtitle": "Manga Pilot: Authority Claimed From Below",
        "sections": [
            ("Book Position", [
                "Black Halo is a dark shonen / occult action story where angels are state infrastructure, devils are suppressed humanity, and the protagonist's existence proves holiness is not granted from above.",
                "The first-final draft uses the strongest material from the IP notes rather than the empty manga doc: Zane Hale, Lucifer, Sanctum Light, Cinder, a theocratic surveillance state, and found-family stabilization.",
            ]),
            ("Manga Pilot Draft", [
                chapter("Chapter 1 - Subject ZH-01", "Zane Hale is identified after a forbidden power event.", "The city cameras called it a medical emergency until the halo appeared. Then every streetlight turned white, every public screen cut to prayer protocol, and Zane Hale learned the state had a name for boys like him before boys like him were supposed to exist."),
                chapter("Chapter 2 - Sanctum Light", "The angelic regime presents itself as safety while policing narrative.", "Sanctum officers did not kick down doors. They descended. White coats, gold masks, voices soft as hymns. They were beautiful in the way machinery is beautiful when it has never been asked to care."),
                chapter("Chapter 3 - Lucifer in the Dark", "Lucifer appears as calm, ancient, and dangerous, but not the simple villain Zane expects.", "'If I wanted control,' Lucifer said, 'you would not be asking questions.' Around Zane, fragments of a black halo drifted like broken glass deciding whether to become a crown."),
                chapter("Chapter 4 - The Witch", "A tactical witch saves Zane and explains that magic is relationship, not hierarchy.", "She drew a sigil on the pavement with two fingers and a curse word. The angel's light bent around it. 'Run if you want,' she told Zane, 'but the regime already wrote your ending. I prefer edits.'"),
                chapter("Chapter 5 - Angel-Blood", "A controlled weapon of the regime becomes Zane's mirror.", "The angel-blood did not blink when ordered to strike. That frightened Zane more than rage would have. Rage meant a person was still inside somewhere, fighting the shape they had been given."),
                chapter("Chapter 6 - Contract Fever", "Cinder destabilizes when Zane isolates and stabilizes when he lets people see him.", "The devil power did not grow when he hated himself. It grew wild. It tore at the body like shame with teeth. Only when someone said his name without fear did the black fire settle into form."),
                chapter("Chapter 7 - Halo Lock", "The squad discovers cooperative combat: witch sigil, angel-blood containment, Zane's infernal surge.", "For one impossible second, black, red, and white aligned. The regime called that combination corruption. Zane felt it become balance."),
                chapter("Chapter 8 - Heaven Lied First", "The pilot ends with public exposure and a wider war of narrative.", "The broadcast meant to condemn him caught the wrong angle: Zane shielding a child while angels fired into the crowd. By morning, the city had a new forbidden question. What if the monster was not the one they named?"),
            ]),
        ],
    },
]


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for book in BOOKS:
        write_docx(
            OUT_DIR / book["file"],
            book["title"],
            book["subtitle"],
            book["sections"],
        )
    print(f"Generated {len(BOOKS)} draft DOCX files in {OUT_DIR.resolve()}")


if __name__ == "__main__":
    main()
