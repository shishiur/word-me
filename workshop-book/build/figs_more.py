"""Remaining instructional figures for the full book."""
from svgkit import SVG, C, SANS, SERIF, legend_arrows


def fig_start_here(path):
    s = SVG(1615, 520, bg="#FFFFFF")
    steps = [("১", "ভিত্তি", "CPR, অধিকার,", "প্রতিষ্ঠান", C["teal"]),
             ("২", "পদ্ধতি", "প্রশ্ন → প্রমাণ", "→ দাবি", C["ochre"]),
             ("৩", "দশ পাঠ", "লেখকের যুক্তি", "পুনর্গঠন", C["hnavy"]),
             ("৪", "সংশ্লেষণ", "পাঠে পাঠে", "তুলনা", C["river"]),
             ("৫", "সেতু", "হাওর-ইলিশ", "গবেষণা", C["leaf"]),
             ("৬", "কর্মশালা", "প্রশ্ন ও", "পুনরালোচনা", C["terra"])]
    w, gap = 230, 33
    s.path("M60,300 C400,150 700,430 1000,280 S1450,200 1570,300", stroke="#cfe3e6", sw=40, head=False)
    for i, (n, h, a, b, col) in enumerate(steps):
        x = 30 + i * (w + gap)
        s.add(f'<circle cx="{x+w/2}" cy="120" r="62" fill="{col}"/>')
        s.text(x + w / 2, 142, n, size=60, weight=700, fill="#fff", anchor="middle")
        s.rect(x, 210, w, 220, fill="#fff", stroke=col, sw=4, rx=14)
        s.text(x + w / 2, 275, h, size=40, weight=700, fill=C["hnavy"], anchor="middle")
        s.text(x + w / 2, 340, a, size=32, anchor="middle")
        s.text(x + w / 2, 385, b, size=32, anchor="middle")
        if i < 5:
            s.line(x + w + 4, 320, x + w + gap - 4, 320, sw=5, stroke=col)
    s.text(1585, 500, "পাঠের পথ: ধারণা আগে, বিচার পরে, প্রয়োগ শেষে", size=30, fill=C["muted"], anchor="end")
    s.save(path, "পাঠের পথ", "ছয় ধাপের পথ: ভিত্তি, পদ্ধতি, দশ পাঠ, সংশ্লেষণ, গবেষণা-সেতু, কর্মশালা।")


def fig_bundle(path):
    s = SVG(1615, 960, bg="#FFFFFF")
    rights = ["প্রবেশ\nAccess", "আহরণ\nWithdrawal", "ব্যবস্থাপনা\nManagement", "বর্জন\nExclusion", "হস্তান্তর\nAlienation"]
    holders = [("অনুমোদিত ব্যবহারকারী", "Authorized user", 2), ("দাবিদার", "Claimant", 3),
               ("স্বত্বাধিকারী", "Proprietor", 4), ("মালিক", "Owner", 5)]
    X0, Y0, cw, rh = 520, 200, 205, 120
    for j, r in enumerate(rights):
        bn, en = r.split("\n")
        s.text(X0 + j * cw + cw / 2, Y0 - 70, bn, size=34, weight=700, fill=C["hnavy"], anchor="middle")
        s.text(X0 + j * cw + cw / 2, Y0 - 30, en, size=29, fill=C["muted"], anchor="middle", family=SERIF, italic=True)
    for i, (bn, en, k) in enumerate(holders):
        y = Y0 + i * rh
        s.text(40, y + 58, bn, size=34, weight=700, fill=C["hnavy"])
        s.text(40, y + 98, en, size=29, fill=C["muted"], family=SERIF, italic=True)
        for j in range(5):
            on = j < k
            s.rect(X0 + j * cw + 10, y + 14, cw - 20, rh - 28, fill=C["teal"] if on else "#F1F4F5",
                   stroke=C["teal"] if on else C["rule"], sw=2, rx=10)
            s.text(X0 + j * cw + cw / 2, y + 74, "✓" if on else "—", size=40, fill="#fff" if on else "#9aa7ae",
                   anchor="middle", weight=700)
    yb = Y0 + 4 * rh + 40
    s.rect(30, yb, 1555, 210, fill="#F8ECE7", stroke=C["terra"], sw=2, rx=12)
    s.text(55, yb + 52, "চিলিকার প্যারাডক্স (Nayak & Berkes 2011, p.142)", size=33, weight=700, fill=C["terra"])
    s.text(55, yb + 105, "লিজ-ব্যবস্থায় জেলে-গ্রামগুলোর প্রবেশ ও আহরণ আইনি, আর ব্যবস্থাপনা-বর্জন-হস্তান্তর কার্যত ছিল।", size=31)
    s.text(55, yb + 152, "২০১০ নাগাদ লিজ-ফি দিয়েও বাস্তবে একটি অধিকারও তাঁদের হাতে নেই; অথচ দখলকারীরা 'thin access'", size=31)
    s.text(55, yb + 196, "থেকে কার্যত পূর্ণ অধিকারে পৌঁছেছেন। কাগজের অধিকার ≠ প্রয়োগের ক্ষমতা।", size=31)
    s.text(1585, 950, "ধারণা: Schlager & Ostrom (1992), W10 §5.3-এ উদ্ধৃত; মৌলিক পুনর্নির্মাণ", size=26, fill=C["muted"], anchor="end", family=SERIF)
    s.save(path, "অধিকারের গুচ্ছ", "চার ধরনের অধিকারধারী (অনুমোদিত ব্যবহারকারী, দাবিদার, স্বত্বাধিকারী, মালিক) বনাম পাঁচ অধিকার (প্রবেশ, আহরণ, ব্যবস্থাপনা, বর্জন, হস্তান্তর) এর ছক; নিচে চিলিকার প্যারাডক্স।")


