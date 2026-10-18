// Concept boards, storyboards and the Atlas overview page.
import { hilsa, pabda, xldPlate, mhPlate, culturePlate, salmonellaCell, invASchematic, gelFrame, mtRing, cytbThread, esc, uid, rng } from '../illus.mjs';
import { marketScene, haorMap, stressBench, braid, scaleField, EVO } from '../scenes.mjs';
import { page, nav, subnav, reg } from './common.mjs';
import fs from 'node:fs';

const RESULTS = (() => { try { return JSON.parse(fs.readFileSync(new URL('../../tests/results.json', import.meta.url), 'utf8')); } catch { return null; } })();

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const SERIF = "'Newsreader', Georgia, serif";
const f1 = (n) => Math.round(n * 10) / 10;
const withVB = (s, vb) => s.replace(/viewBox="[^"]+"/, `viewBox="${vb}"`);
const place = (s, x, y, w, h) => s.replace('<svg class="ill', `<svg x="${x}" y="${y}" width="${w}" height="${h}" class="nested`);
const styled = (s, css) => s.replace('<svg class="ill', `<svg style="${css}" class="ill`);
const wrapSvg = (vb, title, desc, body) => `<svg class="ill" viewBox="${vb}" role="img" aria-label="${esc(title)}. ${esc(desc)}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

/* ---------- composite artworks ---------- */

function lightbox({ lifted = 0, label = '' } = {}) {
  const R = rng(9), rows = ['Fish skin', 'Cut flesh', 'Basket surface', 'Water*', 'Hands*', 'Tool*', 'Board*'];
  let plates = '', tray = '';
  const plate = (x, y, r, op = 1) => `<g opacity="${op}"><circle cx="${f1(x + 2)}" cy="${f1(y + 3)}" r="${r + 3}" fill="#9fb3b9" opacity=".35"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${r + 3}" fill="#e4eef0" stroke="#a9bcc1" stroke-width="1"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="url(#lbag)"/><path d="M${f1(x - r * 0.6)} ${f1(y - r * 0.5)} A${r} ${r} 0 0 1 ${f1(x + r * 0.3)} ${f1(y - r * 0.85)}" stroke="#fff" stroke-width="1.6" fill="none" opacity=".6"/></g>`;
  for (let row = 0; row < 7; row++) for (let c = 0; c < 22; c++) plates += plate(230 + c * 40 + Math.floor(c / 2) * 6, 130 + row * 62, 14, lifted ? 0.28 : 1);
  if (lifted) {
    for (let i = 0; i < lifted; i++) { const col = i % 8, rw = Math.floor(i / 8); tray += plate(1290 + col * 30 + (R() - 0.5) * 6, 140 + rw * 30 + (R() - 0.5) * 6, 11); }
  }
  const labels = rows.map((r, i) => `<text x="210" y="${135 + i * 62}" text-anchor="end" font-family="${MONO}" font-size="15" fill="#3d4c55">${esc(r)}</text>`).join('')
    + Array.from({ length: 11 }, (_, m) => `<text x="${250 + m * 86}" y="92" text-anchor="middle" font-family="${MONO}" font-size="13" fill="#6a7b82">M${String(m + 1).padStart(2, '0')}</text>`).join('');
  const body = `<defs><radialGradient id="lbag" cx=".45" cy=".42" r=".62"><stop offset="0" stop-color="#da5b6b"/><stop offset="1" stop-color="#a32a3a"/></radialGradient>
      <linearGradient id="lbbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6eff1"/></linearGradient></defs>
    <rect width="1560" height="620" fill="url(#lbbg)"/>
    <rect x="30" y="50" width="${lifted ? 1190 : 1500}" height="520" rx="14" fill="none" stroke="#c4d3d7" stroke-width="2"/>
    ${labels}${plates}
    ${lifted ? `<rect x="1250" y="100" width="280" height="${Math.ceil(lifted / 8) * 30 + 70}" rx="14" fill="#fff" stroke="#14202a" stroke-width="2"/>${tray}<text x="1390" y="84" text-anchor="middle" font-family="${MONO}" font-size="16" fill="#14202a">${esc(label)}</text><text x="1390" y="${Math.ceil(lifted / 8) * 30 + 196}" text-anchor="middle" font-family="${MONO}" font-size="12.5" fill="#6a7b82">unordered tray · count only</text>` : ''}
    <text x="1530" y="604" text-anchor="end" font-family="${MONO}" font-size="12" letter-spacing="1.3" fill="#6a7b82">154 PLATES = DESIGN · NO PER-SAMPLE RESULT SHOWN</text>`;
  return wrapSvg('0 0 1560 620', 'Lightbox of 154 sample plates', lifted ? `${lifted} plates lifted into an unordered tray` : 'All 154 plates laid out by matrix and market', body);
}

function hilsaThread() {
  const body = `<rect width="1200" height="760" fill="#0c1618"/>
    ${place(hilsa({ sample: true, label: false }), 10, 30, 720, 373)}
    ${place(mtRing({}), 790, 20, 380, 380)}
    ${place(cytbThread({}), 90, 470, 1020, 277)}
    <g fill="none" stroke="#f3d39a" stroke-width="1.3" stroke-dasharray="4 6" opacity=".6"><path d="M436 196 C560 120 700 90 868 110"/><path d="M868 140 C700 300 300 420 128 560"/><path d="M880 140 C980 300 1100 420 1078 560"/></g>
    <g font-family="${SERIF}" font-style="italic" font-size="26" fill="#dfe7e8"><text x="40" y="436">one fish</text><text x="1150" y="436" text-anchor="end">one gene</text><text x="600" y="458" text-anchor="middle">1,114 aligned positions</text></g>
    <g transform="translate(40 40)"><rect width="168" height="40" rx="20" fill="#0f1c22" stroke="#e9d9a6" stroke-width="1.6"/><text x="84" y="26" text-anchor="middle" font-family="${MONO}" font-size="15" fill="#e9d9a6">n = 3 per site</text></g>`;
  return wrapSvg('0 0 1200 760', 'From fish to alignment', 'A silver hilsa, a schematic mitochondrial genome with cytochrome b highlighted, and a 1,114-position alignment ruler, joined by dashed zoom lines. A badge reads n = 3 per site.', body);
}

function miniLedger(sel = 'skin', dark = true) {
  const ids = ['skin', 'flesh', 'basket', 'water', 'hands', 'tool', 'board'], names = ['Skin', 'Flesh', 'Basket', 'Water*', 'Hands*', 'Tool*', 'Board*'], counts = ['9/22', '3/22', '8/22', '—', '—', '—', '—'];
  let cells = '';
  ids.forEach((id, r) => { for (let c = 0; c < 22; c++) cells += `<rect x="${150 + c * 40 + Math.floor(c / 2) * 8}" y="${80 + r * 58}" width="30" height="30" rx="4" fill="${id === sel ? '#f2ab46' : 'none'}" stroke="${id === sel ? '#f2ab46' : 'rgba(255,226,166,.35)'}" stroke-width="2" opacity="${sel && id !== sel ? 0.45 : 1}"/>`; });
  const lab = names.map((n, r) => `<text x="130" y="${101 + r * 58}" text-anchor="end" font-family="${MONO}" font-size="17" fill="#dfe7e8">${n}</text><text x="1100" y="${101 + r * 58}" font-family="${MONO}" font-size="16" fill="#9fb2b7">${counts[r]}</text>`).join('');
  return wrapSvg('0 0 1180 520', 'Ledger of 154 samples with one matrix selected', 'Seven rows of 22 squares; the fish-skin row is highlighted. Counts at the right: 9/22, 3/22, 8/22 and four unreported rows.', `<rect width="1180" height="520" fill="${dark ? '#0b1517' : '#eef2f1'}"/>${cells}${lab}<text x="150" y="52" font-family="${MONO}" font-size="15" fill="#9fb2b7">M01 … M11 · 2 events each</text>`);
}

