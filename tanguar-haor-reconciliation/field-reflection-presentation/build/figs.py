import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle
import matplotlib.lines as mlines
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fig")
os.makedirs(OUT, exist_ok=True)

INK   = "#16323F"
SLATE = "#4A6572"
TEAL  = "#2E7D8C"
OCHRE = "#C0782B"
RUST  = "#9C4A2F"
GREEN = "#4E7A4A"
PAPER = "#FBFAF7"
GRID  = "#D8D4CC"

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 10,
    "axes.edgecolor": GRID,
    "text.color": INK,
    "axes.labelcolor": INK,
    "xtick.color": SLATE,
    "ytick.color": SLATE,
    "savefig.facecolor": PAPER,
    "figure.facecolor": PAPER,
    "axes.facecolor": PAPER,
})

def save(fig, name):
    fig.savefig(os.path.join(OUT, name), dpi=220, bbox_inches="tight",
                facecolor=PAPER, edgecolor="none")
    plt.close(fig)
    print("wrote", name)

LEGEND = [
    mlines.Line2D([], [], color=INK, ls="-",  lw=2, label="documented / reported in a source"),
    mlines.Line2D([], [], color=INK, ls="--", lw=2, label="inferred by the group"),
    mlines.Line2D([], [], color=INK, ls=":",  lw=2, label="hypothetical, not evidenced"),
]

# ---------------------------------------------------------------- F1 calendar
def f1():
    fig, ax = plt.subplots(figsize=(11.6, 4.8))
    months = ["Baishakh","Joishtho","Asharh","Srabon","Bhadro","Ashwin",
              "Kartik","Ogrohayon","Poush","Magh","Falgun","Chaitra"]
    greg   = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"]
    rows = [
        ("Water on the haor",       [(0,1,"rising",TEAL,0.25,0),(1,5,"deep water",TEAL,0.55,0),
                                     (6,3,"receding",TEAL,0.30,0),(9,3,"dry / crop field",OCHRE,0.22,0)]),
        ("Fishing ban",             [(1,3,"three months, all areas",RUST,0.40,0)]),
        ("Society lease window",    [(9,3,"three-month access",GREEN,0.40,0)]),
        ("Embankment closed",       [(11,1,"field dries",RUST,0.35,1)]),
        ("Embankment breaches",     [(9,2,"water and spawning return",TEAL,0.30,0)]),
        ("Tourist boats",           [(6,5,"dry-season visitors",OCHRE,0.35,0)]),
        ("Labour migration",        [(3,4,"earth-cutting, farm labour",SLATE,0.22,0)]),
    ]
    h = 0.60
    for i,(label, bars) in enumerate(reversed(rows)):
        y = i*1.0
        ax.text(-0.3, y+h/2, label, ha="right", va="center", fontsize=10, color=INK)
        for (x0, w, txt, c, a, above) in bars:
            ax.add_patch(Rectangle((x0, y), w, h, facecolor=c, alpha=a,
                                   edgecolor=c, linewidth=1.1))
            if above:
                ax.text(x0+w/2, y+h+0.10, txt, ha="center", va="bottom",
                        fontsize=8.2, color=INK)
            else:
                ax.text(x0+w/2, y+h/2, txt, ha="center", va="center",
                        fontsize=8.4, color=INK)
    for x in range(13):
        ax.plot([x,x],[-0.10, len(rows)-0.25], color=GRID, lw=0.7, zorder=0)
    ax.set_xlim(-3.4, 12.05); ax.set_ylim(-0.35, len(rows)-0.20)
    ax.set_xticks([x+0.5 for x in range(12)])
    ax.set_xticklabels([f"{m}\n{g}" for m,g in zip(months,greg)], fontsize=8)
    ax.set_yticks([])
    for s in ("left","right","top"): ax.spines[s].set_visible(False)
    ax.spines["bottom"].set_bounds(0,12)
    ax.set_title("One year on the haor, as described to us: the same place is several resources in turn",
                 fontsize=11.8, color=INK, pad=14, loc="left")
    fig.text(0.013, -0.015, "All bands are as reported by participants in the Joypur community interview and the CNRS "
                            "key-informant notes. Month edges are approximate, not measured.",
             fontsize=8.0, color=SLATE)
    save(fig, "f1_calendar.png")

