// Browser tests and preview capture for the Research Atlas.
// Usage: serve atlas/ on :8077 (npx http-server atlas -p 8077), then
//   node atlas/tests/run.mjs [path-to-axe.min.js]
// Writes atlas/tests/results.json and PNG captures to atlas/previews/_raw/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = await import('playwright').catch(() => import('/opt/node-tools/node_modules/playwright/index.mjs'));
const here = path.dirname(fileURLToPath(import.meta.url));
const raw = path.join(here, '..', 'previews', '_raw');
fs.mkdirSync(raw, { recursive: true });
const BASE = process.env.ATLAS_URL || 'http://127.0.0.1:8077';
const PROTO = `${BASE}/slice/salmonella/index.html`;
const axePath = process.argv[2];
const checks = [];
const check = (name, ok, detail = '') => { checks.push({ name, ok: !!ok, detail: String(detail) }); console.log(ok ? 'PASS' : 'FAIL', name, detail); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const errorsOf = (pg) => { const e = []; pg.on('console', (m) => { if (m.type() === 'error') e.push(m.text()); }); pg.on('pageerror', (x) => e.push(x.message)); return e; };

// 1. desktop functional run
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pg = await ctx.newPage();
const errs = errorsOf(pg);
await pg.goto(PROTO, { waitUntil: 'networkidle' });
await pg.waitForTimeout(1900);
check('Loads with no console errors (desktop)', errs.length === 0, errs.join(' | ') || 'none');

await pg.click('.hotspot[data-matrix="skin"]');
await wait(700);
const card = await pg.textContent('#mx-card');
const dimOp = await pg.getAttribute('.spot-dim', 'opacity');
check('Hotspot selection moves the spotlight and fills the card', card.includes('Fish skin') && card.includes('9') && dimOp === '0.64', `card: “${card.replace(/\s+/g, ' ').trim().slice(0, 60)}…”, dim ${dimOp}`);
await pg.locator('#c1').scrollIntoViewIfNeeded();
await pg.evaluate(() => window.scrollTo({ top: document.querySelector('.station').getBoundingClientRect().top + scrollY - 140, behavior: 'instant' }));
await wait(300);
await pg.screenshot({ path: path.join(raw, 'desktop-station.png') });

const hits = await pg.locator('.lg-c.hit').count();
await pg.selectOption('#mk-select', '4');
const hits2 = await pg.locator('.lg-c.hit').count();
check('Matrix selection filters the ledger; market filter narrows it', hits === 22 && hits2 === 2, `${hits} cells, then ${hits2} with market 04`);
await pg.click('.mx-chip[data-matrix="basket"]');
await wait(400);
await (await pg.$('#c2')).screenshot({ path: path.join(raw, 'desktop-ledger.png') });
await pg.click('#lg-clear');

await pg.focus('.lg-c[data-pos="1"]');
await pg.keyboard.press('ArrowRight');
await pg.keyboard.press('ArrowDown');
const focused = await pg.evaluate(() => [document.activeElement.dataset.pos, document.activeElement.dataset.matrix]);
check('Keyboard: arrow keys move focus across ledger cells', focused[0] === '9' && focused[1] === 'flesh', `focus at ledger position ${focused[0]} (${focused[1]})`);

await pg.click('.step[data-step="1"]');
await wait(900);
const n62 = await pg.textContent('#attr-n');
const on62 = await pg.locator('#attr-marks .mk:not(.off)').count();
await pg.click('.step[data-step="0"]');
await wait(900);
const n154 = await pg.textContent('#attr-n');
check('Sieve steps update the count and marks', n62 === '62' && on62 === 62 && n154 === '154', `62 → ${n62} (${on62} marks), 154 → ${n154}`);
await pg.click('.step[data-step="1"]');
await pg.click('.colony[data-colony="h2s"]');
await wait(500);
const read = await pg.getAttribute('.plate-wrap[data-read]', 'data-read');
const fadedOp = await pg.evaluate(() => getComputedStyle(document.querySelector('.plate-wrap [data-colony="yel"]')).opacity);
check('Colony filter fades the other colony types', read === 'h2s' && +fadedOp < 0.2, `data-read=${read}, yellow opacity ${fadedOp}`);
await (await pg.$('#c3 .plate-grid')).screenshot({ path: path.join(raw, 'desktop-plate.png') });

await pg.click('label:has(#lens-site)');
await wait(500);
const lensState = await pg.evaluate(() => ({ lens: document.documentElement.dataset.lens, iso: document.querySelector('[data-lens-text="isolates"]').textContent, fn: document.querySelector('.funnel [data-lens-text="funnelN"]').textContent, claim: document.querySelector('#claims-can li').textContent, extra: getComputedStyle(document.querySelector('.lens-only')).display }));
check('invA account switch re-labels terms, header path and claims', lensState.lens === 'site' && lensState.iso === 'presumptive isolates' && lensState.fn === '0' && lensState.claim.includes('presumptive') && lensState.extra === 'list-item', `isolates “${lensState.iso}”, header ${lensState.fn}, extra claim ${lensState.extra}`);
await pg.evaluate(() => window.scrollTo({ top: document.querySelector('#c4').getBoundingClientRect().top + scrollY - 120, behavior: 'instant' }));
await wait(300);
await pg.screenshot({ path: path.join(raw, 'desktop-confirm-site.png') });
await pg.click('label:has(#lens-record)');

await pg.click('.agent[data-disc="TE"]');
await pg.fill('#zone', '9');
const r9 = await pg.textContent('#sim-read');
await pg.fill('#zone', '13');
const r13 = await pg.textContent('#sim-read');
await pg.fill('#zone', '20');
const r20 = await pg.textContent('#sim-read');
await wait(100);
  const zr = await pg.getAttribute('.zone[data-disc="TE"]', 'r');
check('Zone slider reads S/I/R against reference breakpoints', r9.startsWith('Resistant') && r13.startsWith('Intermediate') && r20.startsWith('Susceptible') && Math.abs(+zr - 10 * (292 / 45)) < 0.2, `9 mm ${r9.split(':')[0]}, 13 mm ${r13.split(':')[0]}, 20 mm ${r20.split(':')[0]}; zone r ${zr}`);
const te = await pg.textContent('#rec-n');
await pg.check('#mdr');
await wait(500);
const mdrOn = await pg.locator('#ast-marks .mk:not(.off)').count();
check('Agent and MDR toggle show the recorded counts', te.includes('20') && mdrOn === 14, `TE “${te.trim().slice(0, 40)}…”, MDR marks ${mdrOn}`);
await pg.fill('#zone', '9');
await (await pg.$('#c5 .ast-grid')).screenshot({ path: path.join(raw, 'desktop-ast.png') });
await pg.goto(PROTO, { waitUntil: 'networkidle' });
await pg.waitForTimeout(1800);
await pg.screenshot({ path: path.join(raw, 'desktop-full.png'), fullPage: true });

if (axePath && fs.existsSync(axePath)) {
  await pg.addScriptTag({ path: axePath });
  const res = await pg.evaluate(async () => { const r = await window.axe.run(document, { resultTypes: ['violations'] }); return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes[0]?.target?.join(' ') })); });
  const bad = res.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  check('axe-core: no serious or critical violations', bad.length === 0, bad.length ? bad.map((v) => `${v.id}×${v.n} (${v.sample})`).join('; ') : `${res.length} minor/moderate: ${res.map((v) => v.id).join(', ') || 'none'}`);
} else check('axe-core: no serious or critical violations', false, 'axe-core not supplied');
await ctx.close();

