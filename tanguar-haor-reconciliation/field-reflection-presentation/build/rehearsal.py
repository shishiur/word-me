# -*- coding: utf-8 -*-
import os, sys
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from script import SPOKEN, BACKUP, HANDOFF, RUN
OUT = os.path.join(HERE, "out")

INK   = RGBColor(0x16, 0x32, 0x3F)
SLATE = RGBColor(0x4A, 0x65, 0x72)
TEAL  = RGBColor(0x2E, 0x7D, 0x8C)
RUST  = RGBColor(0x9C, 0x4A, 0x2F)
OCHRE = RGBColor(0xC0, 0x78, 0x2B)
FONT  = "Calibri"

TITLES = {
1:"Title and framing",2:"How we approached this reflection",
3:"Q1 - the same place is a different resource in every season",
4:"Q1 - attributes, and what we now ask",
5:"Q2 - the embankment: one structure, two opposite effects",
6:"Q2 - drivers across levels, and who is said to cause them",
7:"Q3 - food and income",8:"Q3 - the three-month window",
9:"Q3 - water, schooling, health, shelter",10:"Q3 - what we could not settle",
11:"Q4 bridge - responses across levels",
12:"Q5 - coping, adapting, or transitioning?",
13:"Q5 - the counterexample we were given",
14:"Q5 - what evidence is missing",
15:"Q6 - three conditional futures",
16:"Q6 - what we can now ask",17:"Close - what changed in what we notice",
}
SPK_BLOCKS = {
1:[1,2,3,4],2:[5,6],3:[7,8],4:[9,10],5:[11,12],6:[13,14],7:[15,16,17],
}
SPK_BRIEF = {
1:"Opening, framing and Question 1. You set the tone: careful, specific, unhurried. Your job is to make the audience accept that this is a reflection before anyone judges it as a survey.",
2:"Question 2. You carry the single best field story in the deck, the embankment. Do not rush the contradiction; let it sit.",
3:"Question 3, first half: food and income. You also carry the most delicate honesty move, where you flag that a quotation is ours and not theirs.",
4:"Question 3, second half: water, schooling, health, shelter. You close on the unresolved school distance. Own it; do not apologise for it.",
5:"The Question 4 bridge and the first half of Question 5. You have the housekeeping line about Q4 at the start, then the V2V columns.",
6:"Question 5, second half. You carry the moment where a participant refused our framing, and then the refusal of the 141-to-68 subtraction.",
7:"Question 6 and the close. You end on an open question, not a recommendation. Land the last line and stop.",
}

doc = Document()
sec = doc.sections[0]
sec.page_width, sec.page_height = Cm(21.0), Cm(29.7)
sec.left_margin = sec.right_margin = Cm(2.2)
sec.top_margin = sec.bottom_margin = Cm(2.0)

st = doc.styles["Normal"]
st.font.name = FONT; st.font.size = Pt(11); st.font.color.rgb = INK
st.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
st.paragraph_format.space_after = Pt(6)
st.paragraph_format.line_spacing = 1.15

def P(text="", size=11, color=INK, bold=False, italic=False, before=0, after=6,
      align=WD_ALIGN_PARAGRAPH.LEFT, line=1.15, indent=0):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.line_spacing = line
    if indent: p.paragraph_format.left_indent = Cm(indent)
    if text:
        r = p.add_run(text)
        r.font.name = FONT; r.font.size = Pt(size); r.font.bold = bold
        r.font.italic = italic; r.font.color.rgb = color
    return p

def RULE(color="2E7D8C"):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2); p.paragraph_format.space_after = Pt(8)
    pPr = p._p.get_or_add_pPr()
    bd = OxmlElement("w:pBdr"); bt = OxmlElement("w:bottom")
    bt.set(qn("w:val"), "single"); bt.set(qn("w:sz"), "8")
    bt.set(qn("w:space"), "1"); bt.set(qn("w:color"), color)
    bd.append(bt); pPr.append(bd)

def footer(text):
    f = doc.sections[0].footer.paragraphs[0]
    f.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = f.add_run(text)
    r.font.name = FONT; r.font.size = Pt(8.5); r.font.color.rgb = SLATE

secs = {n: (sp, t) for n, sp, t in RUN}
total_words = sum(len(SPOKEN[n].split()) for n in SPOKEN)

