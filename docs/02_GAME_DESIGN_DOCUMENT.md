# BLOCKZU
## Document 02 — Game Design Document (GDD)
### Version 2.1 (Revised)

**Project Name:** Blockzu  
**Genre:** Casual Puzzle / Block Puzzle  
**Platform:** Web, PWA, Android  
**Developer:** PriorApp Games  
**Status:** DESIGN FROZEN

---

> **Revision note (v2.1):** Section 16 (Theme System) previously listed only 4 launch themes (Classic, Dark, Neon, Nature), which contradicted Document 05's fully-priced 7-theme + secret theme economy, and Document 04's UI spec. This revision updates Section 16 to match the full theme economy — Blockzu now launches with **7 purchasable themes plus 1 secret theme**, consistent across all documents.

---

# 1. Purpose

This document defines the complete gameplay design for Blockzu Version 1.0.

All gameplay systems, balancing decisions, progression systems, monetization rules, and player experience goals are defined here.

Any future gameplay change must update this document before implementation.

---

# 2. Game Overview

Blockzu is an endless block puzzle game where players strategically place block pieces onto an 8×8 board.

The objective is to:

- Place blocks
- Clear rows and columns
- Create combos
- Earn high scores
- Unlock rewards
- Complete missions
- Progress through achievements

The game continues until no available piece can fit on the board.

---

# 3. Core Design Pillars

## Pillar 1 — Easy To Learn

Players should understand the rules within 30 seconds.

No tutorial is required.

---

## Pillar 2 — Satisfying

Every placement, clear, and combo should feel rewarding.

Visual and audio feedback are critical.

---

## Pillar 3 — Endless Replayability

There are no levels.

Challenge comes from:

- Random pieces
- Board management
- Strategic planning

---

## Pillar 4 — Accessible Everywhere

Playable on:

- Web
- PWA
- Android

Without accounts or internet requirements.

---

# 4. Core Gameplay Loop

```text
Start Game
    ↓
Receive 3 Pieces
    ↓
Drag Piece
    ↓
Validate Placement
    ↓
Place Piece
    ↓
Check Line Clears
    ↓
Award Points
    ↓
Check Combo
    ↓
Generate New Pieces
    ↓
Repeat
    ↓
No Possible Move
    ↓
Game Over
```

---

# 5. Board System

## Board Size

```text
8 × 8
```

Total Cells:

```text
64
```

Reason:

- Industry proven
- Casual-friendly
- Better mobile experience

---

## Cell States

```text
EMPTY
FILLED
```

---

# 6. Piece System

## Active Piece Tray

The player always receives:

```text
3 Pieces
```

at a time.

When all 3 pieces are used:

```text
Generate New Set
```

---

## Piece Rotation

### Decision

```text
NO ROTATION
```

Reason:

- Simpler controls
- Easier balancing
- Matches successful competitors

---

# 7. Piece Library

## Single Block

```text
■
```

---

## Line Pieces

```text
■■

■■■

■■■■

■■■■■
```

Horizontal and vertical variants.

---

## Square Pieces

### Small Square

```text
■■
■■
```

### Large Square

```text
■■■
■■■
■■■
```

---

## L Pieces

```text
■
■
■■
```

All rotations included as separate shapes.

---

## T Pieces

```text
■■■
 ■
```

All rotations included.

---

## Z Pieces

```text
■■
 ■■
```

All rotations included.

---

## Future Shapes

Excluded from Version 1.

---

# 8. Placement Rules

Valid placement requires:

- Inside board boundaries
- No overlapping blocks

If invalid:

```text
Placement Rejected
```

---

# 9. Line Clearing System

After every placement:

Check:

```text
Rows
Columns
```

---

## Row Clear

```text
■■■■■■■■
```

Clears instantly.

---

## Column Clear

```text
■
■
■
■
■
■
■
■
```

Clears instantly.

---

## Multi-Clear

Allowed.

Examples:

```text
2 Rows

3 Columns

1 Row + 2 Columns
```

All clear simultaneously.

---

# 10. Combo System

A combo occurs when:

```text
2 or More Lines
```

are cleared from a single move.

---

## Combo Levels

### Normal

```text
1 Line
```

---

### Combo

```text
2 Lines
```

---

### Mega Combo

```text
3+ Lines
```

---

# 11. Scoring System

## Placement Score

Each placed block:

```text
+1 Point
```

Example:

```text
4 Block Piece
=
4 Points
```

---

## Line Clear Score

Each cleared line:

```text
+10 Points
```

---

## Combo Bonus

Formula:

```text
Lines Cleared × 5
```

Example:

```text
3 Lines

30 Base
15 Bonus

45 Total
```

---

# 12. Game Over System

Game Over occurs when:

```text
No Remaining Piece
Can Be Placed
```

on the board.

---

## Validation Logic

Check:

