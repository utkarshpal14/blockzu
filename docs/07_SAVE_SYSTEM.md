# BLOCKZU
## Document 07 — Save System Architecture
### Version 1.1 (Revised)

**Project Name:** Blockzu  
**Genre:** Casual Puzzle / Block Puzzle  
**Platform:** Web, PWA, Android  
**Developer:** PriorApp Games  
**Status:** Save System Frozen

---

> **⚠️ CANONICAL DATA MODEL NOTICE**
> This document is the **single source of truth** for all save-related TypeScript interfaces in Blockzu (`PlayerData`, `AchievementData`, `MissionData`, `ThemeData`, `EconomyData`, `StatisticsData`, `SettingsData`, `ProfileData`). No other document should redefine these types. Document 03 (Technical Architecture) and Document 05 (Achievements & Missions) reference these definitions rather than duplicating them — see Section 8 onward below.
>
> **Revision note (v1.1):** Previous versions of Docs 03, 05, and 07 defined overlapping but inconsistent versions of these interfaces (different field sets, different names for identical shapes — e.g. `MissionProgress` vs `MissionData`). This revision consolidates everything here as the authoritative version.

---

# 1. Purpose

This document defines:

- Save Architecture
- Save Data Structure
- Persistence Strategy
- Backup Strategy
- Data Migration System
- Future Cloud Save Compatibility

The save system must be:

```text
Fast
Reliable
Offline First
Future Proof
```

---

# 2. Save System Goals

The save system must:

```text
Persist Progress
Survive App Restarts
Work Offline
Support Future Cloud Sync
Handle Version Upgrades
```

---

# 3. Storage Strategy

## Web

Storage:

```text
LocalStorage
```

---

## Android

Storage:

```text
Capacitor Preferences
```

---

## Future

```text
Firebase Cloud Save
```

Not included in Version 1.0.

---

# 4. Save Architecture

```text
Game
 │
 ▼
SaveManager
 │
 ▼
StorageService
 │
 ├── LocalStorage
 └── Capacitor Preferences
```

---

# 5. Save Manager Responsibilities

```text
Load Data
Save Data
Validate Data
Migrate Data
Reset Data
```

---

# 6. Save Frequency

## Immediate Save Events

Save instantly when:

```text
Game Ends
Achievement Claimed
Mission Claimed
Theme Purchased
Settings Changed
```

---

## Delayed Save Events

```text
Every 30 Seconds
```

during active gameplay.

---

# 7. Save File Key

## Production Key

```text
blockzu_player_data
```

---

# 8. Save Data Structure (CANONICAL)

This is the authoritative `PlayerData` interface. All other documents must reference this definition rather than redefining it.

```typescript
interface PlayerData {
  version: string;
  profile: ProfileData;
  statistics: StatisticsData;
  achievements: AchievementData[];
  missions: MissionData[];
  themes: ThemeData;
  economy: EconomyData;
  settings: SettingsData;
}
```

---

# 9. Profile Data (CANONICAL)

```typescript
interface ProfileData {
  bestScore: number;
  totalGamesPlayed: number;
}
```

---

# 10. Statistics Data (CANONICAL)

```typescript
interface StatisticsData {
  highestScore: number;
  totalScore: number;
  gamesPlayed: number;
  linesCleared: number;
  blocksPlaced: number;
  longestCombo: number;
  averageScore: number;
}
```

---

# 11. Achievement Data (CANONICAL)

> Referenced throughout the project as `AchievementData`. Document 05 previously called this shape `AchievementProgress` — that name is deprecated; use `AchievementData` everywhere.

```typescript
interface AchievementData {
  id: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}
```

---

# 12. Mission Data (CANONICAL)

> Referenced throughout the project as `MissionData`. Documents 03 and 05 previously called this shape `MissionProgress` — that name is deprecated; use `MissionData` everywhere.

```typescript
interface MissionData {
  id: string;
  progress: number;
  target: number;
  claimed: boolean;
}
```

---

# 13. Theme Data (CANONICAL — save state)

> **Important distinction:** `ThemeData` (below) is the player's *save-state record* of which themes are unlocked/active. This is different from the `Theme` interface in Document 03 Section 16, which defines the *static catalog entry* for a theme (its id, name, and color values). Both are needed — they serve different purposes and are not in conflict.

```typescript
interface ThemeData {
  activeTheme: string;
  unlockedThemes: string[];
}
```

