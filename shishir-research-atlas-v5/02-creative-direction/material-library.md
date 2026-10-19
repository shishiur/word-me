# Material library

Generated from 05-production-manifests/materials.json. Values are art-direction targets (0–1) for image prompts and, if 3D is ever used, PBR parameters.

| ID | Roughness | Specular | Translucency | Moisture | Microtexture | Light response |
|---|---|---|---|---|---|---|
| MAT-FISH-SKIN-WET | 0.3 | 0.55 | 0.05 | high: thin water film, sharp specular streak along the lateral line | Cycloid scales 8–12 px, overlapping toward the tail | Silver flank mirrors the bulb as a long soft streak; dorsum absorbs |
| MAT-FISH-FLESH-CUT | 0.45 | 0.35 | 0.25 | high | Concentric W-shaped myomere rings; white centrum; faint blood at the spinal artery only | Subsurface warmth; no gloss halo |
| MAT-BAMBOO-WET | 0.6 | 0.15 | 0 | medium: darkened weave on the lower half | Strips 8–10 mm, over-under weave at 24° | Matte, warm rim on top edge |
| MAT-ALUMINIUM-WATER | 0.35 | 0.7 | 0 | surface water slightly turbid | Dents, brushed circular marks | Anisotropic highlight on rim; one bulb reflection on water |
| MAT-SKIN-HAND | 0.5 | 0.2 | 0.3 | low sheen on knuckles | Natural skin creases at knuckles and wrist | Subsurface scattering on fingertips facing the bulb |
| MAT-STEEL-BLADE | 0.15 | 0.9 | 0 | wet film near the edge | Grinding marks parallel to the edge; slight patina toward the spine | Thin bright line along the concave edge |
| MAT-WOOD-WET | 0.65 | 0.15 | 0 | damp dark patches near the fish | Growth rings, radial cracks, knife scores | Warm, matte |
| MAT-TUNGSTEN | 0 | 1 | 1 | none | Filament not visible at this scale | 2700 K source; bloom radius 60 px |
| MAT-STEEL-DULL | 0.6 | 0.3 | 0 | none | Rust spots | Silhouette only |
| MAT-AGAR-XLD | 0.2 | 0.4 | 0.5 | surface sheen | Faint streak tracks | Backlit red; colonies domed with a small highlight |
| MAT-AGAR-MH | 0.25 | 0.35 | 0.6 | surface sheen | Bacterial lawn matte, zones clearer | Amber transmission from below |
| MAT-GLASS-LAB | 0.05 | 0.9 | 0.95 | none | Rim refraction | Bright arc highlight top-left |

Definitions: roughness 0 = mirror, 1 = chalk; translucency = subsurface or transmitted light share.
