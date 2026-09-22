# Changelog

All notable changes to **Blockzu** are documented in this file.
The project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2026-09-22

### 🚀 Initial Commercial Release (v1.0.0 / Build 1)
Official public launch of **Blockzu**, the modern casual 8×8 block puzzle game.

### 🎮 Core Gameplay & Mechanics
- **Classic 8×8 Grid Board**: Responsive canvas scaling with high-contrast cells and drag-and-drop piece placement.
- **Polyomino Piece System**: 19 distinct polyomino shapes (monomino, dominoes, trominoes, tetrominoes, and pentaminoes) with intelligent 3-piece tray spawning.
- **Dynamic Scoring & Combos**: Score calculation factoring placed block counts, single/multi-line clears, streak multipliers, and cascading board wipes.
- **Move Availability Solver**: Real-time board solver detecting game-over states and highlighting placeable tray pieces.

### 🎨 Visuals & Themes
- **6 Handcrafted Themes**:
  - *Classic* (Default Royal Sapphire)
  - *Dark* (Sleek Obsidian & Slate)
  - *Neon* (Cyberpunk Cyan & Magenta)
  - *Nature* (Emerald Forest & Leaf)
  - *Ocean* (Aquamarine Deep Sea)
  - *Galaxy* (Prestige Cosmic Violet)
  - *Golden* (Secret 100% Collector Achievement Trophy Theme)
- **Visual Polish & Game Feel**:
  - Ascending pitch ladder placement audio feedback (C4 $\rightarrow$ C5).
  - Expanding shockwave energy rings and sparkling star particles on line clears.
  - Multi-tiered board danger auras (Warning, Danger, Critical Heartbeat).
  - Staggered spring piece refill pop animations.

### 🏆 Progression & Retention
- **20 Launch Achievements**: Categorized milestone achievements with coin bounties.
- **Tiered Daily Missions**: 3 active daily missions (Easy, Medium, Hard) across 5 distinct gameplay categories with automatic replacement rolls.
- **7-Day Daily Login Rewards**: Consecutive login streak rewards with day 7 jackpot bounty.
- **Player Statistics Dashboard**: 8 tracked gameplay metrics with persistent local stats.

### 💰 Economy & Monetization
- **Fair Player-First Monetization**: Zero intrusive popups or banner ads during active gameplay rounds.
- **Rewarded Video Revive**: 1 continue per match clearing 8–12 random occupied cells.
- **Rewarded Coin Bounty**: Daily 5-ad rewarded video cap (50 coins/view, max 250 coins/day).
- **Graceful Interstitial Cooldown**: Maximum 1 interstitial every 4th game over with strict 3-minute cooldown.

### 💾 Architecture, Save System & Telemetry
- **Canonical LocalStorage Persistence**: Dual-snapshot storage engine with automatic backup restoration upon corrupted JSON payload.
- **Beta Analytics Telemetry Engine**: Local metrics aggregation (Average Score, Games Played, Themes Purchased, Achievements Claimed, Revives Used, Session Length) with developer console export API (`window.blockzuAnalytics`).
- **Comprehensive Automated QA Suite**: 87/87 automated invariant & exploit test coverage (`npm test`).

### 📱 Distribution & Platform Readiness
- **Progressive Web App (PWA)**: Installable standalone PWA with Workbox offline service worker caching.
- **Android Ready**: Trusted Web Activity (TWA) and Capacitor packaging guide with Google Play Store listing metadata.
- **Privacy Policy**: Dedicated compliant privacy policy page at `/privacy.html`.
