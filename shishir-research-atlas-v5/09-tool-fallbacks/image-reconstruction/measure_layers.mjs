// Render each vector layer alone on a transparent canvas (2400 x 1440) and save it as PNG,
// so measure_layers.py can compute the true alpha bounding boxes used for registration.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = await import('playwright').catch(() => import('/opt/node-tools/node_modules/playwright/index.mjs'));
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dir = path.join(root, '08-interactive-website/public/assets/p01/fallback');
const out = path.join(root, '09-tool-fallbacks/image-reconstruction/layers');
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 2400, height: 1440 } });
for (const f of fs.readdirSync(dir).filter((x) => x.startsWith('p01-s01-'))) {
  await pg.goto(`file://${dir}/${f}`);
  await pg.waitForTimeout(150);
  await pg.screenshot({ path: path.join(out, f.replace('.svg', '.png')), omitBackground: true });
}
await b.close();
