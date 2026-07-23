import os
import sys
import glob
import json
import cv2
import numpy as np
from PIL import Image

# Determine root directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_ASSETS_DIR = os.path.join(BASE_DIR, 'src', 'assets', 'images', 'products')
PUBLIC_ASSETS_DIR = os.path.join(BASE_DIR, 'public', 'assets', 'images', 'products')
PUBLIC_PRODUCTS_DIR = os.path.join(BASE_DIR, 'public', 'images', 'products')

# List of 13 Canonical Categories
CATEGORIES = [
    'packet-series',
    'premium-packet-series',
    'special-series',
    'pouch-series',
    'special-pouch-series',
    'premium-pouch-series',
    'premium-special-pouch-series',
    'wet-dhoop',
    'premium-wet-dhoop',
    'solid-dhoop',
    'sambrani',
    'vasu',
    'hexa'
]

# Ensure output directory structure exists
for cat in CATEGORIES:
    os.makedirs(os.path.join(SRC_ASSETS_DIR, cat), exist_ok=True)
    os.makedirs(os.path.join(PUBLIC_ASSETS_DIR, cat), exist_ok=True)
os.makedirs(PUBLIC_PRODUCTS_DIR, exist_ok=True)

# Product Master Metadata Database
PRODUCT_CATALOG = [
    # 1. Packet Series (Regular)
    {
        "id": "bansuri-packet-classic-19",
        "name": "Bansuri Agarbathi Classic (19g)",
        "category": "packet-series",
        "folder": "packet-series",
        "filename": "packet-series-classic-19",
        "sizes": ["19g", "60g", "120g"],
        "mrp": [15, 45, 75],
        "b2bPrice": [11, 34, 56],
        "minB2bQty": 100,
        "gstRate": 12,
        "isBestseller": True,
        "isNew": False,
        "description": "Traditional aromatic incense sticks crafted with natural herbs and pure sandalwood extract."
    },
    {
        "id": "bansuri-packet-classic-120",
        "name": "Bansuri Agarbathi Classic (120g)",
        "category": "packet-series",
        "folder": "packet-series",
        "filename": "packet-series-classic-120",
        "sizes": ["60g", "120g", "250g"],
        "mrp": [45, 75, 140],
        "b2bPrice": [34, 56, 105],
        "minB2bQty": 50,
        "gstRate": 12,
        "isBestseller": True,
        "isNew": False,
        "description": "Value pack classic agarbathi for daily devotional prayers and soothing home fragrance."
    },
    {
        "id": "bansuri-packet-vibe-120",
        "name": "Bansuri Agarbathi Vibe (120g)",
        "category": "packet-series",
        "folder": "packet-series",
        "filename": "packet-series-vibe-120",
        "sizes": ["42g", "120g"],
        "mrp": [30, 75],
        "b2bPrice": [22, 56],
        "minB2bQty": 60,
        "gstRate": 12,
        "isBestseller": False,
        "isNew": True,
        "description": "Energetic blend of modern floral and spicy notes designed for modern living spaces."
    },
    {
        "id": "bansuri-packet-pineapple-42",
        "name": "Bansuri Agarbathi Pineapple (42g)",
        "category": "packet-series",
        "folder": "packet-series",
        "filename": "packet-series-pineapple-42",
        "sizes": ["42g", "100g"],
        "mrp": [25, 60],
        "b2bPrice": [18, 45],
        "minB2bQty": 80,
        "gstRate": 12,
        "isBestseller": False,
        "isNew": False,
        "description": "Sweet fruity pineapple fragrance offering a refreshing and uplifting atmosphere."
    },
    {
        "id": "bansuri-packet-mogra-19",
        "name": "Bansuri Agarbathi Mogra (19g)",
        "category": "packet-series",
        "folder": "packet-series",
        "filename": "packet-series-mogra-19",
        "sizes": ["19g", "60g", "120g"],
        "mrp": [15, 45, 75],
        "b2bPrice": [11, 34, 56],
        "minB2bQty": 100,
        "gstRate": 12,
        "isBestseller": False,
        "isNew": False,
        "description": "Intense fresh jasmine mogra incense sticks for evening rituals and meditation."
    },
    {
        "id": "bansuri-packet-lavender-120",
        "name": "Bansuri Agarbathi Lavender (120g)",
        "category": "packet-series",
        "folder": "packet-series",
        "filename": "packet-series-lavender-120",
        "sizes": ["60g", "120g"],
        "mrp": [45, 75],
        "b2bPrice": [34, 56],
        "minB2bQty": 50,
        "gstRate": 12,
        "isBestseller": False,
        "isNew": False,
        "description": "Calming French lavender fragrance engineered to relax minds and reduce stress."
    },
    {
        "id": "bansuri-packet-chandan-19",
        "name": "Bansuri Agarbathi Chandan (19g)",
        "category": "packet-series",
        "folder": "packet-series",
        "filename": "packet-series-chandan-19",
        "sizes": ["19g", "60g", "120g"],
        "mrp": [15, 45, 75],
        "b2bPrice": [11, 34, 56],
        "minB2bQty": 100,
        "gstRate": 12,
        "isBestseller": True,
        "isNew": False,
        "description": "Pure Mysore sandalwood aroma delivering sacred ambiance during pujas and festivals."
    },

    # 2. Premium Packet Series
    {
        "id": "bansuri-premium-packet-royal",
        "name": "Bansuri Royal Agarbathi (100g)",
        "category": "premium-packet-series",
        "folder": "premium-packet-series",
        "filename": "premium-packet-royal",
        "sizes": ["100g", "250g"],
        "mrp": [90, 210],
        "b2bPrice": [68, 158],
        "minB2bQty": 40,
        "gstRate": 12,
        "isBestseller": True,
        "isNew": True,
        "description": "Luxury royal blend with natural essential oils and hand-rolled charcoal base."
    },

    # 3. Special Series
    {
        "id": "bansuri-special-beats-45",
        "name": "Bansuri Special Beats (45g)",
        "category": "special-series",
        "folder": "special-series",
        "filename": "special-beats-45",
        "sizes": ["45g", "100g"],
        "mrp": [35, 75],
        "b2bPrice": [26, 56],
        "minB2bQty": 60,
        "gstRate": 12,
        "isBestseller": True,
        "isNew": False,
        "description": "Special fusion formula with vibrant aromatic spices and sweet floral resins."
    },

    # 4. Pouch Series
    {
        "id": "bansuri-pouch-classic",
        "name": "Bansuri Zipper Pouch Classic (250g)",
        "category": "pouch-series",
        "folder": "pouch-series",
        "filename": "pouch-classic",
        "sizes": ["250g", "500g"],
        "mrp": [140, 260],
        "b2bPrice": [105, 195],
        "minB2bQty": 30,
        "gstRate": 12,
        "isBestseller": True,
        "isNew": False,
        "description": "Resealable zipper pouch preserving freshness of classic incense sticks for months."
    },

    # 8. Wet Dhoop
    {
        "id": "bansuri-wet-classic",
        "name": "Bansuri Classic Wet Dhoop",
        "category": "wet-dhoop",
        "folder": "wet-dhoop",
        "filename": "wet-dhoop-classic",
        "sizes": ["50g", "100g"],
        "mrp": [15, 30],
        "b2bPrice": [11, 22],
        "minB2bQty": 100,
        "gstRate": 12,
        "isBestseller": True,
        "isNew": False,
        "description": "Pliable traditional wet dhoop sticks producing dense aromatic smoke."
    },

    # 10. Solid Dhoop
    {
        "id": "bansuri-solid-guggal",
        "name": "Bansuri Guggal Solid Dhoop (100g)",
        "category": "solid-dhoop",
        "folder": "solid-dhoop",
        "filename": "solid-dhoop-guggal",
        "sizes": ["100g"],
        "mrp": [50],
        "b2bPrice": [38],
        "minB2bQty": 60,
        "gstRate": 12,
        "isBestseller": True,
        "isNew": False,
        "description": "Pure unadulterated guggal resin dhoop sticks for purifying home environment."
    },

    # 11. Sambrani Series (Exact Matching Image Catalogue Uploaded by User)
    {
        "id": "bansuri-sambrani-cup-12",
        "name": "Bansuri Special Cup Sambrani (12N)",
        "category": "sambrani",
        "folder": "sambrani",
        "filename": "sambrani-special-cup",
        "sizes": ["12N"],
        "mrp": [72],
        "b2bPrice": [54],
        "minB2bQty": 40,
        "gstRate": 12,
        "isBestseller": True,
        "isNew": True,
        "description": "Ready-to-use charcoal cups filled with natural benzoin sambrani resin and herbs."
    },
    {
        "id": "bansuri-sambrani-cones-10",
        "name": "Bansuri Cones Sambrani (10N)",
        "category": "sambrani",
        "folder": "sambrani",
        "filename": "sambrani-cones",
        "sizes": ["10N"],
        "mrp": [15],
        "b2bPrice": [11],
        "minB2bQty": 100,
        "gstRate": 12,
        "isBestseller": True,
        "isNew": False,
        "description": "Dense aromatic sambrani incense cones with ceramic burner stand included."
    },
    {
        "id": "bansuri-sambrani-sticks-10",
        "name": "Bansuri Sambrani Dhoop (10N & 15N)",
        "category": "sambrani",
        "folder": "sambrani",
        "filename": "sambrani-sticks",
        "sizes": ["10N", "15N"],
        "mrp": [15, 25],
        "b2bPrice": [11, 18],
        "minB2bQty": 100,
        "gstRate": 12,
        "isBestseller": True,
        "isNew": False,
        "description": "Traditional cylindrical sambrani dhoop sticks offering continuous slow burn."
    },
    {
        "id": "bansuri-sambrani-rose-10",
        "name": "Bansuri Cones Rose (10N)",
        "category": "sambrani",
        "folder": "sambrani",
        "filename": "sambrani-rose-cones",
        "sizes": ["10N"],
        "mrp": [15],
        "b2bPrice": [11],
        "minB2bQty": 100,
        "gstRate": 12,
        "isBestseller": False,
        "isNew": False,
        "description": "Rose infused aromatic incense cones delivering delightful floral fragrance."
    },
    {
        "id": "bansuri-sambrani-chandan-10",
        "name": "Bansuri Cones Chandan (10N)",
        "category": "sambrani",
        "folder": "sambrani",
        "filename": "sambrani-chandan-cones",
        "sizes": ["10N"],
        "mrp": [15],
        "b2bPrice": [11],
        "minB2bQty": 100,
        "gstRate": 12,
        "isBestseller": False,
        "isNew": False,
        "description": "Sandalwood scented sambrani cones providing serene spiritual atmosphere."
    },

    # 12. Vasu Series
    {
        "id": "vasu-agarbathi-60",
        "name": "Vasu Premium Agarbathi (60g)",
        "category": "vasu",
        "folder": "vasu",
        "filename": "vasu-60",
        "sizes": ["60g", "108g"],
        "mrp": [50, 95],
        "b2bPrice": [38, 71],
        "minB2bQty": 50,
        "gstRate": 12,
        "isBestseller": True,
        "isNew": False,
        "description": "Iconic Vasu series featuring ancient Vedic herbs and rare aromatic bark oils."
    },

    # 13. Hexa Series
    {
        "id": "bansuri-hexa-classic",
        "name": "Bansuri Hexa Pack Classic",
        "category": "hexa",
        "folder": "hexa",
        "filename": "hexa-classic",
        "sizes": ["100g"],
        "mrp": [60],
        "b2bPrice": [45],
        "minB2bQty": 60,
        "gstRate": 12,
        "isBestseller": True,
        "isNew": False,
        "description": "Hexagonal export pack of premium hand-rolled incense sticks."
    }
]

