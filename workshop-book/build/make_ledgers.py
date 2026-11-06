"""Write coverage ledger, evidence/claims register and figures manifest (CSV + readable MD)."""
import csv, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = os.path.join(ROOT, "ledgers")
DATE = "2026-11-06"

cov_fields = ["source_id", "title", "genre", "pages_total", "copy_actually_read", "sections_or_chapters_read",
              "figures_inspected", "methods_verified", "cited_in_chapter", "coverage_status", "outstanding_questions", "source_link"]
cov = [
 ["W01", "Ostrom (1990) Governing the Commons", "Academic book", "295 (manifest)", "None (no open copy; Drive folder inaccessible)", "TOC only (archive.org catalogue)", "none", "no", "7; cited via W02,W05,W06,W09,W10", "mapped TOC", "All chapters unread; selection-on-success question (ch.3 vs ch.5)", "https://drive.google.com/file/d/1eS7qGV79ofGMVOBnF3JoThpuBtVfXo9W/view"],
 ["W02", "Ostrom, Burger, Field, Norgaard & Policansky (1999) Revisiting the Commons", "Review (Science Compass)", "6", "laits.utexas.edu PDF of Science article", "All text pp.278-282 + editor's summary page", "Table 1, Table 2, Fig.1 caption (photo not viewed)", "n/a (review); Table 2 F/P values checked for internal consistency", "1,3,8,17,19", "deep analysis completed and audited", "Table 2 tail-end P=0.004 vs F=20.33 to check against Lam (1998)", "https://doi.org/10.1126/science.284.5412.278"],
 ["W03", "Ostrom (2007) A diagnostic approach for going beyond panaceas", "Conceptual article", "7", "PMC2000497 HTML", "All sections", "Fig.1, Fig.2, Table 1, Table 2 are images: NOT viewed", "n/a", "3,4,9,17", "fully examined (text); figures not inspected", "Table 1 variable list not seen directly", "https://doi.org/10.1073/pnas.0702288104"],
 ["W04", "Ostrom (2009) A General Framework for Analyzing Sustainability of SES", "Perspective", "5 PDF pages (target pp.419-422)", "Stanford-hosted PDF of Science pages", "All of target article; confirmed adjacent-article pages in PDF", "Fig.1 (text labels), Table 1 (text)", "n/a", "2,4,10,17", "deep analysis completed and audited", "Criteria for choosing the ten variables not stated", "https://doi.org/10.1126/science.1172133"],
 ["W05", "Agrawal, Erbaugh & Pradhan (2023) The Commons", "Review", "28", "Annual Reviews HTML (CC BY)", "All body sections §1-§4, summary points, future issues", "Figure 1 image NOT viewed", "n/a", "1,6,11,17", "fully examined (body); references not read", "Coordinated-experiment results (ref 9) not checked in original", "https://doi.org/10.1146/annurev-environ-112320-113509"],
 ["W06", "Nayak & Berkes (2011) Commonisation and Decommonisation: Chilika", "Empirical case + concept", "14", "Indiana DLC repository PDF", "All text, Tables 1-5, Figure 1 text, notes 1-17", "Tables 1-5; Fig.1 text", "yes (design, N, sampling described; coding not described)", "1,2,5,12,17,18", "deep analysis completed and audited", "Internal inconsistencies: Tata 600 vs 1,100 ha; FISHFED 1988 vs 1991", "https://doi.org/10.4103/0972-4923.83723"],
 ["W07", "Galappaththi & Nayak (2017) Two faces of shrimp aquaculture", "Comparative case article", "19", "Springer HTML + PDF (open access)", "All sections, Tables 1-4", "Tables 1-4; Fig.1 (map) not viewed", "partial (no N for interviews/FGDs reported)", "13,17", "deep analysis completed and audited", "Numeric mismatches with W06 and within Table 4", "https://doi.org/10.1186/s40152-017-0066-4"],
 ["W08", "Nayak (ed.) (2021) Making Commons Dynamic", "Edited book", "382-383", "None (no open copy; Drive folder inaccessible)", "TOC only (Routledge product page)", "Ch.1 figure known only via W09 Fig.1 and W10 Fig.5.2 reproductions", "no", "5,15", "mapped TOC", "Ch.4 (ephemeral commons origin), Ch.13 meta-analysis, Ch.1 and 16 unread", "https://drive.google.com/file/d/14xSXcoSy_TESe8wEqp6Yw4IddjdQqMBP/view"],
 ["W09", "Nayak & Berkes (2022) Evolutionary Perspectives on the Commons", "Perspective/theory", "15", "MDPI HTML (open access)", "All sections incl. Box 1, Box 2", "Figure 1 and Table 1 images NOT viewed", "n/a", "1,5,14,17", "fully examined (text)", "Table 1 pathway terms not seen", "https://doi.org/10.3390/su14074300"],
 ["W10", "Berkes & Franz (eds.) (2025) Governing for transformation towards sustainable SSF", "FAO edited book", "188", "FAO Open Knowledge PDF (CC BY)", "Chapter 5 full (pp.61-73); ch.3 Sri Lanka box; ch.6 Bangladesh Fig 6.3 passage & Comcaac paragraph; Contents; Contributors", "Fig 5.1 data, Fig 5.2 text, Table 5.1, Box 5.1-5.3", "n/a", "3,15,16,17,18", "selected chapters read", "Chapters 1-4, 6-10 mapped only", "https://doi.org/10.4060/cd4289en"],
 ["P01", "Sunny et al. (2025) Hilsa genetic diversity ... northeastern Bangladesh (EJABF 29(1):1089-1105)", "User co-authored empirical article", "17", "Drive connector text extraction", "All text and tables; figures not viewed", "Tables 1-4", "yes: internal inconsistencies listed; 4 DOIs checked on Crossref (3 mismatched)", "18", "deep analysis completed and audited", "Remaining DOIs unchecked; sequence data not re-analysed", "https://drive.google.com/file/d/1M8g5wjamBxhC8yH2KurOwpjN5HyKcQYK/view"],
 ["P02", "Sunny et al. Nexus of Ecosystem Services and Hilsa Genetic Diversity (Oceans 7(3):38)", "User co-authored article", "23", "Drive metadata snippet", "Abstract only", "none", "no", "18, references", "abstract only", "Check whether P01 issues recur", "https://drive.google.com/file/d/1EnaCcuUp1psQRMpRWhDKa4BhX35BATQJ/view"],
 ["P03", "Sunny et al. Fish Genetic Resources and Wetland Conservation in Bangladesh (Limnol. Rev. 25(2):20)", "User co-authored article", "30", "Drive metadata snippet", "Abstract only", "none", "no", "references", "abstract only", "", "https://drive.google.com/file/d/15MV4M_LHmr7BrSnhWvgrd4VVhrzBEZLn/view"],
 ["P04", "Ferdousy et al. (2025) Effector protein dynamics ... Magnaporthe oryzae (PLoS ONE 20(1):e0307352)", "Plant pathology article", "24", "Drive metadata snippet", "Title/abstract start", "none", "no", "none (unrelated)", "metadata only", "Not related to workshop", "https://drive.google.com/file/d/1bJ74OLSezMjJLkR3nywdkzp5HFcMtP8j/view"],
 ["P05", "Ashakin et al. (2024) Transforming to Smart Healthcare: AI Innovations (review)", "Health-informatics review", "n.v.", "Drive metadata snippet", "Title/abstract start", "none", "no", "none (unrelated)", "metadata only", "Not related to workshop", "https://drive.google.com/file/d/1qQR2CkleOQU-N2eNPOX8Oo86znL-Faft/view"],
 ["P06", "Akhter et al. Improving Treatments for Oral Diseases, Head and Neck Cancers (review)", "Medical review", "n.v.", "Drive metadata snippet", "Title/abstract start", "none", "no", "none (unrelated)", "metadata only", "Not related to workshop", "https://drive.google.com/file/d/1hGGoEiXHctq4Ft9OIjiMtg7fNr98i8PQ/view"],
 ["REF", "Dhruv Rathee Academy Flood Survival Guide (visual benchmark)", "Design reference", "n.v.", "NOT ACCESSIBLE (host blocked by session network policy)", "none", "none", "no", "front matter", "not accessible", "User to upload the PDF if visual benchmarking is still wanted", "https://cdn.prod.website-files.com/65e8a443d3a217849e4283b8/6a720c56f32f77267e5492c4_Flood-Survival-Guide-Dhruv-Rathee-Academy.pdf"],
]

