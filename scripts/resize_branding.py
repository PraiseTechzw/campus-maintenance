from pathlib import Path

from PIL import Image

PROJECT = Path("/home/ubuntu/campus-maintenance")
ASSETS = PROJECT / "assets/images"
SOURCE = ASSETS / "icon.png"
TARGETS = [
    ASSETS / "icon.png",
    ASSETS / "splash-icon.png",
    ASSETS / "favicon.png",
    ASSETS / "android-icon-foreground.png",
]

with Image.open(SOURCE) as image:
    square = image.convert("RGBA").resize((512, 512), Image.Resampling.LANCZOS)
    for target in TARGETS:
        square.save(target, format="PNG", optimize=True, compress_level=9)
