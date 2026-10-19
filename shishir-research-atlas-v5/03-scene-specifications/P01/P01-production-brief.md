# P01 production brief · Salmonella and antimicrobial resistance

Pilot status: **interactive build complete and browser-tested (18/18) with vector fallback layers.** The defining photographic layers (P01-S01-A001, A002, A010–A015) are specified but not yet generated, so the pilot is **not** a finished high-fidelity scene. See `11-production-handoff/completion-status.md`.

All IDs below resolve in `05-production-manifests/*.json`. Coordinates are on the 2400 × 1440 registration canvas (`canvas.json`).

---

## P01-S01 · Enter the fish-processing station

| Field | Specification |
|---|---|
| Scientific purpose | Show the retail interface the study sampled: fish, water, handler, tool and surfaces at one station (P01-E001). |
| Narrative purpose | Arrive somewhere real before any number appears. |
| Visitor question | Where were the samples taken? |
| Evidence status | Layout illustrative (P01-E015); design counts researcher record (P01-E001). |
| Foreground | Handler's forearm and hand (O005, depth 1.0). |
| Midground | Bowl O004 (0.8), block O007 (0.75), fish O001/O002 (0.78), bonti O006 (0.82), basket O003 (0.85). |
| Background | Tin wall, balance-scale silhouette O009, stall bokeh (A001, 0.15); wet floor (A002, 0.35); bulb, glow and light cone (A003, 0.2). |
| Atmosphere | Grain and vignette (A004, vector, procedural). |
| Perspective | Eye-level wall; floor objects seen from about 55° elevation. |
| Desktop framing | Stage 5:3, cover-fit, focal (1200, 760). Panel at right; UI safe zone = right 34% when focused. |
| Mobile framing | Stage 4:3, focal (1180, 1000); panel below the stage; hotspots off-stage are hidden, chips reach all seven. |
| Motion | M001 establishing dolly (2.4 s, power2.inOut, from (980, 520) at 1.18×); M002 bulb flicker (1.6 s, stepped); M003 pointer parallax. All skip under reduced motion; any selection or scroll ends M001 at its final state. |
| Interaction | Pointer parallax (I003). Selection begins in S02. |
| States | loading → establishing → overview |
| Acceptance | T01, T07, T14, T16, T17 pass; composite reads as one coherent light; no object floats (contact shadows present). |

## P01-S02 · Explore the seven sampling matrices

| Field | Specification |
|---|---|
| Scientific purpose | Tie each sampled matrix to what the record says: detection for skin 9/22, basket 8/22, flesh 3/22 events (P01-E005); four names inferred (P01-E006), counts missing (P01-E007), method missing (P01-E014). |
| Visitor question | What did each surface show? |
| Object registry | `objects.json` O001–O007 (anchors, measured bboxes, depths, materials). Hotspot markers sit off-object at `src/data/p01.ts → MARKERS`. |
| Motion | M004 focus camera (0.85 s, power3.inOut, 1.6× desktop / 1.9× phone, anchor to 38%/52% or 50%/40%); M005 spotlight and dim (non-target object layers brightness .45); M006 return (0.7 s). Retargeting overwrites the running tween; stale completions are ignored by the state machine. |
| Interaction | I001 select (click, tap, Tab + Enter, keys 1–7, ←/→ cycle with focus following the camera); I002 reset (button, Esc). Hover only brightens the leader. |
| States | overview → object-focused → evidence-revealed → overview (`src/engine/machine.ts`, pure `transition()`). |
| Evidence panel | Matrix n of 7 + object ID, count or "—", lens-dependent phrase, chips linked to evidence IDs, reset button. |
| Scientific boundary | Co-occurrence at a station is not a transfer pathway; no arrows between objects; no per-sample result is shown. |
| Acceptance | T02–T05, T08, T15 pass. Visually: the selected object is clearly the brightest thing on stage; the panel never covers it. |

## P01-S03 · Laboratory workflow

| Field | Specification |
|---|---|
| Purpose | 154 linked samples → 62 XLD-suspect candidates (unit unconfirmed, P01-E002) → 40 biochemically compatible isolates (P01-E003). |
| Visitor question | How did 154 samples become 40 isolates? |
| Environment | Transition band from night to bench (M007, scroll-scrubbed, reversible); optional defocused bench plate A030 (not required). |
| Objects | Illustrative XLD plate A031 (vector-final: colony types are filtered by attribute); 154 count marks (14 × 11). |
| Motion | M008 marks empty from the end with 3 ms stagger; count tweens. |
| Interaction | I003 sieve steps; I004 colony reader (reference science REF-001). |
| Boundary | Marks are counts only; the plate is not a study plate. |
| Acceptance | T09, T10 pass. |

## P01-S04 · Molecular confirmation

| Field | Specification |
|---|---|
| Purpose | Present the invA method (REF-002) and the two conflicting accounts (P01-E004) without a gel image. |
| Visitor question | Were the isolates confirmed as Salmonella? |
| Objects | Schematic cell, invA locus schematic, empty gel lane template A040 (status: missing; must be the researcher's original photograph). |
| Interaction | I005 account switch (header radio or card button). Re-labels the funnel, panel phrases and later chapters. |
| Boundary | No bands, no ticks or crosses, no amplicon size until the primer record arrives. |
| Acceptance | T08 passes. |

## P01-S05 · Antimicrobial susceptibility

| Field | Specification |
|---|---|
| Purpose | Read a disc-diffusion zone against CLSI reference breakpoints (REF-003), then show the study's aggregate counts: AMP 24/40, TE 20/40 (P01-E008); CTX, CIP "lower but notable" without values (P01-E009); MDR 14/40, mean MAR 0.267 (P01-E010). |
| Visitor question | How resistant were the isolates? |
| Objects | Illustrative MH plate A050 (vector-final: zone radius is simulator state, M009). |
| Interaction | I006 agent buttons, disc buttons, range input; I007 MDR toggle. |
| Boundary | No isolate-level antibiogram until P01-E012 arrives; marks are not linked to isolates. |
| Acceptance | T11, T12 pass. |

---

## Mobile adaptation

Header wraps to two rows (brand + account switch, then the sample path). Stage 4:3 with phone framing; hotspots 32 px; chips wrap; panels stack under the stage; the plate sections stack to one column. Tested at 390 and 360 px (T15, T16).

## Accessibility implementation

Semantic sections with headings; hotspots are real buttons with names and `aria-pressed`; chips duplicate every hotspot; keys 1–7, arrows and Esc; live region announces selections and account changes; visible focus rings on both surfaces; status carried by chip shape as well as colour; `prefers-reduced-motion` removes every tween and the dolly (T14); the page reads fully without JavaScript (T17); axe-core finds no serious or critical issue (T13).