// 2. widths: no horizontal page scroll
const widths = [1440, 1024, 768, 390, 360];
const over = [];
for (const w of widths) {
  const c = await browser.newContext({ viewport: { width: w, height: 860 } });
  const p = await c.newPage();
  const e = errorsOf(p);
  await p.goto(PROTO, { waitUntil: 'networkidle' });
  await p.waitForTimeout(300);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  if (sw > w || e.length) over.push(`${w}px → ${sw}${e.length ? ` errors: ${e.join('|')}` : ''}`);
  if (w === 390) {
    await p.waitForTimeout(1600);
    await p.screenshot({ path: path.join(raw, 'mobile-station.png') });
    await p.click('.hotspot[data-matrix="basket"]');
    await p.waitForTimeout(700);
    await p.evaluate(() => window.scrollTo({ top: document.querySelector('.station').getBoundingClientRect().top + scrollY - 130, behavior: 'instant' }));
    await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(raw, 'mobile-selected.png') });
    await p.screenshot({ path: path.join(raw, 'mobile-full.png'), fullPage: true });
  }
  await c.close();
}
check(`No horizontal page scroll or errors at ${widths.join(', ')} px`, over.length === 0, over.join('; ') || 'scrollWidth equals viewport at every width');

// 3. reduced motion
const rm = await browser.newContext({ viewport: { width: 1200, height: 800 }, reducedMotion: 'reduce' });
const rp = await rm.newPage();
await rp.goto(PROTO, { waitUntil: 'networkidle' });
const anim = await rp.evaluate(() => [getComputedStyle(document.querySelector('.bulb')).animationName, getComputedStyle(document.querySelector('.mk')).transitionDuration]);
check('Reduced motion: animations and transitions off', anim[0] === 'none' && /^0s/.test(anim[1]), `bulb animation ${anim[0]}, mark transition ${anim[1]}`);
await rm.close();

