// Negative tests: the manifest schemas must reject invented statuses, malformed IDs and missing prompt fields.
import fs from 'node:fs';
import Ajv from 'ajv';
const load = (n) => JSON.parse(fs.readFileSync(new URL(`../../05-production-manifests/schemas/${n}.schema.json`, import.meta.url)));
const ajv = new Ajv({ strict: false });
const cases = [
  ['evidence', [{ id: 'P01-E099', claim: 'invA confirmed', status: 'verified', source: 'x' }], 'unknown status "verified"'],
  ['objects', [{ id: 'P01-O1', scene: 'P01-S01', name: 'x', asset: 'P01-S01-A010', anchor: { x: 1, y: 1 }, bbox: { x: 0, y: 0, w: 1, h: 1 }, depth: 0.5, material: 'MAT-X', evidence: [] }], 'malformed object ID'],
  ['assets', [{ id: 'P01-S01-A099', layer: 'object', file: 'p01-s01-a099-x.png', tool: 'image-generation', status: 'awaiting-generation', fallback: 'x', prompt: { subject: 'fish' } }], 'prompt missing required fields'],
  ['objects', [{ id: 'P01-S01-O099', scene: 'P01-S01', name: 'x', asset: 'P01-S01-A010', anchor: { x: 9999, y: 1 }, bbox: { x: 0, y: 0, w: 1, h: 1 }, depth: 0.5, material: 'MAT-X', evidence: [] }], 'anchor outside the canvas'],
];
let bad = 0;
for (const [name, data, why] of cases) { const ok = ajv.validate(load(name), data); console.log(ok ? 'FAIL (accepted)' : 'PASS (rejected)', name, '·', why); bad += ok; }
process.exit(bad ? 1 : 0);
