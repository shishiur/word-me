# Colour system

Machine-readable values: `../06-design-system/tokens.json` (`color.*`). Generated CSS: `tokens.css`.

| Role | Tokens | Rule |
|---|---|---|
| Global surfaces | `surface.night #0b1517`, `surface.paper #eef2f1`, `surface.ink #13202a` | Night for market scenes, paper for lab, ink for evidence and conclusions |
| Market | `market.tungsten #f2ab46`, `market.bulb #ffe2a6`, `market.steel #9fb2b7` | Tungsten is the only warm accent in night scenes |
| Laboratory | `lab.xld #cf4257`, `lab.h2s #160c0e`, `lab.mh-agar #cfa159` | Agar colours are chemistry, not branding: keep them exact |
| Aquatic | `aquatic.haor-teal #1f6f78`, `aquatic.hilsa-silver #d3dcdf`, `aquatic.iridescent-violet #7d6fb0` | Iridescence never above 40% opacity |
| Wetland | `wetland.reed #8fbf9a`, `wetland.sediment #b4874a` | Used for P03/P04 and the P08 braid ground |
| Molecular | `molecular.backbone #5d6f7a`, `molecular.highlight #e9d9a6` | Highlight = selected residue or gene |
| Interaction | `interactive.hover #ffe2a6`, `interactive.selected #f2ab46`, focus rings `#f2ab46` (night) / `#3f7ea6` (paper) | Focus ring always 3 px, 2 px offset |
| Evidence | `evidence.disputed #a3283b` (paper) / `#e06a7a` (night); others use the text colour | Status is carried by glyph shape first, colour second |
| Data | `data.resistant #b8323f`, `data.intermediate #e2b44f`, `data.susceptible #4f8f6e` | Only for S/I/R; never reused elsewhere |

Contrast: all text tokens pass WCAG AA on their surface (checked by axe-core in `08-interactive-website/tests`).
