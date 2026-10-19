// tokens.json → tokens.css (CSS custom properties) and tokens.ts (typed import for TS and Remotion).
import fs from 'node:fs';
const t = JSON.parse(fs.readFileSync(new URL('./tokens.json', import.meta.url)));
const lines = [];
const walk = (o, pre) => Object.entries(o).forEach(([k, v]) => (typeof v === 'object' && !Array.isArray(v) ? walk(v, `${pre}-${k}`) : lines.push(`  --${pre}-${k}: ${Array.isArray(v) ? v.join(' ') : v};`)));
walk(t.color, 'c'); walk(t.font, 'f'); walk(t.space, 's'); walk(t.radius, 'r');
Object.entries(t.motion.duration).forEach(([k, v]) => lines.push(`  --dur-${k}: ${v}s;`));
fs.writeFileSync(new URL('./tokens.css', import.meta.url), `/* Generated from tokens.json by build-tokens.mjs. Do not edit. */\n:root {\n${lines.join('\n')}\n}\n`);
fs.writeFileSync(new URL('./tokens.ts', import.meta.url), `// Generated from tokens.json by build-tokens.mjs. Do not edit.\nexport const tokens = ${JSON.stringify(t, null, 2)} as const;\n`);
console.log('tokens.css', lines.length, 'properties');
