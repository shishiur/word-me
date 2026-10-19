// Research Atlas illustration library.
// Every function returns an SVG string so pages can be pre-rendered at build time
// (the static SVG is the no-JavaScript fallback). Nothing in this file encodes a
// study result: scenes are illustrative, and data-bearing pieces take values from callers.

let counter = 0;
export const uid = (s = 'i') => `${s}${(++counter).toString(36)}`;
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}
const f1 = (n) => Math.round(n * 10) / 10;
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const SANS = "'Instrument Sans', system-ui, sans-serif";
const SERIF = "'Newsreader', Georgia, serif";

export function svg({ vb, title, desc, cls = '', body, attrs = '' }) {
  const t = uid('t'), d = uid('d');
  return `<svg class="ill ${cls}" viewBox="${vb}" role="img" aria-labelledby="${t} ${d}" ${attrs} xmlns="http://www.w3.org/2000/svg"><title id="${t}">${esc(title)}</title><desc id="${d}">${esc(desc)}</desc>${body}</svg>`;
}

const blur = (p, name, sd) => `<filter id="${p}${name}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
function grain(p, alpha = 0.5, freq = 0.85, seed = 7) {
  return `<filter id="${p}gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}" stitchTiles="stitch"/><feColorMatrix values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 ${alpha}"/></filter>`;
}
const grainRect = (p, w, h, op = 0.16, blend = 'overlay') => `<rect width="${w}" height="${h}" filter="url(#${p}gr)" opacity="${op}" style="mix-blend-mode:${blend}" pointer-events="none"/>`;
const tag = (x, y, text, { anchor = 'end', fill = '#9fb2b7', size = 12, op = 0.75 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${MONO}" font-size="${size}" letter-spacing="1.4" fill="${fill}" opacity="${op}">${esc(text)}</text>`;

function bez(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}
// fish scales: overlapping arcs open toward the head (fish faces left)
function scalePattern(id, s, stroke, op) {
  const h = s, w = s * 0.62, r = s * 0.56;
  return `<pattern id="${id}" width="${w * 2}" height="${h}" patternUnits="userSpaceOnUse"><g fill="none" stroke="${stroke}" stroke-width="1.6" opacity="${op}"><path d="M0 0 A${r} ${r} 0 0 1 0 ${h}"/><path d="M${w} ${-h / 2} A${r} ${r} 0 0 1 ${w} ${h / 2}"/><path d="M${w} ${h / 2} A${r} ${r} 0 0 1 ${w} ${h * 1.5}"/></g></pattern>`;
}
function rays(path0, path1, n, stroke, op, sw = 1.2) {
  // straight rays between two polylines given as point arrays
  let out = '';
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const a = lerpPoly(path0, t), b = lerpPoly(path1, t);
    out += `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`;
  }
  return `<g stroke="${stroke}" stroke-width="${sw}" opacity="${op}">${out}</g>`;
}
function lerpPoly(pts, t) {
  const segs = pts.length - 1, x = t * segs, i = Math.min(segs - 1, Math.floor(x)), u = x - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u];
}

/* ------------------------------------------------------------------ */
/* Fish                                                                */
/* ------------------------------------------------------------------ */

// Generic market carp (rohu-like) in a 1000-unit frame, head at x=0. Optional transverse steak cut.
export function carp(p, { cut = true } = {}) {
  const body = 'M0 0 C80 -100 220 -185 400 -188 C580 -190 720 -105 840 -40 L840 34 C720 80 580 152 400 154 C200 156 70 90 0 8 Z';
  const tail = 'M826 -36 C880 -72 950 -140 1000 -172 C976 -92 956 -32 948 0 C956 30 976 92 1000 162 C950 132 880 70 826 30 Z';
  const fins = `
    <path d="M330 -182 C372 -252 432 -292 522 -302 C512 -252 522 -202 562 -178 Z" fill="#46524d"/>
    <path d="M206 64 C248 94 300 134 332 176 C280 166 230 126 198 84 Z" fill="#5a6560"/>
    <path d="M430 150 C462 182 494 212 524 232 C482 228 450 202 418 160 Z" fill="#59625c"/>
    <path d="M660 108 C692 140 724 172 746 194 C702 188 670 162 648 118 Z" fill="#59625c"/>`;
  const defs = `<linearGradient id="${p}cb" gradientUnits="userSpaceOnUse" x1="0" y1="-190" x2="0" y2="160"><stop offset="0" stop-color="#26332f"/><stop offset=".22" stop-color="#5f6e66"/><stop offset=".5" stop-color="#b7c0b6"/><stop offset=".78" stop-color="#e3dfd2"/><stop offset="1" stop-color="#efe8db"/></linearGradient>
    <linearGradient id="${p}cflush" gradientUnits="userSpaceOnUse" x1="0" y1="-120" x2="0" y2="120"><stop offset="0" stop-color="#c9725f" stop-opacity="0"/><stop offset=".5" stop-color="#c9725f" stop-opacity=".28"/><stop offset="1" stop-color="#c9725f" stop-opacity="0"/></linearGradient>
    <radialGradient id="${p}flesh" cx=".55" cy=".45" r=".6"><stop offset="0" stop-color="#f6c2b6"/><stop offset=".55" stop-color="#e2867f"/><stop offset="1" stop-color="#b44c55"/></radialGradient>
    ${scalePattern(`${p}csc`, 34, '#1e2a27', 0.42)}
    <clipPath id="${p}cfront"><rect x="-40" y="-400" width="470" height="800"/></clipPath>
    <clipPath id="${p}cback"><rect x="450" y="-400" width="700" height="800"/></clipPath>
    <clipPath id="${p}cbody"><path d="${body}"/></clipPath>`;
  const skin = (clip, dx = 0) => `<g clip-path="url(#${p}${clip})" transform="translate(${dx} 0)">
      ${clip === 'cback' ? `<path d="${tail}" fill="#4e5a55"/>` : ''}
      <g clip-path="url(#${p}cbody)"><path d="${body}" fill="url(#${p}cb)"/><path d="${body}" fill="url(#${p}cflush)"/><rect x="0" y="-200" width="860" height="380" fill="url(#${p}csc)"/>
        <ellipse cx="420" cy="-112" rx="240" ry="22" fill="#fff" opacity=".42" filter="url(#${p}b14)"/>
        <path d="M170 -12 C350 -22 600 -12 840 0" fill="none" stroke="#e8e2d2" stroke-width="3" stroke-dasharray="2 9" opacity=".7"/></g>
    </g>`;
  const head = `<path d="M150 -116 C206 -56 210 44 168 110" fill="none" stroke="#1d2825" stroke-width="5" opacity=".55"/>
    <circle cx="88" cy="-42" r="21" fill="#d6c38e"/><circle cx="88" cy="-42" r="12" fill="#101313"/><circle cx="82" cy="-48" r="4.5" fill="#fff" opacity=".9"/>
    <path d="M0 4 C14 10 28 12 40 9" fill="none" stroke="#1d2825" stroke-width="4"/>`;
  if (!cut) return { defs, svg: `${fins}<path d="${tail}" fill="#4e5a55"/>${skin('cbody')}${head}` };
  const section = `<g transform="translate(26 0)">
      <ellipse cx="452" cy="-17" rx="34" ry="170" fill="url(#${p}flesh)" stroke="#2b3632" stroke-width="7"/>
      <g fill="none" stroke="#fbd9cf" stroke-width="3" opacity=".65"><ellipse cx="452" cy="-17" rx="24" ry="128"/><ellipse cx="452" cy="-17" rx="15" ry="86"/><ellipse cx="452" cy="-24" rx="7" ry="44"/></g>
      <ellipse cx="452" cy="-44" rx="10" ry="17" fill="#f4eee4" stroke="#c9bdab" stroke-width="2"/>
      <path d="M452 -62 V-150" stroke="#f1e5d8" stroke-width="3" opacity=".7"/>
      <ellipse cx="452" cy="82" rx="13" ry="44" fill="#6a2a2e" opacity=".75"/>
      <ellipse cx="444" cy="-90" rx="6" ry="40" fill="#fff" opacity=".35"/>
    </g>`;
  return { defs, svg: `${fins}${skin('cback', 26)}${skin('cfront')}${section}${head}` };
}

