# End-to-end production proof (P01)

Each stage lists input → output → validation → fallback, and whether it has been run.

| Stage | Input | Output | Validation | Fallback | Run in this archive? |
|---|---|---|---|---|---|
| 1 Generate or reconstruct assets | Prompts + reference crops (`04-generation-prompts/image`) | 8 raster layers | `check_asset.py` + scientific checklist | Vector layers (in use) | **Not run**: Claude has no image-generation tool here. The checker and drop-in path were proven with a stand-in (T18). |
| 2 Assemble the layered environment | Generated or vector layers + `assets.json` | Registered stage | Layer bboxes match `bboxes.json`; composite reviewed | — | **Run with vector layers** (`reference/P01-S01-composite.png`) |
| 3 Cinematic motion sequence | Same layers + `shared/stage.ts` | `P01-S01-M010.mp4` (8 s, 1920 × 1080, 30 fps, 240 frames) | Frames decoded from the MP4 and reviewed | GSAP live sequence | **Run** (vector layers) |
| 4 User-controlled interaction | `08-interactive-website/src` | Working site | State machine log, camera values | — | **Run** |
| 5 Browser integration | `npm run build` | `dist/` | `vite build` + `tsc` clean | — | **Run** |
| 6 Screenshots desktop and mobile | `npm test` | `tests/screens/*.png` | 18/18 checks | — | **Run** |
| 7 Review | Screens + checklist + iteration protocol | Approval or iteration | Human sign-off | Keep fallback | **Partly**: Claude reviewed composition, motion and interaction; anatomy and realism review of generated assets awaits stage 1 |

Result: the pilot is a working, tested interactive experience at **vector-fallback fidelity**. It becomes production-ready only after stage 1 assets pass stage 7.