# ------------------------------------------------------------------ cover
P("TANGUAR HAOR FIELD REFLECTION", 11, TEAL, bold=True, after=2)
P("Seven-speaker rehearsal script", 24, INK, bold=True, after=4, line=1.05)
P("Making Commons Dynamic field workshop, Sylhet  ·  presented 9 November 2026",
  12, SLATE, after=14)
RULE()
P("How to use this document", 12.5, INK, bold=True, before=4, after=6)
P("Each speaker has a block. Inside a block, the SAY text is what you actually say; it is the same "
  "text that sits in the PowerPoint speaker notes, so rehearse from either. The IF ASKED text is "
  "held in reserve for the question period and is not part of the timed run. The WATCH FOR line is "
  "the thing most likely to go wrong in your section.", after=10)
P("Total spoken script: " + str(total_words) + " words across 17 slides. That is about "
  f"{total_words/150:.0f} minutes at 150 words per minute, {total_words/145:.0f} at 145, and "
  f"{total_words/140:.0f} at 140. Add roughly eight seconds at each of the six handoffs. "
  "To land at 22 to 23 minutes, speak at 145 to 150 and keep the handoffs short. If the "
  "chair signals that you are long, the cuts marked in the margin of each block come out first.",
  after=10)
P("Three rules we agreed", 12.5, INK, bold=True, before=4, after=4)
P("1.  Quotation marks only for words that are in a transcript. If you paraphrase, say so out loud: "
  "‘what he said was, in effect, ...’", after=3, indent=0.4)
P("2.  Never present anything our group said in discussion as something a community member said. "
  "Slide 8 depends on this and so does slide 10.", after=3, indent=0.4)
P("3.  No participant names. Not on a slide, not out loud, not in answer to a question.",
  after=10, indent=0.4)
P("A note on pronunciation", 12.5, INK, bold=True, before=4, after=4)
P("haor (HOW-or)  ·  Joypur (JOY-poor)  ·  Tahirpur (TAH-hir-poor)  ·  Sunamganj (shoo-NAHM-gonj)  ·  "
  "kanda (KAHN-da, the raised bank people live on)  ·  katha (KAH-tha, the brush-and-bamboo fish "
  "shelter)  ·  kona jal (KOH-na jaal, fine-mesh net)  ·  china duari (CHEE-na doo-AH-ree)  ·  "
  "nekari (NEH-ka-ree, the buyer who comes to the village)  ·  matbor (MAHT-bor, village elder "
  "with standing)  ·  Meghalaya (meh-gha-LAH-ya)  ·  Chaitra, Magh, Falgun (CHOY-tro, MAAG, "
  "FAAL-goon)  ·  Prateep Nayak (pro-DEEP NA-yok)  ·  Ruyel Miah (ROO-yel MEE-ah).", after=12)
footer("Tanguar Haor field reflection  ·  seven-speaker rehearsal script  ·  9 November 2026")