// Hilsa shad, Tenualosa ilisha, side view in a 1000-unit frame (stylised, not a taxonomic plate).
export function hilsaFish(p, { iridescence = 1 } = {}) {
  const body = 'M0 -4 C55 -88 195 -168 400 -176 C590 -182 735 -112 852 -46 L854 40 C742 104 600 206 400 207 C205 208 76 122 0 12 Z';
  const tail = 'M842 -44 C892 -92 952 -172 1004 -220 C978 -122 962 -42 957 0 C962 42 978 122 1004 220 C952 172 892 94 844 38 Z';
  const scutes = [];
  for (let i = 1; i < 16; i++) {
    const t = i / 16;
    const [x, y] = t < 0.5 ? bez([854, 40], [742, 104], [600, 206], [400, 207], t * 2) : bez([400, 207], [205, 208], [76, 122], [0, 12], (t - 0.5) * 2);
    if (x > 120 && x < 720) scutes.push(`M${f1(x + 9)} ${f1(y - 3)} L${f1(x)} ${f1(y + 7)} L${f1(x - 9)} ${f1(y - 3)}`);
  }
  const spots = [[232, -66, 24, 0.6], [292, -60, 11, 0.32], [336, -57, 10, 0.27], [378, -55, 9, 0.22], [420, -53, 8, 0.18], [462, -51, 7, 0.14], [504, -49, 6, 0.1]]
    .map(([x, y, r, o]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#1b3039" opacity="${o}"/>`).join('');
  const defs = `
    <linearGradient id="${p}hb" gradientUnits="userSpaceOnUse" x1="0" y1="-180" x2="0" y2="210"><stop offset="0" stop-color="#22414c"/><stop offset=".16" stop-color="#456a74"/><stop offset=".36" stop-color="#b3c4c8"/><stop offset=".58" stop-color="#e6edee"/><stop offset="1" stop-color="#f8faf9"/></linearGradient>
    <linearGradient id="${p}hi" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0"><stop offset="0" stop-color="#7d6fb0" stop-opacity="0"/><stop offset=".18" stop-color="#7d6fb0" stop-opacity=".42"/><stop offset=".34" stop-color="#7d6fb0" stop-opacity="0"/><stop offset=".5" stop-color="#d8b85e" stop-opacity=".38"/><stop offset=".66" stop-color="#d8b85e" stop-opacity="0"/><stop offset=".84" stop-color="#6f9fb7" stop-opacity=".34"/><stop offset="1" stop-color="#6f9fb7" stop-opacity="0"/></linearGradient>
    <linearGradient id="${p}hfade" gradientUnits="userSpaceOnUse" x1="0" y1="-180" x2="0" y2="200"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".55" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="${p}hmask"><rect x="-20" y="-240" width="1060" height="480" fill="url(#${p}hfade)"/></mask>
    <radialGradient id="${p}iris" cx=".45" cy=".4" r=".6"><stop offset="0" stop-color="#f1dc96"/><stop offset="1" stop-color="#a77f33"/></radialGradient>
    <linearGradient id="${p}fin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c7a83" stop-opacity=".9"/><stop offset="1" stop-color="#b9c7ca" stop-opacity=".55"/></linearGradient>
    ${scalePattern(`${p}hsc`, 26, '#1d3a44', 0.5)}
    <clipPath id="${p}hclip"><path d="${body}"/></clipPath>`;
  const out = `
    <path d="${tail}" fill="url(#${p}fin)"/>
    <path d="M378 -174 C408 -238 452 -272 506 -280 C500 -234 508 -198 540 -170 Z" fill="url(#${p}fin)"/>
    ${rays([[384, -176], [538, -170]], [[420, -232], [503, -274]], 11, '#2c4a54', 0.35)}
    <path d="M694 128 C724 154 766 174 804 180 C764 188 722 172 686 134 Z" fill="#9fb3b8" opacity=".85"/>
    <path d="M440 197 C460 222 484 242 510 258 C472 256 446 236 430 202 Z" fill="#a8bbbf" opacity=".9"/>
    <g clip-path="url(#${p}hclip)">
      <path d="${body}" fill="url(#${p}hb)"/>
      <rect x="0" y="-200" width="880" height="420" fill="url(#${p}hsc)" mask="url(#${p}hmask)"/>
      <rect x="0" y="-200" width="880" height="420" fill="url(#${p}hi)" opacity="${iridescence}" style="mix-blend-mode:soft-light"/>
      <rect x="0" y="-200" width="880" height="420" fill="url(#${p}hi)" opacity="${0.35 * iridescence}"/>
      ${spots}
      <path d="M40 -70 C100 -112 150 -122 162 -118 C216 -58 222 52 178 118 C120 122 60 82 18 30 Z" fill="#d6b45a" opacity=".09"/>
      <ellipse cx="450" cy="-48" rx="320" ry="24" fill="#fff" opacity=".55" filter="url(#${p}b14)"/>
      <ellipse cx="420" cy="150" rx="280" ry="30" fill="#fff" opacity=".4" filter="url(#${p}b14)"/>
    </g>
    <path d="M160 -118 C214 -58 222 52 178 118" fill="none" stroke="#2c4952" stroke-width="3.5" opacity=".55"/>
    <path d="M186 96 C236 122 290 152 332 178 C282 176 226 154 182 124 Z" fill="#c1cfd1" opacity=".9"/>
    <path d="${scutes.join(' ')}" fill="none" stroke="#7d9198" stroke-width="2.4" stroke-linejoin="round"/>
    <circle cx="94" cy="-38" r="25" fill="url(#${p}iris)"/><circle cx="94" cy="-38" r="13.5" fill="#0c1113"/><circle cx="87" cy="-45" r="5" fill="#fff"/>
    <ellipse cx="94" cy="-38" rx="38" ry="32" fill="#fff" opacity=".1" stroke="#fff" stroke-opacity=".3" stroke-width="1.5"/>
    <path d="M-2 4 C16 12 34 14 52 8 M18 2 C40 -6 60 -8 74 -2" fill="none" stroke="#2c3d44" stroke-width="2.6"/>`;
  return { defs, svg: out };
}

// Pabda, Ompok pabda, side view in a 1000-unit frame. Optional gut-origin cutaway.
export function pabdaFish(p, { cutaway = false } = {}) {
  const body = 'M0 -8 C36 -56 130 -92 270 -98 C450 -104 650 -72 822 -30 L842 -14 L842 16 C690 48 480 88 300 92 C160 94 52 70 0 12 Z';
  const anal = 'M318 90 C460 150 690 128 838 42 L842 16 C690 48 480 88 318 90 Z';
  const chev = [];
  for (let x = 160; x < 820; x += 34) chev.push(`M${x + 14} -60 L${x} -6 L${x + 14} 52`);
  const defs = `
    <linearGradient id="${p}pb" gradientUnits="userSpaceOnUse" x1="0" y1="-104" x2="0" y2="95"><stop offset="0" stop-color="#74817f"/><stop offset=".28" stop-color="#b9b8b2"/><stop offset=".62" stop-color="#e9dfd8"/><stop offset="1" stop-color="#f5ede7"/></linearGradient>
    <linearGradient id="${p}pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cbbfb6" stop-opacity=".85"/><stop offset="1" stop-color="#e9e1da" stop-opacity=".4"/></linearGradient>
    <radialGradient id="${p}cav" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#7b3434"/><stop offset="1" stop-color="#3e1517"/></radialGradient>
    <linearGradient id="${p}int" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1b3a3"/><stop offset="1" stop-color="#c86f66"/></linearGradient>
    <clipPath id="${p}pclip"><path d="${body}"/></clipPath>
    <clipPath id="${p}win"><ellipse cx="214" cy="26" rx="96" ry="50"/></clipPath>`;
  const analRays = rays([[322, 91], [560, 76], [838, 18]], [[330, 98], [560, 136], [834, 44]], 46, '#a8988e', 0.5, 1.1);
  let cut = '';
  if (cutaway) {
    cut = `<g clip-path="url(#${p}win)">
        <rect x="100" y="-40" width="240" height="140" fill="url(#${p}cav)"/>
        <path d="M150 50 C170 -10 230 -10 250 30 C268 66 214 82 196 50 C180 22 214 8 232 26 C250 46 290 40 300 6" fill="none" stroke="url(#${p}int)" stroke-width="15" stroke-linecap="round"/>
        <path d="M150 50 C170 -10 230 -10 250 30" fill="none" stroke="#fff" stroke-width="3" opacity=".45"/>
        <ellipse cx="146" cy="2" rx="32" ry="20" fill="#5a1e22"/><ellipse cx="140" cy="-4" rx="12" ry="5" fill="#fff" opacity=".25"/>
      </g>
      <ellipse cx="214" cy="26" rx="96" ry="50" fill="none" stroke="#8d4a45" stroke-width="5"/>
      <ellipse cx="214" cy="26" rx="100" ry="54" fill="none" stroke="#f5ede7" stroke-width="2" opacity=".7"/>
      <g class="pabda-sample"><circle cx="232" cy="30" r="22" fill="none" stroke="#f6e7a8" stroke-width="3" stroke-dasharray="6 5"/><circle cx="232" cy="30" r="5" fill="#f6e7a8"/></g>`;
  }
  const out = `
    <path d="M834 -24 C868 -52 918 -96 962 -122 C946 -62 936 -22 933 0 C936 22 946 62 962 120 C918 96 868 52 834 22 Z" fill="url(#${p}pf)"/>
    <path d="${anal}" fill="url(#${p}pf)"/>${analRays}
    <path d="M244 -98 C254 -126 270 -138 290 -142 C288 -124 292 -110 302 -99 Z" fill="url(#${p}pf)"/>
    <g clip-path="url(#${p}pclip)">
      <path d="${body}" fill="url(#${p}pb)" opacity=".96"/>
      <path d="${chev.join(' ')}" fill="none" stroke="#b39f96" stroke-width="2.2" opacity=".38"/>
      <path d="M140 -22 C400 -32 650 -20 842 0" fill="none" stroke="#a89189" stroke-width="3.5" opacity=".45"/>
      <ellipse cx="420" cy="-58" rx="300" ry="14" fill="#fff" opacity=".5" filter="url(#${p}b14)"/>
    </g>
    <path d="M120 58 C150 86 184 110 214 124 C178 122 144 100 116 70 Z" fill="url(#${p}pf)"/>
    <path d="M300 90 C306 106 316 118 330 126 C312 126 300 114 294 94 Z" fill="url(#${p}pf)"/>
    <path d="M34 -10 C86 -34 160 -24 236 28" fill="none" stroke="#7b6f69" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M28 10 C56 28 88 42 116 50" fill="none" stroke="#8b7f78" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="62" cy="-30" r="11" fill="#c9b98c"/><circle cx="62" cy="-30" r="6.5" fill="#101314"/><circle cx="59" cy="-33" r="2.4" fill="#fff"/>
    <path d="M-4 2 C10 -2 26 -4 40 0" fill="none" stroke="#5d5652" stroke-width="2.4"/>
    ${cut}`;
  return { defs, svg: out };
}

export function hilsa({ p = uid('h'), title = 'Illustration of a hilsa shad, Tenualosa ilisha', sample = false, label = true } = {}) {
  const fish = hilsaFish(p);
  const body = `<defs>${blur(p, 'b14', 14)}${blur(p, 'b30', 30)}${fish.defs}</defs>
    <ellipse cx="560" cy="530" rx="420" ry="26" fill="#000" opacity=".22" filter="url(#${p}b30)"/>
    <g transform="translate(60 300)">${fish.svg}
      ${sample ? `<g class="hilsa-sample"><circle cx="560" cy="-60" r="26" fill="none" stroke="#f3e3a3" stroke-width="3" stroke-dasharray="6 5"/><circle cx="560" cy="-60" r="5" fill="#f3e3a3"/><path d="M560 -86 V-150 H640" fill="none" stroke="#f3e3a3" stroke-width="1.5"/><text x="648" y="-145" font-family="${MONO}" font-size="18" fill="#f3e3a3">DNA tissue · type per protocol</text></g>` : ''}
    </g>
    ${label ? tag(1080, 552, 'STYLISED · NOT A TAXONOMIC PLATE', { fill: '#7f969d' }) : ''}`;
  return svg({ vb: '0 0 1100 570', title, desc: 'Side view of a silver, laterally compressed hilsa shad with a deeply forked tail, ventral scutes and a faint dark shoulder spot. Stylised illustration.', body });
}

export function pabda({ p = uid('pb'), cutaway = true, title = 'Illustration of pabda, Ompok pabda, with gut-origin cutaway' } = {}) {
  const fish = pabdaFish(p, { cutaway });
  const body = `<defs>${blur(p, 'b14', 14)}${blur(p, 'b30', 30)}${fish.defs}</defs>
    <ellipse cx="560" cy="360" rx="420" ry="20" fill="#000" opacity=".16" filter="url(#${p}b30)"/>
    <g transform="translate(70 200) scale(1)">${fish.svg}</g>
    ${cutaway ? `<g font-family="${MONO}" font-size="15" fill="#5b4a46"><path d="M302 230 L302 318 L420 318" fill="none" stroke="#8d4a45" stroke-width="1.4"/><text x="428" y="323">gut contents · isolation source only</text><text x="428" y="343" fill="#8a7b75">not evidence of colonisation or benefit</text></g>` : ''}
    ${tag(1080, 404, 'STYLISED · NOT A TAXONOMIC PLATE', { fill: '#9a8b84' })}`;
  return svg({ vb: '0 0 1100 420', title, desc: 'Elongated, pale silvery catfish with a very long anal fin, a tiny dorsal fin and long barbels. A window in the belly shows the coiled intestine, marked as the isolation source.', body });
}

/* ------------------------------------------------------------------ */
/* Agar plates                                                         */
/* ------------------------------------------------------------------ */

// XLD agar plate, top-down, quadrant streak. Colony types: h2s (red, black centre),
// yel (yellow, xylose fermenter), red (red, no black centre).
export function xldPlate({ p = uid('x'), seed = 11, label = 'XLD · ILLUSTRATIVE', callouts = false, bench = true } = {}) {
  const R = rng(seed);
  const cx = 350, cy = 350, r = 292;
  const quads = [
    { a: -135, n: 260, rmin: 2.2, rmax: 3.8, spread: 4 },
    { a: -45, n: 90, rmin: 3, rmax: 5, spread: 5 },
    { a: 45, n: 30, rmin: 4.6, rmax: 7.5, spread: 6 },
    { a: 135, n: 12, rmin: 7, rmax: 11, spread: 3 },
  ];
  const streaks = [], halos = [], cols = [];
  const pick = () => { const v = R(); return v < 0.56 ? 'h2s' : v < 0.84 ? 'yel' : 'red'; };
  const reps = { h2s: null, yel: null, red: null };
  quads.forEach((q, qi) => {
    const th = (q.a * Math.PI) / 180, w = (34 * Math.PI) / 180;
    const pts = [];
    for (let k = 0; k < 8; k++) {
      const rad = r * (0.86 - k * 0.075), ang = th + (k % 2 ? w : -w);
      pts.push([cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)]);
    }
    streaks.push(`<polyline points="${pts.map((t) => t.map(f1).join(',')).join(' ')}" stroke-width="${[9, 5, 2, 2][qi]}" opacity="${[0.5, 0.4, 0.35, 0.3][qi]}"/>`);
    for (let i = 0; i < q.n; i++) {
      const [x0, y0] = lerpPoly(pts, R());
      const x = x0 + (R() - 0.5) * q.spread * 2, y = y0 + (R() - 0.5) * q.spread * 2;
      if (Math.hypot(x - cx, y - cy) > r - 12) continue;
      const cr = (q.rmin + R() * (q.rmax - q.rmin)) * 1.25, t = pick();
      if (t === 'yel') halos.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(cr * 2.2)}" fill="#e7bf55" opacity="${qi < 2 ? 0.09 : 0.24}"/>`);
      cols.push(`<g data-colony="${t}"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(cr)}" fill="url(#${p}c${t})"/>${cr > 4 ? `<ellipse cx="${f1(x - cr * 0.32)}" cy="${f1(y - cr * 0.36)}" rx="${f1(cr * 0.3)}" ry="${f1(cr * 0.2)}" fill="#fff" opacity=".55"/>` : ''}</g>`);
      if (qi >= 2 && !reps[t] && cr > 5.5) reps[t] = [x, y, cr];
    }
  });
  const LBL = { h2s: [740, 250, 'Red, black centre', 'H₂S producer: Salmonella-suspect'], yel: [740, 360, 'Yellow', 'xylose fermenter: not suspect'], red: [740, 470, 'Red, no black centre', 'H₂S-negative: check further'] };
  const slots = Object.keys(reps).filter((k) => reps[k]).sort((a, b) => reps[a][1] - reps[b][1]);
  const call = (t) => {
    if (!reps[t]) return '';
    const [x, y, cr] = reps[t], [, , a, b] = LBL[t], lx = 740, ly = 250 + slots.indexOf(t) * 110;
    return `<g class="callout" data-for="${t}"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(cr + 9)}" fill="none" stroke="#14202a" stroke-width="2.4"/><path d="M${f1(x + cr + 9)} ${f1(y)} L${lx - 14} ${ly - 6}" fill="none" stroke="#14202a" stroke-width="1.3"/><text x="${lx}" y="${ly}" font-family="${SANS}" font-size="19" font-weight="600" fill="#14202a">${esc(a)}</text><text x="${lx}" y="${ly + 22}" font-family="${MONO}" font-size="14" fill="#44535c">${esc(b)}</text></g>`;
  };
  const body = `<defs>${blur(p, 'b18', 18)}${grain(p, 0.55, 0.65, seed)}
      <radialGradient id="${p}ag" cx=".46" cy=".42" r=".62"><stop offset="0" stop-color="#d95a6a"/><stop offset=".7" stop-color="#c13a4b"/><stop offset="1" stop-color="#9c2334"/></radialGradient>
      <radialGradient id="${p}ch2s" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#0d0607"/><stop offset=".46" stop-color="#1c0b0d"/><stop offset=".64" stop-color="#5e1c25"/><stop offset=".84" stop-color="#d3586a"/><stop offset="1" stop-color="#e98593"/></radialGradient>
      <radialGradient id="${p}cyel" cx=".45" cy=".42" r=".6"><stop offset="0" stop-color="#fbe7a2"/><stop offset=".7" stop-color="#e7bd4f"/><stop offset="1" stop-color="#c99a2e"/></radialGradient>
      <radialGradient id="${p}cred" cx=".45" cy=".42" r=".6"><stop offset="0" stop-color="#f09aa4"/><stop offset=".7" stop-color="#d5596b"/><stop offset="1" stop-color="#b33b4d"/></radialGradient>
      <linearGradient id="${p}rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".45" stop-color="#fff" stop-opacity=".08"/><stop offset=".8" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity=".1"/></linearGradient>
      <clipPath id="${p}agclip"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
    ${bench ? `<circle cx="${cx + 16}" cy="${cy + 24}" r="${r + 22}" fill="#0b1418" opacity=".28" filter="url(#${p}b18)"/>` : ''}
    <circle cx="${cx}" cy="${cy}" r="${r + 22}" fill="#dfe9ec" opacity=".35" stroke="#9fb3b9" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${p}ag)"/>
    <g clip-path="url(#${p}agclip)">
      <rect x="0" y="0" width="700" height="700" filter="url(#${p}gr)" opacity=".22" style="mix-blend-mode:multiply"/>
      <g fill="none" stroke="#e98c98" stroke-linecap="round" stroke-linejoin="round">${streaks.join('')}</g>
      <g class="halos">${halos.join('')}</g>
      <g class="colonies">${cols.join('')}</g>
      <ellipse cx="250" cy="200" rx="200" ry="120" fill="#fff" opacity=".08" transform="rotate(-35 250 200)"/>
    </g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#7d1b29" stroke-width="5" opacity=".45"/>
    <circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="none" stroke="url(#${p}rim)" stroke-width="9"/>
    <path d="M${cx - 250} ${cy - 160} A300 300 0 0 1 ${cx + 40} ${cy - 300}" fill="none" stroke="#fff" stroke-width="4" opacity=".55" stroke-linecap="round"/>
    <g transform="rotate(34 560 110)"><rect x="470" y="88" width="196" height="36" rx="3" fill="#f2ecdc" opacity=".94"/><text x="568" y="112" text-anchor="middle" font-family="${MONO}" font-size="15" letter-spacing="1.5" fill="#3d3a33">${esc(label)}</text></g>
    ${callouts ? call('h2s') + call('yel') + call('red') : ''}`;
  return svg({ vb: callouts ? '0 0 1040 700' : '0 0 700 700', cls: 'plate plate-xld', title: 'Illustrative XLD agar plate', desc: 'Top-down view of a red XLD agar plate streaked in four quadrants. Colonies thin out from dense growth to isolated colonies. Some are red with black centres, some yellow, some plain red. Illustrative, not a study plate.', body });
}

