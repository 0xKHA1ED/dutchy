from pathlib import Path
from PIL import Image

def batch_convert_png_to_webp(quality=80):
    # Get current directory
    current_dir = Path('.')
    
    # Find all .png files (non-recursive)
    png_files = list(current_dir.glob('*.png'))
    
    if not png_files:
        print("No PNG files found in this directory.")
        return

    print(f"Found {len(png_files)} PNGs. Starting conversion...")

    for file_path in png_files:
        try:
            # open image
            with Image.open(file_path) as img:
                # Create output filename (e.g., image.png -> image.webp)
                dest_path = file_path.with_suffix('.webp')
                
                img.save(
                    dest_path,
                    format="webp",
                    quality=quality,
                    method=6  # Max compression effort
                )
                print(f"✔ Converted: {file_path.name} -> {dest_path.name}")
                
        except Exception as e:
            print(f"❌ Error converting {file_path.name}: {e}")

if __name__ == "__main__":
    batch_convert_png_to_webp()
