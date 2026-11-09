# -*- coding: utf-8 -*-
"""Tanguar Haor field reflection deck builder."""
import os, copy
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

HERE = os.path.dirname(os.path.abspath(__file__))
FIG  = os.path.join(HERE, "fig")
OUT  = os.path.join(HERE, "out")
os.makedirs(OUT, exist_ok=True)

INK   = RGBColor(0x16, 0x32, 0x3F)
SLATE = RGBColor(0x4A, 0x65, 0x72)
TEAL  = RGBColor(0x2E, 0x7D, 0x8C)
OCHRE = RGBColor(0xC0, 0x78, 0x2B)
RUST  = RGBColor(0x9C, 0x4A, 0x2F)
GREEN = RGBColor(0x4E, 0x7A, 0x4A)
PAPER = RGBColor(0xFB, 0xFA, 0xF7)
LINE  = RGBColor(0xD8, 0xD4, 0xCC)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

FONT = "Calibri"
W, H = Inches(13.333), Inches(7.5)

CAT_COLOR = {
    "OBSERVED": GREEN, "TESTIMONY": TEAL, "KII": OCHRE,
    "LECTURE": SLATE, "OUR READING": RUST, "OPEN": INK,
}

prs = Presentation()
prs.slide_width, prs.slide_height = W, H
BLANK = prs.slide_layouts[6]


def _fill(shape, color):
    shape.fill.solid(); shape.fill.fore_color.rgb = color; shape.line.fill.background()


def bg(slide, color=PAPER):
    from pptx.enum.shapes import MSO_SHAPE
    s = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, W, H)
    _fill(s, color)
    slide.shapes._spTree.remove(s._element)
    slide.shapes._spTree.insert(2, s._element)
    return s


def rule(slide, y, x0=Inches(0.72), x1=Inches(12.61), color=LINE, w=1.0):
    from pptx.enum.shapes import MSO_SHAPE
    s = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x0, y, x1 - x0, Pt(w))
    _fill(s, color)
    return s


def tb(slide, x, y, w, h, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP):
    box = slide.shapes.add_textbox(x, y, w, h)
    tf = box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = anchor
    tf.paragraphs[0].alignment = align
    return tf


def para(tf, text, size=14, color=INK, bold=False, italic=False, first=False,
         space_before=0, space_after=4, align=None, line=1.22):
    p = tf.paragraphs[0] if first else tf.add_paragraph()
    p.space_before = Pt(space_before); p.space_after = Pt(space_after)
    p.line_spacing = line
    if align is not None:
        p.alignment = align
    r = p.add_run(); r.text = text
    f = r.font
    f.name = FONT; f.size = Pt(size); f.bold = bold; f.italic = italic; f.color.rgb = color
    return p


def rich(tf, segs, size=14, first=False, space_before=0, space_after=4, line=1.22, align=None):
    p = tf.paragraphs[0] if first else tf.add_paragraph()
    p.space_before = Pt(space_before); p.space_after = Pt(space_after); p.line_spacing = line
    if align is not None:
        p.alignment = align
    for text, color, bold, italic in segs:
        r = p.add_run(); r.text = text
        f = r.font
        f.name = FONT; f.size = Pt(size); f.bold = bold; f.italic = italic; f.color.rgb = color
    return p


def chip(slide, x, y, label, color):
    """Small evidence-category tag."""
    from pptx.enum.shapes import MSO_SHAPE
    wch = Inches(0.055 * len(label) + 0.30)
    s = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, wch, Inches(0.235))
    s.fill.solid(); s.fill.fore_color.rgb = WHITE
    s.line.color.rgb = color; s.line.width = Pt(0.9)
    s.adjustments[0] = 0.45
    tf = s.text_frame
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.word_wrap = False
    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = label
    r.font.name = FONT; r.font.size = Pt(8.5); r.font.bold = True; r.font.color.rgb = color
    return x + wch + Inches(0.09)


def header(slide, qlabel, title, sub=None, accent=TEAL):
    if qlabel:
        tf = tb(slide, Inches(0.72), Inches(0.42), Inches(11.9), Inches(0.26))
        para(tf, qlabel.upper(), size=10.5, color=accent, bold=True, first=True, space_after=0)
        ty = Inches(0.73)
    else:
        ty = Inches(0.52)
    tf = tb(slide, Inches(0.72), ty, Inches(11.9), Inches(0.72))
    para(tf, title, size=27, color=INK, bold=True, first=True, space_after=0, line=1.06)
    y = ty + Inches(0.52 if len(title) < 62 else 0.92)
    if sub:
        tf = tb(slide, Inches(0.72), y, Inches(11.9), Inches(0.42))
        para(tf, sub, size=13.5, color=SLATE, first=True, space_after=0, line=1.18)
        y += Inches(0.40)
    rule(slide, y + Inches(0.06), color=accent, w=1.6)
    return y + Inches(0.26)


from script import RUN as _RUN
_SEC = {n: (sp, t) for n, sp, t in _RUN}


def speaker_tag(n, extra=""):
    sp, t = _SEC[n]
    tag = f"Speaker {sp}  \u00b7  {t//60}:{t%60:02d}"
    return tag + extra


def footer(slide, left, right):
    rule(slide, Inches(6.86))
    tf = tb(slide, Inches(0.72), Inches(6.99), Inches(8.0), Inches(0.3))
    para(tf, left, size=10, color=SLATE, first=True, space_after=0)
    tf = tb(slide, Inches(8.8), Inches(6.99), Inches(3.81), Inches(0.3), align=PP_ALIGN.RIGHT)
    para(tf, right, size=10, color=SLATE, first=True, space_after=0)


def notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text



def pic_fit(slide, name, top, max_h, max_w=Inches(11.9), cx=Inches(6.6665)):
    """Place a figure scaled to fit a box, horizontally centred on cx."""
    from PIL import Image
    path = os.path.join(FIG, name)
    iw, ih = Image.open(path).size
    ar = iw / ih
    h = max_h
    w = Emu(int(h * ar))
    if w > max_w:
        w = max_w
        h = Emu(int(w / ar))
    x = Emu(int(cx - w / 2))
    return slide.shapes.add_picture(path, x, top, width=w, height=h)


def pic(slide, name, x, y, w):
    return slide.shapes.add_picture(os.path.join(FIG, name), x, y, width=w)


def quote_block(slide, x, y, w, bn, en, cite, color=TEAL, size=15):
    """Bengali original + lightly translated English + citation."""
    from pptx.enum.shapes import MSO_SHAPE
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, Pt(2.6), Inches(0.1))
    _fill(bar, color)
    tf = tb(slide, x + Inches(0.17), y, w - Inches(0.17), Inches(1.4))
    if bn:
        para(tf, bn, size=size - 2.5, color=SLATE, italic=True, first=True,
             space_after=3, line=1.15)
        para(tf, en, size=size, color=INK, italic=True, space_after=3, line=1.18)
    else:
        para(tf, en, size=size, color=INK, italic=True, first=True, space_after=3, line=1.18)
    para(tf, cite, size=9.5, color=SLATE, space_after=0, line=1.1)
    # size the accent bar to the text
    nlines = (len(en) // 62 + 1) + (2 if bn else 0) + 1
    bar.height = Inches(0.26 * nlines)
    return y + Inches(0.26 * nlines) + Inches(0.12)


def bullets(slide, x, y, w, items, size=13.5, gap=7, color=INK, bullet_color=None):
    tf = tb(slide, x, y, w, Inches(3.4))
    bc = bullet_color or SLATE
    for i, it in enumerate(items):
        if isinstance(it, tuple):
            head, body = it
            rich(tf, [(head + "  ", INK, True, False), (body, color, False, False)],
                 size=size, first=(i == 0), space_after=gap, line=1.2)
        else:
            rich(tf, [("— ", bc, False, False), (it, color, False, False)],
                 size=size, first=(i == 0), space_after=gap, line=1.2)
    return tf

# =============================================================== SLIDE 1 TITLE
s = prs.slides.add_slide(BLANK); bg(s)
from pptx.enum.shapes import MSO_SHAPE
band = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(0.34), H); _fill(band, TEAL)
tf = tb(s, Inches(1.05), Inches(1.55), Inches(11.3), Inches(0.4))
para(tf, "MAKING COMMONS DYNAMIC  ·  FIELD WORKSHOP, SYLHET  ·  NOVEMBER 2026",
     size=12, color=TEAL, bold=True, first=True, space_after=0)
