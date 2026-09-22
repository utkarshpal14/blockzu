import fs from 'fs';
import path from 'path';

/**
 * BLOCKZU — STORE & BRANDING ASSETS GENERATOR
 * Generates all official Google Play, PWA, Social, and Store metadata graphic assets.
 */

const ROOT_DIR = process.cwd();
const STORE_ASSETS_DIR = path.join(ROOT_DIR, 'assets', 'store');
const PUBLIC_STORE_DIR = path.join(ROOT_DIR, 'public', 'assets', 'store');

// Ensure directories exist
const directories = [
  path.join(STORE_ASSETS_DIR, 'icon'),
  path.join(STORE_ASSETS_DIR, 'screenshots', 'mobile'),
  path.join(STORE_ASSETS_DIR, 'screenshots', 'tablet'),
  path.join(STORE_ASSETS_DIR, 'feature-graphic'),
  path.join(STORE_ASSETS_DIR, 'promo'),
  path.join(STORE_ASSETS_DIR, 'social'),
  path.join(PUBLIC_STORE_DIR, 'icon'),
  path.join(PUBLIC_STORE_DIR, 'screenshots', 'mobile'),
  path.join(PUBLIC_STORE_DIR, 'screenshots', 'tablet'),
  path.join(PUBLIC_STORE_DIR, 'feature-graphic'),
  path.join(PUBLIC_STORE_DIR, 'promo'),
  path.join(PUBLIC_STORE_DIR, 'social')
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 1. App Icon SVG (512x512 / 1024x1024)
function getAppIconSvg(size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#070A14"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#EAB308"/>
    </linearGradient>
    <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185"/>
      <stop offset="100%" stop-color="#E11D48"/>
    </linearGradient>
    <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C084FC"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="${size * 0.02}" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <!-- Background with rounded corners -->
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bgGrad)"/>
  <!-- Border outline -->
  <rect x="${size * 0.02}" y="${size * 0.02}" width="${size * 0.96}" height="${size * 0.96}" rx="${size * 0.20}" fill="none" stroke="#38BDF8" stroke-width="${size * 0.015}" stroke-opacity="0.4"/>
  
  <!-- 2x2 Glowing Polyomino Block Pattern -->
  <!-- Block 1: Cyan Top Left -->
  <rect x="${size * 0.22}" y="${size * 0.22}" width="${size * 0.25}" height="${size * 0.25}" rx="${size * 0.04}" fill="url(#cyanGrad)" filter="url(#glow)"/>
  <!-- Block 2: Gold Top Right -->
  <rect x="${size * 0.53}" y="${size * 0.22}" width="${size * 0.25}" height="${size * 0.25}" rx="${size * 0.04}" fill="url(#goldGrad)" filter="url(#glow)"/>
  <!-- Block 3: Violet Bottom Left -->
  <rect x="${size * 0.22}" y="${size * 0.53}" width="${size * 0.25}" height="${size * 0.25}" rx="${size * 0.04}" fill="url(#violetGrad)" filter="url(#glow)"/>
  <!-- Block 4: Rose Bottom Right -->
  <rect x="${size * 0.53}" y="${size * 0.53}" width="${size * 0.25}" height="${size * 0.25}" rx="${size * 0.04}" fill="url(#roseGrad)" filter="url(#glow)"/>
  
  <!-- Inner Highlight Gloss -->
  <circle cx="${size * 0.30}" cy="${size * 0.28}" r="${size * 0.03}" fill="#FFFFFF" fill-opacity="0.6"/>
  <circle cx="${size * 0.61}" cy="${size * 0.28}" r="${size * 0.03}" fill="#FFFFFF" fill-opacity="0.6"/>
  <circle cx="${size * 0.30}" cy="${size * 0.59}" r="${size * 0.03}" fill="#FFFFFF" fill-opacity="0.6"/>
  <circle cx="${size * 0.61}" cy="${size * 0.59}" r="${size * 0.03}" fill="#FFFFFF" fill-opacity="0.6"/>

  <!-- Logo Typography -->
  <text x="${size * 0.5}" y="${size * 0.90}" font-family="'Poppins', 'Segoe UI', sans-serif" font-weight="800" font-size="${size * 0.11}px" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">BLOCKZU</text>
</svg>`;
}

// 2. Feature Graphic SVG (1024x500 for Google Play)
function getFeatureGraphicSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500" width="1024" height="500">
  <defs>
    <linearGradient id="featBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E1B4B"/>
      <stop offset="40%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="textGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <linearGradient id="cyanPill" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#featBg)"/>
  
  <!-- Grid Accent Background Lines -->
  <g opacity="0.12" stroke="#38BDF8" stroke-width="1.5">
    <line x1="600" y1="50" x2="950" y2="50"/>
    <line x1="600" y1="110" x2="950" y2="110"/>
    <line x1="600" y1="170" x2="950" y2="170"/>
    <line x1="600" y1="230" x2="950" y2="230"/>
    <line x1="600" y1="290" x2="950" y2="290"/>
    <line x1="600" y1="350" x2="950" y2="350"/>
    <line x1="600" y1="410" x2="950" y2="410"/>
    <line x1="600" y1="50" x2="600" y2="410"/>
    <line x1="670" y1="50" x2="670" y2="410"/>
    <line x1="740" y1="50" x2="740" y2="410"/>
    <line x1="810" y1="50" x2="810" y2="410"/>
    <line x1="880" y1="50" x2="880" y2="410"/>
    <line x1="950" y1="50" x2="950" y2="410"/>
  </g>

  <!-- Visual 3D Blocks in Grid -->
  <rect x="672" y="112" width="66" height="66" rx="10" fill="#38BDF8"/>
  <rect x="742" y="112" width="66" height="66" rx="10" fill="#38BDF8"/>
  <rect x="742" y="172" width="66" height="66" rx="10" fill="#EAB308"/>
  <rect x="812" y="172" width="66" height="66" rx="10" fill="#EAB308"/>
  <rect x="812" y="232" width="66" height="66" rx="10" fill="#A855F7"/>
  <rect x="672" y="292" width="66" height="66" rx="10" fill="#F43F5E"/>
  <rect x="742" y="292" width="66" height="66" rx="10" fill="#F43F5E"/>
  <rect x="812" y="292" width="66" height="66" rx="10" fill="#F43F5E"/>

  <!-- Left Text & Branding -->
  <text x="90" y="190" font-family="'Poppins', sans-serif" font-weight="900" font-size="76px" fill="#FFFFFF" letter-spacing="3">BLOCKZU</text>
  <text x="92" y="248" font-family="'Poppins', sans-serif" font-weight="700" font-size="28px" fill="url(#textGold)">Relaxing 8×8 Block Puzzle</text>
  <text x="92" y="296" font-family="'Poppins', sans-serif" font-weight="500" font-size="20px" fill="#94A3B8">Place Shapes • Clear Lines • Trigger Combos</text>

  <!-- Feature Pills -->
  <rect x="92" y="340" width="160" height="42" rx="21" fill="url(#cyanPill)"/>
  <text x="172" y="367" font-family="'Poppins', sans-serif" font-weight="700" font-size="15px" fill="#FFFFFF" text-anchor="middle">⚡ 100% OFFLINE</text>

  <rect x="268" y="340" width="160" height="42" rx="21" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
  <text x="348" y="367" font-family="'Poppins', sans-serif" font-weight="700" font-size="15px" fill="#E2E8F0" text-anchor="middle">🎨 6+ THEMES</text>

  <rect x="444" y="340" width="170" height="42" rx="21" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
  <text x="529" y="367" font-family="'Poppins', sans-serif" font-weight="700" font-size="15px" fill="#E2E8F0" text-anchor="middle">🚫 ZERO POPUP ADS</text>
</svg>`;
}