// Mueller–Hinton disc-diffusion plate. zones: map code -> zone diameter in mm (illustrative).
export const DISCS = [
  { code: 'AMP', pot: '10', name: 'Ampicillin', x: 247, y: 247 },
  { code: 'TE', pot: '30', name: 'Tetracycline', x: 453, y: 247 },
  { code: 'CTX', pot: '30', name: 'Cefotaxime', x: 453, y: 453 },
  { code: 'CIP', pot: '5', name: 'Ciprofloxacin', x: 247, y: 453 },
];
export const MM = 292 / 45; // plate radius 292 units = 45 mm (90 mm dish)
export function mhPlate({ p = uid('m'), zones = { AMP: 6, TE: 9, CTX: 28, CIP: 33 }, label = 'MUELLER–HINTON · ILLUSTRATIVE', ruler = null } = {}) {
  const cx = 350, cy = 350, r = 292;
  const zoneCircles = DISCS.map((d) => `<circle class="zone" data-disc="${d.code}" cx="${d.x}" cy="${d.y}" r="${f1((zones[d.code] / 2) * MM)}" fill="#000"/>`).join('');
  const zoneRims = DISCS.map((d) => `<circle class="zone-rim" data-disc="${d.code}" cx="${d.x}" cy="${d.y}" r="${f1((zones[d.code] / 2) * MM)}" fill="none" stroke="#8a6a32" stroke-width="2.2" opacity=".55"/>`).join('');
  const discs = DISCS.map((d) => `<g class="disc" data-disc="${d.code}"><circle cx="${d.x + 2}" cy="${d.y + 3}" r="${f1(3 * MM)}" fill="#6b5328" opacity=".3"/><circle cx="${d.x}" cy="${d.y}" r="${f1(3 * MM)}" fill="#fbfaf5" stroke="#d9d2bf" stroke-width="1.5"/><text x="${d.x}" y="${d.y - 1}" text-anchor="middle" font-family="${MONO}" font-size="10.5" font-weight="500" fill="#2b2a26">${d.code}</text><text x="${d.x}" y="${d.y + 10}" text-anchor="middle" font-family="${MONO}" font-size="8.5" fill="#55534c">${d.pot}</text></g>`).join('');
  const rulerSvg = ruler ? (() => {
    const d = DISCS.find((x) => x.code === ruler.code), half = (ruler.mm / 2) * MM;
    return `<g class="ruler"><line x1="${f1(d.x - half)}" y1="${d.y + 0}" x2="${f1(d.x + half)}" y2="${d.y}" stroke="#14202a" stroke-width="2"/><line x1="${f1(d.x - half)}" y1="${d.y - 10}" x2="${f1(d.x - half)}" y2="${d.y + 10}" stroke="#14202a" stroke-width="2"/><line x1="${f1(d.x + half)}" y1="${d.y - 10}" x2="${f1(d.x + half)}" y2="${d.y + 10}" stroke="#14202a" stroke-width="2"/></g>`;
  })() : '';
  const body = `<defs>${blur(p, 'b18', 18)}${grain(p, 0.6, 0.045, 5)}
      <filter id="${p}lawnf" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .97 0 0 0 0 .92 0 0 0 0 .78 1.5 0 0 0 -.45"/></filter>
      <radialGradient id="${p}ag" cx=".46" cy=".42" r=".62"><stop offset="0" stop-color="#e2be78"/><stop offset=".75" stop-color="#cfa159"/><stop offset="1" stop-color="#b98a42"/></radialGradient>
      <linearGradient id="${p}rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".45" stop-color="#fff" stop-opacity=".08"/><stop offset=".8" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity=".1"/></linearGradient>
      <mask id="${p}lawnmask"><circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="#fff"/>${zoneCircles}</mask>
      <clipPath id="${p}agclip"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
    <circle cx="${cx + 16}" cy="${cy + 24}" r="${r + 22}" fill="#0b1418" opacity=".28" filter="url(#${p}b18)"/>
    <circle cx="${cx}" cy="${cy}" r="${r + 22}" fill="#dfe9ec" opacity=".35" stroke="#9fb3b9" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${p}ag)"/>
    <g clip-path="url(#${p}agclip)">
      <rect width="700" height="700" fill="#6e4a1c" opacity=".1"/><g mask="url(#${p}lawnmask)"><rect width="700" height="700" fill="#f0e2bb" opacity=".62"/><rect width="700" height="700" filter="url(#${p}lawnf)" opacity=".9"/></g>
      ${zoneRims}
      <ellipse cx="250" cy="200" rx="200" ry="120" fill="#fff" opacity=".1" transform="rotate(-35 250 200)"/>
    </g>
    ${discs}${rulerSvg}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#8c6a2c" stroke-width="5" opacity=".4"/>
    <circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="none" stroke="url(#${p}rim)" stroke-width="9"/>
    <path d="M${cx - 250} ${cy - 160} A300 300 0 0 1 ${cx + 40} ${cy - 300}" fill="none" stroke="#fff" stroke-width="4" opacity=".55" stroke-linecap="round"/>
    <g transform="rotate(-32 560 600)"><rect x="442" y="584" width="236" height="36" rx="3" fill="#f2ecdc" opacity=".94"/><text x="560" y="608" text-anchor="middle" font-family="${MONO}" font-size="14" letter-spacing="1.3" fill="#3d3a33">${esc(label)}</text></g>`;
  return svg({ vb: '0 0 700 700', cls: 'plate plate-mh', title: 'Illustrative Mueller–Hinton disc-diffusion plate', desc: 'Amber agar covered with a hazy bacterial lawn and four antibiotic discs: ampicillin, tetracycline, cefotaxime and ciprofloxacin. Clear zones of inhibition surround some discs. Zone sizes are illustrative, not measured.', body, attrs: `data-mm="${MM}"` });
}

