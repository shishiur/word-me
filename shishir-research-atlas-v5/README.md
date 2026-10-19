# Shishir Research Atlas v5 · production package

A tested, interactive P01 pilot (Salmonella and AMR) plus the manifests, prompts, tools and handoff documents needed to finish it with external visual tools and to extend the system to P02–P08.

**Read this first: what is finished and what is not.** The interactive pilot works and passes 18 browser checks, but its environment is drawn with *vector fallback layers*. The photographic layers it is designed for are specified, prompted and checkable, but have not been generated. See `11-production-handoff/completion-status.md`.

## Quick start

```sh
npm install                                   # archive root (ajv)
npm run manifests                             # emit + validate all manifests, regenerate prompt docs
cd 08-interactive-website && npm install && npm run build && npm run preview   # http://127.0.0.1:4173/
node tests/run.mjs path/to/axe.min.js         # second shell: 18 checks + screenshots
cd ../07-motion-engine/remotion && npm install && npm run studio   # or: npm run render -- --browser-executable=…
```

## Map

| Folder | Contents |
|---|---|
| `01-source-audit` | What was reused from Phase 2; evidence gaps that change visuals |
| `02-creative-direction` | Art direction, colour, typography, materials, lighting and camera |
| `03-scene-specifications` | P01 production brief (5 scene contracts); P02–P08 specifications |
| `04-generation-prompts` | Image prompts per asset ID with reference renders; Motionvid shots; BioRender briefs |
| `05-production-manifests` | `source.mjs` (single source) → JSON manifests + schemas + production status |
| `06-design-system` | Tokens (JSON, CSS, TS) and the Figma handoff |
| `07-motion-engine` | `shared/stage.ts` (camera maths used by both runtimes) and the Remotion workspace with the rendered MP4 |
| `08-interactive-website` | Vite + TypeScript + GSAP site, tests and screenshots |
| `09-tool-fallbacks` | Vector layer builder, asset checker and normaliser, mapping schema, fallback matrix |
| `10-quality-assurance` | Scientific and performance checklists, visual iteration protocol, checker self-test |
| `11-production-handoff` | ChatGPT tool routing, asset-to-code contract, end-to-end proof, order, sequence, dependencies, status |

Not deployed. The live portfolio (`index.html` on `main`) is untouched.
