// P01-S03 laboratory workflow, P01-S04 molecular confirmation, P01-S05 antimicrobial susceptibility.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FUNNEL, LENS, AGENTS, AST, type Lens, type AgentCode } from '../data/p01';
import { dur, D, E, reduced, tweenNumber, announce } from '../engine/motion';
import { chip } from '../engine/evidence';

gsap.registerPlugin(ScrollTrigger);
const $ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector<T>(s)!;
const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)];
const MM = 292 / 45; // plate radius 292 user units = 45 mm

async function inlineSvg(img: HTMLImageElement) {
  try {
    const txt = await (await fetch(img.src)).text();
    const box = document.createElement('div'); box.innerHTML = txt;
    const svg = box.querySelector('svg')!; svg.classList.add('ill'); svg.removeAttribute('width'); svg.removeAttribute('height');
    img.replaceWith(svg); return svg;
  } catch { return null; }
}

export async function mountLab(getLens: () => Lens) {
  /* S03: market → bench transition (P01-S03-M007), reversible with scroll */
  const header = $('#top');
  ScrollTrigger.create({ trigger: '#P01-S03', start: 'top 60%', onToggle: (st) => { header.dataset.mode = st.isActive || st.progress > 0 ? 'bench' : 'night'; }, onLeaveBack: () => { header.dataset.mode = 'night'; } });
  if (!reduced.matches) gsap.fromTo('#P01-S03 .plate-wrap', { y: 80, opacity: 0.25 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '#P01-S03', start: 'top 85%', end: 'top 35%', scrub: true } });

  const xld = await inlineSvg($<HTMLImageElement>('#P01-S03 img.plate-src'));
  const wrap = $('#P01-S03 .plate-wrap');
  const CTXT: Record<string, string> = {
    h2s: 'Red colony with a black centre. The red comes from lysine decarboxylation reversing the acid from xylose; the black is iron sulphide from H₂S. This is the Salmonella-suspect appearance, but Citrobacter and Proteus can look the same.',
    yel: 'Yellow colony with a yellow halo. The organism fermented xylose, lactose or sucrose and acidified the medium. Typical of E. coli and other coliforms; not a Salmonella suspect.',
    red: 'Red colony without a black centre. No visible H₂S. Shigella grows like this, and so do the minority of Salmonella strains that are H₂S-negative, so these need biochemical follow-up.',
  };
  let colony: string | null = null;
  $$<HTMLButtonElement>('.colony').forEach((b) => b.addEventListener('click', () => {
    colony = colony === b.dataset.colony ? null : b.dataset.colony!;
    wrap.dataset.read = colony || '';
    $$('.colony').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.colony === colony)));
    $('#colony-text').textContent = colony ? CTXT[colony] : 'Choose a colony type to isolate it on the plate.';
    if (xld) gsap.to(xld.querySelectorAll('[data-colony]'), { opacity: (_i: number, el: Element) => (!colony || el.getAttribute('data-colony') === colony ? 1 : 0.1), duration: dur(D.fast), overwrite: true });
  }));

  // sieve (P01-S03-I003 / M008)
  const marksBox = $('#attr-marks');
  marksBox.innerHTML = Array.from({ length: 154 }, () => '<i class="mk"></i>').join('');
  const marks = $$('#attr-marks .mk');
  let step = 2;
  function setStep(i: number) {
    const prev = FUNNEL[step].n; step = i; const f = FUNNEL[i];
    gsap.to(marks, { opacity: (k: number) => (k < f.n ? 1 : 0.22), scale: (k: number) => (k < f.n ? 1 : 0.8), duration: dur(0.35), stagger: { each: reduced.matches ? 0 : 0.003, from: 'end' }, overwrite: true });
    marks.forEach((m, k) => m.classList.toggle('off', k >= f.n));
    tweenNumber($('#attr-n'), prev, f.n, D.base);
    $('#attr-label').textContent = f.label; $('#attr-note').textContent = f.note;
    $('#attr-chip').innerHTML = chip(f.evidence);
    $$('.step').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.step) === i)));
    $$('.funnel li').forEach((li) => li.classList.toggle('on', Number(li.dataset.step) === i));
  }
  $$<HTMLButtonElement>('.step').forEach((b) => b.addEventListener('click', () => { setStep(Number(b.dataset.step)); announce(`${FUNNEL[step].n} ${FUNNEL[step].label}`); }));
  setStep(2);

  /* S04: inline figures */
  await Promise.all($$<HTMLImageElement>('#P01-S04 img[data-inline]').map(inlineSvg));

  /* S05: zone simulator (I006 / M009) and recorded counts (I007) */
  const mh = await inlineSvg($<HTMLImageElement>('#P01-S05 img.plate-src'));
  const zone: Record<string, number> = Object.fromEntries(AGENTS.map((a) => [a.code, a.zone]));
  let agent: AgentCode = 'AMP', mdr = false;
  const astMarks = $('#ast-marks');
  astMarks.innerHTML = Array.from({ length: 40 }, () => '<i class="mk"></i>').join('');
  const am = $$('#ast-marks .mk');
  const ag = () => AGENTS.find((a) => a.code === agent)!;
  function drawZone(code: string, mm: number, animate: boolean) {
    if (!mh) return;
    const els = mh.querySelectorAll(`.zone[data-disc="${code}"], .zone-rim[data-disc="${code}"]`);
    gsap.to(els, { attr: { r: (mm / 2) * MM }, duration: animate ? dur(0.35) : 0, ease: E.reveal, overwrite: true });
  }
  function interpret(mm: number) {
    const a = ag();
    if (mm >= a.bp.s) return `Susceptible: ${mm} mm is at or above the ${a.bp.s} mm breakpoint.`;
    if (mm <= a.bp.r) return `Resistant: ${mm} mm is at or below the ${a.bp.r} mm breakpoint.`;
    return `Intermediate: ${mm} mm falls between ${a.bp.r + 1} and ${a.bp.s - 1} mm.`;
  }
  function renderAst() {
    const a = ag(), mm = zone[agent], pc = (v: number) => ((v - 6) / 34) * 100, iso = LENS[getLens()].isolates;
    const input = $<HTMLInputElement>('#zone'); input.value = String(mm);
    $('#zone-out').textContent = `${mm} mm`; $('#sim-agent').textContent = a.name; $('#sim-read').textContent = interpret(mm);
    $('.bp-r').style.width = `${pc(a.bp.r + 0.5)}%`; $('.bp-i').style.width = `${pc(a.bp.s - 0.5) - pc(a.bp.r + 0.5)}%`; $('.bp-pin').style.left = `${pc(mm)}%`;
    $('#bp-note').innerHTML = `${chip('REF-003')} CLSI M100 disc-diffusion breakpoints for Enterobacterales${'bpNote' in a ? ` (${a.bpNote})` : ''}: S ≥ ${a.bp.s} mm, R ≤ ${a.bp.r} mm.`;
    const n = mdr ? AST.mdr : a.r ?? 0;
    $('#rec-n').innerHTML = mdr ? `<b>${AST.mdr}</b> of ${AST.isolates} ${iso} meet the multidrug-resistance definition (${AST.mdrPct.toFixed(1)}%) ${chip('P01-E010')}`
      : a.r == null ? `<b>—</b> ${a.name}: “${a.note}” resistance; the record gives no count ${chip('P01-E009')}` : `<b>${a.r}</b> of ${AST.isolates} ${iso} resistant to ${a.name.toLowerCase()} (${a.pct}%) ${chip('P01-E008')}`;
    gsap.to(am, { opacity: (k: number) => (k < n ? 1 : 0.22), duration: dur(0.3), stagger: reduced.matches ? 0 : 0.008, overwrite: true });
    am.forEach((m, k) => { m.classList.toggle('off', k >= n); m.classList.toggle('mdr', mdr && k < AST.mdr); });
    $$('.agent, .disc-btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.disc === agent)));
    mh?.querySelectorAll<SVGGElement>('.disc').forEach((d) => { d.style.opacity = d.dataset.disc === agent ? '1' : '.55'; });
  }
  $$<HTMLButtonElement>('.agent, .disc-btn').forEach((b) => b.addEventListener('click', () => { agent = b.dataset.disc as AgentCode; renderAst(); announce(`${ag().name} selected.`); }));
  $<HTMLInputElement>('#zone').addEventListener('input', (e) => { zone[agent] = Number((e.target as HTMLInputElement).value); drawZone(agent, zone[agent], true); renderAst(); });
  $<HTMLInputElement>('#mdr').addEventListener('change', (e) => { mdr = (e.target as HTMLInputElement).checked; renderAst(); });
  renderAst();
  return { onLens: renderAst, setStep, state: () => ({ step, colony, agent, mdr, zone: { ...zone } }) };
}
