// P01 vertical slice: static HTML with pre-rendered SVG (works without JavaScript);
// app.js adds the interactions.
import { marketScene, STATION } from '../scenes.mjs';
import { xldPlate, mhPlate, invASchematic, gelFrame, salmonellaCell, DISCS, esc } from '../illus.mjs';
import { P01, REG } from '../p01-data.mjs';
import { fonts } from './common.mjs';

const chip = (reg, text) => `<span class="reg reg-${reg}" title="${esc(REG[reg].desc)}"><i aria-hidden="true"></i>${esc(text || REG[reg].label)}</span>`;
const L = P01.lens.record;

function hotspots() {
  return STATION.order.map((id) => {
    const m = P01.matrices.find((x) => x.id === id), [x, y] = STATION.markers[id];
    return `<button type="button" class="hotspot" data-matrix="${id}" aria-pressed="false" style="left:${((x / 1200) * 100).toFixed(2)}%;top:${((y / 720) * 100).toFixed(2)}%"><span aria-hidden="true">${m.n}</span><span class="sr">${esc(m.name)}</span></button>`;
  }).join('');
}
function mxChips() {
  return P01.matrices.map((m) => `<button type="button" class="mx-chip" data-matrix="${m.id}" aria-pressed="false"><b>${m.n}</b> ${esc(m.name)}${m.inferred ? '<sup aria-label="name inferred">*</sup>' : ''}</button>`).join('');
}
function detectChart() {
  const max = 50;
  const rows = P01.matrices.map((m) => {
    const pct = m.pos == null ? null : (m.pos / m.of) * 100;
    return `<button type="button" class="dc-row" data-matrix="${m.id}" aria-pressed="false"><span class="dc-name">${esc(m.name)}${m.inferred ? '*' : ''}</span>
      <span class="dc-track">${pct == null ? '<span class="dc-none">not reported</span>' : `<span class="dc-bar" style="width:${((pct / max) * 100).toFixed(1)}%"></span>`}</span>
      <span class="dc-val">${pct == null ? '—' : `${m.pos}/${m.of} · ${pct.toFixed(1)}%`}</span></button>`;
  }).join('');
  const ticks = [0, 10, 20, 30, 40, 50].map((t) => `<span style="left:${(t / max) * 100}%">${t}%</span>`).join('');
  return `<div class="dc" role="group" aria-label="Detection by matrix">${rows}<div class="dc-axis" aria-hidden="true"><span class="dc-name"></span><span class="dc-ticks">${ticks}</span><span class="dc-val"></span></div></div>`;
}
function ledger() {
  const head = Array.from({ length: 11 }, (_, i) => `<span role="columnheader" class="lg-mk" aria-label="Market ${i + 1}">M${String(i + 1).padStart(2, '0')}</span>`).join('');
  const rows = P01.matrices.map((m, mi) => {
    let cells = '';
    for (let mk = 1; mk <= 11; mk++) {
      cells += '<span role="presentation" class="lg-m">';
      for (let ev = 1; ev <= 2; ev++) {
        const pos = (mk - 1) * 14 + (ev - 1) * 7 + mi + 1;
        cells += `<span role="gridcell" class="lg-c" tabindex="${pos === 1 ? 0 : -1}" data-mk="${mk}" data-ev="${ev}" data-matrix="${m.id}" data-pos="${pos}" aria-label="Market ${mk}, event ${ev}, ${esc(m.name)}. Ledger position ${pos} of 154. Per-sample result not in the current record."></span>`;
      }
      cells += '</span>';
    }
    const count = m.pos == null ? '<span class="lg-n none">—</span>' : `<span class="lg-n"><b>${m.pos}</b>/22</span>`;
    return `<div role="row" class="lg-row" data-matrix="${m.id}"><span role="rowheader" class="lg-h"><b>${m.n}</b> <span class="lg-long">${esc(m.name)}</span><span class="lg-short">${esc(m.short)}</span>${m.inferred ? '*' : ''}</span>${cells}<span role="gridcell" class="lg-count">${count}</span></div>`;
  }).join('');
  return `<div class="lg" role="grid" aria-label="Ledger of 154 samples: 7 matrices by 11 markets and 2 events" aria-describedby="lg-help">
    <div role="row" class="lg-row lg-headrow"><span role="columnheader" class="lg-h">Matrix</span>${head}<span role="columnheader" class="lg-count">events +</span></div>${rows}</div>`;
}
function marks(n, cls = '') {
  return Array.from({ length: n }, (_, i) => `<i class="mk ${cls}" data-i="${i}"></i>`).join('');
}
function discButtons() {
  return DISCS.map((d) => `<button type="button" class="disc-btn" data-disc="${d.code}" aria-pressed="${d.code === 'AMP'}" style="left:${((d.x / 700) * 100).toFixed(2)}%;top:${((d.y / 700) * 100).toFixed(2)}%"><span class="sr">${esc(d.name)} disc</span></button>`).join('');
}
function agentTabs() {
  return P01.ast.agents.map((a, i) => `<button type="button" class="agent" data-disc="${a.code}" aria-pressed="${i === 0}"><b>${a.code}</b> ${esc(a.name)}</button>`).join('');
}

