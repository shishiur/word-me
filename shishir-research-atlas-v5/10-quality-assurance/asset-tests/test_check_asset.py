"""Self-test for check_asset.py: a correctly registered asset must pass, a broken one must fail,
and --fix must repair size and placement. Run: python3 10-quality-assurance/asset-tests/test_check_asset.py"""
import os, sys, tempfile, contextlib, io
from PIL import Image
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, os.path.join(ROOT, '09-tool-fallbacks', 'image-reconstruction'))
import check_asset as C
tmp = tempfile.mkdtemp()
failures = 0
for aid in ['P01-S01-A010', 'P01-S01-A011', 'P01-S01-A013']:
    a = C.ASSETS[aid]; x, y = a['position']; w, h = a['size']
    layer = Image.open(os.path.join(ROOT, '09-tool-fallbacks/image-reconstruction/layers', a['fallback'].replace('fallback/', '').replace('.svg', '.png'))).convert('RGBA')
    good = layer.crop((x, y, x + w, y + h)); gp = os.path.join(tmp, f'{aid}-good.png'); good.save(gp)
    bad = Image.new('RGBA', (w * 2 + 37, h * 2), (240, 240, 240, 255)); bad.alpha_composite(good.resize((w * 2, h * 2)), (37, 0)); bp = os.path.join(tmp, f'{aid}-bad.png'); bad.save(bp)
    shifted = Image.new('RGBA', (w * 3, h * 3), (0, 0, 0, 0)); shifted.alpha_composite(good.resize((w * 2, h * 2)), (w // 3, h // 2)); sp = os.path.join(tmp, f'{aid}-shift.png'); shifted.save(sp)
    with contextlib.redirect_stdout(io.StringIO()):
        r1 = C.check(aid, gp); r2 = C.check(aid, bp); r3 = C.check(aid, sp, os.path.join(tmp, 'fixed', aid))
    ok = r1 and not r2 and r3
    failures += not ok
    print('PASS' if ok else 'FAIL', aid, f'good={r1} broken={r2} fixed={r3}')
sys.exit(1 if failures else 0)