// Nutrient-type culture plate with cream colonies (generic, illustrative).
export function culturePlate({ p = uid('cp'), seed = 3, n = 26, label = 'CULTURE · ILLUSTRATIVE', faint = 1 } = {}) {
  const R = rng(seed), cx = 350, cy = 350, r = 292;
  let cols = '';
  for (let i = 0; i < n; i++) {
    const a = R() * Math.PI * 2, d = Math.sqrt(R()) * (r - 40), cr = 6 + R() * 16;
    const x = cx + d * Math.cos(a), y = cy + d * Math.sin(a);
    cols += `<g opacity="${faint}"><path d="M${f1(x + cr)} ${f1(y)} ${Array.from({ length: 9 }, (_, k) => { const t = ((k + 1) / 9) * Math.PI * 2, rr = cr * (0.86 + R() * 0.24); return `L${f1(x + rr * Math.cos(t))} ${f1(y + rr * Math.sin(t))}`; }).join(' ')} Z" fill="url(#${p}col)" stroke="#c9b48a" stroke-width="1"/></g>`;
  }
  const body = `<defs>${blur(p, 'b18', 18)}
      <radialGradient id="${p}ag" cx=".46" cy=".42" r=".62"><stop offset="0" stop-color="#efe6c9"/><stop offset="1" stop-color="#d8c79c"/></radialGradient>
      <radialGradient id="${p}col" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#fffaf0"/><stop offset=".7" stop-color="#f1e5c6"/><stop offset="1" stop-color="#d9c697"/></radialGradient>
      <linearGradient id="${p}rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".45" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/></linearGradient></defs>
    <circle cx="${cx + 16}" cy="${cy + 24}" r="${r + 22}" fill="#0b1418" opacity=".22" filter="url(#${p}b18)"/>
    <circle cx="${cx}" cy="${cy}" r="${r + 22}" fill="#eef3f4" opacity=".5" stroke="#a8b9be" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${p}ag)"/>${cols}
    <circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="none" stroke="url(#${p}rim)" stroke-width="9"/>
    <g transform="rotate(34 560 110)"><rect x="470" y="88" width="210" height="36" rx="3" fill="#fbf8ee" opacity=".95"/><text x="575" y="112" text-anchor="middle" font-family="${MONO}" font-size="14" letter-spacing="1.3" fill="#3d3a33">${esc(label)}</text></g>`;
  return svg({ vb: '0 0 700 700', cls: 'plate', title: 'Illustrative culture plate', desc: 'Pale agar plate with scattered cream colonies. Illustrative of the isolation method, not a study result.', body });
}