# ------------------------------------------------------------- F2 embankment
def f2():
    fig, ax = plt.subplots(figsize=(10.6, 4.4))
    ax.axis("off")
    def box(x,y,w,h,title,lines,c,ls="-"):
        ax.add_patch(FancyBboxPatch((x,y),w,h, boxstyle="round,pad=0.016,rounding_size=0.02",
                     facecolor="white", edgecolor=c, linewidth=1.6, linestyle=ls))
        ax.text(x+0.022, y+h-0.055, title, fontsize=10.4, color=c, weight="bold", va="top")
        ax.text(x+0.022, y+h-0.135, "\n".join(lines), fontsize=8.9, color=INK, va="top")
    ax.text(0.0, 0.955, "The embankment: the community describes it working and failing at the same time",
            fontsize=11.8, color=INK, weight="bold")
    ax.text(0.0, 0.905, "One structure, asked for by the village, with effects that separate by season and by who is counting.",
            fontsize=9, color=SLATE)
    box(0.0,  0.47, 0.465, 0.38, "What it does for the crop",
        ["The village asked for it; CBRMP built it (00:45:12)", "Ten to twelve years of harvests credited to it",
         "Early flood water no longer reaches the homesteads", "Trees planted on it to break the waves"],
        GREEN)
    box(0.535,0.47, 0.465, 0.38, "What it does for the fish",
        ["Closed in Chaitra, the field dries out", "Participants said fish cannot survive the drying",
         "When it breaks in Magh or Falgun, water returns", "and fish are reported to spawn again"],
        RUST)
    box(0.0,  0.045,0.465, 0.355, "What it may do to the haor",
        ["Silt reported to settle behind it", "\"the kanda is thin now; two or four more cuts",
         "and all of it becomes a mound\" (00:45:44, translated)", "Our reading: protection shifts the problem in time"],
        OCHRE, ls="--")
    box(0.535,0.045,0.465, 0.355, "What the community says about the future",
        ["\"right now we are surviving, that is fine,", " but for the future...\"",
         "Joypur interview, 00:45:44, translated from Bengali", "The trade-off is named by them, not by us"],
        TEAL)
    for (x0,y0,x1,y1) in [(0.465,0.66,0.535,0.66),(0.2325,0.47,0.2325,0.40),(0.7675,0.47,0.7675,0.40)]:
        ax.add_patch(FancyArrowPatch((x0,y0),(x1,y1), arrowstyle="-|>", mutation_scale=13,
                     color=SLATE, lw=1.2, shrinkA=2, shrinkB=2))
    ax.legend(handles=LEGEND, loc="lower center", bbox_to_anchor=(0.5,-0.055),
              ncol=3, frameon=False, fontsize=8)
    ax.set_xlim(-0.02,1.02); ax.set_ylim(-0.055,1.0)
    save(fig, "f2_embankment.png")

