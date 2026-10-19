// Render the registered vector layers to PNG: the full composite and one crop per asset,
// used as composition references for image generation. Usage: npm run reference [-- ASSET-ID]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = await import('playwright').catch(() => import('/opt/node-tools/node_modules/playwright/index.mjs'));

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const assets = JSON.parse(fs.readFileSync(path.join(root, '05-production-manifests/assets.json'), 'utf8')).filter((a) => a.id.startsWith('P01-S01'));
const dir = path.join(root, '08-interactive-website/public/assets/p01/fallback');
const out = path.join(root, '04-generation-prompts/image/reference');
fs.mkdirSync(out, { recursive: true });
const only = process.argv[2];
const layers = assets.slice().sort((a, b) => a.z - b.z).map((a) => `<img src="file://${dir}/${a.fallback.replace('fallback/', '')}" style="position:absolute;inset:0;width:2400px;height:1440px">`).join('');
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 2400, height: 1440 } });
const tmp = path.join(dir, '..', '_reference.html');
fs.writeFileSync(tmp, `<body style="margin:0;background:#0b1517"><div style="position:relative;width:2400px;height:1440px">${layers}</div></body>`);
await pg.goto(`file://${tmp}`, { waitUntil: 'load' });
await pg.waitForTimeout(800);
if (!only) await pg.screenshot({ path: path.join(out, 'P01-S01-composite.png') });
for (const a of assets.filter((x) => x.position && (!only || x.id === only))) {
  await pg.screenshot({ path: path.join(out, `${a.id}.png`), clip: { x: a.position[0], y: a.position[1], width: a.size[0], height: a.size[1] } });
}
for (const a of assets.filter((x) => (x.id === 'P01-S01-A001' || x.id === 'P01-S01-A002') && (!only || x.id === only))) {
  await pg.screenshot({ path: path.join(out, `${a.id}.png`), clip: a.id === 'P01-S01-A001' ? { x: 0, y: 0, width: 2400, height: 840 } : { x: 0, y: 800, width: 2400, height: 640 } });
}
await b.close();
fs.rmSync(tmp);
console.log('references in', path.relative(root, out));
