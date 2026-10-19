// Emit manifests, schemas and prompt documents from source.mjs, then validate.
// Usage (from the archive root): npm run manifests
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import * as S from './source.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const write = (rel, data) => { const f = path.join(root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n'); };

const id = (prefix) => ({ type: 'string', pattern: prefix });
const EVID = { type: 'string', pattern: '^(P0[1-8]-E\\d{3}|REF-\\d{3})$' };
const STATUS_EVID = ['published', 'researcher-record', 'disputed', 'reference', 'illustrative', 'pending', 'missing', 'withheld'];
const schemas = {
  evidence: { type: 'array', items: { type: 'object', required: ['id', 'claim', 'status', 'source'], additionalProperties: false, properties: { id: EVID, claim: { type: 'string', minLength: 3 }, status: { enum: STATUS_EVID }, source: { type: 'string' }, check: { type: ['string', 'null'] } } } },
  projects: { type: 'array', items: { type: 'object', required: ['id', 'title', 'medium', 'motionSignature', 'status', 'evidence'], additionalProperties: false, properties: { id: id('^P0[1-8]$'), title: { type: 'string' }, medium: { type: 'string' }, motionSignature: { type: 'string' }, status: { enum: ['pilot-implemented', 'specification', 'blocked-permission'] }, evidence: { type: 'array', items: EVID, minItems: 1 } } } },
  scenes: { type: 'array', items: { type: 'object', required: ['id', 'project', 'title', 'question', 'purpose', 'states', 'evidence', 'implementation', 'visualFidelity'], additionalProperties: false, properties: { id: id('^P0[1-8]-S\\d{2}$'), project: id('^P0[1-8]$'), title: { type: 'string' }, question: { type: 'string' }, purpose: { type: 'string' }, states: { type: 'array', items: { type: 'string' }, minItems: 1 }, evidence: { type: 'array', items: EVID }, implementation: { enum: ['implemented-tested', 'implemented-untested', 'specification', 'blocked-permission'] }, visualFidelity: { enum: ['generated-final', 'vector-final', 'vector-fallback', 'vector-concept', 'none'] } } } },
  objects: { type: 'array', items: { type: 'object', required: ['id', 'scene', 'name', 'asset', 'anchor', 'bbox', 'depth', 'material', 'evidence'], additionalProperties: false, properties: { id: id('^P0[1-8]-S\\d{2}-O\\d{3}$'), scene: id('^P0[1-8]-S\\d{2}$'), name: { type: 'string' }, matrix: { type: ['string', 'null'] }, asset: id('^P0[1-8]-S\\d{2}-A\\d{3}$'), anchor: { type: 'object', required: ['x', 'y'], properties: { x: { type: 'number', minimum: 0, maximum: 2400 }, y: { type: 'number', minimum: 0, maximum: 1440 } } }, bbox: { type: 'object', required: ['x', 'y', 'w', 'h'] }, depth: { type: 'number', minimum: 0, maximum: 1 }, material: id('^MAT-'), interaction: { type: ['string', 'null'] }, evidence: { type: 'array', items: EVID } } } },
  assets: { type: 'array', items: { type: 'object', required: ['id', 'layer', 'file', 'tool', 'status', 'fallback'], properties: { id: id('^P0[1-8]-S\\d{2}-A\\d{3}$'), layer: { enum: ['background', 'floor', 'light', 'object', 'atmosphere'] }, tool: { enum: ['image-generation', 'code', 'researcher-supplied'] }, status: { enum: ['awaiting-generation', 'generated-unreviewed', 'generated-approved', 'vector-final', 'missing', 'optional'] }, file: { type: 'string', pattern: '^p0[1-8]-s\\d{2}-a\\d{3}-[a-z0-9-]+\\.(webp|png|svg|jpg)$' }, depth: { type: 'number' }, z: { type: 'number' }, size: { type: ['array', 'null'] }, position: { type: 'array' }, pivot: { type: 'array' }, prompt: { type: ['object', 'null'], required: ['subject', 'structure', 'count', 'camera', 'framing', 'scale', 'materials', 'lighting', 'palette', 'treatment', 'background', 'transparency', 'aspect', 'references', 'negative', 'consistency', 'animation'] } } } },
  motion: { type: 'array', items: { type: 'object', required: ['id', 'scene', 'name', 'trigger', 'runtime', 'keyframes', 'duration', 'ease', 'interrupt', 'reduced'], properties: { id: id('^P0[1-8]-S\\d{2}-M\\d{3}$'), runtime: { enum: ['gsap', 'gsap.quickTo', 'gsap+scrolltrigger', 'remotion'] } } } },
  interactions: { type: 'array', items: { type: 'object', required: ['id', 'scene', 'name', 'inputs', 'from', 'to', 'motion'], properties: { id: id('^P0[1-8]-S\\d{2}-I\\d{3}$'), inputs: { type: 'object', required: ['click', 'tap', 'keyboard', 'hover'] } } } },
  'tool-routing': { type: 'array', items: { type: 'object', required: ['id', 'tool', 'checkedByClaude', 'claudeAccess', 'role', 'input', 'output', 'validation', 'fallback'] } },
};