// 4. JavaScript disabled
const nj = await browser.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
const np = await nj.newPage();
await np.goto(PROTO, { waitUntil: 'networkidle' });
const nojs = await np.evaluate(() => ({ svgs: document.querySelectorAll('svg.ill').length, cells: document.querySelectorAll('.lg-c').length, rows: document.querySelectorAll('.register tbody tr').length, note: !!document.querySelector('noscript') }));
check('JavaScript disabled: content and default figures render', nojs.svgs >= 6 && nojs.cells === 154 && nojs.rows > 10, `${nojs.svgs} figures, ${nojs.cells} ledger cells, ${nojs.rows} register rows`);
await np.screenshot({ path: path.join(raw, 'nojs.png') });
await nj.close();

// 5. studio pages: errors, overflow, captures
const pages = ['index.html', 'concepts/salmonella.html', 'concepts/hilsa.html', 'concepts/pabda.html', 'concepts/evolution.html', 'storyboards/salmonella.html', 'storyboards/hilsa.html', 'storyboards/pabda.html', 'storyboards/evolution.html'];
const studio = [];
for (const rel of pages) {
  for (const w of [1440, 390]) {
    const c = await browser.newContext({ viewport: { width: w, height: 900 } });
    const p = await c.newPage();
    const e = errorsOf(p);
    await p.goto(`${BASE}/${rel}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(rel.includes('hilsa') ? 1200 : 300);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w || e.length) studio.push(`${rel} @${w}: ${sw}${e.length ? ` ${e.join('|')}` : ''}`);
    if (w === 1440 && rel !== 'index.html') await p.screenshot({ path: path.join(raw, `${rel.replace('/', '-').replace('.html', '')}.png`), fullPage: true });
    if (w === 1440 && rel === 'concepts/hilsa.html') {
      const gl = await p.evaluate(() => !!document.getElementById('water'));
      check('Hilsa board: WebGL water shader runs', gl, gl ? 'canvas kept after shader link' : 'WebGL unavailable; static map fallback shown');
    }
    await c.close();
  }
}
check('Studio pages: no errors or horizontal scroll at 1440 and 390 px', studio.length === 0, studio.join('; ') || `${pages.length} pages`);

const version = browser.version();
await browser.close();
const pw = (() => { try { return JSON.parse(fs.readFileSync('/opt/node-tools/node_modules/playwright/package.json', 'utf8')).version; } catch { return 'unknown'; } })();
fs.writeFileSync(path.join(here, 'results.json'), JSON.stringify({ date: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC', browser: version, playwright: pw, checks }, null, 2));
console.log(`${checks.filter((c) => c.ok).length}/${checks.length} passed`);