claims_fields = ["claim_id", "source_id", "location", "claim_paraphrase", "claim_type", "evidence_basis", "book_chapter", "book_label", "verification_note"]
claims = [
 ["C01", "W02", "p.278", "Inner Asian grassland: ~3/4 Russian, >1/3 Chinese, ~1/10 Mongolian sections degraded", "reported observation (secondary, Sneath 1998)", "satellite image cited", "8", "D", "not checked in Sneath"],
 ["C02", "W02", "p.279", "CPR defined by costly exclusion and subtractability, regardless of property rights", "definition", "conceptual", "1", "D", ""],
 ["C03", "W02", "Table 2 p.280", "Farmer-owned systems higher crop intensity (246/237%) than government (208/182%)", "association", "N=97 vs 21; F tests", "8", "D", "tail-end P inconsistent with F; check Lam 1998"],
 ["C04", "W03", "Tragedy section", "Face-to-face communication between rounds moves lab groups toward optimal harvest", "experimental finding (cited)", "lab CPR experiments", "3,9", "D", ""],
 ["C05", "W03", "Harbor gangs", "V-notch norm works because lobsters can be returned, mostly stay, notch persists", "mechanism (author interpretation)", "case narrative", "4,9", "D/I", ""],
 ["C06", "W04", "p.421", "Effect of any SES variable depends on others; nonlinear interactions", "theoretical claim", "synthesis", "4,10", "D", ""],
 ["C07", "W05", "§2.2.2", "Commons research focused on stability rather than change", "interpretation (field self-assessment)", "literature review", "5,11,17", "D", ""],
 ["C08", "W05", "§2.3.1", "Of 172 observational studies 1990-2004, only 36 had >30 observations", "reported observation (secondary)", "cited review", "6,11", "D", ""],
 ["C09", "W06", "p.140", "Caste fisher household income fell 70-80% (2002-2008)", "reported observation", "household survey (recall?)", "12", "D", "measurement method for 2002 baseline not stated"],
 ["C10", "W06", "p.139", "Only 5% fisher cooperatives functional", "reported observation", "survey", "12,13", "D", "W07 Table 4 gives 88% dysfunctional"],
 ["C11", "W06", "p.141", "Pathway commons -> decommonisation -> open access -> privatisation", "author interpretation (process)", "case evidence incl. note 13", "5,12", "D/I", "co-occurring drivers not separated"],
 ["C12", "W06", "p.142", "Legally confirmed rights can regress; extends Ribot & Peluso access theory", "theoretical claim", "case contrast", "2,12", "D", ""],
 ["C13", "W06", "pp.137-138 vs p.141", "Area handed to Tata: 600 ha vs 1,100 ha", "internal inconsistency", "text", "12", "D", "flagged"],
 ["C14", "W07", "Methods", "Cases chosen for compatibility of data collection and time frame", "documented design decision", "text", "13", "D", ""],
 ["C15", "W07", "Results/Table 3", "Zonal crop calendar (5 zones, 32 sub-zones) manages shared-water disease risk", "reported observation", "case study", "13", "D", "Table 2 lists 18 community associations"],
 ["C16", "W07", "Results", "Effectiveness partly reflected by national production growth since 2005", "weak indicator", "national statistic", "13", "D/I", "aggregate indicator, not case outcome"],
 ["C17", "W09", "§6", "'Favourable/unfavourable' is a normative position", "author's value statement", "text", "5,14", "D", ""],
 ["C18", "W09", "§5", "Ephemeral commons suggested where the resource remains elusive (Singh)", "concept attribution", "cites W08 ch.4", "5,14,15", "D", "W08 ch.4 not read"],
 ["C19", "W10", "§5.3 p.64", "13 corporations control 19-40% of global large-stock marine catch", "reported observation (secondary, Österblom 2015)", "cited study", "16", "D", "not checked in original"],
 ["C20", "W10", "§5.7", "Commons theory enables prediction of local outcomes", "theoretical claim", "synthesis", "16,17", "D", "tension with W03/W04"],
 ["C21", "P01", "Methods vs Results", "60 vs 30 fish per site", "internal inconsistency", "text", "18", "D", ""],
 ["C22", "P01", "Results 3", "Three haplotypes but Hd = 1.000", "statistical inconsistency", "arithmetic", "18", "I", "implies n=3 sequences"],
 ["C23", "P01", "References", "3 of 4 sampled DOIs resolve to unrelated articles", "verification result", "Crossref API 2026-11-06", "18", "D", "remaining DOIs unchecked"],
 ["C24", "P01", "4.2", "Sylhet hilsa genetically indistinguishable from sanctuary populations -> transfer bans/sanctuaries", "policy inference", "FST vs single GenBank accessions", "18", "I", "untested; no sanctuary-area samples"],
]

