// Browser QA for the P01 pilot. Needs `npm run build` and `npm run preview` (port 4173).
// Usage: node tests/run.mjs [path/to/axe.min.js]   → tests/results.json + tests/screens/*.png
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const { chromium } = await import('playwright').catch(() => import('/opt/node-tools/node_modules/playwright/index.mjs'));

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, '..');
const archive = path.resolve(site, '..');
const shots = path.join(here, 'screens');
fs.mkdirSync(shots, { recursive: true });
const URL_ = process.env.ATLAS_URL || 'http://127.0.0.1:4173/';
const axe = process.argv[2];
const checks = [];
const check = (id, name, ok, detail = '') => { checks.push({ id, name, ok: !!ok, detail: String(detail) }); console.log(ok ? 'PASS' : 'FAIL', id, name, '|', detail); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch();
const errs = (pg) => { const e = []; pg.on('console', (m) => { if (m.type() === 'error') e.push(m.text()); }); pg.on('pageerror', (x) => e.push(x.message)); return e; };
async function open(opts = {}, { settle = true } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const pg = await ctx.newPage(); const e = errs(pg);
  const t0 = Date.now();
  await pg.goto(URL_, { waitUntil: 'networkidle' });
  if (opts.javaScriptEnabled !== false) await pg.waitForFunction(() => document.documentElement.dataset.ready, null, { timeout: 15000 });
  const readyMs = Date.now() - t0;
  if (settle && opts.javaScriptEnabled !== false) await pg.waitForFunction(() => window.__atlas.station().state === 'overview', null, { timeout: 8000 });
  return { ctx, pg, e, readyMs };
}
const st = (pg) => pg.evaluate(() => window.__atlas.station());
const cam = (pg) => pg.evaluate(() => ({ c: window.__atlas.camera(), b: window.__atlas.base() }));
const scrollTo = (pg, sel, off = 130) => pg.evaluate(([s, o]) => window.scrollTo({ top: document.querySelector(s).getBoundingClientRect().top + scrollY - o, behavior: 'instant' }), [sel, off]);

/* T01–T06 station state machine (desktop) */
{
  const { ctx, pg, e, readyMs } = await open({}, { settle: false });
  await pg.waitForFunction(() => window.__atlas.station().state === 'overview', null, { timeout: 8000 });
  const log = await pg.evaluate(() => window.__atlas.log.join(' '));
  check('T01', 'Loads without console errors; establishing → overview', e.length === 0 && log === 'loading→establishing establishing→overview', `${e.length} errors; ${log}; ready in ${readyMs} ms`);
  await scrollTo(pg, '.stage'); await wait(200);
  await pg.screenshot({ path: path.join(shots, 'desktop-overview.png') });

  await pg.click('.hotspot[data-matrix="skin"]');
  await pg.waitForFunction(() => window.__atlas.station().state === 'evidence-revealed', null, { timeout: 4000 });
  const { c, b } = await cam(pg);
  const panel = await pg.textContent('.mx-card');
  const dims = await pg.evaluate(() => [...document.querySelectorAll('.layer.dim')].map((l) => l.dataset.asset));
  const spotOp = await pg.evaluate(() => getComputedStyle(document.querySelector('.spot')).opacity);
  check('T02', 'Select hotspot → object-focused → evidence-revealed; camera zooms 1.6×; others dim', panel.includes('Fish skin') && panel.includes('9') && Math.abs(c.s / b.s - 1.6) < 0.03 && dims.length === 5 && !dims.includes('P01-S01-A010') && +spotOp > 0.95, `zoom ${(c.s / b.s).toFixed(3)}, dimmed ${dims.length} layers, spot ${spotOp}`);
  await pg.screenshot({ path: path.join(shots, 'desktop-focused-skin.png') });

  await pg.click('.mx-chip[data-matrix="basket"]'); await wait(120); await pg.click('.mx-chip[data-matrix="tool"]');
  await pg.waitForFunction(() => window.__atlas.station().selected === 'tool' && window.__atlas.station().state === 'evidence-revealed', null, { timeout: 4000 });
  await wait(400);
  const p2 = await pg.textContent('.mx-card'), s2 = await st(pg);
  const stale = (await pg.evaluate(() => window.__atlas.log)).filter((x) => x.includes('evidence-revealed(basket)')).length;
  check('T03', 'Interrupting a focus move retargets cleanly (no stale reveal)', s2.selected === 'tool' && p2.includes('bonti') && stale === 0, `final ${s2.state}(${s2.selected}); stale basket reveals ${stale}`);

  await pg.keyboard.press('Escape');
  await pg.waitForFunction(() => window.__atlas.station().state === 'overview');
  await wait(900);
  const r = await cam(pg);
  check('T04', 'Escape resets to overview and the base camera', Math.abs(r.c.s - r.b.s) < 0.002 && Math.abs(r.c.x - r.b.x) < 1, `scale ${r.c.s.toFixed(4)} vs base ${r.b.s.toFixed(4)}`);

  await pg.focus('.hotspot[data-matrix="skin"]');
  await pg.keyboard.press('3');
  await pg.waitForFunction(() => window.__atlas.station().state === 'evidence-revealed');
  await pg.keyboard.press('ArrowRight');
  await pg.waitForFunction(() => window.__atlas.station().selected === 'water' && window.__atlas.station().state === 'evidence-revealed');
  const foc = await pg.evaluate(() => document.activeElement.dataset.matrix);
  check('T05', 'Keyboard: number keys select, arrows cycle and move focus', foc === 'water', `focus on ${foc}`);
  await pg.keyboard.press('Escape');

  // motion smoothness during a focus move (headless software rendering; recorded, not a pass/fail threshold)
  const fps = await pg.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); const tick = () => { n++; if (performance.now() - t0 < 850) requestAnimationFrame(tick); else res(Math.round((n * 1000) / (performance.now() - t0))); }; document.querySelector('.hotspot[data-matrix="flesh"]').click(); requestAnimationFrame(tick); }));
  check('T06', 'Focus move frame rate measured (headless Chromium, software GPU)', fps > 0, `${fps} fps during the 0.85 s focus move`);
  await ctx.close();
}

