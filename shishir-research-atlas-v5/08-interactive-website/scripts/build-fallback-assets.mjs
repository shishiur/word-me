// Before dev/build: regenerate vector fallbacks, the static composite, and the generated-asset index.
// Drop an approved generated file into public/assets/p01/generated/ with its manifest filename and rerun.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
execFileSync('node', ['../09-tool-fallbacks/svg/build-layers.mjs'], { stdio: 'inherit' });
const ref = '../04-generation-prompts/image/reference/P01-S01-composite.png';
if (fs.existsSync(ref)) execFileSync('python3', ['-c', `from PIL import Image; Image.open('${ref}').convert('RGB').save('public/assets/p01/fallback/p01-s01-composite.webp', 'WEBP', quality=82)`]);
const gdir = 'public/assets/p01/generated';
fs.mkdirSync(gdir, { recursive: true });
const files = fs.readdirSync(gdir).filter((f) => /^p01-s\d{2}-a\d{3}-.*\.(png|webp)$/.test(f)).sort();
fs.writeFileSync(`${gdir}/index.json`, JSON.stringify({ note: 'Written by scripts/build-fallback-assets.mjs. Lists generated layers the site may use.', files }, null, 2) + '\n');
console.log(`generated index: ${files.length} file(s)`);