// 3. Open Graph Social Image SVG (1200x630)
function getOgImageSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="brandGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#EAB308"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ogBg)"/>
  
  <circle cx="950" cy="315" r="240" fill="#3B82F6" fill-opacity="0.12"/>
  
  <!-- Main Title -->
  <text x="100" y="240" font-family="'Poppins', sans-serif" font-weight="900" font-size="88px" fill="#FFFFFF" letter-spacing="4">BLOCKZU</text>
  <text x="102" y="310" font-family="'Poppins', sans-serif" font-weight="700" font-size="34px" fill="url(#brandGold)">Casual 8×8 Block Puzzle Game</text>
  <text x="102" y="370" font-family="'Poppins', sans-serif" font-weight="500" font-size="24px" fill="#CBD5E1">Play Free Online • No Wifi Needed • Unlock Beautiful Themes</text>
  
  <rect x="102" y="430" width="220" height="54" rx="27" fill="#2563EB"/>
  <text x="212" y="465" font-family="'Poppins', sans-serif" font-weight="700" font-size="20px" fill="#FFFFFF" text-anchor="middle">PLAY INSTANTLY</text>

  <!-- Decorative Polyomino Cluster -->
  <g transform="translate(800, 190)">
    <rect x="0" y="0" width="70" height="70" rx="12" fill="#38BDF8"/>
    <rect x="76" y="0" width="70" height="70" rx="12" fill="#38BDF8"/>
    <rect x="152" y="0" width="70" height="70" rx="12" fill="#38BDF8"/>
    <rect x="76" y="76" width="70" height="70" rx="12" fill="#FACC15"/>
    <rect x="152" y="76" width="70" height="70" rx="12" fill="#A855F7"/>
    <rect x="152" y="152" width="70" height="70" rx="12" fill="#F43F5E"/>
  </g>