tf = tb(s, Inches(1.05), Inches(2.08), Inches(11.1), Inches(1.9))
para(tf, "Tanguar Haor: a field reflection", size=44, color=INK, bold=True,
     first=True, space_after=6, line=1.04)
para(tf, "What three days of theory and one day in the haor changed\nin what we notice, and in what we can now ask",
     size=19, color=SLATE, space_after=0, line=1.22)
rule(s, Inches(4.52), x0=Inches(1.05), x1=Inches(6.2), color=OCHRE, w=1.8)
tf = tb(s, Inches(1.05), Inches(4.78), Inches(5.3), Inches(1.6))
para(tf, "Group presentation by seven members, Speakers 1 to 7", size=13.5,
     color=INK, first=True, space_after=5)
para(tf, "Field site: Joypur and the Tanguar Haor waterbody, Tahirpur, Sunamganj",
     size=13.5, color=INK, space_after=5)
para(tf, "Field day: 8 November 2026.   Presented: 9 November 2026", size=13.5,
     color=INK, space_after=0)
tf = tb(s, Inches(7.0), Inches(4.70), Inches(5.3), Inches(1.9))
para(tf, "A note on what this is", size=12.5, color=OCHRE, bold=True, first=True, space_after=4)
para(tf, "This is a reflection, not a survey, a diagnosis or a plan. One visit, a small "
         "number of voices, and most of what we say is attributed to the person who said it. "
         "Where we are reading rather than reporting, we say so on the slide.",
     size=11.5, color=SLATE, space_after=0, line=1.24)
footer(s, "Slide 1 of 17", speaker_tag(1, ""))
notes(s, """SPEAKER 1  -  0:30

Good [morning / afternoon]. We are presenting a field reflection on Tanguar Haor, built from one day in the field on 8 November and three days of workshop sessions.

I want to be precise about what this is and is not. It is not a survey. It is not an ecological diagnosis. It is not a policy proposal. It is a reflection on what we noticed, what we could attribute, and what we now know to ask.

We spoke with one community group at Joypur, with a CNRS key informant, and with a boatman. That is a small number of voices from a place with, depending on whose count you take, seventy-seven, eighty-two or eighty-eight villages. We will keep saying that.

One convention before we start: where a line on a slide is something a participant actually said, you will see a timestamp. Where it is our reading, the slide says 'our reading'. Please hold us to that.

I will take the first question. [Hand to slide 2.]""")

# ======================================================= SLIDE 2 HOW WE WORKED
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "How we approached this reflection",
           "Four moves, repeated for each question",
           "The same discipline for all six official questions, so that evidence and interpretation stay visibly apart.")
cols = [
    ("BEFORE", SLATE, "What we took for granted walking in. Where we have no record of a prior group "
                      "assumption, we label it an analytical starting point rather than claim it was our belief."),
    ("FIELD", TEAL, "One concrete episode or attributed statement, with its timestamp, kept in its own context "
                    "rather than flattened into a generalisation."),
    ("THEORY", OCHRE, "One or two taught ideas, used as the workshop defined them. Not every concept is forced "
                      "into every question."),
    ("SHIFT and OPEN", RUST, "What became less certain once field and theory were put together, and the sharper "
                             "question we can now ask. For whom, when, where, at what level."),
]
x = Inches(0.72); cw = Inches(2.82); gap = Inches(0.195)
for i, (hd, c, body) in enumerate(cols):
    bx = x + i * (cw + gap)
    box = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bx, y + Inches(0.08), cw, Inches(2.25))
    box.fill.solid(); box.fill.fore_color.rgb = WHITE
    box.line.color.rgb = c; box.line.width = Pt(1.3); box.adjustments[0] = 0.05
    box.text_frame.text = ""
    tfx = tb(s, bx + Inches(0.2), y + Inches(0.28), cw - Inches(0.4), Inches(1.9))
    para(tfx, hd, size=13, color=c, bold=True, first=True, space_after=7)
    para(tfx, body, size=11.5, color=INK, space_after=0, line=1.26)
y2 = y + Inches(2.55)
tf = tb(s, Inches(0.72), y2, Inches(11.9), Inches(0.4))
para(tf, "What our evidence tags mean", size=13, color=INK, bold=True, first=True, space_after=8)
cx = Inches(0.72)
for lab, col in [("OBSERVED BY US", GREEN), ("COMMUNITY TESTIMONY", TEAL),
                 ("PROFESSIONAL KII", OCHRE), ("WORKSHOP LECTURE", SLATE),
                 ("OUR READING", RUST), ("OPEN QUESTION", INK)]:
    cx = chip(s, cx, y2 + Inches(0.36), lab, col)
tf = tb(s, Inches(0.72), y2 + Inches(0.78), Inches(11.9), Inches(0.9))
para(tf, "Quotation marks appear only where a primary transcript contains those words. Bengali speech is given "
         "in the original and then lightly translated, with its timestamp. A paraphrase never appears in quotation "
         "marks, and nothing our own group said in discussion is presented as something a community member said.",
     size=12, color=SLATE, first=True, space_after=0, line=1.3)
footer(s, "Slide 2 of 17", speaker_tag(2, ""))
notes(s, """SPEAKER 1  -  0:40

We used the same four moves for every question, because the risk in a one-day visit is that interpretation quietly turns into finding.

BEFORE is what we assumed walking in. Where we have no record of what we actually believed beforehand, we say so and call it a starting analytical point instead of inventing a group autobiography.

FIELD is one episode, with a timestamp, kept in context.

THEORY is one or at most two ideas from the workshop, used the way Professor Nayak and Dr Ruyel Miah defined them.

SHIFT and OPEN is what became less certain, and the better question.

The tags along the bottom will appear on every slide. Green is something we saw ourselves. Teal is a community member speaking. Ochre is the CNRS key informant, which is professional testimony, not measurement. Grey is the lecture. Rust is our own reading. And black is a question we cannot answer.

One rule we held to: quotation marks only for words in a transcript, and Bengali shown in the original before the translation.""")

# ============================================================ SLIDE 3  Q1 - A
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "Question 1  ·  What makes Tanguar Haor an ephemeral commons?",
           "The same place is a different resource in every season",
           accent=TEAL)
pic_fit(s, "f1_calendar.png", y + Inches(0.02), Inches(6.26) - (y + Inches(0.02)))
cx = chip(s, Inches(0.72), Inches(6.40), "COMMUNITY TESTIMONY", TEAL)
cx = chip(s, cx, Inches(6.40), "PROFESSIONAL KII", OCHRE)
tf = tb(s, cx + Inches(0.1), Inches(6.42), Inches(7.6), Inches(0.3))
para(tf, "Joypur interview 00:03:27, 00:12:17-00:13:52, 00:29:00, 00:50:43  ·  CNRS KII Part 01",
     size=10.5, color=SLATE, first=True, space_after=0)
footer(s, "Slide 3 of 17", speaker_tag(3, ""))
notes(s, """SPEAKER 1  -  1:30

Start with the calendar, because everything else in our presentation hangs off it.

When we arrived we were thinking of Tanguar Haor as a place: a wetland with a boundary, a Ramsar site of about 9,727 hectares. By the end of the day we were thinking of it as a sequence.

Look at the top band. For roughly five months it is deep open water. Then it recedes. Then, in Poush, Magh, Falgun and Chaitra, a large part of it is a crop field. The same ground, the same people.

Now look at what sits on top of that. The fishing ban runs for three months in the monsoon, which participants told us applies everywhere, not only in the sanctuary. The society's lease window is a different three months, in the dry season. The embankment is closed in Chaitra, and participants described it breaching in Magh or Falgun. Tourist boats come in the dry season. And labour migration happens in the months in between.

So at any given moment the haor is producing a different thing, for a different group, under a different rule. The fisher, the paddy farmer and the boat operator are frequently the same household, doing different work in different months.

Professor Nayak's 6 November slides define ephemeral commons as a commons whose very process of creation produces instability, going through cyclical creation and dissolution so that it never acquires a permanent character. That is not a metaphor here. The resource genuinely dissolves and reappears each year.

One caution on this figure: every band is reported, not measured. The month edges are approximate. We did not verify a single date against a gazette or a project record.""")