/* T07 establishing interrupted by a selection */
{
  const { ctx, pg } = await open({}, { settle: false });
  await pg.click('.mx-chip[data-matrix="board"]');
  await pg.waitForFunction(() => window.__atlas.station().state === 'evidence-revealed', null, { timeout: 4000 });
  const log = await pg.evaluate(() => window.__atlas.log.join(' '));
  check('T07', 'Selecting during the establishing dolly ends it and focuses', log.endsWith('object-focused→evidence-revealed(board)'), log);
  await ctx.close();
}

/* T08–T12 lab chapters, lens, scroll reversal */
{
  const { ctx, pg, e } = await open();
  await pg.click('.mx-chip[data-matrix="skin"]');
  await pg.waitForFunction(() => window.__atlas.station().state === 'evidence-revealed');
  await pg.click('label:has(#lens-site)'); await wait(200);
  const L = await pg.evaluate(() => ({ card: document.querySelector('.mx-card').textContent, fn: document.querySelector('.funnel [data-lens-text="funnelN"]').textContent, iso: document.querySelector('#P01-S05 [data-lens-text="isolates"]').textContent, acc: document.querySelector('.account.on').dataset.account }));
  check('T08', 'invA account switch re-labels the open panel, header path and later chapters', L.card.includes('presumptive-positive') && L.fn === '0' && L.iso === 'presumptive isolates' && L.acc === 'site', `header ${L.fn}; S05 “${L.iso}”`);
  await pg.click('label:has(#lens-record)');

  await scrollTo(pg, '#P01-S03', 0); await wait(700);
  const modeIn = await pg.getAttribute('#top', 'data-mode');
  await pg.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await wait(700);
  const modeBack = await pg.getAttribute('#top', 'data-mode');
  check('T09', 'Scroll-linked market → bench transition reverses on scroll up', modeIn === 'bench' && modeBack === 'night', `down: ${modeIn}, back up: ${modeBack}`);

  await scrollTo(pg, '#P01-S03');
  await pg.click('.step[data-step="1"]'); await wait(800);
  const n = await pg.textContent('#attr-n'), on = await pg.locator('#attr-marks .mk:not(.off)').count();
  await pg.click('.colony[data-colony="h2s"]'); await wait(500);
  const yel = await pg.evaluate(() => getComputedStyle(document.querySelector('#P01-S03 [data-colony="yel"]')).opacity);
  check('T10', 'Sieve step and colony filter', n === '62' && on === 62 && +yel < 0.2, `count ${n}, marks ${on}, yellow opacity ${yel}`);
  await pg.screenshot({ path: path.join(shots, 'desktop-lab.png') });

  await scrollTo(pg, '#P01-S05');
  await pg.click('.agent[data-disc="TE"]');
  const read = async (v) => { await pg.fill('#zone', String(v)); return (await pg.textContent('#sim-read')).split(':')[0]; };
  const r = [await read(9), await read(13), await read(20)];
  await wait(500);
  const zr = await pg.getAttribute('#P01-S05 .zone[data-disc="TE"]', 'r');
  check('T11', 'Zone simulator reads R/I/S against reference breakpoints and redraws the zone', r.join() === 'Resistant,Intermediate,Susceptible' && Math.abs(+zr - 10 * (292 / 45)) < 0.5, `${r.join(' / ')}; zone r ${zr}`);
  await pg.check('#mdr'); await wait(500);
  const mdr = await pg.locator('#ast-marks .mk:not(.off)').count();
  check('T12', 'MDR toggle shows 14 of 40 and no console errors across chapters', mdr === 14 && e.length === 0, `${mdr} marks; ${e.length} errors`);
  await pg.screenshot({ path: path.join(shots, 'desktop-ast.png') });
  if (axe && fs.existsSync(axe)) {
    await pg.addScriptTag({ path: axe });
    const v = await pg.evaluate(async () => (await window.axe.run(document)).violations.map((x) => ({ id: x.id, impact: x.impact, n: x.nodes.length, t: x.nodes[0]?.target.join(' ') })));
    const bad = v.filter((x) => x.impact === 'serious' || x.impact === 'critical');
    check('T13', 'axe-core: no serious or critical violations', bad.length === 0, bad.map((x) => `${x.id}×${x.n} (${x.t})`).join('; ') || `${v.length} minor: ${v.map((x) => x.id).join(', ') || 'none'}`);
  } else check('T13', 'axe-core: no serious or critical violations', false, 'axe-core path not supplied');
  await ctx.close();
}

