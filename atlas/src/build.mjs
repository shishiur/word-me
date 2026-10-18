// Build the Research Atlas pages: node atlas/src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prototypePage } from './pages/prototype.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (rel, html) => { const f = path.join(root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); console.log('wrote', rel, `${(html.length / 1024).toFixed(0)} KB`); };

out('prototype/salmonella/index.html', prototypePage());

const pages = await import('./pages/boards.mjs').catch((e) => { if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e; return null; });
if (pages) for (const [rel, html] of pages.allPages()) out(rel, html);
