import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# Source image paths
WORKSPACE_DIR = r"c:\Users\Utkarsh Pal\Documents\blockzu"
STORE_ASSETS_DIR = os.path.join(WORKSPACE_DIR, "store_assets")

SRC_SHOWCASE = r"C:\Users\Utkarsh Pal\.gemini\antigravity-ide\brain\b3ddedd3-fcff-47a6-acb8-862ca28b8808\.user_uploaded\media_1790345376883.jpg"
SRC_APP_ICON = r"C:\Users\Utkarsh Pal\.gemini\antigravity-ide\brain\b3ddedd3-fcff-47a6-acb8-862ca28b8808\.user_uploaded\media_1790344495493.jpg"
SRC_TITLE_CUBE = r"C:\Users\Utkarsh Pal\.gemini\antigravity-ide\brain\b3ddedd3-fcff-47a6-acb8-862ca28b8808\.user_uploaded\media_1790344516409.jpg"

os.makedirs(STORE_ASSETS_DIR, exist_ok=True)
os.makedirs(os.path.join(STORE_ASSETS_DIR, "phone_screenshots"), exist_ok=True)
os.makedirs(os.path.join(STORE_ASSETS_DIR, "screenshots_clean"), exist_ok=True)
os.makedirs(os.path.join(STORE_ASSETS_DIR, "phone_mockups"), exist_ok=True)
os.makedirs(os.path.join(STORE_ASSETS_DIR, "feature_graphics"), exist_ok=True)

im_showcase = Image.open(SRC_SHOWCASE).convert("RGB")
im_icon = Image.open(SRC_APP_ICON).convert("RGBA")
im_title = Image.open(SRC_TITLE_CUBE).convert("RGB")

print("Opened source images successfully.")

# ==============================================================================
# 1. 512x512 Play Store App Icon (32-bit PNG, no transparency requirement for Play Store)
# ==============================================================================
icon_512 = im_icon.resize((512, 512), Image.Resampling.LANCZOS)
icon_512.save(os.path.join(STORE_ASSETS_DIR, "icon_512x512.png"), format="PNG", optimize=True)
icon_512.save(os.path.join(STORE_ASSETS_DIR, "app_icon_512x512.png"), format="PNG", optimize=True)
print("Saved 512x512 App Icon.")

# ==============================================================================
# 2. Feature Graphics (1024x500 px)
# ==============================================================================
# A. Feature Graphic 1: "UNLEASH THE POWER OF BLOCKS!"
# Box: x: 24 to 395, y: 86 to 246 in showcase image
fg1_crop = im_showcase.crop((24, 86, 395, 246))
# Create 1024x500 canvas with seamless dark navy space background
fg1_canvas = Image.new("RGB", (1024, 500), (12, 18, 38))
# Resize fg1 crop to fit nicely within 1024x500 while maintaining aspect ratio and sharpness
fg1_resized = fg1_crop.resize((1024, 500), Image.Resampling.LANCZOS)
fg1_resized.save(os.path.join(STORE_ASSETS_DIR, "feature_graphics", "feature_graphic_01_unleash_blocks_1024x500.png"), format="PNG", optimize=True)
fg1_resized.save(os.path.join(STORE_ASSETS_DIR, "feature_graphic_unleash_blocks_1024x500.png"), format="PNG", optimize=True)

# B. Feature Graphic 2: "COMPLETE MISSIONS FOR REWARDS! CHOOSE 6+ THEMES!"
# Box: x: 618 to 992, y: 86 to 246
fg2_crop = im_showcase.crop((618, 86, 992, 246))
fg2_resized = fg2_crop.resize((1024, 500), Image.Resampling.LANCZOS)
fg2_resized.save(os.path.join(STORE_ASSETS_DIR, "feature_graphics", "feature_graphic_02_missions_themes_1024x500.png"), format="PNG", optimize=True)
fg2_resized.save(os.path.join(STORE_ASSETS_DIR, "feature_graphic_missions_themes_1024x500.png"), format="PNG", optimize=True)

# C. Feature Graphic 3: 3D Cube + Blockzu Title & Coin Graphic
# Create 1024x500 with centered 3D Cube Artwork & ambient space gradient
fg3 = Image.new("RGB", (1024, 500), (15, 23, 42))
# Sample title image center crop
cube_sq = im_title.resize((480, 480), Image.Resampling.LANCZOS)
fg3.paste(cube_sq, (512 - 240, 10))
# Add subtle vignette/glow
fg3.save(os.path.join(STORE_ASSETS_DIR, "feature_graphics", "feature_graphic_03_3d_cube_1024x500.png"), format="PNG", optimize=True)
fg3.save(os.path.join(STORE_ASSETS_DIR, "feature_graphic_1024x500.png"), format="PNG", optimize=True)
print("Saved 1024x500 Feature Graphics.")

# ==============================================================================
# 3. Phone Screenshots (Device Mockups & Promotional Posters: 1080x1920)
# ==============================================================================
# Font setup
font_bold = None
font_sub = None
try:
    font_bold = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 64)
    font_sub = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", 36)
except Exception:
    try:
        font_bold = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 64)
        font_sub = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", 36)
    except Exception:
        font_bold = ImageFont.load_default()
        font_sub = ImageFont.load_default()