</svg>`;
}

// 4. Promo Banner SVG (1024x500)
function getPromoBannerSvg(): string {
  return getFeatureGraphicSvg();
}

// 5. Screenshots SVG Generator (Mobile: 1080x1920 / 432x768 aspect)
function getScreenshotSvg(index: number, title: string, subtitle: string, mainColor: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="ssBg${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#ssBg${index})"/>
  
  <!-- Header Text -->
  <text x="540" y="240" font-family="'Poppins', sans-serif" font-weight="800" font-size="64px" fill="#FFFFFF" text-anchor="middle">${title}</text>
  <text x="540" y="320" font-family="'Poppins', sans-serif" font-weight="600" font-size="34px" fill="${mainColor}" text-anchor="middle">${subtitle}</text>

  <!-- Device Mockup Frame -->
  <rect x="140" y="440" width="800" height="1360" rx="48" fill="#020617" stroke="#334155" stroke-width="8"/>
  
  <!-- Inner Board Area -->
  <rect x="180" y="600" width="720" height="720" rx="24" fill="#0F172A" stroke="#1E293B" stroke-width="4"/>
  
  <!-- Decorative Grid Pattern -->
  <g opacity="0.3" stroke="#334155" stroke-width="2">
    <line x1="270" y1="600" x2="270" y2="1320"/>
    <line x1="360" y1="600" x2="360" y2="1320"/>
    <line x1="450" y1="600" x2="450" y2="1320"/>
    <line x1="540" y1="600" x2="540" y2="1320"/>
    <line x1="630" y1="600" x2="630" y2="1320"/>
    <line x1="720" y1="600" x2="720" y2="1320"/>
    <line x1="810" y1="600" x2="810" y2="1320"/>
    
    <line x1="180" y1="690" x2="900" y2="690"/>
    <line x1="180" y1="780" x2="900" y2="780"/>
    <line x1="180" y1="870" x2="900" y2="870"/>
    <line x1="180" y1="960" x2="900" y2="960"/>
    <line x1="180" y1="1050" x2="900" y2="1050"/>
    <line x1="180" y1="1140" x2="900" y2="1140"/>
    <line x1="180" y1="1230" x2="900" y2="1230"/>
  </g>

  <!-- Colorful placed blocks -->
  <rect x="274" y="694" width="82" height="82" rx="14" fill="#38BDF8"/>
  <rect x="364" y="694" width="82" height="82" rx="14" fill="#38BDF8"/>
  <rect x="454" y="694" width="82" height="82" rx="14" fill="#38BDF8"/>
  <rect x="454" y="784" width="82" height="82" rx="14" fill="#FACC15"/>
  <rect x="544" y="784" width="82" height="82" rx="14" fill="#FACC15"/>
  <rect x="544" y="874" width="82" height="82" rx="14" fill="#A855F7"/>
  <rect x="634" y="874" width="82" height="82" rx="14" fill="#A855F7"/>
  <rect x="724" y="874" width="82" height="82" rx="14" fill="#F43F5E"/>
  
  <!-- Piece Tray Area -->
  <rect x="180" y="1420" width="720" height="260" rx="24" fill="#0F172A" stroke="#1E293B" stroke-width="3"/>
  <rect x="240" y="1500" width="140" height="100" rx="16" fill="#38BDF8" fill-opacity="0.8"/>
  <rect x="470" y="1470" width="140" height="140" rx="16" fill="#FACC15" fill-opacity="0.8"/>
  <rect x="700" y="1500" width="140" height="100" rx="16" fill="#A855F7" fill-opacity="0.8"/>
</svg>`;
}

