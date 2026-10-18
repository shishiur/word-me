// Research Atlas scene illustrations: environments and timelines.
import { uid, rng, svg, esc, carp } from './illus.mjs';

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const SERIF = "'Newsreader', Georgia, serif";
const f1 = (n) => Math.round(n * 10) / 10;
const blur = (p, name, sd) => `<filter id="${p}${name}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
const grain = (p, alpha = 0.5, freq = 0.85) => `<filter id="${p}gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="9" stitchTiles="stitch"/><feColorMatrix values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 ${alpha}"/></filter>`;

/* ------------------------------------------------------------------ */
/* Wet-market cutting station                                          */
/* ------------------------------------------------------------------ */

// Matrix names: three appear on the published site; four are inferred from its phrase
// "fish, water, handlers, tools and processing surfaces" and must be checked against the thesis.
export const STATION = {
  targets: { water: [206, 598], hands: [424, 520], flesh: [524, 556], skin: [612, 548], tool: [700, 530], basket: [1028, 582], board: [470, 630] },
  markers: { water: [112, 512], hands: [318, 462], flesh: [500, 440], skin: [648, 440], tool: [812, 452], basket: [1060, 470], board: [604, 664] },
  order: ['skin', 'flesh', 'basket', 'water', 'hands', 'tool', 'board'],
};

export function marketScene({ p = uid('ms'), spot = null, markers = false, leaders = true, dimOp = 0.64 } = {}) {
  const T = STATION.targets, M = STATION.markers, R = rng(21);
  const fish = carp(p, { cut: true });
  const bokeh = Array.from({ length: 16 }, () => {
    const x = 660 + R() * 540, y = 150 + R() * 150, r = 6 + R() * 22, warm = R() > 0.35;
    return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${warm ? '#f3ac45' : '#9fc3c4'}" opacity="${f1(0.08 + R() * 0.3)}"/>`;
  }).join('');
  const scales = Array.from({ length: 34 }, () => {
    const a = R() * Math.PI * 2, d = 190 + R() * 120, x = 520 + Math.cos(a) * d * 1.1, y = 640 + Math.sin(a) * d * 0.16;
    return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(2 + R() * 3)}" ry="${f1(1 + R() * 1.4)}" fill="#dfe8e6" opacity="${f1(0.3 + R() * 0.5)}" transform="rotate(${f1(R() * 180)} ${f1(x)} ${f1(y)})"/>`;
  }).join('');
  const rings = [0.82, 0.64, 0.46, 0.3, 0.16].map((k) => `<ellipse cx="520" cy="590" rx="${f1(176 * k)}" ry="${f1(50 * k)}" fill="none" stroke="#6b4426" stroke-width="1.3" opacity=".45"/>`).join('');
  const scores = Array.from({ length: 14 }, () => {
    const x = 400 + R() * 240, y = 570 + R() * 38, l = 14 + R() * 30, a = -20 + R() * 40;
    return `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x + l * Math.cos((a * Math.PI) / 180))}" y2="${f1(y + l * 0.3 * Math.sin((a * Math.PI) / 180))}" stroke="#4f311b" stroke-width="1.2" opacity=".5"/>`;
  }).join('');
  const lead = (k) => {
    const [tx, ty] = T[k], [mx, my] = M[k];
    return `<g class="leader" data-matrix="${k}"><line x1="${tx}" y1="${ty}" x2="${mx}" y2="${my}" stroke="#ffe2a6" stroke-opacity=".6" stroke-width="1.4" stroke-dasharray="3 4"/><circle cx="${tx}" cy="${ty}" r="12" fill="none" stroke="#ffe2a6" stroke-opacity=".45" stroke-width="1.4"/><circle cx="${tx}" cy="${ty}" r="4.5" fill="#ffe2a6"/></g>`;
  };
  const mark = (k, i) => {
    const [mx, my] = M[k];
    return `<g class="marker" data-matrix="${k}"><circle cx="${mx}" cy="${my}" r="21" fill="#0d1719" stroke="#ffe2a6" stroke-width="2"/><text x="${mx}" y="${my + 6}" text-anchor="middle" font-family="${MONO}" font-size="17" font-weight="500" fill="#ffe2a6">${i + 1}</text></g>`;
  };
  const sp = spot ? T[spot] : [-500, -500];
  const body = `<defs>${blur(p, 'b3', 3)}${blur(p, 'b6', 6)}${blur(p, 'b14', 14)}${blur(p, 'b30', 30)}${grain(p, 0.5, 0.8)}${fish.defs}
      <linearGradient id="${p}wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1314"/><stop offset="1" stop-color="#16282a"/></linearGradient>
      <pattern id="${p}tin" width="28" height="60" patternUnits="userSpaceOnUse"><rect width="28" height="60" fill="#132324"/><rect width="10" height="60" fill="#1d3233"/><rect x="10" width="2.5" height="60" fill="#3b5656" opacity=".55"/><rect x="25" width="3" height="60" fill="#0b1617" opacity=".7"/></pattern>
      <radialGradient id="${p}vig" cx="400" cy="170" r="820" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#050a0b" stop-opacity="0"/><stop offset=".45" stop-color="#050a0b" stop-opacity=".36"/><stop offset="1" stop-color="#050a0b" stop-opacity=".82"/></radialGradient>
      <radialGradient id="${p}glow" cx="380" cy="120" r="600" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffd089" stop-opacity=".66"/><stop offset=".22" stop-color="#f3ac45" stop-opacity=".28"/><stop offset=".62" stop-color="#f3ac45" stop-opacity=".09"/><stop offset="1" stop-color="#f3ac45" stop-opacity="0"/></radialGradient>
      <linearGradient id="${p}floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2e2f"/><stop offset="1" stop-color="#081011"/></linearGradient>
      <radialGradient id="${p}bulb" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#fffdf2"/><stop offset=".45" stop-color="#ffe3a0"/><stop offset="1" stop-color="#f0a33c"/></radialGradient>
      <linearGradient id="${p}steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2f3b3e"/><stop offset=".3" stop-color="#c7d3d5"/><stop offset=".52" stop-color="#7e9094"/><stop offset=".78" stop-color="#e3ebec"/><stop offset="1" stop-color="#3c494c"/></linearGradient>
      <linearGradient id="${p}blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef5f6"/><stop offset=".45" stop-color="#8fa2a6"/><stop offset="1" stop-color="#36454a"/></linearGradient>
      <radialGradient id="${p}woodTop" cx=".42" cy=".38" r=".66"><stop offset="0" stop-color="#c48d57"/><stop offset=".6" stop-color="#9a6a3e"/><stop offset="1" stop-color="#6a4325"/></radialGradient>
      <linearGradient id="${p}woodSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a2e19"/><stop offset=".28" stop-color="#7a4d2b"/><stop offset=".5" stop-color="#8f5d35"/><stop offset="1" stop-color="#25170d"/></linearGradient>
      <linearGradient id="${p}plank" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a87444"/><stop offset="1" stop-color="#5a3a20"/></linearGradient>
      <radialGradient id="${p}water" cx=".38" cy=".4" r=".7"><stop offset="0" stop-color="#2e5050"/><stop offset="1" stop-color="#0e1f20"/></radialGradient>
      <linearGradient id="${p}skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b07652"/><stop offset=".5" stop-color="#83533a"/><stop offset="1" stop-color="#4c2e1f"/></linearGradient>
      <linearGradient id="${p}arm" gradientUnits="userSpaceOnUse" x1="282" y1="380" x2="336" y2="338"><stop offset="0" stop-color="#3e2418"/><stop offset=".45" stop-color="#7a4b32"/><stop offset=".8" stop-color="#b98058"/><stop offset="1" stop-color="#d9a27a"/></linearGradient>
      <radialGradient id="${p}palm" cx=".62" cy=".3" r=".8"><stop offset="0" stop-color="#c48a62"/><stop offset=".55" stop-color="#8a573b"/><stop offset="1" stop-color="#4c2e1f"/></radialGradient>
      <pattern id="${p}check" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#33506a"/><rect width="24" height="8" fill="#5b7a93" opacity=".8"/><rect width="8" height="24" fill="#5b7a93" opacity=".6"/></pattern>
      <pattern id="${p}weave" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(24)"><rect width="18" height="18" fill="#5e4524"/><rect width="18" height="7" fill="#c9a56a"/><rect y="9" width="7" height="9" fill="#a8864f"/><rect x="9" y="9" width="9" height="9" fill="#866838"/></pattern>
      <linearGradient id="${p}bshade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd089" stop-opacity=".18"/><stop offset=".5" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".65"/></linearGradient>
      <linearGradient id="${p}gut" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d98476"/><stop offset="1" stop-color="#7c2a2a"/></linearGradient>
      <mask id="${p}spotMask"><rect width="1200" height="720" fill="#fff"/><circle class="spot-hole" cx="0" cy="0" r="112" fill="#000" filter="url(#${p}b30)" style="transform:translate(${sp[0]}px,${sp[1]}px)"/></mask>
    </defs>
    <rect width="1200" height="720" fill="url(#${p}wall)"/>
    <rect width="1200" height="410" fill="url(#${p}tin)" opacity=".85"/>
    <g opacity=".9"><path d="M720 262 L1200 244 L1200 410 L720 414 Z" fill="#0b1516"/><path d="M720 262 L1200 244 L1200 256 L720 274 Z" fill="#1f3233"/>
      <g fill="#344a4c" opacity=".7"><ellipse cx="800" cy="256" rx="40" ry="9"/><ellipse cx="810" cy="248" rx="34" ry="8"/><ellipse cx="900" cy="252" rx="46" ry="10"/><ellipse cx="1110" cy="244" rx="52" ry="11"/></g></g>
    <g fill="none" stroke="#3a5254" stroke-width="2.2" opacity=".55"><path d="M930 40 V86 M860 86 H1000 M866 86 L846 168 M866 86 L888 168 M994 86 L972 168 M994 86 L1016 168"/><path d="M838 168 Q867 190 896 168 M964 168 Q994 190 1024 168"/></g>
    <g filter="url(#${p}b6)">${bokeh}</g>
    <rect width="1200" height="720" fill="url(#${p}vig)"/>
    <path d="M0 404 L1200 392 L1200 420 L0 432 Z" fill="#1c2e2f"/><path d="M0 404 L1200 392" stroke="#4c6563" stroke-width="1.5" opacity=".7"/>
    <path d="M0 432 L1200 420 L1200 720 L0 720 Z" fill="url(#${p}floor)"/>
    <g filter="url(#${p}b14)"><ellipse cx="384" cy="610" rx="40" ry="140" fill="#f3ac45" opacity=".2"/><ellipse cx="384" cy="474" rx="18" ry="44" fill="#ffd089" opacity=".32"/><ellipse cx="900" cy="690" rx="200" ry="20" fill="#9fc3c4" opacity=".06"/></g>
    <g fill="none" stroke="#f3ac45" stroke-opacity=".14" stroke-width="1.4"><ellipse cx="300" cy="684" rx="130" ry="8"/><ellipse cx="860" cy="700" rx="160" ry="7"/><ellipse cx="120" cy="660" rx="80" ry="5"/></g>
    <path d="M368 126 L392 126 L840 720 L-60 720 Z" fill="#f3ac45" opacity=".045"/>
    <rect width="1200" height="720" fill="url(#${p}glow)"/>
    <path d="M380 0 V88" stroke="#1a1a1a" stroke-width="2.5"/><rect x="371" y="84" width="18" height="18" rx="3" fill="#2a2724"/><rect x="373" y="98" width="14" height="6" fill="#57514a"/>
    <g class="bulb"><circle cx="380" cy="120" r="74" fill="#ffc463" opacity=".34" filter="url(#${p}b14)"/><circle cx="380" cy="120" r="18" fill="url(#${p}bulb)"/><path d="M374 117 q6 -10 12 0" stroke="#fff6dc" stroke-width="1.5" fill="none"/></g>

    <ellipse cx="208" cy="692" rx="136" ry="18" fill="#000" opacity=".55" filter="url(#${p}b6)"/>
    <g class="obj" data-matrix="water">
      <path d="M86 596 C92 656 142 690 206 690 C270 690 320 656 326 596 Z" fill="url(#${p}steel)"/>
      <path d="M100 640 C150 668 260 668 312 640" fill="none" stroke="#000" stroke-width="2" opacity=".18"/>
      <ellipse cx="206" cy="596" rx="120" ry="32" fill="#c9d4d6"/><ellipse cx="206" cy="598" rx="108" ry="25" fill="url(#${p}water)"/>
      <ellipse cx="246" cy="594" rx="22" ry="5" fill="#ffd88e" opacity=".75"/><ellipse cx="170" cy="602" rx="40" ry="3" fill="#9fc3c4" opacity=".25"/>
      <path d="M90 594 A120 32 0 0 1 200 564" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>
    </g>

    <ellipse cx="530" cy="648" rx="206" ry="24" fill="#000" opacity=".6" filter="url(#${p}b6)"/>
    <g class="obj" data-matrix="board">
      <path d="M342 590 A178 50 0 0 0 698 590 L698 634 A178 50 0 0 1 342 634 Z" fill="url(#${p}woodSide)"/>
      <path d="M360 612 V640 M420 628 V650 M500 634 V656 M590 632 V652 M660 618 V642" stroke="#2c1a0e" stroke-width="2" opacity=".5"/>
      <ellipse cx="520" cy="590" rx="178" ry="50" fill="url(#${p}woodTop)"/>${rings}${scores}
      <ellipse cx="470" cy="574" rx="90" ry="14" fill="#fff" opacity=".08"/>
    </g>
    <g fill="#dfe8e6">${scales}</g>
    <g class="obj" data-matrix="skin flesh"><g transform="translate(372 556) rotate(-4) scale(.31)">${fish.svg}</g></g>

    <ellipse cx="840" cy="672" rx="150" ry="14" fill="#000" opacity=".55" filter="url(#${p}b6)"/>
    <g class="obj" data-matrix="tool">
      <path d="M704 648 L950 612 L962 630 L716 670 Z" fill="url(#${p}plank)"/><path d="M716 670 L962 630 L962 642 L718 684 Z" fill="#3a2414"/>
      <path d="M760 646 L930 621" stroke="#5a3a20" stroke-width="1.3" opacity=".6"/>
      <rect x="716" y="628" width="34" height="24" rx="3" fill="#2e3437" transform="rotate(-8 733 640)"/>
      <path d="M722 640 C718 596 712 548 690 502 C676 472 660 454 638 440 C664 474 690 520 702 560 C708 590 716 620 744 636 Z" fill="url(#${p}blade)"/>
      <path d="M640 442 C664 474 690 520 702 560 C708 590 716 620 744 636" fill="none" stroke="#ffffff" stroke-width="2.2" opacity=".85"/>
      <path d="M700 520 C704 540 706 556 706 566" stroke="#b3424d" stroke-width="3" opacity=".35" fill="none"/>
    </g>

    <ellipse cx="1036" cy="672" rx="140" ry="16" fill="#000" opacity=".6" filter="url(#${p}b6)"/>
    <g class="obj" data-matrix="basket">
      <path d="M910 578 C916 632 950 670 1030 672 C1110 670 1144 632 1150 578 Z" fill="url(#${p}weave)"/>
      <path d="M910 578 C916 632 950 670 1030 672 C1110 670 1144 632 1150 578 Z" fill="url(#${p}bshade)"/>
      <ellipse cx="1030" cy="578" rx="120" ry="34" fill="none" stroke="#d6b276" stroke-width="8"/>
      <ellipse cx="1030" cy="580" rx="106" ry="26" fill="#22150c"/>
      <path d="M950 584 C968 562 1000 594 1022 574 C1044 556 1070 590 1100 574" fill="none" stroke="url(#${p}gut)" stroke-width="15" stroke-linecap="round"/>
      <path d="M970 594 C990 584 1010 600 1040 590" fill="none" stroke="#b35b54" stroke-width="12" stroke-linecap="round"/>
      <ellipse cx="1078" cy="584" rx="22" ry="11" fill="#e7dcce"/><ellipse cx="1050" cy="572" rx="20" ry="9" fill="#4a1517"/>
      <path d="M954 580 C968 568 990 584 1008 576 M1074 580 q8 -4 14 0" stroke="#fff" stroke-width="2" opacity=".5" fill="none"/>
    </g>

    <g class="obj" data-matrix="hands">
      <path d="M196 262 C250 322 322 410 374 476 L422 458 C374 392 302 302 252 236 Z" fill="url(#${p}arm)"/>
      <path d="M150 196 L258 168 L294 258 L204 296 Z" fill="url(#${p}check)"/><path d="M204 296 L294 258" stroke="#1d2f3e" stroke-width="4"/><path d="M150 196 L258 168" stroke="#7d9ab0" stroke-width="2" opacity=".6"/>
      <path d="M368 470 C352 500 360 540 388 560 C414 578 452 576 468 556 C482 538 474 504 452 482 C432 462 386 452 368 470 Z" fill="url(#${p}palm)"/>
      <g fill="url(#${p}palm)" stroke="#2e1a10" stroke-width="1.6" stroke-linejoin="round">
        <path d="M392 556 C390 576 396 594 408 598 C418 600 424 592 422 580 L418 556 Z"/>
        <path d="M420 562 C420 582 428 598 440 598 C450 598 454 588 450 576 L444 556 Z"/>
        <path d="M446 556 C450 572 458 584 468 582 C476 580 478 570 472 560 L462 546 Z"/>
      </g>
      <path d="M372 474 C366 452 378 436 396 440 C404 452 402 466 394 478" fill="url(#${p}palm)" stroke="#2e1a10" stroke-width="1.4"/>
      <path d="M396 470 C414 462 440 466 458 482" fill="none" stroke="#e8b48e" stroke-width="2.2" opacity=".6"/>
      <path d="M262 250 C306 304 350 368 392 442" fill="none" stroke="#e8b48e" stroke-width="2" opacity=".4"/>
    </g>
    ${grainRectS(p)}
    <rect class="spot-dim" width="1200" height="720" fill="#03080a" mask="url(#${p}spotMask)" opacity="${spot ? dimOp : 0}"/>
    ${leaders ? `<g class="leaders">${STATION.order.map(lead).join('')}</g>` : ''}
    ${markers ? `<g class="markers">${STATION.order.map(mark).join('')}</g>` : ''}
    <text x="1180" y="706" text-anchor="end" font-family="${MONO}" font-size="13" letter-spacing="1.5" fill="#9fb2b7" opacity=".7">ILLUSTRATIVE RECONSTRUCTION · NOT A PHOTOGRAPH</text>`;
  return svg({ vb: '0 0 1200 720', cls: 'scene scene-market', title: 'Illustrated fish-cutting station in a wet market at night', desc: 'A cutter’s station lit by a single bare bulb: an aluminium bowl of water, a wooden chopping block with a fish cut into steaks, a bonti blade on a plank, a bamboo basket of viscera and the handler’s hand. Numbered leaders mark the seven sampled matrices. Illustrative; positions do not show a transmission pathway.', body });
}
function grainRectS(p) { return `<rect width="1200" height="720" filter="url(#${p}gr)" opacity=".14" style="mix-blend-mode:overlay" pointer-events="none"/>`; }