# ============================================================ SLIDE 4  Q1 - B
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "Question 1  ·  attributes, and what we now ask",
           "Excludability and subtractability do not hold still either",
           accent=TEAL)
left_x, right_x = Inches(0.72), Inches(6.95)
cw = Inches(5.66)
tf = tb(s, left_x, y + Inches(0.06), cw, Inches(0.3))
para(tf, "FOUR ATTRIBUTES WE COULD ACTUALLY POINT TO", size=11, color=TEAL, bold=True,
     first=True, space_after=10)
bullets(s, left_x, y + Inches(0.45), cw, [
    ("Emergence and submergence.", "Water arrives, the fishery exists; water leaves, the field exists."),
    ("Access changes with the season, not with status.", "Fishing access is tied to a lease window; "
     "outside it, participants described fishing anyway."),
    ("Subtractability rises as the water falls.", "As depth drops, the same catch is taken from less space."),
    ("Exclusion is costly and partial.", "Of roughly fifty short machines, participants said two are caught."),
], size=13)
tf = tb(s, right_x, y + Inches(0.06), cw, Inches(0.3))
para(tf, "WHAT SHIFTED FOR US", size=11, color=RUST, bold=True, first=True, space_after=10)
yq = quote_block(s, right_x, y + Inches(0.45), cw,
    "আগে তো ইজারাদার যখন আছিল তখন তো ইজারাদার শাসন দিয়া রাখছে, মাছ মারতে পারছে না।",
    "“when the lessee was here, the lessee kept order, people could not take fish.”",
    "Joypur community interview, 00:27:21. Translated from Bengali; lightly translated.", color=TEAL)
tf = tb(s, right_x, yq + Inches(0.02), cw, Inches(1.5))
para(tf, "We arrived expecting the ephemeral quality to be mainly hydrological. The same speaker who "
         "described the lease era as better for fish then said the present arrangement suits him. "
         "Who may take what, and who enforces it, has changed at least three times in living memory.",
     size=12.5, color=INK, first=True, space_after=10, line=1.26)
rule(s, yq + Inches(1.30), x0=right_x, x1=right_x + cw, color=INK, w=1.2)
tf = tb(s, right_x, yq + Inches(1.46), cw, Inches(1.1))
rich(tf, [("Open question.  ", INK, True, False),
          ("If the resource dissolves every year, what is the right unit of a rule: the season, "
           "the water body, or the household that moves between both?", INK, False, False)],
     size=13, first=True, space_after=0, line=1.26)
cx = chip(s, left_x, Inches(6.42), "COMMUNITY TESTIMONY", TEAL)
cx = chip(s, cx, Inches(6.42), "WORKSHOP LECTURE", SLATE)
cx = chip(s, cx, Inches(6.42), "OPEN QUESTION", INK)
footer(s, "Slide 4 of 17", speaker_tag(4, "   ·   hands to Speaker 2"))
notes(s, """SPEAKER 1  -  1:20

Four attributes we could actually point to, rather than recite.

First, emergence and submergence, which you just saw.

Second, access changes with the season rather than with who you are. The society takes a lease for roughly three months. Outside that window, participants described fishing anyway, and used the word for stealing to describe it themselves.

Third, subtractability rises as the water falls. Professor Nayak's definition is that each user is capable of subtracting from the welfare of all other users. In a shrinking dry-season pool that is not abstract.

Fourth, exclusion is costly and partial. One participant put a number on it: of about fifty short machines operating, two get caught, are fined and released.

Now the shift. We went in thinking the ephemeral quality was essentially about water. What unsettled that was this line at twenty-seven twenty-one. [Read the Bengali if you are comfortable, then the English.] The speaker is describing the lease era, when the lessee kept armed guards, as the period when fish were plentiful. Less than a minute later, at twenty-eight eleven, the same speaker says the present arrangement suits them.

We are not going to resolve that contradiction for him. It is the finding. The institution governing the commons has itself been ephemeral: estate, lease, lease-free since 2000, society-held windows now. The rule dissolves and reappears as surely as the water does.

So our open question is about the unit of a rule, not about who is right.

[Hand to Speaker 2.]""")

# ============================================================ SLIDE 5  Q2 - A
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "Question 2  ·  main issues and challenges",
           "One structure, two opposite effects, both named by the same people", accent=OCHRE)
pic_fit(s, "f2_embankment.png", y + Inches(0.04), Inches(6.26) - (y + Inches(0.04)), Inches(11.45))
cx = chip(s, Inches(0.72), Inches(6.42), "COMMUNITY TESTIMONY", TEAL)
cx = chip(s, cx, Inches(6.42), "OUR READING", RUST)
tf = tb(s, cx + Inches(0.1), Inches(6.44), Inches(7.4), Inches(0.3))
para(tf, "Joypur interview 00:03:27, 00:04:42, 00:05:09, 00:31:26-00:32:53, 00:45:12-00:45:44",
     size=10.5, color=SLATE, first=True, space_after=0)
footer(s, "Slide 5 of 17", speaker_tag(5, ""))
notes(s, """SPEAKER 2  -  1:40

The clearest single thing we encountered was the embankment, and it is the best example of why a one-day diagnosis would have been wrong.

Top left. The community asked for it. A CBRMP project built it. They credit it with ten to twelve years of harvests, with flood water no longer reaching the homesteads, and trees were planted on it to break the waves. If we had stopped there we would have written a success story.

Top right, from the same conversation. In Chaitra the embankment is closed, and the crop field dries. When the field dries, participants said, fish cannot survive. When the embankment breaks, in Magh or Falgun, water comes in and fish spawn again. In the speaker's own logic, if the embankment holds and the water stays deep, then no matter how much people fish illegally, they cannot finish the stock.

So the same structure protects the paddy and, in the account we were given, removes the conditions the fish need. It is not that one group gains and another loses. It is often the same household, in different months.

Bottom left is our reading, and it is dashed on the figure for that reason. Silt settling behind an embankment is a mechanism we did not measure. We are reporting what they said about the kanda thinning.

Bottom right is the line that stayed with us. [Read it.] 'Right now we are surviving, that is fine, but for the future...' Forty-five forty-four. He does not finish the sentence.

Professor Nayak said on the eighth: despite best engineering, a dam breaks, and that is uncertainty. What we would add is that the community already holds both halves of that. They asked for the structure and they can tell you what it costs them. Nobody had to teach them non-linearity.""")

# ============================================================ SLIDE 6  Q2 - B
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "Question 2  ·  drivers, and who is said to cause them",
           "The problem does not sit at one level, and the blame does not sit outside",
           accent=OCHRE)
pic_fit(s, "f3_scale.png", y - Inches(0.02), Inches(6.26) - (y - Inches(0.02)), Inches(7.55), Inches(4.495))
rx = Inches(8.55); rw = Inches(4.06)
tf = tb(s, rx, y + Inches(0.08), rw, Inches(0.3))
para(tf, "A DISAGREEMENT WE ARE KEEPING", size=11, color=RUST, bold=True, first=True, space_after=9)
yq = quote_block(s, rx, y + Inches(0.42), rw,
    "কারেন্ট জালে মাছ ধ্বংস করে না।",
    "“the current net does not destroy fish”",
    "Joypur, 00:11:44. The speaker has used it since birth, to eat. He named the short machine "
    "and the kona jal as the destroyers; another speaker named the china duari.", color=TEAL, size=14)
tf = tb(s, rx, yq + Inches(0.14), rw, Inches(2.4))
para(tf, "We expected outsiders. We were told the opposite.", size=12.5,
     color=INK, bold=True, first=True, space_after=7, line=1.24)
yq2 = quote_block(s, rx, yq + Inches(0.56), rw,
    "না এইখানের মানুষ, এই টাঙ্গুয়ারেরই মানুষ।",
    "“no, people from here, people of this very Tanguar”",
    "Joypur, 00:49:37, asked who uses the shortgun and kona jal.", color=TEAL, size=14)
