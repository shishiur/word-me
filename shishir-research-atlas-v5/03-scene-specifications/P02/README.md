# P02 · Hilsa (Tenualosa ilisha) molecular genetics
Status: **specification**. Uses the P01 conventions: registration canvas, manifest IDs, evidence chips, state machine, reduced-motion and no-JS fallbacks. Evidence IDs resolve in `05-production-manifests/evidence.json`.

## P02-S01 · Two places, one river system

| Field | Specification |
|---|---|
| Purpose | Locate the two sampled sites, Hakaluki Haor and the Surma River, three specimens each (P02-E001). |
| Visual | Static schematic map (existing SVG in the Phase 2 studio). Positions approximate; site-level badges only. |
| Motion | Badge opens into three specimen glyphs (300 ms). No moving water: animation would argue connectivity before the evidence does. |
| Interaction | Select a site (click, tap, Enter). |
| Boundary | No sampling points, no routes; GIS only if verified coordinates are supplied (`09-tool-fallbacks/mapping/sites.schema.json`). |
| Assets | P02-S01-A001 painted haor panorama (optional image generation, CS-P02 lighting: low sun 20°, 4500 K). |

## P02-S02 · One fish, one gene, 1,114 positions

| Field | Specification |
|---|---|
| Purpose | cytb alignment of 1,114 positions, 1,099 invariant; FST 0.000–0.017 (P02-E001, P02-E002); sample size pinned. |
| Visual | Stylised specimen plate (CS-P02-HILSA) → schematic mitogenome ring → alignment thread. Bases show as N until the FASTA arrives (P02-E003 missing). |
| Motion | Inward zoom fish → ring (900 ms), ring → thread unroll (700 ms); magnifier follows scrub with an 80 ms lag. |
| Interaction | Scrub the thread (pointer, arrow keys, Home/End); toggle "what n = 3 can show". |
| Boundary | No sequences, trees or haplotype networks until supplied; collaborative paper, role per CRediT only. |
| Assets | P02-S02-A001 hilsa specimen plate (image generation allowed as illustration; vector fallback exists); thread and ring stay vector. |
