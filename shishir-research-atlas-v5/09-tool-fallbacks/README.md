# Implementation fallback matrix

"Built" = the fallback exists in this archive and is used or tested now.

| Problem | Fallback | Built? | Where | Quality difference |
|---|---|---|---|---|
| Image generation unavailable or not yet run | Registered vector layers, same canvas, IDs and depths | **Built, in use** | `svg/build-layers.mjs` → `08…/public/assets/p01/fallback/` | Flat-shaded illustration instead of photographic materials; composition, light direction and interaction identical |
| Generated biology inconsistent (extra fins, fingers, wrong species) | Keep the reviewed master; mask the bad region and repaint, or rebuild that part as vector | Procedure + tools built | `image-reconstruction/README.md`, `check_asset.py` | Mixed media inside one layer; acceptable if lighting matches CS-P01-LIGHT |
| Generated layers do not align | `check_asset.py --fix`: silhouette-aligned resize into the manifest frame, then re-check | **Built, self-tested** | `image-reconstruction/check_asset.py`, `10-quality-assurance/asset-tests/` | None if IoU ≥ 0.55 |
| Motionvid changes objects or anatomy | Deterministic Remotion render from the same layers | **Built, rendered** | `07-motion-engine/remotion/out/P01-S01-M010.mp4` | No ambient vapour or water glints; camera and lighting choreography identical |
| Figma unavailable (current account is View-only) | Tokens JSON/CSS/TS + running site + frame inventory | **Built** | `06-design-system/` | No editable canvas for designers until someone with an Editor seat builds it |
| Figma motion timeline unavailable | Hand-authored GSAP and Remotion | **Built** | `08…/src/scenes/station.ts`, `07…/remotion` | None (code is the source of truth) |
| BioRender unavailable | Original SVG schematics (cell, invA locus, bench gates) | **Built** | `svg/lib/illus.mjs`, `svg/lib/scenes.mjs` | Simpler iconography; no licence cost |
| GIS Cloud embedding unsuitable or no verified coordinates | Schematic SVG map with "positions approximate"; GeoJSON schema ready for verified sites | Schema built; map exists in the Phase 2 studio | `mapping/sites.schema.json` | No zoomable basemap |
| Three.js exceeds performance budget | Layered 2.5D DOM/SVG (already the default) | **Built, in use** | station engine | No true parallax occlusion; not needed for P01 |
| Large images slow mobile | Vector fallbacks weigh ≈ 90 KB for the whole station; generated layers must meet the budget in `10-quality-assurance/performance-checklist.md`; static composite for no-JS | **Built** | `public/assets/p01/fallback/p01-s01-composite.webp` | — |
| Browser testing tool unavailable | Local Playwright suite + screenshot scripts | **Built, 18/18** | `08…/tests/run.mjs` | — |
| Deployment service unavailable | `vite preview` locally; static `dist/` works on GitHub Pages under any sub-path (`base: './'`) | **Built** | `08-interactive-website` | — |
