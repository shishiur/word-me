# Implementation sequence

1. `npm install` at the archive root, in `08-interactive-website` and in `07-motion-engine/remotion`.
2. `npm run manifests` (root): emits and validates every JSON file; regenerates prompt documents.
3. `npm run fallbacks` (root) and `npm run reference` (root): vector layers and reference renders.
4. `cd 08-interactive-website && npm run build && npm run preview`, then `npm test` in a second shell.
5. Produce assets in the order of `asset-production-order.md`; integrate per `asset-to-code-contract.md`.
6. `cd 07-motion-engine/remotion && npm run render -- --browser-executable=<chrome-headless-shell>` (Remotion downloads one if the network allows).
7. Expand to P02 using the same conventions (`03-scene-specifications/P02`).
8. Integration into the live portfolio happens only on explicit approval: build into a sub-path (`/atlas/`) on a branch, preview, then merge. Rollback = revert the merge commit; the existing `index.html` is untouched by this work.
