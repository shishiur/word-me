"""Build the study book: HTML -> PDF (two-pass TOC page numbers + running-header overlay), DOCX, briefs PDF.
Run with LC_ALL=C.UTF-8 and NODE_PATH set (see make_book.sh)."""
import os, re, subprocess, sys, html
from pypdf import PdfReader, PdfWriter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
B, SRC, OUT, FIG = (os.path.join(ROOT, d) for d in ("build", "src/book", "output", "figures"))
BN = str.maketrans("0123456789", "০১২৩৪৫৬৭৮৯")
FILES = ["00_front.md", "01_part1.md", "02_part2.md", "03_part3a.md", "03_part3b.md", "04_synthesis.md", "05_bridge.md", "06_workshop.md"]
UNNUMBERED = ("কর্মশালা-পুনরালোচনা", "দ্বিভাষিক", "তথ্যসূত্র", "সম্পাদকীয়", "এই বই")
BOOK_SHORT = "কমন্সকে গতিশীল করা · অধ্যয়ন-সহচর"


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        print(r.stdout, r.stderr); raise SystemExit(f"failed: {cmd[:3]}")
    return r


def assemble():
    parts, n = [], 0
    for fn in FILES:
        txt = open(os.path.join(SRC, fn), encoding="utf-8").read()
        lines = []
        for line in txt.split("\n"):
            if line.startswith("# ") and fn != "00_front.md" and not line[2:].startswith(UNNUMBERED) and not line.rstrip().endswith("{.part}"):
                n += 1
                line = f"# {str(n).translate(BN)} · {line[2:]}"
            lines.append(line)
        parts.append("\n".join(lines))
    md = "\n\n".join(parts)
    p = os.path.join(OUT, "book.md")
    open(p, "w", encoding="utf-8").write(md)
    print("chapters numbered:", n)
    return p


def to_html(md, out_html, toc_html=""):
    run(["pandoc", md, "-f", "markdown-auto_identifiers", "-t", "html5", "--standalone", f"--template={B}/template.html",
         f"--lua-filter={B}/filters.lua", "--css=../build/book.css", "--metadata", "pagetitle=কমন্সকে গতিশীল করা",
         "-o", out_html])
    h = open(out_html, encoding="utf-8").read()
    h = re.sub(r'<div id="toc-here">\s*</div>', lambda m: toc_html, h, count=1)
    cnt = iter(range(1, 1000))
    h = re.sub(r'<h1(?![^>]*\bid=)([^>]*)>', lambda m: f'<h1 id="ch{next(cnt)}"{m.group(1)}>', h)
    # move English sub-titles out of h1 so PDF bookmarks stay clean
    h = re.sub(r'(<h1[^>]*>)((?:(?!</h1>).)*?)\s*<span class="en">((?:(?!</h1>).)*?)</span>\s*</h1>', r'\1\2</h1><div class="h1en">\3</div>', h, flags=re.S)
    open(out_html, "w", encoding="utf-8").write(h)
    return h


def h1_list(h):
    """Return (id, text) for each h1 in order, excluding cover/front items before the TOC marker."""
    res = []
    for m in re.finditer(r'<h1(?: id="([^"]*)")?[^>]*>(.*?)</h1>', h, flags=re.S):
        raw = m.group(2)
        txt = re.sub(r'<span class="en">.*?</span>', "", raw, flags=re.S)
        txt = html.unescape(re.sub(r"<[^>]+>", "", txt)).strip()
        res.append((m.group(1), txt))
    return res


def toc_markup(entries, pages=None):
    rows = []
    for i, (hid, txt) in enumerate(entries):
        pg = str(pages[i]).translate(BN) if pages else "০০০"
        is_part = txt.startswith(("ভিত্তি", "পদ্ধতি:", "দশটি পাঠ", "সংশ্লেষণ:", "গবেষণা-সেতু", "কর্মশালা, উত্তর"))
        cls = "toc-part" if is_part else "toc-ch"
        link = f'<a href="#{hid}">{html.escape(txt)}</a>' if hid else html.escape(txt)
        rows.append(f'<li class="{cls}"><span class="t">{link}</span><span class="dots"></span><span class="p">{pg}</span></li>')
    return ('<section class="toc-page"><div class="toc-title">সূচিপত্র</div><div class="toc-sub">Contents</div><ol class="toc-list">'
            + "".join(rows) + "</ol></section>")


def render_pdf(h, pdf):
    run(["node", f"{B}/render.js", "pdf", h, pdf])


def outline_pages(pdf):
    r = PdfReader(pdf)
    out = []
    for item in r.outline:
        if isinstance(item, list):
            continue
        out.append((item.title.strip(), r.get_destination_page_number(item) + 1))
    return out, len(r.pages)


def header_overlay(chapters, npages, skip_pages, out_pdf):
    """chapters: list of (title, start_page). Builds an overlay PDF with running heads."""
    divs = []
    starts = {p for _, p in chapters}
    for p in range(1, npages + 1):
        cur = None
        for t, s in chapters:
            if s <= p: cur = t
        show = p not in skip_pages and p not in starts and cur
        if show:
            text = html.escape(BOOK_SHORT if p % 2 == 0 else cur[:70])
            side = "left:22mm;right:26.5mm;text-align:left" if p % 2 == 0 else "left:26.5mm;right:22mm;text-align:right"
            divs.append(f'<div class="pg"><div class="rh" style="{side}">{text}</div></div>')
        else:
            divs.append('<div class="pg"></div>')
    doc = ('<!doctype html><html lang="bn"><head><meta charset="utf-8"><style>@page{size:A4;margin:0}'
           'body{margin:0}.pg{position:relative;width:210mm;height:297mm;break-after:page;overflow:hidden}'
           '.rh{position:absolute;top:11mm;font:8.6pt "Tinos","Noto Sans Bengali";color:#147C80;border-bottom:0.5pt solid #B3DCEB;padding-bottom:1.2mm}'
           '</style></head><body>' + "".join(divs) + "</body></html>")
    hp = out_pdf.replace(".pdf", ".html")
    open(hp, "w", encoding="utf-8").write(doc)
    render_pdf(hp, out_pdf)
    os.remove(hp)


