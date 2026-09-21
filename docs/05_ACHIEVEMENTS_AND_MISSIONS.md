# BLOCKZU

## Document 05 — Achievements & Missions System

### Version 1.2 (Revised)

**Project Name:** Blockzu
**Genre:** Casual Puzzle / Block Puzzle
**Platform:** Web, PWA, Android
**Developer:** PriorApp Games
**Status:** Progression System Frozen

---

> **Revision note (v1.2):** Section 31's data model previously named these interfaces `AchievementProgress` and `MissionProgress`, which conflicted with Document 07's canonical names (`AchievementData`, `MissionData`) for the identical shapes. This revision renames them to match Document 07 exactly — Document 07 is now the single source of truth for these interfaces; Section 31 below is retained for readability but should not be treated as an independent definition.

---

# 1. Purpose

This document defines:

* Achievement System
* Mission System
* Rewards System
* Progression Design
* Theme Unlock Economy

The purpose of these systems is to increase:

* Retention
* Replayability
* Long-term engagement

without requiring online infrastructure.

---

# 2. Progression Philosophy

Blockzu is an endless puzzle game.

Progression should come from:

```text
Skill
Consistency
Mastery
Collection
```

not from pay-to-win mechanics.

---

# 3. Progression Systems Overview

Version 1.0 contains:

```text
Achievements
Missions
Theme Unlocks
Statistics
Coin Economy
```

---

# 4. Achievement System

## Purpose

Achievements provide:

* Long-term goals
* Completion incentives
* Unlock rewards
* Milestone recognition

---

# 5. Achievement Categories

```text
Beginner
Score
Gameplay
Lines
Combos
Themes
Veteran
```

---

# 6. Beginner Achievements

### First Placement

Requirement:

```text
Place First Piece
```

Reward:

```text
50 Coins
```

---

### First Game

Requirement:

```text
Finish First Match
```

Reward:

```text
100 Coins
```

---

### First Combo

Requirement:

```text
Perform First Combo
```

Reward:

```text
100 Coins
```

---

# 7. Score Achievements

### Rising Star

```text
Score 100
```

Reward:

```text
100 Coins
```

---

### Skilled Player

```text
Score 500
```

Reward:

```text
150 Coins
```

---

### Puzzle Expert

```text
Score 1000
```

Reward:

```text
250 Coins
```

---

### Master Strategist

```text
Score 2500
```

Reward:

```text
500 Coins
```

---

### Blockzu Legend

```text
Score 5000
```

Reward:

```text
1000 Coins
```

---

# 8. Gameplay Achievements

### Casual Player

```text
Play 10 Games
```

Reward:

```text
150 Coins
```

---

### Dedicated Player

```text
Play 50 Games
```

Reward:

```text
300 Coins
```

---

### Veteran Player

```text
Play 100 Games
```

Reward:

```text
750 Coins
```

---

# 9. Line Clear Achievements

### Cleaner

```text
Clear 10 Lines
```

Reward:

```text
100 Coins
```

---

### Sweeper

```text
Clear 50 Lines
```

Reward:

```text
250 Coins
```

---

### Eliminator

```text
Clear 100 Lines
```

Reward:

```text
500 Coins
```

---

### Destroyer

```text
Clear 500 Lines
```

Reward:

```text
1000 Coins
```

---

# 10. Combo Achievements

### Combo Starter

```text
10 Combos
```

Reward:

```text
200 Coins
```

---

### Combo Master

```text
50 Combos
```

Reward:

```text
500 Coins
```

---

### Combo King

```text
100 Combos
```

Reward:

```text
1000 Coins
```

---

# 11. Theme Achievements

### Stylish

```text
Unlock First Theme
```

Reward:

```text
100 Coins
```

---

### Collector

```text
Unlock All 7 Purchasable Themes
```

Reward:

```text
Secret Golden Theme (free unlock)
```

---

# 12. Total Achievement Count

```text
20 Achievements
```

Launch Target.

---

# 13. Achievement States

### Locked

```text
Gray
```

### In Progress

```text
Blue
```

### Completed

```text
Gold
```

---

# 14. Achievement Rewards

## Reward Currency

```text
Coins
```

Used for:

```text
Theme Purchases
Future Cosmetics
Future Content
```

---

# 15. Coin Economy

## Starting Coins

```text
0
```

### Earn Sources

```text
Achievements
Missions
Rewarded Ads
```