# ------------------------------------------------------------------ F3 scale
def f3():
    fig, ax = plt.subplots(figsize=(10.8, 5.0))
    ax.axis("off")
    levels = [
        ("Meghalaya, upstream",  "Coal and limestone extraction; erosion in heavy rain.\nCNRS: sand and silt move down into the haor in the monsoon.", 0.80, RUST),
        ("Tanguar Haor",         "Depth and connectivity reported falling. \"the haor is rising up\" (silting).\nBig boats can no longer reach where they once did.", 0.605, TEAL),
        ("Village and society",  "41 societies; 82 villages by the community's count, 77 or 88 by CNRS.\nDestructive gear users named as local, not outsiders.", 0.41, GREEN),
        ("Upazila and district", "UNO, ACLand, Fisheries drives. Of about 50 short machines, two reported caught.\nTahirpur offers first aid; childbirth means going to Sunamganj.", 0.215, OCHRE),
        ("Dhaka and national",   "Land ownership sits with one ministry, custodianship with another (CNRS).\nTourism investment described in the lecture as coming from Dhaka.", 0.02, SLATE),
    ]
    for name, body, y, c in levels:
        ax.add_patch(FancyBboxPatch((0.14, y), 0.845, 0.155,
                     boxstyle="round,pad=0.012,rounding_size=0.018",
                     facecolor="white", edgecolor=c, linewidth=1.5))
        ax.text(0.158, y+0.112, name, fontsize=10.3, color=c, weight="bold", va="center")
        ax.text(0.158, y+0.048, body, fontsize=8.7, color=INK, va="center")
    ax.add_patch(FancyArrowPatch((0.075, 0.955),(0.075, 0.015), arrowstyle="-|>",
                 mutation_scale=16, color=SLATE, lw=1.6))
    ax.text(0.052, 0.49, "one scale, five levels", fontsize=9.6, color=SLATE,
            rotation=90, ha="center", va="center")
    ax.text(0.14, 0.985, "A local problem with a scale dimension",
            fontsize=11.8, color=INK, weight="bold", va="bottom")
    ax.text(0.14, -0.075, "\"what we might think is a local problem is actually an interconnected problem\"  "
                          "- Prof. Prateep Nayak, lecture 00:14:27",
            fontsize=8.4, color=SLATE, style="italic")
    ax.set_xlim(0.0,1.0); ax.set_ylim(-0.12,1.03)
    save(fig, "f3_scale.png")

# --------------------------------------------------- F4 infrastructure vs use
def f4():
    fig, ax = plt.subplots(figsize=(11.4, 4.4))
    ax.axis("off")
    ax.text(0.0, 0.965, "Provision is not the same as use: four services as described to us",
            fontsize=11.8, color=INK, weight="bold")
    rows = [
        ("Drinking\nwater",
         "Three tubewells reported out of\norder; one submersible serves\nthe kanda, 20 taka a month",
         "Piped water for drinking and cooking,\nnot bathing. River water preferred:\n\"the tubewell water has no taste\"",
         "Is the water people actually\ndrink safe? We did not test it,\nand nobody we met had"),
        ("Primary\nschooling",
         "One school, reached by\ncrossing three rivers",
         "Distance unresolved: the direct\ninterview says about 1 km, twice;\nour group discussion said 4 km",
         "A madrasa was set up locally.\nProf. Nayak read it as possible\nself-organization, not as a system"),
        ("Health\ncare",
         "Tahirpur described as first\naid only; Sunamganj for\nchildbirth",
         "\"in the monsoon it is death\" - travel\nby hand-rowed boat. A maternal death\nin transport is a second-hand account",
         "Paracetamol and antacid at\nhome. When illness stops\nmovement, income stops too"),
        ("Shelter",
         "Tin houses; one brick house\nwith a tin roof observed",
         "No windbreak: wind comes off\nthe hills across open water\nonto the kanda and lifts the roofs",
         "The only possible storm shelter is\nthe school across three rivers. Stored\nrice read by us as preparing for scarcity"),
    ]
    heads = ["Service", "What exists", "What people reported doing", "What stays open"]
    xs = [0.0, 0.125, 0.395, 0.695]
    for x, hd in zip(xs, heads):
        ax.text(x+0.006, 0.895, hd.upper(), fontsize=8.4, color=TEAL, weight="bold")
    ax.plot([0,1],[0.878,0.878], color=TEAL, lw=1.2)
    y = 0.855
    for r in rows:
        for x, cell in zip(xs[1:], r[1:]):
            ax.text(x+0.006, y-0.018, cell, fontsize=8.2, color=INK, va="top", linespacing=1.5)
        ax.text(xs[0]+0.006, y-0.018, r[0], fontsize=9.3, color=INK, weight="bold",
                va="top", linespacing=1.3)
        y -= 0.188
        ax.plot([0,1],[y+0.018,y+0.018], color=GRID, lw=0.8)
    ax.text(0.0, y-0.025, "Sources: Joypur community interview (time-coded) and our own group discussion. "
                          "Nothing in the third or fourth column was measured by us.",
            fontsize=7.9, color=SLATE)
    ax.set_xlim(-0.01,1.01); ax.set_ylim(y-0.075,1.0)
    save(fig, "f4_services.png")

