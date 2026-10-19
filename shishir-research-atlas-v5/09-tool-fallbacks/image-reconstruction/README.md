# Image reconstruction and registration

Tools
- `measure_layers.mjs` + `measure_layers.py`: render every vector layer alone and record its true alpha bounding box (`layers/bboxes.json`). These numbers set `position` and `size` in `assets.json`.
- `check_asset.py ID file.png [--fix out/]`: size, alpha, bbox margin, silhouette overlap with the fallback (IoU ≥ 0.55) and bright-halo checks; writes `ID-review.png` (red = fallback only, blue = generated only, purple = both). `--fix` aligns the generated silhouette to the fallback bounding box and resamples into the manifest frame.

When a generated subject is wrong
1. Pick the best generation as the **master**; record it in `assets.json` (status `generated-unreviewed`).
2. Mark defects on a copy (extra digit, fin count, wrong head shape).
3. Regenerate only the defect with an inpainting mask in the same tool, or rebuild the part as vector using the fallback geometry (same canvas units) and composite it in the layer.
4. Re-run `check_asset.py`; a reviewer then ticks `10-quality-assurance/scientific-checklist.md` and sets `generated-approved`.
5. Never let a model "fix" anatomy by regenerating the whole object between frames: identity drifts. Animate the approved still in code instead.
