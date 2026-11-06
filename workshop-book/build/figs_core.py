"""Core instructional diagrams (Part I, Part III). Each function writes one SVG."""
from svgkit import SVG, C, SANS, SERIF, legend_arrows


def fig_goods(path):
    s = SVG(1615, 1200, bg="#FFFFFF")
    X0, Y0, CW, CH = 330, 130, 640, 300
    s.text(X0 + CW, 52, "বর্জনযোগ্যতা (excludability): কাউকে বাদ দেওয়া কতটা সহজ?", size=36, weight=700, fill=C["hnavy"], anchor="middle")
    s.text(X0 + CW * 0.5, 104, "সহজ", size=33, fill=C["muted"], anchor="middle")
    s.text(X0 + CW * 1.5, 104, "কঠিন / ব্যয়বহুল", size=33, fill=C["muted"], anchor="middle")
    s.add(f'<text transform="translate(48,{Y0+CH}) rotate(-90)" font-family="{SANS}" font-size="34" font-weight="700" fill="{C["hnavy"]}" text-anchor="middle">বিয়োজ্যতা (subtractability)</text>')
    for k, (a, b) in enumerate([("উচ্চ:", "ভাগ কমে"), ("নিম্ন:", "ভাগ কমে না")]):
        yy = Y0 + CH * k + CH / 2
        s.text(250, yy - 6, a, size=32, fill=C["muted"], anchor="end", weight=700)
        s.text(250, yy + 38, b, size=30, fill=C["muted"], anchor="end")
    cells = [
        (0, 0, "ব্যক্তিগত পণ্য", "Private goods", "বাজারে কেনা এক কেজি মাছ", False),
        (1, 0, "সাধারণ-পুল সম্পদ", "Common-pool resource (CPR)", "হাওরের মাছের মজুদ", True),
        (0, 1, "ক্লাব / টোল পণ্য", "Club (toll) goods", "টোল দিয়ে পার হওয়ার সেতু", False),
        (1, 1, "জনপণ্য", "Public goods", "রেডিওতে ঘূর্ণিঝড়-সতর্কবার্তা", False),
    ]
    for cx, cy, bn, en, ex, hi in cells:
        x, y = X0 + cx * CW, Y0 + cy * CH
        s.rect(x + 8, y + 8, CW - 16, CH - 16, fill="#E2F0EE" if hi else "#F4F1EA", stroke=C["teal"] if hi else C["rule"], sw=5 if hi else 2, rx=14)
        s.text(x + CW / 2, y + 85, bn, size=44, weight=700, fill=C["teal"] if hi else C["hnavy"], anchor="middle")
        s.text(x + CW / 2, y + 132, en, size=32, fill=C["muted"], anchor="middle", family=SERIF, italic=True)
        s.text(x + CW / 2, y + 215, "উদাহরণ: " + ex, size=32, fill=C["ink"], anchor="middle")
    s.rect(X0 + CW + 170, Y0 - 12, 300, 44, fill=C["teal"], rx=8)
    s.text(X0 + CW + 320, Y0 + 19, "এই বইয়ের কেন্দ্র", size=29, weight=700, fill="#fff", anchor="middle")
    s.text(X0 + CW, Y0 + 2 * CH + 44, "সতর্কতা: দুই মাত্রাই প্রযুক্তি ও প্রতিষ্ঠানে বদলায় (কাঁটাতার, জিপিএস, লিজ-চুক্তি)", size=30, fill="#8a5d0c", anchor="middle")
    by = Y0 + 2 * CH + 80
    s.path(f"M{X0+2*CW-4},{Y0+CH*0.55} C{X0+2*CW+60},{Y0+CH*0.9} {X0+2*CW+40},{by-20} {X0+CW*1.8},{by+42}", stroke=C["teal"], sw=5)
    s.rect(30, by + 40, 1555, 330, fill="#FAFCFC", stroke=C["rule"], sw=2, rx=14)
    s.text(60, by + 92, "একই সম্পদ, ভিন্ন সম্পত্তি-অধিকার ব্যবস্থা (property-rights regime): মানুষের তৈরি নিয়ম", size=33, weight=700, fill=C["hnavy"])
    regimes = [("উন্মুক্ত প্রবেশ", "Open access", "কার্যকর অধিকার নেই", C["terra"]),
               ("গোষ্ঠী সম্পত্তি", "Group property", "দল বাইরের লোক ঠেকায়", C["leaf"]),
               ("রাষ্ট্রীয় সম্পত্তি", "Government property", "রাষ্ট্র অনুমতি/নিয়ন্ত্রণ দেয়", C["river"]),
               ("ব্যক্তিগত সম্পত্তি", "Individual property", "বাদ দিতে ও বেচতে পারে", C["ochre"])]
    bw = 362
    for i, (bn, en, l1, col) in enumerate(regimes):
        x = 55 + i * (bw + 23)
        s.rect(x, by + 120, bw, 225, fill="#fff", stroke=col, sw=4, rx=12)
        s.rect(x, by + 120, bw, 14, fill=col, rx=4)
        s.text(x + bw / 2, by + 190, bn, size=35, weight=700, fill=C["hnavy"], anchor="middle")
        s.text(x + bw / 2, by + 236, en, size=30, fill=C["muted"], anchor="middle", family=SERIF, italic=True)
        s.text(x + bw / 2, by + 300, l1, size=30, anchor="middle")
    s.save(path, "পণ্যের ধরন ও সম্পত্তি-অধিকার ব্যবস্থা",
           "উপরে দুই অক্ষের ২×২ ছক: বর্জনযোগ্যতা ও বিয়োজ্যতা অনুযায়ী ব্যক্তিগত, ক্লাব, সাধারণ-পুল ও জনপণ্য। নিচে দেখানো হয়েছে, একই সাধারণ-পুল সম্পদ চারটি ভিন্ন সম্পত্তি-অধিকার ব্যবস্থার অধীনে থাকতে পারে: উন্মুক্ত প্রবেশ, গোষ্ঠী সম্পত্তি, রাষ্ট্রীয় সম্পত্তি ও ব্যক্তিগত সম্পত্তি।")