fig_fields = ["figure_id", "chapter", "visual_type", "learning_question", "claim_type", "source_and_pages", "what_it_shows", "visual_asset", "caption", "alt_text", "verification_status"]
F = lambda *a: list(a)
figs = [
 F("cover", "cover", "atmospheric editorial illustration", "set scene", "conceptual scene, not evidence", "original", "monsoon haor with boats, fisher, swamp trees, village mound", "figures/cover_haor.svg|.jpg", "none (cover)", "monsoon haor scene", "original; no geographic claim"),
 F("0.1", "front", "learning route", "how to move through the book", "organisational", "original", "six-step path", "figures/fig_0_1_start_here.svg|.png", "পাঠের পথ", "six steps", "rendered and inspected"),
 F("1.1", "1", "2x2 matrix + regime strip", "goods attributes vs property regimes", "concept redraw", "W02 p.279 Table 1; W05 §2.1", "goods typology and four regimes", "figures/fig_1_1_goods_regimes.svg|.png", "পণ্যের ধরন ও অধিকার-ব্যবস্থা", "see SVG desc", "rendered and inspected"),
 F("2.1", "2", "matrix", "which holder has which right", "concept redraw", "Schlager & Ostrom 1992 via W10 §5.3; W06 p.142", "bundle of rights + Chilika paradox", "figures/fig_2_1_bundle_rights.svg|.png", "অধিকারের গুচ্ছ", "see SVG desc", "rendered and inspected"),
 F("2.2", "2", "nested levels", "rule levels", "concept + hypothetical examples", "Ostrom 1990/2005 via W10 §5.4", "operational / collective / constitutional", "figures/fig_2_2_rule_levels.svg|.png", "নিয়মের তিন স্তর", "see SVG desc", "rendered and inspected"),
 F("3.1", "3", "comparison matrix", "where Hardin's assumptions hold", "source-based reconstruction", "W03 Tragedy & Roving Bandits sections", "Hardin vs bandits vs Maine", "figures/fig_3_1_hardin_matrix.svg|.png", "তিন ব্যবস্থা", "see SVG desc", "rendered and inspected"),
 F("4.1", "4", "systems diagram", "SES core subsystems", "simplified redraw", "W03 Fig.1; W04 Fig.1", "RS, RU, GS, U -> I -> O; S; ECO", "figures/fig_4_1_ses_framework.svg|.png", "SES কাঠামো", "see SVG desc", "rendered; feedback arrow dashed (unspecified)"),
 F("4.2", "4", "small multiples (qualitative)", "direction of ten variables", "conceptual shapes, not data", "W04 pp.420-421 text", "hump/up/down/conditional shapes", "figures/fig_4_2_ten_variables.svg|.png", "দশটি চলক", "see SVG desc", "rendered; labelled non-quantitative"),
 F("5.1", "5", "continuum", "two-way process", "concept redraw", "W06 Fig.1; W09 Fig.1; W10 Fig.5.2", "continuum with three trajectories", "figures/fig_5_1_continuum.svg|.png", "ধারাবাহিকতা", "see SVG desc", "rendered and inspected"),
 F("6.1", "6", "inference ladder", "levels of claim", "original pedagogical", "examples from W02,W03,W05,W06", "five rungs", "figures/fig_6_1_inference_ladder.svg|.png", "অনুমানের সিঁড়ি", "see SVG desc", "rendered and inspected"),
 F("8.1", "8", "bar chart", "ownership vs crop intensity", "real data recreated", "W02 Table 2 (Lam 1998 p.106)", "246/208, 237/182", "figures/fig_8_1_nepal_irrigation.svg|.png", "নেপালের সেচ", "see SVG desc", "values verified against W02 text"),
 F("12.1", "12", "argument flowchart", "how the Chilika argument is built", "reconstruction with D/I labels", "W06 pp.132-141", "8 steps; dashed evidence->claim", "figures/fig_12_1_reasoning_chilika.svg|.png", "যুক্তি-শৃঙ্খল", "see SVG desc", "rendered and inspected"),
 F("12.2", "12", "timeline", "sequence of events", "documented dates", "W06 pp.133-140", "1700s-2010 events", "figures/fig_5_2_chilika_timeline.svg|.png", "চিলিকা সময়রেখা", "see SVG desc", "dates verified against W06"),
 F("13.1", "13", "matched comparison", "how comparable are the two cases", "source-based", "W07 Methods, Results, Tables", "Chilika vs NW Sri Lanka", "figures/fig_13_1_compare.svg|.png", "দুই কেস", "see SVG desc", "rendered and inspected"),
 F("13.2", "13", "mechanism panel", "shared-water disease dilemma", "source-based", "W07 Results & Table 3; W10 ch.3 box", "uncoordinated vs crop calendar", "figures/fig_13_2_srilanka_dilemma.svg|.png", "চিংড়ি-দ্বিধা", "see SVG desc", "rendered and inspected"),
 F("16.1", "16", "line chart + sequence", "roving bandits", "real data recreated", "W10 Fig.5.1 (Andrew et al. 2002)", "global urchin harvest 1945-1995; sequence", "figures/fig_16_1_urchin.svg|.png", "আর্চিন", "see SVG desc", "values transcribed from W10 text extraction"),
 F("17.1", "17", "citation graph", "how readings connect", "verified citations (solid) + proposed (dashed)", "W02-W10 reference lists/text", "10 nodes", "figures/fig_17_1_source_graph.svg|.png", "উৎস-মানচিত্র", "see SVG desc", "solid edges checked in texts read"),
 F("18.1", "18", "two-layer causal map", "where biology and governance might connect", "HYPOTHETICAL", "original", "mostly dashed/dotted edges", "figures/fig_18_1_bridge.svg|.png", "গবেষণা-সেতু", "see SVG desc", "explicitly hypothetical"),
 F("18.2", "18", "consistency table", "is P01 internally consistent", "verification result", "P01 full text; Crossref", "six checkpoints", "figures/fig_18_2_p01_check.svg|.png", "P01 পরীক্ষা", "see SVG desc", "verified 2026-11-06"),
]

def write(name, fields, rows):
    with open(os.path.join(L, name + ".csv"), "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f); w.writerow(fields); w.writerows(rows)

write("Source_Coverage_Ledger", cov_fields, cov)
write("Evidence_and_Claims", claims_fields, claims)
write("figures_manifest", fig_fields, figs)
with open(os.path.join(L, "Source_Coverage_Ledger.md"), "w", encoding="utf-8") as f:
    f.write(f"# Source coverage ledger ({DATE})\n\nAllowed classes: not accessible, metadata only, abstract only, mapped TOC, selected chapters read, fully examined, deep analysis completed and audited.\n\n")
    f.write("The assigned Drive folder was not visible to the connected Drive account; publisher/repository copies of the same works were read instead (column 'copy_actually_read').\n\n")
    f.write("| ID | Title | Copy read | Coverage | Outstanding |\n|---|---|---|---|---|\n")
    for r in cov:
        f.write(f"| {r[0]} | {r[1]} | {r[4]} | {r[9]} | {r[10]} |\n")
print("ledgers written")