/* ------------------------------------------------------------------ */
/* Sylhet haor and river schematic                                     */
/* ------------------------------------------------------------------ */
// Schematic positions from approximate coordinates (x = (lon-91.3)*690, y = (25.2-lat)*690).
export function haorMap({ p = uid('hm'), transparent = false, over = false, dark = true } = {}) {
  const ink = dark ? '#dfe7e8' : '#14202a', sub = dark ? '#8fa6ad' : '#5a6b72', river = dark ? '#9cc7d3' : '#2f7c95';
  const surma = 'M814 221 C760 200 700 214 650 202 C600 190 560 226 520 214 C470 200 430 222 393 214 C350 205 320 180 280 176 C230 170 200 140 150 128 C110 118 90 104 69 97';
  const kush = 'M814 221 C770 246 740 268 700 274 C650 282 630 306 590 314 C540 324 500 338 449 345 C410 352 390 376 350 392 C300 412 280 440 230 470 C200 490 170 510 140 540';
  const juri = 'M660 540 C630 506 600 480 572 450 C552 428 540 412 528 400';
  const haor = 'M454 360 C470 336 512 330 540 342 C566 352 584 372 578 398 C572 424 540 440 506 436 C476 432 446 420 440 398 C436 384 444 372 454 360 Z';
  const R = rng(8);
  const reeds = Array.from({ length: 60 }, () => { const x = 444 + R() * 136, y = 336 + R() * 100; return `<path d="M${f1(x)} ${f1(y)} l-2 -7 M${f1(x)} ${f1(y)} l2 -8 M${f1(x)} ${f1(y)} l0 -6"/>`; }).join('');
  const body = `<defs><clipPath id="${p}hc"><path d="${haor}"/></clipPath>
      <linearGradient id="${p}land" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${dark ? '#1c2b26' : '#e3e7d8'}"/><stop offset="1" stop-color="${dark ? '#142320' : '#d4dccb'}"/></linearGradient></defs>
    ${over ? `<mask id="${p}lm"><rect width="900" height="560" fill="#fff"/><path d="${haor}" fill="#000"/><g fill="none" stroke="#000" stroke-linecap="round"><path d="${surma}" stroke-width="16"/><path d="${kush}" stroke-width="14"/><path d="${juri}" stroke-width="8"/></g></mask><rect width="900" height="560" fill="url(#${p}land)" opacity=".6" mask="url(#${p}lm)"/>` : transparent ? '' : `<rect width="900" height="560" fill="url(#${p}land)"/>`}
    <g fill="none" stroke-linecap="round">
      <path d="${surma}" stroke="${river}" stroke-width="7" opacity=".9"/><path d="${kush}" stroke="${river}" stroke-width="6" opacity=".8"/><path d="${juri}" stroke="${river}" stroke-width="3" opacity=".7"/>
      <path d="M470 352 L452 346" stroke="${river}" stroke-width="3" opacity=".8"/>
    </g>
    <path d="${haor}" fill="${dark ? '#2e6b6e' : '#9fcbc9'}" opacity="${over ? 0.25 : transparent ? 0.55 : 0.85}" stroke="${river}" stroke-width="2"/>
    <g clip-path="url(#${p}hc)" stroke="${dark ? '#8fbf9a' : '#4f7d58'}" stroke-width="1.1" opacity=".55">${reeds}</g>
    <g font-family="${MONO}" font-size="13" fill="${sub}">
      <circle cx="393" cy="214" r="6" fill="${ink}"/><text x="393" y="240" text-anchor="middle" fill="${ink}">Sylhet</text>
      <text x="200" y="134" transform="rotate(-20 200 134)">Surma</text><text x="650" y="262" transform="rotate(-12 650 262)">Kushiyara River</text><text x="600" y="508" transform="rotate(48 600 508)">Juri</text>
    </g>
    <g class="site" data-site="surma"><rect x="452" y="118" width="150" height="46" rx="23" fill="${dark ? '#0f1c22' : '#fff'}" stroke="#e9d9a6" stroke-width="1.6"/><g fill="#e9d9a6"><circle cx="476" cy="141" r="6"/><circle cx="494" cy="141" r="6"/><circle cx="512" cy="141" r="6"/></g><text x="528" y="146" font-family="${MONO}" font-size="14" fill="${ink}">n = 3</text><path d="M500 164 L492 204" stroke="#e9d9a6" stroke-width="1.4"/><text x="527" y="104" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="20" fill="${ink}">Surma River</text></g>
    <g class="site" data-site="hakaluki"><rect x="610" y="390" width="200" height="46" rx="23" fill="${dark ? '#0f1c22' : '#fff'}" stroke="#e9d9a6" stroke-width="1.6"/><g fill="#e9d9a6"><circle cx="634" cy="413" r="6"/><circle cx="652" cy="413" r="6"/><circle cx="670" cy="413" r="6"/></g><text x="686" y="418" font-family="${MONO}" font-size="14" fill="${ink}">n = 3</text><path d="M610 410 L580 400" stroke="#e9d9a6" stroke-width="1.4"/><text x="710" y="458" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="20" fill="${ink}">Hakaluki Haor</text></g>
    <g font-family="${MONO}" font-size="12" fill="${sub}"><path d="M60 500 h62" stroke="${sub}" stroke-width="2"/><text x="60" y="490">10 km (approx.)</text><path d="M850 40 l8 22 l-8 -6 l-8 6 z" fill="${sub}"/><text x="850" y="80" text-anchor="middle">N</text>
      <text x="880" y="540" text-anchor="end" letter-spacing="1.2">SCHEMATIC · POSITIONS APPROXIMATE · NO ROUTES IMPLIED</text></g>`;
  return svg({ vb: '0 0 900 560', cls: 'map', title: 'Schematic map of the Surma River and Hakaluki Haor', desc: 'Schematic of the Surma and Kushiyara rivers around Sylhet, with Hakaluki Haor to the south-east draining toward the Kushiyara. Badges mark the two sampled sites, each with three specimens. Positions approximate; no movement routes implied.', body });
}

