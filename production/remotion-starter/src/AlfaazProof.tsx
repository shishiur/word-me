import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import '@fontsource/caveat-brush/400.css';
import '@fontsource/open-sans/600.css';

// GATE A: 20 s proof of S01-S03. Silent: no narration or score exist yet.
// Captions are PROVISIONAL (not synced to a recording).
export const FPS = 24;
export const W = 1080;
export const H = 1920;
export const RED = '#E83A36';
export const DEEP = '#AA2426';
export const INK = '#171415';
export const CREAM = '#F3E8D8';
export const HERO = "'Caveat Brush', Impact, sans-serif";
export const SANS = "'Open Sans', Arial, sans-serif";

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const rng = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Hand-drawn "line boil": displacement seed changes every 3 frames (8 drawings/s).
export const Filters: React.FC = () => {
  const f = useCurrentFrame();
  const k = Math.floor(f / 3) % 4;
  return (
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <defs>
        <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={3} seed={k + 2} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={9} />
        </filter>
        <filter id="roughText" x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={k + 9} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={7} />
        </filter>
      </defs>
    </svg>
  );
};

// ---------- hero lettering (separate channel from captions) ----------
export const Hero: React.FC<{lines: {t: string; size: number}[]; at: number; until: number; top: number; rot?: number; align?: 'center' | 'left'}> = ({lines, at, until, top, rot = -1.5, align = 'center'}) => {
  const frame = useCurrentFrame();
  const f = frame - at;
  if (frame < at || frame > until) return null;
  const r = Easing.out(Easing.cubic)(interpolate(f, [0, 10], [0, 1], clamp));
  const out = interpolate(frame, [until - 6, until], [1, 0], clamp);
  const b = Math.floor(frame / 3);
  const jx = Math.sin(b * 1.7) * 1.6;
  const jy = Math.cos(b * 2.3) * 1.6;
  const totalH = lines.reduce((a, l) => a + l.size * 0.95, 0);
  const block = (color: string, dx: number, dy: number) => (
    <div style={{position: 'absolute', left: 0, right: 0, top: dy, transform: `translateX(${dx}px)`, textAlign: align, display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', color}}>
      {lines.map((l, i) => (
        <div key={i} style={{fontFamily: HERO, fontSize: l.size, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '0.01em', whiteSpace: 'nowrap'}}>{l.t}</div>
      ))}
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top, height: totalH + 20, opacity: out, transform: `translate(${jx}px,${jy}px) rotate(${rot}deg)`, clipPath: `inset(-30px ${(1 - r) * 100}% -30px -30px)`, filter: 'url(#roughText)'}}>
      {block(DEEP, 5, 4)}
      {block(CREAM, 0, 0)}
    </div>
  );
};

// ---------- provisional access captions ----------
export const Caption: React.FC<{lines: string[]; at: number; until: number}> = ({lines, at, until}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until) return null;
  const fd = Math.max(1, Math.min(6, Math.floor((until - at) / 2) - 1));
  const o = interpolate(frame, [at, at + fd, until - fd, until], [0, 1, 1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: 1500, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{background: 'rgba(23,20,21,.62)', borderRadius: 14, padding: '14px 24px', textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 44, lineHeight: 1.28, color: '#FBF5EA'}}>
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
};

