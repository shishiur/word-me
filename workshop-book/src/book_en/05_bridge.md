::: {.divider}
::: inner
<div class="num">PART V</div>

# Research bridge: haor, hilsa, microbes {.part}

Aim: separate, with evidence levels, which reasoning from commons scholarship really transfers to your biological research, and which is only analogy.
:::
:::

# Bridges to haor, hilsa and microbiology research [Research bridges, evidence-ranked]{.en}

### Rules for the bridges

Each proposed link is placed in one of four classes:

- **supported link:** direct evidence in established literature or the assigned readings;
- **plausible hypothesis:** a reasonable mechanism exists, but it is untested;
- **conceptual analogy:** the structure of reasoning matches, but the process is not the same;
- **unrelated:** forced together.

This classification protects against a tendency the brief names explicitly: the pull to join many interesting fields in one study.

![[Figure 18.1]{.fnum} Research bridge: an entirely hypothetical teaching figure. The upper layer is biophysical, the lower layer governance. Only two arrows are solid: jalmohal lease to ban rules (an administrative relation) and fishing pressure to population (established fisheries science). The rest are dashed (hypotheses) or dotted (uncertain). No hilsa-specific relationship has been measured.](../figures_en/fig_18_1_bridge.svg){width=100%}

### Link table

| Link | Mechanism | State of evidence | Scale | Confounders | What to measure | Class |
|---|---|---|---|---|---|---|
| Fishing pressure → stock | Higher mortality | Established in fisheries science (in general) | Stock, years | Environmental recruitment variability | CPUE, size structure, effort | Supported (general); untested for hilsa in haors |
| Rules/rights → fishing behaviour | Incentives and monitoring | Many cases in W02–W04, W06, W07 | Village/beel, season | NGO projects, market prices | Compliance, effort, interviews | Supported (general); needs testing in a specific haor |
| Water quality → fish stress | Physiological response (temperature, DO, pollutants) | Direction established in general fish physiology | Individual, days–weeks | Size, reproductive state, handling stress | Cortisol/glucose etc., water parameters | Plausible hypothesis (for hilsa specifically) |
| Fish stress ↔ gut microbiome | Host–microbe interaction | Associations reported in other fishes; direction uncertain | Individual | Diet, environmental microbes, sampling method | 16S profiles (gut and water separately), stress markers | Plausible hypothesis; correlation ≠ causation |
| Gut microbiome → population | Fitness effects | No evidence | Population | Almost everything | Multi-level intermediate evidence | Uncertain; cannot be claimed for now |
| Low mtDNA FST → "single stock" → uniform bans | Gene flow | Low differentiation at one marker does not prove contemporary migration | Evolutionary vs management scale | Large Ne, recent divergence, low statistical power | Multi-locus SNPs, tagging, otolith chemistry | Leap in reasoning; see the end of this chapter |
| Sri Lanka's shared-water disease ↔ aquatic AMR | One user's action lowers the "quality" of others' water | Disease commons in W07; AMR-as-commons is a concept from outside literature | Farm clusters, basins | Different microbes, different incentives | Antibiotic use, resistance genes in water samples | Conceptual analogy (strong) |
| Hilsa genetic diversity → jalmohal lease policy | — | No direct mechanism | — | — | — | Unrelated (without intermediate steps) |

: Bridge table. "Established direction" means well known in general literature; specific sources for it were not checked in this book, so find primary sources before writing them into a proposal.

### What governance evidence adds to conservation biology

Your hilsa genetics work asks "where is the fish, how diverse, how connected?". Commons research asks other questions:

- Who fishes?
- Under which rules?
- Who makes and enforces the rules?
- Who is excluded?

Whether conservation policy (bans, sanctuaries) works depends as much on the second set of questions as on the first <span class="ev I">I</span>. W06's strongest lesson is that court bans and legal rights stay on paper without the power to enforce them (p.138, p.142). W10 says small-scale fishers often "simply do not have the power to assert their rights, even if they have the backing of the courts" (§5.7). So a ban recommendation needs answers to at least three governance questions alongside the genetics:

1. Who will enforce the rule?
2. Where will livelihoods come from during the ban?
3. Who takes part in making the rules?

### What molecular data cannot prove

- Low FST at one mitochondrial marker does not prove **contemporary migration** or **one management stock**. It can also result from historical gene flow, a large effective population size, or recent divergence.
- Genetic similarity does not show whether an area has spawning or nursery habitat. That needs data on reproductive state, larval surveys and habitat.
- Genetics says nothing about access, livelihoods or fairness.
- A gut 16S profile shows microbial **composition**, not **activity**, and showing fitness effects on the host needs an experimental design.
- A 16S rRNA microbial community survey and a fish mitochondrial 16S/cyt b population marker answer entirely different questions; the shared name can mislead.

### Worked example: your own publication under evidence review

As the brief requires, your co-authored papers were also evaluated independently. P01 (Sunny et al. 2025, *Egyptian Journal of Aquatic Biology & Fisheries* 29(1):1089–1105) was read in full. It is the most useful example in this book, because it shows how a governance recommendation can leap from genetics, and where that leap is weak.

![[Figure 18.2]{.fnum} Internal consistency check of P01. Each row sets two parts of the article side by side. The reference row is the result of checking a sample of 4 DOIs through the Crossref API (6 November 2026).](../figures_en/fig_18_2_p01_check.svg){width=100%}

**The chain of reasoning** <span class="ev D">D</span>:

1. Hilsa from Hakaluki Haor, Tanguar Haor and the Surma River show cyt b-based FST of 0.000–0.011.
2. Therefore a "single genetic stock".
3. Sylhet hilsa are "genetically indistinguishable from those in well-managed sanctuary areas such as Patuakhali, Chandpur, and Cox's Bazar".
4. So the bans and sanctuaries used there can be applied in Sylhet, for example by declaring Hakaluki and Tanguar hilsa sanctuaries.

