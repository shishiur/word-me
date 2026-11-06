#!/usr/bin/env bash
set -euo pipefail
export LC_ALL=C.UTF-8 LANG=C.UTF-8
export NODE_PATH="$(npm root -g)"
cd "$(dirname "$0")"
python3 figs_core.py ../figures
python3 figs_more.py ../figures
for f in ../figures/fig_*.svg; do node render.js png "$f" "${f%.svg}.png" 2000; done
python3 build_book.py "$@"