/* ------------------------------------------------------------------ */
/* Cells and molecular schematics                                      */
/* ------------------------------------------------------------------ */

export function salmonellaCell({ p = uid('sc'), dark = true } = {}) {
  const R = rng(5);
  let flag = '';
  const starts = [[170, 120], [230, 106], [300, 104], [370, 106], [430, 120], [450, 190], [400, 206], [320, 208], [240, 206], [160, 194], [140, 150], [460, 150]];
  starts.forEach(([x, y], i) => {
    const ang = Math.atan2(y - 155, x - 300) + (R() - 0.5) * 0.6, len = 110 + R() * 90;
    let d = `M${x} ${y}`;
    for (let k = 1; k <= 24; k++) {
      const t = k / 24, along = t * len, side = Math.sin(t * Math.PI * 4.5 + i) * 9 * Math.min(1, t * 3);
      d += ` L${f1(x + Math.cos(ang) * along - Math.sin(ang) * side)} ${f1(y + Math.sin(ang) * along + Math.cos(ang) * side)}`;
    }
    flag += `<path d="${d}"/>`;
  });
  const body = `<defs>${blur(p, 'b8', 8)}
      <linearGradient id="${p}rod" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6b7bf"/><stop offset=".45" stop-color="#d9606f"/><stop offset="1" stop-color="#7d2233"/></linearGradient></defs>
    <g fill="none" stroke="${dark ? '#e7b4bb' : '#a3505d'}" stroke-width="2.4" opacity=".7" stroke-linecap="round" stroke-linejoin="round">${flag}</g>
    <rect x="150" y="110" width="300" height="90" rx="45" fill="url(#${p}rod)"/>
    <rect x="150" y="110" width="300" height="90" rx="45" fill="none" stroke="${dark ? '#ffd6dc' : '#7d2233'}" stroke-width="2" opacity=".55"/>
    <rect x="186" y="122" width="210" height="16" rx="8" fill="#fff" opacity=".35" filter="url(#${p}b8)"/>
    <g font-family="${MONO}" font-size="13"><line x1="40" y1="280" x2="140" y2="280" stroke="${dark ? '#c8d3d6' : '#3a4650'}" stroke-width="3"/><text x="40" y="270" fill="${dark ? '#c8d3d6' : '#3a4650'}">1 µm</text></g>
    <rect x="144" y="104" width="312" height="102" rx="51" fill="none" stroke="${dark ? '#f6b7bf' : '#7d2233'}" stroke-width="1.2" opacity=".35"/>`;
  return svg({ vb: '0 0 600 300', cls: 'cell', title: 'Schematic Salmonella cell', desc: 'A rod-shaped, Gram-negative bacterium about 3 micrometres long with flagella all around its surface (peritrichous). Scale bar 1 micrometre. Schematic.', body });
}