/* ------------------------------------------------------------------ */
/* Pabda screening bench                                               */
/* ------------------------------------------------------------------ */
function tube(x, y, liquid, label, sub) {
  return `<g transform="translate(${x} ${y})"><rect x="-20" y="-14" width="40" height="18" rx="3" fill="#b9c4c7" stroke="#8a9ba0"/>
    <path d="M-17 4 V150 A17 17 0 0 0 17 150 V4" fill="#f3f7f8" fill-opacity=".55" stroke="#8a9ba0" stroke-width="2"/>
    <path d="M-15 70 V150 A15 15 0 0 0 15 150 V70 Z" fill="${liquid}" opacity=".9"/><path d="M-15 70 V150 A15 15 0 0 0 15 150 V70 Z" fill="#fff" opacity=".2"/><path d="M-10 12 V140" stroke="#fff" stroke-width="3" opacity=".6"/>
    <text y="196" text-anchor="middle" font-family="${MONO}" font-size="13" fill="#2c3a40">${esc(label)}</text><text y="214" text-anchor="middle" font-family="${MONO}" font-size="11.5" fill="#6a7b82">${esc(sub)}</text></g>`;
}
function miniPlate(x, y, n, seed, label) {
  const R = rng(seed);
  let c = '';
  for (let i = 0; i < n; i++) { const a = R() * 6.283, d = Math.sqrt(R()) * 30; c += `<circle cx="${f1(x + d * Math.cos(a))}" cy="${f1(y + d * Math.sin(a))}" r="${f1(2.4 + R() * 2.6)}" fill="#f6edd4" stroke="#c9b48a" stroke-width=".8"/>`; }
  return `<circle cx="${x}" cy="${y}" r="40" fill="#e9dfc4" stroke="#a8b9be" stroke-width="2"/>${c}<text x="${x}" y="${y + 60}" text-anchor="middle" font-family="${MONO}" font-size="11.5" fill="#6a7b82">${esc(label)}</text>`;
}
export function stressBench({ p = uid('sb'), active = null } = {}) {
  const gate = (x, w, title, sub, key, note, liquid, seeds) => `<g class="gate" data-gate="${key}"><rect x="${x}" y="40" width="${w}" height="380" rx="18" fill="#ffffff" fill-opacity=".6" stroke="${active === key ? '#6f7f22' : '#58686e'}" stroke-width="${active === key ? 3.5 : 2}"/>
      <text x="${x + w / 2}" y="72" text-anchor="middle" font-family="${MONO}" font-size="14" font-weight="500" fill="#14202a">${esc(title)}</text><text x="${x + w / 2}" y="92" text-anchor="middle" font-family="${MONO}" font-size="11.5" fill="#6a7b82">${esc(sub)}</text>
      ${tube(x + 52, 136, liquid, 'challenge', 'time per protocol')}
      ${miniPlate(x + 160, 220, seeds[0], seeds[2], 'CFU before')}${miniPlate(x + 250, 220, seeds[1], seeds[3], 'CFU after')}
      <text x="${x + w / 2}" y="396" text-anchor="middle" font-family="${MONO}" font-size="12.5" fill="#6f7f22">${esc(note)}</text></g>`;
  const arrow = (x) => `<path d="M${x} 230 h22 m-8 -6 l8 6 l-8 6" fill="none" stroke="#8a9ba0" stroke-width="2"/>`;
  const later = [['Species ID', '16S rRNA sequencing'], ['Safety', 'haemolysis · AST'], ['Antagonism', 'vs fish pathogens'], ['In vivo', 'feeding trial']];
  const body = `<defs><linearGradient id="${p}bench" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8eef0"/><stop offset="1" stop-color="#cfd9dc"/></linearGradient></defs>
    <rect width="1200" height="500" fill="#f4f7f7"/><rect y="436" width="1200" height="64" fill="url(#${p}bench)"/><path d="M0 436 H1200" stroke="#b5c3c7" stroke-width="2"/>
    ${tube(58, 136, '#e9dcb6', 'gut isolate', 'n per record')}${arrow(92)}
    ${gate(122, 310, 'Gate 1 · simulated gastric', 'low pH · value per protocol', 'gastric', 'log reduction: awaiting raw counts', '#efe4c2', [24, 9, 2, 3])}${arrow(440)}
    ${gate(470, 310, 'Gate 2 · bile salts', 'concentration per protocol', 'bile', 'survival: awaiting raw counts', '#c9c46a', [22, 14, 5, 6])}${arrow(788)}
    <g class="gate" data-gate="later"><rect x="818" y="40" width="364" height="380" rx="18" fill="none" stroke="#9aa8ad" stroke-width="2" stroke-dasharray="8 7"/>
      <text x="1000" y="72" text-anchor="middle" font-family="${MONO}" font-size="14" font-weight="500" fill="#14202a">Gates not yet reached</text>
      ${later.map(([t, sub], i) => `<rect x="842" y="${100 + i * 76}" width="316" height="60" rx="30" fill="none" stroke="#9aa8ad" stroke-width="1.8" stroke-dasharray="6 6"/><text x="870" y="${126 + i * 76}" font-family="${MONO}" font-size="14" fill="#2c3a40">${esc(t)}</text><text x="870" y="${145 + i * 76}" font-family="${MONO}" font-size="11.5" fill="#6a7b82">${esc(sub)} · not yet tested</text>`).join('')}</g>
    <text x="1190" y="482" text-anchor="end" font-family="${MONO}" font-size="12" letter-spacing="1.3" fill="#6a7b82">ILLUSTRATIVE METHOD · NO RESULTS SHOWN</text>`;
  return svg({ vb: '0 0 1200 500', cls: 'bench', title: 'Screening bench for gut-derived isolates', desc: 'A lab bench reads left to right: a gut isolate tube, a simulated gastric challenge gate and a bile-salt gate, each with before-and-after count plates marked as awaiting data, then four dashed gates not yet reached: species identification, safety, antagonism and an in vivo trial.', body });
}

