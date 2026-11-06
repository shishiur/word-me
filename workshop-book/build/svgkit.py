"""Small SVG toolkit for the study book's instructional diagrams.
Units: 10 SVG units = 1 mm at full text-column width (161.5 mm -> 1615 units).
Text sizes: 32 u ~ 9 pt (minimum for labels), 36 u ~ 10 pt, 42 u ~ 12 pt.
"""
from xml.sax.saxutils import escape

C = dict(navy="#12334B", hnavy="#103553", teal="#147C80", river="#4D94B5", leaf="#4E7960",
         ochre="#D8A34A", terra="#B6684F", ivory="#FAF8F2", mist="#EBF5F3", ul="#B3DCEB",
         ink="#1B232B", muted="#55636E", rule="#C9D6DC", white="#FFFFFF")
SANS = "Noto Sans Bengali, Tinos, sans-serif"
SERIF = "Tinos, Noto Serif Bengali, serif"


class SVG:
    def __init__(self, w, h, bg=None):
        self.w, self.h = w, h
        self.parts = []
        self.defs = [ARROW_DEFS]
        if bg:
            self.rect(0, 0, w, h, fill=bg, rx=0)

    def add(self, s):
        self.parts.append(s)

    def rect(self, x, y, w, h, fill="none", stroke="none", sw=0, rx=10, dash=None, opacity=1):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" '
                 f'stroke="{stroke}" stroke-width="{sw}" opacity="{opacity}"{d}/>')

    def text(self, x, y, s, size=34, fill=C["ink"], weight=400, anchor="start", family=SANS, italic=False, ls=0):
        st = ' font-style="italic"' if italic else ""
        self.add(f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" '
                 f'fill="{fill}" text-anchor="{anchor}" letter-spacing="{ls}"{st}>{escape(s)}</text>')

    def lines(self, x, y, rows, size=34, lh=1.45, **kw):
        """rows: list of strings; returns y after block"""
        for i, r in enumerate(rows):
            self.text(x, y + i * size * lh, r, size=size, **kw)
        return y + len(rows) * size * lh

    def line(self, x1, y1, x2, y2, stroke=C["navy"], sw=4, kind="solid", head=True, color_head=None):
        dash = {"solid": "", "dashed": ' stroke-dasharray="16 10"', "dotted": ' stroke-dasharray="3 9" stroke-linecap="round"'}[kind]
        mk = f' marker-end="url(#ah-{kind})"' if head else ""
        self.add(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{sw}"{dash}{mk}/>')

    def path(self, d, stroke=C["navy"], sw=4, fill="none", kind="solid", head=True, opacity=1):
        dash = {"solid": "", "dashed": ' stroke-dasharray="16 10"', "dotted": ' stroke-dasharray="3 9" stroke-linecap="round"'}[kind]
        mk = f' marker-end="url(#ah-{kind})"' if head else ""
        self.add(f'<path d="{d}" stroke="{stroke}" stroke-width="{sw}" fill="{fill}" opacity="{opacity}"{dash}{mk}/>')

    def badge(self, x, y, label, kind):
        col = {"D": C["leaf"], "I": C["river"], "H": C["ochre"], "U": C["terra"]}[kind]
        tc = "#3b2a06" if kind == "H" else "#fff"
        self.rect(x, y - 30, 44, 38, fill=col, rx=6)
        self.text(x + 22, y - 3, label, size=28, fill=tc, weight=700, anchor="middle", family=SERIF)

    def save(self, path, title="", desc=""):
        body = "\n".join(self.parts)
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" width="{self.w/10}mm" '
               f'height="{self.h/10}mm" role="img" aria-labelledby="t d">'
               f'<title id="t">{escape(title)}</title><desc id="d">{escape(desc)}</desc>'
               f'<defs>{"".join(self.defs)}</defs>{body}</svg>')
        with open(path, "w", encoding="utf-8") as f:
            f.write(svg)


ARROW_DEFS = "".join(
    f'<marker id="ah-{k}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
    f'<path d="M0,0 L12,6 L0,12 z" fill="context-stroke"/></marker>' for k in ("solid", "dashed", "dotted"))


def legend_arrows(s, x, y, size=30):
    """Standard arrow-grammar legend used on every causal/argument figure."""
    items = [("solid", "নিরেট: উৎসে স্পষ্টভাবে বর্ণিত / যাচাইকৃত সম্পর্ক"),
             ("dashed", "ড্যাশ: অনুমিত (hypothesis) / যুক্তির লাফ"),
             ("dotted", "বিন্দু: অনিশ্চিত সম্ভাবনা; কার্যকারণ নয়")]
    for i, (k, lab) in enumerate(items):
        yy = y + i * size * 1.5
        s.line(x, yy - size * 0.3, x + 90, yy - size * 0.3, stroke=C["navy"], sw=4, kind=k)
        s.text(x + 110, yy, lab, size=size, fill=C["muted"])
    return y + len(items) * size * 1.5
