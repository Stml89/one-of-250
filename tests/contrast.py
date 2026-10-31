"""WCAG contrast of every text colour on every surface it sits on, in the light, dark and x-ray palettes.
Reads the colour tokens from src/head.html; exits 1 if any pair falls below 4.5:1 (AA for normal text)."""
import re, sys, pathlib

css = (pathlib.Path(__file__).parent.parent / "src" / "head.html").read_text()

def block(start):
    i = css.index(start)
    return dict(re.findall(r"--([\w-]+):(#[0-9A-Fa-f]{6})", css[i:css.index("}", i)]))

light = block(":root{")
dark = {**light, **block(':root[data-theme="dark"]{')}

def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

def ratio(a, b):
    a, b = lum(a), lum(b)
    return (max(a, b) + 0.05) / (min(a, b) + 0.05)

TEXT = [(f, b) for f in ["ink", "muted", "pen", "stamp", "ok", "gold"] for b in ["paper", "sheet"]]
TEXT += [("pen-ink", "pen"), ("sheet", "stamp"), ("muted", "photo")]
FILM = [(f, b) for f in ["glow", "glow-dim", "film-red"] for b in ["film", "film2"]]

fails = 0
for name, pal, pairs in (("light", light, TEXT), ("dark", dark, TEXT), ("x-ray", light, FILM)):
    for f, b in pairs:
        r = ratio(pal[f], pal[b])
        if r < 4.5:
            fails += 1
            print(f"{name} {f} on {b}: {r:.2f}")
small = re.findall(r"font(?:-size)?:\s*(?:[0-9]|1[01])(?:\.\d+)?px", css)
print("contrast fails", fails, "· text under 12px", len(small))
sys.exit(1 if fails or small else 0)
