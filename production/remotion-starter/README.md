# Remotion starter: 24-shot proof-of-concept

`npm install && npm run preview`

**Contains:** all 24 planned scene timecodes, original schematic SVG studies as replaceable board images, separate editable hero word overlay, placeholder-only short caption excerpts, and deterministic 24fps 1080×1920 timeline.

**Does NOT contain:** finalized custom illustration animation, narration, music, sound design, aligned SRT, or a publish-ready movie. The full 350s placeholder render must not be presented as finished work.

How to continue:
1. Replace static SVG `public/boards/Sxx.svg` with carefully directed layered assets.
2. Animate the independent layers rather than simply scaling one image.
3. Record original narration, import `Audio` from `@remotion/media` and source from `public/audio/vo_master.wav`.
4. Add legally cleared original score / stems, mix using `@remotion/media` or a post mix.
5. Replace placeholder caption excerpt with final timecoded phrase events from the recorded WAV.
6. Verify in Studio and inspect renders at 25% phone-size.

Technical note: rendering 8400 high-resolution frames is an extended job. Use Studio preview and short-frame-range renders for QC before exporting full length.
