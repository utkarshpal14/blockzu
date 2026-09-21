# BLOCKZU
## Document 03 — Technical Architecture
### Version 1.1 (Revised)

**Project Name:** Blockzu  
**Genre:** Casual Puzzle / Block Puzzle  
**Platform:** Web, PWA, Android  
**Developer:** PriorApp Games  
**Technology Stack:** Phaser 3 + TypeScript + Vite + Capacitor  
**Status:** Architecture Frozen

---

> **Revision note (v1.1):** This document previously defined its own version of the `PlayerData` interface (Section 12) that conflicted with Document 07's version (different fields, incompatible types). That duplicate has been removed — Section 12 now references Document 07, which is the canonical source for all save-related data models. The `Theme` interface in Section 16 has been kept (it serves a different purpose than `ThemeData` — see note in that section) but the launch theme list has been updated to match the full 7-theme + secret economy defined in Document 05.

---

# 1. Purpose

This document defines the complete technical architecture of Blockzu.

It serves as the engineering blueprint for:

- Development
- Testing
- Deployment
- Scaling
- Maintenance

All implementation should follow this architecture.

---

# 2. Technology Stack

## Core Game Engine

```text
Phaser 3
```

Reason:

- Lightweight
- Excellent 2D support
- Fast Web performance
- Mobile friendly
- Large ecosystem

---

## Programming Language

```text
TypeScript
```

Reason:

- Type Safety
- Better maintainability
- Scalable codebase
- Superior tooling

---

## Build Tool

```text
Vite
```

Reason:

- Fast development server
- Fast builds
- Excellent TypeScript support

---

## PWA

```text
vite-plugin-pwa
```

Purpose:

- Offline support
- Installable experience
- iPhone compatibility

---

## Android Packaging

```text
Capacitor
```

Purpose:

- Android builds
- AdMob support
- Native functionality

---

## Hosting

```text
Vercel
```

Purpose:

- Free hosting
- CI/CD deployment
- Global CDN

---

## Version Control

```text
Git
GitHub
```

---

# 3. High-Level System Architecture

```text
App
 │
 ├── Scenes
 │
 ├── Managers
 │
 ├── Systems
 │
 ├── UI
 │
 ├── Data
 │
 └── Services
```

---

# 4. Project Structure

```text
blockzu/
│
├── docs/
│
├── public/
│   ├── icons/
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│
│   ├── assets/
│   │   ├── audio/
│   │   ├── images/
│   │   ├── particles/
│   │   └── themes/
│   │
│   ├── scenes/
│   │   ├── BootScene.ts
│   │   ├── LoadingScene.ts
│   │   ├── MainMenuScene.ts
│   │   ├── GameScene.ts
│   │   ├── SettingsScene.ts
│   │   └── GameOverScene.ts
│   │
│   ├── managers/
│   │   ├── GameManager.ts
│   │   ├── BoardManager.ts
│   │   ├── PieceManager.ts
│   │   ├── ScoreManager.ts
│   │   ├── SaveManager.ts
│   │   ├── ThemeManager.ts
│   │   ├── MissionManager.ts
│   │   ├── AchievementManager.ts
│   │   ├── AudioManager.ts
│   │   ├── AdManager.ts
│   │   └── StatisticsManager.ts
│   │
│   ├── systems/
│   │   ├── PlacementSystem.ts
│   │   ├── ClearSystem.ts
│   │   ├── ComboSystem.ts
│   │   ├── MissionSystem.ts
│   │   └── AchievementSystem.ts
│   │
│   ├── ui/
│   │   ├── components/
│   │   ├── dialogs/
│   │   └── overlays/
│   │
│   ├── data/
│   │   ├── achievements.ts
│   │   ├── missions.ts
│   │   ├── themes.ts
│   │   └── pieces.ts
│   │
│   ├── services/
│   │   ├── StorageService.ts
│   │   ├── AdService.ts
│   │   └── AudioService.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── config.ts
│   │   └── gameplay.ts
│   │
│   ├── types/
│   │   ├── PlayerData.ts
│   │   ├── Statistics.ts
│   │   ├── Achievement.ts
│   │   ├── Mission.ts
│   │   └── Theme.ts
│   │
│   ├── App.ts
│   └── main.ts
│
├── capacitor.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

> **Note:** `src/types/PlayerData.ts`, `Achievement.ts`, `Mission.ts` should implement the exact interfaces defined canonically in Document 07 (Save System), Sections 8–15. Do not redefine these shapes independently — import/reference the definitions from Document 07.

---

# 5. Scene Architecture

## Scene Flow

```text
BootScene
     ↓