// ---------- S01: hand + phone ----------
const PHONE = {x: 350, y: 620, w: 380, h: 660};
export const Phone: React.FC<{frame: number; showText: boolean}> = ({frame, showText}) => {
  const typed = 'HOW ARE YOU?';
  const typeStart = 24, perChar = 3;
  const delStart = 112, perDel = 3.4;
  const nTyped = Math.floor(interpolate(frame, [typeStart, typeStart + typed.length * perChar], [0, typed.length], clamp));
  const nDel = Math.floor(Math.max(0, (frame - delStart) / perDel));
  const n = Math.max(0, Math.min(nTyped, typed.length) - nDel);
  const shown = typed.slice(0, n);
  const l1 = shown.slice(0, 7), l2 = shown.slice(7);
  const cursorOn = Math.floor(frame / 8) % 2 === 0;
  const scratches: React.ReactNode[] = [];
  for (let i = 0; i < Math.min(nDel, typed.length); i++) {
    const idx = typed.length - 1 - i;
    const t0 = delStart + i * perDel;
    const p = interpolate(frame, [t0, t0 + 40], [0, 1], clamp);
    const r = rng(idx * 31 + 5);
    const col = idx < 7 ? idx : idx - 7;
    const baseX = PHONE.x + 52 + col * 33;
    const baseY = idx < 7 ? PHONE.y + 300 : PHONE.y + 400;
    for (let s = 0; s < 3; s++) {
      const ang = (r() - 0.2) * 1.6 + 0.6;
      const dist = (60 + r() * 220) * p;
      const x = baseX + Math.cos(ang) * dist + 10, y = baseY + Math.sin(ang) * dist - 20;
      const len = 26 + r() * 40;
      scratches.push(<line key={`${idx}-${s}`} x1={x} y1={y} x2={x + Math.cos(ang + 0.5) * len} y2={y + Math.sin(ang + 0.5) * len} stroke={INK} strokeWidth={5 - p * 3} strokeLinecap="round" opacity={1 - p * 0.75} />);
    }
  }
  return (
    <g>
      <rect x={PHONE.x - 10} y={PHONE.y - 10} width={PHONE.w + 20} height={PHONE.h + 20} rx={56} fill={INK} />
      <rect x={PHONE.x} y={PHONE.y} width={PHONE.w} height={PHONE.h} rx={46} fill={CREAM} />
      <rect x={PHONE.x + 140} y={PHONE.y + 22} width={100} height={14} rx={7} fill={INK} opacity={0.85} />
      {showText && (
        <g fontFamily={HERO} fontSize={80} fill={INK}>
          <text x={PHONE.x + 40} y={PHONE.y + 340}>{l1}</text>
          <text x={PHONE.x + 40} y={PHONE.y + 445}>{l2}</text>
          {cursorOn && <rect x={PHONE.x + 44 + (l2 ? l2.length : l1.length) * 38} y={(l2 ? PHONE.y + 445 : PHONE.y + 340) - 84} width={7} height={92} fill={INK} />}
        </g>
      )}
      {scratches}
    </g>
  );
};

export const Hand: React.FC = () => (
  <g fill={INK}>
    {/* forearm + palm */}
    <path d="M 468 1920 C 478 1760 452 1640 470 1540 C 486 1440 540 1350 620 1318 L 730 1296 C 800 1290 842 1336 826 1410 C 812 1500 826 1700 846 1920 Z" />
    {/* four fingers wrapping the right edge */}
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={684 + (i === 0 || i === 3 ? 10 : 0)} y={826 + i * 112} width={150 + (i === 1 ? 14 : 0)} height={74} rx={37} transform={`rotate(${-8 + i * 3} ${760} ${860 + i * 112})`} />
    ))}
    <path d="M 760 1060 L 840 1080 L 850 1330 L 740 1330 Z" />
    {/* thumb across the front-left */}
    <path d="M 560 1360 C 470 1320 420 1230 430 1130" stroke={INK} strokeWidth={78} strokeLinecap="round" fill="none" />
  </g>
);

export const SceneA: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = Easing.out(Easing.cubic)(interpolate(frame, [0, 22], [0, 1], clamp));
  const bob = Math.sin(frame / 31) * 7;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <g filter="url(#rough)" transform={`translate(0 ${(1 - enter) * 520 + bob}) rotate(-4 540 1100)`}>
          <g transform="translate(5 4)" opacity={0.5}><Hand /></g>
          <Phone frame={frame} showText />
          <Hand />
        </g>
      </svg>
      <Hero lines={[{t: 'UNSENT', size: 250}]} at={30} until={160} top={170} rot={-2} />
    </AbsoluteFill>
  );
};

// ---------- S02: phone shrinks, text becomes chalk dots ----------
export const SceneB: React.FC = () => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [0, 70], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const scale = interpolate(k, [0, 1], [1, 0.2]);
  const tx = interpolate(k, [0, 1], [0, -170]);
  const ty = interpolate(k, [0, 1], [0, 520]);
  const handOut = interpolate(frame, [0, 30], [0, 1000], {...clamp, easing: Easing.in(Easing.cubic)});
  const r = rng(77);
  const dots = Array.from({length: 70}, (_, i) => {
    const a = r() * Math.PI * 2, d = 120 + r() * 700, sz = 3 + r() * 7, delay = r() * 40;
    return {a, d, sz, delay};
  });
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <g filter="url(#rough)">
          <g transform={`translate(0 ${handOut})`}><Hand /></g>
          <g transform={`translate(${540 + tx} ${950 + ty}) scale(${scale}) translate(-540 -950) rotate(-4 540 950)`}>
            <Phone frame={0} showText={false} />
          </g>
          {dots.map((d, i) => {
            const p = interpolate(frame, [10 + d.delay, 130], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
            const x = 540 + Math.cos(d.a) * d.d * p, y = 900 + Math.sin(d.a) * d.d * p * 0.9;
            return <circle key={i} cx={x} cy={y} r={d.sz * (1 - p * 0.35)} fill={CREAM} opacity={0.9 * (1 - p * 0.55) * interpolate(frame, [8, 16], [0, 1], clamp)} />;
          })}
        </g>
      </svg>
      <Hero lines={[{t: 'TOO', size: 340}, {t: 'small', size: 96}]} at={22} until={150} top={190} rot={1.5} />
    </AbsoluteFill>
  );
};