rule(s, yq2 + Inches(0.06), x0=rx, x1=rx + rw, color=INK, w=1.2)
tf = tb(s, rx, yq2 + Inches(0.22), rw, Inches(1.2))
rich(tf, [("Open question.  ", INK, True, False),
          ("Which gear actually destroys what, and who is entitled to decide that "
           "when the people fishing disagree with each other?", INK, False, False)],
     size=12.5, first=True, space_after=0, line=1.24)
cx = chip(s, Inches(0.72), Inches(6.42), "COMMUNITY TESTIMONY", TEAL)
cx = chip(s, cx, Inches(6.42), "PROFESSIONAL KII", OCHRE)
cx = chip(s, cx, Inches(6.42), "WORKSHOP LECTURE", SLATE)
footer(s, "Slide 6 of 17", speaker_tag(6, "   ·   hands to Speaker 3"))
notes(s, """SPEAKER 2  -  1:20

Two points here, quickly, because the figure does most of the work.

First, scale. The CNRS key informant traces sand and silt to coal and limestone extraction in the Meghalaya hills upstream, carried down in monsoon rain. A community speaker described the same thing from the other end: the turbid water brings mountain soil, it fills up, and, in his words, the haor is rising up. Big boats can no longer reach where they once could. At the other end of the scale, land ownership sits with the Ministry of Land while custodianship sits with Environment and Forests, and the lecture noted that tourism investment comes from Dhaka.

Professor Nayak at fourteen twenty-seven: what we might think is a local problem is actually an interconnected problem. He went further at twenty-two twenty-four and called the mismatch governance misfit. If you have a fever and take medication for a headache, it will not work.

Second, and this is the part that genuinely corrected us. We expected to be told that outsiders destroy the fishery. At forty-nine thirty-seven, asked directly who uses the shortgun and the fine-mesh kona jal, the answer was: people from here, people of this very Tanguar.

And the participants do not agree with each other about which gear is the problem. The speaker who insists the current net does not destroy fish has used it since he was born, for food, and he names the short machine and the kona jal instead. Another speaker names the china duari.

We are keeping that disagreement on the slide rather than resolving it, because resolving it would mean choosing one fisher's account over another's with no evidence to do it.

[Hand to Speaker 3.]""")

# ============================================================ SLIDE 7  Q3 - A
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "Question 3  ·  vulnerability, tied to the ephemeral nature",
           "Food and income: the exposure is seasonal, not general", accent=GREEN)
lx, rx = Inches(0.72), Inches(6.95); cw = Inches(5.66)
tf = tb(s, lx, y + Inches(0.06), cw, Inches(0.3))
para(tf, "WHAT WAS DESCRIBED TO US", size=11, color=TEAL, bold=True, first=True, space_after=10)
bullets(s, lx, y + Inches(0.44), cw, [
    "Catch described as half a kilo or very little now, where it used to be plentiful.",
    "Travelling to the town market costs 200 to 250 taka and two hours, so a small catch "
    "cannot cover the fare. Buyers, called nekari, come to the village instead.",
    "Paddy is kept for the household through the year, not sold.",
    "Rice stored in empty fish-feed sacks. Our group read this as preparing for scarcity; "
    "the storage we saw, the reason we inferred.",
    "Dried fish sells at 250 taka locally against 300 in the market, because the trip costs "
    "300 to 500 taka.",
], size=12.5, gap=8)
tf = tb(s, rx, y + Inches(0.06), cw, Inches(0.3))
para(tf, "WHY THIS IS AN EPHEMERAL-COMMONS VULNERABILITY", size=11, color=RUST, bold=True,
     first=True, space_after=10)
tf = tb(s, rx, y + Inches(0.44), cw, Inches(2.0))
para(tf, "The income is not low in a steady way. It is concentrated into a window and then absent. "
         "A household that fishes for three months, grows paddy for three, and looks for other work "
         "for the rest is carrying the variability of the resource in its own calendar.",
     size=13, color=INK, first=True, space_after=9, line=1.26)
para(tf, "Professor Nayak's 6 November slides put it as a lack of access to capital assets, and as the "
         "absence of wellbeing in its material, relational and subjective dimensions. What we saw fits "
         "the material dimension. We have almost nothing on the other two.",
     size=13, color=INK, space_after=0, line=1.26)
yq = quote_block(s, rx, y + Inches(3.02), cw,
    "তারা অশিক্ষিত মানুষ তারা কয় আমরা খাইয়া বাঁচি।",
    "“they are uneducated people, they say we live by eating”",
    "Joypur, 00:33:00, on why telling people not to fish does not work. "
    "The CNRS informant made the same point independently.", color=TEAL, size=14)
cx = chip(s, lx, Inches(6.42), "COMMUNITY TESTIMONY", TEAL)
cx = chip(s, cx, Inches(6.42), "OUR READING", RUST)
cx = chip(s, cx, Inches(6.42), "PROFESSIONAL KII", OCHRE)
footer(s, "Slide 7 of 17", speaker_tag(7, ""))
notes(s, """SPEAKER 3  -  1:30

My half of question three is food and income. My colleague will take water, schooling, health and shelter.

The important thing is that what we saw is not general poverty. It is exposure with a shape.

Catch is described as half a kilo now, against plenty before. And then the market fails them twice over. Going to town costs two hundred to two hundred and fifty taka and takes two hours, so a small catch cannot pay for the trip. Buyers come to the village instead, and they are called nekari. Participants said they do not get a fair price. For dried fish the arithmetic is explicit: three hundred taka a kilo in the market, but three to five hundred taka to get there, so they sell at two hundred and fifty locally.

The rice stays home. It is not a cash crop for them; it is the year's eating.

One honest qualification. We saw sacks of rice stored in empty fish-feed bags. Our mentor in the group discussion read that as stockpiling against uncertainty, and it is a persuasive reading. But the storage is the observation and the reason is our inference. I am marking it that way deliberately.

Why is this an ephemeral-commons vulnerability rather than just low income? Because the income is not low steadily. It is concentrated into a window and then absent. The household absorbs the variability of the resource in its own calendar.

And then this line, at thirty-three minutes. A participant is explaining why awareness campaigns do not stop fishing. [Read.] The CNRS informant made exactly the same point from the professional side: without food security in a poor fishing household, awareness alone will not hold a conservation rule.""")

# ============================================================ SLIDE 8  Q3 - B
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "Question 3  ·  the three-month window",
           "The thing that holds people here is the thing that exposes them", accent=GREEN)
lx = Inches(0.72); cw1 = Inches(7.3); rx = Inches(8.42); cw2 = Inches(4.19)
yq = quote_block(s, lx, y + Inches(0.08), cw1,
    None,
    "“When we asked him, you fish for three months, what do you do for the next three? "
    "We grow paddy. And the next three? We steal, we drive a rickshaw, we do this and that.”",
    "Our own group discussion, 00:10:45. This is a team member recalling the exchange, not a "
    "verbatim community quotation. The community transcript does describe fishing without "
    "permission at 00:28:33, using the same word.", color=RUST, size=14.5)
tf = tb(s, lx, yq + Inches(0.12), cw1, Inches(2.6))
para(tf, "What we did with that", size=13, color=INK, bold=True, first=True, space_after=8)
para(tf, "Our group's first instinct, in the recording, was to call the three-month lease their "
         "lure, almost a weakness. Putting it next to the lecture changed that for us. The window is "
         "not a temptation. It is the only period in which the commons exists as a fishery they can "
         "legally enter, and it is three months out of twelve.",
     size=13, color=INK, space_after=9, line=1.26)
para(tf, "Set against the other numbers we were given, the exposure is easier to see: a three-month "
         "ban with compensation rice described as given “once, maybe two years”; electricity for "
         "about eight hours in twenty-four; the monthly family-card allowance that, in this "
         "settlement, nobody had received.",
     size=13, color=INK, space_after=0, line=1.26)
tf = tb(s, rx, y + Inches(0.08), cw2, Inches(0.3))
para(tf, "FOUR REPORTED FIGURES", size=11, color=TEAL, bold=True, first=True, space_after=10)
stats = [("3 months", "of legal fishing access, by lease", TEAL),
         ("3 months", "of fishing ban, reported everywhere", RUST),
         ("8 hours", "of electricity in 24, at present", OCHRE),
         ("0", "households here reported to have received\nthe family-card allowance", GREEN)]