export function invASchematic({ p = uid('iv') } = {}) {
  const body = `<defs><linearGradient id="${p}chr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5d6f7a"/><stop offset="1" stop-color="#3c4b55"/></linearGradient></defs>
    <g font-family="${MONO}" font-size="13" fill="#3a4650">
      <rect x="40" y="52" width="820" height="14" rx="7" fill="url(#${p}chr)"/>
      <rect x="548" y="46" width="70" height="26" rx="3" fill="#d0465a"/>
      <text x="40" y="36">Salmonella chromosome · ~4.8 Mb</text><text x="583" y="36" text-anchor="middle" fill="#a3283b">SPI-1 · ~40 kb</text>
      <path d="M548 72 L120 150 M618 72 L780 150" stroke="#9aa9b2" stroke-width="1.2" stroke-dasharray="4 4" fill="none"/>
      <line x1="110" y1="182" x2="790" y2="182" stroke="#9aa9b2" stroke-width="2"/>
      <path d="M130 168 H250 L268 182 L250 196 H130 Z" fill="#c9d3d8"/><text x="190" y="187" text-anchor="middle">invE</text>
      <path d="M282 164 H580 L604 182 L580 200 H282 Z" fill="#d0465a"/><text x="430" y="188" text-anchor="middle" fill="#fff" font-size="15" font-weight="500">invA</text>
      <path d="M618 168 H730 L748 182 L730 196 H618 Z" fill="#c9d3d8"/><text x="672" y="187" text-anchor="middle">invB</text>
      <path d="M352 146 H420 M420 146 L408 140 M420 146 L408 152" stroke="#14202a" stroke-width="2.4" fill="none"/><text x="350" y="134">F primer</text>
      <path d="M520 220 H452 M452 220 L464 214 M452 220 L464 226" stroke="#14202a" stroke-width="2.4" fill="none"/><text x="470" y="246">R primer</text>
      <path d="M352 262 V272 H520 V262" stroke="#14202a" stroke-width="1.4" fill="none"/>
      <text x="436" y="292" text-anchor="middle">amplicon · length fixed by the primer pair</text>
    </g>`;
  return svg({ vb: '0 0 900 310', cls: 'schematic', title: 'Schematic of the invA PCR target', desc: 'The invA gene lies inside Salmonella pathogenicity island 1 on the chromosome, between invE and invB. A forward and a reverse primer bracket the amplified region. Schematic; not to scale.', body });
}