---

## Maximum Coins

```text
99999
```

Additional coins beyond the cap are not awarded.

---

# 16. Coin Visibility

Players can always view their coin balance from:

```text
Main Menu
Theme Screen
Reward Popups
```

---

# 17. Mission System

## Purpose

Provide short-term goals.

Increase engagement between sessions.

---

## Active Mission Count

```text
3 Active Missions
```

---

# 18. Mission Categories

```text
Score
Lines
Blocks
Combos
Games Played
```

---

# 19. Score Missions

Examples:

```text
Score 300
Score 500
Score 1000
```

---

# 20. Line Missions

Examples:

```text
Clear 5 Lines
Clear 10 Lines
Clear 25 Lines
```

---

# 21. Block Missions

Examples:

```text
Place 50 Blocks
Place 100 Blocks
Place 250 Blocks
```

---

# 22. Combo Missions

Examples:

```text
Get 2 Combos
Get 5 Combos
Get 10 Combos
```

---

# 23. Gameplay Missions

Examples:

```text
Play 3 Games
Play 5 Games
Play 10 Games
```

---

# 24. Mission Difficulty Tiers

### Easy

```text
50 Coins
```

### Medium

```text
100 Coins
```

### Hard

```text
200 Coins
```

---

# 25. Mission Completion Flow

```text
Mission Complete
      ↓
Claim Reward
      ↓
Coins Added
      ↓
Generate New Mission
```

---

# 26. Mission Refresh Logic

```text
Immediately After Claim
```

No waiting period.

---

# 27. Theme Economy

### Theme 1

Classic

```text
Free
```

---

### Theme 2

Dark

Requirement:

```text
Score 500
```

Cost:

```text
500 Coins
```

---

### Theme 3

Neon

Requirement:

```text
Score 1500
```

Cost:

```text
1000 Coins
```

---

### Theme 4

Nature

Requirement:

```text
Score 3000
```

Cost:

```text
1500 Coins
```

---

### Theme 5

Ocean

Requirement:

```text
Score 4000
```

Cost:

```text
2000 Coins
```

---

### Theme 6

Sunset

Requirement:

```text
Score 5000
```

Cost:

```text
2500 Coins
```

---

### Theme 7

Galaxy

Requirement:

```text
Score 7500
```

Cost:

```text
3000 Coins
```

---

### Secret Theme

Golden

Requirement:

```text
Unlock All Themes
```

Cost:

```text
Free
```

Rewarded through the Collector Achievement.

---

# 28. Rewarded Ads

Purpose:

Allow optional progression boost.

---

## Reward

```text
100 Coins
```

---

## Daily Limit

```text
5 Ads
```

Maximum:

```text
500 Coins / Day
```

---

# 29. Progression Loop

```text
Play
  ↓
Complete Missions
  ↓
Earn Coins
  ↓
Unlock Themes
  ↓
Earn Achievements
  ↓
Earn More Coins
  ↓
Continue Playing
```

---

# 30. Future Expansion Ready

Reserved for:

```text
Cosmetics
Special Themes
Seasonal Themes
Board Skins
Effects Packs
```

without changing the economy.

---

# 31. Data Model

> **See Document 07 (Save System), Sections 11, 12, and 14 for the canonical definitions of these interfaces.** They are reproduced here for readability only — Document 07 is authoritative. Note these are named `AchievementData` and `MissionData` (not `AchievementProgress` / `MissionProgress` as in earlier drafts of this document) to stay consistent project-wide.

```typescript
interface AchievementData {
  id: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}
```

```typescript
interface MissionData {
  id: string;
  progress: number;
  target: number;
  claimed: boolean;
}
```

```typescript
interface EconomyData {
  coins: number;
}
```

---

# 32. Anti-Frustration Rules

Players should never:

```text
Lose Coins
Lose Themes
Lose Achievement Progress
```

Progress only moves forward.

---

# 33. Success Metrics

Desired outcomes:

```text
More Sessions
Longer Play Time
Theme Unlock Motivation
Higher Retention
```

---

# 34. System Freeze

The achievement, mission, reward, and progression systems defined here are frozen for Version 1.0.

Changes require:

1. Design Review
2. Documentation Update
3. Approval

---

**Document Status:** APPROVED & FROZEN
**Version:** 1.2
**Owner:** PriorApp Games
**Project:** Blockzu