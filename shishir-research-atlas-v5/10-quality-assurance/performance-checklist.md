# Performance

Measured on 19 Oct 2026 (headless Chromium 141, software rendering, local `vite preview`). These are measurements from this container, not field results on phones.

| Measure | Value | Source |
|---|---|---|
| JS bundle | 164.5 KB (63.6 KB gzip), GSAP + ScrollTrigger included | `vite build` |
| CSS | 17.9 KB (5.1 KB gzip) | `vite build` |
| Station vector layers (10 SVG) | ≈ 90 KB total | `public/assets/p01/fallback` |
| Navigation → interactive (`data-ready`) | 1,370 ms | test T01 |
| Frame rate during a focus move | 38 fps (software GPU; expect higher on real devices) | test T06 |

Budgets for generated layers (to check when they arrive)
- Background A001 ≤ 600 KB WebP at 2880 × 1440; floor A002 ≤ 250 KB.
- Each object layer ≤ 350 KB (PNG with alpha may be converted to lossy WebP with alpha, quality 85).
- Total station payload ≤ 2.5 MB desktop; serve 50% scaled copies below 900 px viewport (`srcset`), to be added when files exist.
- Re-run T01 and T06 after integration; record the new numbers here.

Not yet measured: Lighthouse on a throttled mobile profile, real-device frame rates, memory with generated layers.