export function gelFrame({ p = uid('gl'), lanes = ['L', '+', '−', 'NTC', '1', '2', '3', '4', '…'] } = {}) {
  const w = 520, lw = 44, x0 = 62;
  const wells = lanes.map((l, i) => `<rect x="${x0 + i * lw}" y="46" width="30" height="9" rx="1.5" fill="#05090c" stroke="#2c3e4a" stroke-width="1"/><text x="${x0 + i * lw + 15}" y="330" text-anchor="middle" font-family="${MONO}" font-size="13" fill="#3a4650">${esc(l)}</text>`).join('');
  const body = `<defs><radialGradient id="${p}gel" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="#1b2a35"/><stop offset="1" stop-color="#0b1218"/></radialGradient></defs>
    <rect x="40" y="26" width="${w - 80}" height="270" rx="6" fill="url(#${p}gel)"/>${wells}
    <rect x="58" y="76" width="${w - 116}" height="200" rx="4" fill="none" stroke="#f3ac45" stroke-width="2" stroke-dasharray="8 7"/>
    <text x="${w / 2}" y="168" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="25" fill="#f3d39a">Gel photograph required</text>
    <text x="${w / 2}" y="196" text-anchor="middle" font-family="${MONO}" font-size="13" fill="#b9c6cc">bands are never drawn in this Atlas</text>`;
  return svg({ vb: `0 0 ${w} 344`, cls: 'gel', title: 'Empty gel template awaiting the real photograph', desc: 'An empty agarose gel outline with nine wells labelled ladder, positive control, negative control, no-template control and isolates 1 to 4. No bands are drawn. A dashed box reads: gel photograph required.', body });
}

