"""Original editorial cover illustration: a monsoon haor (wetland) scene in northeastern Bangladesh.
Conceptual scene-setter only: not a map, not a photograph, not evidence of any location.
Rendered as layered vector shapes with watercolour-like texture filters. No text inside the art."""
import random, math

W, H = 2100, 2970
random.seed(11)

def hills(y0, amp, n, seed, jitter=0.5):
    r = random.Random(seed)
    pts = []
    for i in range(n + 1):
        x = W * i / n
        y = y0 - amp * (0.55 + jitter * r.random()) * (0.6 + 0.4 * math.sin(i * 0.9 + seed))
        pts.append((x, y))
    d = f"M0,{H} L0,{pts[0][1]:.0f} "
    for i in range(1, len(pts)):
        x0, y0_ = pts[i - 1]; x1, y1 = pts[i]
        cx = (x0 + x1) / 2
        d += f"C{cx:.0f},{y0_:.0f} {cx:.0f},{y1:.0f} {x1:.0f},{y1:.0f} "
    d += f"L{W},{H} Z"
    return d

def boat(x, y, s=1.0, flip=False, hull="#3a2a1f", accent="#7a4e2c"):
    """Bengal country boat (nouka): crescent hull with raised ends + bamboo hood (chhoi)."""
    f = -1 if flip else 1
    def X(v): return x + f * v * s
    def Y(v): return y + v * s
    hullp = (f"M{X(-210)},{Y(-40)} C{X(-160)},{Y(10)} {X(-90)},{Y(30)} {X(0)},{Y(32)} "
             f"C{X(90)},{Y(30)} {X(170)},{Y(8)} {X(230)},{Y(-48)} "
             f"C{X(190)},{Y(-10)} {X(120)},{Y(0)} {X(0)},{Y(2)} C{X(-110)},{Y(0)} {X(-170)},{Y(-8)} {X(-210)},{Y(-40)} Z")
    hood = (f"M{X(-70)},{Y(2)} C{X(-60)},{Y(-70)} {X(40)},{Y(-74)} {X(60)},{Y(2)} Z")
    return (f'<g filter="url(#wc)"><path d="{hood}" fill="#8a6a43" opacity="0.92"/>'
            f'<path d="{hullp}" fill="{hull}"/>'
            f'<path d="M{X(-180)},{Y(-14)} C{X(-80)},{Y(12)} {X(80)},{Y(12)} {X(200)},{Y(-20)}" stroke="{accent}" stroke-width="{5*s}" fill="none"/></g>')

def fisher(x, y, s=1.0):
    """Standing figure casting a net (simple silhouette, no facial detail)."""
    return (f'<g fill="#2b2620" stroke="#2b2620" stroke-linecap="round">'
            f'<circle cx="{x}" cy="{y-150*s}" r="{15*s}"/>'
            f'<path d="M{x},{y-135*s} L{x+6*s},{y-60*s}" stroke-width="{16*s}"/>'
            f'<path d="M{x+6*s},{y-62*s} L{x-10*s},{y}" stroke-width="{9*s}"/>'
            f'<path d="M{x+6*s},{y-62*s} L{x+24*s},{y}" stroke-width="{9*s}"/>'
            f'<path d="M{x+2*s},{y-120*s} L{x+70*s},{y-160*s}" stroke-width="{7*s}"/>'
            f'<path d="M{x+2*s},{y-112*s} L{x+60*s},{y-110*s}" stroke-width="{7*s}"/>'
            f'<path d="M{x-8*s},{y-92*s} L{x+20*s},{y-92*s} L{x+30*s},{y-40*s} L{x-16*s},{y-40*s} Z" fill="#3e6f8c" stroke="none"/>'
            f'<path d="M{x-6*s},{y-96*s} L{x+16*s},{y-96*s}" stroke="#b5462f" stroke-width="{8*s}"/>'
            f'<path d="M{x-8*s},{y-168*s} q{12*s},{-10*s} {22*s},{0}" stroke="#e9dfc6" stroke-width="{7*s}" fill="none"/>'
            f'</g>')

