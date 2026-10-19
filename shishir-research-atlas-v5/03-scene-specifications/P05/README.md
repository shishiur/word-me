# P05 · Pabda gut-derived bacterial screening (ongoing)
Status: **specification**. Uses the P01 conventions: registration canvas, manifest IDs, evidence chips, state machine, reduced-motion and no-JS fallbacks. Evidence IDs resolve in `05-production-manifests/evidence.json`.

## P05-S01 · From the gut to the bench

| Field | Specification |
|---|---|
| Purpose | Show what is being tested in project SAURES-UGC-2025-26-Fish-067 and what is not yet known (P05-E001); species identity withheld (P05-E002). |
| Visual | Anatomical cutaway of Ompok pabda (CS-P05-PABDA), then a bench with two active gates (simulated gastric, bile salts) and four dashed gates (species ID, safety, antagonism, in vivo). |
| Motion | Window irises open (600 ms); an isolate token moves gate to gate (400 ms) once an isolate list exists. Dashed gates never animate. |
| Interaction | Open the window; step a token; open a gate for its protocol. |
| Boundary | No bacteria drawn on tissue, no benefit icons, no species name, no counts until raw CFU data are supplied. |
| Assets | P05-S01-A001 pabda illustration (image generation allowed; vector fallback exists); BioRender brief P05-S01-BR01 optional. |
