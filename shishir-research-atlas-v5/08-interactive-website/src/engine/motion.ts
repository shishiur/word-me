// Motion preferences and helpers shared by every scene.
import { gsap } from 'gsap';
import { tokens } from '../../../06-design-system/tokens';
export const reduced = matchMedia('(prefers-reduced-motion: reduce)');
export const D = tokens.motion.duration;
export const E = tokens.motion.ease;
/** Duration respecting reduced motion. */
export const dur = (s: number) => (reduced.matches ? 0 : s);
export function tweenNumber(el: HTMLElement, from: number, to: number, seconds = D.base) {
  const o = { v: from };
  return gsap.to(o, { v: to, duration: dur(seconds), ease: E.reveal, overwrite: true, onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
}
const live = () => document.getElementById('live')!;
export function announce(text: string) { const l = live(); l.textContent = ''; requestAnimationFrame(() => { l.textContent = text; }); }
