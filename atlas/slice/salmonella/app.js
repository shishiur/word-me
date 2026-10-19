// P01 prototype behaviour. The page is complete without this file; it adds selection,
// filtering, the invA account switch and the zone simulator.
(() => {
  const D = JSON.parse(document.getElementById('p01-data').textContent);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const live = $('#live');
  const say = (t) => { live.textContent = ''; requestAnimationFrame(() => { live.textContent = t; }); };
  const S = { lens: 'record', matrix: null, market: 'all', step: 2, colony: null, disc: 'AMP', zone: {}, mdr: false };
  D.ast.agents.forEach((a) => { S.zone[a.code] = a.zone; });
  const agent = () => D.ast.agents.find((a) => a.code === S.disc);
  const mx = (id) => D.matrices.find((m) => m.id === id);
  const regChip = (k, t) => `<span class="reg reg-${k}"><i aria-hidden="true"></i>${t}</span>`;

  function tween(from, to, ms, fn) {
    if (reduce.matches || from === to || ms <= 0) { fn(to); return; }
    const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3); fn(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* invA account ------------------------------------------------------ */
  function setLens(v, announce = true) {
    S.lens = v;
    document.documentElement.dataset.lens = v;
    const L = D.lens[v];
    $$('[data-lens-text]').forEach((el) => {
      const txt = L[el.dataset.lensText];
      if (el.textContent !== txt) { el.textContent = txt; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
    });
    $$('input[name="lens"]').forEach((r) => { r.checked = r.value === v; });
    $$('.account').forEach((a) => a.classList.toggle('on', a.dataset.account === v));
    $('#claims-can').innerHTML = L.can.map((c) => `<li>${c}</li>`).join('');
    if (typeof renderMatrix === 'function' && S.matrix) renderMatrix(true);
    if (typeof renderRecord === 'function' && recN) renderRecord();
    if (announce) say(`Reading under ${L.name}. Isolates are now called ${L.isolates}.`);
  }
  $$('input[name="lens"]').forEach((r) => r.addEventListener('change', () => setLens(r.value)));
  $$('.use-lens').forEach((b) => b.addEventListener('click', () => setLens(b.dataset.lens)));

  /* chapter 1: station ------------------------------------------------- */
  const scene = $('.scene'), hole = $('.spot-hole', scene), dim = $('.spot-dim', scene), card = $('#mx-card');
  function selectMatrix(id) {
    S.matrix = S.matrix === id ? null : id;
    renderMatrix();
  }
  function renderMatrix(quiet = false) {
    const m = S.matrix && mx(S.matrix);
    scene.dataset.sel = S.matrix || '';
    $$('.leader', scene).forEach((g) => g.classList.toggle('on', g.dataset.matrix === S.matrix));
    $$('[data-matrix]').forEach((b) => { if (b.matches('button')) b.setAttribute('aria-pressed', String(b.dataset.matrix === S.matrix)); });
    if (m) {
      const [x, y] = D.targets[m.id];
      hole.style.transform = `translate(${x}px, ${y}px)`;
      dim.setAttribute('opacity', '0.64');
      const pct = m.pos == null ? null : ((m.pos / m.of) * 100).toFixed(1);
      card.innerHTML = `<p class="mx-k">Matrix ${m.n} of 7 ${m.inferred ? regChip('wait', 'Name inferred') : regChip('rec', 'Researcher record')}</p>
        <h2 class="mx-name">${m.name}</h2>
        ${pct == null ? `<p class="mx-big">—</p><p class="mx-body">Detection for this matrix is not in the current record. The site reports counts for three matrices only.</p>` : `<p class="mx-big">${m.pos}<small> of ${m.of} events</small></p><p class="mx-body">${pct}% of processing events yielded a ${S.lens === 'record' ? 'positive sample (provisional invA account)' : 'presumptive-positive sample'} from this matrix.</p>`}
        <dl class="mx-dl"><div><dt>Samples</dt><dd>22, one per processing event ${regChip('rec', 'Record')}</dd></div>
        <div><dt>Sampling method</dt><dd>awaiting thesis protocol ${regChip('wait', 'Awaiting')}</dd></div>
        ${m.inferred ? `<div><dt>Name source</dt><dd>inferred from “fish, water, handlers, tools and processing surfaces”</dd></div>` : ''}</dl>`;
      if (!quiet) say(`${m.name} selected. ${pct == null ? 'Detection not reported.' : `${m.pos} of ${m.of} events.`}`);
    } else {
      dim.setAttribute('opacity', '0');
      hole.style.transform = 'translate(-500px, -500px)';
      card.innerHTML = card.dataset.initial;
    }
    ledgerFilter();
  }
  card.dataset.initial = card.innerHTML;
  $$('.hotspot, .mx-chip, .dc-row').forEach((b) => b.addEventListener('click', () => selectMatrix(b.dataset.matrix)));

  /* chapter 2: ledger -------------------------------------------------- */
  const grid = $('.lg'), cells = $$('.lg-c', grid), status = $('#lg-status');
  function ledgerFilter() {
    const filtering = !!S.matrix || S.market !== 'all';
    grid.classList.toggle('filtering', filtering);
    let n = 0;
    cells.forEach((c) => {
      const hit = filtering && (!S.matrix || c.dataset.matrix === S.matrix) && (S.market === 'all' || c.dataset.mk === S.market);
      c.classList.toggle('hit', hit);
      if (hit) n++;
    });
    const m = S.matrix && mx(S.matrix);
    status.textContent = !filtering ? 'Showing all 154 samples.' : `${n} sample${n === 1 ? '' : 's'}: ${m ? m.name : 'all matrices'}${S.market === 'all' ? ', all markets' : `, market ${S.market.padStart(2, '0')}`}.`;
  }
  $('#mk-select').addEventListener('change', (e) => { S.market = e.target.value; ledgerFilter(); });
  $('#lg-clear').addEventListener('click', () => { S.market = 'all'; $('#mk-select').value = 'all'; if (S.matrix) selectMatrix(S.matrix); else ledgerFilter(); });
  const COLS = 22;
  cells.forEach((c, i) => {
    c.addEventListener('focus', () => { status.textContent = c.getAttribute('aria-label'); });
    c.addEventListener('click', () => { c.focus(); });
    c.addEventListener('keydown', (e) => {
      const map = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: COLS, ArrowUp: -COLS, Home: -(i % COLS), End: COLS - 1 - (i % COLS) };
      if (!(e.key in map)) return;
      e.preventDefault();
      const j = Math.max(0, Math.min(cells.length - 1, i + map[e.key]));
      c.tabIndex = -1; cells[j].tabIndex = 0; cells[j].focus();
    });
  });

  /* chapter 3: plate and attrition ------------------------------------ */
  const plate = $('.plate-wrap[data-read]'), ctext = $('#colony-text');
  const CTXT = {
    h2s: 'Red colony with a black centre. The red comes from lysine decarboxylation reversing the acid from xylose; the black is iron sulphide from H₂S. This is the Salmonella-suspect appearance, but Citrobacter and Proteus can look the same.',
    yel: 'Yellow colony with a yellow halo. The organism fermented xylose (and often lactose or sucrose) and acidified the medium. Typical of E. coli and other coliforms; not a Salmonella suspect.',
    red: 'Red colony without a black centre. No visible H₂S. Shigella grows like this, and so do the minority of Salmonella strains that are H₂S-negative, so these need biochemical follow-up rather than dismissal.',
  };
  $$('.colony').forEach((b) => b.addEventListener('click', () => {
    S.colony = S.colony === b.dataset.colony ? null : b.dataset.colony;
    plate.dataset.read = S.colony || '';
    $$('.colony').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.colony === S.colony)));
    ctext.textContent = S.colony ? CTXT[S.colony] : 'Choose a colony type to isolate it on the plate.';
  }));
  const amarks = $$('#attr-marks .mk'), attrN = $('#attr-n');
  function setStep(i, animate = true) {
    const prev = D.funnel[S.step].n;
    S.step = i;
    const f = D.funnel[i];
    amarks.forEach((m, k) => { m.style.setProperty('--d', animate ? Math.abs(k - f.n) * 2 : 0); m.classList.toggle('off', k >= f.n); });
    tween(prev, f.n, 600, (v) => { attrN.textContent = Math.round(v); });
    $('#attr-label').textContent = f.label;
    $('#attr-note').textContent = f.note;
    $$('.step').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.step === i)));
    $$('.funnel li').forEach((li) => li.classList.toggle('on', +li.dataset.step === i));
  }
  $$('.step').forEach((b) => b.addEventListener('click', () => { setStep(+b.dataset.step); say(`${D.funnel[+b.dataset.step].n} ${D.funnel[+b.dataset.step].label}`); }));

  /* chapter 5: resistance --------------------------------------------- */
  const mh = $('.mh-wrap'), zoneIn = $('#zone'), zoneOut = $('#zone-out'), read = $('#sim-read');
  const astMarks = $$('#ast-marks .mk'), recN = $('#rec-n'), mdrBox = $('#mdr');
  const zoneEls = (code) => $$(`.zone[data-disc="${code}"], .zone-rim[data-disc="${code}"]`, mh);
  function drawZone(code, mm, animate) {
    const els = zoneEls(code), from = parseFloat(els[0].getAttribute('r')), to = (mm / 2) * D.mm;
    tween(from, to, animate ? 450 : 0, (v) => els.forEach((e) => e.setAttribute('r', v.toFixed(1))));
  }
  function interpret(a, mm) {
    if (mm >= a.bp.s) return ['Susceptible', `${mm} mm is at or above the ${a.bp.s} mm breakpoint.`];
    if (mm <= a.bp.r) return ['Resistant', `${mm} mm is at or below the ${a.bp.r} mm breakpoint.`];
    return ['Intermediate', `${mm} mm falls between ${a.bp.r + 1} and ${a.bp.s - 1} mm.`];
  }
  function renderSim() {
    const a = agent(), mm = S.zone[a.code], lo = 6, hi = 40, pc = (v) => ((v - lo) / (hi - lo)) * 100;
    zoneIn.value = mm; zoneOut.textContent = `${mm} mm`;
    $('#sim-agent').textContent = a.name;
    const [cat, why] = interpret(a, mm);
    read.textContent = `${cat}: ${why}`;
    $('.bp-r').style.width = `${pc(a.bp.r + 0.5)}%`;
    $('.bp-i').style.width = `${pc(a.bp.s - 0.5) - pc(a.bp.r + 0.5)}%`;
    $('.bp-pin').style.left = `${pc(mm)}%`;
    $('#bp-note').innerHTML = `${regChip('ref', 'Reference science')} CLSI M100 disc-diffusion breakpoints for Enterobacterales${a.bpNote ? ` (${a.bpNote})` : ''}: S ≥ ${a.bp.s} mm, R ≤ ${a.bp.r} mm. Confirm the edition the thesis used.`;
  }
  function renderRecord() {
    const a = agent(), iso = D.lens[S.lens].isolates;
    recN.innerHTML = a.r == null
      ? `<b>—</b> ${a.name}: “${a.note}” resistance. The record gives no count.`
      : `<b>${a.r}</b> of 40 <span data-lens-text="isolates">${iso}</span> resistant to ${a.name.toLowerCase()} (${a.pct}%)`;
    const n = S.mdr ? D.ast.mdr : a.r ?? 0;
    astMarks.forEach((m, k) => { m.style.setProperty('--d', k * 8); m.classList.toggle('off', k >= n); m.classList.toggle('mdr', S.mdr && k < D.ast.mdr); });
    if (S.mdr) recN.innerHTML = `<b>14</b> of 40 <span data-lens-text="isolates">${iso}</span> meet the multidrug-resistance definition (35.0%)`;
  }
  function selectDisc(code) {
    S.disc = code;
    mh.dataset.disc = code;
    $$('.disc-btn, .agent').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.disc === code)));
    $$('.disc', mh).forEach((d) => { d.style.opacity = d.dataset.disc === code ? '1' : '.55'; });
    renderSim(); renderRecord();
    say(`${agent().name} selected.`);
  }
  $$('.disc-btn, .agent').forEach((b) => b.addEventListener('click', () => selectDisc(b.dataset.disc)));
  zoneIn.addEventListener('input', () => { const a = agent(); S.zone[a.code] = +zoneIn.value; drawZone(a.code, S.zone[a.code], false); renderSim(); });
  mdrBox.addEventListener('change', () => { S.mdr = mdrBox.checked; renderRecord(); });

  /* chapter rail ------------------------------------------------------ */
  const links = $$('.chapters a');
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === `#${e.target.id}`)));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section').forEach((s) => io.observe(s));

  setLens('record', false);
  setStep(2, false);
  selectDisc('AMP');
  live.textContent = '';
  window.__atlas = { S, setLens, selectMatrix, setStep, selectDisc };
})();