def net(x, y, s=1.0):
    r = random.Random(5)
    out = [f'<g stroke="#f2ead7" stroke-width="{1.8*s}" fill="none" opacity="0.85">']
    cx, cy = x + 260 * s, y - 120 * s
    for i in range(16):
        a = -2.6 + i * 0.13
        ex, ey = cx + math.cos(a) * 230 * s, cy + math.sin(a) * 110 * s + 120 * s
        out.append(f'<path d="M{x+70*s},{y-160*s} Q{cx},{cy-60*s} {ex:.0f},{ey:.0f}"/>')
    out.append(f'<path d="M{cx-230*s:.0f},{cy+60*s:.0f} Q{cx},{cy+190*s:.0f} {cx+230*s:.0f},{cy+60*s:.0f}" stroke-width="{3*s}"/>')
    out.append("</g>")
    return "".join(out)

def hijal(x, y, s=1.0, seed=0):
    """Swamp tree (inspired by hijal/koroch stands of haors): slim trunk, layered canopy."""
    r = random.Random(seed)
    out = [f'<g filter="url(#wc)">']
    out.append(f'<path d="M{x},{y} C{x-6*s},{y-120*s} {x+10*s},{y-220*s} {x+2*s},{y-300*s}" stroke="#2e2a22" stroke-width="{10*s}" fill="none"/>')
    out.append(f'<path d="M{x+2*s},{y-200*s} C{x+40*s},{y-240*s} {x+70*s},{y-250*s} {x+90*s},{y-280*s}" stroke="#2e2a22" stroke-width="{6*s}" fill="none"/>')
    cols = ["#244a3c", "#2f5a48", "#3d6b52", "#4e7960"]
    for i in range(26):
        cx = x + r.uniform(-110, 120) * s
        cy = y - r.uniform(250, 380) * s
        rr = r.uniform(34, 66) * s
        out.append(f'<ellipse cx="{cx:.0f}" cy="{cy:.0f}" rx="{rr*1.3:.0f}" ry="{rr:.0f}" fill="{r.choice(cols)}" opacity="0.88"/>')
    out.append("</g>")
    return "".join(out)

def reflection(svg_inner, axis_y, opacity=0.28):
    return (f'<g clip-path="url(#waterclip)"><g transform="translate(0,{2*axis_y}) scale(1,-1)" opacity="{opacity}" filter="url(#reflect)">{svg_inner}</g></g>')

def reeds(x0, x1, ybase, n, seed, col="#33503f", hmin=120, hmax=360):
    r = random.Random(seed)
    out = [f'<g stroke="{col}" fill="none" stroke-linecap="round">']
    for _ in range(n):
        x = r.uniform(x0, x1); h = r.uniform(hmin, hmax); lean = r.uniform(-60, 60)
        sw = r.uniform(3, 7)
        out.append(f'<path d="M{x:.0f},{ybase+r.uniform(-20,30):.0f} q{lean/2:.0f},{-h/2:.0f} {lean:.0f},{-h:.0f}" stroke-width="{sw:.1f}" opacity="{r.uniform(.6,1):.2f}"/>')
    out.append("</g>")
    return "".join(out)