# ------------------------------------------------------------- speaker blocks
for sp in range(1, 8):
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
    slides = SPK_BLOCKS[sp]
    secs_total = sum(secs[n][1] for n in slides)
    words_total = sum(len(SPOKEN[n].split()) for n in slides)
    P(f"SPEAKER {sp}", 11, TEAL, bold=True, after=2)
    P(SPK_BRIEF[sp].split(".")[0] + ".", 18, INK, bold=True, after=4, line=1.08)
    P(f"Slides {slides[0]} to {slides[-1]}  ·  target {secs_total//60}:{secs_total%60:02d}  ·  "
      f"{words_total} words, about {int(words_total/145*60)//60}:{int(words_total/145*60)%60:02d} "
      f"at 145 words per minute", 10.5, SLATE, after=8)
    RULE()
    P(SPK_BRIEF[sp], 11, SLATE, italic=True, after=10)
    for n in slides:
        _, t = secs[n]
        w = len(SPOKEN[n].split())
        P(f"SLIDE {n}  ·  {TITLES[n]}", 12.5, INK, bold=True, before=8, after=2)
        P(f"target {t//60}:{t%60:02d}  ·  {w} words  ·  "
          f"about {int(w/145*60)} seconds at 145 wpm", 9.5, SLATE, after=6)
        P("SAY", 9.5, TEAL, bold=True, after=3)
        for para in SPOKEN[n].strip().split("\n\n"):
            P(para.strip(), 11, INK, after=6, indent=0.4, line=1.22)
        if n in HANDOFF:
            P(HANDOFF[n], 10.5, RUST, bold=True, after=6, indent=0.4)
        if n in BACKUP:
            P("IF ASKED  (not part of the timed run)", 9.5, OCHRE, bold=True, before=4, after=3)
            P(BACKUP[n], 10, SLATE, after=8, indent=0.4, line=1.2)
    # watch-for
    WATCH = {
1:"Do not let the opening become an apology. The limits are a method, not an excuse. And on slide 4, "
  "resist the urge to explain the lessee contradiction away: read both lines and move on.",
2:"On slide 5 the temptation is to say the embankment 'caused' the siltation. It is not what we have. "
  "Say 'reported', 'described' and 'our reading'. On slide 6, do not editorialise about the gear "
  "disagreement; present it flat.",
3:"Slide 8 is the one to get right. Say out loud that the quotation is a team member's recollection "
  "before you read it, not after.",
4:"On slide 9, do not say the water is unsafe. We do not know. On slide 10, do not resolve the "
  "kilometre figure even if someone in the audience asks you to pick one.",
5:"Start slide 11 with the one-sentence Q4 note and then move. Do not apologise for the gap at "
  "length. On slide 12, the third column is conditions, not findings; say 'would need' every time.",
6:"On slide 13, read our own leading question out loud. It is the point. On slide 14, say the two "
  "numbers and then say explicitly that we refuse the subtraction, or someone will do it for you.",
7:"On slide 15, credit the deepening-and-katha proposal as theirs before you raise the tension in it. "
  "On slide 17, stop after the last line. Do not add a summary.",
    }
    P("WATCH FOR", 9.5, RUST, bold=True, before=10, after=3)
    P(WATCH[sp], 10.5, INK, after=6, indent=0.4, line=1.2)

# ------------------------------------------------------------- back matter
doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
P("Questions we should expect, and how we answer them", 16, INK, bold=True, after=8, line=1.08)
RULE()
QA = [
("‘So what do you recommend?’",
 "We do not have a recommendation that one day's evidence supports. What we have is the question of "
 "level: a village society deciding well about silt that arrives from Meghalaya is still deciding "
 "about the wrong thing. If pressed, name the community's own proposal and credit it to them."),
("‘Didn't 141 species drop to 68?’",
 "Those are two different exercises. One is a government assessment, the other is recent catch "
 "monitoring, which records what is landed at a market. Different method, window and scope. We "
 "report both and we do not subtract."),
("‘Is the drinking water safe?’",
 "We do not know. We did not test it, and nobody we spoke to had. What we can say is that people "
 "drink piped water for cooking and still prefer river water, and that our group heard an "
 "association with skin irritation that nobody has established as a cause."),
("‘How far is the school, really?’",
 "The direct interview says about one kilometre, twice. Our own group discussion says four. We are "
 "reporting both. The part that is agreed in every account is three river crossings."),
("‘Why didn't you talk to any women?’",
 "We did not, and that is a real limit. Everything in this deck about women's work, about the loans "
 "taken in their names, and about menstrual hygiene reaches us through men or through our own "
 "discussion. It is the first thing we would change."),
("‘Is tourism good or bad for them?’",
 "A participant told us it is good and gave us the cash mechanism. The CNRS informant told us "
 "local people are not getting the benefit expected. Both can hold, because one is measured in a "
 "week and the other over a decade."),
("‘You only spent one day there.’",
 "Yes. That is why this is a reflection and not a finding, and it is why we have kept a list of "
 "what we could not settle. Professor Nayak's own line applies to us: what we saw is one-third."),
("‘Who is Speaker 1, Speaker 9?’",
 "Transcript speaker numbers. We are not naming participants, and we would rather not identify "
 "anyone by role or household either."),
]
for q, a in QA:
    P(q, 11.5, INK, bold=True, before=6, after=3)
    P(a, 11, INK, after=8, indent=0.4, line=1.2)

doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
P("Sources, in the order the deck uses them", 16, INK, bold=True, after=8, line=1.08)
RULE()
SRC = [
"Commons_Governance_SAU.pdf, p. 1. Md. Ruyel Miah, Governance for Commons: Clarifying Key Concepts. "
"The controlling source for the six official questions and their sequence.",
"NAYAK - Field Workshop Sylhet - 6 November 2026.pdf. Prateep Kumar Nayak, Putting Commons into "
"Perspective. Excludability, subtractability, ephemeral commons, emergence and submergence, "
"commonisation and decommonisation, vulnerability to viability.",
"NAYAK - Social-Ecological Systems - 8 November 2026.pdf. Complex social-ecological systems, "
"nonlinearity, uncertainty, self-organization, scale and levels, emergence.",
"Climate Change Complex Systems Full Lecture Transcript, 8 November 2026, 00:32:46. English "
"original; all lecture quotations are transcribed, not translated.",
"Bengali Field Interview Full Transcript.txt, Joypur community interview, 8 November 2026, "
"01:00:04, 469 time-coded lines. The primary community testimony in this deck.",
"Group Discussion Vulnerability Transcript And Translation.txt, 9 November 2026, 00:13:40. "
"Our own team discussion. A group-interpretation source, not community testimony.",
"Tanguar_Haor_CNRS_KII_Combined_Parts_01_02.pdf. Key-informant notes, Parts 01 and 02. Attributed "
"professional testimony; the notes themselves state that no independent verification was added.",
"Tanguar_Haor_Boatman_Interview_Expanded_Notes.pdf, with original audio 20261108_125218.m4a "
"(28:59). The audio was not transcribed for this deck; every boatman line is note-mediated.",
"Not supplied and not reviewed: the tourist-board member interview, a separate team observation "
"transcript, the remaining workshop decks, the ten supplemental readings, and any approved field "
"photographs.",
]
for i, t in enumerate(SRC, 1):
    P(f"{i}.  {t}", 10.5, INK, after=6, indent=0.4, line=1.2)

P("Figures in the deck are conceptual diagrams built from these sources. There are no photographs "
  "and no illustration is captioned as one.", 10.5, SLATE, italic=True, before=8, after=0)

dp = os.path.join(OUT, "Seven_Speaker_Rehearsal_Script.docx")
doc.save(dp)

# plain-text twin
lines = []
lines.append("TANGUAR HAOR FIELD REFLECTION - SEVEN-SPEAKER REHEARSAL SCRIPT")
lines.append("Making Commons Dynamic field workshop, Sylhet - presented 9 November 2026")
lines.append("=" * 78); lines.append("")
lines.append(f"Total spoken script: {total_words} words across 17 slides.")
lines.append(f"About {total_words/150:.0f} min at 150 wpm, {total_words/145:.0f} at 145, "
             f"{total_words/140:.0f} at 140, plus about 8 s at each of six handoffs.")
lines.append("")
for sp in range(1, 8):
    slides = SPK_BLOCKS[sp]
    st_ = sum(secs[n][1] for n in slides); wt = sum(len(SPOKEN[n].split()) for n in slides)
    lines.append("=" * 78)
    lines.append(f"SPEAKER {sp}  |  slides {slides[0]}-{slides[-1]}  |  target "
                 f"{st_//60}:{st_%60:02d}  |  {wt} words")
    lines.append("=" * 78); lines.append(SPK_BRIEF[sp]); lines.append("")
    for n in slides:
        _, t = secs[n]; w = len(SPOKEN[n].split())
        lines.append("-" * 78)
        lines.append(f"SLIDE {n} - {TITLES[n]}")
        lines.append(f"target {t//60}:{t%60:02d} | {w} words | ~{int(w/145*60)} s at 145 wpm")
        lines.append("-" * 78); lines.append("")
        lines.append("SAY:"); lines.append("")
        lines.append(SPOKEN[n].strip()); lines.append("")
        if n in HANDOFF:
            lines.append(HANDOFF[n]); lines.append("")
        if n in BACKUP:
            lines.append("IF ASKED (not part of the timed run):")
            lines.append(BACKUP[n]); lines.append("")
    lines.append("WATCH FOR: " + WATCH[sp]); lines.append("")
tp = os.path.join(OUT, "Seven_Speaker_Rehearsal_Script.txt")
open(tp, "w", encoding="utf-8").write("\n".join(lines))
print("saved", dp); print("saved", tp)