// ---------- S03: ALFAAZ grows; microscopic letters dissolve ----------
export const SceneC: React.FC = () => {
  const frame = useCurrentFrame();
  const letters = React.useMemo(() => {
    const r = rng(2024);
    const set = 'ALFAZWORDS';
    const out: {ch: string; x: number; y: number; d: number; rot: number}[] = [];
    for (let row = 0; row < 36; row++) for (let col = 0; col < 21; col++) {
      out.push({ch: set[Math.floor(r() * set.length)], x: 40 + col * 50 + (r() - 0.5) * 8, y: 250 + row * 36, d: 14 + r() * 100, rot: (r() - 0.5) * 40});
    }
    return out;
  }, []);
  const grow = interpolate(frame, [34, 156], [0.86, 1.03], {...clamp, easing: Easing.out(Easing.quad)});
  const fadeIn = interpolate(frame, [0, 12], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <g fontFamily={SANS} fontWeight={600} fontSize={24} fill={CREAM}>
          {letters.map((l, i) => {
            const p = interpolate(frame, [l.d, l.d + 36], [0, 1], clamp);
            return <text key={i} x={l.x} y={l.y - p * 70} opacity={0.5 * (1 - p) * fadeIn} transform={`rotate(${l.rot * p} ${l.x} ${l.y})`}>{l.ch}</text>;
          })}
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, transform: `scale(${grow})`, transformOrigin: '50% 50%'}}>
        <Hero lines={[{t: 'ALFAAZ', size: 330}]} at={34} until={999} top={0} rot={-1.2} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- ink wipe transition (single pass, no strobe) ----------
export const Wipe: React.FC<{center: number}> = ({center}) => {
  const frame = useCurrentFrame();
  const a = center - 11, b = center + 11;
  if (frame < a || frame > b) return null;
  const x = interpolate(frame, [a, center, b], [-1500, -140, 1160], {...clamp, easing: Easing.inOut(Easing.quad)});
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <g filter="url(#rough)"><rect x={x} y={-40} width={1420} height={H + 80} fill={INK} /></g>
    </svg>
  );
};

const FADE_END = 20 * FPS;
export const AlfaazProof: React.FC = () => {
  const frame = useCurrentFrame();
  const endFade = interpolate(frame, [FADE_END - 10, FADE_END], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Filters />
      <Img src={staticFile('tex/paper_red.png')} style={{position: 'absolute', width: W, height: H}} />
      <Sequence from={0} durationInFrames={170}><SceneA /></Sequence>
      <Sequence from={168} durationInFrames={158}><SceneB /></Sequence>
      <Sequence from={324} durationInFrames={156}><SceneC /></Sequence>
      <Caption at={12} until={96} lines={['Have you ever opened a message,', 'typed a few words, and then deleted them?']} />
      <Caption at={100} until={160} lines={['Maybe you only wanted', 'to ask how someone was.']} />
      <Caption at={186} until={252} lines={['It is not always because', 'we have nothing to say.']} />
      <Caption at={256} until={316} lines={['…an ordinary sentence', 'suddenly feels too small.']} />
      <Caption at={348} until={408} lines={['That is the world of Alfaaz.']} />
      <Caption at={414} until={470} lines={['The word means words.']} />
      <Wipe center={168} />
      <Wipe center={324} />
      <Img src={staticFile('tex/grain.png')} style={{position: 'absolute', width: W, height: H, mixBlendMode: 'multiply', opacity: 0.9, transform: `translate(${(Math.floor(frame / 3) % 3) - 1}px, ${(Math.floor(frame / 3) % 2)}px)`}} />
      <AbsoluteFill style={{background: INK, opacity: endFade}} />
    </AbsoluteFill>
  );
};
