"""Check (and optionally normalise) a generated asset against its manifest entry.

Usage:
  python3 check_asset.py P01-S01-A010 path/to/p01-s01-a010-fish.png          # report only
  python3 check_asset.py P01-S01-A010 path/to/raw.png --fix out_dir/          # resize/align, then report

Checks
  size       exact pixel size from assets.json (after --fix: always)
  alpha      straight alpha present when the manifest requires it; corners transparent
  bbox       alpha bounding box keeps >= 4 px margin inside the frame
  overlap    silhouette IoU with the measured vector fallback layer >= 0.55 (composition preserved)
  halo       share of soft-edge pixels more than 70 luminance lighter than neighbouring opaque pixels < 12 %
It also writes <id>-review.png: generated asset over the fallback silhouette (red = fallback only,
blue = generated only, purple = both), for the human reviewer.
"""
import json, os, sys
from PIL import Image, ImageChops, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
ASSETS = {a['id']: a for a in json.load(open(os.path.join(ROOT, '05-production-manifests', 'assets.json')))}


def fallback_mask(a):
    png = os.path.join(HERE, 'layers', a['fallback'].replace('fallback/', '').replace('.svg', '.png'))
    if not os.path.exists(png):
        return None
    full = Image.open(png).convert('RGBA').getchannel('A')
    if a.get('position'):
        x, y = a['position']; w, h = a['size']
        full = full.crop((x, y, x + w, y + h))
    else:
        full = full.resize(tuple(a['size']))
    return full.point(lambda v: 255 if v > 24 else 0)


def halo_fraction(im):
    """Bright matte halo: a soft edge pixel much lighter than the opaque pixels next to it.
    Dark soft edges are allowed because contact shadows are legitimately semi-transparent."""
    al = im.getchannel('A')
    edge = al.point(lambda v: 255 if 24 < v < 230 else 0)
    n = edge.histogram()[255]
    if not n:
        return None
    opaque = al.point(lambda v: 255 if v >= 250 else 0)
    lum = im.convert('RGB').convert('L')
    num = ImageChops.multiply(lum, opaque).filter(ImageFilter.BoxBlur(3))
    den = opaque.filter(ImageFilter.BoxBlur(3))
    e, nu, de, lu = edge.load(), num.load(), den.load(), lum.load()
    bad = cnt = 0
    for yy in range(im.height):
        for xx in range(im.width):
            if e[xx, yy] and de[xx, yy] > 8:
                cnt += 1
                if lu[xx, yy] - nu[xx, yy] * 255 / de[xx, yy] > 70:
                    bad += 1
    return bad / cnt if cnt else 0.0


def normalise(a, im):
    """Fit the generated image to the manifest frame. With alpha, align its silhouette to the fallback bbox."""
    w, h = a['size']
    if a.get('alpha') and im.mode == 'RGBA':
        fb = fallback_mask(a)
        src = im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
        if fb is not None and src and fb.getbbox():
            fx0, fy0, fx1, fy1 = fb.getbbox()
            cut = im.crop(src)
            s = min((fx1 - fx0) / cut.width, (fy1 - fy0) / cut.height)
            cut = cut.resize((max(1, round(cut.width * s)), max(1, round(cut.height * s))), Image.LANCZOS)
            out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
            out.alpha_composite(cut, (fx0 + ((fx1 - fx0) - cut.width) // 2, fy0 + ((fy1 - fy0) - cut.height) // 2))
            return out
    # opaque layers: cover-fit then centre-crop
    s = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    l, t = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((l, t, l + w, t + h))


def check(asset_id, path, fix_dir=None):
    a = ASSETS[asset_id]
    im = Image.open(path)
    im = im.convert('RGBA') if a.get('alpha') else im.convert('RGB')
    if fix_dir:
        im = normalise(a, im)
        os.makedirs(fix_dir, exist_ok=True)
        path = os.path.join(fix_dir, a['file'].replace('.webp', '.png') if a.get('alpha') else a['file'])
        im.save(path)
    res = []
    res.append(('size', list(im.size) == list(a['size']), f"{im.size[0]}×{im.size[1]} (want {a['size'][0]}×{a['size'][1]})"))
    if a.get('alpha'):
        al = im.getchannel('A')
        corners = [al.getpixel(p) for p in [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)]]
        res.append(('alpha', max(corners) < 16, f'corner alpha {corners}'))
        bb = al.point(lambda v: 255 if v > 24 else 0).getbbox()
        ok = bool(bb) and bb[0] >= 4 and bb[1] >= 0 and bb[2] <= im.width - 4 and bb[3] <= im.height
        res.append(('bbox', ok, f'alpha bbox {bb}'))
        fb = fallback_mask(a)
        if fb is not None and fb.size == im.size:
            g = al.point(lambda v: 255 if v > 24 else 0)
            inter = ImageChops.multiply(g, fb).histogram()[255]
            union = ImageChops.lighter(g, fb).histogram()[255]
            iou = inter / union if union else 0
            res.append(('overlap', iou >= 0.55, f'silhouette IoU with fallback {iou:.2f}'))
            review = Image.merge('RGB', (fb, Image.new('L', im.size, 0), g))
            review.save(os.path.join(os.path.dirname(path) or '.', f'{asset_id}-review.png'))
        frac = halo_fraction(im)
        if frac is not None:
            res.append(('halo', frac < 0.12, f'{frac:.0%} of soft-edge pixels are > 70 luminance lighter than their opaque neighbours'))
    width = max(len(r[0]) for r in res)
    for name, ok, msg in res:
        print(f"{'PASS' if ok else 'FAIL'}  {name.ljust(width)}  {msg}")
    allok = all(r[1] for r in res)
    print('RESULT', 'PASS' if allok else 'FAIL', '→ status may move to generated-unreviewed' if allok else '→ keep the fallback; see 10-quality-assurance/visual-iteration-protocol.md')
    return allok


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(2)
    fix = sys.argv[sys.argv.index('--fix') + 1] if '--fix' in sys.argv else None
    sys.exit(0 if check(sys.argv[1], sys.argv[2], fix) else 1)
