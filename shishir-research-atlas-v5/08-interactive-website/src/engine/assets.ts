// Resolve each manifest asset to a generated file (if registered in generated/index.json) or its vector fallback.
import { CANVAS } from '../../../07-motion-engine/shared/stage';

export type AssetEntry = { id: string; layer: string; file: string; fallback: string; depth?: number; z?: number; size?: number[] | null; position?: number[]; bleed?: number; offset?: number[]; status: string; objects?: string[] };
export type Resolved = { asset: AssetEntry; src: string; kind: 'generated' | 'fallback'; rect: { x: number; y: number; w: number; h: number } };

export async function loadGeneratedIndex(base: string): Promise<Set<string>> {
  try {
    const r = await fetch(`${base}generated/index.json`, { cache: 'no-store' });
    if (!r.ok) return new Set();
    return new Set(((await r.json()).files as string[]) || []);
  } catch { return new Set(); }
}

export function resolve(asset: AssetEntry, base: string, generated: Set<string>): Resolved {
  const full: Resolved['rect'] = { x: 0, y: 0, w: CANVAS.w, h: CANVAS.h };
  const gen = [asset.file, asset.file.replace(/\.webp$/, '.png')].find((f) => generated.has(f));
  if (gen && asset.size) {
    let rect: Resolved['rect'] = full;
    if (asset.position) rect = { x: asset.position[0], y: asset.position[1], w: asset.size[0], h: asset.size[1] };
    else if (asset.offset) rect = { x: asset.offset[0], y: asset.offset[1], w: asset.size[0], h: asset.size[1] };
    else if (asset.bleed) rect = { x: -asset.bleed, y: 0, w: asset.size[0], h: asset.size[1] };
    return { asset, src: `${base}generated/${gen}`, kind: 'generated', rect };
  }
  return { asset, src: `${base}${asset.fallback}`, kind: 'fallback', rect: full };
}

/** Preload with a timeout; resolves true when decoded. Errors never throw. */
export function preload(src: string, ms = 8000): Promise<boolean> {
  return new Promise((ok) => {
    const img = new Image();
    const t = setTimeout(() => ok(false), ms);
    img.onload = () => { clearTimeout(t); (img.decode ? img.decode() : Promise.resolve()).then(() => ok(true), () => ok(true)); };
    img.onerror = () => { clearTimeout(t); ok(false); };
    img.src = src;
  });
}
