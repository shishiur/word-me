# Reusable elements from Phase 2 (inspected 19 Oct 2026)

Inspected: `research-atlas-phase2-bundle.zip` (90 files) and the `atlas/` folder on branch `ccr-77b45c3f-z25s5k`.

| Element | Reused as | Change |
|---|---|---|
| Illustration library (`illus.mjs`, `scenes.mjs`) | `09-tool-fallbacks/svg/lib` | Market scene split into 10 registered layers with markers |
| P01 data and evidence register | `05-production-manifests/source.mjs` | Every value now has a stable evidence ID |
| Prototype interactions (sieve, colony reader, account switch, zone simulator) | `08-interactive-website/src/scenes/lab.ts` | Rewritten in TypeScript with GSAP; zone tween and ScrollTrigger transition added |
| Station hotspots and spotlight | `src/scenes/station.ts` | Replaced the flat SVG with a layered 2.5D stage, state machine and focus camera |
| Concept boards and storyboards | Kept in `atlas/` | Direction choices carried into `02-creative-direction` |
| Playwright test approach | `08-interactive-website/tests/run.mjs` | New suite for the state machine and asset drop-in |

Not reused: the 154-sample ledger chapter (kept in the Phase 2 slice; not part of the five pilot scenes).
