// P01-S01 / P01-S02: layered fish-processing station with a state-driven focus camera.
import { gsap } from 'gsap';
import { baseTransform, focusTransform, toScreen, parallax, flicker, FRAMING, CANVAS, type Xf } from '../../../07-motion-engine/shared/stage';
import { createMachine, type Snapshot } from '../engine/machine';
import { resolve, preload, type AssetEntry, type Resolved } from '../engine/assets';
import { reduced, dur, D, E, announce } from '../engine/motion';
import { MATRICES, MARKERS, LENS, type Lens, type MatrixId } from '../data/p01';
import { chip, chipFor } from '../engine/evidence';
import objectsJson from '../../../05-production-manifests/objects.json';
import motionJson from '../../../05-production-manifests/motion.json';

type Obj = (typeof objectsJson)[number];
const M = Object.fromEntries(motionJson.map((m) => [m.id, m]));
const SVGNS = 'http://www.w3.org/2000/svg';

export async function mountStation(root: HTMLElement, assets: AssetEntry[], generated: Set<string>, getLens: () => Lens) {
  const stage = root.querySelector<HTMLElement>('.stage')!;
  const world = document.createElement('div');
  world.className = 'world';
  world.style.width = `${CANVAS.w}px`; world.style.height = `${CANVAS.h}px`;
  stage.querySelector('.stage-static')?.remove();
  stage.prepend(world);

  // layers, sorted by z; each knows which object IDs it carries
  const station = assets.filter((a) => a.id.startsWith('P01-S01')).sort((a, b) => (a.z ?? 0) - (b.z ?? 0));
  const resolved: Resolved[] = station.map((a) => resolve(a, 'assets/p01/', generated));
  const layerEls = new Map<string, HTMLElement>();
  await Promise.all(resolved.map((r) => preload(r.src)));
  for (const r of resolved) {
    const el = document.createElement('div');
    el.className = `layer layer-${r.asset.layer}`;
    el.dataset.asset = r.asset.id; el.dataset.kind = r.kind;
    Object.assign(el.style, { left: `${r.rect.x}px`, top: `${r.rect.y}px`, width: `${r.rect.w}px`, height: `${r.rect.h}px` });
    const img = new Image(); img.src = r.src; img.alt = ''; img.decoding = 'async'; img.draggable = false;
    el.append(img); world.append(el); layerEls.set(r.asset.id, el);
  }
  const genCount = resolved.filter((r) => r.kind === 'generated').length;
  const needGen = station.filter((a) => a.status !== 'vector-final').length;
  const badge = root.querySelector<HTMLElement>('.fidelity')!;
  badge.dataset.generated = String(genCount);
  badge.textContent = genCount === 0 ? `Vector fallback · 0 of ${needGen} generated layers` : `${genCount} of ${needGen} generated layers · rest vector`;

  // overlays in screen space
  const spot = document.createElement('div'); spot.className = 'spot'; stage.append(spot);
  const svg = document.createElementNS(SVGNS, 'svg'); svg.classList.add('leaders'); svg.setAttribute('aria-hidden', 'true'); stage.append(svg);
  const hot = document.createElement('div'); hot.className = 'hotspots'; stage.append(hot);
  const objects = new Map<string, Obj>(objectsJson.map((o) => [o.id, o]));
  const buttons = new Map<MatrixId, HTMLButtonElement>();
  const lines = new Map<MatrixId, SVGLineElement>();
  for (const m of MATRICES) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'hotspot'; b.dataset.matrix = m.id; b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `<span aria-hidden="true">${m.n}</span><span class="sr">${m.name}</span>`;
    hot.append(b); buttons.set(m.id, b);
    const l = document.createElementNS(SVGNS, 'line'); l.dataset.matrix = m.id; svg.append(l); lines.set(m.id, l);
  }
  const chips = [...root.querySelectorAll<HTMLButtonElement>('.mx-chip')];
  const panel = root.querySelector<HTMLElement>('.mx-card')!;
  const initialPanel = panel.innerHTML;

  // camera
  const isMobile = () => stage.clientWidth < 620;
  const base = () => baseTransform(stage.clientWidth, stage.clientHeight, isMobile() ? { x: 1180, y: 1000 } : { x: 1200, y: 760 }, { x: 0.5, y: 0.5 });
  const cam: Xf = { ...base() };
  const pointer = { x: 0, y: 0 };
  function apply() {
    world.style.transform = `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`;
    for (const r of resolved) {
      const p = parallax(r.asset.depth ?? 0, pointer.x, pointer.y);
      layerEls.get(r.asset.id)!.style.translate = `${p.x}px ${p.y}px`;
    }
    const W = stage.clientWidth, H = stage.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    for (const m of MATRICES) {
      const t = toScreen(objects.get(m.object)!.anchor, cam), mk = toScreen({ x: MARKERS[m.id][0], y: MARKERS[m.id][1] }, cam);
      // markers outside the visible stage are hidden (never stacked at the edge); the chip row still reaches them
      const mx = Math.min(W - 22, Math.max(22, mk.x)), my = Math.min(H - 22, Math.max(22, mk.y));
      const visible = Math.abs(mx - mk.x) < 30 && Math.abs(my - mk.y) < 30 && t.x > 0 && t.x < W && t.y > 0 && t.y < H;
      const b = buttons.get(m.id)!; b.style.left = `${mx}px`; b.style.top = `${my}px`; b.hidden = !visible;
      const l = lines.get(m.id)!; l.setAttribute('x1', String(mx)); l.setAttribute('y1', String(my)); l.setAttribute('x2', String(t.x)); l.setAttribute('y2', String(t.y)); l.style.display = visible ? '' : 'none';
    }
    if (snap().selected) {
      const t = toScreen(objects.get(MATRICES.find((m) => m.id === snap().selected)!.object)!.anchor, cam);
      spot.style.setProperty('--sx', `${t.x}px`); spot.style.setProperty('--sy', `${t.y}px`);
    }
  }
  let camTween: gsap.core.Tween | null = null;
  function moveTo(target: Xf, seconds: number, ease: string, done?: () => void) {
    camTween?.kill();
    if (seconds === 0) { Object.assign(cam, target); apply(); done?.(); return; }
    camTween = gsap.to(cam, { ...target, duration: seconds, ease, onUpdate: apply, onComplete: () => { camTween = null; done?.(); } });
  }
  const focusFor = (id: MatrixId) => { const f = isMobile() ? FRAMING.mobile : FRAMING.desktop; return focusTransform(stage.clientWidth, stage.clientHeight, objects.get(MATRICES.find((m) => m.id === id)!.object)!.anchor, f.zoom, f.at); };

  // state machine drives every visual change
  const machine = createMachine(render);
  const snap = () => machine.get();
  function render(next: Snapshot, prev: Snapshot) {
    root.dataset.state = next.state;
    const sel = next.selected as MatrixId | null;
    for (const [id, b] of buttons) b.setAttribute('aria-pressed', String(id === sel));
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.matrix === sel)));
    lines.forEach((l, id) => l.classList.toggle('on', id === sel));
    const targetAsset = sel ? objects.get(MATRICES.find((m) => m.id === sel)!.object)!.asset : null;
    layerEls.forEach((el, aid) => el.classList.toggle('dim', !!sel && aid !== targetAsset && station.find((a) => a.id === aid)!.layer === 'object'));
    if (next.state === 'object-focused' && sel && (prev.selected !== sel || prev.state !== 'object-focused')) {
      gsap.to(spot, { opacity: 1, duration: dur(D.base), ease: E.reveal, overwrite: true });
      moveTo(focusFor(sel), dur(Number(M['P01-S02-M004'].duration)), String(M['P01-S02-M004'].ease), () => machine.send({ type: 'FOCUSED', id: sel }));
      panel.dataset.pending = 'true';
    }
    if (next.state === 'evidence-revealed' && sel) { renderPanel(sel); panel.dataset.pending = 'false'; if (focusAfterMove === sel) { focusAfterMove = null; buttons.get(sel)!.focus({ preventScroll: true }); } }
    if (next.state === 'overview' && (prev.state === 'object-focused' || prev.state === 'evidence-revealed')) {
      gsap.to(spot, { opacity: 0, duration: dur(D.fast), overwrite: true });
      moveTo(base(), dur(Number(M['P01-S02-M006'].duration)), String(M['P01-S02-M006'].ease));
      panel.innerHTML = initialPanel; panel.dataset.pending = 'false';
      announce('Overview of the station.');
    }
  }
  function renderPanel(id: MatrixId) {
    const m = MATRICES.find((x) => x.id === id)!, lens = LENS[getLens()];
    const pct = m.pos == null ? null : ((m.pos / m.of) * 100).toFixed(1);
    panel.innerHTML = `<p class="k">Matrix ${m.n} of 7 · ${m.object}</p><h3 class="mx-name">${m.name}</h3>
      ${pct == null ? `<p class="big">—</p><p class="mx-body">Detection for this matrix is not in the current record. Counts exist for three matrices only.</p>` : `<p class="big">${m.pos}<small> of ${m.of} events</small></p><p class="mx-body">${pct}% of processing events yielded a ${lens.detection} from this matrix.</p>`}
      <dl class="mx-dl"><div><dt>Samples</dt><dd>22, one per processing event ${chip('P01-E001')}</dd></div>
      <div><dt>This value</dt><dd>${m.evidence.map(chipFor).join(' ')}</dd></div>
      <div><dt>Sampling method</dt><dd>awaiting thesis protocol ${chip('P01-E014')}</dd></div></dl>
      <button type="button" class="ghost reset">Back to the whole station <kbd>Esc</kbd></button>`;
    panel.querySelector<HTMLButtonElement>('.reset')!.addEventListener('click', () => machine.send({ type: 'RESET' }));
    announce(`${m.name}. ${pct == null ? 'Detection not reported.' : `${m.pos} of ${m.of} events.`}`);
  }
  let focusAfterMove: MatrixId | null = null; // keyboard focus follows the camera once the target hotspot is on screen
  const select = (id: MatrixId) => { endEstablishing(); machine.send({ type: 'SELECT', id }); };
  buttons.forEach((b, id) => b.addEventListener('click', () => select(id)));
  chips.forEach((c) => c.addEventListener('click', () => select(c.dataset.matrix as MatrixId)));
  root.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
    const n = Number(e.key);
    if (n >= 1 && n <= 7) { select(MATRICES[n - 1].id); e.preventDefault(); }
    else if (e.key === 'Escape') { machine.send({ type: 'RESET' }); }
    else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && snap().selected) {
      const i = MATRICES.findIndex((m) => m.id === snap().selected), j = (i + (e.key === 'ArrowRight' ? 1 : 6)) % 7;
      focusAfterMove = MATRICES[j].id; select(MATRICES[j].id); e.preventDefault();
    }
  });

  // pointer parallax (P01-S01-M003), disabled under reduced motion and while focused
  const qx = gsap.quickTo(pointer, 'x', { duration: 0.6, ease: 'power3.out', onUpdate: apply });
  const qy = gsap.quickTo(pointer, 'y', { duration: 0.6, ease: 'power3.out', onUpdate: apply });
  stage.addEventListener('pointermove', (e) => {
    if (reduced.matches || e.pointerType !== 'mouse' || snap().selected) return;
    const r = stage.getBoundingClientRect(); qx(((e.clientX - r.left) / r.width - 0.5) * 2); qy(((e.clientY - r.top) / r.height - 0.5) * 2);
  });
  stage.addEventListener('pointerleave', () => { qx(0); qy(0); });

  // establishing dolly (M001) + bulb flicker (M002)
  let establishing: gsap.core.Timeline | null = null;
  function endEstablishing() { const tl = establishing; if (!tl) return; establishing = null; tl.progress(1); tl.kill(); }
  machine.send({ type: 'LOADED' });
  const light = layerEls.get('P01-S01-A003')!;
  if (reduced.matches) { Object.assign(cam, base()); apply(); machine.send({ type: 'ESTABLISHED' }); }
  else {
    const start = focusTransform(stage.clientWidth, stage.clientHeight, { x: 980, y: 520 }, 1.18, { x: 0.5, y: 0.45 });
    Object.assign(cam, start); apply();
    const f = { u: 0 };
    establishing = gsap.timeline({ onComplete: () => { establishing = null; machine.send({ type: 'ESTABLISHED' }); } })
      .to(f, { u: 1, duration: Number(M['P01-S01-M002'].duration), ease: 'none', onUpdate: () => { light.style.opacity = String(flicker(f.u)); } }, 0)
      .to(cam, { ...base(), duration: Number(M['P01-S01-M001'].duration), ease: String(M['P01-S01-M001'].ease), onUpdate: apply }, 0.3);
    stage.addEventListener('wheel', endEstablishing, { once: true, passive: true });
  }

  new ResizeObserver(() => {
    if (establishing) endEstablishing();
    const sel = snap().selected as MatrixId | null;
    Object.assign(cam, sel ? focusFor(sel) : base()); apply();
  }).observe(stage);
  reduced.addEventListener('change', () => { qx(0); qy(0); });

  return { machine, onLens: () => { const s = snap(); if (s.state === 'evidence-revealed' && s.selected) renderPanel(s.selected as MatrixId); }, camera: () => ({ ...cam }), base, resolved };
}
