import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {Audio} from '@remotion/media';
import timing from './timing.json';
import {W, H, FPS, RED, DEEP, INK, CREAM, HERO, SANS, clamp, rng, Filters, Hero, Caption, Wipe, SceneA, SceneB, SceneC} from './AlfaazProof';

const E = Easing.inOut(Easing.cubic);
const prog = (f: number, a: number, b: number, e: (t: number) => number = E) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});
const dash = (p: number) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p} as const);

// ---------------- primitives (all original vector shapes) ----------------
const Bust: React.FC<{x: number; y: number; s?: number; fill?: string; stroke?: string; sw?: number; op?: number; tilt?: number; p?: number}> = ({x, y, s = 1, fill = INK, stroke, sw = 8, op = 1, tilt = 0, p}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${tilt})`} opacity={op}>
    <path d="M -130 0 C -130 -82 -80 -104 0 -104 C 80 -104 130 -82 130 0 Z" fill={stroke ? 'none' : fill} stroke={stroke} strokeWidth={sw} {...(p !== undefined ? dash(p) : {})} />
    <circle cx={0} cy={-168} r={64} fill={stroke ? 'none' : fill} stroke={stroke} strokeWidth={sw} {...(p !== undefined ? dash(p) : {})} />
  </g>
);

const Cup: React.FC<{x: number; y: number; s?: number; fill?: string; steam?: number; op?: number}> = ({x, y, s = 1, fill = INK, steam = 0, op = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <path d="M -110 -120 L 110 -120 C 110 -20 70 30 0 30 C -70 30 -110 -20 -110 -120 Z" fill={fill} />
    <path d="M 108 -96 C 190 -112 190 -10 92 -22" fill="none" stroke={fill} strokeWidth={26} strokeLinecap="round" />
    <rect x={-150} y={44} width={300} height={16} rx={8} fill={fill} />
    {[-40, 30].map((sx, i) => {
      const t = (steam * 0.8 + i * 0.5) % 1;
      return <path key={i} d={`M ${sx} -150 C ${sx - 24} -190 ${sx + 24} -220 ${sx} -262`} fill="none" stroke={CREAM} strokeWidth={9} strokeLinecap="round" opacity={0.85 * (1 - t)} transform={`translate(0 ${-t * 30})`} />;
    })}
  </g>
);

const Palm: React.FC<{x: number; y: number; s?: number; rot?: number; fill?: string; op?: number; curl?: number}> = ({x, y, s = 1, rot = 0, fill = INK, op = 1, curl = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} fill={fill} opacity={op}>
    <rect x={-72} y={-20} width={144} height={150} rx={50} />
    {[[-54, -150], [-18, -190], [18, -196], [54, -160]].map(([fx, fy], i) => (
      <rect key={i} x={fx - 17} y={fy + curl * 60} width={34} height={150 - curl * 60} rx={17} />
    ))}
    <path d="M -60 70 C -130 40 -150 -30 -128 -80" fill="none" stroke={fill} strokeWidth={40} strokeLinecap="round" />
  </g>
);

const Eye: React.FC<{x: number; y: number; s?: number; op?: number; fill?: string; look?: number}> = ({x, y, s = 1, op = 1, fill = CREAM, look = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <path d="M -200 0 C -110 -120 110 -120 200 0 C 110 120 -110 120 -200 0 Z" fill={fill} stroke={INK} strokeWidth={16} strokeLinejoin="round" />
    <circle cx={look} cy={0} r={62} fill={INK} />
    <circle cx={look + 18} cy={-18} r={14} fill={CREAM} />
  </g>
);

const Heart: React.FC<{x: number; y: number; s?: number; fill?: string; op?: number; sw?: number; stroke?: string; p?: number}> = ({x, y, s = 1, fill = INK, op = 1, stroke, sw = 8, p}) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} opacity={op} d="M 0 120 C -170 20 -190 -90 -110 -130 C -50 -160 -10 -110 4 -76 C 22 -128 80 -158 126 -122 C 196 -64 150 40 0 120 Z" fill={stroke ? 'none' : fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" {...(p !== undefined ? dash(p) : {})} />
);

const Lamp: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={INK} stroke={INK} strokeLinecap="round">
    <rect x={-8} y={-300} width={16} height={300} stroke="none" />
    <path d="M 0 -290 L 70 -290" strokeWidth={14} fill="none" />
    <path d="M 56 -290 L 84 -262 L 28 -262 Z" stroke="none" />
  </g>
);

const Dark: React.FC = () => <rect width={W} height={H} fill={INK} />;
const Svg: React.FC<{children: React.ReactNode; dark?: boolean}> = ({children, dark}) => {
  const f = useCurrentFrame();
  const drift = 1 + f * 0.00006;
  return (
    <svg width={W} height={H} style={{position: 'absolute'}}>
      {dark && <Dark />}
      <g transform={`translate(540 960) scale(${drift}) translate(-540 -960)`}>
        <g filter="url(#rough)">{children}</g>
      </g>
    </svg>
  );
};

// ---------------- S04 .. S24 ----------------
const S04: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, 40, 200);
  return <Svg><Bust x={540} y={1280} s={2.1} /><Bust x={540} y={1280} s={1.75} stroke={CREAM} sw={9} p={p} tilt={Math.sin(f / 40) * 1.2} /><Bust x={540} y={1280} s={1.2} fill={CREAM} op={prog(f, 200, 300)} /></Svg>;
};

const S05: React.FC = () => {
  const f = useCurrentFrame();
  const scraps = Array.from({length: 9}, (_, i) => i);
  return (
    <Svg>
      <Bust x={330} y={1380} s={1.7} />
      <Cup x={720} y={1120} s={1.5} steam={f / 40} op={prog(f, 20, 50)} />
      <path d="M 250 1010 C 380 940 420 1030 520 980 C 600 950 640 1010 700 980" fill="none" stroke={DEEP} strokeWidth={34} strokeLinecap="round" {...dash(prog(f, 60, 140))} />
      {scraps.map((i) => {
        const a = f / 70 + (i * Math.PI * 2) / 9;
        const x = 330 + Math.cos(a) * 270, y = 1120 + Math.sin(a) * 130 - 40;
        return <g key={i} transform={`translate(${x} ${y}) rotate(${i * 21 + f})`} opacity={prog(f, 90 + i * 8, 120 + i * 8)}><rect x={-26} y={-18} width={52} height={36} fill={CREAM} /><path d="M -16 -4 H 16 M -16 8 H 8" stroke={INK} strokeWidth={4} /></g>;
      })}
    </Svg>
  );
};

const S06: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, 40, 180);
  return (
    <Svg>
      <Bust x={250} y={1300} s={1.5} />
      <g opacity={0.9} stroke={INK} strokeWidth={8} strokeDasharray="14 14" fill="none"><circle cx={830} cy={1132} r={96} /><path d="M 690 1300 C 690 1210 760 1190 830 1190 C 900 1190 970 1210 970 1300" /></g>
      <path d="M 300 1060 C 420 880 560 900 640 1010 C 700 1090 760 1010 830 1040" fill="none" stroke={CREAM} strokeWidth={12} strokeLinecap="round" {...dash(p)} />
      <circle cx={300} cy={1060} r={18 + Math.sin(f / 8) * 3} fill={CREAM} />
      {p > 0.98 && <path d="M 640 1010 L 830 1300 L 520 1300 Z" fill={INK} opacity={prog(f, 190, 230)} />}
    </Svg>
  );
};

const S07: React.FC = () => {
  const f = useCurrentFrame();
  const o = prog(f, 20, 300) * 36;
  return (
    <Svg dark>
      <Bust x={540 - o} y={1320} s={2} fill={DEEP} op={0.9} />
      <Bust x={540} y={1320} s={2} stroke={CREAM} sw={9} />
      <Bust x={540 + o} y={1320 - o * 0.4} s={2} fill={RED} op={prog(f, 100, 200)} />
      <path d="M 300 1320 C 300 1130 420 1090 540 1090 C 660 1090 780 1130 780 1320" fill="none" stroke={CREAM} strokeWidth={5} strokeDasharray="10 12" opacity={prog(f, 160, 260)} />
    </Svg>
  );
};

const S08: React.FC = () => {
  const f = useCurrentFrame();
  const split = prog(f, 130, 300);
  return (
    <Svg>
      <ellipse cx={540 - split * 150} cy={1420} rx={230} ry={36} fill={DEEP} opacity={0.8} />
      <ellipse cx={540 + split * 150} cy={1420} rx={230} ry={36} fill={DEEP} opacity={0.8} />
      <Bust x={430 - split * 120} y={1400} s={1.35} />
      <Bust x={650 + split * 120} y={1400} s={1.35} />
    </Svg>
  );
};

const S09: React.FC = () => {
  const f = useCurrentFrame();
  const prints = Array.from({length: 14}, (_, i) => i);
  return (
    <Svg>
      <path d="M 500 620 L 580 620 L 900 1500 L 180 1500 Z" fill={INK} />
      <path d="M 540 640 L 540 1480" stroke={CREAM} strokeWidth={10} strokeDasharray="38 46" />
      <Lamp x={380} y={1000} s={1.3} /><Lamp x={700} y={1000} s={1.3} />
      {prints.map((i) => {
        const t = i / 14, y = 1440 - t * 780, x = 540 + (i % 2 ? 34 : -34) * (1 - t * 0.7) + Math.sin(i) * 6;
        return <ellipse key={i} cx={x} cy={y} rx={22 * (1 - t * 0.6)} ry={34 * (1 - t * 0.6)} fill={CREAM} opacity={prog(f, 40 + i * 14, 60 + i * 14) * 0.9} />;
      })}
    </Svg>
  );
};

const S10: React.FC = () => {
  const f = useCurrentFrame();
  const a = 1 - prog(f, 120, 170), b = prog(f, 120, 170) * (1 - prog(f, 300, 350)), c = prog(f, 300, 350);
  return (
    <Svg>
      <g opacity={a} fill={INK}>
        <rect x={260} y={820} width={14} height={520} /><rect x={760} y={820} width={14} height={520} /><rect x={230} y={790} width={570} height={40} />
        <rect x={310} y={1180} width={400} height={26} fill={CREAM} />
      </g>
      <Cup x={540} y={1160} s={1.8} steam={f / 40} op={b} />
      <g opacity={c} fill={INK}><circle cx={540} cy={1290} r={140} /><path d="M 540 1150 C 540 900 700 760 860 760 C 900 880 800 1060 640 1150 Z" /><rect x={380} y={1400} width={320} height={40} rx={20} /></g>
    </Svg>
  );
};

const S11: React.FC = () => {
  const f = useCurrentFrame();
  const heights = [320, 520, 400, 640, 360, 560, 440, 300];
  const fold = prog(f, 80, 260);
  return (
    <Svg>
      {heights.map((h, i) => <rect key={i} x={70 + i * 120} y={1500 - h * (1 - fold * 0.35)} width={100} height={h * (1 - fold * 0.35)} fill={INK} />)}
      <path d="M 60 1020 C 220 760 340 1280 520 980 C 700 700 800 1200 1020 900" fill="none" stroke={CREAM} strokeWidth={9} strokeLinecap="round" {...dash(prog(f, 20, 240))} />
      <path d="M 60 1380 C 300 1240 560 1500 1020 1260" fill="none" stroke={DEEP} strokeWidth={14} strokeLinecap="round" {...dash(prog(f, 120, 330))} />
    </Svg>
  );
};

const S12: React.FC = () => {
  const f = useCurrentFrame();
  const words = ['tea', 'late', 'blue', 'laugh', 'umbrella', 'quiet'];
  return (
    <Svg>
      <Eye x={540} y={1060} s={2.3} op={prog(f, 10, 50)} />
      <Cup x={540} y={1100} s={0.38} fill={CREAM} steam={f / 40} op={prog(f, 80, 140)} />
      {words.map((w, i) => {
        const a = (i / words.length) * Math.PI * 2 + f / 220;
        return <text key={w} x={540 + Math.cos(a) * 190} y={1060 + Math.sin(a) * 190} fontFamily={HERO} fontSize={34} fill={CREAM} textAnchor="middle" opacity={prog(f, 140 + i * 18, 180 + i * 18) * 0.95}>{w}</text>;
      })}
    </Svg>
  );
};

const S13: React.FC = () => {
  const f = useCurrentFrame();
  const fade = 1 - prog(f, 60, 360) * 0.88;
  return <Svg><Eye x={270} y={1100} s={1.05} look={14} /><Eye x={810} y={1100} s={1.05} op={fade} look={-14} /><path d="M 400 1100 L 680 1100" stroke={CREAM} strokeWidth={5} strokeDasharray="6 22" opacity={0.7} /></Svg>;
};

const S14: React.FC = () => {
  const f = useCurrentFrame();
  const click = f % 150 > 140 ? 1 : 0;
  return (
    <Svg>
      <Palm x={90} y={1200} s={1.6} rot={90} />
      <Palm x={990} y={1200} s={1.6} rot={-90} />
      <rect x={380} y={700} width={320} height={560} rx={44} fill={INK} />
      <rect x={394} y={714} width={292} height={532} rx={34} fill={click ? CREAM : '#2a2425'} />
      <circle cx={300} cy={600} r={54} fill="none" stroke={CREAM} strokeWidth={7} transform={`translate(${Math.sin(f / 30) * 8} 0)`} />
      <circle cx={820} cy={560} r={74} fill="none" stroke={CREAM} strokeWidth={7} strokeDasharray="12 14" transform={`translate(${-Math.sin(f / 36) * 10} 0)`} />
    </Svg>
  );
};

const S15: React.FC = () => {
  const f = useCurrentFrame();
  const fade = 1 - prog(f, 120, 380) * 0.95;
  return (
    <Svg dark>
      {[330, 750].map((x, i) => (
        <g key={i}>
          <rect x={x - 190} y={760} width={380} height={520} fill="none" stroke={CREAM} strokeWidth={10} />
          <g opacity={i ? fade : 1}><Bust x={x} y={1230} s={1.25} fill={i ? RED : CREAM} /></g>
        </g>
      ))}
    </Svg>
  );
};

const S16: React.FC = () => {
  const f = useCurrentFrame();
  const open = prog(f, 30, 200);
  const rx = 420 * open, ry = 520 * open;
  const sr = rng(8);
  const dots = React.useMemo(() => Array.from({length: 26}, () => [sr(), sr(), sr()]), []);
  return (
    <Svg>
      <clipPath id="oval"><ellipse cx={540} cy={1060} rx={rx} ry={ry} /></clipPath>
      <ellipse cx={540} cy={1060} rx={rx + 22} ry={ry + 22} fill={INK} />
      <g clipPath="url(#oval)">
        <rect x={80} y={540} width={920} height={1040} fill={CREAM} />
        <path d="M 80 1260 C 260 1100 420 1320 600 1180 C 760 1060 880 1220 1000 1140 L 1000 1580 L 80 1580 Z" fill={DEEP} />
        <circle cx={760} cy={800} r={70} fill={RED} />
        {dots.map((d, i) => <circle key={i} cx={120 + d[0] * 800} cy={640 + d[1] * 400} r={3 + d[2] * 5} fill={INK} opacity={0.7} />)}
      </g>
    </Svg>
  );
};

const S17: React.FC = () => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 70) * 8;
  return (
    <Svg>
      <rect x={470} y={760} width={140} height={640} fill={CREAM} opacity={0.9} />
      <Bust x={290 + sway} y={1400} s={1.5} />
      <Bust x={790 - sway} y={1400} s={1.5} />
    </Svg>
  );
};

const S18: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Svg>
      <Palm x={540} y={1340} s={2.1} curl={0.35} />
      <Heart x={540} y={950} s={1.5} fill={DEEP} />
      <Heart x={540} y={950} s={1.5} stroke={INK} sw={9} p={1} />
      {[[-80, -40, 40, 10], [0, -90, 30, 60], [60, -10, 110, 40], [-30, 30, 30, 80]].map(([x1, y1, x2, y2], i) => (
        <path key={i} d={`M ${540 + x1 * 1.5} ${950 + y1 * 1.5} L ${540 + x2 * 1.5} ${950 + y2 * 1.5}`} stroke={CREAM} strokeWidth={9} strokeLinecap="round" {...dash(prog(f, 60 + i * 40, 110 + i * 40))} />
      ))}
    </Svg>
  );
};

const S19: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    <g key={0}><Cup x={0} y={30} s={0.8} fill={CREAM} steam={f / 40} /></g>,
    <g key={1}><rect x={-80} y={-160} width={160} height={280} fill={CREAM} /><rect x={-60} y={-140} width={120} height={240} fill={RED} /><circle cx={34} cy={-20} r={10} fill={CREAM} /></g>,
    <g key={2}><rect x={-90} y={-100} width={180} height={200} fill={CREAM} transform="rotate(-6)" /><path d="M -60 -50 H 60 M -60 -10 H 40 M -60 30 H 60" stroke={INK} strokeWidth={8} transform="rotate(-6)" /></g>,
  ];
  return (
    <Svg>
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={prog(f, 20 + i * 90, 60 + i * 90)} transform={`translate(${210 + i * 330} ${1150 + (1 - prog(f, 20 + i * 90, 60 + i * 90)) * 80})`}>
          <Palm x={0} y={150} s={1} rot={0} curl={0.3} />
          <g transform="translate(0 -40)">{items[i]}</g>
        </g>
      ))}
    </Svg>
  );
};

const S20: React.FC = () => {
  const f = useCurrentFrame();
  const split = prog(f, 120, 220);
  const pulse = 1 + Math.sin(f / 10) * 0.03 * (1 - split);
  return (
    <Svg>
      <Heart x={540} y={1000} s={2.1 * pulse * (1 - split * 0.55)} fill={DEEP} op={1 - split * 0.4} />
      <Palm x={250 - (1 - split) * 200} y={1300} s={1.3} rot={-14} op={split} curl={0.2} />
      <Palm x={830 + (1 - split) * 200} y={1300} s={1.3} rot={14} op={split} curl={0.2} />
      <g opacity={prog(f, 220, 280)}><Cup x={540} y={1450} s={0.8} /></g>
      <path d="M 540 1060 L 540 1180 M 480 1120 H 600" stroke={CREAM} strokeWidth={14} strokeLinecap="round" opacity={split} />
    </Svg>
  );
};

const S21: React.FC = () => {
  const f = useCurrentFrame();
  const collapse = prog(f, 70, 170);
  return (
    <Svg>
      <g transform={`translate(540 ${1000 + collapse * 140}) scale(1 ${1 - collapse * 0.94})`} opacity={1 - collapse * 0.3}>
        <ellipse cx={0} cy={0} rx={330} ry={210} fill={INK} /><ellipse cx={0} cy={50} rx={230} ry={110} fill={DEEP} />
        <rect x={-210} y={-96} width={420} height={36} fill={CREAM} />
      </g>
      <g opacity={prog(f, 150, 210)} transform="translate(540 960)" fill="none" stroke={INK} strokeWidth={40} strokeLinecap="round">
        <path d="M 0 -250 C 200 -260 250 -60 140 80 C 100 140 140 200 60 260" />
        <path d="M 10 -150 C 120 -150 150 -40 90 30" strokeWidth={26} />
      </g>
      <Palm x={540} y={1470} s={1.4} rot={0} op={prog(f, 190, 250)} curl={0.5} />
    </Svg>
  );
};

const S22: React.FC = () => {
  const f = useCurrentFrame();
  const letters = React.useMemo(() => {
    const r = rng(77);
    return Array.from({length: 90}, () => ({c: 'ABCDEFGHIJKLMNOPRSTUW'[Math.floor(r() * 21)], a: r() * Math.PI * 2, d: 250 + r() * 800, s: 40 + r() * 70, o: r() * 60}));
  }, []);
  return (
    <Svg>
      <ellipse cx={540} cy={900} rx={150} ry={80 * (1 - prog(f, 40, 100) * 0.5)} fill={INK} />
      {letters.map((l, i) => {
        const p = prog(f, 50 + l.o, 260 + l.o, Easing.out(Easing.cubic));
        return <text key={i} x={540 + Math.cos(l.a) * l.d * p} y={900 + Math.sin(l.a) * l.d * p * 1.1} fontFamily={HERO} fontSize={l.s} fill={i % 3 ? INK : CREAM} opacity={p > 0 ? 0.9 : 0} transform={`rotate(${l.a * 40 * p} ${540 + Math.cos(l.a) * l.d * p} ${900 + Math.sin(l.a) * l.d * p})`}>{l.c}</text>;
      })}
      <text x={540} y={1360} textAnchor="middle" fontFamily={SANS} fontSize={34} fontWeight={600} fill={CREAM} opacity={prog(f, 220, 290)}>…</text>
    </Svg>
  );
};

const S23: React.FC = () => {
  const f = useCurrentFrame();
  const stop = prog(f, 30, 380);
  return (
    <Svg>
      <Bust x={170} y={1400} s={1.3} />
      <Bust x={900} y={1400} s={1.3} stroke={INK} sw={9} />
      <path d="M 210 1190 C 340 960 460 1280 600 1040 C 640 970 680 1040 700 1070" fill="none" stroke={CREAM} strokeWidth={34} strokeLinecap="round" {...dash(stop)} />
      <path d="M 210 1190 C 340 960 460 1280 600 1040 C 640 970 680 1040 700 1070" fill="none" stroke={INK} strokeWidth={5} strokeDasharray="2 16" strokeLinecap="round" opacity={stop} />
    </Svg>
  );
};

const S24: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const glow = prog(f, 120, 260);
  const fadeAll = prog(f, dur - 150, dur - 90);
  return (
    <Svg>
      <g opacity={1 - fadeAll}>
        <circle cx={540} cy={1180} r={250 * glow} fill={CREAM} opacity={0.35} />
        <Cup x={540} y={1330} s={0.75} steam={f / 40} op={prog(f, 40, 120)} />
        <Bust x={290} y={1450} s={1.2} op={prog(f, 90, 160)} />
        <Bust x={790} y={1450} s={1.2} op={prog(f, 90, 160)} />
      </g>
    </Svg>
  );
};

// ---------------- assembly ----------------
const scenes = timing.scenes;
const cues = timing.cues;
const sf = (s: number) => Math.round(s * FPS);

function splitCaption(text: string): string[][] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > 36 && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  const events: string[][] = [];
  for (let i = 0; i < lines.length; i += 2) events.push(lines.slice(i, i + 2));
  return events;
}
const captionEvents = cues.flatMap((c) => {
  const evs = splitCaption(c.text);
  const total = evs.reduce((a, e) => a + e.join(' ').length, 0);
  let t = c.start;
  return evs.map((e) => {
    const d = ((c.end - c.start) * e.join(' ').length) / total;
    const ev = {at: sf(t), until: sf(t + d), lines: e};
    t += d;
    return ev;
  });
});

const HEROES: Record<string, {lines: {t: string; size: number}[]; top: number; rot: number}> = {};
scenes.forEach((s, i) => {
  const words = s.hero_word.split(' ');
  let lines: string[];
  if (words.length <= 2 && s.hero_word.length <= 8) lines = [s.hero_word];
  else if (words.length <= 2) lines = words;
  else { const mid = Math.ceil(words.length / 2); lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]; }
  const longest = Math.max(...lines.map((l) => l.length));
  const size = Math.min(250, Math.floor(900 / (longest * 0.47)), lines.length > 1 ? 190 : 250);
  HEROES[s.id] = {lines: lines.map((t) => ({t, size})), top: 170, rot: i % 2 ? 1.6 : -1.8};
});

const DARK = new Set(['S07', 'S15']);

const Art: React.FC<{id: string; dur: number}> = ({id, dur}) => {
  switch (id) {
    case 'S01': return <SceneA />;
    case 'S02': return <SceneB />;
    case 'S03': return <SceneC />;
    case 'S04': return <S04 />; case 'S05': return <S05 />; case 'S06': return <S06 />; case 'S07': return <S07 />;
    case 'S08': return <S08 />; case 'S09': return <S09 />; case 'S10': return <S10 />; case 'S11': return <S11 />;
    case 'S12': return <S12 />; case 'S13': return <S13 />; case 'S14': return <S14 />; case 'S15': return <S15 />;
    case 'S16': return <S16 />; case 'S17': return <S17 />; case 'S18': return <S18 />; case 'S19': return <S19 />;
    case 'S20': return <S20 />; case 'S21': return <S21 />; case 'S22': return <S22 />; case 'S23': return <S23 />;
    default: return <S24 dur={dur} />;
  }
};

export const TOTAL_FRAMES = sf(timing.duration);

export const AlfaazFull: React.FC = () => {
  const frame = useCurrentFrame();
  const grainShift = {x: (Math.floor(frame / 3) % 3) - 1, y: Math.floor(frame / 3) % 2};
  const endFade = interpolate(frame, [TOTAL_FRAMES - 36, TOTAL_FRAMES], [0, 1], clamp);
  const lastStart = sf(scenes[scenes.length - 1].start);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Audio src={staticFile('audio/mix.wav')} />
      <Filters />
      <Img src={staticFile('tex/paper_red.png')} style={{position: 'absolute', width: W, height: H}} />
      {scenes.map((s, i) => {
        const from = sf(s.start);
        const dur = (i === scenes.length - 1 ? TOTAL_FRAMES : sf(scenes[i + 1].start)) - from;
        const hero = HEROES[s.id];
        const isLong = s.id === 'S03';
        const isFinal = s.id === 'S24';
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur}>
            <Art id={s.id} dur={dur} />
            {!isFinal && <Hero lines={hero.lines} at={s.id === 'S01' ? 30 : 36} until={isLong ? dur - 12 : (s.id === 'S01' ? 160 : 36 + 130)} top={hero.top} rot={hero.rot} />}
            {isFinal && <>
              <Hero lines={hero.lines} at={40} until={40 + 170} top={hero.top} rot={hero.rot} />
              <Hero lines={[{t: 'ALFAAZ', size: 300}]} at={dur - 190} until={dur + 10} top={620} rot={-1.2} />
            </>}
          </Sequence>
        );
      })}
      {captionEvents.map((c, i) => <Caption key={i} at={c.at} until={c.until} lines={c.lines} />)}
      {scenes.slice(1).map((s) => <Wipe key={s.id} center={sf(s.start)} />)}
      <Img src={staticFile('tex/grain.png')} style={{position: 'absolute', width: W, height: H, mixBlendMode: 'multiply', opacity: 0.9, transform: `translate(${grainShift.x}px, ${grainShift.y}px)`}} />
      <AbsoluteFill style={{background: INK, opacity: endFade}} />
    </AbsoluteFill>
  );
};