def process_and_generate_assets():
    print("[PIPELINE] Initiating Automated Bansuri Product Asset Pipeline...")

    # Load master catalogue image
    source_img_path = os.path.join(BASE_DIR, 'public', 'images', 'products', 'bansuri-special-sambrani-hero.png')
    uploaded_path = os.path.join(os.path.dirname(BASE_DIR), '.gemini', 'antigravity-ide', 'brain', '1779c7d7-b2c9-4cb9-bd07-08cdf2f8fe6e', '.tempmediaStorage', 'media_1779c7d7-b2c9-4cb9-bd07-08cdf2f8fe6e_1784615168237.png')

    if os.path.exists(uploaded_path):
        source_path = uploaded_path
    elif os.path.exists(source_img_path):
        source_path = source_img_path
    else:
        print("[ERROR] Source catalogue sheet image not found.")
        return

    print(f"[PIPELINE] Processing Catalogue Sheet: {source_path}")
    source_img = Image.open(source_path)

    # Define crop bounding boxes (Left, Upper, Right, Lower) for Sambrani series from 1920x912 canvas
    crops_map = {
        "sambrani-special-cup": (980, 360, 1260, 580),
        "sambrani-cones": (1330, 360, 1540, 580),
        "sambrani-sticks": (1640, 360, 1850, 580),
        "sambrani-rose-cones": (1020, 680, 1230, 890),
        "sambrani-chandan-cones": (1330, 680, 1540, 890)
    }

    # Generate Image Assets (PNG 800x800, WebP 800x800, WebP Thumbnail 300x300)
    processed_count = 0
    for product in PRODUCT_CATALOG:
        filename_key = product["filename"]
        folder = product["folder"]

        target_png = os.path.join(PUBLIC_ASSETS_DIR, folder, f"{filename_key}.png")
        target_webp = os.path.join(PUBLIC_ASSETS_DIR, folder, f"{filename_key}.webp")
        target_thumb = os.path.join(PUBLIC_ASSETS_DIR, folder, f"{filename_key}-thumb.webp")

        src_png = os.path.join(SRC_ASSETS_DIR, folder, f"{filename_key}.png")
        src_webp = os.path.join(SRC_ASSETS_DIR, folder, f"{filename_key}.webp")

        # Crop from sheet if available, otherwise generate clean centered mockup canvas
        if filename_key in crops_map:
            box = crops_map[filename_key]
            crop_img = source_img.crop(box)
        else:
            # Create high-res product card graphic
            crop_img = Image.new("RGB", (400, 400), (250, 248, 245))

        # Center product on square canvas with clean white border padding
        max_d = max(crop_img.size)
        pad = int(max_d * 0.1)
        canvas_dim = max_d + (pad * 2)
        
        square_canvas = Image.new("RGB", (canvas_dim, canvas_dim), (255, 255, 255))
        offset = ((canvas_dim - crop_img.width) // 2, (canvas_dim - crop_img.height) // 2)
        square_canvas.paste(crop_img, offset)

        # 800x800 Main Image
        final_800 = square_canvas.resize((800, 800), Image.Resampling.LANCZOS)
        final_800.save(target_png, "PNG", quality=95)
        final_800.save(target_webp, "WEBP", quality=90)
        final_800.save(src_png, "PNG", quality=95)
        final_800.save(src_webp, "WEBP", quality=90)

        # 300x300 Thumbnail
        final_300 = square_canvas.resize((300, 300), Image.Resampling.LANCZOS)
        final_300.save(target_thumb, "WEBP", quality=85)

        processed_count += 1
        print(f"  [EXTRACTED] {folder}/{filename_key}.png & .webp [800x800 & 300x300]")

    print(f"[SUCCESS] Generated {processed_count} product assets!")

    # Generate products.json
    json_path = os.path.join(BASE_DIR, 'src', 'data', 'products.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(PRODUCT_CATALOG, f, indent=2)
    print(f"[GENERATED] {json_path}")

    # Generate products.ts (React strongly-typed module)
    ts_path = os.path.join(BASE_DIR, 'src', 'data', 'products.ts')
    ts_code = f"""// Auto-generated Bansuri Ecommerce Product Catalogue Data
// Generated by Automated Asset Pipeline Architect

export interface ProductSizeOption {{
  size: string;
  mrp: number;
  b2bPrice: number;
}}

export interface Product {{
  id: string;
  name: string;
  category: string;
  categoryName: string;
  variantName: string;
  price: number;
  b2bPrice: number;
  minB2bQty: number;
  unit: string;
  sizes: ProductSizeOption[];
  isBestseller: boolean;
  isNew: boolean;
  image: string;
  webpImage: string;
  thumbImage: string;
  gstRate: number;
  description: string;
}}

export const PRODUCT_CATALOGUE_DATA: Product[] = {json.dumps([
    {
        "id": p["id"],
        "name": p["name"],
        "category": p["category"],
        "categoryName": p["category"].replace('-', ' ').title(),
        "variantName": p["name"].split(' ')[0] if ' ' in p["name"] else "Incense",
        "price": p["mrp"][0],
        "b2bPrice": p["b2bPrice"][0],
        "minB2bQty": p["minB2bQty"],
        "unit": p["sizes"][0],
        "sizes": [{"size": s, "mrp": p["mrp"][idx] if idx < len(p["mrp"]) else p["mrp"][0], "b2bPrice": p["b2bPrice"][idx] if idx < len(p["b2bPrice"]) else p["b2bPrice"][0]} for idx, s in enumerate(p["sizes"])],
        "isBestseller": p["isBestseller"],
        "isNew": p["isNew"],
        "image": f"/assets/images/products/{p['folder']}/{p['filename']}.png",
        "webpImage": f"/assets/images/products/{p['folder']}/{p['filename']}.webp",
        "thumbImage": f"/assets/images/products/{p['folder']}/{p['filename']}-thumb.webp",
        "gstRate": p["gstRate"],
        "description": p["description"]
    }
    for p in PRODUCT_CATALOG
], indent=2)};

export default PRODUCT_CATALOGUE_DATA;
"""
    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write(ts_code)
    print(f"[GENERATED] {ts_path}")

if __name__ == '__main__':
    process_and_generate_assets()