// Generate all files
console.log('📦 Generating Store & Branding Graphic Assets...');

// App Icons
fs.writeFileSync(path.join(STORE_ASSETS_DIR, 'icon', 'icon-512.svg'), getAppIconSvg(512));
fs.writeFileSync(path.join(STORE_ASSETS_DIR, 'icon', 'icon-1024.svg'), getAppIconSvg(1024));
fs.writeFileSync(path.join(STORE_ASSETS_DIR, 'icon', 'adaptive-icon.svg'), getAppIconSvg(512));
fs.writeFileSync(path.join(PUBLIC_STORE_DIR, 'icon', 'icon-512.svg'), getAppIconSvg(512));
fs.writeFileSync(path.join(PUBLIC_STORE_DIR, 'icon', 'icon-1024.svg'), getAppIconSvg(1024));
fs.writeFileSync(path.join(PUBLIC_STORE_DIR, 'icon', 'adaptive-icon.svg'), getAppIconSvg(512));

// Feature Graphic
fs.writeFileSync(path.join(STORE_ASSETS_DIR, 'feature-graphic', 'feature-graphic.svg'), getFeatureGraphicSvg());
fs.writeFileSync(path.join(PUBLIC_STORE_DIR, 'feature-graphic', 'feature-graphic.svg'), getFeatureGraphicSvg());

// Social Open Graph
fs.writeFileSync(path.join(STORE_ASSETS_DIR, 'social', 'og-image.svg'), getOgImageSvg());
fs.writeFileSync(path.join(STORE_ASSETS_DIR, 'social', 'twitter-card.svg'), getOgImageSvg());
fs.writeFileSync(path.join(PUBLIC_STORE_DIR, 'social', 'og-image.svg'), getOgImageSvg());
fs.writeFileSync(path.join(PUBLIC_STORE_DIR, 'social', 'twitter-card.svg'), getOgImageSvg());

// Promo Banner
fs.writeFileSync(path.join(STORE_ASSETS_DIR, 'promo', 'promo-banner.svg'), getPromoBannerSvg());
fs.writeFileSync(path.join(PUBLIC_STORE_DIR, 'promo', 'promo-banner.svg'), getPromoBannerSvg());

// Screenshots (Mobile 1 to 5)
const mobileScreenshots = [
  { title: 'CLASSIC 8×8 PUZZLE', subtitle: 'Fit shapes & clear full lines', color: '#38BDF8' },
  { title: 'SATISFYING COMBOS', subtitle: 'Clear multiple lines for bonus score', color: '#FACC15' },
  { title: 'UNLOCK VIBRANT THEMES', subtitle: 'Dark, Neon, Nature, Ocean, Galaxy', color: '#A855F7' },
  { title: 'DAILY MISSIONS & REWARDS', subtitle: 'Complete challenges & collect coins', color: '#34D399' },
  { title: '100% OFFLINE PLAY', subtitle: 'Zero intrusive popups during play', color: '#F43F5E' }
];

mobileScreenshots.forEach((s, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  const svg = getScreenshotSvg(idx + 1, s.title, s.subtitle, s.color);
  fs.writeFileSync(path.join(STORE_ASSETS_DIR, 'screenshots', 'mobile', `screenshot-${num}.svg`), svg);
  fs.writeFileSync(path.join(PUBLIC_STORE_DIR, 'screenshots', 'mobile', `screenshot-${num}.svg`), svg);
});

// Screenshots (Tablet 1 to 3)
for (let i = 1; i <= 3; i++) {
  const num = String(i).padStart(2, '0');
  const s = mobileScreenshots[i - 1];
  const svg = getScreenshotSvg(i, s.title, s.subtitle, s.color);
  fs.writeFileSync(path.join(STORE_ASSETS_DIR, 'screenshots', 'tablet', `screenshot-${num}.svg`), svg);
  fs.writeFileSync(path.join(PUBLIC_STORE_DIR, 'screenshots', 'tablet', `screenshot-${num}.svg`), svg);
}

// Copy primary favicon into public root as well
fs.writeFileSync(path.join(ROOT_DIR, 'public', 'favicon.svg'), getAppIconSvg(192));
fs.writeFileSync(path.join(ROOT_DIR, 'public', 'og-banner.svg'), getOgImageSvg());

console.log('✅ Successfully generated all official Store & Branding assets!');
