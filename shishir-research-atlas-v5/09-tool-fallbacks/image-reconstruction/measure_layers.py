"""Alpha bounding box of every rendered layer (canvas px). Writes layers/bboxes.json."""
import json, glob, os
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__))
res = {}
for f in sorted(glob.glob(os.path.join(here, 'layers', '*.png'))):
    a = Image.open(f).convert('RGBA').getchannel('A').point(lambda v: 255 if v > 24 else 0)
    res[os.path.basename(f)[:-4]] = a.getbbox()
json.dump(res, open(os.path.join(here, 'layers', 'bboxes.json'), 'w'), indent=1)
for k, v in res.items(): print(k, v)