yy = y + Inches(0.46)
for big, small, c in stats:
    tfs = tb(s, rx, yy, cw2, Inches(0.9))
    para(tfs, big, size=23, color=c, bold=True, first=True, space_after=1, line=1.0)
    para(tfs, small, size=11.5, color=SLATE, space_after=0, line=1.18)
    yy += Inches(1.02 if "\n" in small else 0.86)
cx = chip(s, lx, Inches(6.42), "OUR READING", RUST)
cx = chip(s, cx, Inches(6.42), "COMMUNITY TESTIMONY", TEAL)
tf = tb(s, cx + Inches(0.1), Inches(6.44), Inches(6.0), Inches(0.3))
para(tf, "Joypur 00:50:30, 00:54:51, 00:55:09  ·  group discussion 00:10:23-00:10:54",
     size=10.5, color=SLATE, first=True, space_after=0)
footer(s, "Slide 8 of 17", speaker_tag(8, "   ·   hands to Speaker 4"))
notes(s, """SPEAKER 3  -  1:30

I want to be careful with this slide, because the quotation on it is ours, not theirs.

In our own group discussion, one of us recalled asking: you fish for three months, what do you do for the next three? Paddy. And the next three? We steal, we drive a rickshaw, this and that. That is a team member's recollection. It is not in the community transcript in those words. What is in the community transcript, at twenty-eight thirty-three, is the same word for taking fish without permission, used by the participant about himself.

I am flagging that because our first instinct in the recording was to describe the three-month lease as their lure. Listening back, that was us being uncharitable. Three months is not a temptation. It is the entire period in which the commons exists as a fishery they can lawfully enter. Three months in twelve.

Now put the other reported numbers beside it. The ban is also three months. Compensation rice was described as given once, maybe for two years. Electricity runs about eight hours in twenty-four. And the family-card allowance, which they know about from television speeches, had reached nobody in this settlement.

So the question we should have asked, and did not, is not why they fish out of season. It is what the other nine months are supposed to be made of.

[Hand to Speaker 4.]""")

# ============================================================ SLIDE 9  Q3 - C
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "Question 3  ·  water, schooling, health, shelter",
           "Provision exists. Use is another question.", accent=GREEN)
pic_fit(s, "f4_services.png", y + Inches(0.06), Inches(6.26) - (y + Inches(0.06)), Inches(11.45))
cx = chip(s, Inches(0.72), Inches(6.42), "COMMUNITY TESTIMONY", TEAL)
cx = chip(s, cx, Inches(6.42), "OUR READING", RUST)
cx = chip(s, cx, Inches(6.42), "WORKSHOP LECTURE", SLATE)
tf = tb(s, cx + Inches(0.1), Inches(6.44), Inches(6.6), Inches(0.3))
para(tf, "Joypur 00:16:28, 00:17:19-00:18:29, 00:38:38, 00:46:11  ·  group discussion 00:03:34-00:09:47",
     size=10.5, color=SLATE, first=True, space_after=0)
footer(s, "Slide 9 of 17", speaker_tag(9, ""))
notes(s, """SPEAKER 4  -  1:40

My argument on this slide is one sentence: in every one of these four services, something has been provided, and the provision is not what determines whether people are safe.

Water. Three tubewells were reported out of order. One submersible serves the kanda, twenty taka a month per household. That is real provision. But the piped water is used for drinking and cooking, not bathing, and river water is still preferred because, as they put it, the tubewell water has no taste. And here is what matters: we do not know whether the water people actually drink is safe. We did not test it. Nobody we met had tested it. Our group talked about skin irritation and menstrual hygiene when the water is turbid, but that came from one conversation and it is an association somebody described, not a cause anyone established.

Schooling. One school, three river crossings. The distance is genuinely unresolved and I will come back to it on the next slide.

Health. Tahirpur is described as first aid; childbirth means going to Sunamganj. A participant said of the monsoon, in three words, that it is death. Travel is by hand-rowed boat. We were also told of a maternal death during transport, but that reached us through our own group discussion, not from a direct interview, so we are presenting it as a second-hand account and not as a verified case.

Shelter. Tin roofs, no windbreak, wind coming off the hills across open water. The only candidate storm shelter is the school on the other side of three rivers, which in a signal warning is exactly when you cannot cross.

Professor Nayak read the locally established madrasa as a possible element of self-organization. We find that persuasive as a reading. It is not evidence that the children are being educated, and we did not look.""")

# =========================================================== SLIDE 10  Q3 - D
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "Question 3  ·  what we could not settle",
           "One number we will not quietly choose for you", accent=GREEN)
lx = Inches(0.72); cw = Inches(6.2); rx = Inches(7.35); cw2 = Inches(5.26)
box = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, lx, y + Inches(0.06), cw, Inches(2.92))
box.fill.solid(); box.fill.fore_color.rgb = WHITE
box.line.color.rgb = RUST; box.line.width = Pt(1.5); box.adjustments[0] = 0.045
tf = tb(s, lx + Inches(0.26), y + Inches(0.26), cw - Inches(0.52), Inches(2.1))
para(tf, "How far is the school?", size=15, color=RUST, bold=True, first=True, space_after=9)
rich(tf, [("The direct interview, twice.  ", INK, True, False),
          ("“it would be one kilometre. When we go, we have to cross three rivers” "
           "(00:16:28), and again “one kilometre away” (00:46:16).", INK, False, False)],
     size=12.5, space_after=7, line=1.24)
rich(tf, [("Our own group discussion.  ", INK, True, False),
          ("“it is four kilometres away, they said you have to cross three rivers” "
           "(00:04:01) — while another member had just said they did not hear the distance.", INK, False, False)],
     size=12.5, space_after=7, line=1.24)
rich(tf, [("What we are doing with it.  ", RUST, True, False),
          ("Reporting both, and treating the three river crossings, which every account agrees on, "
           "as the finding. The kilometre figure is not ours to settle.", INK, False, False)],
     size=12.5, space_after=0, line=1.24)
tf = tb(s, rx, y + Inches(0.06), cw2, Inches(0.3))
para(tf, "FOUR MORE THINGS WE COULD NOT SETTLE", size=11, color=INK, bold=True, first=True, space_after=10)
bullets(s, rx, y + Inches(0.44), cw2, [
    "How many villages. The community said 82; CNRS said 77, then accepted the IUCN plan's 88.",
    "Whether the drinking water is safe. Untested by us and, as far as we were told, by anyone here.",
    "Whether cultural practice has declined. Our group asserted it had, then noticed, on tape, "
    "that we never asked (00:13:04).",
    "Whether the maternal death and the 2022 displacement happened as relayed. Both reached us "
    "second hand through our own discussion.",
], size=12.5, gap=9)
cx = chip(s, lx, Inches(6.42), "OPEN QUESTION", INK)
cx = chip(s, cx, Inches(6.42), "OUR READING", RUST)
tf = tb(s, cx + Inches(0.1), Inches(6.44), Inches(7.2), Inches(0.3))
para(tf, "Open question: when a household's account and our notes disagree, whose record becomes the data?",
     size=11.5, color=INK, first=True, space_after=0)
footer(s, "Slide 10 of 17", speaker_tag(10, "   ·   hands to Speaker 5"))
notes(s, """SPEAKER 4  -  1:20

This slide exists because of one small embarrassment that turned out to be useful.

The direct interview gives the school distance as about one kilometre, and says it twice, half an hour apart. Our own group discussion, recorded the next day, says four kilometres. In the same group recording, another member says they had not heard the distance at all.

We are not going to pick one. We are reporting both, and we are treating the three river crossings, which every version agrees on, as the actual finding. For a child in a storm warning, whether it is one kilometre or four matters less than the fact that three rivers sit between the child and the only building that could serve as a shelter.

Four more things we could not settle. The number of villages: the community said eighty-two, the CNRS informant said seventy-seven and then accepted that the IUCN management plan says eighty-eight. Whether the drinking water is safe. Whether cultural practice has declined, where our own recording catches us asserting it and then saying, in Bengali, but we did not actually ask this. And the maternal death and the 2022 displacement to Netrokona, both of which reached us through our own discussion rather than a direct interview.

That last category is the one I would ask you to hold us to, because it is the easiest kind of claim to let harden into a fact between a field day and a slide deck.

[Hand to Speaker 5.]""")

