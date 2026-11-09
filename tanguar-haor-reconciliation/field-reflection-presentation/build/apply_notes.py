# -*- coding: utf-8 -*-
import os, sys
from pptx import Presentation
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from script import SPOKEN, HANDOFF, RUN

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, "out", "Tanguar_Haor_Field_Reflection_Final.pptx")
prs = Presentation(P)
secs = {n: (sp, t) for n, sp, t in RUN}
total = 0
for i, slide in enumerate(prs.slides, 1):
    sp, t = secs[i]
    body = SPOKEN[i].strip()
    if i in HANDOFF:
        body += "\n\n" + HANDOFF[i]
    words = len(body.split())
    total += words
    head = (f"SPEAKER {sp}   |   slide {i} of 17   |   target {t//60}:{t%60:02d}   "
            f"|   {words} words, about {int(words/140*60)} s at 140 wpm\n"
            + "-" * 78 + "\n\n")
    slide.notes_slide.notes_text_frame.text = head + body
prs.save(P)
print(f"notes applied: {total} words -> {total/140:.1f} min at 140 wpm, "
      f"{total/150:.1f} min at 150 wpm")
