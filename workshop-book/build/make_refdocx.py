"""Create the Word reference document (styles, A4 mirrored margins, Bengali complex-script fonts)."""
import subprocess, sys
from docx import Document
from docx.shared import Pt, Mm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

out = sys.argv[1]
with open(out, "wb") as f:
    f.write(subprocess.run(["pandoc", "--print-default-data-file", "reference.docx"],
                           capture_output=True, check=True).stdout)
doc = Document(out)

def set_fonts(style, latin, cs, size=None, cs_size=None, bold=None, color=None):
    f = style.font
    f.name = latin
    if size: f.size = Pt(size)
    if bold is not None: f.bold = bold
    if color: f.color.rgb = RGBColor.from_string(color)
    rpr = style.element.get_or_add_rPr()
    rf = rpr.find(qn("w:rFonts"))
    if rf is None:
        rf = OxmlElement("w:rFonts"); rpr.insert(0, rf)
    for k in ("w:ascii", "w:hAnsi"):
        rf.set(qn(k), latin)
    rf.set(qn("w:cs"), cs); rf.set(qn("w:eastAsia"), cs)
    for k in ("w:asciiTheme", "w:hAnsiTheme", "w:cstheme", "w:eastAsiaTheme"):
        if rf.get(qn(k)) is not None: del rf.attrib[qn(k)]
    if size or cs_size:
        szcs = rpr.find(qn("w:szCs"))
        if szcs is None:
            szcs = OxmlElement("w:szCs"); rpr.append(szcs)
        szcs.set(qn("w:val"), str(int((cs_size or size) * 2)))
    if bold:
        if rpr.find(qn("w:bCs")) is None: rpr.append(OxmlElement("w:bCs"))

st = doc.styles
BYNAME = {s.name: s for s in st}
class _S(dict):
    def __getitem__(self, k): return BYNAME[k]
for name in ("Normal", "Body Text", "First Paragraph", "Compact"):
    if name in [s.name for s in st]:
        s = BYNAME[name]
        set_fonts(s, "Tinos", "Noto Serif Bengali", 11.5)
        pf = s.paragraph_format
        pf.line_spacing = 1.15; pf.space_after = Pt(5.5); pf.space_before = Pt(0)
        if name != "Compact": pf.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
heads = {"Heading 1": (20, "103553"), "Heading 2": (15.5, "103553"), "Heading 3": (13, "147C80"), "Heading 4": (11.5, "12334B")}
for name, (sz, col) in heads.items():
    s = BYNAME[name]
    set_fonts(s, "Tinos", "Noto Sans Bengali", sz, bold=True, color=col)
    s.paragraph_format.space_before = Pt(14 if name == "Heading 1" else 10)
    s.paragraph_format.space_after = Pt(6)
    s.paragraph_format.keep_with_next = True
    if name == "Heading 1":
        s.paragraph_format.page_break_before = True
        pPr = s.element.get_or_add_pPr()
        bdr = OxmlElement("w:pBdr"); b = OxmlElement("w:bottom")
        for k, v in (("w:val", "single"), ("w:sz", "18"), ("w:space", "4"), ("w:color", "B3DCEB")):
            b.set(qn(k), v)
        bdr.append(b); pPr.append(bdr)
for name in ("Title", "Subtitle"):
    set_fonts(BYNAME[name], "Tinos", "Noto Sans Bengali", 24 if name == "Title" else 14, color="103553")
for name in ("Caption", "Image Caption", "Table Caption"):
    if name in BYNAME:
        set_fonts(BYNAME[name], "Tinos", "Noto Sans Bengali", 10)
        BYNAME[name].font.italic = False
        BYNAME[name].paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT

boxes = {"Concept Box": ("EBF5F3", "147C80"), "Method Box": ("FBF4E6", "D8A34A"), "Caution Box": ("F8ECE7", "B6684F"),
         "Ecology Box": ("EDF3EE", "4E7960"), "Recap Box": ("FFFFFF", "12334B"), "Check Box": ("FFFFFF", "147C80"),
         "Figure Reading": ("FAFCFC", "C9D6DC"), "Quote Box": ("FFFFFF", "4D94B5")}
for name, (fill, edge) in boxes.items():
    s = st.add_style(name, WD_STYLE_TYPE.PARAGRAPH)
    s.base_style = BYNAME["Normal"]
    set_fonts(s, "Tinos", "Noto Serif Bengali", 10.5)
    pf = s.paragraph_format
    pf.left_indent = Mm(3); pf.right_indent = Mm(2); pf.space_after = Pt(4); pf.alignment = WD_ALIGN_PARAGRAPH.LEFT
    pPr = s.element.get_or_add_pPr()
    shd = OxmlElement("w:shd"); shd.set(qn("w:val"), "clear"); shd.set(qn("w:color"), "auto"); shd.set(qn("w:fill"), fill)
    bdr = OxmlElement("w:pBdr"); left = OxmlElement("w:left")
    for k, v in (("w:val", "single"), ("w:sz", "24"), ("w:space", "6"), ("w:color", edge)):
        left.set(qn(k), v)
    bdr.append(left); pPr.append(bdr); pPr.append(shd)

# TOC heading style
s = BYNAME["TOC Heading"]
set_fonts(s, "Tinos", "Noto Sans Bengali", 20, bold=True, color="103553")
s.paragraph_format.page_break_before = True

# Page: A4, mirrored margins as specified (top 22, bottom 21, inner 26.5, outer 22 mm)
sec = doc.sections[0]
sec.page_width, sec.page_height = Mm(210), Mm(297)
sec.top_margin, sec.bottom_margin = Mm(22), Mm(21)
sec.left_margin, sec.right_margin = Mm(26.5), Mm(22)
settings = doc.settings.element
mm = OxmlElement("w:mirrorMargins"); settings.insert(0, mm)
uf = OxmlElement("w:updateFields"); uf.set(qn("w:val"), "true"); settings.append(uf)
# page number footer
footer = sec.footer.paragraphs[0]
footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = footer.add_run()
for t, v in (("begin", None), ("instr", " PAGE "), ("separate", None), ("end", None)):
    if t == "instr":
        el = OxmlElement("w:instrText"); el.set(qn("xml:space"), "preserve"); el.text = v
    else:
        el = OxmlElement("w:fldChar"); el.set(qn("w:fldCharType"), t)
    run._r.append(el)
doc.save(out)
print("reference.docx written")