# ------------------------------------------------------------- F5 responses
def f5():
    import textwrap
    fig, ax = plt.subplots(figsize=(11.0, 4.3))
    ax.axis("off")
    ax.text(0.0, 0.975, "Who is responding, and how visible is it?",
            fontsize=11.8, color=INK, weight="bold")
    cols = [
        ("Community", GREEN, [
            "41 societies registered to hold the lease",
            "Disputes settled by matbor and elders, not by the society",
            "A madrasa established locally",
            "Representatives bring in gear offenders",
            "Three villages said to run a lottery for tourist-boat turns",
        ]),
        ("Government", OCHRE, [
            "Three-month ban, reported as everywhere",
            "ACLand and UNO announce it; notice, not reasons",
            "Fisher cards, free, through the society",
            "Ban rice given \"once, maybe two years\"",
            "Family card: \"not one person here has got it\"",
        ]),
        ("Civil society and projects", TEAL, [
            "CBSMTHP 2006-2018, in four phases",
            "USAID-funded activity ended March 2024",
            "Now: baseline, fish-catch monitoring, tourism carrying capacity",
            "Re-excavation and a fish pass planned",
            "Alternative income for about 400 households",
        ]),
    ]
    W = 0.313
    for i,(name,c,items) in enumerate(cols):
        x = i*0.3435
        ax.add_patch(FancyBboxPatch((x, 0.155), W, 0.72,
                     boxstyle="round,pad=0.012,rounding_size=0.018",
                     facecolor="white", edgecolor=c, linewidth=1.5))
        ax.text(x+0.016, 0.825, name, fontsize=10.4, color=c, weight="bold", va="center")
        yy = 0.755
        for it in items:
            w = textwrap.fill(it, 37, subsequent_indent="   ")
            ax.text(x+0.016, yy, "-  " + w, fontsize=8.3, color=INK, va="top", linespacing=1.4)
            yy -= 0.066 + 0.052*w.count("\n")
    ax.text(0.0, 0.085, "Everything here is a reported strategy, not an assessed outcome. Figures such as 41 societies, "
                        "82 villages and the 24/76 revenue split",
            fontsize=8.0, color=SLATE)
    ax.text(0.0, 0.025, "are participant reports, not audited accounts.", fontsize=8.0, color=SLATE)
    ax.set_xlim(-0.025,1.035); ax.set_ylim(-0.01,1.0)
    save(fig, "f5_responses.png")

