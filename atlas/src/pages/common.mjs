// Shared page fragments for the Research Atlas.
import { esc } from '../illus.mjs';

export const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&display=swap">`;

export const REGS = {
  pub: ['Published', 'Checked against the publisher record'],
  rec: ['Researcher record', 'Supplied by the researcher; not yet checked against primary files'],
  disp: ['Disputed', 'The researcher’s own sources disagree'],
  ref: ['Reference science', 'Method or textbook knowledge, not this study’s data'],
  ill: ['Illustrative', 'Drawn scene; no data'],
  wait: ['Awaiting evidence', 'Placeholder until the named file arrives'],
};
export const reg = (k, text) => `<span class="reg reg-${k}" title="${esc(REGS[k][1])}"><i aria-hidden="true"></i>${esc(text || REGS[k][0])}</span>`;

export function page({ title, desc, body, depth = 1, cls = '' }) {
  const up = depth ? '../'.repeat(depth) : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(desc)}">
${fonts}
<link rel="stylesheet" href="${up}assets/atlas.css">
</head>
<body class="${cls}">
${body}
</body>
</html>`;
}

export const nav = (depth, current) => {
  const up = '../'.repeat(depth);
  const items = [['index.html', 'Overview'], ['concepts/salmonella.html', 'Concepts'], ['storyboards/salmonella.html', 'Storyboards'], ['prototype/salmonella/index.html', 'Prototype']];
  return `<header class="site"><div class="wrap site-row"><a class="mark" href="${up}index.html">Shishir Research Atlas <span>Phase 2 studio</span></a><nav aria-label="Atlas">${items.map(([h, l]) => `<a href="${up}${h}"${l === current ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav></div></header>`;
};

export const subnav = (depth, kind, current) => {
  const up = '../'.repeat(depth);
  const list = [['salmonella', 'P01 Salmonella & AMR'], ['hilsa', 'P02 Hilsa genetics'], ['pabda', 'P05 Pabda microbiology'], ['evolution', 'Research Evolution']];
  return `<nav class="subnav wrap" aria-label="${kind === 'concepts' ? 'Concept boards' : 'Storyboards'}">${list.map(([k, l]) => `<a href="${up}${kind}/${k}.html"${k === current ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>`;
};
