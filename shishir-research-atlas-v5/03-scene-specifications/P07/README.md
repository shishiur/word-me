# P07 · Rice-blast effector modelling (computational)
Status: **specification**. Uses the P01 conventions: registration canvas, manifest IDs, evidence chips, state machine, reduced-motion and no-JS fallbacks. Evidence IDs resolve in `05-production-manifests/evidence.json`.

## P07-S01 · Effector structures

| Field | Specification |
|---|---|
| Purpose | 14 effector structures, docking and 100 ns MD; 13th of 17 authors; no experimental validation (P07-E001). |
| Visual | Lazy-loaded Mol* viewer of the real PDB entries (the 14 IDs listed in the paper: 7NLJ, 6FUD, 7QPX, 7BNT, 6G11, 7B1I, 6Q76, 5Z1V, 7PP2, 2LW6, 7NMM, 72JY, 7ZK0, 7ZKD; each must be resolved against rcsb.org before build, as none was fetched in this session). Banner: “in silico prediction”. |
| Motion | User-driven rotation only; no auto-spin. |
| Interaction | Pick an effector; reset view. |
| Boundary | Docked poses only if complex files are supplied; Three.js not used because Mol* already renders real data. |
| Assets | None generated; structures fetched from the PDB at runtime. |
