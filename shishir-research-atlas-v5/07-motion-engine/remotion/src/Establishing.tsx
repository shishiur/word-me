import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Img, interpolate, Easing, staticFile, useCurrentFrame, useVideoConfig, delayRender, continueRender } from 'remotion';
import { baseTransform, focusTransform, lerpXf, toScreen, flicker, FRAMING, CANVAS, type Xf } from '../../shared/stage';
import assets from '../../../05-production-manifests/assets.json';
import objects from '../../../05-production-manifests/objects.json';
import { tokens } from '../../../06-design-system/tokens';

export type EstablishingProps = { tour: string[]; generated: string[] };
type Asset = (typeof assets)[number];
const station = (assets as Asset[]).filter((a) => a.id.startsWith('P01-S01')).sort((a, b) => (a.z ?? 0) - (b.z ?? 0));
const MATRIX_OBJECT: Record<string, string> = { skin: 'P01-S01-O001', flesh: 'P01-S01-O002', basket: 'P01-S01-O003', water: 'P01-S01-O004', hands: 'P01-S01-O005', tool: 'P01-S01-O006', board: 'P01-S01-O007' };
const anchorOf = (m: string) => objects.find((o) => o.id === MATRIX_OBJECT[m])!.anchor;
const assetOf = (m: string) => objects.find((o) => o.id === MATRIX_OBJECT[m])!.asset;
const ease = Easing.inOut(Easing.cubic);
const C = tokens.color;
// Fonts are self-hosted (OFL) so renders never depend on network access.
const FONTS = [['IBM Plex Mono', 'ibm-plex-mono-latin-400-normal.woff2', '400'], ['IBM Plex Mono', 'ibm-plex-mono-latin-500-normal.woff2', '500'], ['Newsreader', 'newsreader-latin-opsz-normal.woff2', '200 800'], ['Instrument Sans', 'instrument-sans-latin-wght-normal.woff2', '400 700']]
  .map(([fam, file, w]) => `@font-face{font-family:'${fam}';src:url(${staticFile(`fonts/${file}`)}) format('woff2');font-weight:${w};font-display:block}`).join('');

function source(a: Asset, generated: string[]) {
  const full = { x: 0, y: 0, w: CANVAS.w, h: CANVAS.h };
  const g = generated.find((f) => f === a.file || f === a.file.replace(/\.webp$/, '.png'));
  if (g && a.size) {
    const pos = 'position' in a && a.position ? a.position : 'offset' in a && a.offset ? a.offset : [-(('bleed' in a && a.bleed) || 0), 0];
    return { src: staticFile(`assets/p01/generated/${g}`), rect: { x: pos[0], y: pos[1], w: a.size[0], h: a.size[1] } };
  }
  return { src: staticFile(`assets/p01/${a.fallback}`), rect: full };
}

export const Establishing: React.FC<EstablishingProps> = ({ tour, generated }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => { Promise.all(['400 16px "IBM Plex Mono"', '400 16px Newsreader'].map((q) => document.fonts.load(q))).then(() => continueRender(handle), () => continueRender(handle)); }, [handle]);
  const vertical = H > W;
  const base = baseTransform(W, H, vertical ? { x: 1180, y: 1000 } : { x: 1200, y: 760 }, { x: 0.5, y: 0.5 });
  const start = focusTransform(W, H, { x: 900, y: 420 }, 1.35, { x: 0.5, y: 0.42 });
  const fr = vertical ? FRAMING.mobile : FRAMING.desktop;

  // camera keyframes: dolly (40–110), tour stops (120–210), return (210–232)
  let cam: Xf = lerpXf(start, base, interpolate(f, [40, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }));
  let focus: string | null = null, spot = 0;
  tour.forEach((m, i) => {
    const a = 120 + i * 30, target = focusTransform(W, H, anchorOf(m), fr.zoom * 0.85, fr.at);
    const prev = i === 0 ? base : focusTransform(W, H, anchorOf(tour[i - 1]), fr.zoom * 0.85, fr.at);
    if (f >= a && f < a + 30) { cam = lerpXf(prev, target, interpolate(f, [a, a + 18], [0, 1], { extrapolateRight: 'clamp', easing: ease })); focus = m; spot = 1; }
  });
  const endStart = 120 + tour.length * 30;
  if (f >= endStart) { cam = lerpXf(focusTransform(W, H, anchorOf(tour[tour.length - 1]), fr.zoom * 0.85, fr.at), base, interpolate(f, [endStart, endStart + 22], [0, 1], { extrapolateRight: 'clamp', easing: ease })); spot = interpolate(f, [endStart, endStart + 10], [1, 0], { extrapolateRight: 'clamp' }); focus = spot > 0 ? tour[tour.length - 1] : null; }
  if (f >= 120 && f < 128) spot = interpolate(f, [120, 128], [0, 1]);

  const lit = interpolate(f, [12, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bulb = f < 12 ? 0.12 : flicker(interpolate(f, [12, 60], [0, 1], { extrapolateRight: 'clamp' }));
  const sp = focus ? toScreen(anchorOf(focus), cam) : { x: W / 2, y: H / 2 };
  const title = interpolate(f, [214, 232], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: C.surface.night, overflow: 'hidden', fontFamily: tokens.font.body }}>
      <style>{FONTS}</style>
      <div style={{ position: 'absolute', left: 0, top: 0, width: CANVAS.w, height: CANVAS.h, transformOrigin: '0 0', transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})` }}>
        {station.map((a) => {
          const s = source(a, generated);
          const isLight = a.id === 'P01-S01-A003';
          const dim = focus && a.layer === 'object' && a.id !== assetOf(focus) ? 0.45 : 1;
          return (
            <div key={a.id} style={{ position: 'absolute', left: s.rect.x, top: s.rect.y, width: s.rect.w, height: s.rect.h, opacity: isLight ? bulb : lit, filter: `brightness(${dim})` }}>
              <Img src={s.src} style={{ width: '100%', height: '100%', display: 'block' }} />
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{ opacity: spot * 0.9, background: `radial-gradient(circle at ${sp.x}px ${sp.y}px, transparent 0, transparent ${W * 0.11}px, rgba(3,8,10,.6) ${W * 0.22}px)` }} />
      <AbsoluteFill style={{ opacity: title, background: 'linear-gradient(180deg, rgba(11,21,23,0) 35%, rgba(11,21,23,.82) 78%, rgba(11,21,23,.94) 100%)' }} />
      <div style={{ position: 'absolute', left: W * 0.05, bottom: H * 0.08, opacity: title, transform: `translateY(${(1 - title) * 24}px)` }}>
        <div style={{ font: `500 ${W * 0.0105}px ${tokens.font.mono}`, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.market.tungsten }}>P01 · Salmonella &amp; AMR</div>
        <div style={{ font: `400 ${W * (vertical ? 0.06 : 0.036)}px/1.05 ${tokens.font.display}`, color: C.text['on-night'], maxWidth: vertical ? '90%' : '60%' }}>Seven surfaces at one cutting station</div>
      </div>
      <div style={{ position: 'absolute', right: W * 0.02, bottom: H * 0.025, font: `400 ${W * 0.0085}px ${tokens.font.mono}`, letterSpacing: '0.12em', color: C.market.steel, opacity: 0.8 }}>ILLUSTRATIVE RECONSTRUCTION · VECTOR FALLBACK LAYERS · NOT A PHOTOGRAPH</div>
    </AbsoluteFill>
  );
};