def fig_rule_levels(path):
    s = SVG(1615, 640, bg="#FFFFFF")
    levels = [("সাংবিধানিক স্তর", "Constitutional", "কে নিয়ম বানানোর নিয়ম ঠিক করবে?", "উদাহরণ: জলমহাল নীতিমালা কে প্রণয়ন করে", C["hnavy"]),
              ("সম্মিলিত-পছন্দ স্তর", "Collective-choice", "দৈনন্দিন নিয়ম কে, কীভাবে বদলাবে?", "উদাহরণ: সমিতির সভায় জালের ফাঁস ঠিক করা", C["teal"]),
              ("পরিচালন স্তর", "Operational", "কোথায়, কখন, কী দিয়ে ধরা যাবে?", "উদাহরণ: জ্যৈষ্ঠে ডিমওয়ালা মাছ ধরা নিষেধ", C["leaf"])]
    for i, (bn, en, q, ex, col) in enumerate(levels):
        inset = i * 110
        y = 40 + i * 190
        s.rect(40 + inset, y, 1535 - 2 * inset, 170, fill="#fff", stroke=col, sw=4, rx=16)
        s.rect(40 + inset, y, 18, 170, fill=col, rx=6)
        s.text(80 + inset, y + 58, f"{bn} · {en}", size=36, weight=700, fill=col)
        s.text(80 + inset, y + 108, q, size=32)
        s.text(80 + inset, y + 152, ex, size=29, fill=C["muted"])
    s.text(1585, 628, "ধারণা: Ostrom (1990, 2005), W10 §5.4-এ ব্যাখ্যাত; উদাহরণগুলো কাল্পনিক শিক্ষণ-উদাহরণ", size=26, fill=C["muted"], anchor="end", family=SERIF)
    s.save(path, "নিয়মের তিন স্তর", "সাংবিধানিক, সম্মিলিত-পছন্দ ও পরিচালন স্তরের নিয়ম; প্রতিটির প্রশ্ন ও কাল্পনিক উদাহরণ।")


def fig_hardin_matrix(path):
    s = SVG(1615, 860, bg="#FFFFFF")
    cols = [("Hardin-এর চারণভূমি", C["terra"]), ("রোভিং ব্যান্ডিট", C["ochre"]), ("মেইন লবস্টার", C["leaf"])]
    rows = [("RS1 সম্পদ-ব্যবস্থা", ["চারণভূমি", "উপকূলীয় জল", "উপকূলীয় জল"]),
            ("GS শাসনব্যবস্থা", ["নেই", "নেই", "স্থানীয় নিয়ম + রাষ্ট্র"]),
            ("RU1/RU6 একক ও চিহ্ন", ["গরু: মালিকানা চেনা যায়", "ধরলেই মালিক", "V-notch: দৃশ্যমান চিহ্ন"]),
            ("U1 + RS3 ব্যবহারকারী-চাপ", ["বেশি", "অনেক নৌকা, সীমিত মজুদ", "বন্দর-ভিত্তিক দল"]),
            ("U3–U7 ইতিহাস, নেতৃত্ব, নিয়ম", ["বিচ্ছিন্ন, স্বল্পমেয়াদি", "বিচ্ছিন্ন, স্বল্পমেয়াদি", "প্রজন্মের বাস; আস্থা"]),
            ("I1/O2 ফল", ["অতি-আহরণ (তাত্ত্বিক)", "অতি-আহরণ ঘটেছে", "পতনের পর পুনরুদ্ধার"])]
    X0, cw, rh, Y0 = 430, 390, 108, 120
    for j, (h, col) in enumerate(cols):
        s.rect(X0 + j * cw + 6, 30, cw - 12, 74, fill=col, rx=10)
        s.text(X0 + j * cw + cw / 2, 78, h, size=31, weight=700, fill="#fff", anchor="middle")
    for i, (lab, cells) in enumerate(rows):
        y = Y0 + i * rh
        s.rect(20, y, 1575, rh - 8, fill="#F4F9F8" if i % 2 == 0 else "#fff", rx=6)
        s.text(36, y + 60, lab, size=30, weight=700, fill=C["hnavy"])
        for j, t in enumerate(cells):
            s.text(X0 + j * cw + cw / 2, y + 60, t, size=29, anchor="middle")
    s.text(36, 800, "পাঠ: Hardin-এর অনুমান যেখানে সত্য, সেখানে তাঁর ভবিষ্যদ্বাণীও খাটে; প্রশ্ন হলো অনুমানগুলো কোথায় সত্য।", size=29, fill=C["teal"], weight=700)
    s.text(1585, 848, "উৎস: Ostrom (2007) PNAS, Hardin ও Roving Bandits অংশ; মৌলিক ছক", size=26, fill=C["muted"], anchor="end", family=SERIF)
    s.save(path, "Hardin, রোভিং ব্যান্ডিট ও মেইন লবস্টার", "তিনটি ব্যবস্থার তুলনা SES চলক অনুযায়ী: Hardin-এর চারণভূমি, ভ্রাম্যমাণ দস্যু, মেইন লবস্টার।")


