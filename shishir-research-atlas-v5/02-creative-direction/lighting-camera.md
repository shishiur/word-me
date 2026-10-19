# Lighting and camera

## Lighting (consistency sheet CS-P01-LIGHT and equivalents)

| Scene family | Key | Fill | Rim | Bounce | Shadows | Temperature |
|---|---|---|---|---|---|---|
| Market night (P01-S01/S02) | One bare bulb at canvas (760, 240), 100% | None | Wet edges facing the bulb | Cool 6500 K from the right, 8% | Down-right ≈ 35°, soft, colour #0b1517 | 2700 K |
| Lab bench (P01-S03–S05, P05) | Overhead diffuse panel | Bench reflection 30% | Glass arcs top-left | Neutral | Short contact shadows | 6500 K |
| Wetland (P02-S01, P03, P04) | Low sun 20° above horizon, from the left | Sky 40% | Water glints | Green-blue from water | Long, soft | 4500 K morning |
| Molecular (P07) | Three-point studio in Mol* | 50% | 30% | none | Ambient occlusion only | Neutral |

Readability rule: the selected object must sit at least 2 stops above the dimmed objects (implemented as `brightness(.45)` on non-targets).

## Camera

- **Projection:** fixed orthographic-feeling 2.5D; the registration canvas is 2400 × 1440 (5:3) with layers at depths 0–1.
- **Base framing:** cover-fit with focal point (1200, 760) on desktop and (1180, 1000) on phones, which show a 4:3 stage.
- **Focus:** zoom 1.6× (desktop) or 1.9× (phone) relative to base; the object anchor lands at 38%/52% of the stage (desktop) or 50%/40% (phone), so the evidence panel never covers it. The camera is clamped so the canvas edge never shows.
- **Parallax:** pointer only, ±24 px × depth horizontally, ±12 px × depth vertically; off under reduced motion and while focused.
- **Paths:** establishing dolly from (980, 520) at 1.18× to base over 2.4 s (power2.inOut); focus moves 0.85 s (power3.inOut); return 0.7 s. All moves interruptible and retargetable.
- **Implementation:** `07-motion-engine/shared/stage.ts` is shared by the website (GSAP) and Remotion, so the rendered video and the live site frame identically.