export function prototypePage() {
  const a0 = P01.ast.agents[0];
  const data = JSON.stringify({ matrices: P01.matrices, funnel: P01.funnel, lens: P01.lens, ast: P01.ast, markers: STATION.markers, targets: STATION.targets, mm: 292 / 45 });
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Salmonella at the Cutting Station</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Interactive vertical slice of the Salmonella and AMR thesis: linked sampling, XLD culture, the disputed invA confirmation and disc-diffusion resistance, with every value tagged by evidence status.">
${fonts}
<link rel="stylesheet" href="app.css">
</head>
<body>
<a class="skip" href="#c1">Skip to the investigation</a>
<header class="top" id="top">
  <div class="top-row">
    <a class="brand" href="../../index.html"><span class="brand-a">Research Atlas</span><span class="brand-p">P01 · Salmonella &amp; AMR</span></a>
    <ol class="funnel" aria-label="Sample path from market to resistance">
      <li data-step="0"><b>154</b><span>samples</span></li>
      <li data-step="1"><b>62</b><span>XLD-suspect</span></li>
      <li data-step="2"><b>40</b><span>isolates</span></li>
      <li data-step="3" class="f-disp"><b data-lens-text="funnelN">${L.funnelN}</b><span data-lens-text="funnelLabel">${L.funnelLabel}</span></li>
      <li data-step="4"><b>14</b><span>MDR</span></li>
    </ol>
    <fieldset class="lens">
      <legend>invA account</legend>
      <label><input type="radio" name="lens" id="lens-record" value="record" checked><span><span class="l-long">Researcher record</span><span class="l-short">Record</span> <small>provisional</small></span></label>
      <label><input type="radio" name="lens" id="lens-site" value="site"><span><span class="l-long">Site text, Aug 2026</span><span class="l-short">Site 2026</span></span></label>
    </fieldset>
  </div>
  <nav class="chapters" aria-label="Chapters"><a href="#c1">Station</a><a href="#c2">Ledger</a><a href="#c3">Plate</a><a href="#c4">Confirmation</a><a href="#c5">Resistance</a><a href="#c6">Claims</a></nav>
</header>
<noscript><p class="noscript">The controls need JavaScript. Every figure below shows its default state, and each has a written or tabular equivalent.</p></noscript>
<div class="sr" aria-live="polite" id="live"></div>

<main>
<section class="band night" id="c1" aria-labelledby="c1-h">
  <div class="wrap">
    <div class="intro">
      <p class="eyebrow">P01 · ${esc(P01.meta)} ${chip('rec')}</p>
      <h1 id="c1-h">Seven surfaces at one cutting station</h1>
      <p class="lede">At each of 22 fish-processing events in 11 Sylhet wet markets, the study sampled the fish, the water, the handler, the blade and the surfaces they touch: 154 linked samples. Choose a surface to see what the record says about it.</p>
      <div class="dispute" role="note"><span class="reg reg-disp"><i aria-hidden="true"></i>Disputed</span><p>The researcher’s latest record says all 40 isolates were confirmed by invA PCR. His own portfolio text from August 2026 says none gave an interpretable product. This prototype follows the record as a provisional account. Switch the <b>invA account</b> in the header to see the page under the other version.</p></div>
    </div>
    <div class="station">
      <figure class="scene" data-sel="">
        <div class="scene-stage">${marketScene({ p: 'ms', leaders: true, markers: false })}
        <div class="hotspots">${hotspots()}</div></div>
        <figcaption>${chip('ill')} Reconstruction of a typical station. Positions orient the reader; they are not a measured transmission pathway.</figcaption>
      </figure>
      <div class="mx-card" id="mx-card" aria-live="polite">
        <p class="mx-k">Select a surface</p>
        <h2 class="mx-name">Seven matrices, 22 samples each</h2>
        <p class="mx-body">Each matrix was sampled once per processing event, so each contributes 22 of the 154 samples. Detection counts are reported for three matrices; the other four are not in the current record.</p>
        <dl class="mx-dl"><div><dt>Samples per matrix</dt><dd>22 ${chip('rec')}</dd></div><div><dt>Sampling method</dt><dd>awaiting thesis protocol ${chip('wait')}</dd></div></dl>
      </div>
    </div>
    <div class="mx-chips" role="group" aria-label="Choose a matrix">${mxChips()}</div>
    <p class="fine">* Name inferred from the site phrase “fish, water, handlers, tools and processing surfaces”. Confirm against the thesis.</p>
    <figure class="figure">
      <figcaption class="fig-h"><span>Events with a presumptive-positive sample, by matrix</span> ${chip('rec')}</figcaption>
      ${detectChart()}
      <p class="fine">Bars use one scale, 0–50% of 22 events. The source reports event-level detection; it does not say which events.</p>
    </figure>
  </div>
</section>

<section class="band night" id="c2" aria-labelledby="c2-h">
  <div class="wrap">
    <div class="chap-head"><p class="eyebrow">02 · Study design</p><h2 id="c2-h">154 samples, one ledger</h2>
      <p class="lede">Rows are matrices, columns are processing events grouped by market. Every square is one sample. The record gives counts per matrix, not results per sample, so no square is coloured as positive.</p></div>
    <div class="lg-tools">
      <label for="mk-select">Market</label>
      <select id="mk-select"><option value="all">All 11 markets</option>${Array.from({ length: 11 }, (_, i) => `<option value="${i + 1}">Market ${String(i + 1).padStart(2, '0')}</option>`).join('')}</select>
      <button type="button" class="ghost" id="lg-clear">Clear selection</button>
      <p class="lg-status" id="lg-status" aria-live="polite">Showing all 154 samples.</p>
    </div>
    <div class="lg-wrap">${ledger()}</div>
    <p class="fine" id="lg-help">Focus the grid and use the arrow keys to move between samples. Ledger positions are a reading order, not laboratory sample IDs. ${chip('rec', 'Design: researcher record')}</p>
    <p class="note">The August 2026 site adds that all 22 processing events produced at least one presumptive-positive matrix. ${chip('rec')}</p>
  </div>
</section>

<div class="transit" aria-hidden="true"><div class="wrap"><p>Samples leave the market for the laboratory bench</p></div></div>

<section class="band bench" id="c3" aria-labelledby="c3-h">
  <div class="wrap">
    <div class="chap-head"><p class="eyebrow">03 · Selective culture</p><h2 id="c3-h">Reading an XLD plate</h2>
      <p class="lede">On xylose lysine deoxycholate agar, Salmonella typically grows as red colonies with black centres: it ferments xylose, then decarboxylates lysine, which returns the medium to red, and its hydrogen sulphide turns the centre black.</p></div>
    <div class="plate-grid">
      <figure class="plate-wrap" data-read="">
        ${xldPlate({ p: 'xp', seed: 11, callouts: false })}
        <figcaption>${chip('ill')} Illustrative quadrant streak. Not a study plate.</figcaption>
      </figure>
      <div class="plate-side">
        <div class="seg" role="group" aria-label="Highlight a colony type">
          <button type="button" class="colony" data-colony="h2s" aria-pressed="false"><i class="cdot h2s"></i>Red, black centre</button>
          <button type="button" class="colony" data-colony="yel" aria-pressed="false"><i class="cdot yel"></i>Yellow</button>
          <button type="button" class="colony" data-colony="red" aria-pressed="false"><i class="cdot red"></i>Red, no black centre</button>
        </div>
        <div class="colony-card" id="colony-card" aria-live="polite">
          <p class="mx-k">${chip('ref')}</p>
          <p id="colony-text">Choose a colony type to isolate it on the plate. Black centres mark hydrogen sulphide, which is why look-alikes such as Citrobacter and Proteus have to be removed by biochemical testing.</p>
        </div>
        <div class="attr">
          <div class="seg" role="group" aria-label="Step through the sample path">
            ${P01.funnel.map((f, i) => `<button type="button" class="step" data-step="${i}" aria-pressed="${i === 2}">${f.n} <span>${esc(f.label.split(' ')[0])}</span></button>`).join('')}
          </div>
          <p class="attr-n"><b id="attr-n">40</b> <span id="attr-label">${esc(P01.funnel[2].label)}</span> ${chip('rec')}</p>
          <div class="marks" id="attr-marks" aria-hidden="true">${marks(154)}</div>
          <p class="fine" id="attr-note">${esc(P01.funnel[2].note)}</p>
          <p class="fine">Marks are counts only. They do not identify which samples were positive.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="band bench" id="c4" aria-labelledby="c4-h">
  <div class="wrap">
    <div class="chap-head"><p class="eyebrow">04 · Molecular confirmation ${chip('disp')}</p><h2 id="c4-h">One gene, two accounts</h2>
      <p class="lede">invA sits in Salmonella pathogenicity island 1 and is a standard Salmonella-specific PCR target. Whether these 40 isolates carried it is the one fact this study’s conclusions turn on, and the researcher’s two sources disagree.</p></div>
    <div class="accounts">
      <article class="account" data-account="record"><h3>Researcher’s latest record <small>provisional</small></h3><p>${esc(P01.lens.record.summary)}</p><button type="button" class="ghost use-lens" data-lens="record">Read the page this way</button></article>
      <article class="account" data-account="site"><h3>Portfolio text, August 2026</h3><p>${esc(P01.lens.site.summary)}</p><button type="button" class="ghost use-lens" data-lens="site">Read the page this way</button></article>
    </div>
    <div class="changes"><h3>What the switch changes</h3><ul>
      <li>Isolates are called <b data-lens-text="isolates">${esc(L.isolates)}</b>.</li>
      <li>The organism is labelled <b data-lens-text="organism">${esc(L.organism)}</b>.</li>
      <li>The header path shows <b><span data-lens-text="funnelN">${L.funnelN}</span> <span data-lens-text="funnelLabel">${L.funnelLabel}</span></b>, and the claims in chapter 06 change.</li></ul></div>
    <div class="conf-grid">
      <figure class="figure">${salmonellaCell({ p: 'sc', dark: false })}<figcaption>${chip('ref')} Gram-negative rod, about 2–5 µm, with peritrichous flagella. Schematic.</figcaption></figure>
      <figure class="figure">${invASchematic({ p: 'iv' })}<figcaption>${chip('ref')} invA lies between invE and invB in SPI-1. Widely used primers (Rahn et al., 1992) amplify 284 bp; the thesis primer pair and amplicon size are still to be supplied.</figcaption></figure>
    </div>
    <div class="conf-grid">
      <figure class="figure">${gelFrame({ p: 'gl' })}<figcaption>${chip('wait')} Lane plan the real photograph should show: ladder, positive control, negative control, no-template control, isolates.</figcaption></figure>
      <div class="settle"><h3>What would settle it</h3><ul class="checklist">${P01.settle.map((s) => `<li><span class="st">not yet supplied</span>${esc(s)}</li>`).join('')}</ul></div>
    </div>
  </div>
</section>

<section class="band bench" id="c5" aria-labelledby="c5-h">
  <div class="wrap">
    <div class="chap-head"><p class="eyebrow">05 · Antimicrobial susceptibility</p><h2 id="c5-h">Resistance on Mueller–Hinton</h2>
      <p class="lede">The 40 isolates (<span data-lens-text="isolates">${esc(L.isolates)}</span>) were each lawned onto Mueller–Hinton agar with antibiotic discs. A wide clear zone means the drug stopped growth; a narrow one means resistance. Twelve agents were tested and nine interpreted.</p></div>
    <div class="ast-grid">
      <figure class="plate-wrap mh-wrap" data-disc="AMP">
        ${mhPlate({ p: 'mp', zones: Object.fromEntries(P01.ast.agents.map((a) => [a.code, a.zone])) })}
        <div class="disc-btns">${discButtons()}</div>
        <figcaption>${chip('ill')} One illustrative isolate. Zone sizes are drawn, not measured.</figcaption>
      </figure>
      <div class="ast-side">
        <div class="seg agents" role="group" aria-label="Choose an antibiotic">${agentTabs()}</div>
        <div class="sim">
          <h3>Read a zone <span class="reg reg-ill"><i aria-hidden="true"></i>Simulator</span></h3>
          <label for="zone" class="sim-l">Zone diameter for <b id="sim-agent">${a0.name}</b>: <output id="zone-out" for="zone">${a0.zone} mm</output></label>
          <input type="range" id="zone" min="6" max="40" step="1" value="${a0.zone}">
          <div class="bp" id="bp" aria-hidden="true"><span class="bp-r" style="width:0"></span><span class="bp-i"></span><span class="bp-s"></span><i class="bp-pin"></i></div>
          <p class="sim-read" id="sim-read" aria-live="polite">Resistant: ${a0.zone} mm is at or below the ${a0.bp.r} mm breakpoint.</p>
          <p class="fine" id="bp-note">${chip('ref')} CLSI M100 disc-diffusion breakpoints for Enterobacterales: S ≥ ${a0.bp.s} mm, R ≤ ${a0.bp.r} mm. Confirm the edition the thesis used.</p>
        </div>
        <div class="rec-panel">
          <h3>In this study ${chip('rec')}</h3>
          <p class="rec-n" id="rec-n"><b>${a0.r}</b> of 40 <span data-lens-text="isolates">${esc(L.isolates)}</span> resistant to ${esc(a0.name.toLowerCase())} (${a0.pct}%)</p>
          <div class="marks m40" id="ast-marks" aria-hidden="true">${marks(40)}</div>
          <label class="toggle"><input type="checkbox" id="mdr"> Show multidrug resistance: 14 of 40 (35.0%)</label>
          <p class="fine">Counts only; marks are not linked to individual isolates.</p>
        </div>
      </div>
    </div>
    <div class="mar">
      <div class="mar-text"><h3>Multiple antibiotic resistance index</h3><p>MAR divides the number of agents an isolate resists by the number tested. The study’s mean is <b>0.267</b> ${chip('rec')}. Krumperman (1983) proposed reading values above 0.2 as exposure from a high-risk source ${chip('ref')}. Whether the denominator was 9 or 12 agents is still to be confirmed.</p></div>
      <svg class="mar-g" viewBox="0 0 600 90" role="img" aria-label="Mean MAR index 0.267 on a scale from 0 to 1, above the 0.2 reference line"><line x1="20" y1="46" x2="580" y2="46" stroke="currentColor" stroke-opacity=".3" stroke-width="10" stroke-linecap="round"/>${[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => `<text x="${20 + v * 560}" y="84" text-anchor="middle" font-size="13" fill="currentColor" opacity=".7">${v}</text>`).join('')}<line x1="${20 + 0.2 * 560}" y1="22" x2="${20 + 0.2 * 560}" y2="66" stroke="currentColor" stroke-dasharray="4 4" stroke-width="2"/><text x="${20 + 0.2 * 560 - 6}" y="18" text-anchor="end" font-size="13" fill="currentColor">0.2 reference</text><circle cx="${20 + 0.267 * 560}" cy="46" r="11" fill="#b8323f"/><text x="${20 + 0.267 * 560 + 16}" y="30" font-size="15" font-weight="600" fill="currentColor">mean 0.267</text></svg>
    </div>
    <div class="locked"><div class="ghost-grid" aria-hidden="true">${Array.from({ length: 9 * 40 }, () => '<i></i>').join('')}</div><div class="locked-text"><h3>Antibiogram by isolate</h3><p>A 40 × 9 resistance matrix, sortable by MAR, unlocks when the per-isolate table with zone diameters arrives. ${chip('wait')}</p></div></div>
  </div>
</section>

<section class="band ink" id="c6" aria-labelledby="c6-h">
  <div class="wrap">
    <div class="chap-head"><p class="eyebrow">06 · Interpretation</p><h2 id="c6-h">What this study can claim</h2>
      <p class="lede">Under the <b data-lens-text="name">${esc(L.name)}</b> account.</p></div>
    <div class="claims">
      <div><h3>Can claim</h3><ul id="claims-can">${L.can.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
      <div><h3>Cannot claim</h3><ul>${P01.cannot.map((c) => `<li>${esc(c)}</li>`).join('')}<li class="lens-only" data-lens-show="site">That the isolates are Salmonella. Molecular confirmation was not achieved in this account.</li></ul></div>
    </div>
    <details class="register" open><summary>Evidence register for every value on this page</summary>
      <div class="table-wrap"><table><thead><tr><th scope="col">Value</th><th scope="col">Status</th><th scope="col">Source</th></tr></thead><tbody>
      ${P01.register.map(([v, r, s]) => `<tr><td>${esc(v)}</td><td>${chip(r)}</td><td>${esc(s)}</td></tr>`).join('')}
      </tbody></table></div></details>
    <footer class="foot"><p>Vertical-slice prototype for the Research Atlas, built ${new Date('2026-10-18').toISOString().slice(0, 10)}. Not deployed to the live portfolio.</p><p><a href="../../index.html">Atlas overview</a> · <a href="../../storyboards/salmonella.html">Storyboard</a> · <a href="../../concepts/salmonella.html">Concept board</a></p></footer>
  </div>
</section>
</main>
<script id="p01-data" type="application/json">${data.replace(/</g, '\\u003c')}</script>
<script src="app.js" defer></script>
</body>
</html>`;
}
