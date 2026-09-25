import os
from PIL import Image

WORKSPACE_DIR = r"c:\Users\Utkarsh Pal\Documents\blockzu"
STORE_ASSETS_DIR = os.path.join(WORKSPACE_DIR, "store_assets")
PHONE_DIR = os.path.join(STORE_ASSETS_DIR, "phone_screenshots")
FEATURE_DIR = os.path.join(STORE_ASSETS_DIR, "feature_graphics")

os.makedirs(PHONE_DIR, exist_ok=True)
os.makedirs(FEATURE_DIR, exist_ok=True)

USER_DIR = r"C:\Users\Utkarsh Pal\.gemini\antigravity-ide\brain\b3ddedd3-fcff-47a6-acb8-862ca28b8808\.user_uploaded"

# Source files
APP_ICON_SRC = os.path.join(USER_DIR, "media_1790344495493.jpg")

SCREENSHOT_SRCS = [
    ("screenshot_01_daily_quests_1080x1920.png", os.path.join(USER_DIR, "media_1790353054990.jpg"), "CHALLENGE THE DAILY QUESTS"),
    ("screenshot_02_leaderboard_1080x1920.png", os.path.join(USER_DIR, "media_1790353064523.png"), "CHALLENGE THE LEADERBOARD"),
    ("screenshot_03_daily_missions_1080x1920.png", os.path.join(USER_DIR, "media_1790353067308.png"), "CHALLENGE THE DAILY MISSIONS"),
    ("screenshot_04_stats_themes_1080x1920.png", os.path.join(USER_DIR, "media_1790353070776.png"), "MASTER STRATEGY & CLEAR LINES"),
]

FEATURE_GRAPHIC_SRC = os.path.join(USER_DIR, "media_1790353243736.png")

# 1. Official App Icon (512x512)
if os.path.exists(APP_ICON_SRC):
    im_icon = Image.open(APP_ICON_SRC).convert("RGBA")
    icon_512 = im_icon.resize((512, 512), Image.Resampling.LANCZOS)
    icon_512.save(os.path.join(STORE_ASSETS_DIR, "icon_512x512.png"), format="PNG", optimize=True)
    icon_512.save(os.path.join(STORE_ASSETS_DIR, "app_icon_512x512.png"), format="PNG", optimize=True)
    print("[OK] Saved 512x512 App Icon")

# 2. Feature Graphic (Exact 1024x500 px Google Play Specification)
if os.path.exists(FEATURE_GRAPHIC_SRC):
    im_fg = Image.open(FEATURE_GRAPHIC_SRC).convert("RGB")
    fg_1024x500 = im_fg.resize((1024, 500), Image.Resampling.LANCZOS)
    
    # Save main feature graphic and named version
    fg_path1 = os.path.join(STORE_ASSETS_DIR, "feature_graphic_1024x500.png")
    fg_path2 = os.path.join(STORE_ASSETS_DIR, "feature_graphic_missions_themes_1024x500.png")
    fg_path3 = os.path.join(FEATURE_DIR, "feature_graphic_01_missions_themes_1024x500.png")
    
    fg_1024x500.save(fg_path1, format="PNG", optimize=True)
    fg_1024x500.save(fg_path2, format="PNG", optimize=True)
    fg_1024x500.save(fg_path3, format="PNG", optimize=True)
    print("[OK] Saved 1024x500 Feature Graphic (Missions & Themes)")

# 3. Phone Screenshots (Exact 1080x1920 px 9:16 Google Play Standard)
for filename, src_path, title in SCREENSHOT_SRCS:
    if os.path.exists(src_path):
        im_ss = Image.open(src_path).convert("RGB")
        # Resize to standard Play Store 1080x1920 with high-quality Lanczos resampling
        ss_1080 = im_ss.resize((1080, 1920), Image.Resampling.LANCZOS)
        out_path = os.path.join(PHONE_DIR, filename)
        ss_1080.save(out_path, format="PNG", optimize=True)
        print(f"[OK] Saved 1080x1920 Phone Screenshot: {filename} ({title})")

print("All Play Store Assets successfully updated with full complete images!")