def lilies(x0, x1, y0, y1, n, seed):
    r = random.Random(seed)
    out = []
    for _ in range(n):
        x = r.uniform(x0, x1); y = r.uniform(y0, y1); s = r.uniform(0.7, 1.3)
        out.append(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{46*s:.0f}" ry="{14*s:.0f}" fill="#3f6b4c" opacity="0.9"/>')
        if r.random() < 0.55:
            for k in range(5):
                a = -math.pi / 2 + (k - 2) * 0.42
                px, py = x + math.cos(a) * 14 * s, y - 8 * s + math.sin(a) * 18 * s
                out.append(f'<ellipse cx="{px:.0f}" cy="{py:.0f}" rx="{6*s:.0f}" ry="{16*s:.0f}" fill="#f1c6cf" '
                           f'transform="rotate({math.degrees(a)+90:.0f} {px:.0f} {py:.0f})" opacity="0.95"/>')
    return "".join(out)

def ripples(y0, y1, n, seed):
    r = random.Random(seed)
    out = ['<g stroke="#e8f1ee" stroke-linecap="round" fill="none">']
    for _ in range(n):
        y = r.uniform(y0, y1); x = r.uniform(0, W)
        L = r.uniform(30, 160) * (0.5 + (y - y0) / (y1 - y0))
        out.append(f'<path d="M{x:.0f},{y:.0f} h{L:.0f}" stroke-width="{r.uniform(1.5,4):.1f}" opacity="{r.uniform(.15,.5):.2f}"/>')
    out.append("</g>")
    return "".join(out)

def birds(n, seed):
    r = random.Random(seed)
    out = ['<g stroke="#20323d" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.75">']
    for _ in range(n):
        x = r.uniform(1100, 1900); y = r.uniform(900, 1250); s = r.uniform(0.6, 1.2)
        out.append(f'<path d="M{x-30*s:.0f},{y:.0f} q{15*s:.0f},{-14*s:.0f} {30*s:.0f},0 q{15*s:.0f},{-14*s:.0f} {30*s:.0f},0"/>')
    out.append("</g>")
    return "".join(out)

def house(x, y, s=1.0, roof="#8f9aa0"):
    return (f'<g><rect x="{x}" y="{y-60*s}" width="{120*s}" height="{60*s}" fill="#9b7b55"/>'
            f'<path d="M{x-14*s},{y-58*s} L{x+60*s},{y-110*s} L{x+134*s},{y-58*s} Z" fill="{roof}"/>'
            f'<rect x="{x+48*s}" y="{y-38*s}" width="{22*s}" height="{38*s}" fill="#4b3a2a"/></g>')

HORIZON = 1640

def build(path):
    p = []
    p.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="210mm" height="297mm" '
             f'preserveAspectRatio="xMidYMid slice" role="img" aria-label="মৌলিক সম্পাদকীয় অলংকরণ: বর্ষার হাওরে নৌকা, জেলে, হিজল গাছ ও গ্রাম">')
    p.append("""<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#0d3346"/><stop offset="0.36" stop-color="#1f5d6c"/>
 <stop offset="0.66" stop-color="#7fa9a8"/><stop offset="0.86" stop-color="#e7d6ae"/><stop offset="1" stop-color="#f1e3bf"/></linearGradient>
<radialGradient id="sun" cx="0.72" cy="0.53" r="0.32"><stop offset="0" stop-color="#fff2cf" stop-opacity="0.95"/>
 <stop offset="0.4" stop-color="#f6dca3" stop-opacity="0.45"/><stop offset="1" stop-color="#f6dca3" stop-opacity="0"/></radialGradient>
<linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#c9d8cf"/><stop offset="0.18" stop-color="#8fb6b6"/><stop offset="0.55" stop-color="#3f7a80"/><stop offset="1" stop-color="#1f4c57"/></linearGradient>
<linearGradient id="titleshade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#08202d" stop-opacity="0.72"/>
 <stop offset="1" stop-color="#08202d" stop-opacity="0"/></linearGradient>
<linearGradient id="footband" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4efe2" stop-opacity="0"/>
 <stop offset="0.35" stop-color="#f4efe2" stop-opacity="0.9"/><stop offset="1" stop-color="#f4efe2" stop-opacity="1"/></linearGradient>
<filter id="wc" x="-10%" y="-10%" width="120%" height="120%">
 <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n"/>
 <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G"/></filter>
<clipPath id="waterclip"><rect x="0" y="1640" width="2100" height="2970"/></clipPath>
<filter id="soft"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="haze"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="reflect" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="5 1"/>
 <feTurbulence type="turbulence" baseFrequency="0.002 0.08" numOctaves="1" seed="3" result="t"/>
 <feDisplacementMap in2="t" scale="26" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="paper" x="0" y="0" width="100%" height="100%">
 <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="8" result="g"/>
 <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.10 0"/></filter>
</defs>""")
    p.append(f'<rect width="{W}" height="{HORIZON+20}" fill="url(#sky)"/>')
    p.append(f'<rect width="{W}" height="{H}" fill="url(#sun)"/>')
    # monsoon clouds
    r = random.Random(2)
    cl = ['<g filter="url(#soft)">']
    for i in range(22):
        cx = r.uniform(-100, W + 100); cy = r.uniform(380, 1050); rx = r.uniform(160, 420); ry = rx * r.uniform(0.28, 0.45)
        shade = r.choice(["#e9eee9", "#d7e2df", "#c3d3d2", "#f2ead6"])
        cl.append(f'<ellipse cx="{cx:.0f}" cy="{cy:.0f}" rx="{rx:.0f}" ry="{ry:.0f}" fill="{shade}" opacity="{r.uniform(.25,.6):.2f}"/>')
    cl.append("</g>")
    p.append("".join(cl))
    p.append(birds(9, 3))
    # distant hills (northern horizon) – three atmospheric layers
    far = f'<path d="{hills(HORIZON-120, 240, 7, 1)}" fill="#6f8f9b" opacity="0.55" filter="url(#haze)"/>'
    mid = f'<path d="{hills(HORIZON-40, 150, 9, 2)}" fill="#557b84" opacity="0.65" filter="url(#haze)"/>'
    p.append(far + mid)
    # water body
    p.append(f'<rect y="{HORIZON}" width="{W}" height="{H-HORIZON}" fill="url(#water)"/>')
    p.append(reflection(far + mid, HORIZON, 0.32))
    # distant tree line & village mound (kanda)
    mound = (f'<path d="M80,{HORIZON+30} C260,{HORIZON-40} 640,{HORIZON-60} 900,{HORIZON+26} Z" fill="#4a6b4f" filter="url(#wc)"/>'
             + house(300, HORIZON - 4, 0.8, "#a7b1b5") + house(470, HORIZON - 10, 0.9, "#8f9aa0") + house(640, HORIZON - 2, 0.7, "#b1a58c"))
    trees_far = "".join(hijal(x, HORIZON + 10, 0.55, seed=x) for x in (180, 390, 560, 760))
    p.append(trees_far + mound)
    p.append(reflection(trees_far + mound, HORIZON + 12, 0.25))
    # mid-distance hijal stand standing in water (right)
    stand = "".join(hijal(x, HORIZON + 210 + (i % 2) * 25, 1.0, seed=40 + i) for i, x in enumerate((1380, 1560, 1720, 1880, 2020)))
    p.append(reflection(stand, HORIZON + 230, 0.30))
    p.append(stand)
    p.append(ripples(HORIZON + 10, H - 300, 340, 9))
    # mid boat with sail
    sail = (f'<g filter="url(#wc)"><path d="M1060,{HORIZON+120} L1065,{HORIZON-170} L1190,{HORIZON+70} Z" fill="#e9dfc6" opacity="0.95"/>'
            f'<path d="M1062,{HORIZON+120} L1065,{HORIZON-180}" stroke="#3a2a1f" stroke-width="7"/></g>')
    midboat = sail + boat(1080, HORIZON + 140, 0.85)
    p.append(reflection(midboat, HORIZON + 160, 0.3))
    p.append(midboat)
    # foreground boat with fisher casting net
    fg_y = 2380
    fg = boat(820, fg_y, 2.0, hull="#2f2219", accent="#9c6a3c") + fisher(760, fg_y - 30, 1.55) + net(760, fg_y - 30, 1.55)
    p.append(reflection(boat(820, fg_y, 2.0, hull="#2f2219"), fg_y + 50, 0.35))
    p.append(fg)
    # water lilies & reeds
    p.append(lilies(1200, 2050, 2420, 2640, 22, 17))
    p.append(reeds(-20, 380, 2600, 120, 21, "#2c4637", 160, 520))
    p.append(reeds(1750, 2120, 2560, 90, 22, "#2c4637", 140, 460))
    # title shade (top) and foot band (bottom) for legible typesetting
    p.append(f'<rect width="{W}" height="1250" fill="url(#titleshade)"/>')
    p.append(f'<rect y="{H-420}" width="{W}" height="420" fill="url(#footband)"/>')
    p.append(f'<rect width="{W}" height="{H}" filter="url(#paper)" opacity="0.9"/>')
    p.append(f'<rect x="200" y="{H-300}" width="300" height="6" fill="#147C80"/>')
    p.append("</svg>")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(p))

if __name__ == "__main__":
    import sys
    build(sys.argv[1])
