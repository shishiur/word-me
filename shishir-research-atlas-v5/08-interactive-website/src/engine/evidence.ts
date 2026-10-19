// Evidence chips: every value on screen links to an entry in evidence.json; the glyph shape encodes status.
import evidence from '../../../05-production-manifests/evidence.json';
const BY = new Map(evidence.map((e) => [e.id, e]));
const LABEL: Record<string, string> = { published: 'Published', 'researcher-record': 'Researcher record', disputed: 'Disputed', reference: 'Reference science', illustrative: 'Illustrative', pending: 'Pending', missing: 'Missing', withheld: 'Withheld' };
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
export function chip(id: string, text?: string) {
  const e = BY.get(id);
  if (!e) throw new Error(`unknown evidence id ${id}`);
  return `<span class="reg reg-${e.status}" data-evidence="${id}" title="${esc(`${id}: ${e.source}`)}"><i aria-hidden="true"></i>${esc(text || LABEL[e.status])}</span>`;
}
export const chipFor = (id: string) => chip(id);
export function renderRegister(tbody: HTMLElement) {
  tbody.innerHTML = evidence.filter((e) => e.id.startsWith('P01') || e.id.startsWith('REF')).map((e) => `<tr><td><code>${e.id}</code></td><td>${esc(e.claim)}</td><td>${chip(e.id)}</td><td>${esc(e.source)}</td></tr>`).join('');
}
