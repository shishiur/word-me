# Typography

Faces (all OFL, served by Google Fonts on the web and self-hosted in Remotion): **Newsreader** (display), **Instrument Sans** (reading and UI), **IBM Plex Mono** (labels, numbers, annotations). Scale and styles: `tokens.json → type.*`; Figma text styles: `figma-handoff/frames.json`.

Annotation hierarchy, from loudest to quietest:
1. Scene title (Display/XL or L), one per scene.
2. Big number (Number/L, tabular) with its evidence chip on the same line.
3. Object name in the panel (Display/M).
4. Body and lede.
5. Eyebrow label: scene ID and method, uppercase mono.
6. Annotation: provenance, caveats, IDs. Never smaller than 12 px.

Rules: headings `text-wrap: balance`; body ≤ 65 characters; numbers tabular; scientific names italic in body copy; IDs (P01-E004) always mono.
