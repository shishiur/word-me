# Figma handoff (P01)

Status: **specification only.** The connected Figma account (checked 19 Oct 2026) has a View seat on a Starter plan, so Claude could not create or edit the file. Anyone with an Editor seat can build it from `frames.json` in about an hour.

1. Create the variables from `../tokens.json` (names in `frames.json → variables`).
2. Create the text styles and the eight components listed in `frames.json`.
3. Build the seven frames. Each has a reference screenshot from the working site.
4. Place scene layers from `08-interactive-website/public/assets/p01/`; never paste temporary export URLs.

Fallback: the running site plus `tokens.css` is the visual reference; nothing downstream depends on Figma.
