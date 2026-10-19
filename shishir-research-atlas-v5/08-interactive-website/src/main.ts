// Boot: load manifests, mount scenes, wire the invA account switch shared by every scene.
import './styles/app.css';
import assetsJson from '../../05-production-manifests/assets.json';
import { loadGeneratedIndex, type AssetEntry } from './engine/assets';
import { mountStation } from './scenes/station';
import { mountLab } from './scenes/lab';
import { LENS, type Lens } from './data/p01';
import { renderRegister } from './engine/evidence';
import { announce } from './engine/motion';

document.documentElement.classList.add('js');
let lens: Lens = 'record';
const getLens = () => lens;

async function boot() {
  const generated = await loadGeneratedIndex('assets/p01/');
  const station = await mountStation(document.getElementById('P01-S01')!, assetsJson as AssetEntry[], generated, getLens);
  const lab = await mountLab(getLens);
  renderRegister(document.getElementById('register-body')!);

  function setLens(v: Lens) {
    lens = v;
    document.documentElement.dataset.lens = v;
    const L = LENS[v];
    document.querySelectorAll<HTMLElement>('[data-lens-text]').forEach((el) => { el.textContent = L[el.dataset.lensText as keyof typeof L]; });
    document.querySelectorAll<HTMLInputElement>('input[name="lens"]').forEach((r) => { r.checked = r.value === v; });
    document.querySelectorAll<HTMLElement>('.account').forEach((a) => a.classList.toggle('on', a.dataset.account === v));
    station.onLens(); lab.onLens();
    announce(`Reading under ${L.name}.`);
  }
  document.querySelectorAll<HTMLInputElement>('input[name="lens"]').forEach((r) => r.addEventListener('change', () => setLens(r.value as Lens)));
  document.querySelectorAll<HTMLButtonElement>('.use-lens').forEach((b) => b.addEventListener('click', () => setLens(b.dataset.lens as Lens)));
  document.querySelectorAll<HTMLElement>('.account').forEach((a) => a.classList.toggle('on', a.dataset.account === lens));

  // test and debugging hook (read-only snapshots plus the same commands the UI uses)
  (window as unknown as { __atlas: unknown }).__atlas = { station: () => station.machine.get(), log: station.machine.log, camera: station.camera, base: station.base, layers: () => station.resolved.map((r) => ({ id: r.asset.id, kind: r.kind, rect: r.rect })), lab: lab.state, setLens };
  document.documentElement.dataset.ready = 'true';
}
boot().catch((e) => { console.error(e); document.documentElement.dataset.ready = 'error'; });
