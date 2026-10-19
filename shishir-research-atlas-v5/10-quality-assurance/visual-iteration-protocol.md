# Visual iteration protocol

Use after every generation, render or layout change. Diagnose the symptom, then apply the matching fix and re-check. Two failed rounds of the same fix means: fall back to the vector layer and log it in `production-status.json`.

| Symptom | Diagnosis | Fix |
|---|---|---|
| Object looks pasted on | Missing contact shadow, or the light direction disagrees with CS-P01-LIGHT | Regenerate with the lighting block verbatim; keep shadows in A015/A002, not in object layers |
| Halo around an object | Matte fringe from a white or grey background | Regenerate with transparency, or `check_asset.py --fix` then defringe; must pass the halo check |
| Anatomy wrong | The model improvised | Inpaint only the defect against the master; never regenerate the whole object |
| Scene flat | Values compressed; every object equally bright | Increase key/fill ratio (selected ≥ 2 stops over dimmed); darken the far wall (A001 vignette) |
| Camera move feels aimless | Target framing lands under UI or at the stage edge | Check FRAMING `at` values; anchor must land at 38%/52% (desktop) and stay clear of the panel |
| Motion feels mechanical | Linear easing or equal timing everywhere | Use the motion tokens: focus power3.inOut 0.85 s, reveal power2.out 0.5 s |
| Generated video drifts | Identity changes between frames | Discard; use the Remotion render (deterministic) |
| Label unreadable | Text over busy art | Move into the panel or add a scrim (as in the Remotion title card) |

Logged iterations in this pilot: market scene exposure raised and the hand redrawn; layer bounding boxes re-measured after the first estimates were wrong; hotspots hidden when off-stage instead of stacking at the edge; Remotion title collided with the bowl, fixed with a scrim; halo check rewritten twice after false positives on legitimate light interiors and shadows.