# ---------------------------------------------------------------- F6 V2V
def f6():
    import textwrap
    fig, ax = plt.subplots(figsize=(11.0, 4.4))
    ax.axis("off")
    ax.text(0.0, 0.975, "Coping, adapting, or transitioning? Where our evidence actually sits",
            fontsize=11.8, color=INK, weight="bold")
    steps = [
        ("Coping", GREEN, "-",
         ["Rice stored in fish-feed sacks",
          "Potatoes when fish are scarce",
          "Paracetamol and antacid at home",
          "Selling to the nekari in the village",
          "Moving to Netrokona in the 2022 flood"],
         "Well evidenced"),
        ("Adaptive response", OCHRE, "-",
         ["Small-boat hire, 20 to 50 taka a head",
          "Lease, then paddy, then other work",
          "Seasonal labour to Tangail and Sylhet",
          "A locally established madrasa",
          "NGO loans taken in women's names"],
         "Evidenced, durability unknown"),
        ("Viable transition", TEAL, "--",
         ["Would need income across the year",
          "Would need the fish stock to recover",
          "Would need the card to reach the person",
          "We saw none of this established",
          "Boatman: \"no, it does not last the year\""],
         "Not established by our evidence"),
    ]
    W = 0.313
    for i,(name, c, ls, items, verdict) in enumerate(steps):
        x = i*0.3435
        ax.add_patch(FancyBboxPatch((x, 0.235), W, 0.645,
                     boxstyle="round,pad=0.012,rounding_size=0.018",
                     facecolor="white", edgecolor=c, linewidth=1.7, linestyle=ls))
        ax.text(x+0.016, 0.835, name, fontsize=10.6, color=c, weight="bold", va="center")
        yy = 0.755
        for it in items:
            wrapped = textwrap.fill(it, 38)
            ax.text(x+0.016, yy, "-  " + wrapped, fontsize=8.3, color=INK, va="top",
                    linespacing=1.4)
            yy -= 0.062 + 0.050*wrapped.count("\n")
        ax.text(x+W/2, 0.272, verdict, fontsize=8.4, color=c, ha="center", style="italic")
    for x0 in (0.3135, 0.6575):
        ax.add_patch(FancyArrowPatch((x0,0.56),(x0+0.0285,0.56), arrowstyle="-|>",
                     mutation_scale=13, color=SLATE, lw=1.3))
    ax.text(0.0, 0.145, "The three columns are a reading of our own material against the vulnerability-to-viability framing,",
            fontsize=8.1, color=SLATE)
    ax.text(0.0, 0.095, "not a measured trajectory. Nothing we gathered lets us say a transition has happened.",
            fontsize=8.1, color=SLATE)
    ax.legend(handles=LEGEND, loc="lower right", bbox_to_anchor=(1.0,-0.045),
              ncol=3, frameon=False, fontsize=7.8)
    ax.set_xlim(-0.025,1.035); ax.set_ylim(-0.02,1.0)
    save(fig, "f6_v2v.png")

# ------------------------------------------------------------- F7 questions
def f7():
    fig, ax = plt.subplots(figsize=(10.8, 4.3))
    ax.axis("off")
    ax.text(0.0, 0.965, "Four questions we can now ask better than we could on 6 November",
            fontsize=11.8, color=INK, weight="bold")
    qs = [
        ("For whom, and in which season?", TEAL,
         "The embankment protects the crop and is said to\n"
         "dry the fish out. Who gains in Chaitra, who loses,\n"
         "and does anyone hold both accounts at once when\n"
         "the decision is taken?"),
        ("At which level does the fix belong?", OCHRE,
         "If silt comes from Meghalaya and investment comes\n"
         "from Dhaka, what can a village society actually\n"
         "decide? Where is the mismatch between the scale of\n"
         "the problem and the scale of the response?"),
        ("Why is the destructive gear local?", GREEN,
         "Participants named their neighbours, not outsiders,\n"
         "and disagreed about which gear destroys. What makes\n"
         "a gear worth using when the user expects to fish\n"
         "here again next year?"),
        ("What would count as a transition?", RUST,
         "We can describe coping in detail. We cannot say\n"
         "whether anything has shifted. What would we have to\n"
         "measure, and over how long, before we were entitled\n"
         "to use the word?"),
    ]
    for i,(q,c,body) in enumerate(qs):
        col, row = i%2, i//2
        x = 0.0 + col*0.515
        y = 0.455 - row*0.445
        ax.add_patch(FancyBboxPatch((x, y), 0.485, 0.355,
                     boxstyle="round,pad=0.014,rounding_size=0.02",
                     facecolor="white", edgecolor=c, linewidth=1.6))
        ax.text(x+0.022, y+0.293, q, fontsize=10.3, color=c, weight="bold", va="center")
        ax.text(x+0.022, y+0.225, body, fontsize=8.5, color=INK, va="top", linespacing=1.45)
    ax.set_xlim(-0.02,1.02); ax.set_ylim(-0.02,1.0)
    save(fig, "f7_questions.png")

for fn in (f1,f2,f3,f4,f5,f6,f7):
    fn()
