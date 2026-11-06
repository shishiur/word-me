#!/usr/bin/env bash
set -euo pipefail
export LC_ALL=C.UTF-8 LANG=C.UTF-8
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
B="$ROOT/build"; F="$ROOT/figures"; P="$ROOT/proof"
export NODE_PATH="$(npm root -g)"
cd "$B"
python3 fig_cover.py "$F/cover_haor.svg"
python3 figs_core.py "$F"
node render.js png "$F/cover_haor.svg" "$F/cover_haor.png" 2480
python3 -c "from PIL import Image;Image.open('$F/cover_haor.png').convert('RGB').save('$F/cover_haor.jpg',quality=88,dpi=(300,300))"
for f in "$F"/fig_*.svg; do node render.js png "$f" "${f%.svg}.png" 2400; done
pandoc "$ROOT/src/proof.md" -f markdown -t html5 --standalone --template="$B/template.html" \
  --lua-filter="$B/filters.lua" --css=../build/book.css -o "$P/proof.html"
node render.js pdf "$P/proof.html" "$P/design_proof.pdf"
rm -f "$P"/proof-*.png
pdftoppm -r 80 -png "$P/design_proof.pdf" "$P/proof"
ls -la "$P" "$F"