// Typical teleost mitogenome, schematic gene order with approximate lengths (bp).
const MT = [['12S', 950], ['16S', 1690], ['ND1', 975], ['ND2', 1047], ['COI', 1551], ['COII', 691], ['A8', 168], ['ATP6', 684], ['COIII', 785], ['ND3', 349], ['4L', 297], ['ND4', 1381], ['ND5', 1839], ['ND6', 522], ['cytb', 1141], ['CR', 900]];
export function mtRing({ p = uid('mt'), dark = true } = {}) {
  const gap = 70, total = MT.reduce((s, g) => s + g[1] + gap, 0), cx = 220, cy = 220, R0 = 150;
  let a = -Math.PI / 2, arcs = '', labels = '';
  MT.forEach(([n, len]) => {
    const a1 = a + (len / total) * Math.PI * 2, hi = n === 'cytb';
    const big = a1 - a > Math.PI ? 1 : 0, rr = hi ? R0 + 6 : R0;
    const x0 = cx + rr * Math.cos(a), y0 = cy + rr * Math.sin(a), x1 = cx + rr * Math.cos(a1), y1 = cy + rr * Math.sin(a1);
    arcs += `<path d="M${f1(x0)} ${f1(y0)} A${rr} ${rr} 0 ${big} 1 ${f1(x1)} ${f1(y1)}" stroke="${hi ? `url(#${p}cy)` : dark ? '#3e5961' : '#b7c6cb'}" stroke-width="${hi ? 34 : 22}" fill="none" ${hi ? `filter="url(#${p}glow)"` : ''}/>`;
    const am = (a + a1) / 2, lr = R0 + (hi ? 48 : 34);
    if (len > 300 || hi) labels += `<text x="${f1(cx + lr * Math.cos(am))}" y="${f1(cy + lr * Math.sin(am) + 4)}" text-anchor="middle" font-family="${MONO}" font-size="${hi ? 16 : 11}" fill="${hi ? (dark ? '#f2f6f6' : '#14202a') : dark ? '#7f969d' : '#6a7b82'}" ${hi ? 'font-weight="500"' : ''}>${n}</text>`;
    a = a1 + (gap / total) * Math.PI * 2;
  });
  const body = `<defs><linearGradient id="${p}cy" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#b8c9cf"/><stop offset="1" stop-color="#e9d9a6"/></linearGradient>
    <filter id="${p}glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    ${arcs}${labels}
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-family="${SERIF}" font-size="22" fill="${dark ? '#dfe7e8' : '#14202a'}">mtDNA</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${dark ? '#7f969d' : '#6a7b82'}">~16.6 kb · schematic</text>`;
  return svg({ vb: '0 0 440 440', cls: 'mt', title: 'Schematic mitochondrial genome with cytochrome b highlighted', desc: 'A ring of mitochondrial genes in the typical teleost order, with the cytochrome b gene highlighted in silver. Lengths approximate.', body });
}

// cytb alignment thread: 1114 positions; variable sites shown as an unplaced count until the FASTA exists.
export function cytbThread({ p = uid('cb'), len = 1114, invariant = 1099, win = [520, 560], dark = true } = {}) {
  const x0 = 40, x1 = 960, k = (x1 - x0) / len, variable = len - invariant;
  let ticks = '';
  for (let b = 0; b <= 1000; b += 100) ticks += `<line x1="${f1(x0 + b * k)}" y1="118" x2="${f1(x0 + b * k)}" y2="128" /><text x="${f1(x0 + b * k)}" y="146" text-anchor="middle">${b}</text>`;
  ticks += `<line x1="${x1}" y1="114" x2="${x1}" y2="130"/><text x="${x1}" y="146" text-anchor="middle">${len}</text>`;
  const wx = x0 + win[0] * k, ww = (win[1] - win[0]) * k;
  const ns = Array.from({ length: 14 }, (_, i) => `<text x="${f1(wx - 120 + i * 22 + 22)}" y="44" text-anchor="middle">N</text>`).join('');
  const dia = Array.from({ length: variable }, (_, i) => `<path d="M${790 + (i % 8) * 20} ${200 + Math.floor(i / 8) * 20} l7 -7 l7 7 l-7 7 z" fill="none" stroke="${dark ? '#e9d9a6' : '#8a6d1f'}" stroke-width="1.6"/>`).join('');
  const fg = dark ? '#c8d3d6' : '#33424c', sub = dark ? '#7f969d' : '#6a7b82';
  const body = `<defs><linearGradient id="${p}th" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#9fb2b8"/><stop offset="1" stop-color="#e8eef0"/></linearGradient>
      <pattern id="${p}bp" width="${f1(k * 4)}" height="20" patternUnits="userSpaceOnUse"><rect width="${f1(k * 2)}" height="20" fill="#000" opacity=".18"/></pattern></defs>
    <rect x="${x0}" y="92" width="${x1 - x0}" height="18" rx="9" fill="url(#${p}th)"/>
    <rect x="${x0}" y="92" width="${x1 - x0}" height="18" rx="9" fill="url(#${p}bp)"/>
    <g class="scrub" style="transform:translateX(0px)"><rect x="${f1(wx)}" y="84" width="${f1(ww)}" height="34" rx="5" fill="none" stroke="#f3d39a" stroke-width="2.4"/>
      <path d="M${f1(wx)} 84 L${f1(wx - 120 + 22)} 60 M${f1(wx + ww)} 84 L${f1(wx - 120 + 22 * 14 + 10)} 60" stroke="#f3d39a" stroke-width="1.2" opacity=".7"/>
      <rect x="${f1(wx - 120 + 10)}" y="20" width="${22 * 14 + 2}" height="38" rx="6" fill="${dark ? '#0f1c22' : '#fff'}" stroke="#f3d39a" stroke-width="1.6"/>
      <g font-family="${MONO}" font-size="17" fill="#f3d39a">${ns}</g></g>
    <g font-family="${MONO}" font-size="12" fill="${sub}" stroke="${sub}" stroke-width="0">${ticks.replace(/<line /g, `<line stroke="${sub}" stroke-width="1.2" `)}</g>
    <g font-family="${MONO}" font-size="13" fill="${fg}">
      <text x="${x0}" y="182">${invariant} invariant positions</text>
      <text x="${x0}" y="202" fill="${sub}">N = base not loaded; real bases come from the alignment FASTA</text>
      <text x="780" y="182" fill="${fg}">${variable} variable sites</text>${dia}
      <text x="780" y="262" fill="${sub}" font-size="11">positions not yet placed</text></g>`;
  return svg({ vb: '0 0 1000 272', cls: 'thread', title: `Cytochrome b alignment of ${len} positions`, desc: `A silver ruler of ${len} aligned positions, ${invariant} invariant. A magnifier shows unknown bases (N) because the alignment file has not been supplied. ${variable} variable sites are listed as a count, not placed.`, body });
}
