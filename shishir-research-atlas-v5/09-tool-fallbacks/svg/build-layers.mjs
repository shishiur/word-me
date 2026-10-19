// Split the vector station into registered full-canvas layers (viewBox 0 0 1200 720 = canvas / 2)
// and write every vector fallback the website and Remotion use.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marketScene } from './lib/scenes.mjs';
import { xldPlate, mhPlate, gelFrame, invASchematic, salmonellaCell } from './lib/illus.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outs = [path.join(root, '08-interactive-website/public/assets/p01/fallback'), path.join(root, '07-motion-engine/remotion/public/assets/p01/fallback')];
outs.forEach((d) => fs.mkdirSync(d, { recursive: true }));
const put = (name, s) => outs.forEach((d) => fs.writeFileSync(path.join(d, name), s));

const full = marketScene({ p: 'L', leaders: false, markers: false });
const defs = full.slice(full.indexOf('<defs>'), full.indexOf('</defs>') + 7);
const MAP = { A001: 'a001', A002: 'a002', A003: 'a003', O004: 'a012', O007: 'a015', O001: 'a010', O006: 'a014', O003: 'a011', O005: 'a013', A004: 'a004' };
const parts = full.split(/<!--L:([A-Z0-9]+)-->/);
let n = 0;
for (let i = 1; i < parts.length; i += 2) {
  const key = parts[i];
  if (key === 'END') break;
  const file = `p01-s01-${MAP[key]}.svg`;
  put(file, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" width="2400" height="1440">${defs}${parts[i + 1]}</svg>`);
  n++;
}
put('p01-s03-a031.svg', xldPlate({ p: 'X', seed: 11 }).replace('<svg ', '<svg width="1400" height="1400" '));
put('p01-s05-a050.svg', mhPlate({ p: 'M' }).replace('<svg ', '<svg width="1400" height="1400" '));
put('p01-s04-a040-template.svg', gelFrame({ p: 'G' }));
put('p01-s04-inva.svg', invASchematic({ p: 'I' }));
put('p01-s04-cell.svg', salmonellaCell({ p: 'C', dark: false }));
console.log(`wrote ${n} station layers + 5 lab figures to`, outs.map((d) => path.relative(root, d)).join(', '));
