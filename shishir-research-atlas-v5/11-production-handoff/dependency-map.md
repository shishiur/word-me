# Dependency map

```
05-production-manifests/source.mjs ──build.mjs──▶ *.json + schemas ──▶ 04-generation-prompts/*
        │                                              │
        │                                              ├──▶ 08-interactive-website (imports objects, assets, motion, evidence)
        │                                              └──▶ 07-motion-engine/remotion (imports assets, objects)
06-design-system/tokens.json ──build-tokens──▶ tokens.css / tokens.ts ──▶ website + Remotion
07-motion-engine/shared/stage.ts ──▶ website camera (GSAP) + Remotion camera
09-tool-fallbacks/svg/lib (illustration library) ──build-layers──▶ public/assets/p01/fallback (website + Remotion)
        └──measure_layers──▶ layers/bboxes.json ──▶ assets.json positions (manual update in source.mjs)
generated assets (external) ──check_asset.py──▶ public/assets/p01/generated + index.json ──▶ website, Remotion
```
External: GSAP 3.15.0, Vite 8.3.4, TypeScript 5.9.3, Remotion 4.0.536, React 19.2.0, ajv 8.20.0, Playwright (system), Pillow and NumPy (Python).
