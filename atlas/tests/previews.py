# Convert raw Playwright PNG captures in previews/_raw to WebP: python3 atlas/tests/previews.py
import glob, os
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__))
raw, out = os.path.join(here, '..', 'previews', '_raw'), os.path.join(here, '..', 'previews')
for f in sorted(glob.glob(os.path.join(raw, '*.png'))):
    im = Image.open(f).convert('RGB')
    if im.height > 16000:
        im = im.resize((im.width * 16000 // im.height, 16000))
    im.save(os.path.join(out, os.path.basename(f)[:-4] + '.webp'), 'WEBP', quality=80, method=6)
print('converted', len(glob.glob(os.path.join(raw, '*.png'))))