---

# 14. Economy Data (CANONICAL)

```typescript
interface EconomyData {
  coins: number;
}
```

---

# 15. Settings Data (CANONICAL)

```typescript
interface SettingsData {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
}
```

---

# 16. Example Save File

```json
{
  "version": "1.0.0",
  "profile": {
    "bestScore": 5420,
    "totalGamesPlayed": 85
  },
  "economy": {
    "coins": 3400
  },
  "themes": {
    "activeTheme": "dark",
    "unlockedThemes": [
      "classic",
      "dark"
    ]
  }
}
```

---

# 17. Save Validation

Every save loaded must pass validation.

---

## Validation Checks

```text
Required Fields Exist
Correct Data Types
No Null Values
Version Present
```

---

## Invalid Save

If validation fails:

```text
Create Fresh Save
```

and log error.

---

# 18. Default Save Data

```typescript
const DEFAULT_PLAYER_DATA: PlayerData
```

Contains:

```text
Classic Theme
0 Coins
No Achievements
No Statistics
Default Settings
```

---

# 19. Auto Save System

## Trigger

```text
Every 30 Seconds
```

---

## Trigger

```text
Game Over
```

---

## Trigger

```text
App Backgrounded
```

---

## Trigger

```text
App Closed
```

when possible.

---

# 20. Data Integrity

Never overwrite save data before validation.

---

Process:

```text
Load
↓
Validate
↓
Use
```

---

# 21. Save Versioning

Each save stores:

```text
Version Number
```

---

Example

```json
{
  "version": "1.0.0"
}
```

---

# 22. Migration System

Purpose:

Allow future updates.

---

Example

```text
1.0.0
 ↓
1.1.0
 ↓
1.2.0
```

without data loss.

---

# 23. Migration Architecture

```text
MigrationManager
 │
 ├── v1_0_0
 ├── v1_1_0
 └── v1_2_0
```

---

# 24. Backup Strategy

Before migration:

```text
Create Backup
```

---

Example Key

```text
blockzu_backup_data
```

---

# 25. Corruption Recovery

If save is corrupted:

```text
Restore Backup
```

---

If backup invalid:

```text
Generate New Save
```

---

# 26. Reset Progress

Available in Settings.

---

Flow:

```text
Settings
 ↓
Reset Progress
 ↓
Confirmation Dialog
 ↓
Delete Save
 ↓
Generate Default Save
```

---

# 27. Theme Persistence

Save:

```text
Unlocked Themes
Active Theme
```

---

Restore automatically at launch.

---

# 28. Achievement Persistence

Save:

```text
Progress
Completion
Claim Status
```

---

# 29. Mission Persistence

Save:

```text
Mission Progress
Mission Completion
Claim Status
```

---

# 30. Statistics Persistence

Save:

```text
Highest Score
Games Played
Lines Cleared
Blocks Placed
Longest Combo
Average Score
```

---

# 31. Economy Persistence

Save:

```text
Coin Balance
```

---

Never allow:

```text
Negative Coins
```

---

# 32. Performance Requirements

Save Operation:

```text
< 50ms
```

---

Load Operation:

```text
< 100ms
```

---

# 33. Security Rules

Version 1.0 is offline.

No server validation.

---

Protection:

```text
Basic Validation
Integrity Checks
```

---

Not Included:

```text
Encryption
Anti Cheat
Server Verification
```

---

# 34. Future Cloud Save Compatibility

Architecture must support:

```text
Firebase Auth
Google Sign-In
Cloud Sync
Cross Device Progress
```

---

Future Flow

```text
Local Save
      ↓
Cloud Sync
      ↓
Restore Anywhere
```

---

# 35. Cloud Save Conflict Strategy

Future Rule:

```text
Highest Progress Wins
```

Example:

```text
Phone A = 5000 Score

Phone B = 3500 Score

Keep 5000
```

---

# 36. Save System Testing

Must Verify:

```text
Fresh Install
App Restart
Theme Unlock
Achievement Claim
Mission Claim
Reset Progress
Migration
Corrupted Save
```

---

# 37. Save System Freeze

The save architecture defined in this document is frozen for Version 1.0.

Changes require:

1. Architecture Review
2. Documentation Update
3. Approval

---

**Document Status:** APPROVED & FROZEN  
**Version:** 1.1  
**Owner:** PriorApp Games  
**Project:** Blockzu