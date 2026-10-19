// P01 study values used by the UI. Every value names its evidence ID in 05-production-manifests/evidence.json.
export type Lens = 'record' | 'site';
export const MATRICES = [
  { id: 'skin', n: 1, object: 'P01-S01-O001', name: 'Fish skin', pos: 9, of: 22, evidence: ['P01-E005'] },
  { id: 'flesh', n: 2, object: 'P01-S01-O002', name: 'Cut flesh', pos: 3, of: 22, evidence: ['P01-E005'] },
  { id: 'basket', n: 3, object: 'P01-S01-O003', name: 'Viscera-associated basket surface', pos: 8, of: 22, evidence: ['P01-E005'] },
  { id: 'water', n: 4, object: 'P01-S01-O004', name: 'Processing water', pos: null, of: 22, inferred: true, evidence: ['P01-E006', 'P01-E007'] },
  { id: 'hands', n: 5, object: 'P01-S01-O005', name: 'Handler hands', pos: null, of: 22, inferred: true, evidence: ['P01-E006', 'P01-E007'] },
  { id: 'tool', n: 6, object: 'P01-S01-O006', name: 'Cutting tool (bonti blade)', pos: null, of: 22, inferred: true, evidence: ['P01-E006', 'P01-E007'] },
  { id: 'board', n: 7, object: 'P01-S01-O007', name: 'Cutting surface', pos: null, of: 22, inferred: true, evidence: ['P01-E006', 'P01-E007'] },
] as const;
export type MatrixId = (typeof MATRICES)[number]['id'];

// Screen markers sit off-object so hotspots never cover the surface they name (canvas px).
export const MARKERS: Record<MatrixId, [number, number]> = { water: [224, 1024], hands: [636, 924], flesh: [1000, 880], skin: [1296, 880], tool: [1624, 904], basket: [2120, 940], board: [1208, 1328] };

export const FUNNEL = [
  { n: 154, label: 'linked samples', note: '11 markets × 2 processing events × 7 matrices.', evidence: 'P01-E001' },
  { n: 62, label: 'XLD-suspect candidates', note: 'Colonies with Salmonella-like appearance on XLD. Whether 62 counts samples or colonies is still to be confirmed.', evidence: 'P01-E002' },
  { n: 40, label: 'biochemically compatible isolates', note: 'Biochemical tests remove look-alikes such as Citrobacter and Proteus, which also make black-centred colonies on XLD.', evidence: 'P01-E003' },
] as const;

export const LENS: Record<Lens, { name: string; isolates: string; funnelN: string; funnelLabel: string; summary: string; detection: string }> = {
  record: { name: 'Researcher’s latest record (provisional)', isolates: 'invA-positive isolates (provisional)', funnelN: '40', funnelLabel: 'invA+ · provisional', summary: 'All 40 retained isolates were invA PCR- and gel-confirmed, according to the researcher’s latest record. The Atlas treats this as provisional until the gel photograph, controls and final thesis are checked.', detection: 'positive sample (provisional invA account)' },
  site: { name: 'Portfolio text, August 2026', isolates: 'presumptive isolates', funnelN: '0', funnelLabel: 'interpretable invA', summary: 'None of the 40 biochemically compatible isolates produced an interpretable invA-specific PCR product, according to the portfolio text published in August 2026. The findings stay presumptive.', detection: 'presumptive-positive sample' },
};

export const AGENTS = [
  { code: 'AMP', name: 'Ampicillin', r: 24, pct: 60, bp: { s: 17, r: 13 }, zone: 6, note: '' },
  { code: 'TE', name: 'Tetracycline', r: 20, pct: 50, bp: { s: 15, r: 11 }, zone: 9, note: '' },
  { code: 'CTX', name: 'Cefotaxime', r: null, pct: null, bp: { s: 26, r: 22 }, zone: 28, note: 'lower but notable' },
  { code: 'CIP', name: 'Ciprofloxacin', r: null, pct: null, bp: { s: 31, r: 20 }, zone: 33, note: 'lower but notable', bpNote: 'Salmonella-specific values' },
] as const;
export type AgentCode = (typeof AGENTS)[number]['code'];
export const AST = { isolates: 40, mdr: 14, mdrPct: 35.0, marMean: 0.267 } as const;
