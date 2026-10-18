# Shishir Research Atlas: Phase 2 studio

Concept boards, storyboards and a working vertical slice for the redesigned portfolio. Nothing here is linked from the live site, and GitHub Pages deploys only from `main`.

Open `index.html` through a local server (ES modules and fonts need http):

```sh
npx http-server atlas -p 8077 -c-1      # then http://127.0.0.1:8077/
```

## Contents

| Path | What it is |
|---|---|
| `index.html` | Overview: selections, prototype previews, test results, blockers |
| `concepts/*.html` | Concept boards: two directions per experience, comparison, decision |
| `storyboards/*.html` | Six-frame illustrated storyboards with sees / does / changes |
| `slice/salmonella/` | Working P01 vertical slice (`index.html` is built; `app.js` and `app.css` are hand-written) |
| `previews/*.webp` | Desktop and mobile captures from the test run |
| `src/illus.mjs`, `src/scenes.mjs` | Illustration library: every function returns an SVG string |
| `src/p01-data.mjs` | P01 values, each with its evidence register and source |
| `src/pages/*.mjs` | Page templates |
| `tests/run.mjs` | Playwright checks and preview capture; writes `tests/results.json` |

## Build and test

```sh
node atlas/src/build.mjs                              # writes every .html page
node atlas/tests/run.mjs path/to/axe.min.js           # needs the server above
python3 atlas/tests/previews.py                       # PNG captures to WebP
node atlas/src/build.mjs                              # overview picks up results.json
```

The prototype's SVG is rendered at build time, so the page reads completely with JavaScript off; `app.js` only adds interaction.

## Evidence rules

Every value carries one register, shown by glyph shape as well as colour:

- **Published**: checked against the publisher record (Oceans 2026, EJABF 2025, Limnological Review 2025, PLOS ONE 2025).
- **Researcher record**: from the researcher's brief or his own site; not yet checked against primary files.
- **Disputed**: his sources disagree. The invA result is the only one: the latest record says 40 of 40 positive, the August 2026 site text says none interpretable. The prototype defaults to the record as a provisional account and lets the visitor switch.
- **Reference science**: method knowledge with a citation (XLD chemistry, Rahn et al. 1992, CLSI M100, Krumperman 1983, Magiorakos et al. 2012, Wright 1978).
- **Illustrative**: drawn scenes, plates and simulators. No data.
- **Awaiting evidence**: placeholders that name the missing file.

Gel bands are never drawn. Count-only marks never identify a sample or isolate. The Pond Water-Quality Assessment is excluded.