# ============================================================ SLIDE 11  Q4
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "Question 4  ·  responses across levels   —   bridge slide",
           "Custody and ownership are not in the same hands", accent=SLATE)
pic_fit(s, "f5_responses.png", y + Inches(0.02), Inches(5.66) - (y + Inches(0.02)), Inches(11.45))
flag = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.72), Inches(5.70), Inches(11.9), Inches(0.66))
flag.fill.solid(); flag.fill.fore_color.rgb = WHITE
flag.line.color.rgb = RUST; flag.line.width = Pt(1.2); flag.adjustments[0] = 0.22
tf = tb(s, Inches(0.95), Inches(5.84), Inches(11.5), Inches(0.5))
rich(tf, [("To confirm before we present.  ", RUST, True, False),
          ("The announced allocation gives Q1 one speaker, Q2 one, Q3 two, Q5 two and Q6 one. "
           "Question 4 has no assigned presenter. This bridge is our proposal, not an instruction from the group.",
           INK, False, False)], size=11.5, first=True, space_after=0, line=1.22)
cx = chip(s, Inches(0.72), Inches(6.46), "COMMUNITY TESTIMONY", TEAL)
cx = chip(s, cx, Inches(6.46), "PROFESSIONAL KII", OCHRE)
cx = chip(s, cx, Inches(6.46), "OPEN QUESTION", INK)
footer(s, "Slide 11 of 17", speaker_tag(11, "  (Q4 bridge)"))
notes(s, """SPEAKER 5  -  1:00   [Q4 BRIDGE]

A housekeeping note first, and then one minute on question four. Our announced split covers questions one, two, three, five and six. Question four did not get its own presenter, so I am bridging it here. If the group prefers to give it a full slot, this is the slide to expand.

Three columns, three kinds of actor.

The community is organised. Forty-one societies registered to hold the lease. But when a dispute arises it is not the society that settles it, it is the matbor and the elders. The society's function, as described to us, is essentially the lease. They established a madrasa. Their representatives bring in gear offenders. And three villages are reported to run a lottery for turns with the tourist boats, which is a rule about exclusion that nobody wrote down.

Government is present mainly as announcement and enforcement. The ban is announced by ACLand and the UNO. Participants described being told it is prohibited; they did not describe being told why a particular gear is harmful. Fisher cards are free through the society, and a participant volunteered that there are people who do not fish at all who hold one. Compensation rice came once, maybe two years. And the family-card allowance, which they have heard about on television, had reached nobody in this settlement.

Civil society is present as a sequence of projects with end dates. CBSMTHP ran 2006 to 2018 in four phases, with a bridging phase designed to hand over to government. A USAID-funded activity ended in March 2024. The current programme is doing baseline work, fish-catch monitoring and a tourism carrying-capacity study.

The thing I would point at is underneath all three. The CNRS informant told us that legal ownership of the land sits with the Ministry of Land while custodianship sits with Environment and Forests. Custody and ownership are not in the same hands. That is the governance misfit Professor Nayak described, sitting in the structure itself rather than in anyone's failure to try.""")

# =========================================================== SLIDE 12  Q5 - A
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "Question 5  ·  are vulnerability-to-viability transitions taking place?",
           "We can evidence coping. We cannot evidence a transition.", accent=TEAL)
pic_fit(s, "f6_v2v.png", y + Inches(0.06), Inches(6.26) - (y + Inches(0.06)), Inches(11.45))
cx = chip(s, Inches(0.72), Inches(6.42), "COMMUNITY TESTIMONY", TEAL)
cx = chip(s, cx, Inches(6.42), "OUR READING", RUST)
cx = chip(s, cx, Inches(6.42), "WORKSHOP LECTURE", SLATE)
tf = tb(s, cx + Inches(0.1), Inches(6.44), Inches(6.4), Inches(0.3))
para(tf, "Joypur 00:38:06, 00:43:01, 00:58:36  ·  boatman notes 18:56-20:11  ·  CNRS KII Part 02",
     size=10.5, color=SLATE, first=True, space_after=0)
footer(s, "Slide 12 of 17", speaker_tag(12, "   ·   hands to Speaker 6"))
notes(s, """SPEAKER 5  -  2:00

Question five asks whether vulnerability-to-viability transitions are taking place. The honest answer from one day is: we can describe the first two columns in detail and we cannot fill the third.

Coping is well evidenced. Rice stored in fish-feed sacks. Potatoes when fish are scarce. Paracetamol and antacid at home. Selling to the nekari in the village because the market is unreachable. Moving to Netrokona when the water reached neck height in 2022.

Adaptive response is also evidenced, and it is more interesting, because some of it is genuinely new. Small-boat hire to tourists at twenty to fifty taka a head. An NGO gave boats free and people now work them for hire. The three-month lease followed by paddy followed by other work. Seasonal labour to Tangail, Mymensingh and Sylhet, and permanent migration to Dhaka, where the CNRS informant described young members in garment factories, one as a security guard, another in domestic work. A locally established madrasa. NGO loans taken in women's names, though the men said plainly that it is they who supply the money.

The third column is where I want to be careful. Every item there is a condition that would have to hold, not something we observed. Income that lasts the year. A fish stock that recovers. A card that reaches the person it names. We saw none of that established.

The boatman was asked directly whether tourism money lasts the year. His answer was no, it does not, and then he talked about going elsewhere for work.

So tourism is a real new income stream and it is not yet a transition. Holding those two statements at once is the whole of our answer to question five.

[Hand to Speaker 6.]""")

# =========================================================== SLIDE 13  Q5 - B
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "Question 5  ·  the counterexample we were given",
           "We went in with a hypothesis about tourism. It was refused.", accent=TEAL)
lx = Inches(0.72); cw = Inches(6.35); rx = Inches(7.5); cw2 = Inches(5.11)
tf = tb(s, lx, y + Inches(0.06), cw, Inches(0.3))
para(tf, "THE EXCHANGE", size=11, color=TEAL, bold=True, first=True, space_after=10)
yq = quote_block(s, lx, y + Inches(0.42), cw, None,
    "Interviewer: “big boats break the bank a lot … so the houseboats harm you.”",
    "Joypur, 00:58:09-00:58:15. Our side of the exchange.", color=RUST, size=13.5)
yq = quote_block(s, lx, yq + Inches(0.06), cw,
    "না হাউসবোট থেইকা সুবিধা তো আমরা একটা পাইতাছি … আমি তো নগদ লাভ দেখতাছি।",
    "“no, we are getting a benefit from the houseboats … I am seeing cash profit”",
    "Joypur, 00:58:24. Translated from Bengali; lightly translated.", color=TEAL, size=14)
tf = tb(s, lx, yq + Inches(0.10), cw, Inches(1.5))
para(tf, "He had already said, at 00:47:12, that houseboat noise does not harm fish and that the "
         "kona jal and the short machine do. His one complaint about tourists was the polythene "
         "they leave behind.",
     size=12.5, color=INK, first=True, space_after=0, line=1.26)
tf = tb(s, rx, y + Inches(0.06), cw2, Inches(0.3))
para(tf, "WHY WE ARE SHOWING YOU THIS", size=11, color=RUST, bold=True, first=True, space_after=10)
tf = tb(s, rx, y + Inches(0.42), cw2, Inches(3.4))
para(tf, "The question contained our conclusion. He declined it, twice, and gave a reason "
         "that was about his own household's cash rather than about the haor.",
     size=13, color=INK, first=True, space_after=9, line=1.26)
para(tf, "The CNRS informant, from a different position, said the opposite: that tourism has grown "
         "suddenly, that houseboats put pressure on the environment, and that local people are not "
         "receiving the livelihood benefit expected of it.",
     size=13, color=INK, space_after=9, line=1.26)
para(tf, "Both can be true. The benefit is real, immediate and small; the cost is diffuse, slower, "
         "and borne by a system rather than a household. That is a distribution problem across "
         "scale and across time, not a disagreement about facts.",
     size=13, color=RUST, space_after=0, line=1.26)
rule(s, Inches(5.92), x0=rx, x1=rx + cw2, color=INK, w=1.2)
tf = tb(s, rx, Inches(6.06), cw2, Inches(0.7))
rich(tf, [("Open question.  ", INK, True, False),
          ("Who is positioned to feel a cost that arrives a decade later?", INK, False, False)],
     size=12.5, first=True, space_after=0, line=1.22)