function fstScale() {
  const X = (v) => 120 + (v / 0.3) * 900;
  const bands = [[0, 0.05, 'little'], [0.05, 0.15, 'moderate'], [0.15, 0.25, 'great'], [0.25, 0.3, 'very great']];
  const fish = (x, y) => `<path d="M${x} ${y} c14 -12 40 -12 56 0 l12 -9 v18 l-12 -9 c-16 12 -42 12 -56 0z" fill="#cfd8dc"/>`;
  const body = `<rect width="1200" height="560" fill="#0c1618"/>
    <g font-family="${SERIF}" font-style="italic" font-size="24" fill="#dfe7e8"><text x="220" y="80" text-anchor="middle">Hakaluki Haor</text><text x="760" y="80" text-anchor="middle">Surma River</text></g>
    ${[0, 1, 2].map((i) => fish(150 + i * 50, 130 + i * 34) + fish(690 + i * 50, 130 + i * 34)).join('')}
    <g font-family="${MONO}" font-size="15" fill="#e9d9a6"><text x="220" y="250" text-anchor="middle">n = 3</text><text x="760" y="250" text-anchor="middle">n = 3</text></g>
    ${bands.map(([a, b, l], i) => `<rect x="${X(a)}" y="330" width="${X(b) - X(a)}" height="34" fill="${['#2c4a50', '#3c5a5e', '#53706f', '#6b8784'][i]}"/><text x="${(X(a) + X(b)) / 2}" y="388" text-anchor="middle" font-family="${MONO}" font-size="13" fill="#9fb2b7">${l}</text>`).join('')}
    <rect x="${X(0)}" y="318" width="${f1(X(0.017) - X(0))}" height="58" fill="#e9d9a6"/>
    <text x="${X(0.017) + 10}" y="310" font-family="${MONO}" font-size="15" fill="#e9d9a6">FST 0.000–0.017 (EJABF 2025)</text>
    ${[0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3].map((v) => `<text x="${X(v)}" y="420" text-anchor="middle" font-family="${MONO}" font-size="12" fill="#7f969d">${v.toFixed(2)}</text>`).join('')}
    <text x="120" y="470" font-family="${MONO}" font-size="13" fill="#7f969d">Bands: Wright (1978) rule of thumb · reference science</text>
    <text x="120" y="500" font-family="${MONO}" font-size="13" fill="#c8a3a8">Three fish per site cannot rule out structure that a larger sample would show.</text>`;
  return wrapSvg('0 0 1200 560', 'Two sites, three fish each, on an FST scale', 'Three fish glyphs at Hakaluki Haor and three at Surma River. Below, an FST axis from 0 to 0.3 with Wright’s bands; the published range 0.000 to 0.017 sits at the very low end.', body);
}

function servicesLedger() {
  const col = (x, title, regTxt, lines, dashed) => `<rect x="${x}" y="70" width="340" height="410" rx="14" fill="#f8faf9" stroke="#14202a" stroke-width="1.6" ${dashed ? 'stroke-dasharray="7 6"' : ''}/>
    <text x="${x + 22}" y="112" font-family="${SERIF}" font-size="26" fill="#14202a">${esc(title)}</text><text x="${x + 22}" y="138" font-family="${MONO}" font-size="12" fill="#6a7b82">${esc(regTxt)}</text>
    ${lines.map((l, i) => `<text x="${x + 22}" y="${186 + i * 30}" font-family="'Instrument Sans', sans-serif" font-size="16" fill="#33424c">${esc(l)}</text>`).join('')}`;
  const body = `<rect width="1200" height="540" fill="#e9eeee"/>
    ${col(40, 'Findings', 'PUBLISHED · Oceans 2026', ['60 species recorded', 'household surveys of livelihoods', 'cytb: 1,099 of 1,114 positions', 'invariant across both sites'], false)}
    ${col(430, 'Interpretation', 'AUTHORS · Oceans 2026', ['“a single, well-connected stock”', 'rests on n = 3 per site', 'shown with its sample size'], false)}
    ${col(820, 'Recommendations', 'AUTHORS · to be quoted', ['SDG-framed wetland policy (title)', 'exact wording to be quoted', 'from the paper’s conclusions', 'not paraphrased by the Atlas'], true)}`;
  return wrapSvg('0 0 1200 540', 'Three registers for the Oceans paper', 'Three columns: published findings, the authors’ interpretation with its sample size, and the authors’ recommendations, which are to be quoted directly.', body);
}

/* ---------- WebGL water for the Hilsa B board ---------- */
const waterScript = `<script>
(() => {
  const c = document.getElementById('water');
  const gl = c && c.getContext('webgl');
  if (!gl) { if (c) c.remove(); return; }
  const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fs = 'precision mediump float;uniform vec2 r;uniform float t;' +
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}' +
    'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}' +
    'void main(){vec2 uv=gl_FragCoord.xy/r.y;vec2 q=vec2(fbm(uv*2.+t*.03),fbm(uv*2.+vec2(5.2,1.3)-t*.02));float v=fbm(uv*3.+q*1.6);' +
    'vec3 deep=vec3(.07,.15,.15),silt=vec3(.34,.3,.2),pale=vec3(.52,.63,.6);vec3 col=mix(deep,silt,smoothstep(.3,.78,v));' +
    'col=mix(col,pale,smoothstep(.62,.92,v)*.5);col+=pow(smoothstep(.55,.95,fbm(uv*9.+q*3.+t*.05)),3.)*.3;gl_FragColor=vec4(col,1.);}';
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { c.remove(); return; }
  gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const ur = gl.getUniformLocation(pr, 'r'), ut = gl.getUniformLocation(pr, 't');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const draw = (ms) => { const w = c.clientWidth * devicePixelRatio, h = c.clientHeight * devicePixelRatio; if (c.width !== w || c.height !== h) { c.width = w; c.height = h; gl.viewport(0, 0, w, h); } gl.uniform2f(ur, w, h); gl.uniform1f(ut, ms / 1000); gl.drawArrays(gl.TRIANGLES, 0, 3); if (!still) requestAnimationFrame(draw); };
  requestAnimationFrame(draw);
})();
</script>`;