- Piece 1
- Piece 2
- Piece 3

Against every possible board position.

If all fail:

```text
GAME OVER
```

---

# 13. Statistics System

Track permanently:

```text
Highest Score
Games Played
Total Score
Lines Cleared
Blocks Placed
Average Score
Longest Combo
```

Stored locally. See Document 07, Section 10 for the canonical `StatisticsData` interface.

---

# 14. Achievement System

## Launch Goal

```text
20 Achievements
```

Full list defined in Document 05.

---

## Score Achievements

```text
Score 100
Score 500
Score 1000
Score 2500
Score 5000
```

---

## Gameplay Achievements

```text
First Placement
First Game
Play 10 Games
Play 50 Games
Play 100 Games
```

---

## Line Achievements

```text
Clear 10 Lines
Clear 50 Lines
Clear 100 Lines
Clear 500 Lines
```

---

## Combo Achievements

```text
First Combo
10 Combos
50 Combos
```

---

## Theme Achievements

```text
Unlock First Theme
Unlock All Themes
```

---

# 15. Mission System

## Mission Count

```text
3 Active Missions
```

---

## Mission Types

```text
Score 300

Score 500

Clear 5 Lines

Clear 10 Lines

Play 3 Games

Get 2 Combos

Place 50 Blocks
```

---

## Rewards

```text
Coins
Theme Progress
Achievement Progress
```

---

# 16. Theme System

Blockzu launches with **7 purchasable themes plus 1 secret theme**, unlocked through a combination of score milestones and coin costs. Full pricing and coin costs are defined in Document 05, Section 27 (Theme Economy). Full color specifications are defined in Document 04, Section 23.

---

## Theme 1 — Classic

Available by default. Free.

---

## Theme 2 — Dark

Unlock Score:

```text
500
```

---

## Theme 3 — Neon

Unlock Score:

```text
1500
```

---

## Theme 4 — Nature

Unlock Score:

```text
3000
```

---

## Theme 5 — Ocean

Unlock Score:

```text
4000
```

---

## Theme 6 — Sunset

Unlock Score:

```text
5000
```

---

## Theme 7 — Galaxy

Unlock Score:

```text
7500
```

---

## Secret Theme — Golden

Unlocked automatically via the "Collector" achievement (unlock all 7 other themes). Not directly purchasable with coins.

---

# 17. Settings

Players can control:

```text
Sound
Music
Vibration
```

---

# 18. Visual Style

## Direction

```text
Modern
Clean
Minimal
Colorful
```

---

## Goals

- High readability
- Casual appeal
- Smooth animations
- Mobile-first design

---

# 19. Audio Design

## Sound Effects

### Placement

Soft click.

### Line Clear

Satisfying pop.

### Combo

Enhanced reward sound.

### Achievement

Celebration sound.

### Game Over

Soft failure sound.

---

## Music

Version 1:

```text
Simple Relaxing Loop
```

Music can be disabled.

---

# 20. Advertisement System

Advertisements added after successful APK testing.

---

## Android

### Banner Ads

Locations:

- Main Menu
- Game Over Screen

---

### Interstitial Ads

Frequency:

```text
Every 4th Game Over
```

---

### Rewarded Ads

Offer:

```text
Watch Ad
↓
Continue Once
```

Limit:

```text
1 Continue Per Game
```

---

## Web

Google AdSense

Locations:

```text
Below Game Canvas

Below Description
```

Never over gameplay.

---

# 21. Save System

Stored Locally.

Data Saved:

```text
Best Score
Statistics
Achievements
Themes
Settings
Mission Progress
```

See Document 07 for the canonical save data structure.

---

# 22. Included Features (Version 1.0)

✅ Endless Mode

✅ Statistics

✅ Achievements

✅ Missions

✅ Theme Unlocks (7 themes + 1 secret)

✅ Sound Effects

✅ Background Music

✅ Save System

✅ PWA Support

✅ Android Support

✅ AdMob

✅ AdSense

✅ Rewarded Continue

---

# 23. Excluded Features (Version 1.0)

❌ Multiplayer

❌ User Accounts

❌ Cloud Save

❌ Global Leaderboards

❌ Friends System

❌ Online Events

❌ Competitive Ranking

❌ Backend Infrastructure

---

# 24. Release Definition

Blockzu Version 1.0 is complete when:

- Core gameplay is stable
- Achievements work
- Missions work
- Themes unlock correctly
- Ads work correctly
- Save system is reliable
- Android build passes testing
- Web build is deployed
- No critical bugs remain

---

# 25. Development Freeze Notice

The gameplay systems defined in this document are considered frozen.

Future changes require:

1. Design Review
2. Documentation Update
3. Development Approval

---

**Document Status:** APPROVED & FROZEN  
**Version:** 2.1  
**Owner:** PriorApp Games  
**Project:** Blockzu