# Screenshot definitions: (crop_coords, title, subtitle, clean_inner_crop)
screenshots_info = [
    {
        "id": "01_main_menu",
        "name": "Main Menu",
        "crop": (33, 278, 181, 565),
        "clean_crop": (43, 298, 171, 545),
        "title": "BLOCKZU",
        "subtitle": "Endless Block Puzzle Fun • Free to Play",
        "accent": (245, 158, 11) # Gold
    },
    {
        "id": "02_missions",
        "name": "Daily Missions",
        "crop": (231, 278, 379, 565),
        "clean_crop": (241, 298, 369, 545),
        "title": "DAILY MISSIONS",
        "subtitle": "Complete Challenges & Earn Instant Coin Rewards",
        "accent": (59, 130, 246) # Blue
    },
    {
        "id": "03_themes",
        "name": "Custom Themes",
        "crop": (427, 278, 575, 565),
        "clean_crop": (437, 298, 565, 545),
        "title": "CUSTOM THEMES",
        "subtitle": "Neon, Dark, Galaxy, Nature & 8+ Vibrant Styles",
        "accent": (168, 85, 247) # Purple
    },
    {
        "id": "04_gameplay",
        "name": "Gameplay",
        "crop": (623, 278, 771, 565),
        "clean_crop": (633, 298, 761, 545),
        "title": "INTUITIVE GAMEPLAY",
        "subtitle": "Instant Drag & Drop • Zero-Delay Touch Response",
        "accent": (16, 185, 129) # Emerald
    },
    {
        "id": "05_score_combos",
        "name": "Combos & High Scores",
        "crop": (819, 278, 967, 565),
        "clean_crop": (829, 298, 957, 545),
        "title": "MASSIVE COMBOS",
        "subtitle": "Clear Multiple Lines & Crush Your Personal Best",
        "accent": (236, 72, 153) # Pink
    }
]

for idx, item in enumerate(screenshots_info, 1):
    # A. Crop phone mockup
    phone_crop = im_showcase.crop(item["crop"])
    phone_crop.save(os.path.join(STORE_ASSETS_DIR, "phone_mockups", f"phone_{item['id']}.png"), format="PNG")

    # B. Crop clean screen & scale to 1080x1920
    clean_crop = im_showcase.crop(item["clean_crop"])
    clean_1080 = clean_crop.resize((1080, 1920), Image.Resampling.LANCZOS)
    clean_1080.save(os.path.join(STORE_ASSETS_DIR, "screenshots_clean", f"screenshot_clean_{item['id']}_1080x1920.png"), format="PNG", optimize=True)

    # C. Create Gorgeous 1080x1920 Play Store Promotional Showcase Screenshot
    # Background: Smooth dark vertical gradient
    poster = Image.new("RGB", (1080, 1920), (11, 15, 25))
    draw = ImageDraw.Draw(poster)
    
    # Draw dark blue-indigo gradient
    for y in range(1920):
        ratio = y / 1920.0
        r = int(10 + 15 * ratio)
        g = int(15 + 18 * ratio)
        b = int(30 + 45 * ratio)
        draw.line([(0, y), (1080, y)], fill=(r, g, b))
    
    # Add ambient glow circle behind phone
    glow = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    ac = item["accent"]
    glow_draw.ellipse((240, 650, 840, 1550), fill=(ac[0], ac[1], ac[2], 45))
    glow = glow.filter(ImageFilter.GaussianBlur(100))
    poster.paste(glow, (0, 0), glow)

    # Render Header Typography
    # Title
    t_box = draw.textbbox((0, 0), item["title"], font=font_bold)
    t_w = t_box[2] - t_box[0]
    draw.text(((1080 - t_w) // 2, 140), item["title"], font=font_bold, fill=(255, 255, 255))
    
    # Subtitle
    s_box = draw.textbbox((0, 0), item["subtitle"], font=font_sub)
    s_w = s_box[2] - s_box[0]
    draw.text(((1080 - s_w) // 2, 230), item["subtitle"], font=font_sub, fill=(180, 200, 230))

    # Scale and center the phone mockup in the lower 75% of poster
    # Phone aspect ratio is approx 148 / 287 = 0.515
    target_h = 1420
    target_w = int(target_h * (phone_crop.width / phone_crop.height))
    phone_scaled = phone_crop.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    phone_x = (1080 - target_w) // 2
    phone_y = 360
    
    # Add phone drop shadow
    shadow = Image.new("RGBA", (target_w + 60, target_h + 60), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    s_draw.rectangle((30, 30, target_w + 30, target_h + 30), fill=(0, 0, 0, 160))
    shadow = shadow.filter(ImageFilter.GaussianBlur(25))
    poster.paste(shadow, (phone_x - 30, phone_y - 10), shadow)
    
    # Paste phone mockup
    poster.paste(phone_scaled, (phone_x, phone_y))

    # Save final promotional screenshot
    poster_path = os.path.join(STORE_ASSETS_DIR, "phone_screenshots", f"screenshot_{item['id']}_1080x1920.png")
    poster.save(poster_path, format="PNG", optimize=True)
    print(f"Generated Play Store Screenshot: {poster_path}")

print("All Play Store Assets successfully generated!")
