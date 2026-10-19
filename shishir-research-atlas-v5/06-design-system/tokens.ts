// Generated from tokens.json by build-tokens.mjs. Do not edit.
export const tokens = {
  "$description": "Shishir Research Atlas design tokens. Source of truth for tokens.css, the website, Remotion and the Figma variables listed in figma-handoff/frames.json.",
  "color": {
    "surface": {
      "night": "#0b1517",
      "night-2": "#102024",
      "night-3": "#17292d",
      "ink": "#13202a",
      "ink-panel": "#1b2b36",
      "paper": "#eef2f1",
      "paper-2": "#e2e9e9",
      "print": "#f8faf9",
      "wall": "#e3e8e9"
    },
    "text": {
      "on-night": "#e8eeef",
      "on-night-2": "#a9babe",
      "on-paper": "#13202a",
      "on-paper-2": "#46555e",
      "on-paper-3": "#74838a"
    },
    "market": {
      "tungsten": "#f2ab46",
      "bulb": "#ffe2a6",
      "steel": "#9fb2b7",
      "wood": "#9a6a3e",
      "bamboo": "#c9a56a",
      "shadow": "#0b1517"
    },
    "lab": {
      "xld": "#cf4257",
      "xld-deep": "#a3283b",
      "h2s": "#160c0e",
      "fermenter": "#d9a93a",
      "mh-agar": "#cfa159",
      "lawn": "#f0e2bb",
      "glass": "#dfe9ec"
    },
    "aquatic": {
      "haor-teal": "#1f6f78",
      "river": "#9cc7d3",
      "silt": "#574c34",
      "deep": "#0c1618",
      "hilsa-silver": "#d3dcdf",
      "hilsa-dorsum": "#22414c",
      "iridescent-violet": "#7d6fb0",
      "scale-gold": "#d8b85e"
    },
    "wetland": {
      "reed": "#8fbf9a",
      "mangrove": "#3d5a3a",
      "floodplain": "#9fcbc9",
      "land": "#1c2b26",
      "sediment": "#b4874a",
      "sandbar": "#e3d4b2"
    },
    "molecular": {
      "backbone": "#5d6f7a",
      "highlight": "#e9d9a6",
      "ligand": "#c0392b",
      "surface": "#b8c9cf"
    },
    "interactive": {
      "hover": "#ffe2a6",
      "selected": "#f2ab46",
      "focus-ring-night": "#f2ab46",
      "focus-ring-paper": "#3f7ea6",
      "selected-on-paper": "#13202a"
    },
    "evidence": {
      "published": "#13202a",
      "record": "#13202a",
      "disputed": "#a3283b",
      "disputed-on-night": "#e06a7a",
      "reference": "#13202a",
      "illustrative": "#13202a",
      "awaiting": "#13202a",
      "warning": "#b8323f"
    },
    "data": {
      "resistant": "#b8323f",
      "intermediate": "#e2b44f",
      "susceptible": "#4f8f6e",
      "count-on": "#cf4257",
      "count-off": "#13202a38",
      "channel": "#4f8db3",
      "today": "#c0392b"
    }
  },
  "evidenceGlyph": {
    "published": "filled circle",
    "record": "half-filled circle",
    "disputed": "striped square",
    "reference": "filled diamond",
    "illustrative": "hollow circle",
    "awaiting": "dashed circle"
  },
  "font": {
    "display": "'Newsreader', Georgia, 'Times New Roman', serif",
    "body": "'Instrument Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
    "mono": "'IBM Plex Mono', ui-monospace, Menlo, monospace"
  },
  "type": {
    "display-xl": {
      "family": "display",
      "size": "clamp(36px, 5.4vw, 68px)",
      "weight": 400,
      "line": 1.02,
      "tracking": "-0.015em"
    },
    "display-l": {
      "family": "display",
      "size": "clamp(30px, 3.8vw, 46px)",
      "weight": 400,
      "line": 1.06,
      "tracking": "-0.01em"
    },
    "display-m": {
      "family": "display",
      "size": "28px",
      "weight": 400,
      "line": 1.1
    },
    "lede": {
      "family": "body",
      "size": "clamp(16px, 1.5vw, 18.5px)",
      "weight": 400,
      "line": 1.55
    },
    "body": {
      "family": "body",
      "size": "16px",
      "weight": 400,
      "line": 1.55
    },
    "ui": {
      "family": "body",
      "size": "14px",
      "weight": 500,
      "line": 1.3
    },
    "label": {
      "family": "mono",
      "size": "12px",
      "weight": 500,
      "line": 1.4,
      "tracking": "0.1em",
      "case": "uppercase"
    },
    "annotation": {
      "family": "mono",
      "size": "12.5px",
      "weight": 400,
      "line": 1.5
    },
    "number-l": {
      "family": "mono",
      "size": "44px",
      "weight": 500,
      "line": 1,
      "numeric": "tabular-nums"
    }
  },
  "space": {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "24px",
    "6": "32px",
    "7": "48px",
    "8": "72px"
  },
  "radius": {
    "chip": "99px",
    "control": "10px",
    "panel": "16px",
    "stage": "16px"
  },
  "motion": {
    "duration": {
      "instant": 0.12,
      "fast": 0.3,
      "base": 0.5,
      "focus": 0.85,
      "establish": 2.4
    },
    "ease": {
      "focus": "power3.inOut",
      "reveal": "power2.out",
      "settle": "power2.inOut"
    },
    "parallax": {
      "x": 24,
      "y": 12
    }
  },
  "layout": {
    "max": "1240px",
    "gutter": "max(16px, env(safe-area-inset-left, 0px))",
    "breakpoints": {
      "phone": 620,
      "tablet": 900,
      "desktop": 1080
    },
    "stage": {
      "aspect": "5 / 3",
      "canvas": [
        2400,
        1440
      ]
    }
  }
} as const;
