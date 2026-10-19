# Asset-to-code integration contract

| Property | Rule |
|---|---|
| Coordinate system | 2400 × 1440 px registration canvas, origin top-left (`canvas.json`). Vector fallbacks use viewBox 0 0 1200 720 = canvas ÷ 2. |
| File names | Exactly `assets.json → file` (lowercase, `p01-s01-a0xx-name.ext`). The site only loads names listed in `generated/index.json`, which `npm run assets` writes. |
| Formats | Opaque layers: WebP (quality 82–85). Alpha layers: PNG straight alpha, or WebP with alpha. sRGB. No embedded text. |
| Dimensions | Exactly `size`. Background A001 2880 × 1440 placed at x = −240 (bleed for parallax). Floor A002 2880 × 640 at (−240, 800). Objects at `position`. |
| Pivots | `pivot` (px within the asset) is the scale and rotation origin if an asset is ever animated on its own. Current motion moves the whole world, so pivots are reserved. |
| Anchors | `objects.json → anchor`: the point the focus camera centres and the spotlight targets. Must fall on the object surface in the generated image. |
| Masks and alpha | Corners fully transparent; ≥ 4 px margin; soft shadows allowed only in A015 and A002; no matte halo (checker). |
| Scale | The object's silhouette must overlap the measured fallback silhouette with IoU ≥ 0.55 after alignment; `--fix` aligns to the fallback bounding box. |
| Lighting | CS-P01-LIGHT: key at (760, 240), 2700 K; shadows down-right; no other warm source. |
| Depth | `depth` 0–1 drives parallax (24 × 12 px × depth); `z` sets stacking. Do not change either without updating the manifest. |
| Replacement procedure | 1) run `check_asset.py`; 2) copy into `public/assets/p01/generated/` (and Remotion `public/…/generated/`); 3) `npm run assets`; 4) set status `generated-unreviewed` in `source.mjs`, `npm run manifests`; 5) `npm run build && npm test`; 6) reviewer ticks the checklist → `generated-approved`. Removing the file restores the fallback automatically. |
| Proof | Test T18 performs steps 1–3 with a colour-shifted stand-in and confirms the site places it at the manifest coordinates and the badge reads "1 of 8 generated layers". |