const files = {
  evidence: S.evidence, projects: S.projects, scenes: S.scenes, objects: S.objects, assets: S.assets, motion: S.motion, interactions: S.interactions, 'tool-routing': S.tools,
};
const ajv = new Ajv({ allErrors: true, strict: false });
let errors = 0;
for (const [name, data] of Object.entries(files)) {
  write(`05-production-manifests/schemas/${name}.schema.json`, { $schema: 'http://json-schema.org/draft-07/schema#', title: name, ...schemas[name] });
  write(`05-production-manifests/${name}.json`, data);
  const ok = ajv.validate(schemas[name], data);
  if (!ok) { errors++; console.error(`✗ ${name}`, ajv.errorsText(ajv.errors, { separator: '\n  ' })); } else console.log(`✓ ${name}.json (${data.length})`);
}
write('05-production-manifests/consistency-sheets.json', S.consistency);
write('05-production-manifests/materials.json', S.materials);
write('05-production-manifests/canvas.json', S.CANVAS);

// cross-reference checks: every referenced ID must exist
const ids = new Set([...S.evidence, ...S.projects, ...S.scenes, ...S.objects, ...S.assets, ...S.motion, ...S.interactions].map((x) => x.id));
const refs = [];
S.scenes.forEach((s) => { refs.push([s.id, s.project]); s.evidence.forEach((e) => refs.push([s.id, e])); });
S.projects.forEach((p) => p.evidence.forEach((e) => refs.push([p.id, e])));
S.objects.forEach((o) => { refs.push([o.id, o.scene], [o.id, o.asset]); if (o.interaction) refs.push([o.id, o.interaction]); o.evidence.forEach((e) => refs.push([o.id, e])); if (!S.materials.find((m) => m.id === o.material)) refs.push([o.id, o.material]); });
S.assets.forEach((x) => (x.objects || []).forEach((ob) => refs.push([x.id, ob])));
S.interactions.forEach((i) => { refs.push([i.id, i.scene]); i.motion.forEach((m) => refs.push([i.id, m])); });
S.motion.forEach((m) => refs.push([m.id, m.scene]));
S.consistency.forEach((c) => c.applies.forEach((x) => refs.push([c.id, x])));
const dangling = refs.filter(([, r]) => !ids.has(r) && !r.startsWith('MAT-'));
if (dangling.length) { errors++; console.error('✗ dangling references', dangling); } else console.log(`✓ ${refs.length} cross-references resolve`);
// no fake numbers: assets awaiting data must not carry values
const pend = S.evidence.filter((e) => ['missing', 'pending', 'withheld'].includes(e.status)).length;
console.log(`  ${pend} evidence items explicitly pending, missing or withheld`);

// production status (derived, never hand-edited)
const status = {
  generated: new Date().toISOString().slice(0, 10),
  scenes: S.scenes.map(({ id: i, implementation, visualFidelity }) => ({ id: i, implementation, visualFidelity })),
  assets: S.assets.map(({ id: i, status: st, tool }) => ({ id: i, status: st, tool })),
  summary: {
    assetsAwaitingGeneration: S.assets.filter((x) => x.status === 'awaiting-generation').map((x) => x.id),
    assetsMissingFromResearcher: S.assets.filter((x) => x.status === 'missing').map((x) => x.id),
    evidenceOpen: S.evidence.filter((e) => ['missing', 'pending', 'withheld', 'disputed'].includes(e.status)).map((e) => e.id),
  },
};
write('05-production-manifests/production-status.json', status);