/* ------------------------------------------------------------------ */
/* Research Evolution                                                  */
/* ------------------------------------------------------------------ */
export const EVO = {
  t0: 2023, t1: 2027, today: 2026.79,
  lanes: [
    { id: 'comp', name: 'Computational modelling', scale: 'molecule' },
    { id: 'gen', name: 'Molecular genetics', scale: 'gene · population' },
    { id: 'micro', name: 'Culture-based microbiology', scale: 'microbe' },
    { id: 'eco', name: 'Ecology & people', scale: 'ecosystem · community' },
  ],
  nodes: [
    { id: 'hilsa-field', lane: 'gen', a: 2023.37, b: 2023.83, lx: 2023.6, ly: 36, label: 'Hilsa specimens collected', when: 'May–Oct 2023', reg: 'pub', note: 'Dates from the Oceans 2026 methods; his part in sampling is not yet documented.' },
    { id: 'plos', lane: 'comp', a: 2024.5, b: 2025.07, lx: 2024.78, ly: -40, label: 'Rice-blast effector modelling', when: 'preprint Jul 2024 · PLOS ONE Jan 2025', reg: 'pub', note: '13th of 17 authors. In silico only.' },
    { id: 'ejabf', lane: 'gen', a: 2025.05, ly: -36, label: 'EJABF hilsa genetics', when: 'Jan 2025', reg: 'pub', note: 'cytb; FST 0.000–0.017.' },
    { id: 'limno', lane: 'eco', a: 2025.34, ly: -40, label: 'Limnological Review wetlands', when: 'May 2025', reg: 'pub', note: '3 wetlands, 165 species.' },
    { id: 'survey', lane: 'eco', a: 2025.17, b: 2025.7, lx: 2025.44, ly: 40, label: 'Community field survey', when: 'Mar–Sep 2025', reg: 'rec', note: 'Project name withheld until PRCC permission.' },
    { id: 'pabda', lane: 'micro', a: 2025.5, b: 2026.79, lx: 2025.55, ly: -40, anchor: 'start', label: 'Pabda isolates', when: 'FY 2025–26 · ongoing', reg: 'rec', ongoing: true, note: 'Grant code SAURES-UGC-2025-26-Fish-067, per researcher.' },
    { id: 'oceans', lane: 'gen', lane2: 'eco', a: 2026.34, ly: -36, label: 'Oceans: hilsa + ecosystem services', when: 'May 2026', reg: 'pub', note: 'One paper read through two lanes.' },
    { id: 'thesis', lane: 'micro', a: 2026.66, lead: 2025.9, ly: -40, anchor: 'end', dx: 4, label: 'Salmonella & AMR thesis', when: 'defended 31 Aug 2026', reg: 'rec', note: 'Start date awaiting; invA status disputed.' },
    { id: 'microbiome', lane: 'micro', a: 2026.95, ly: 70, anchor: 'end', dx: 16, label: 'Gut microbiome question', when: 'proposed', reg: 'prop', note: 'Not conducted.' },
  ],
  transfers: [
    { id: 'T1', from: ['gen', 2023.9], to: ['micro', 2025.95], label: 'PCR experience → invA confirmation', reg: 'claim' },
    { id: 'T2', from: ['eco', 2025.62], to: ['micro', 2026.05], label: 'field sampling design → linked market sampling', reg: 'claim' },
  ],
};
export function braid({ p = uid('br'), dark = false, w = 1200 } = {}) {
  const X = (t) => 150 + ((t - EVO.t0) / (EVO.t1 - EVO.t0)) * (w - 210);
  const laneY = { comp: 120, gen: 220, micro: 340, eco: 450 };
  const ink = dark ? '#e9eef0' : '#14202a', sub = dark ? '#93a7ad' : '#5d6d74', water = dark ? '#3f7ea6' : '#4f8db3';
  const width = (lane, t) => {
    let wv = 5;
    EVO.nodes.filter((n) => n.lane === lane || n.lane2 === lane).forEach((n) => {
      const a = n.lead ?? n.a, b = n.b ?? n.a, c = (a + b) / 2, half = (b - a) / 2 + 0.18;
      const d = Math.max(0, Math.abs(t - c) - half + 0.18);
      wv += 18 * Math.exp(-(d * d) / 0.02);
    });
    return wv;
  };
  const yOf = (lane, t) => laneY[lane] + 7 * Math.sin(t * 4.2 + laneY[lane]);
  const channel = (lane) => {
    const top = [], bot = [];
    for (let t = EVO.t0; t <= EVO.t1 + 0.001; t += 0.02) { const y = yOf(lane, t), hw = width(lane, t) / 2; top.push(`${f1(X(t))},${f1(y - hw)}`); bot.unshift(`${f1(X(t))},${f1(y + hw)}`); }
    return `<polygon points="${top.join(' ')} ${bot.join(' ')}" fill="url(#${p}wat)"/><polyline points="${top.join(' ')}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>`;
  };
  const ribbon = (tr) => {
    const [la, ta] = tr.from, [lb, tb] = tr.to, x0 = X(ta), y0 = yOf(la, ta), x1 = X(tb), y1 = yOf(lb, tb), mx = (x0 + x1) / 2;
    return `<path d="M${f1(x0)} ${f1(y0)} C${f1(mx)} ${f1(y0)} ${f1(mx)} ${f1(y1)} ${f1(x1)} ${f1(y1)}" fill="none" stroke="${water}" stroke-width="5" stroke-dasharray="2 7" stroke-linecap="round" opacity=".9"/>
      <g class="tag"><rect x="${f1(mx - 15)}" y="${f1((y0 + y1) / 2 - 11)}" width="30" height="22" rx="11" fill="${dark ? '#14202a' : '#fff'}" stroke="${water}" stroke-width="1.6"/><text x="${f1(mx)}" y="${f1((y0 + y1) / 2 + 4)}" text-anchor="middle" font-family="${MONO}" font-size="11" font-weight="500" fill="${ink}">${tr.id}</text></g>`;
  };
  const glyph = (n, x, y) => {
    const s = n.reg === 'pub' ? `<circle cx="${x}" cy="${y}" r="9" fill="${ink}"/>` : n.reg === 'rec' ? `<circle cx="${x}" cy="${y}" r="9" fill="${dark ? '#14202a' : '#fff'}" stroke="${ink}" stroke-width="2.2"/><path d="M${x} ${y - 9} A9 9 0 0 1 ${x} ${y + 9} Z" fill="${ink}"/>` : `<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="${ink}" stroke-width="2" stroke-dasharray="3 3"/>`;
    return s;
  };
  const node = (n) => {
    const x = X(n.a), y = yOf(n.lane, n.a), up = n.lane === 'comp' || n.lane === 'micro';
    const span = n.b ? `<line x1="${f1(X(n.a))}" y1="${f1(y)}" x2="${f1(X(n.b))}" y2="${f1(yOf(n.lane, n.b))}" stroke="${ink}" stroke-width="3" stroke-linecap="round" opacity=".55"/>${n.ongoing ? `<path d="M${f1(X(n.b))} ${f1(yOf(n.lane, n.b))} l-9 -6 v12 z" fill="${ink}"/>` : ''}` : '';
    const lead = n.lead ? `<line x1="${f1(X(n.lead))}" y1="${f1(yOf(n.lane, n.lead))}" x2="${f1(x)}" y2="${f1(y)}" stroke="${ink}" stroke-width="2" stroke-dasharray="4 5" opacity=".6"/>` : '';
    const bridge = n.lane2 ? `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x)}" y2="${f1(yOf(n.lane2, n.a))}" stroke="${ink}" stroke-width="1.4" stroke-dasharray="3 4" opacity=".55"/>${glyph(n, f1(x), f1(yOf(n.lane2, n.a)))}` : '';
    const lxv = n.lx ? X(n.lx) : x, lyv = y + (n.ly ?? (up ? -40 : 36)), anc = n.anchor || 'middle', tx = lxv + (n.dx || 0) * (anc === 'end' ? 1 : 0);
    return `<g class="evo-node" data-node="${n.id}">${lead}${span}${bridge}${glyph(n, f1(x), f1(y))}<text x="${f1(tx)}" y="${f1(lyv)}" text-anchor="${anc}" font-family="'Instrument Sans', system-ui, sans-serif" font-size="13.5" font-weight="600" fill="${ink}" paint-order="stroke" stroke="${dark ? '#1f2421' : '#ece0c6'}" stroke-width="5" stroke-linejoin="round">${esc(n.label)}</text><text x="${f1(tx)}" y="${f1(lyv + 16)}" text-anchor="${anc}" font-family="${MONO}" font-size="10.5" fill="${sub}" paint-order="stroke" stroke="${dark ? '#1f2421' : '#ece0c6'}" stroke-width="4" stroke-linejoin="round">${esc(n.when)}</text></g>`;
  };
  let years = '';
  for (let y = EVO.t0; y <= EVO.t1; y++) years += `<line x1="${f1(X(y))}" y1="56" x2="${f1(X(y))}" y2="510" stroke="${sub}" stroke-opacity=".25"/><text x="${f1(X(y))}" y="46" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${sub}">${y}</text>`;
  const lanes = EVO.lanes.map((l) => `<text x="16" y="${laneY[l.id] - 4}" font-family="'Instrument Sans', system-ui, sans-serif" font-size="13" font-weight="600" fill="${ink}">${esc(l.name)}</text><text x="16" y="${laneY[l.id] + 12}" font-family="${MONO}" font-size="10.5" fill="${sub}">${esc(l.scale)}</text>`).join('');
  const R = rng(4);
  const silt = Array.from({ length: 220 }, () => `<circle cx="${f1(150 + R() * (w - 160))}" cy="${f1(60 + R() * 450)}" r="${f1(0.6 + R() * 1.4)}" fill="${dark ? '#5d5236' : '#b4874a'}" opacity="${f1(0.15 + R() * 0.3)}"/>`).join('');
  const body = `<defs><linearGradient id="${p}wat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb4d0"/><stop offset=".5" stop-color="${water}"/><stop offset="1" stop-color="#2d6589"/></linearGradient>
      <linearGradient id="${p}sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dark ? '#1f2421' : '#efe5cf'}"/><stop offset="1" stop-color="${dark ? '#191d1b' : '#e3d4b2'}"/></linearGradient></defs>
    <rect width="${w}" height="530" fill="url(#${p}sand)"/>${silt}${years}
    ${EVO.lanes.map((l) => channel(l.id)).join('')}
    ${EVO.transfers.map(ribbon).join('')}
    <line x1="${f1(X(EVO.today))}" y1="56" x2="${f1(X(EVO.today))}" y2="510" stroke="#c0392b" stroke-width="1.6"/><text x="${f1(X(EVO.today) + 6)}" y="70" font-family="${MONO}" font-size="11" fill="#c0392b">18 Oct 2026</text>
    ${lanes}${EVO.nodes.map(node).join('')}`;
  return svg({ vb: `0 0 ${w} 530`, cls: 'braid', title: 'Research Evolution as a braided river, 2023 to 2026', desc: 'Four method channels run left to right across 2023 to 2027: computational modelling, molecular genetics, culture-based microbiology, and ecology and people. Dated projects sit on the channels. Dotted crossings mark claimed transfers of method, with evidence pending. A red line marks today.', body });
}