cx = chip(s, lx, Inches(6.42), "COMMUNITY TESTIMONY", TEAL)
cx = chip(s, cx, Inches(6.42), "PROFESSIONAL KII", OCHRE)
footer(s, "Slide 13 of 17", speaker_tag(13, ""))
notes(s, """SPEAKER 6  -  1:30

This is the moment in the day when the field corrected us most directly, and I think it belongs in a reflection more than any success story would.

Near the end of the interview one of us put it to the participant that the big boats erode the bank, that he has to rebuild it, and therefore that the houseboats harm him. Listen to the shape of that: the question contains the conclusion.

His answer, at fifty-eight twenty-four. [Read the Bengali, then the English.] No, we are getting a benefit from the houseboats. I am seeing cash profit. And he explains the mechanism: a big boat ties up, ten small boats go out, each takes passengers to the watch tower at twenty or fifty taka a head.

He had already refused the same framing ten minutes earlier. At forty-seven twelve he said houseboat noise does not harm the fish, and named the kona jal and the short machine instead. His one complaint about tourists was the polythene.

Now, the CNRS informant says something close to the opposite: tourism grew suddenly, houseboats pressure the environment, and local people are not getting the livelihood benefit that was expected.

We are not going to adjudicate that. What we would say is that both accounts can hold, because they are measured over different horizons. The benefit is immediate, in cash, in one household. The cost is diffuse, slower, and borne by a system. And the person best placed to describe today's cash is not the person best placed to feel a cost that arrives in a decade.

That is a question about scale and about time. It is not a disagreement about what happened.""")

# =========================================================== SLIDE 14  Q5 - C
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "Question 5  ·  what evidence is missing",
           "What we would need before we used the word transition", accent=TEAL)
lx = Inches(0.72); cw = Inches(5.86); rx = Inches(6.9); cw2 = Inches(5.72)
tf = tb(s, lx, y + Inches(0.06), cw, Inches(0.3))
para(tf, "THE COMPARISON WE MUST NOT MAKE", size=11, color=RUST, bold=True, first=True, space_after=10)
box = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, lx, y + Inches(0.42), cw, Inches(2.02))
box.fill.solid(); box.fill.fore_color.rgb = WHITE
box.line.color.rgb = RUST; box.line.width = Pt(1.4); box.adjustments[0] = 0.06
tf = tb(s, lx + Inches(0.24), y + Inches(0.60), cw - Inches(0.48), Inches(1.5))
rich(tf, [("141", RUST, True, False),
          ("  fish species in an earlier government assessment, against  ", INK, False, False),
          ("68", RUST, True, False),
          ("  in CNRS fish-catch monitoring about two months before we spoke.",
           INK, False, False)], size=13.5, first=True, space_after=8, line=1.24)
para(tf, "That is not 73 extinctions. The two counts come from different methods, different "
         "monitoring windows and different scopes. A catch-monitoring exercise records what is "
         "landed, not what exists. We are reporting both numbers and refusing the subtraction.",
     size=12.5, color=INK, space_after=0, line=1.24)
tf = tb(s, lx, y + Inches(2.62), cw, Inches(1.4))
para(tf, "The same discipline applies to the turtle nobody has seen for ten years, the dolphin "
         "remembered in the local rivers, and the birds that elders describe as once darkening the "
         "sky. These are memories, offered as memories. CNRS said plainly that no accessible, "
         "continuous species-level dataset exists for this place.",
     size=12.5, color=INK, first=True, space_after=0, line=1.26)
tf = tb(s, rx, y + Inches(0.06), cw2, Inches(0.3))
para(tf, "WHAT WOULD HAVE TO BE TRUE", size=11, color=TEAL, bold=True, first=True, space_after=10)
bullets(s, rx, y + Inches(0.44), cw2, [
    "Income that holds through the nine months outside the lease window, for a named set "
    "of households, over more than one year.",
    "A fish stock measured the same way twice, far enough apart to show a direction.",
    "Entitlements that arrive: the card, the ban compensation, the allowance.",
    "A reason to expect the gear use to change, given that the users are local and expect "
    "to fish here next year.",
    "Someone accountable at the level where the driver sits, not only at the level where "
    "the damage shows.",
], size=12.5, gap=9)
cx = chip(s, lx, Inches(6.42), "PROFESSIONAL KII", OCHRE)
cx = chip(s, cx, Inches(6.42), "OPEN QUESTION", INK)
cx = chip(s, cx, Inches(6.42), "OUR READING", RUST)
footer(s, "Slide 14 of 17", speaker_tag(14, "   ·   hands to Speaker 7"))
notes(s, """SPEAKER 6  -  1:30

If we are going to claim a transition, we should say what would count as evidence. And before that, one comparison we are deliberately refusing.

An earlier government assessment is reported to have recorded one hundred and forty-one fish species. CNRS fish-catch monitoring, about two months before our conversation, found sixty-eight. It is tempting, and we have seen it done, to subtract and announce seventy-three extinctions.

We will not. The two numbers come from different methods, different monitoring windows and different scopes. Catch monitoring records what is landed at a market, not what exists in the water. A species can be present and unlanded. We report both numbers and we refuse the subtraction.

The same applies to the turtle one speaker has not seen in about ten years, while another says he saw one in 2022. To the dolphin remembered in the local rivers, called shishu mach. To the elders describing flocks of birds that looked like cloud and could be heard before they were seen. Those are memories offered as memories, and they are valuable as that. CNRS told us directly that no accessible, continuous species-level dataset exists for this place, and that local people would need to be trained in identification for one to be built.

So, what would have to be true before we used the word transition. Income holding through the nine months outside the lease window, for named households, across more than one year. A fish stock measured the same way twice, far enough apart to show direction. Entitlements that actually arrive. A reason to expect gear use to change, given that the users are local and expect to fish here again next year. And somebody accountable at the level where the driver sits, not only where the damage shows.

None of that is a day's work. That is the point.

[Hand to Speaker 7.]""")

# =========================================================== SLIDE 15  Q6 - A
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "Question 6  ·  what does the future look like?",
           "Three futures the evidence allows, and who would have to act in each", accent=RUST)
lx = Inches(0.72); colw = Inches(3.83); gp = Inches(0.21)
futures = [
    ("If nothing changes at the level above", OCHRE,
     "Silt keeps arriving from upstream in the monsoon. Depth keeps falling. The lease window "
     "keeps producing less from the same three months.",
     "Who would have to act: anyone with reach upstream of the haor. Nobody we met had that reach."),
    ("If the local proposal is taken up", GREEN,
     "Participants asked for two things: deepen the beel, and put katha bamboo back as sanctuary. "
     "Their stated reason was so there would be more fish to catch.",
     "Who would have to act: the departments that re-excavate, plus whoever decides what "
     "the sanctuary is for."),
    ("If tourism keeps growing unmanaged", RUST,
     "Immediate cash for the villages with boats. Polythene, bank erosion and, on the CNRS account, "
     "pressure without the expected local benefit.",
     "Who would have to act: investors described as based in Dhaka, and whoever sets a "
     "carrying capacity."),
]
for i, (hd, c, body, actor) in enumerate(futures):
    bx = lx + i * (colw + gp)
    box = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bx, y + Inches(0.08), colw, Inches(2.92))
    box.fill.solid(); box.fill.fore_color.rgb = WHITE
    box.line.color.rgb = c; box.line.width = Pt(1.4); box.adjustments[0] = 0.04
    tfx = tb(s, bx + Inches(0.24), y + Inches(0.30), colw - Inches(0.48), Inches(2.5))
    para(tfx, hd, size=13.5, color=c, bold=True, first=True, space_after=9, line=1.14)
    para(tfx, body, size=12, color=INK, space_after=9, line=1.26)
    para(tfx, actor, size=11.5, color=SLATE, space_after=0, line=1.24)
tf = tb(s, lx, y + Inches(3.18), Inches(11.9), Inches(1.1))
rich(tf, [("A tension inside the local proposal, which we are not resolving.  ", RUST, True, False),
          ("The sanctuary is asked for so that more can be caught. The lecture on 8 November put the "
           "same shape in front of us with the rabbit and the carrots: plenty of food will not solve "
           "the problem, and plenty of food could be a problem. We are flagging the tension because "
           "it is theirs to settle, not ours.", INK, False, False)],
     size=12.5, first=True, space_after=0, line=1.26)