def stamp(base_pdf, overlay_pdf, out_pdf, title):
    w = PdfWriter(clone_from=base_pdf)
    ov = PdfReader(overlay_pdf)
    for i, page in enumerate(w.pages):
        page.merge_page(ov.pages[i])
        page.compress_content_streams(level=9)
    w.add_metadata({"/Title": title, "/Author": "Study companion prepared for the workshop participant (research.edx)",
                    "/Subject": "Making Commons Dynamic – Bengali study book", "/Lang": "bn"})
    w.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
    with open(out_pdf, "wb") as f:
        w.write(f)


def build_pdf(md):
    h = os.path.join(OUT, "book.html")
    html0 = to_html(md, h, "")
    entries = [e for e in h1_list(html0)]
    # front-matter h1s before the TOC marker stay in the outline but the TOC lists everything after the cover
    to_html(md, h, toc_markup(entries))
    tmp1 = os.path.join(OUT, "_pass1.pdf"); render_pdf(h, tmp1)
    outl, n = outline_pages(tmp1)
    if len(outl) != len(entries) + 0:
        print("warning: outline/h1 mismatch", len(outl), len(entries))
    pages = [p for _, p in outl[:len(entries)]]
    to_html(md, h, toc_markup(entries, pages))
    tmp2 = os.path.join(OUT, "_pass2.pdf"); render_pdf(h, tmp2)
    outl2, n2 = outline_pages(tmp2)
    assert [p for _, p in outl2] == [p for _, p in outl], "pagination changed between passes"
    divider_titles = ("ভিত্তি", "পদ্ধতি:", "দশটি পাঠ", "সংশ্লেষণ:", "গবেষণা-সেতু", "কর্মশালা, উত্তর")
    skip = {1} | {p for t, p in outl2 if t.startswith(divider_titles)}
    chapters = [(re.sub(r"\s+", " ", t), p) for t, p in outl2]
    ov = os.path.join(OUT, "_overlay.pdf"); header_overlay(chapters, n2, skip, ov)
    final = os.path.join(OUT, "Making_Commons_Dynamic_Deep_Study_Book.pdf")
    stamp(tmp2, ov, final, "কমন্সকে গতিশীল করা: Making Commons Dynamic – Deep Study Book")
    for t in (tmp1, tmp2, ov): os.remove(t)
    print("PDF pages:", n2, "->", final)
    return outl2


def build_docx(md):
    ref = os.path.join(B, "reference.docx")
    run(["python3", os.path.join(B, "make_refdocx.py"), ref])
    out = os.path.join(OUT, "Making_Commons_Dynamic_Deep_Study_Book.docx")
    run(["pandoc", md, "-f", "markdown", "-t", "docx", f"--reference-doc={ref}", f"--lua-filter={B}/filters.lua",
         "--metadata", "title=কমন্সকে গতিশীল করা: Making Commons Dynamic", "--metadata", "lang=bn-BD", "-o", out], cwd=OUT)
    print("DOCX ->", out)


def build_briefs():
    txt = open(os.path.join(SRC, "06_workshop.md"), encoding="utf-8").read()
    a = txt.index("# কর্মশালা-পুনরালোচনা"); b = txt.index("# সিদ্ধান্ত-ল্যাবের")
    body = txt[a:b].replace("::: {.sheet .keep}", "::: {.sheet .keep .brief}")
    head = ("---\npagetitle: কর্মশালা-সংক্ষেপ\n---\n\n"
            "# কর্মশালা-সংক্ষেপ: পাঠভিত্তিক পুনরালোচনা-পাতা [Workshop author/session briefs]{.en}\n\n"
            "এই পাতাগুলো *কমন্সকে গতিশীল করা* অধ্যয়ন-সহচরের অংশ ৬ থেকে নেওয়া। কোনো সেশন-সূচি বা বক্তা-তালিকা পাওয়া যায়নি, "
            "তাই পাতাগুলো পাঠ-ভিত্তিক। প্রতিটি প্রশ্নের পটভূমি মূল বইয়ের সংশ্লিষ্ট অধ্যায়ে আছে। চিহ্ন: পৃষ্ঠা-উল্লেখ জার্নাল-পৃষ্ঠা অনুযায়ী।\n\n")
    md = os.path.join(OUT, "briefs.md")
    open(md, "w", encoding="utf-8").write(head + body.replace("# কর্মশালা-পুনরালোচনা পাতা [Workshop revision sheets]{.en}", ""))
    h = os.path.join(OUT, "briefs.html")
    to_html(md, h, "")
    pdf = os.path.join(OUT, "Workshop_Author_Session_Briefs.pdf")
    render_pdf(h, pdf)
    os.remove(md); os.remove(h)
    print("briefs ->", pdf)


if __name__ == "__main__":
    md = assemble()
    what = sys.argv[1:] or ["pdf", "docx", "briefs"]
    if "pdf" in what: build_pdf(md)
    if "docx" in what: build_docx(md)
    if "briefs" in what: build_briefs()