def fig_reasoning_w06(path):
    s = SVG(1615, 1960, bg="#FFFFFF")
    steps = [
        ("পর্যবেক্ষণ", "চিলিকায় জাত-ভিত্তিক মৎস্য-কমন্স শতাব্দী ধরে টিকে ছিল;", "১৯৮০-র দশকে চিংড়ি-চাষের সঙ্গে তা ভেঙে পড়ে", "D", "pp.132–133"),
        ("বিদ্যমান জ্ঞান", "Ostrom (1990) নকশা-নীতি; Agrawal (2002) ২৪ শর্ত:", "মূলত গোষ্ঠীর ভেতরের (internal) চলক", "D", "p.134"),
        ("ধাঁধা / ফাঁক", "কমন্সকে স্থির 'regime' ধরা হয়; বাইরের চালক ও", "সময়ের সঙ্গে পরিবর্তনের প্রক্রিয়া কম তত্ত্বায়িত", "I", "পুনর্গঠন"),
        ("গবেষণা-প্রশ্ন", "কোন কারণ কমন্স গড়ে, কোনটি ভাঙে, আর কীভাবে", "'কমন্সকে কমন্স রাখা' যায়?", "D", "p.133"),
        ("ধারণাগত হাতিয়ার", "commonisation ↔ decommonisation: বর্জনযোগ্যতা ও", "বিয়োজ্যতা সামলানোর প্রতিষ্ঠান গড়া বা হারানো", "D", "pp.132–133"),
        ("গবেষণা-নকশা", "এক লেগুন, দুই গ্রাম (প্রাথমিক বনাম পরবর্তী পর্যায়), ২৮ মাস;", "খানা N=160, মাসিক N=30, গ্রাম N=140; লিজ-রেকর্ড ১৯৫৭–", "D", "pp.133–134"),
        ("প্রমাণ", "আয় ৭০–৮০% কম (২০০২–০৮); ৯৫% সমবায় অচল;", ">৬০% এলাকা অবৈধ চিংড়ি-চাষে (রক্ষণশীল অনুমান)", "D", "pp.138–140"),
        ("দাবি", "commons → decommonisation → open access → privatisation;", "প্রক্রিয়া চলমান ও সম্ভাব্যভাবে দ্বিমুখী", "I", "pp.140–141"),
    ]
    x, w, h, gap, y0 = 60, 1050, 170, 46, 40
    cols = {"D": C["leaf"], "I": C["river"]}
    for i, (head, l1, l2, ev, src) in enumerate(steps):
        y = y0 + i * (h + gap)
        fill = "#EDF3EE" if ev == "D" else "#EAF3F8"
        s.rect(x, y, w, h, fill=fill, stroke=cols[ev], sw=3, rx=14)
        s.text(x + 26, y + 50, f"{i+1}. {head}", size=36, weight=700, fill=C["hnavy"])
        s.badge(x + w - 70, y + 52, ev, ev)
        s.text(x + w - 90, y + 48, src, size=27, fill=C["muted"], anchor="end", family=SERIF)
        s.text(x + 26, y + 102, l1, size=32)
        s.text(x + 26, y + 146, l2, size=32)
        if i < len(steps) - 1:
            kind = "dashed" if i == 6 else "solid"
            s.line(x + w / 2, y + h + 4, x + w / 2, y + h + gap - 6, sw=5, kind=kind, stroke=C["navy"])
    # right column annotations
    ax = 1150
    def note(y, title, rows, col, bg):
        s.rect(ax, y, 1615 - ax - 20, 60 + 40 * len(rows), fill=bg, stroke=col, sw=2, rx=12)
        s.text(ax + 18, y + 44, title, size=31, weight=700, fill=col)
        s.lines(ax + 18, y + 90, rows, size=29, lh=1.38, fill=C["ink"])
    note(y0 + 2 * (h + gap) - 10, "কেন এই ধাপ?", ["অভ্যন্তরীণ চলকের তালিকা", "পরিবর্তন ব্যাখ্যা করে না;", "তাই 'প্রক্রিয়া' ধারণা লাগে"], C["teal"], C["mist"])
    note(y0 + 5 * (h + gap) - 10, "নকশার যুক্তি", ["দুই গ্রাম = পরিবর্তনের দুই", "পর্যায়ের তুলনা, নিয়ন্ত্রিত", "পরীক্ষা নয়"], "#9A6B12", "#FBF4E6")
    note(y0 + 6 * (h + gap) + 70, "দুর্বল সংযোগ ⚠", ["বাজার, নীতি, নতুন মোহনা,", "নাইলন জাল একসাথে ঘটেছে;", "আলাদা প্রভাব মাপা হয়নি"], C["terra"], "#F8ECE7")
    # dashed connector from warning to arrow 7->8
    yarr = y0 + 7 * (h + gap) - gap / 2
    s.path(f"M{ax},{y0 + 6*(h+gap)+150} C{ax-60},{y0 + 6*(h+gap)+150} {x+w+40},{yarr} {x+w/2+20},{yarr}", stroke=C["terra"], sw=3, kind="dotted", head=False)
    # legend
    ly = 1800
    s.badge(70, ly + 4, "D", "D"); s.text(130, ly, "লেখক স্পষ্টভাবে লিখেছেন (documented)", size=29, fill=C["muted"])
    s.badge(70, ly + 58, "I", "I"); s.text(130, ly + 54, "আমাদের যুক্তিভিত্তিক পুনর্গঠন বা লেখকের ব্যাখ্যা (inference)", size=29, fill=C["muted"])
    s.line(900, ly - 10, 990, ly - 10, sw=4, kind="solid"); s.text(1005, ly, "নথিভুক্ত যৌক্তিক ধাপ", size=29, fill=C["muted"])
    s.line(900, ly + 44, 990, ly + 44, sw=4, kind="dashed"); s.text(1005, ly + 54, "প্রমাণ থেকে দাবিতে লাফ", size=29, fill=C["muted"])
    s.text(1575, 1945, "উৎস: Nayak & Berkes (2011), Conservation and Society 9(2):132–145; পৃষ্ঠা উল্লেখ জার্নাল-পৃষ্ঠা অনুযায়ী। মৌলিক চিত্র।", size=26, fill=C["muted"], anchor="end", family=SERIF)
    s.save(path, "Nayak ও Berkes (2011)-এর যুক্তি-শৃঙ্খল",
           "আটটি ধাপের উল্লম্ব প্রবাহচিত্র: পর্যবেক্ষণ, বিদ্যমান জ্ঞান, ধাঁধা, প্রশ্ন, ধারণাগত হাতিয়ার, নকশা, প্রমাণ ও দাবি। প্রতিটি ধাপে D (নথিভুক্ত) বা I (অনুমান) চিহ্ন ও পৃষ্ঠা-উল্লেখ। প্রমাণ থেকে দাবির তীর ড্যাশ, কারণ একাধিক চালক একসঙ্গে ঘটেছে।")


if __name__ == "__main__":
    import sys, os
    out = sys.argv[1]
    fig_goods(os.path.join(out, "fig_1_1_goods_regimes.svg"))
    fig_reasoning_w06(os.path.join(out, "fig_12_1_reasoning_chilika.svg"))
