# Making Commons Dynamic: Deep Study Companion (কমন্সকে গতিশীল করা)

Bengali-first illustrated study book for the *Making Commons Dynamic: Ephemeral Commons of Bangladesh* workshop. Working edition 1.0, 6 November 2026.

## Deliverables

| File | What it is |
|---|---|
| `output/Making_Commons_Dynamic_Deep_Study_Book.pdf` | 79-page A4 print/reading edition: embedded fonts, selectable Bengali text, nested PDF bookmarks (chapters + sections), clickable contents with page numbers, running heads, Bengali page numbers |
| `output/Making_Commons_Dynamic_Deep_Study_Book.docx` | Editable master: real Heading 1–3 styles, custom box styles, Word TOC field (Word asks to update fields on open), A4 mirrored margins, figures with alt text |
| `output/Workshop_Author_Session_Briefs.pdf` | 6-page reading-based revision sheets (no session schedule was available) |
| `figures/` | 19 original figures as SVG (vector, editable text) + PNG (2000 px); cover as SVG + 300-dpi JPEG |
| `ledgers/Source_Coverage_Ledger.csv/.md` | What was actually read, from which copy, at what depth |
| `ledgers/Evidence_and_Claims.csv` | 24 consequential claims with location, claim type and verification notes |
| `ledgers/figures_manifest.csv` | Per-figure learning question, claim type, source pages, verification status |
| `proof/design_proof.pdf` | The 6-page design proof (cover + 5 pages) rendered and corrected before production |

## Rebuild

```bash
cd build && ./make_book.sh          # figures, PDF (two-pass TOC + header overlay), DOCX, briefs
python3 make_ledgers.py
```
Requires pandoc 3, Node + Playwright Chromium, Python (pypdf, python-docx, Pillow), fonts Noto Serif/Sans Bengali and Tinos.

## Completion status (honest)

Complete and audited: W02, W03, W04, W05, W06, W07, W09 chapters; Part I (5 foundation chapters), Part II (methods), Part IV (synthesis), Part V (research bridge incl. P01 audit), Part VI (sheets, answer guides, glossary, APA references).

Partial: W10, where chapter 5 was read in full and the rest is mapped from the contents.

Mapped only (not analysed): W01 Ostrom (1990) and W08 Nayak (ed.) (2021). No open copy was reachable, and the assigned Google Drive folder was not visible to the connected Drive account.

Not done:
- The visual benchmark PDF (Flood Survival Guide) could not be opened, so the design follows the written spec only.
- No animation was produced.
- No mobile edition was produced.
- P02 and P03 were seen at abstract level only.

Page numbers cite the journal-printed pages of publisher copies; the user's Drive PDFs may paginate differently.