/* ---------- concept boards ---------- */
const sw = (list) => `<div class="sw">${list.map(([n, c]) => `<span style="--c:${c}">${esc(n)}<br>${c}</span>`).join('')}</div>`;
const dots = (n) => `<span class="dots" aria-label="${n} of 5">${Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? 'f' : ''}"></i>`).join('')}</span>`;

function direction(d) {
  return `<article class="print dir" id="${d.id}">
    <header class="dir-head"><p class="dir-code">${esc(d.code)}</p><h2 class="dir-name">${esc(d.name)}</h2><p class="dir-thesis">${esc(d.thesis)}</p><span class="verdict ${d.verdictCls || ''}">${esc(d.verdict)}</span></header>
    <figure style="margin:0"><div class="key ${d.keyLight ? 'light' : ''}" ${d.keyStyle ? `style="${d.keyStyle}"` : ''}>${d.key}</div><figcaption class="key-cap">${d.keyCap}</figcaption></figure>
    <div class="states">${d.states.map((s) => `<div class="state"><figure><div class="art ${s.light ? 'light' : ''}">${s.art}</div><figcaption><b>${esc(s.t)}</b>${esc(s.c)}</figcaption></figure></div>`).join('')}</div>
    <div class="spec">
      <div><h3>Palette</h3>${sw(d.palette)}</div>
      <div><h3>Type</h3><p class="type-a">${esc(d.type[0])}</p><p class="type-b">${esc(d.type[1])}</p><p class="type-c">${esc(d.type[2])}</p><p style="margin-top:8px">${esc(d.type[3])}</p></div>
      <div><h3>Material &amp; light</h3><p>${esc(d.material)}</p></div>
      <div><h3>Motion</h3><ul>${d.motion.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div>
      <div><h3>Interaction</h3><ul>${d.interaction.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div>
      <div><h3>Build</h3><p>${esc(d.build)}</p></div>
      <div><h3>Integrity safeguards</h3><ul>${d.integrity.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div>
      <div><h3>Evidence it uses</h3><p>${d.evidence}</p></div>
    </div>
    <div class="pros"><div><h3>Strengths</h3><ul>${d.pros.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div><div><h3>Risks</h3><ul>${d.cons.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div></div>
  </article>`;
}
function comparison(c) {
  return `<section class="print" aria-labelledby="cmp-${c.id}"><p class="dir-code">Critical comparison</p><h2 class="dir-name" id="cmp-${c.id}" style="margin:6px 0 18px">${esc(c.title)}</h2>
    <div class="compare"><table><thead><tr><th scope="col">Criterion</th>${c.cols.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>
    ${c.rows.map(([k, ...cells]) => `<tr><th scope="row">${esc(k)}</th>${cells.map(([n, t]) => `<td>${dots(n)}${esc(t)}</td>`).join('')}</tr>`).join('')}
    </tbody></table></div>
    <div class="decision"><h3>${esc(c.decisionTitle)}</h3><div>${c.decision.map((p) => `<p>${esc(p)}</p>`).join('')}</div></div></section>`;
}
const boardPage = (slug, title, lede, eyebrow, dirs, cmp, extra = '') => page({
  title, desc: lede, depth: 1,
  body: `${nav(1, 'Concepts')}${subnav(1, 'concepts', slug)}<main class="wrap"><header class="page-head"><p class="eyebrow">${eyebrow}</p><h1>${esc(title)}</h1><p class="lede">${esc(lede)}</p></header>${dirs.map(direction).join('')}${comparison(cmp)}<p class="foot">Concept board · Phase 2 · 18 Oct 2026 · <a href="../storyboards/${slug}.html">storyboard</a>${slug === 'salmonella' ? ' · <a href="../prototype/salmonella/index.html">working prototype</a>' : ''}</p></main>${extra}`,
});

const CMP_COLS = ['Direction A', 'Direction B', 'Selected synthesis'];

function salmonellaBoard() {
  const A = {
    id: 'a', code: 'P01 · Direction A', name: 'Tungsten Night', verdict: 'Selected: chapters 01–02', verdictCls: 'sel',
    thesis: 'The investigation opens where the samples were taken: a cutter’s station before dawn, lit by one bare bulb. Every sampled surface is a lit object, and the visitor moves the light.',
    key: `${marketScene({ markers: true, spot: 'skin', dimOp: 0.4 })}<div class="over"><div class="mock" style="right:3%;top:6%"><small>MATRIX 1 OF 7</small><b>Fish skin</b><span class="num">9</span> of 22 events<br><small>researcher record</small></div></div>`,
    keyCap: `${reg('ill')} Key frame: spotlight on matrix 1. Rendered from the same SVG the prototype uses.`,
    states: [
      { t: 'Arrive', c: 'Bulb flickers on once; the seven leaders draw in.', art: styled(marketScene({ leaders: false }), 'filter:brightness(.55) saturate(.8)') },
      { t: 'Select', c: 'Spotlight glides to the bonti blade; its card says “not reported”.', art: withVB(marketScene({ spot: 'tool', markers: true, dimOp: 0.4 }), '480 300 600 360') },
      { t: 'Hand over', c: 'Night gives way to the bench as samples leave for the lab.', art: `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#0b1517,#3b4a4d 50%,#eef2f1)"></div><div style="position:relative;width:46%">${xldPlate({ bench: false })}</div>` },
    ],
    palette: [['Night', '#0b1517'], ['Wet slate', '#17292d'], ['Tungsten', '#f2ab46'], ['Bulb', '#ffe2a6'], ['Steel', '#9fb2b7'], ['XLD rose', '#cf4257']],
    type: ['Seven surfaces', 'one cutting station', '154 SAMPLES · 22 EVENTS', 'Newsreader for scene titles, Instrument Sans for reading, IBM Plex Mono for counts and registers.'],
    material: 'One warm point source at upper left. Wet concrete carries long vertical reflections; the steel bowl and bonti take specular edges; bamboo and wood absorb. A 14% grain keeps it painted rather than photographic.',
    motion: ['Bulb flicker: 1.6 s, stepped, once', 'Spotlight move: 550 ms ease-out', 'Leader emphasis: 300 ms', 'No ambient loops; all off under reduced motion'],
    interaction: ['Select a surface: 7 hotspots plus chips', 'Compare event-level detection bars', 'Selection carries into the ledger'],
    build: 'Inline SVG pre-rendered at build time (works without JavaScript). CSS mask for the spotlight, HTML buttons over the art for focus and screen readers.',
    integrity: ['“Illustrative reconstruction” printed inside the art', 'Caption: positions are not a transmission pathway', 'Four inferred matrix names carry an asterisk'],
    evidence: `${reg('rec')} design counts and three detection rates.`,
    pros: ['Strongest first impression; grounds microbiology in a real place', 'Vernacular objects (bonti, bamboo basket, hanging balance) are specific to Bangladeshi wet markets', 'The spotlight is a precise, accessible selection device'],
    cons: ['Spatial staging can suggest transfer routes; mitigated by caption and no arrows between objects', 'A night scene can feel theatrical for a lab study', 'Needs a clear handover to the bench'],
  };
  const B = {
    id: 'b', code: 'P01 · Direction B', name: 'Lightbox Bench', verdict: 'Selected: chapters 03–05', verdictCls: 'part', keyLight: true,
    thesis: 'Every one of the 154 samples is a plate on a laboratory lightbox. The story is attrition: plates lift into trays as the record narrows them from 154 to 62 to 40.',
    key: lightbox({ lifted: 40, label: '40 isolates' }),
    keyCap: `${reg('ill')} Key frame: 40 plates lifted into an unordered tray. Count only; no sample is identified as positive.`,
    states: [
      { t: 'Lay out', c: '154 plates by matrix and market: the design, not results.', light: true, art: lightbox({}) },
      { t: 'Sieve', c: '62 XLD-suspect candidates lift into a tray.', light: true, art: lightbox({ lifted: 62, label: '62 XLD-suspect' }) },
      { t: 'Read', c: 'Open one plate to read colony types.', light: true, art: xldPlate({ callouts: true }) },
    ],
    palette: [['Lightbox', '#f4f8f8'], ['Glass', '#dfe9ec'], ['Agar red', '#c93c4f'], ['H₂S black', '#160c0e'], ['MH amber', '#cfa159'], ['Ink', '#13202a']],
    type: ['154 → 62 → 40', 'the sieve narrows', 'UNORDERED TRAY · COUNT ONLY', 'Instrument Sans semi-bold for labels, Plex Mono for tray counts, Newsreader only for chapter titles.'],
    material: 'Cool, diffuse light from below. Glass rims, translucent agar, soft contact shadows. No environment at all.',
    motion: ['Plates lift: 500 ms, staggered 8 ms each', 'Counts tick with the lift', 'Tray settles with a short ease-out'],
    interaction: ['Step through the sieve', 'Filter by matrix row or market column', 'Open a plate to read colony types'],
    build: 'SVG plates (Canvas above ~1,000 marks), FLIP transitions, the same evidence-tagged data module as A.',
    integrity: ['Plates lift into an unordered tray, so no sample is shown as positive', 'Each tray carries its register chip', '62 is flagged until its unit (sample or colony) is confirmed'],
    evidence: `${reg('rec')} 154 / 62 / 40 counts.`,
    pros: ['Honest about attrition', 'Reads instantly as laboratory work', 'Scales to per-isolate data later'],
    cons: ['Clinical and repetitive across 154 identical plates', 'Loses the market context that carries the One Health argument', 'A lift metaphor implies identity unless the tray is clearly unordered'],
  };
  const cmp = {
    id: 'p01', title: 'Tungsten Night against Lightbox Bench', cols: CMP_COLS,
    rows: [
      ['Scientific fidelity', [4, 'Real vernacular objects; staging needs its caption'], [4, 'Accurate bench grammar'], [5, 'Each chapter in its native setting']],
      ['Evidence honesty', [4, 'Risk of implied pathways'], [5, 'Count-only trays'], [5, 'Both safeguards kept']],
      ['Visual distinctiveness', [5, 'Nothing like an engineering stepper'], [3, 'Familiar lab aesthetic'], [5, 'Night-to-bench handover is memorable']],
      ['Interaction depth', [4, 'Select and compare'], [4, 'Sieve and filter'], [5, 'Select, filter, read, switch account, simulate']],
      ['Mobile legibility', [3, 'Small hotspots at 360 px'], [4, 'Grid scales well'], [4, 'Hotspots backed by chips']],
      ['Works with current data', [5, 'Needs only counts'], [4, 'Per-plate detail would need sample data'], [5, 'Locks what needs missing data']],
    ],
    decisionTitle: 'Build the synthesis; it is the prototype.',
    decision: ['Tungsten Night carries chapters 01–02, where place and study design matter. Lightbox Bench carries chapters 03–05, where the bench is the honest setting. A gradient band hands one to the other.', 'Rejected from B: lifting individual plates out of their grid position, because it would show which sample was positive. Rejected from A: any line or arrow between objects.'],
  };
  return boardPage('salmonella', 'Salmonella & AMR concept board', 'Two directions for the flagship thesis experience, compared and combined. Every number shown is the researcher’s own record; the invA confirmation is disputed and labelled as such.', `P01 · Concept board ${reg('disp', 'invA disputed')}`, [A, B], cmp);
}

function hilsaBoard() {
  const A = {
    id: 'a', code: 'P02 · Direction A', name: 'Silver Thread', verdict: 'Selected: core', verdictCls: 'sel',
    thesis: 'Scale is the story: one silver fish, one mitochondrial gene, 1,114 aligned positions. The visitor travels inward, and the sample size travels with them.',
    key: hilsaThread(),
    keyCap: `${reg('pub')} cytb, 1,114 positions, 1,099 invariant, n = 3 per site (Oceans 2026). ${reg('ill')} fish, ring and magnifier.`,
    states: [
      { t: 'Specimen', c: 'Tap the fish: the tissue used for DNA is “per protocol” until supplied.', art: hilsa({ sample: true }) },
      { t: 'Inward', c: 'Camera pushes into the mitogenome; cytb lights.', art: mtRing({}) },
      { t: 'Scrub', c: 'Drag along the thread; bases show as N until the FASTA arrives.', art: cytbThread({ win: [880, 920] }) },
    ],
    palette: [['Ink water', '#0c1618'], ['Silver', '#d3dcdf'], ['Haor teal', '#1f6f78'], ['Iridescence', '#7d6fb0'], ['Scale gold', '#d8b85e'], ['Filament', '#e9d9a6']],
    type: ['one fish, one gene', '1,114 aligned positions', 'N N N N · n = 3 PER SITE', 'Newsreader italic for scale captions, Plex Mono for positions, Instrument Sans for reading.'],
    material: 'Specular silver on a dark field. Soft-light bands of violet and gold cross the flank the way hilsa scales shift colour. The alignment is lit like a filament.',
    motion: ['Zoom fish → mitogenome: 900 ms', 'Magnifier follows the scrub with an 80 ms lag', 'Iridescence shifts with pointer only, never on a loop'],
    interaction: ['Scrub the 1,114 positions (pointer or arrow keys)', 'Tap the fish to see what was sampled', 'Toggle “what n = 3 can show”'],
    build: 'SVG for fish, ring and thread. Optional WebGL iridescence on the fish only, as a progressive layer that is off under reduced motion.',
    integrity: ['N for every unloaded base', '15 variable sites shown as an unplaced count', 'n = 3 badge pinned for the whole journey'],
    evidence: `${reg('pub')} Oceans 2026 cytb figures; ${reg('wait')} alignment FASTA and accessions.`,
    pros: ['Makes the molecular method tangible without inventing data', 'Shows the small sample size in the same frame as the result', 'Distinct from the Salmonella bench and the wetland landscapes'],
    cons: ['Thin until the FASTA arrives; the magnifier is all N', 'Hides the landscape that gives the stock question meaning', 'The zoom can feel like a cliché if overplayed'],
  };
  const B = {
    id: 'b', code: 'P02 · Direction B', name: 'Monsoon Confluence', verdict: 'Map kept; water rejected', verdictCls: 'part', keyStyle: 'aspect-ratio:900/560',
    thesis: 'The haor and the river in flood season, rendered as moving water. Two sampled sites, three fish each, set in the landscape that makes “one well-connected stock” plausible.',
    key: `<canvas id="water" aria-hidden="true"></canvas><div class="over">${haorMap({ over: true })}</div>`,
    keyCap: `${reg('ill')} Live WebGL water under a schematic map. Positions approximate; no routes implied. The shader falls back to the static map if WebGL is unavailable.`,
    states: [
      { t: 'Establish', c: 'Static map: the Surma and Hakaluki Haor, two badges.', art: haorMap({}) },
      { t: 'Site', c: 'Choose a site: three specimen glyphs, n = 3.', art: withVB(haorMap({}), '420 300 440 260') },
      { t: 'FST lens', c: 'Published range read against Wright’s bands.', art: fstScale() },
    ],
    palette: [['Monsoon silt', '#574c34'], ['Haor green', '#2e6b6e'], ['River', '#9cc7d3'], ['Land', '#1c2b26'], ['Badge', '#e9d9a6'], ['Hairline', '#8fa6ad']],
    type: ['Hakaluki Haor', 'Surma River', 'SCHEMATIC · NO ROUTES', 'Newsreader italic for place names, Plex Mono for map furniture.'],
    material: 'Flow-noise water from a fragment shader beneath a cartographic overlay at 80% opacity. Dusk light, paper-map hairlines.',
    motion: ['Water drifts at a few pixels per second', 'No directional currents or arrows', 'Badges expand on select: 300 ms'],
    interaction: ['Choose a site', 'Read the FST range on Wright’s scale', 'Switch map labels on or off'],
    build: 'About 30 lines of GLSL with no library, plus the SVG map. Static gradient fallback.',
    integrity: ['“No routes implied” printed on the map', 'Site-level badges, not sampling points', 'FST range attributed to EJABF 2025'],
    evidence: `${reg('pub')} two sites, n = 3 (Oceans), FST 0.000–0.017 (EJABF).`,
    pros: ['Atmospheric and unmistakably Sylhet', 'Puts the genetics in the place it is about', 'Technically light: one shader, no framework'],
    cons: ['Moving water visually argues for connectivity, the very claim n = 3 can only weakly support', 'Maps invite false precision about sampling points that are not published', 'Shader cost on low-end phones'],
  };
  const cmp = {
    id: 'p02', title: 'Silver Thread against Monsoon Confluence', cols: CMP_COLS,
    rows: [
      ['Scientific fidelity', [5, 'Uses the published numbers exactly'], [3, 'Water implies flow'], [5, 'Thread for the result, map for the setting']],
      ['Evidence honesty', [5, 'N and unplaced counts'], [3, 'Animation argues a conclusion'], [5, 'Static map, pinned n = 3']],
      ['Visual distinctiveness', [4, 'Silver on ink'], [5, 'Live water'], [4, 'Loses the shader, keeps the place']],
      ['Interaction depth', [4, 'Scrub and zoom'], [3, 'Choose a site'], [4, 'Site, specimen, scrub, FST lens']],
      ['Mobile legibility', [4, 'Thread wraps to rows'], [3, 'Map labels crowd'], [4, 'Map shrinks to a key']],
      ['Works with current data', [3, 'Magnifier is all N'], [5, 'Needs only published figures'], [4, 'Upgrades when the FASTA arrives']],
    ],
    decisionTitle: 'Silver Thread is the core; the map opens it.',
    decision: ['The static map establishes Hakaluki Haor and the Surma with their n = 3 badges, then the experience moves inward to the fish, the mitogenome and the 1,114-position thread. The FST lens closes it, with Wright’s bands as reference science and the sample-size warning beside the result.', 'The WebGL water stays in the board as a tested technique, not the default: moving water persuades the eye of connectivity before the visitor reads the evidence.'],
  };
  return boardPage('hilsa', 'Hilsa molecular genetics concept board', 'Two directions for the cytochrome b study of hilsa in the Sylhet haor and river system. Published values come from Oceans 2026 and EJABF 2025; drawn elements are labelled.', `P02 · Concept board ${reg('pub', 'Published source')}`, [A, B], cmp, waterScript);
}

function pabdaBoard() {
  const A = {
    id: 'a', code: 'P05 · Direction A', name: 'From the Gut', verdict: 'Selected: opening frame', verdictCls: 'part', keyLight: true,
    thesis: 'Start inside the fish: an anatomical window shows where the isolates came from. Then the bench takes over.',
    key: pabda({ cutaway: true }),
    keyCap: `${reg('ill')} Stylised Ompok pabda with a gut window. ${reg('rec')} gut-derived isolates, per the researcher.`,
    states: [
      { t: 'Meet the fish', c: 'Whole fish with its project status banner.', light: true, art: pabda({ cutaway: false }) },
      { t: 'Open', c: 'The window irises open on the intestine.', light: true, art: withVB(pabda({ cutaway: true }), '120 140 420 230') },
      { t: 'Isolate', c: 'A culture plate stands for the isolation method.', light: true, art: culturePlate({}) },
    ],
    palette: [['Pabda pearl', '#e9dfd8'], ['Intestine', '#c86f66'], ['Cavity', '#5a1e22'], ['Culture cream', '#efe3c2'], ['Ink', '#14202a'], ['Bile olive', '#8a9a3c']],
    type: ['From the gut', 'isolation source only', 'SAURES-UGC-2025-26-FISH-067', 'Newsreader for the anatomy captions, Plex Mono for the grant code and status.'],
    material: 'A translucent body with visible myomeres and vertebral line; warm lab light; a clean incision rim around the window.',
    motion: ['Window irises open: 600 ms', 'Sample ring pulses once', 'Nothing moves inside the gut'],
    interaction: ['Open the window', 'Tap the sample site', 'Continue to the bench'],
    build: 'SVG fish with a clip-path window; the iris is a scaled clip path.',
    integrity: ['“Not evidence of colonisation or benefit” printed in the art', 'No bacteria drawn on the gut wall', 'Species name withheld until 16S data'],
    evidence: `${reg('rec')} project code and gut origin only.`,
    pros: ['Answers “where did the isolates come from?” in one image', 'A second fish species gives the Atlas range', 'Calm and precise'],
    cons: ['Anatomical drama implies in vivo knowledge the project does not have', 'Tempts a later edit that draws bacteria lining the gut', 'Little to interact with'],
  };
  const B = {
    id: 'b', code: 'P05 · Direction B', name: 'Stress Gauntlet', verdict: 'Selected: core', verdictCls: 'sel', keyLight: true,
    thesis: 'Each isolate must pass gates. Two gates are underway: simulated gastric fluid and bile salts. Four are drawn as empty dashed frames because the project has not reached them.',
    key: stressBench({ active: 'gastric' }),
    keyCap: `${reg('ill')} Method bench; no results shown. ${reg('wait')} raw CFU counts, pH and bile concentration.`,
    states: [
      { t: 'Gate 1', c: 'Simulated gastric: before and after plates, counts pending.', light: true, art: withVB(stressBench({ active: 'gastric' }), '100 20 360 420') },
      { t: 'Gate 2', c: 'Bile salts: survival pending.', light: true, art: withVB(stressBench({ active: 'bile' }), '450 20 360 420') },
      { t: 'Not yet', c: 'Four dashed gates say what each would test.', light: true, art: withVB(stressBench({}), '800 20 400 420') },
    ],
    palette: [['Bench', '#f4f7f7'], ['Steel', '#58686e'], ['Bile olive', '#6f7f22'], ['Bile', '#c9c46a'], ['Cream', '#efe4c2'], ['Dashed', '#9aa8ad']],
    type: ['Gate 2 · bile salts', 'survival: awaiting counts', 'NOT YET TESTED', 'Plex Mono carries the bench; Newsreader only for the chapter title.'],
    material: 'Lab glass on a white bench under flat, diffuse light. Dashed outlines are the only “material” for gates not yet reached.',
    motion: ['Isolate token moves gate to gate: 400 ms', 'Counts fade in only when raw data exist', 'Dashed gates never animate'],
    interaction: ['Pick an isolate once the list exists', 'Open a gate to read its protocol', 'Empty gates explain what each would test'],
    build: 'SVG bench; gate states from a JSON list of isolates when supplied.',
    integrity: ['No counts invented; “awaiting raw counts” in place', 'Priestia/Bacillus report not shown until 16S data', 'Status banner: ongoing, researcher-supplied'],
    evidence: `${reg('rec')} assays named in the brief; ${reg('wait')} all values.`,
    pros: ['Makes an unfinished project look rigorous rather than empty', 'The verb, “test”, is unique in the Atlas', 'Grows naturally as data arrive'],
    cons: ['Flat and diagrammatic beside P01 and P02', 'Many “awaiting” labels can read as a weak project', 'Gate order implies a fixed protocol sequence'],
  };
  const cmp = {
    id: 'p05', title: 'From the Gut against Stress Gauntlet', cols: CMP_COLS,
    rows: [
      ['Scientific fidelity', [4, 'Correct origin'], [5, 'Correct assays'], [5, 'Origin then assays']],
      ['Evidence honesty', [3, 'Anatomy invites over-reading'], [5, 'Empty gates stay empty'], [5, 'Warnings carried into both']],
      ['Visual distinctiveness', [4, 'Translucent catfish'], [3, 'Diagrammatic bench'], [4, 'Warm opening, clean bench']],
      ['Interaction depth', [2, 'Open, tap'], [4, 'Gate by gate'], [4, 'Open, then test']],
      ['Works with current data', [4, 'Needs only the origin'], [3, 'Needs counts to come alive'], [4, 'Useful now, better later']],
    ],
    decisionTitle: 'Open in the gut, live on the bench.',
    decision: ['From the Gut is the opening frame, with its warning printed in the art. The Stress Gauntlet is the experience. Until raw counts arrive, the bench shows methods and empty gates, which is accurate for an ongoing project.', 'Rejected: any bacteria drawn on the intestinal wall, and any species name before sequencing.'],
  };
  return boardPage('pabda', 'Pabda gut microbiology concept board', 'Two directions for the ongoing probiotic screening of gut-derived isolates from pabda. No results are public; the board shows methods, origin and the gates not yet reached.', `P05 · Concept board ${reg('rec', 'Researcher-supplied project')}`, [A, B], cmp);
}

function evolutionBoard() {
  const A = {
    id: 'a', code: 'Evolution · Direction A', name: 'Braided Channels', verdict: 'Selected', verdictCls: 'sel', keyLight: true,
    thesis: 'Four method channels braid across 2023–2026, the way Sylhet’s rivers do. Projects sit where the evidence dates them; dotted crossings are claimed transfers of method.',
    key: braid({}),
    keyCap: `${reg('pub')} filled glyphs · ${reg('rec')} half-filled · dashed = proposed. T1 and T2 are claimed transfers, evidence pending.`,
    states: [
      { t: 'Source', c: 'Channels draw left to right from 2023.', light: true, art: withVB(braid({}), '0 0 560 530') },
      { t: 'Converge', c: 'Oceans 2026 bridges genetics and people.', light: true, art: withVB(braid({}), '700 100 500 420') },
      { t: 'Phone', c: 'On mobile the braid becomes a dated list with the same glyphs.', light: true, art: `<div class="phone"><p class="v">2023 · Hilsa specimens collected</p><p class="v">2025 · PLOS ONE effectors</p><p class="v">2025 · EJABF hilsa genetics</p><p class="v">2025 · Limnological Review</p><p class="r">2025 · Community field survey</p><p class="r">2025–26 · Pabda isolates</p><p class="v">2026 · Oceans</p><p class="r">2026 · Salmonella thesis</p><p class="x">proposed · gut microbiome</p></div>` },
    ],
    palette: [['Silt', '#efe5cf'], ['Sandbar', '#e3d4b2'], ['Channel', '#4f8db3'], ['Deep channel', '#2d6589'], ['Ink', '#14202a'], ['Today', '#c0392b']],
    type: ['2023 → 2026', 'four channels, one researcher', 'T1 · CLAIMED TRANSFER', 'Instrument Sans for node labels, Plex Mono for dates, Newsreader for the section title.'],
    material: 'Silt-coloured ground with a light stipple; water ribbons with a pale upper bank; ink nodes like survey pins.',
    motion: ['Channels draw on first view: 1.2 s', 'Node lifts on focus: 200 ms', 'Crossings dash-animate only on hover'],
    interaction: ['Select a node for its evidence card', 'Filter by evidence register', 'Highlight a method channel'],
    build: 'One SVG computed from a dated JSON list; channel width grows where projects are active.',
    integrity: ['Glyph shape encodes evidence, not just colour', 'Transfers labelled “claimed, evidence pending”', 'PRCC project unnamed pending permission'],
    evidence: `${reg('pub')} publication dates; ${reg('rec')} thesis, Pabda and survey dates.`,
    pros: ['Shows overlap honestly: genetics and computation ran at the same time', 'Local metaphor with a real time axis', 'Method transfers become visible and checkable'],
    cons: ['Braids can imply that one lane caused another', 'Label crowding around 2025–26', 'Weak on a phone without the list fallback'],
  };
  const B = {
    id: 'b', code: 'Evolution · Direction B', name: 'Scale Field', verdict: 'Lane order adopted', verdictCls: 'part', keyLight: true,
    thesis: 'Time runs across and biological scale runs down, from molecule to people. Each project is a column of dots at the scales it studied.',
    key: scaleField({}),
    keyCap: `${reg('pub')} filled dots · ${reg('rec')} half-filled dots. Scales assigned by the Atlas from each project’s methods.`,
    states: [
      { t: 'Molecule', c: 'Computational work sits alone at the molecular scale.', light: true, art: withVB(scaleField({}), '200 380 600 160') },
      { t: 'Span', c: 'Oceans 2026 spans gene to people.', light: true, art: withVB(scaleField({}), '760 60 440 440') },
      { t: 'Microbe', c: 'Thesis and Pabda share the microbe and organism rows.', light: true, art: withVB(scaleField({}), '820 260 380 220') },
    ],
    palette: [['Field', '#f5f7f6'], ['Grid', '#9aa8ad'], ['Ink', '#14202a'], ['Today', '#c0392b']],
    type: ['Molecule → people', 'scales studied', 'GENE · POPULATION', 'Plex Mono axes; Instrument Sans labels.'],
    material: 'Dot-grid paper and hairlines. No illustration.',
    motion: ['Dots fade in by year: 400 ms', 'Hover connects a project’s scales'],
    interaction: ['Hover a project to connect its scales', 'Toggle evidence register'],
    build: 'One SVG from the same JSON as Direction A.',
    integrity: ['Scale assignments marked as the Atlas’s reading', 'Register glyphs as in A'],
    evidence: `${reg('pub')} and ${reg('rec')} as in A.`,
    pros: ['Analytically clear about breadth', 'Shows the move from molecules to communities', 'Cheap to build'],
    cons: ['Reads as a chart, not a story', 'Scale assignment is a judgement presented as a grid', 'Diagonal labels on small screens'],
  };
  const cmp = {
    id: 'evo', title: 'Braided Channels against Scale Field', cols: CMP_COLS,
    rows: [
      ['Chronological honesty', [5, 'Dated nodes, visible overlap'], [4, 'Dated, less legible'], [5, 'Braid with dated nodes']],
      ['Evidence honesty', [4, 'Crossings need labels'], [4, 'Scale is a judgement'], [5, 'Claimed transfers marked']],
      ['Visual distinctiveness', [5, 'Local river metaphor'], [3, 'Familiar chart'], [5, 'Braid kept']],
      ['Interaction depth', [4, 'Node cards, filters'], [3, 'Hover'], [4, 'Cards, filters, scale toggle']],
      ['Mobile legibility', [3, 'Needs the list'], [3, 'Diagonal labels'], [4, 'Dated list with glyphs']],
    ],
    decisionTitle: 'Braid the channels; order them by scale.',
    decision: ['Braided Channels replaces the current eight-stage motivational path. Lanes run top to bottom from molecule to community, which is the one idea worth taking from the Scale Field.', 'The current site says the research “began with computational biology”. The dated record does not support that, so the braid starts with the 2023 hilsa sampling and runs the computational lane alongside it.'],
  };
  return boardPage('evolution', 'Research Evolution concept board', 'Two directions for showing how the research developed, built only from dated evidence. Published dates are filled glyphs; dates from the researcher are half-filled.', `Research Evolution · Concept board`, [A, B], cmp);
}

/* ---------- storyboards ---------- */
function frame(n, f) {
  return `<article class="frame"><div class="frame-art ${f.light ? 'light' : ''}">${f.art}${f.ui || ''}</div><div class="frame-meta">
    <p class="frame-n"><span>${String(n).padStart(2, '0')} · ${esc(f.kind)}</span><span>${esc(f.dur || '')}</span></p><h3>${esc(f.t)}</h3>
    <dl><dt>Sees</dt><dd>${esc(f.sees)}</dd><dt>Does</dt><dd>${esc(f.does)}</dd><dt>Changes</dt><dd>${esc(f.changes)}</dd></dl>
    <p class="tr">${esc(f.tr)}</p><div class="chips">${f.regs}</div></div></article>`;
}
const storyPage = (slug, title, lede, eyebrow, frames, flow) => page({
  title, desc: lede, depth: 1,
  body: `${nav(1, 'Storyboards')}${subnav(1, 'storyboards', slug)}<main class="wrap"><header class="page-head"><p class="eyebrow">${eyebrow}</p><h1>${esc(title)}</h1><p class="lede">${esc(lede)}</p></header>
    <section class="frames">${frames.map((f, i) => frame(i + 1, f)).join('')}</section>
    <section class="print flow"><h2>State carried between frames</h2><ol>${flow.map((x) => `<li>${esc(x)}</li>`).join('')}</ol></section>
    <p class="foot">Storyboard · Phase 2 · 18 Oct 2026 · <a href="../concepts/${slug}.html">concept board</a>${slug === 'salmonella' ? ' · <a href="../prototype/salmonella/index.html">working prototype</a>' : ''}</p></main>`,
});

function salmonellaStory() {
  return storyPage('salmonella', 'Salmonella & AMR storyboard', 'Six scenes from the market to the resistance plate. This sequence is built and working in the prototype.', `P01 · Storyboard ${reg('disp', 'invA disputed')}`, [
    { kind: 'establishing', dur: '0–3 s', t: 'A station before dawn', art: styled(marketScene({ leaders: false }), 'filter:brightness(.7)'), sees: 'A cutter’s station under one bulb; the title; a disputed-evidence note.', does: 'Reads, scrolls.', changes: 'The bulb flickers on once, then the seven leaders draw in.', tr: 'Leaders draw from each object to its number (300 ms).', regs: reg('ill') + reg('disp') },
    { kind: 'select', t: 'Choose a surface', art: marketScene({ spot: 'basket', markers: true, dimOp: 0.4 }), ui: '<div class="ui dark" style="right:4%;top:8%"><b>8 / 22</b> events · basket surface</div>', sees: 'Seven numbered surfaces; a card; matrix chips below.', does: 'Taps a number or a chip.', changes: 'Spotlight moves; card shows the count or “not reported”; the bar chart row lights.', tr: 'Selection persists into the ledger below.', regs: reg('rec') + reg('wait', 'Inferred names') },
    { kind: 'filter', t: '154 samples, one ledger', art: miniLedger('basket'), sees: 'A 7 × 22 grid grouped by market; counts at the right.', does: 'Picks a market; arrow-keys through samples.', changes: 'Matching squares fill; the status line reads the sample’s position.', tr: 'Gradient band: night to bench (“samples leave the market”).', regs: reg('rec') },
    { kind: 'read', t: 'Reading an XLD plate', light: true, art: xldPlate({ callouts: true }), sees: 'A streaked XLD plate; three colony types; a 154-mark sieve.', does: 'Isolates a colony type; steps 154 → 62 → 40.', changes: 'Other colonies fade; marks empty from the end; the big count ticks.', tr: 'Count-only marks; no sample identity.', regs: reg('ill') + reg('ref') + reg('rec') },
    { kind: 'switch', t: 'One gene, two accounts', light: true, art: gelFrame({}), ui: '<div class="ui" style="left:4%;bottom:6%"><b>Record</b> 40/40 invA+ · provisional</div><div class="ui" style="right:4%;bottom:6%"><b>Site 2026</b> 0 interpretable</div>', sees: 'Both accounts side by side; an empty gel template; a checklist of missing evidence.', does: 'Switches the invA account (here or in the header).', changes: 'Isolate wording, organism label, header path and the claims list re-label across the page.', tr: 'Changed words flash amber once.', regs: reg('disp') + reg('wait') },
    { kind: 'simulate', t: 'Resistance on Mueller–Hinton', light: true, art: mhPlate({ ruler: { code: 'TE', mm: 9 } }), ui: '<div class="ui" style="right:3%;top:6%"><b>TE 9 mm</b> → resistant (≤ 11)</div>', sees: 'A disc-diffusion plate; four agents; a zone simulator; 40 marks; the MAR scale.', does: 'Chooses a disc; drags the zone; toggles MDR.', changes: 'Zone radius and S/I/R readout update; marks fill to 24, 20 or 14.', tr: 'Ends on what the study can and cannot claim, under the chosen account.', regs: reg('ill', 'Simulator') + reg('ref') + reg('rec') },
  ], ['Selected matrix: chapter 01 → ledger filter in chapter 02.', 'invA account: header ↔ chapter 04 ↔ isolate wording in 05 ↔ claims in 06.', 'Sieve step: chapter 03 ↔ highlighted node in the header path.', 'Disc and zone per agent: kept while the visitor moves between agents.']);
}
function hilsaStory() {
  return storyPage('hilsa', 'Hilsa molecular genetics storyboard', 'Six scenes from the haor to the alignment and back to policy. Published values from Oceans 2026 and EJABF 2025; drawn elements are labelled.', `P02 · Storyboard ${reg('pub', 'Published source')}`, [
    { kind: 'establishing', t: 'Two places, one river system', art: haorMap({}), sees: 'Schematic Surma River and Hakaluki Haor; two badges, n = 3 each.', does: 'Chooses a site.', changes: 'The badge opens into three specimen glyphs.', tr: 'Zoom into the chosen badge (600 ms).', regs: reg('pub') + reg('ill', 'Schematic map') },
    { kind: 'specimen', t: 'One fish', art: hilsa({ sample: true }), sees: 'A stylised hilsa; scutes, shoulder spot, forked tail labelled on hover.', does: 'Taps the sample marker.', changes: 'Note: tissue type per protocol, awaiting.', tr: 'Camera pushes into the flank.', regs: reg('ill') + reg('wait') },
    { kind: 'inward', t: 'One gene', art: mtRing({}), sees: 'The mitogenome ring with cytb lit.', does: 'Selects cytb or another gene.', changes: 'Other genes dim; length and position shown.', tr: 'cytb unrolls into the thread.', regs: reg('ref') },
    { kind: 'scrub', t: '1,114 positions', art: cytbThread({}), sees: 'A ruler of 1,114 positions; 1,099 invariant; 15 variable as a count.', does: 'Scrubs with pointer or arrow keys.', changes: 'Position readout; bases stay N until the FASTA arrives.', tr: 'Counts lift into the two-site comparison.', regs: reg('pub') + reg('wait', 'FASTA') },
    { kind: 'compare', t: 'Three fish per site', art: fstScale(), sees: 'Two sites of three; FST 0.000–0.017 on Wright’s bands.', does: 'Opens “what n = 3 can show”.', changes: 'A caveat panel explains power and sampling limits.', tr: 'Pull back out to the landscape and people.', regs: reg('pub') + reg('ref') },
    { kind: 'conclude', t: 'Findings, interpretation, recommendations', light: true, art: servicesLedger(), sees: 'Three registers from the Oceans paper.', does: 'Expands each register.', changes: 'Quotes appear with page references once supplied.', tr: 'Links to the wetland biodiversity experience (P03).', regs: reg('pub') + reg('wait', 'Quotes') },
  ], ['Chosen site: frame 01 → highlighted column in frame 05.', 'Scrub position: kept if the visitor returns to the thread.', 'n = 3 badge: pinned from frame 01 to frame 05.']);
}
function pabdaStory() {
  return storyPage('pabda', 'Pabda gut microbiology storyboard', 'Six scenes for an ongoing project. Everything after the method is a placeholder until the researcher supplies data.', `P05 · Storyboard ${reg('rec', 'Researcher-supplied project')}`, [
    { kind: 'status', t: 'An ongoing project', light: true, art: pabda({ cutaway: false }), ui: '<div class="ui" style="left:4%;top:8%"><b>ONGOING</b> · SAURES-UGC-2025-26-Fish-067 · no public results</div>', sees: 'The fish and a status banner with the grant code.', does: 'Reads; opens “what this project is”.', changes: 'Role statement appears once the award letter is supplied.', tr: 'Window irises open.', regs: reg('rec') + reg('wait', 'Role') },
    { kind: 'origin', t: 'From the gut', light: true, art: pabda({ cutaway: true }), sees: 'The intestine through an anatomical window.', does: 'Taps the sample ring.', changes: 'Label: isolation source only.', tr: 'Cut to the bench.', regs: reg('ill') },
    { kind: 'isolate', t: 'Isolation', light: true, art: culturePlate({}), sees: 'An illustrative culture plate; isolate count “awaiting”.', does: 'Opens the isolate list (when supplied).', changes: 'Isolate tokens appear, one per isolate.', tr: 'An isolate token moves to gate 1.', regs: reg('ill') + reg('wait') },
    { kind: 'test', t: 'Gate 1 · simulated gastric', light: true, art: withVB(stressBench({ active: 'gastric' }), '100 20 360 420'), sees: 'Challenge tube; before and after plates.', does: 'Steps the token through the gate.', changes: 'Log reduction appears only with raw counts.', tr: 'Token moves to gate 2.', regs: reg('wait', 'Raw counts') },
    { kind: 'test', t: 'Gate 2 · bile salts', light: true, art: withVB(stressBench({ active: 'bile' }), '450 20 360 420'), sees: 'Bile challenge; survival plates.', does: 'Compares isolates (when supplied).', changes: 'Survival shown per isolate, no ranking until n is known.', tr: 'Token reaches the dashed gates.', regs: reg('wait', 'Raw counts') },
    { kind: 'boundary', t: 'Gates not yet reached', light: true, art: withVB(stressBench({}), '800 20 400 420'), sees: 'Species ID, safety, antagonism, in vivo: dashed.', does: 'Opens a gate to read what it would test.', changes: 'Nothing fills until the project reaches it.', tr: 'Ends with the open question, stated plainly.', regs: reg('wait') },
  ], ['Isolate token: carried gate to gate once the isolate list exists.', 'Status banner: pinned through every frame.']);
}
function evolutionStory() {
  return storyPage('evolution', 'Research Evolution storyboard', 'Six scenes for the braided timeline that replaces the eight-stage path.', 'Research Evolution · Storyboard', [
    { kind: 'source', t: '2023: the first channel', light: true, art: withVB(braid({}), '0 0 560 530'), sees: 'One channel with the dated hilsa sampling.', does: 'Scrolls or presses next.', changes: 'The computational channel appears beside it, not after it.', tr: 'Channels draw left to right (1.2 s).', regs: reg('pub') },
    { kind: 'lanes', t: 'Four methods, ordered by scale', light: true, art: braid({}), sees: 'Four channels from molecule to community.', does: 'Highlights a channel.', changes: 'Other channels dim to 30%.', tr: 'Nodes rise into place.', regs: reg('pub') + reg('rec') },
    { kind: 'inspect', t: 'Evidence behind a node', light: true, art: withVB(braid({}), '560 140 400 160'), ui: '<div class="ui" style="right:4%;bottom:8%"><b>EJABF 2025</b> · cytb · FST 0.000–0.017 · published</div>', sees: 'A node card with DOI, role and register.', does: 'Selects a node.', changes: 'Card opens; the node’s glyph explains its status.', tr: 'Card closes on Escape.', regs: reg('pub') },
    { kind: 'transfer', t: 'Claimed transfers', light: true, art: withVB(braid({}), '300 180 700 230'), sees: 'T1 and T2 dotted crossings.', does: 'Opens a crossing.', changes: '“Claimed, evidence pending” until a record links the methods.', tr: 'Crossings dash-animate on hover only.', regs: reg('rec', 'Claimed') },
    { kind: 'now', t: 'Today and the next question', light: true, art: withVB(braid({}), '880 60 320 420'), sees: 'The today line; Pabda ongoing; the proposed microbiome question dashed.', does: 'Reads the open question.', changes: 'Nothing: a proposed node never becomes solid by animation.', tr: 'Hands over to the project index.', regs: reg('rec') },
    { kind: 'mobile', t: 'Phone and reduced motion', light: true, art: '<div class="phone"><p class="v">2023 · Hilsa specimens collected</p><p class="v">2024–25 · PLOS ONE effectors</p><p class="v">2025 · EJABF hilsa genetics</p><p class="v">2025 · Limnological Review</p><p class="r">2025 · Community field survey</p><p class="r">2025–26 · Pabda isolates</p><p class="v">2026 · Oceans</p><p class="r">2026 · Salmonella thesis</p><p class="x">proposed · gut microbiome</p></div>', sees: 'A dated list with the same glyphs.', does: 'Taps an item.', changes: 'The item expands into its evidence card.', tr: 'Reduced motion: the static SVG braid with no drawing.', regs: reg('pub') + reg('rec') },
  ], ['Highlighted channel: kept while nodes are inspected.', 'Register filter: shared with the project index.']);
}

/* ---------- overview ---------- */
function hub() {
  const cards = [
    ['salmonella', 'P01 Salmonella & AMR', 'Tungsten Night into Lightbox Bench. Built as the working prototype.', marketScene({ markers: true, spot: 'flesh', dimOp: 0.4 }), false],
    ['hilsa', 'P02 Hilsa genetics', 'Silver Thread, opened by a static map of the haor and river.', withVB(hilsaThread(), '0 0 1200 760'), false],
    ['pabda', 'P05 Pabda microbiology', 'From the Gut, then the Stress Gauntlet with its empty gates.', pabda({ cutaway: true }), true],
    ['evolution', 'Research Evolution', 'Braided Channels ordered by biological scale.', withVB(braid({}), '0 0 1200 530'), true],
  ];
  const tests = RESULTS ? RESULTS.checks.map((c) => [c.name, c.ok ? 'pass' : 'fail', c.detail || '']) : [];
  return page({
    title: 'Shishir Research Atlas', desc: 'Phase 2 visual production: concept boards, storyboards and a working Salmonella prototype.', depth: 0,
    body: `${nav(0, 'Overview')}<main class="wrap">
    <header class="page-head"><p class="eyebrow">Phase 2 · visual production · 18 October 2026</p><h1>Four experiences, eight directions, one working slice</h1>
      <p class="lede">Concept boards with two directions each, a critical comparison and a selected synthesis; illustrated storyboards for all four experiences; and the Salmonella investigation built as a tested vertical slice. Every value is tagged as published, researcher record, disputed, reference science, illustrative or awaiting evidence.</p>
      <p><a class="btn" href="prototype/salmonella/index.html">Open the Salmonella prototype</a></p></header>
    <section class="hero-strip" aria-label="Experiences">${cards.map(([k, t, d, art, light]) => `<article class="card"><div class="art ${light ? 'light' : ''}">${art}</div><div class="card-body"><h3>${esc(t)}</h3><p>${esc(d)}</p><p class="card-links"><a href="concepts/${k}.html">Concept board</a><a href="storyboards/${k}.html">Storyboard</a>${k === 'salmonella' ? '<a href="prototype/salmonella/index.html">Prototype</a>' : ''}</p></div></article>`).join('')}</section>
    <section class="print" aria-labelledby="pv"><p class="dir-code">Prototype previews · ${RESULTS ? `Chromium ${esc(RESULTS.browser)} via Playwright ${esc(RESULTS.playwright)} · ${esc(RESULTS.date)}` : 'not yet captured'}</p><h2 class="dir-name" id="pv" style="margin:6px 0 18px">Salmonella at the Cutting Station</h2>
      <div class="shots"><figure><img src="previews/desktop-station.webp" alt="Desktop view of the prototype: night market scene with the fish-skin surface selected and its card showing 9 of 22 events" width="1440" height="900" loading="lazy"><figcaption>Desktop 1440 × 900 · chapter 01, fish skin selected</figcaption></figure>
        <figure><img src="previews/mobile-station.webp" alt="Mobile view of the prototype at 390 pixels wide showing the header, sample path and market scene" width="390" height="844" loading="lazy"><figcaption>Mobile 390 × 844</figcaption></figure></div>
      <div class="shots-row">
        <figure><img src="previews/desktop-ledger.webp" alt="Ledger of 154 samples with the basket row and market 4 highlighted" loading="lazy"><figcaption>Ledger filtered</figcaption></figure>
        <figure><img src="previews/desktop-plate.webp" alt="XLD plate with only black-centred colonies shown and the sieve at 62" loading="lazy"><figcaption>Plate read, sieve at 62</figcaption></figure>
        <figure><img src="previews/desktop-confirm-site.webp" alt="Confirmation chapter under the August 2026 site account" loading="lazy"><figcaption>invA account switched</figcaption></figure>
        <figure><img src="previews/desktop-ast.webp" alt="Mueller–Hinton plate with tetracycline selected and multidrug resistance shown" loading="lazy"><figcaption>Zone simulator, MDR on</figcaption></figure>
      </div></section>
    <section class="print" aria-labelledby="sel"><p class="dir-code">Selection</p><h2 class="dir-name" id="sel" style="margin:6px 0 18px">What was chosen and why</h2><div class="tw"><table class="tests"><thead><tr><th scope="col">Experience</th><th scope="col">Direction A</th><th scope="col">Direction B</th><th scope="col">Selected</th></tr></thead><tbody>
      <tr><td>P01 Salmonella</td><td>Tungsten Night</td><td>Lightbox Bench</td><td>A for place and design, B for the bench; built</td></tr>
      <tr><td>P02 Hilsa</td><td>Silver Thread</td><td>Monsoon Confluence</td><td>A core; B’s static map opens it; moving water rejected</td></tr>
      <tr><td>P05 Pabda</td><td>From the Gut</td><td>Stress Gauntlet</td><td>B core; A as the opening frame</td></tr>
      <tr><td>Evolution</td><td>Braided Channels</td><td>Scale Field</td><td>A, with lanes ordered by B’s scales</td></tr></tbody></table></div></section>
    <section class="print" aria-labelledby="tst"><p class="dir-code">Browser tests · atlas/tests/run.mjs</p><h2 class="dir-name" id="tst" style="margin:6px 0 18px">Prototype checks${RESULTS ? `: ${RESULTS.checks.filter((c) => c.ok).length} of ${RESULTS.checks.length} passed` : ': not yet run'}</h2><div class="tw"><table class="tests"><thead><tr><th scope="col">Check</th><th scope="col">Result</th><th scope="col">Detail</th></tr></thead><tbody>${tests.map(([t, r, d]) => `<tr><td>${esc(t)}</td><td><span class="${r}">${r}</span></td><td>${esc(d)}</td></tr>`).join('')}</tbody></table></div></section>
    <section class="print cols" aria-label="Blockers"><div><h3>Evidence blockers</h3><ul>
      <li>invA: thesis PDF, uncropped gel with ladder and controls, primer pair and amplicon size</li>
      <li>Per-isolate AST table with zone diameters and CLSI edition (unlocks the antibiogram)</li>
      <li>Names and detection counts for four matrices; sampling protocol; unit of the 62 XLD candidates</li>
      <li>Hilsa alignment FASTA, GenBank accessions, tissue type and his lab role</li>
      <li>Pabda award letter and role, isolate list, raw CFU counts, pH and bile concentration</li>
      <li>PRCC permission before naming the 2025 field survey</li>
      <li>Shishir_Hilsa_B12_Refined_Illustrated.html and .mp4: not in the uploads or Drive</li></ul></div>
      <div><h3>Technical blockers</h3><ul>
      <li>Network policy blocks mdpi.com, api.crossref.org and ebi.ac.uk from this container, so the Oceans full text could not be re-read for haplotype statistics</li>
      <li>BioRender, Canva and Synthesize Bio need authorisation; none is required for this work</li>
      <li>The n8n connector failed to connect; not required</li>
      <li>Nothing has been merged or deployed: the live site deploys only from main</li></ul></div></section>
    <p class="foot">Shishir Research Atlas · Phase 2 studio · branch ccr-77b45c3f-z25s5k · not linked from the live portfolio</p></main>`,
  });
}

export function allPages() {
  return [
    ['concepts/salmonella.html', salmonellaBoard()], ['concepts/hilsa.html', hilsaBoard()], ['concepts/pabda.html', pabdaBoard()], ['concepts/evolution.html', evolutionBoard()],
    ['storyboards/salmonella.html', salmonellaStory()], ['storyboards/hilsa.html', hilsaStory()], ['storyboards/pabda.html', pabdaStory()], ['storyboards/evolution.html', evolutionStory()],
    ['index.html', hub()],
  ];
}
