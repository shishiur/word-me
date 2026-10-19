// Explicit, deterministic scene state machine: overview → object-focused → evidence-revealed → overview.
export type StationState = 'loading' | 'establishing' | 'overview' | 'object-focused' | 'evidence-revealed';
export type StationEvent =
  | { type: 'LOADED' } | { type: 'ESTABLISHED' } | { type: 'SELECT'; id: string } | { type: 'FOCUSED'; id: string } | { type: 'RESET' };
export type Snapshot = { state: StationState; selected: string | null };

/** Pure transition function. Unknown events leave the snapshot unchanged. */
export function transition(s: Snapshot, e: StationEvent): Snapshot {
  switch (e.type) {
    case 'LOADED': return s.state === 'loading' ? { state: 'establishing', selected: null } : s;
    case 'ESTABLISHED': return s.state === 'establishing' ? { state: 'overview', selected: null } : s;
    case 'SELECT': return s.state === 'loading' ? s : { state: 'object-focused', selected: e.id };
    case 'FOCUSED': return s.state === 'object-focused' && s.selected === e.id ? { state: 'evidence-revealed', selected: e.id } : s; // stale completions are ignored
    case 'RESET': return s.state === 'object-focused' || s.state === 'evidence-revealed' ? { state: 'overview', selected: null } : s;
  }
}

export function createMachine(onChange: (next: Snapshot, prev: Snapshot, e: StationEvent) => void) {
  let snap: Snapshot = { state: 'loading', selected: null };
  const log: string[] = [];
  return {
    get: () => snap,
    log,
    send(e: StationEvent) {
      const prev = snap, next = transition(snap, e);
      if (next === prev) return;
      snap = next;
      log.push(`${prev.state}→${next.state}${next.selected ? `(${next.selected})` : ''}`);
      onChange(next, prev, e);
    },
  };
}