def fig_ses(path):
    s = SVG(1615, 1000, bg="#FFFFFF")
    s.rect(20, 20, 1575, 960, fill="#F7F4EC", stroke=C["rule"], sw=2, rx=20)
    s.text(60, 80, "সামাজিক, অর্থনৈতিক ও রাজনৈতিক প্রেক্ষাপট (S)", size=34, weight=700, fill=C["hnavy"])
    def node(x, y, w, h, bn, en, col):
        s.rect(x, y, w, h, fill="#fff", stroke=col, sw=5, rx=18)
        s.text(x + w / 2, y + h / 2 - 6, bn, size=38, weight=700, fill=col, anchor="middle")
        s.text(x + w / 2, y + h / 2 + 40, en, size=29, fill=C["muted"], anchor="middle", family=SERIF, italic=True)
    node(110, 150, 460, 150, "সম্পদ-ব্যবস্থা", "Resource system (RS)", C["river"])
    node(1045, 150, 460, 150, "শাসন-ব্যবস্থা", "Governance system (GS)", C["hnavy"])
    node(110, 640, 460, 150, "সম্পদ-একক", "Resource units (RU)", C["leaf"])
    node(1045, 640, 460, 150, "ব্যবহারকারী", "Users (U)", C["ochre"])
    s.add('<ellipse cx="807" cy="470" rx="250" ry="120" fill="#E2F0EE" stroke="#147C80" stroke-width="5"/>')
    s.text(807, 450, "মিথস্ক্রিয়া (I) → ফল (O)", size=36, weight=700, fill=C["teal"], anchor="middle")
    s.text(807, 500, "Interactions → Outcomes", size=29, fill=C["muted"], anchor="middle", family=SERIF, italic=True)
    for (x1, y1, x2, y2) in [(570, 290, 610, 400), (1045, 290, 1005, 400), (570, 650, 610, 545), (1045, 650, 1005, 545)]:
        s.line(x1, y1, x2, y2, sw=5, stroke=C["teal"])
    s.line(340, 300, 340, 630, sw=4, stroke=C["river"], kind="solid")
    s.text(360, 470, "উৎপন্ন করে", size=28, fill=C["muted"])
    s.line(1275, 300, 1275, 630, sw=4, stroke=C["hnavy"])
    s.text(1295, 470, "নিয়ম দেয়", size=28, fill=C["muted"])
    s.path("M807,590 C807,700 807,820 807,860", stroke=C["teal"], sw=4, kind="dashed")
    s.text(830, 830, "ফিডব্যাক: ফল আবার উপব্যবস্থাগুলো বদলায়", size=28, fill=C["muted"])
    s.text(60, 940, "সংশ্লিষ্ট প্রতিবেশ-ব্যবস্থা (ECO): জলবায়ু, দূষণ, ফোকাল SES-এ প্রবাহ", size=32, weight=700, fill=C["leaf"])
    s.text(1565, 970, "Ostrom (2007 Fig.1; 2009 Fig.1) অবলম্বনে সরলীকৃত মৌলিক পুনর্নির্মাণ", size=25, fill=C["muted"], anchor="end", family=SERIF)
    s.save(path, "সামাজিক-প্রতিবেশ ব্যবস্থা কাঠামো", "চারটি মূল উপব্যবস্থা: সম্পদ-ব্যবস্থা, সম্পদ-একক, শাসন-ব্যবস্থা ও ব্যবহারকারী, যারা মিথস্ক্রিয়া ও ফল তৈরি করে; চারপাশে সামাজিক প্রেক্ষাপট ও সংশ্লিষ্ট প্রতিবেশ-ব্যবস্থা।")