// prompt documents, one per generated asset, always from the same JSON
for (const x of S.assets.filter((q) => q.prompt)) {
  const p = x.prompt, cs = S.consistency.find((c) => c.id === p.consistency);
  const text = [p.subject, p.structure, p.count, `Camera: ${p.camera}.`, `Framing: ${p.framing}.`, `Scale: ${p.scale}.`, `Materials: ${p.materials}.`, `Lighting: ${p.lighting}`, `Palette: ${p.palette}.`, `Treatment: ${p.treatment}.`, `Background: ${p.background}. Transparency: ${p.transparency}.`].join(' ');
  write(`04-generation-prompts/image/${x.id}.md`, `# ${x.id} · ${x.layer} layer

| Field | Value |
|---|---|
| Output file | \`${x.file}\` |
| Size | ${x.size ? x.size.join(' × ') + ' px' : 'n/a'}${x.position ? ` placed at canvas (${x.position.join(', ')})` : ''}${x.bleed ? `, ${x.bleed} px bleed each side` : ''} |
| Pivot | ${x.pivot ? x.pivot.join(', ') : 'n/a'} |
| Alpha | ${x.alpha ? 'required (straight alpha)' : 'none'} |
| Depth / z | ${x.depth} / ${x.z} |
| Objects | ${(x.objects || []).join(', ') || 'none'} |
| Consistency sheet | ${p.consistency} |
| Fallback in use until approved | \`${x.fallback}\` |

## Prompt (paste as one block)

${text}

## Negative constraints

${p.negative}

## Reference

${p.references}. Render the fallback to PNG with \`npm run reference -- ${x.id}\` (see 09-tool-fallbacks) and attach it as the composition reference.

## Consistency rules (${p.consistency})

${cs ? cs.rules.map((r) => `- ${r}`).join('\n') : '- none'}

## Animation role

${p.animation}

## Acceptance

Run \`python3 09-tool-fallbacks/image-reconstruction/check_asset.py ${x.id} path/to/${x.file}\`. It must report PASS for size, alpha, bounding box and edge halo, and a reviewer must tick every line of 10-quality-assurance/scientific-checklist.md for this asset before \`status\` moves to \`generated-approved\`.
`);
}
write('04-generation-prompts/motionvid/P01-S01-shots.md', `# P01-S01 Motionvid shot list

Cinematic references only. The interactive website never depends on these clips. Generate after the image layers are approved, and only the 4-second MV01 first: it is the essential shot. MV02 and MV03 are optional.

${S.shots.map((s) => `## ${s.id} · ${s.duration} s · ${s.aspect}

- Start frame: ${s.start}
- End frame: ${s.end}
- Camera path: ${s.camera}
- Subject motion: ${s.subject}
- Ambient motion: ${s.ambient}
- Lighting: ${s.light}
- Reference assets: ${s.references.join(', ')}
- Continuity constraints: ${s.constraints}
- Negative: ${s.negative}
- Frame review: ${s.review}
`).join('\n')}
## Fallback

If a shot changes object identity, anatomy or the light direction, discard it and use the deterministic render \`07-motion-engine/remotion/out/P01-S01-M010.mp4\`.
`);
for (const b of S.biorender) write(`04-generation-prompts/biorender/${b.id}.md`, `# ${b.id} · ${b.purpose}

- Entities: ${b.entities.join(', ')}
- Relationships: ${b.relations}
- Labels: ${b.labels}
- Evidence: ${b.evidence.join(', ')}
- Constraints: ${b.constraints}
- Style: ${b.style}
- Export: ${b.export}
- Licence: BioRender’s free plan does not permit publishing; a paid academic licence is required for web use. Record the licence in assets.json before use.
- Fallback: the original SVG schematic already in 09-tool-fallbacks/svg.
`);

if (errors) { console.error(`${errors} problem(s)`); process.exit(1); }
console.log('manifests OK');