LoadingScene
     ↓
MainMenuScene
     ↓
GameScene
     ↓
GameOverScene
```

---

## BootScene

Responsibilities:

- Initialize game
- Load configuration
- Start loading scene

---

## LoadingScene

Responsibilities:

- Load assets
- Display loading progress
- Prepare resources

---

## MainMenuScene

Responsibilities:

- Start Game
- Statistics
- Themes
- Settings

---

## GameScene

Responsibilities:

- Board rendering
- Piece placement
- Gameplay loop
- Scoring
- Missions

---

## GameOverScene

Responsibilities:

- Final Score
- Best Score
- Rewarded Continue
- Restart

---

# 6. Manager Architecture

Managers handle long-lived game state.

---

## GameManager

Responsibilities:

```text
Game State
Session Control
Scene Coordination
```

---

## BoardManager

Responsibilities:

```text
Board Data
Grid Updates
Cell Occupancy
```

---

## PieceManager

Responsibilities:

```text
Piece Generation
Piece Queue
Piece Placement
```

---

## ScoreManager

Responsibilities:

```text
Score Calculation
Combo Bonuses
Best Score Tracking
```

---

## SaveManager

Responsibilities:

```text
Save
Load
Reset
Migration
```

Uses the canonical `PlayerData` structure defined in Document 07.

---

## ThemeManager

Responsibilities:

```text
Theme Unlocks
Theme Application
Theme Persistence
```

---

## MissionManager

Responsibilities:

```text
Mission Generation
Mission Progress
Mission Rewards
```

---

## AchievementManager

Responsibilities:

```text
Achievement Tracking
Unlock Logic
Reward Distribution
```

---

## AudioManager

Responsibilities:

```text
Music
Sound Effects
Volume Control
```

---

## AdManager

Responsibilities:

```text
Banner Ads
Interstitial Ads
Rewarded Ads
```

---

## StatisticsManager

Responsibilities:

```text
Games Played
Blocks Placed
Lines Cleared
Average Score
```

---

# 7. Board Architecture

## Grid Structure

```typescript
type CellState = 0 | 1;
```

---

## Board Model

```typescript
const board: CellState[][] = [];
```

Dimensions:

```text
8 x 8
```

---

# 8. Piece Architecture

## Piece Model

```typescript
interface Piece {
  id: string;
  shape: number[][];
  color: string;
}
```

---

## Piece Source

```text
pieces.ts
```

Contains:

- Line Pieces
- Square Pieces
- L Pieces
- T Pieces
- Z Pieces

---

# 9. Placement System

Responsibilities:

```text
Drag Validation
Bounds Check
Collision Check
Placement Approval
```

---

## Placement Rules

Valid if:

```text
Inside Board
No Overlap
```

---

# 10. Line Clear System

Checks after every move.

---

## Detect

```text
Full Rows
Full Columns
```

---

## Execute

```text
Clear Cells
Trigger Animation
Award Score
```

---

# 11. Combo System

Responsibilities:

```text
Combo Detection
Combo Bonuses
Combo Statistics
```

---

## Formula

```text
Combo Bonus
=
Lines Cleared × 5
```

---

# 12. Save System Architecture

## Storage Layer

Web:

```text
LocalStorage
```

Android:

```text
Capacitor Preferences
```

---

## Save Key

```text
blockzu_player_data
```

---

## Player Data Model

> **See Document 07, Section 8 for the canonical `PlayerData` interface.** This document previously defined a conflicting, incomplete version of this interface — that has been removed. All `PlayerData`, `AchievementData`, `MissionData`, `ThemeData`, `EconomyData`, `StatisticsData`, `ProfileData`, and `SettingsData` types used anywhere in the codebase must match Document 07 exactly.

---

# 13. Statistics Architecture

Track:

```text
Highest Score
Games Played
Total Score
Lines Cleared
Blocks Placed
Average Score
Longest Combo
```

See Document 07, Section 10 (`StatisticsData`) for the canonical interface.

---

# 14. Achievement Architecture

## Source

```text
data/achievements.ts
```

---

## Progress Tracking

Event-driven system.

Example:

```text
Score Changed
↓
Achievement Check
↓
Unlock
```

Uses the canonical `AchievementData` interface from Document 07, Section 11.

---

# 15. Mission Architecture

## Source

```text
data/missions.ts
```

---

## Mission Count

```text
3 Active Missions
```

---

## Refresh Logic

```text
Mission Complete
↓
Generate New Mission
```

Uses the canonical `MissionData` interface from Document 07, Section 12.

---

# 16. Theme Architecture

Themes are data-driven.

---

## Theme Structure (catalog entry — distinct from `ThemeData`)

> **Important distinction:** The `Theme` interface below defines the *static catalog entry* for a theme — its id, display name, and color values, as authored by the developer in `data/themes.ts`. This is different from `ThemeData` in Document 07, Section 13, which is the *player's save-state record* of which themes are unlocked and which is currently active. Both interfaces are needed and are not in conflict — one is content data, the other is player data.

```typescript
interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}
```

---

## Launch Themes

```text
Classic
Dark
Neon
Nature
Ocean
Sunset
Galaxy
Golden (secret — unlocked via Collector achievement, not directly purchasable)
```

Full unlock requirements and coin costs are defined in Document 05, Section 27. Full color specifications are defined in Document 04, Section 23.

---

# 17. Audio Architecture

## Music

```text
Background Loop
```

---

## Sound Effects

```text
Placement
Clear
Combo
Achievement
Game Over
Button Click
```

---

# 18. Advertisement Architecture

## Platform Detection

```text
Web
↓
AdSense

