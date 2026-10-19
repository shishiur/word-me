// Deterministic stage math shared by the GSAP website and the Remotion renders.
// World space = the 2400 × 1440 registration canvas. Screen space = the stage element in CSS px.
export const CANVAS = { w: 2400, h: 1440 } as const;

export type Pt = { x: number; y: number };
export type Xf = { x: number; y: number; s: number }; // screen = canvas * s + (x, y)

/** Cover-fit the canvas into the stage, keeping `focal` (canvas px) at the given screen fraction. */
export function baseTransform(stageW: number, stageH: number, focal: Pt = { x: 1200, y: 900 }, at: Pt = { x: 0.5, y: 0.55 }): Xf {
  const s = Math.max(stageW / CANVAS.w, stageH / CANVAS.h);
  return clamp({ s, x: at.x * stageW - focal.x * s, y: at.y * stageH - focal.y * s }, stageW, stageH);
}

/** Camera that brings `anchor` to screen fraction `at`, zoomed by `zoom` relative to the base fit. */
export function focusTransform(stageW: number, stageH: number, anchor: Pt, zoom: number, at: Pt): Xf {
  const s = baseTransform(stageW, stageH).s * zoom;
  return clamp({ s, x: at.x * stageW - anchor.x * s, y: at.y * stageH - anchor.y * s }, stageW, stageH);
}

/** Never reveal the area outside the canvas. */
export function clamp(t: Xf, stageW: number, stageH: number): Xf {
  const minX = stageW - CANVAS.w * t.s, minY = stageH - CANVAS.h * t.s;
  return { s: t.s, x: Math.min(0, Math.max(minX, t.x)), y: Math.min(0, Math.max(minY, t.y)) };
}

export const lerpXf = (a: Xf, b: Xf, k: number): Xf => ({ s: a.s + (b.s - a.s) * k, x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
export const toScreen = (p: Pt, t: Xf): Pt => ({ x: p.x * t.s + t.x, y: p.y * t.s + t.y });

/** Parallax offset in canvas px for a layer of the given depth (0 = far, 1 = near). */
export const parallax = (depth: number, px: number, py: number, amp = { x: 24, y: 12 }): Pt => ({ x: px * amp.x * depth, y: py * amp.y * depth });

/** P01-S01-M002 bulb flicker: opacity at normalised time u in [0, 1] (stepped). */
const FLICKER: [number, number][] = [[0, 0.2], [0.13, 1], [0.19, 0.35], [0.29, 1], [0.42, 0.6], [0.48, 1]];
export function flicker(u: number): number {
  let v = FLICKER[0][1];
  for (const [t, o] of FLICKER) if (u >= t) v = o;
  return v;
}

/** Framing presets (screen fractions) per layout, matching motion.json P01-S02-M004. */
export const FRAMING = {
  desktop: { zoom: 1.6, at: { x: 0.38, y: 0.52 } },
  mobile: { zoom: 1.9, at: { x: 0.5, y: 0.4 } },
} as const;
