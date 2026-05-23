import fitz # PyMuPDF
import io
from PIL import Image
import os

pdf_path = "Bansuri Catalouge Latest Revised (2).pdf"
output_dir = "public/products/bansuri"

os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

image_count = 0

for page_num in range(len(doc)):
    page = doc[page_num]
    image_list = page.get_images(full=True)
    print(f"Page {page_num + 1} has {len(image_list)} images")
    
    for img_idx, img_info in enumerate(image_list):
        xref = img_info[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        # Load in PIL to inspect size
        image = Image.open(io.BytesIO(image_bytes))
        width, height = image.size
        
        # Filter out tiny icon/design images (like logos or icons < 100x100)
        if width < 100 or height < 100:
            continue
            
        image_count += 1
        image_name = f"page_{page_num + 1}_img_{img_idx + 1}_{xref}.{image_ext}"
        image_path = os.path.join(output_dir, image_name)
        
        image.save(image_path)
        print(f"  Extracted: {image_name} ({width}x{height})")

print(f"Total premium images extracted: {image_count}")