cx = chip(s, lx, Inches(6.42), "COMMUNITY TESTIMONY", TEAL)
cx = chip(s, cx, Inches(6.42), "PROFESSIONAL KII", OCHRE)
cx = chip(s, cx, Inches(6.42), "WORKSHOP LECTURE", SLATE)
tf = tb(s, cx + Inches(0.1), Inches(6.44), Inches(6.0), Inches(0.3))
para(tf, "Joypur 00:43:50-00:44:34  ·  CNRS KII Parts 01 and 02  ·  lecture 00:05:02",
     size=10.5, color=SLATE, first=True, space_after=0)
footer(s, "Slide 15 of 17", speaker_tag(15, ""))
notes(s, """SPEAKER 7  -  1:30

Question six asks what the future looks like and what can be done. I want to answer it as three conditional futures rather than a recommendation, because a recommendation from one day's visit is exactly what Professor Nayak warned us against.

First, if nothing changes upstream. Silt keeps arriving in the monsoon, depth keeps falling, and the three-month lease window keeps producing less from the same three months. Who would have to act? Someone with reach upstream of this haor. Nobody we met had that reach, and that is the finding, not an accusation.

Second, if the local proposal is taken up. And I want to credit it properly, because it is theirs and it is specific: deepen the beel, and put the katha bamboo back as sanctuary. They have watched the lessees do it. They described lessees bringing in one to two crore taka of katha bamboo and keeping fifty to a hundred guards.

Third, if tourism keeps growing without management. Immediate cash for the villages with boats, which the participant described vividly. Polythene, bank erosion, and on the CNRS account, pressure on the environment without the local benefit that was expected.

Now the tension I am not going to resolve for you. When they ask for a sanctuary, the stated reason is so there will be more fish to catch. That is a perfectly rational reason. But it is the rabbit and the carrots from the lecture: plenty of food will not solve the problem, and plenty of food could be a problem.

Whether a sanctuary built to increase catch functions as a sanctuary is a real question. It is theirs to settle, with whoever holds the rule, and not ours to settle on a slide.""")

# =========================================================== SLIDE 16  Q6 - B
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, "Question 6  ·  what we can now ask",
           "We can now ask for whom, at which level, and over how long", accent=RUST)
pic_fit(s, "f7_questions.png", y + Inches(0.06), Inches(6.26) - (y + Inches(0.06)), Inches(11.15))
cx = chip(s, Inches(0.72), Inches(6.42), "OPEN QUESTION", INK)
tf = tb(s, cx + Inches(0.1), Inches(6.44), Inches(9.0), Inches(0.3))
para(tf, "Each question names a level, a season or a person, rather than asking for a solution.",
     size=11.5, color=SLATE, first=True, space_after=0)
footer(s, "Slide 16 of 17", speaker_tag(16, ""))
notes(s, """SPEAKER 7  -  1:10

Four questions. I will read them quickly and say in one line why each is better than what we would have asked on the sixth.

For whom, and in which season. On the sixth we would have asked whether embankments are good or bad. That question has no answer. This one does, and it has to be answered twice, once for the paddy and once for the fish, and possibly for the same household.

At which level does the fix belong. On the sixth we would have asked what should be done in Tanguar Haor. If the silt comes from Meghalaya and the investment comes from Dhaka, then a village society deciding well is still a society deciding about the wrong thing. That is the governance misfit.

Why is the destructive gear local. We arrived expecting outsiders. We were told, directly, that it is people of this very Tanguar. That makes the question harder and more interesting: what makes a gear worth using when the user expects to fish in the same water next year?

And what would count as a transition. We can describe coping in detail. We cannot say anything has shifted. So: what would we have to measure, over how long, before we were entitled to use the word?

Notice that none of the four asks for a solution. Each one names a level, a season, or a person.""")

# ============================================================== SLIDE 17 CLOSE
s = prs.slides.add_slide(BLANK); bg(s)
y = header(s, None, "What changed in what we notice",
           "Not conclusions. A different set of things we can now see, and a limit we accept.", accent=INK)
lx = Inches(0.72); cw = Inches(6.55); rx = Inches(7.65); cw2 = Inches(4.97)
pairs = [
    ("We arrived looking for", "a problem in Tanguar Haor."),
    ("We leave looking for", "the level at which the problem is produced."),
    ("We arrived looking for", "outsiders damaging a commons."),
    ("We leave looking for", "why a local user chooses a gear he knows is contested."),
    ("We arrived looking for", "whether infrastructure exists."),
    ("We leave looking for", "whether it is used, by whom, in which month."),
    ("We arrived looking for", "signs of recovery."),
    ("We leave looking for", "what would have to be measured before recovery could be claimed."),
]
yy = y + Inches(0.10)
for i in range(0, len(pairs), 2):
    a, b = pairs[i], pairs[i + 1]
    tfp = tb(s, lx, yy, cw, Inches(0.78))
    rich(tfp, [(a[0] + "  ", SLATE, False, False), (a[1], SLATE, False, False)],
         size=12.5, first=True, space_after=2, line=1.18)
    rich(tfp, [(b[0] + "  ", INK, True, False), (b[1], INK, True, False)],
         size=13.5, space_after=0, line=1.18)
    yy += Inches(0.84)
yq = quote_block(s, rx, y + Inches(0.12), cw2, None,
    "“what you saw in Tanguar Haor, even if you go there for the next five years, "
    "what you will see is only one-third. Two-thirds you will never see.”",
    "Prof. Prateep Kumar Nayak, lecture, 8 November 2026, 00:18:20. Spoken in English; "
    "transcribed, not translated.", color=INK, size=14)
tf = tb(s, rx, yq + Inches(0.16), cw2, Inches(2.2))
para(tf, "He also said that this is not a reason to walk away from the problem. It is a reason to "
         "stay engaged, to treat it as a process rather than a one-time fix, and to come back.",
     size=12.5, color=INK, first=True, space_after=10, line=1.26)
para(tf, "So we are not ending with what must be done. We are ending with a changed sense of what "
         "we are entitled to say after one day, and a list of the people we did not speak to: "
         "women in their own words, the tourist-board members, the fisheries and upazila officers, "
         "and anyone from the eighty-one other villages.",
     size=12.5, color=RUST, space_after=0, line=1.26)
rule(s, Inches(6.18), x0=rx, x1=rx + cw2, color=INK, w=1.2)
tf = tb(s, rx, Inches(6.32), cw2, Inches(0.5))
para(tf, "Thank you. We would rather be asked a hard question than a kind one.",
     size=12.5, color=INK, bold=True, first=True, space_after=0)
footer(s, "Slide 17 of 17", speaker_tag(17, "   ·   close and questions"))
notes(s, """SPEAKER 7  -  1:30   [CLOSE]

Four shifts, and then one line from the lecture that we have decided to end on.

We arrived looking for a problem in Tanguar Haor. We leave looking for the level at which the problem is produced.

We arrived looking for outsiders damaging a commons. We leave asking why a local user chooses a gear that his own neighbours dispute.

We arrived asking whether infrastructure exists. We leave asking whether it is used, by whom, and in which month.

We arrived looking for signs of recovery. We leave asking what would have to be measured before recovery could be claimed by anybody.

And then this, from the eighth. [Read it.] What you saw in Tanguar Haor, even if you go there for the next five years, what you will see is only one-third.

He was explicit that this is not a reason to walk away. It is a reason to stay engaged, to work as a process rather than a one-time fix, and to come back.

So we are not closing with what must be done. We are closing with a list of who we did not speak to: women in their own words rather than described by the men of their households, the tourist-board members, the fisheries and upazila officers, and anyone at all from the other eighty-one villages, or seventy-six, or eighty-seven, depending on whose count you take.

Thank you. We would genuinely rather be asked a hard question than a kind one.""")

# ------------------------------------------------------------------- SAVE
path = os.path.join(OUT, "Tanguar_Haor_Field_Reflection_Final.pptx")
prs.save(path)
print("saved", path, len(prs.slides.__iter__.__self__._sldIdLst), "slides")
