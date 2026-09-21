from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1] / "public" / "assets" / "site" / "textile-cargo"
SOURCES = {
    "gallery": [
        "pattern-mixing.jpg",
        "rose-and-aqua.jpg",
        "monochrome-layers.jpg",
        "red-and-black.jpg",
        "green-plaid.jpg",
        "burgundy-handwork.jpg",
    ],
    "details": [
        "needlepoint-baskets.jpg",
        "embroidery-basket.jpg",
        "jewelry-drawer.jpg",
    ],
}
MAX_SIZE = (1600, 2400)

for folder, names in SOURCES.items():
    output_dir = ROOT / folder / "optimized"
    output_dir.mkdir(parents=True, exist_ok=True)
    for name in names:
        source = ROOT / folder / name
        destination = output_dir / name
        with Image.open(source) as image:
            image = ImageOps.exif_transpose(image).convert("RGB")
            image.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
            image.save(
                destination,
                format="JPEG",
                quality=84,
                optimize=True,
                progressive=True,
                subsampling="4:2:0",
            )
        with Image.open(destination) as check:
            check.verify()
        print(f"{source.name}: {source.stat().st_size} -> {destination.stat().st_size} bytes")