export function scaleField({ p = uid('sf'), w = 1200 } = {}) {
  const rows = ['People & livelihoods', 'Ecosystem', 'Population', 'Organism', 'Microbe', 'Gene', 'Molecule'];
  const X = (t) => 200 + ((t - 2023) / 4) * (w - 260), Y = (i) => 112 + i * 58;
  const items = [
    { label: 'Rice-blast effectors', t: 2024.8, rows: [6], reg: 'pub' },
    { label: 'Hilsa cytb genetics', t: 2025.05, rows: [5, 2], reg: 'pub' },
    { label: 'Wetland biodiversity', t: 2025.34, rows: [3, 1], reg: 'pub' },
    { label: 'Field survey', t: 2025.5, rows: [0], reg: 'rec' },
    { label: 'Pabda isolates', t: 2026.0, rows: [4, 3], reg: 'rec' },
    { label: 'Oceans: genetics + services', t: 2026.34, rows: [5, 2, 1, 0], reg: 'pub' },
    { label: 'Salmonella thesis', t: 2026.66, rows: [4, 3, 0], reg: 'rec' },
  ];
  let grid = '';
  rows.forEach((r, i) => { grid += `<line x1="200" y1="${Y(i)}" x2="${w - 40}" y2="${Y(i)}" stroke="#9aa8ad" stroke-opacity=".35"/><text x="184" y="${Y(i) + 4}" text-anchor="end" font-family="${MONO}" font-size="12" fill="#5d6d74">${esc(r)}</text>`; });
  for (let y = 2023; y <= 2027; y++) grid += `<text x="${f1(X(y))}" y="${Y(6) + 36}" text-anchor="middle" font-family="${MONO}" font-size="12" fill="#5d6d74">${y}</text><line x1="${f1(X(y))}" y1="80" x2="${f1(X(y))}" y2="${Y(6) + 16}" stroke="#9aa8ad" stroke-opacity=".25"/>`;
  const marks = items.map((it) => {
    const x = X(it.t), ys = it.rows.map(Y), top = Math.min(...ys), bot = Math.max(...ys);
    const dot = (y) => it.reg === 'pub' ? `<circle cx="${f1(x)}" cy="${y}" r="8" fill="#14202a"/>` : `<circle cx="${f1(x)}" cy="${y}" r="8" fill="#fff" stroke="#14202a" stroke-width="2.2"/><path d="M${f1(x)} ${y - 8} A8 8 0 0 1 ${f1(x)} ${y + 8} Z" fill="#14202a"/>`;
    return `<g><line x1="${f1(x)}" y1="${top}" x2="${f1(x)}" y2="${bot}" stroke="#14202a" stroke-width="1.6" stroke-dasharray="${it.rows.length > 1 ? '0' : '0'}" opacity=".5"/>${ys.map(dot).join('')}<text x="${f1(x + 12)}" y="${top - 12}" font-family="'Instrument Sans', system-ui, sans-serif" font-size="13" font-weight="600" fill="#14202a" transform="rotate(-24 ${f1(x + 12)} ${top - 12})">${esc(it.label)}</text></g>`;
  }).join('');
  const body = `<rect width="${w}" height="540" fill="#f5f7f6"/>${grid}${marks}<line x1="${f1(X(2026.79))}" y1="80" x2="${f1(X(2026.79))}" y2="${Y(6) + 16}" stroke="#c0392b" stroke-width="1.6"/><text x="${f1(X(2026.79) + 6)}" y="${Y(6) + 12}" font-family="${MONO}" font-size="11" fill="#c0392b">today</text>`;
  return svg({ vb: `0 0 ${w} 540`, cls: 'scalefield', title: 'Projects placed by biological scale and time', desc: 'A grid with time from 2023 to 2027 across and biological scale from molecule to people down the side. Each project is a column of dots at the scales it studied. Filled dots are published work; half-filled dots are researcher-supplied.', body });
}