**The weak links:**

1. **Samples and haplotypes** <span class="ev D">D</span>: the methods say 60 fish per site; the results say 30. There are only three haplotypes, yet Hd = 1.000 "all samples represented unique haplotypes". With three haplotypes, Hd = 1 is possible only if there are three sequences in total <span class="ev I">I</span>. So the analysis was probably done on one (perhaps consensus) sequence per site, not on 30–60 fish.
2. **Diversity values** <span class="ev I">I</span>: 271 variable sites among three conspecific cyt b sequences (about 36% of ~744 sites) is biologically implausible for one species and may point to sequencing or alignment error. Nucleotide diversity (π) is a per-site proportion; a value of 2.50 cannot be π (possibly the mean pairwise difference k, mislabelled).
3. **The unit of FST** <span class="ev I">I</span>: FST between a population and a single GenBank accession is not a population-level measure. No samples from Chandpur, Patuakhali or Cox's Bazar were analysed, so the claim "indistinguishable from sanctuary populations" is untested.
4. **The leap from biology to policy** <span class="ev I">I</span>: even if genetic similarity holds, the article gives no data on whether the haors hold hilsa spawning or nursery habitat. Hilsa is anadromous; a sanctuary cannot be recommended without separately checking its regular presence and life-cycle role in haors. Governance questions (jalmohal leasing, enforcement, livelihoods) are almost absent from the recommendations.
5. **References** <span class="ev D">D</span>: in a sample of four DOIs, three resolve to entirely different articles.
    - The DOI cited as "Barman et al. 2020, genetic connectivity" is actually a case report on shark skin.
    - The DOI cited as "Ahmed et al. 2020, seasonal fishing bans" is actually a study of brown-crab maturity in Scotland.
    - The DOI cited as "Khatun et al. 2021, juvenile survival in Hilsa sanctuaries" (the basis of the "30% higher juvenile survival" claim) is actually about reservoir fisheries in Liberia.
    - Only Sultana et al. (2022) matched.
    - A template sentence remains in the reference list: "[Conference presentation or unpublished work – please provide details if available]".
    - The remaining DOIs were not checked in this book.

::: {.box .caution}
<span class="label">What to do</span>
This is a serious matter, and you are a co-author. Calmly consider three steps:

1. Check every reference by DOI and compile a list.
2. Recalculate the population-genetic statistics from a corrected alignment with per-sample sequences (GenBank accessions).
3. With revised claims, discuss with the lead and corresponding authors whether to request a corrigendum from the journal, or a fuller reconsideration if needed.

P02 (*Oceans* 7(3):38), based on the same data, was seen only at abstract level in this edition; check its full text for the same problems.
:::

This critique does not invalidate your research question. Where, when and at what life-cycle stage hilsa occur in Sylhet's wetlands, and which governance regime applies there, is a good and needed question. The design and the claims simply need to match.

### A realistic 12-month proposal (within BDT 500,000) <span class="ev H">H</span>

**Question:** "In one northeastern haor, how does access to fishing change between the monsoon and the dry season, and how is that change related to the species composition of catches and to the income of different fisher groups?" This turns the workshop's "ephemeral commons" into a measurable question, and it uses both your field experience (questionnaires, market observation) and your species-identification skills.

| Component | Work | Why | Approximate cost (BDT) |
|---|---|---|---|
| Access mapping | Seasonal "who fishes where under which right" in 15–20 beels/areas (participatory mapping + interviews) | Measures the bundle of rights in Figure 2.1 by season | 120,000 |
| Catch sampling | Monthly species, size and effort (CPUE) at landing sites | Subtractability and species composition | 150,000 |
| Documents | Jalmohal lease records, ban dates | Institutional rhythm vs hydrological rhythm | 30,000 |
| Water extent | Monthly water boundary from open satellite imagery (free data) | How the resource itself comes and goes | 20,000 |
| Analysis and reporting | Coding, simple statistics, feedback meeting | Returning findings to the community | 80,000 |
| Contingency | | | 100,000 |
| **Total** | | | **500,000** |

: Proposed project. Costs are rough estimates; check against local rates before a real budget.

**What was left out, and why:**

- **eDNA, metagenomics and hilsa genetics:** not needed to answer this question, and hard to do to a good standard within the budget and time.
- **Machine learning:** with data from 15–20 areas, a predictive model cannot be validated; simple comparison and qualitative analysis are appropriate.

### Ambitious but currently impractical ideas (for learning only)

- **Multi-locus genetics.** A multi-locus SNP panel for contemporary hilsa connectivity in the Meghna–Surma–Kushiyara system, with otolith microchemistry. *Needs:* a large budget and multi-year sampling.
- **Linking water, gut and stress.** Water and gut 16S, stress markers and water quality measured in the same fish, so that Figure 18.1's dashed arrows can be tested at the correlation level. *Caution:* still not causal; a laboratory design is needed.
- **Biosecurity institutions and AMR.** Could shared-water biosecurity institutions like Sri Lanka's reduce antibiotic use in Bangladeshi shrimp or pangas farming? This links governance and AMR. Your *Salmonella*/AMR experience applies directly here, and the analogy is strong <span class="ev H">H</span>.

::: {.box .check}
<span class="label">Mastery check</span>

1. Pick one dashed arrow in Figure 18.1 and write which design would make it solid.
2. For each link in the chain "low FST → single stock → uniform ban", give one alternative explanation.
3. Which component of the proposed 12-month project, if removed, would make the "ephemeral commons" question unanswerable?
:::