/* T14 reduced motion: no dolly, focus is immediate */
{
  const { ctx, pg } = await open({ reducedMotion: 'reduce' }, { settle: false });
  const first = await pg.evaluate(() => window.__atlas.log.join(' '));
  await pg.click('.mx-chip[data-matrix="basket"]');
  const s = await st(pg);
  const { c, b } = await cam(pg);
  check('T14', 'Reduced motion: establishing skipped, focus applied in the same frame', first === 'loading→establishing establishing→overview' && s.state === 'evidence-revealed' && Math.abs(c.s / b.s - 1.6) < 0.03, `${s.state} immediately; zoom ${(c.s / b.s).toFixed(2)}`);
  await ctx.close();
}

/* T15 phone with touch */
{
  const { ctx, pg, e } = await open({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  await scrollTo(pg, '.stage', 140); await wait(200);
  await pg.screenshot({ path: path.join(shots, 'mobile-overview.png') });
  const visible = await pg.evaluate(() => [...document.querySelectorAll('.hotspot')].filter((b) => !b.hidden).map((b) => b.dataset.matrix));
  await pg.tap(`.hotspot[data-matrix="${visible[0]}"]`);
  await pg.waitForFunction(() => window.__atlas.station().state === 'evidence-revealed');
  await pg.tap('.mx-chip[data-matrix="hands"]');
  await pg.waitForFunction(() => window.__atlas.station().selected === 'hands' && window.__atlas.station().state === 'evidence-revealed');
  await wait(300); await scrollTo(pg, '.stage', 140); await wait(150);
  await pg.screenshot({ path: path.join(shots, 'mobile-focused-hands.png') });
  const minSize = await pg.evaluate(() => Math.min(...[...document.querySelectorAll('.hotspot')].filter((b) => !b.hidden).map((b) => b.getBoundingClientRect().width)));
  check('T15', 'Phone: tap hotspot and chip; targets ≥ 32 px', e.length === 0 && minSize >= 32, `visible hotspots ${visible.join(',')}; smallest ${minSize}px`);
  await ctx.close();
}

/* T16 widths */
{
  const bad = [];
  for (const w of [1440, 1024, 768, 390, 360]) {
    const { ctx, pg, e } = await open({ viewport: { width: w, height: 860 } });
    const sw = await pg.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w || e.length) bad.push(`${w}: ${sw} ${e.join('|')}`);
    await ctx.close();
  }
  check('T16', 'No horizontal scroll or errors at 1440, 1024, 768, 390, 360 px', bad.length === 0, bad.join('; ') || 'scrollWidth = viewport at every width');
}

/* T17 JavaScript disabled */
{
  const { ctx, pg } = await open({ javaScriptEnabled: false });
  const r = await pg.evaluate(() => ({ img: document.querySelector('.stage-static').naturalWidth, h1: document.querySelector('h1').textContent, chips: document.querySelectorAll('.mx-chip').length, plates: [...document.querySelectorAll('img.plate-src')].filter((i) => i.naturalWidth > 0).length }));
  await pg.screenshot({ path: path.join(shots, 'nojs.png') });
  check('T17', 'JavaScript off: static composite, text and plate figures render', r.img === 2400 && r.chips === 7 && r.plates === 2, `composite ${r.img}px wide, ${r.chips} chips, ${r.plates} plates`);
  await ctx.close();
}

/* T18 end-to-end asset replacement: a stand-in "generated" basket passes the checker, is registered, and the site uses it */
{
  const gdir = path.join(site, 'dist/assets/p01/generated');
  const assets = JSON.parse(fs.readFileSync(path.join(archive, '05-production-manifests/assets.json'), 'utf8'));
  const a = assets.find((x) => x.id === 'P01-S01-A011');
  const standin = path.join(here, 'screens', 'standin-basket.png');
  execFileSync('python3', ['-c', `
from PIL import Image, ImageOps
a=${JSON.stringify({ x: a.position[0], y: a.position[1], w: a.size[0], h: a.size[1] })}
l=Image.open('${path.join(archive, '09-tool-fallbacks/image-reconstruction/layers/p01-s01-a011.png')}').convert('RGBA').crop((a['x'],a['y'],a['x']+a['w'],a['y']+a['h']))
r,g,b,al=l.split(); Image.merge('RGBA',(b,g,r,al)).save('${standin}')`]);
  let checker = '';
  try { checker = execFileSync('python3', [path.join(archive, '09-tool-fallbacks/image-reconstruction/check_asset.py'), 'P01-S01-A011', standin], { encoding: 'utf8' }); } catch (x) { checker = x.stdout; }
  fs.copyFileSync(standin, path.join(gdir, 'p01-s01-a011-basket.png'));
  const idx = path.join(gdir, 'index.json'), before = fs.readFileSync(idx, 'utf8');
  fs.writeFileSync(idx, JSON.stringify({ files: ['p01-s01-a011-basket.png'] }));
  try {
    const { ctx, pg } = await open();
    const layers = await pg.evaluate(() => window.__atlas.layers());
    const L = layers.find((x) => x.id === 'P01-S01-A011');
    const badge = await pg.textContent('.fidelity');
    const box = await pg.evaluate(() => { const el = document.querySelector('[data-asset="P01-S01-A011"]'); return { left: el.style.left, top: el.style.top, w: el.style.width, kind: el.dataset.kind }; });
    await scrollTo(pg, '.stage'); await wait(200);
    await pg.screenshot({ path: path.join(shots, 'dropin-generated-basket.png') });
    check('T18', 'Asset drop-in: checker PASS, then the site loads the generated layer at manifest coordinates', checker.includes('RESULT PASS') && L.kind === 'generated' && box.left === `${a.position[0]}px` && box.top === `${a.position[1]}px` && box.w === `${a.size[0]}px` && badge.includes('1 of 8'), `checker ${checker.includes('RESULT PASS') ? 'PASS' : 'FAIL'}; layer ${L.kind} at ${box.left},${box.top} ${box.w}; badge “${badge}”`);
    await ctx.close();
  } finally {
    fs.writeFileSync(idx, before); fs.rmSync(path.join(gdir, 'p01-s01-a011-basket.png'));
  }
}

const v = browser.version();
await browser.close();
const out = { date: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC', browser: `Chromium ${v} (headless)`, url: URL_, passed: checks.filter((c) => c.ok).length, total: checks.length, checks };
fs.writeFileSync(path.join(here, 'results.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`${out.passed}/${out.total} passed`);
process.exit(out.passed === out.total ? 0 : 1);