Android
↓
AdMob
```

---

## Banner Ads

Locations:

```text
Main Menu
Game Over
```

---

## Interstitial Ads

Frequency:

```text
Every 4th Game Over
```

---

## Rewarded Ads

Flow:

```text
Game Over
     ↓
Watch Ad
     ↓
Continue Once
```

---

# 19. UI Architecture

## Screens

```text
Main Menu
Game
Game Over
Settings
Statistics
Themes
```

---

## UI Philosophy

```text
Premium
Modern
Polished
Mobile First
```

---

# 20. State Management

State is managed using managers.

---

## Global State

```text
Player Data
Settings
Themes
Statistics
```

---

## Session State

```text
Current Score
Board
Active Pieces
Combo Count
```

---

# 21. Asset Pipeline

## Art Assets

Format:

```text
PNG
WebP
```

---

## Audio Assets

Format:

```text
MP3
OGG
```

---

## Optimization Rules

```text
Compress Images
Lazy Load Assets
Minimize Bundle Size
```

---

# 22. Performance Targets

## Mobile

```text
60 FPS Target
```

---

## Initial Load

```text
Under 3 Seconds
```

---

## Bundle Size Goal

```text
Under 5 MB
```

---

# 23. Build Pipeline

## Development

```text
npm run dev
```

---

## Production

```text
npm run build
```

---

## Android

```text
npm run build
↓
npx cap sync
↓
Android Studio
↓
APK / AAB
```

---

# 24. Deployment Pipeline

## Web

```text
GitHub
   ↓
Vercel
   ↓
blockzu.priorapp.co.in
```

---

## Android

```text
GitHub
   ↓
Build
   ↓
Android Studio
   ↓
Play Store
```

---

# 25. Coding Standards

## Rules

```text
Strict TypeScript
No Any Types
Single Responsibility Principle
Reusable Components
Manager-Based Architecture
```

---

## Naming

```text
PascalCase
```

Example:

```typescript
ScoreManager.ts
GameScene.ts
ThemeManager.ts
```

---

## Data Model Rule

```text
All save-related interfaces (PlayerData, AchievementData, MissionData,
ThemeData, EconomyData, StatisticsData, ProfileData, SettingsData)
are defined ONLY in Document 07 (Save System) and imported/matched
everywhere else. Do not redefine these shapes in other documents or files.
```

---

# 26. Future Scalability

Architecture must support:

```text
Cloud Save
Leaderboards
Google Play Games
More Themes
More Achievements
More Missions
```

without major rewrites.

---

# 27. Architecture Freeze

The technical architecture defined in this document is frozen for Version 1.0.

Changes require:

1. Architecture Review
2. Documentation Update
3. Approval

---

**Document Status:** APPROVED & FROZEN  
**Version:** 1.1  
**Owner:** PriorApp Games  
**Project:** Blockzu