def fig_ten_vars(path):
    s = SVG(1615, 720, bg="#FFFFFF")
    items = [("RS3 আকার", "hump"), ("RS5 উৎপাদনশীলতা", "hump"), ("RS7 পূর্বাভাসযোগ্যতা", "up"),
             ("RU1 সচলতা", "down"), ("U1 ব্যবহারকারী", "cond"), ("U5 নেতৃত্ব", "up"),
             ("U6 সামাজিক পুঁজি", "up"), ("U7 SES-জ্ঞান", "up"), ("U8 সম্পদের গুরুত্ব", "up"), ("GS6 নিয়ম-স্বায়ত্তশাসন", "up")]
    cw, ch = 316, 300
    for i, (lab, kind) in enumerate(items):
        x = 10 + (i % 5) * (cw + 6); y = 20 + (i // 5) * (ch + 30)
        s.rect(x, y, cw, ch, fill="#FAFCFC", stroke=C["rule"], sw=2, rx=10)
        s.text(x + cw / 2, y + 44, lab, size=29, weight=700, fill=C["hnavy"], anchor="middle")
        ox, oy, W, H = x + 40, y + 250, cw - 70, 160
        s.line(ox, oy, ox + W, oy, sw=2, stroke=C["muted"], head=False)
        s.line(ox, oy, ox, oy - H, sw=2, stroke=C["muted"], head=False)
        if kind == "hump":
            d = f"M{ox},{oy-20} C{ox+W*0.35},{oy-H} {ox+W*0.65},{oy-H} {ox+W},{oy-20}"
        elif kind == "up":
            d = f"M{ox},{oy-20} C{ox+W*0.4},{oy-40} {ox+W*0.6},{oy-H*0.9} {ox+W},{oy-H*0.95}"
        elif kind == "down":
            d = f"M{ox},{oy-H*0.95} C{ox+W*0.4},{oy-H*0.9} {ox+W*0.6},{oy-40} {ox+W},{oy-20}"
        else:
            d = f"M{ox},{oy-60} L{ox+W},{oy-120}"; s.path(f"M{ox},{oy-110} L{ox+W},{oy-40}", stroke=C["ochre"], sw=4, kind="dashed", head=False)
        s.path(d, stroke=C["teal"] if kind != "cond" else C["ochre"], sw=5, kind="dashed" if kind == "cond" else "solid", head=False)
        s.text(ox + W, oy + 32, "চলকের মান →", size=24, fill=C["muted"], anchor="end")
    s.text(1605, 712, "y = স্ব-সংগঠনের সম্ভাবনা। Ostrom (2009) পাঠ্যের গুণগত রূপ, মাপা বক্ররেখা নয়। কমলা ড্যাশ = প্রভাব শর্তসাপেক্ষ।", size=25, fill=C["muted"], anchor="end")
    s.save(path, "দশটি চলক ও স্ব-সংগঠন", "Ostrom 2009-এর দশটি চলকের প্রস্তাবিত প্রভাবের গুণগত আকৃতি: আকার ও উৎপাদনশীলতা কুঁজ-আকৃতি, সচলতা নেতিবাচক, ব্যবহারকারী-সংখ্যা শর্তসাপেক্ষ, বাকিগুলো ধনাত্মক।")


def fig_continuum(path):
    s = SVG(1615, 760, bg="#FFFFFF")
    s.add('<defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stop-color="#B6684F"/><stop offset="0.5" stop-color="#E8E1CF"/><stop offset="1" stop-color="#4E7960"/></linearGradient></defs>')
    s.rect(120, 300, 1375, 70, fill="url(#cg)", rx=35)
    s.text(140, 270, "← প্রবল decommonisation", size=33, weight=700, fill=C["terra"])
    s.text(1475, 270, "প্রবল commonisation →", size=33, weight=700, fill=C["leaf"], anchor="end")
    s.text(807, 345, "একই ধারাবাহিকতায় দুই দিকেই চলা সম্ভব", size=30, fill=C["ink"], anchor="middle")
    s.path("M807,250 C700,150 400,150 300,240", stroke=C["terra"], sw=6)
    s.path("M807,250 C910,150 1200,150 1310,240", stroke=C["leaf"], sw=6)
    s.add('<circle cx="807" cy="250" r="18" fill="#12334B"/>')
    s.text(807, 120, "বর্তমান অবস্থা", size=30, weight=700, fill=C["hnavy"], anchor="middle")
    boxes = [(120, "প্রতিকূল শর্ত", ["উচ্চ ও বর্ধিষ্ণু জনঘনত্ব", "কেন্দ্রীভূত রাষ্ট্র-নিয়ন্ত্রণ", "ব্যক্তিকরণ-অনুকূল নীতি", "প্রথাগত অধিকার বিতর্কিত", "সম্পদ-অবক্ষয়"], C["terra"], "#F8ECE7"),
             (575, "যুগপৎ প্রক্রিয়া", ["কিছু উপাদানে commonisation,", "অন্য উপাদানে decommonisation", "(যেমন Seri মৎস্য)", "সংযোগ থাকলে: co-evolution", "(Nayak & Berkes 2022 §3)"], C["hnavy"], "#EEF3F6"),
             (1030, "অনুকূল শর্ত", ["নিম্ন জনঘনত্ব", "স্থানীয় প্রতিষ্ঠান নেতৃত্বে", "সম্প্রদায়-নিয়ন্ত্রণ অনুকূল নীতি", "প্রথাগত অধিকার স্বীকৃত", "অনুকূল সম্পদ-অবস্থা"], C["leaf"], "#EDF3EE")]
    for x, h, rows, col, bg in boxes:
        s.rect(x, 420, 445, 300, fill=bg, stroke=col, sw=3, rx=14)
        s.text(x + 22, 470, h, size=33, weight=700, fill=col)
        s.lines(x + 22, 520, rows, size=28, lh=1.4)
    s.text(1595, 752, "Nayak & Berkes (2011 Fig.1; 2022 Fig.1) ও Berkes et al. (2025 Fig.5.2) অবলম্বনে মৌলিক পুনর্নির্মাণ; 'অনুকূল' শব্দটি লেখকদের স্বীকৃত মূল্যবোধগত অবস্থান", size=24, fill=C["muted"], anchor="end", family=SERIF)
    s.save(path, "commonisation–decommonisation ধারাবাহিকতা", "একটি রঙিন অনুভূমিক দণ্ডে বাঁদিকে প্রবল decommonisation, ডানদিকে প্রবল commonisation; নিচে প্রতিকূল শর্ত, যুগপৎ প্রক্রিয়া ও অনুকূল শর্তের তালিকা।")


def fig_chilika_timeline(path):
    ev = [("১৮শ শতকের শুরু", "জাত-ভিত্তিক মৎস্য-নিয়মের দলিল-প্রমাণ", "p.135", C["leaf"]),
          ("১৯৪২", "লিজ-ব্যবস্থা: শুধু জেলে-গ্রাম, শুধু জেলে-জাত", "p.135", C["leaf"]),
          ("১৯৫৯-এর পর", "গ্রাম-সমবায় (PFCS) মূল প্রতিষ্ঠান", "p.135", C["leaf"]),
          ("১৯৬৫", "লিজ-ফি বছরে +১০% (প্রায় ৩০ বছর)", "p.139", C["muted"]),
          ("১৯৭৪", "নলবন পাখি-অভয়ারণ্য, ১,৫৫৩ হেক্টর; চার তিয়ারা গ্রামের অধিকার বাতিল", "p.137", C["terra"]),
          ("১৯৮০-র দশক", "চিংড়ি-চাষের বিস্ফোরণ; টাটার সঙ্গে MOU", "pp.137–138", C["terra"]),
          ("১৯৯১", "নতুন লিজ-নীতি: চাষ বৈধ, ৬,০০০ হেক্টর অ-জেলে গ্রামে; ফি +২৭%", "pp.138–139", C["terra"]),
          ("১৯৯১–৯২", "রাজ্য-স্তরের FISHFED ও চিলিকা উন্নয়ন কর্তৃপক্ষ (CDA)", "p.139", C["terra"]),
          ("১৯৯৩–১৯৯৭", "হাইকোর্ট, সুপ্রিম কোর্ট, বিধানসভা কমিটি: চিংড়ি-চাষ নিষিদ্ধ", "p.138", C["hnavy"]),
          ("২০০১", "রাজ্য-নিষেধাজ্ঞা ও ১৯৯১ নীতি বাতিল; কৃত্রিম নতুন সমুদ্র-মোহনা", "pp.138, 140", C["hnavy"]),
          ("২০০২–২০০৮", "জাত-ভিত্তিক জেলে-খানার গড় আয় ৭০–৮০% কম", "p.140", C["terra"]),
          ("২০১০", "অবৈধ চাষ চলমান: রক্ষণশীল হিসাবে >৬০% মৎস্য-এলাকা", "p.138", C["terra"])]
    rh = 92
    s = SVG(1615, 140 + rh * len(ev), bg="#FFFFFF")
    s.line(330, 40, 330, 60 + rh * len(ev) - 40, sw=6, stroke=C["hnavy"], head=False)
    for i, (when, what, pg, col) in enumerate(ev):
        y = 70 + i * rh
        s.add(f'<circle cx="330" cy="{y}" r="15" fill="{col}"/>')
        s.text(300, y + 11, when, size=31, weight=700, fill=col, anchor="end")
        s.text(370, y + 11, what, size=30)
        s.text(1590, y + 11, pg, size=26, fill=C["muted"], anchor="end", family=SERIF)
    s.text(1595, 120 + rh * len(ev), "সব তারিখ Nayak & Berkes (2011) থেকে। সবুজ = commonising, লাল = decommonising, নীল = আইনি/পরিবেশগত হস্তক্ষেপ।", size=25, fill=C["muted"], anchor="end", family=SERIF)
    s.save(path, "চিলিকা সময়রেখা", "১৮শ শতক থেকে ২০১০ পর্যন্ত চিলিকা লেগুনের কমন্স-সংক্রান্ত প্রধান ঘটনা, Nayak ও Berkes 2011-এর পৃষ্ঠা-উল্লেখসহ।")


def fig_inference_ladder(path):
    s = SVG(1615, 900, bg="#FFFFFF")
    rungs = [("বর্ণনামূলক পর্যবেক্ষণ", "কী ঘটেছে, কতটা?", "৯৫% সমবায় অচল (W06)", C["leaf"]),
             ("সম্পর্ক / সহসম্পর্ক", "X আর Y কি একসঙ্গে বদলায়?", "কৃষক-নিয়ন্ত্রিত সেচে বেশি শস্য-তীব্রতা (W02)", C["river"]),
             ("প্রক্রিয়া-ব্যাখ্যা", "কোন পথে X থেকে Y?", "V-notch → নির্ভরযোগ্য সংকেত → পারস্পরিকতা (W03)", C["teal"]),
             ("কার্যকারণ-অনুমান", "X না থাকলে Y কী হতো?", "দৈবচয়িত অর্থপ্রদান → বনক্ষয় কম (W05 §2.3.4)", C["hnavy"]),
             ("নীতি-সুপারিশ", "কী করা উচিত? (মূল্যবোধ লাগে)", "'কমন্সকে কমন্স রাখুন' (W06)", C["terra"])]
    for i, (h, q, ex, col) in enumerate(rungs):
        y = 760 - i * 160
        x = 80 + i * 70
        s.rect(x, y, 1470 - i * 140, 120, fill="#fff", stroke=col, sw=4, rx=12)
        s.rect(x, y, 20, 120, fill=col, rx=6)
        s.text(x + 40, y + 50, f"{i+1}. {h}", size=34, weight=700, fill=col)
        s.text(x + 40, y + 95, q, size=29, fill=C["muted"])
        s.text(x + 1470 - i * 140 - 25, y + 72, ex, size=28, anchor="end")
    s.line(40, 860, 40, 60, sw=5, stroke=C["navy"])
    s.add(f'<text transform="translate(26,460) rotate(-90)" font-family="{SANS}" font-size="28" fill="{C["muted"]}" text-anchor="middle">প্রতিটি ধাপে বাড়তি অনুমান ও বাড়তি প্রমাণ লাগে</text>')
    s.text(1595, 893, "মৌলিক চিত্র; উদাহরণগুলো এই বইয়ের পাঠ থেকে, ধাপের ধারণা সাধারণ গবেষণা-পদ্ধতি সাহিত্যের", size=24, fill=C["muted"], anchor="end", family=SERIF)
    s.save(path, "অনুমানের সিঁড়ি", "পাঁচ ধাপের সিঁড়ি: বর্ণনা, সম্পর্ক, প্রক্রিয়া, কার্যকারণ, নীতি; প্রতিটিতে নির্ধারিত পাঠ থেকে উদাহরণ।")


def fig_w02_irrigation(path):
    s = SVG(1615, 760, bg="#FFFFFF")
    data = [("মাথার দিক (head-end)", 246, 208, "F=10.51, P=0.002"), ("লেজের দিক (tail-end)", 237, 182, "F=20.33, P=0.004")]
    base, scale, X0 = 620, 2.0, 260
    for v in (0, 100, 200, 300):
        y = base - v * scale * 0.85
        s.line(X0 - 20, y, 1560, y, sw=1, stroke="#dde5e8", head=False)
        s.text(X0 - 30, y + 10, f"{v}%", size=26, fill=C["muted"], anchor="end", family=SERIF)
    for i, (lab, a, b, st) in enumerate(data):
        gx = X0 + 80 + i * 640
        for k, (v, col, nm) in enumerate([(a, C["leaf"], "কৃষক-মালিকানা (N=97)"), (b, C["river"], "সরকারি মালিকানা (N=21)")]):
            h = v * scale * 0.85
            x = gx + k * 220
            s.rect(x, base - h, 180, h, fill=col, rx=4)
            s.text(x + 90, base - h - 16, f"{v}%", size=32, weight=700, fill=C["hnavy"], anchor="middle", family=SERIF)
        s.text(gx + 200, base + 50, lab, size=31, weight=700, fill=C["hnavy"], anchor="middle")
        s.text(gx + 200, base + 92, st, size=27, fill=C["muted"], anchor="middle", family=SERIF)
    s.rect(1180, 40, 30, 30, fill=C["leaf"], rx=4); s.text(1222, 66, "কৃষক-মালিকানা (N=97)", size=28)
    s.rect(1180, 90, 30, 30, fill=C["river"], rx=4); s.text(1222, 116, "সরকারি মালিকানা (N=21)", size=28)
    s.text(40, 60, "শস্য-তীব্রতা (%)", size=30, weight=700, fill=C["hnavy"])
    s.text(1595, 750, "তথ্য: Ostrom et al. (1999) Table 2, Lam (1998) p.106 থেকে; মান হুবহু, চিত্র মৌলিক। ১০০% = এক মৌসুমে সব জমি পূর্ণ ব্যবহার।", size=24, fill=C["muted"], anchor="end", family=SERIF)
    s.save(path, "নেপালের সেচ: মালিকানা বনাম শস্য-তীব্রতা", "দণ্ডচিত্র: মাথার দিকে কৃষক-মালিকানাধীন ২৪৬% বনাম সরকারি ২০৮%; লেজের দিকে ২৩৭% বনাম ১৮২%।")


def fig_urchin(path):
    s = SVG(1615, 760, bg="#FFFFFF")
    pts = [(1945, 0.1), (1955, 1.3), (1965, 2.5), (1975, 3.5), (1985, 8.5), (1995, 11.8)]
    X0, Y0, W, H = 200, 620, 820, 500
    def px(y): return X0 + (y - 1940) / 60 * W
    def py(v): return Y0 - v / 12 * H
    for v in (0, 4, 8, 12):
        s.line(X0, py(v), X0 + W, py(v), sw=1, stroke="#dde5e8", head=False)
        s.text(X0 - 15, py(v) + 9, str(v), size=26, fill=C["muted"], anchor="end", family=SERIF)
    d = "M" + " L".join(f"{px(y):.0f},{py(v):.0f}" for y, v in pts)
    s.path(d, stroke=C["teal"], sw=6, head=False)
    for y, v in pts:
        s.add(f'<circle cx="{px(y):.0f}" cy="{py(v):.0f}" r="10" fill="#147C80"/>')
        s.text(px(y), Y0 + 40, str(y), size=26, fill=C["muted"], anchor="middle", family=SERIF)
    s.text(X0, 70, "বৈশ্বিক সামুদ্রিক-আর্চিন আহরণ (×১০⁴ টন)", size=30, weight=700, fill=C["hnavy"])
    seq = [("জাপান: পতন ~১৯৬০", ""), ("কোরিয়া", ""), ("ওয়াশিংটন-অরেগন ১৯৭১", ""), ("বাহা ও ক্যালিফোর্নিয়া ১৯৭২–৭৩", ""),
           ("চিলি ১৯৭৫", ""), ("আলাস্কা ও ব্রিটিশ কলাম্বিয়া ১৯৮০", ""), ("রাশিয়া ১৯৮২", ""), ("উ.-প. আটলান্টিক ১৯৮৭–৮৯", "")]
    s.text(1100, 70, "ক্রমিক বিস্তার (পাঠ্য অনুযায়ী)", size=30, weight=700, fill=C["hnavy"])
    for i, (t, _) in enumerate(seq):
        y = 130 + i * 62
        s.add(f'<circle cx="1120" cy="{y-9}" r="14" fill="#D8A34A"/>')
        s.text(1120, y - 1, str(i + 1), size=20, weight=700, fill="#3b2a06", anchor="middle", family=SERIF)
        s.text(1150, y, t, size=28)
        if i < 7:
            s.line(1120, y + 8, 1120, y + 38, sw=3, stroke=C["ochre"])
    s.text(1595, 750, "তথ্য: Berkes & Franz (2025) Fig.5.1b; মূল উৎস Andrew et al. 2002। ১৯৯৫-এর বিন্দু বনাম পাঠ্যের 'শীর্ষ ~১৯৯০' লক্ষ করুন।", size=24, fill=C["muted"], anchor="end", family=SERIF)
    s.save(path, "রোভিং ব্যান্ডিট: সামুদ্রিক আর্চিন", "রেখাচিত্রে ১৯৪৫ থেকে ১৯৯৫ পর্যন্ত বৈশ্বিক আর্চিন আহরণ এবং ডানে আট ধাপে ভৌগোলিক বিস্তারের ক্রম।")


def fig_w07_compare(path):
    s = SVG(1615, 1060, bg="#FFFFFF")
    L, R, w = 40, 830, 745
    s.rect(L, 30, w, 90, fill=C["terra"], rx=12); s.text(L + w / 2, 88, "চিলিকা, ভারত: decommonisation", size=36, weight=700, fill="#fff", anchor="middle")
    s.rect(R, 30, w, 90, fill=C["leaf"], rx=12); s.text(R + w / 2, 88, "উ.-প. শ্রীলঙ্কা: commonisation", size=36, weight=700, fill="#fff", anchor="middle")
    rows = [("কোন 'কমন্স'?", "লেগুনের প্রথাগত আহরণ-মৎস্যক্ষেত্র", "তিন লেগুন + ডাচ খাল: যৌথ পানির উৎস"),
            ("কারা ব্যবহারকারী?", "জাত-ভিত্তিক জেলে বনাম অ-জেলে উচ্চবর্ণ", "~৬০০ ছোট পারিবারিক চিংড়ি-খামার"),
            ("চালক", "বৈশ্বিক চিংড়ি-দাম; রাষ্ট্রীয় নীতি", "রোগ-বিপর্যয় ১৯৮৮–৯৮; বড় কোম্পানি দেউলিয়া"),
            ("প্রতিষ্ঠান", "সমবায় অচল; CDA, FISHFED কেন্দ্রীভূত", "সমিতি ×১৮ → জোন ×৫ → SLADA + NAQDA"),
            ("মূল নিয়ম", "লিজ-ফি +২৭%; ১৯৯১ নীতি", "জোনাল ক্রপ-ক্যালেন্ডার: কখন পানি নেওয়া/ছাড়া"),
            ("সাফল্য-প্রমাণ", "আয়, সমবায়, এলাকা-দখলের তথ্য", "জাতীয় উৎপাদন-বৃদ্ধি (সমষ্টিগত সূচক)")]
    for i, (lab, a, b) in enumerate(rows):
        y = 150 + i * 118
        s.rect(L, y, 1575 - L + 0, 100, fill="#F4F9F8" if i % 2 == 0 else "#fff", rx=8)
        s.text(807, y + 36, lab, size=28, weight=700, fill=C["muted"], anchor="middle")
        s.text(L + 20, y + 80, a, size=29)
        s.text(R + 20, y + 80, b, size=29)
    yb = 870
    s.rect(L, yb, 1535, 170, fill="#FBF4E6", stroke=C["ochre"], sw=3, rx=12)
    s.text(L + 22, yb + 48, "নকশা-সতর্কতা (Methods বিভাগ অনুযায়ী)", size=32, weight=700, fill="#8a5d0c")
    s.text(L + 22, yb + 98, "কেস দুটি বাছাই হয়েছে 'তথ্য-সংগ্রহ পদ্ধতির সামঞ্জস্য ও কাছাকাছি সময়কাল (২০০৭–২০১৪)' কারণে, ফল মিলিয়ে নয়।", size=29)
    s.text(L + 22, yb + 142, "তুলনাটি ব্যাখ্যামূলক বৈপরীত্য; একটি একক চলক বদলে কারণ নির্ণয়ের নিয়ন্ত্রিত তুলনা নয়।", size=29)
    s.save(path, "চিলিকা বনাম শ্রীলঙ্কা", "দুই কলামের তুলনা: কমন্সের ধরন, ব্যবহারকারী, চালক, প্রতিষ্ঠান, নিয়ম ও সাফল্যের প্রমাণ; নিচে নকশা-সতর্কতা।")


def fig_srilanka_dilemma(path):
    s = SVG(1615, 620, bg="#FFFFFF")
    s.rect(40, 40, 700, 520, fill="#F8ECE7", stroke=C["terra"], sw=3, rx=14)
    s.text(70, 95, "সমন্বয়হীন হলে", size=36, weight=700, fill=C["terra"])
    s.lines(70, 160, ["খামার A-তে রোগ ধরা পড়ল", "→ ব্যক্তিগতভাবে যুক্তিসঙ্গত: আগে ধরে বেচা", "  ও সংক্রমিত পানি খালে ছেড়ে দেওয়া", "→ যৌথ পানিতে WSSV ছড়ায়", "→ B, C, D খামারের ফসল নষ্ট", "= বিয়োজ্যতা-সমস্যা: একজনের ব্যবহার", "  অন্যদের পানির 'গুণ' কমায়"], size=30, lh=1.5)
    s.rect(875, 40, 700, 520, fill="#EDF3EE", stroke=C["leaf"], sw=3, rx=14)
    s.text(905, 95, "ক্রপ-ক্যালেন্ডার দিয়ে", size=36, weight=700, fill=C["leaf"])
    s.lines(905, 160, ["৫ জোন, ৩২ উপ-জোন; বার্ষিক সূচি", "→ কোন জোন কখন পানি নেবে/ছাড়বে", "→ সংক্রমিত পানি ছাড়া নিষেধ", "→ সমিতি + সম্প্রসারণ কর্মকর্তা নজরদারি", "→ সদস্যপদে প্রণোদনা: ল্যাব-পরীক্ষা,", "  ক্ষতিপূরণ, জীবাণুনাশকে ভর্তুকি", "= বর্জন ও বিয়োজ্যতার প্রাতিষ্ঠানিক সমাধান"], size=30, lh=1.5)
    s.line(745, 300, 870, 300, sw=6, stroke=C["teal"])
    s.text(1595, 605, "উৎস: Galappaththi & Nayak (2017), Results ও Table 3; Berkes & Franz (2025) ch.3 Box। মৌলিক চিত্র।", size=24, fill=C["muted"], anchor="end", family=SERIF)
    s.save(path, "শ্রীলঙ্কার চিংড়ি-দ্বিধা", "বাঁদিকে সমন্বয়হীন অবস্থায় রোগ ছড়ানোর ধাপ, ডানদিকে জোনাল ক্রপ-ক্যালেন্ডারে প্রাতিষ্ঠানিক সমাধান।")


def fig_source_graph(path):
    s = SVG(1615, 980, bg="#FFFFFF")
    nodes = {"W01": (180, 160, "Ostrom 1990", C["hnavy"]), "W02": (180, 420, "Ostrom et al. 1999", C["hnavy"]),
             "W03": (520, 160, "Ostrom 2007", C["hnavy"]), "W04": (520, 420, "Ostrom 2009", C["hnavy"]),
             "W05": (860, 290, "Agrawal et al. 2023", C["river"]), "W06": (520, 720, "Nayak & Berkes 2011", C["teal"]),
             "W07": (860, 720, "Galappaththi & Nayak 2017", C["teal"]), "W08": (1200, 560, "Nayak (সম্পা.) 2021", C["teal"]),
             "W09": (1200, 820, "Nayak & Berkes 2022", C["teal"]), "W10": (1420, 290, "Berkes & Franz 2025", C["leaf"])}
    edges = [("W01", "W02", "solid", "নকশা-নীতি"), ("W01", "W06", "solid", "নকশা-নীতি"), ("W02", "W06", "solid", "CPR সংজ্ঞা"),
             ("W03", "W04", "solid", "Table 1 অভিযোজিত"), ("W06", "W07", "solid", "সংজ্ঞা"), ("W06", "W09", "solid", "মূল প্রবন্ধ"),
             ("W08", "W09", "solid", "কেস-ভিত্তি"), ("W09", "W10", "solid", "Fig 5.2"), ("W03", "W10", "solid", "উদ্ধৃতি"),
             ("W02", "W10", "solid", "CPR সংজ্ঞা"), ("W04", "W05", "solid", "SES"), ("W05", "W09", "dashed", "স্থিতি বনাম গতিশীলতা")]
    for a, b, k, lab in edges:
        x1, y1 = nodes[a][:2]; x2, y2 = nodes[b][:2]
        s.line(x1, y1, x2, y2, sw=3, stroke="#7e98a6", kind=k, head=True)
        s.text((x1 + x2) / 2, (y1 + y2) / 2 - 10, lab, size=24, fill=C["muted"], anchor="middle")
    for k, (x, y, lab, col) in nodes.items():
        s.rect(x - 150, y - 50, 300, 100, fill="#fff", stroke=col, sw=4, rx=16)
        s.text(x, y - 8, k, size=32, weight=700, fill=col, anchor="middle", family=SERIF)
        s.text(x, y + 32, lab, size=25, anchor="middle", family=SERIF)
    s.text(40, 950, "নিরেট তীর = লক্ষ্য-পাঠ উৎস-পাঠটিকে স্পষ্টভাবে উদ্ধৃত/অভিযোজিত করেছে (যাচাইকৃত উদ্ধৃতি)। ড্যাশ = আমাদের প্রস্তাবিত ধারণাগত সংলাপ, উদ্ধৃতি নয়।", size=25, fill=C["muted"])
    s.save(path, "দশ পাঠের উৎস-সংযোগ মানচিত্র", "দশটি পাঠের নোড ও তাদের মধ্যে যাচাইকৃত উদ্ধৃতি-সংযোগ (নিরেট) ও প্রস্তাবিত ধারণাগত সংযোগ (ড্যাশ)।")


def fig_bridge(path):
    s = SVG(1615, 1200, bg="#FFFFFF")
    s.rect(20, 20, 1575, 480, fill="#EFF6F8", stroke=C["river"], sw=2, rx=16)
    s.text(45, 70, "জৈব-প্রতিবেশ স্তর (biophysical layer)", size=32, weight=700, fill=C["river"])
    s.rect(20, 530, 1575, 420, fill="#F7F4EC", stroke=C["ochre"], sw=2, rx=16)
    s.text(45, 580, "সামাজিক-প্রাতিষ্ঠানিক স্তর (governance layer)", size=32, weight=700, fill="#8a5d0c")
    def n(x, y, t1, t2, col):
        s.rect(x, y, 300, 120, fill="#fff", stroke=col, sw=4, rx=14)
        s.text(x + 150, y + 52, t1, size=30, weight=700, fill=col, anchor="middle")
        s.text(x + 150, y + 92, t2, size=25, fill=C["muted"], anchor="middle")
    n(60, 120, "পানির অবস্থা", "তাপ, DO, লবণাক্ততা, দূষক", C["river"])
    n(470, 120, "মাছের শারীরবৃত্ত", "স্ট্রেস-সূচক, কর্টিসল", C["teal"])
    n(880, 120, "অন্ত্রের জীবাণুসমষ্টি", "16S rRNA গঠন", C["teal"])
    n(1250, 120, "পরিযান/জনসংখ্যা", "রিক্রুটমেন্ট, প্রাচুর্য", C["leaf"])
    n(470, 330, "পানির জীবাণুসমষ্টি", "পরিবেশগত 16S", C["river"])
    n(60, 640, "জলমহাল-লিজ", "কে, কখন, কোথায়", "#8a5d0c")
    n(470, 640, "নিষেধাজ্ঞা ও অভয়াশ্রম", "নিয়ম + প্রয়োগ", "#8a5d0c")
    n(880, 640, "আহরণ-চাপ", "জাল, প্রচেষ্টা, CPUE", C["terra"])
    n(1250, 640, "জীবিকা ও সমতা", "আয়, প্রবেশাধিকার", C["terra"])
    s.line(360, 180, 465, 180, kind="dashed", sw=4)
    s.path("M770,200 C820,230 830,230 875,200", kind="dashed", sw=4)
    s.path("M875,165 C830,135 820,135 770,165", kind="dotted", sw=4)
    s.line(620, 325, 620, 245, kind="dotted", sw=4)
    s.path("M770,380 C900,370 990,300 1030,245", kind="dotted", sw=4)
    s.line(1180, 180, 1245, 180, kind="dashed", sw=4)
    s.line(360, 700, 465, 700, kind="solid", sw=4)
    s.line(770, 700, 875, 700, kind="dashed", sw=4)
    s.path("M1030,640 C1080,560 1300,420 1380,245", kind="solid", sw=4)
    s.path("M1400,245 C1450,420 1430,560 1400,635", kind="dashed", sw=4)
    s.line(1180, 700, 1245, 700, kind="dashed", sw=4)
    s.text(1560, 520, "নিরেট তীর: আহরণ মৃত্যুহার বাড়ায় (প্রতিষ্ঠিত মৎস্য-বিজ্ঞান)", size=24, fill=C["muted"], anchor="end")
    legend_arrows(s, 60, 1000, size=28)
    s.text(1595, 1185, "সম্পূর্ণ কাল্পনিক শিক্ষণ-চিত্র। ইলিশ-নির্দিষ্ট কোনো সম্পর্ক পরিমাপিত নয়; প্রতিটি তীর পরীক্ষাযোগ্য প্রশ্ন।", size=25, fill=C["terra"], anchor="end", weight=700)
    s.save(path, "গবেষণা-সেতু: অনুমিত পথ", "দুই স্তরের নেটওয়ার্ক: উপরে পানির অবস্থা, মাছের শারীরবৃত্ত, অন্ত্রের ও পানির জীবাণুসমষ্টি, পরিযান; নিচে লিজ, নিষেধাজ্ঞা, আহরণ-চাপ, জীবিকা। বেশিরভাগ তীর ড্যাশ বা বিন্দু, অর্থাৎ অনুমিত বা অনিশ্চিত।")


def fig_p01_check(path):
    s = SVG(1615, 700, bg="#FFFFFF")
    rows = [("নমুনা-সংখ্যা", "পদ্ধতি: প্রতিটি স্থানে ৬০", "ফলাফল: প্রতিটি স্থানে ৩০ (মোট ৯০)"),
            ("টিস্যু", "সংরক্ষণ: পাখনা, ইথানলে", "DNA: 'muscle tissue' থেকে"),
            ("হ্যাপ্লোটাইপ", "মাত্র ৩টি হ্যাপ্লোটাইপ", "Hd = 1.000 ('প্রতিটি নমুনা অনন্য')"),
            ("বৈচিত্র্য-মান", "π প্রতি-সাইট অনুপাত (সাধারণত <০.০৫)", "রিপোর্ট: PiJC = 2.50198"),
            ("পৃথকীকরণ", "FST জনগোষ্ঠী-স্তরের পরিমাপ", "তুলনা: একক GenBank অ্যাক্সেশনের সঙ্গে"),
            ("রেফারেন্স (নমুনা ৪টি DOI)", "১টি মিলেছে (Sultana et al. 2022)", "৩টি সম্পূর্ণ ভিন্ন প্রবন্ধে যায়")]
    s.rect(20, 20, 1575, 80, fill=C["hnavy"], rx=10)
    for x, t in ((40, "যাচাই-বিন্দু"), (450, "এক জায়গায় যা লেখা"), (1030, "অন্য জায়গায় যা লেখা")):
        s.text(x, 72, t, size=31, weight=700, fill="#fff")
    for i, (a, b, c) in enumerate(rows):
        y = 110 + i * 90
        s.rect(20, y, 1575, 82, fill="#F8ECE7" if i % 2 == 0 else "#fff", rx=6)
        s.text(40, y + 52, a, size=29, weight=700, fill=C["hnavy"])
        s.text(450, y + 52, b, size=28)
        s.text(1030, y + 52, c, size=28, fill=C["terra"])
    s.text(1595, 690, "উৎস: Sunny et al. (2025) EJABF 29(1):1089–1105 পূর্ণপাঠ; DOI যাচাই Crossref API, ৬ নভেম্বর ২০২৬", size=24, fill=C["muted"], anchor="end", family=SERIF)
    s.save(path, "P01 অভ্যন্তরীণ সামঞ্জস্য-পরীক্ষা", "ছয়টি যাচাই-বিন্দুতে প্রবন্ধের ভেতরের অসামঞ্জস্য ও রেফারেন্স-যাচাইয়ের ফল।")


ALL = {"fig_0_1_start_here": fig_start_here, "fig_2_1_bundle_rights": fig_bundle, "fig_2_2_rule_levels": fig_rule_levels,
       "fig_3_1_hardin_matrix": fig_hardin_matrix, "fig_4_1_ses_framework": fig_ses, "fig_4_2_ten_variables": fig_ten_vars,
       "fig_5_1_continuum": fig_continuum, "fig_5_2_chilika_timeline": fig_chilika_timeline, "fig_6_1_inference_ladder": fig_inference_ladder,
       "fig_8_1_nepal_irrigation": fig_w02_irrigation, "fig_16_1_urchin": fig_urchin, "fig_13_1_compare": fig_w07_compare,
       "fig_13_2_srilanka_dilemma": fig_srilanka_dilemma, "fig_17_1_source_graph": fig_source_graph, "fig_18_1_bridge": fig_bridge,
       "fig_18_2_p01_check": fig_p01_check}

if __name__ == "__main__":
    import sys, os
    for k, fn in ALL.items():
        fn(os.path.join(sys.argv[1], k + ".svg"))
