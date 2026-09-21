# BLOCKZU
## Document 04 — UI / UX Specification
### Version 1.1 (Revised)

**Project Name:** Blockzu  
**Genre:** Casual Puzzle / Block Puzzle  
**Platform:** Web, PWA, Android  
**Orientation:** Portrait Only  
**Design Style:** Premium Polished  
**Status:** UI/UX Frozen

---

> **Revision note (v1.1):** Section 23 (Theme Specifications) previously only defined colors for 4 themes, leaving Ocean, Sunset, Galaxy, and the secret Golden theme with no visual definition — despite those themes already being priced and unlockable per Document 05. This revision adds full color specifications for all 7 themes plus the secret theme, and updates the Themes Screen layout in Section 21 to match.

---

# 1. Purpose

This document defines the complete visual and user experience specification for Blockzu.

Goals:

- Premium appearance
- Fast interactions
- High readability
- Mobile-first design
- Addictive gameplay feel
- Consistent experience across Web, PWA, and Android

---

# 2. Design Principles

## Principle 1 — Clarity First

Players should instantly understand:

- Current Score
- Best Score
- Available Pieces
- Board State

No visual clutter.

---

## Principle 2 — Touch First

Every UI element must be optimized for:

```text
Thumb Usage
```

Minimum touch target:

```text
48px
```

---

## Principle 3 — Reward Feedback

Every action must provide feedback.

Examples:

```text
Placement
Line Clear
Combo
Achievement
Mission Complete
Theme Unlock
```

---

## Principle 4 — Premium Feel

Not a student project.

Not a prototype.

The game should look like a commercial mobile game.

---

# 3. Screen Architecture

## Launch Flow

```text
Splash
   ↓
Loading
   ↓
Main Menu
   ↓
Game
   ↓
Game Over
```

---

# 4. Splash Screen

## Purpose

Brand recognition.

---

## Layout

```text
┌──────────────────┐
│                  │
│                  │
│     BLOCKZU      │
│                  │
│   PriorApp Games │
│                  │
│                  │
└──────────────────┘
```

---

## Duration

```text
1.5 Seconds
```

Maximum:

```text
2 Seconds
```

---

# 5. Loading Screen

## Elements

- Logo
- Loading Bar
- Loading Percentage

---

## Layout

```text
┌──────────────────┐
│                  │
│     BLOCKZU      │
│                  │
│  ███████░░░░░░   │
│       45%        │
│                  │
└──────────────────┘
```

---

# 6. Main Menu

## Layout

```text
┌──────────────────┐
│     BLOCKZU      │
│                  │
│   BEST SCORE     │
│      5420        │
│                  │
│  [ PLAY NOW ]    │
│                  │
│ [Themes] [Stats] │
│                  │
│ [Settings]       │
│                  │
│  Banner Ad       │
└──────────────────┘
```

---

## Buttons

### Play Now

Primary CTA.

Largest button.

---

### Themes

Opens Theme Screen.

---

### Statistics

Opens Statistics Screen.

---

### Settings

Opens Settings Screen.

---

# 7. Game Screen Layout

## Layout Structure

```text
┌────────────────────┐
│  Score     Best    │
│   340      5420    │
├────────────────────┤
│                    │
│                    │
│                    │
│      8x8 Board     │
│                    │
│                    │
│                    │
├────────────────────┤
│                    │
│   Piece Tray       │
│  [ ] [ ] [ ]       │
│                    │
└────────────────────┘
```

---

# 8. Top Bar

Contains:

```text
Current Score
Best Score
Settings Shortcut
```

---

# 9. Board Design

## Style

Premium Card.

---

## Features

- Rounded Corners
- Soft Shadow
- Subtle Border
- Elevated Surface

---

## Grid Appearance

Empty Cell:

```text
Light Gray
```

Filled Cell:

```text
Theme Color
```

---

# 10. Piece Tray

Position:

```text
Bottom Section
```

---

## Features

- 3 Active Pieces
- Large Touch Area
- Drag Friendly

---

# 11. Drag Interaction

## Pickup

Animation:

```text
Scale 1.0 → 1.08
```

---

## While Dragging

Effects:

```text
Shadow Increase
Board Highlight
```

---

## Valid Placement

Show:

```text
Green Preview
```

---

## Invalid Placement

Show:

```text
Red Preview
```

---

# 12. Placement Animation

Duration:

```text
80ms
```

---

Effects:

```text
Snap
Scale
Bounce
```

---

# 13. Line Clear Animation

Sequence:

```text
Glow
↓
Scale
↓
Fade
↓
Disappear
```

---

Duration:

```text
250ms
```

---

# 14. Combo Animation

## Trigger

2+ Lines

---

Effects:

```text
Particle Burst
Screen Shake
Combo Text
```

---

Example

```text
COMBO x2
```

---

# 15. Score Popups

Appear near board.

Examples:

```text
+10

+30

+55
```

---

Animation:

```text
Float Up
Fade Out
```

---

# 16. Game Over Screen

## Layout

```text
┌──────────────────┐
│                  │
│    GAME OVER     │
│                  │
│   Score  1240    │
│   Best   5420    │
│                  │
│ [Continue Ad]    │
│                  │
│ [Play Again]     │
│                  │
│ [Main Menu]      │
│                  │
│ Banner Ad        │
└──────────────────┘
```

---

# 17. Rewarded Continue UI

## Flow

```text
Game Over
↓
Watch Ad?
↓
Continue
```

---

## Rule

```text
1 Continue Per Match
```

---

# 18. Statistics Screen

## Data Display

```text
Highest Score
Games Played
Total Score
Blocks Placed
Lines Cleared
Average Score
Longest Combo
```

---

## Layout

Scrollable Card List.

---

# 19. Achievements Screen

## Display

Grid Layout.

---

Achievement Card

```text
Icon
Title
Progress
Reward
```

---

## States

### Locked

Gray

### In Progress

Blue

### Completed

Gold

---

# 20. Missions Screen

## Active Missions

```text
3 Missions
```

---

Mission Card

```text
Title
Progress
Reward
Claim Button
```

---

# 21. Themes Screen

## Layout

```text
Classic
Dark
Neon
Nature
Ocean
Sunset
Galaxy
Golden (secret — shown as "???" until unlocked)
```

Displayed as scrollable cards, 2 per row.

---

## Theme Card

Contains:

```text
Preview
Name
Unlock Requirement (score + coin cost, or achievement for secret theme)
Apply Button
```

---

# 22. Settings Screen

## Controls

### Sound

Toggle

---

### Music

Toggle

---

### Vibration

Toggle

---

### Reset Progress

Danger Action

Confirmation Required.

---

# 23. Theme Specifications

All 7 purchasable themes plus the secret Golden theme. Unlock requirements and coin costs are defined in Document 05, Section 27.

## Classic

Background:

```text
#F8FAFC
```

Board:

```text
#E2E8F0
```

---

## Dark

Background:

```text
#0F172A
```

Board:

```text
#1E293B
```

---

## Neon

Background:

```text
#0A0A0A
```

Board:

```text
#111111
```

Accent:

```text
Neon Blue   #00F0FF
Neon Pink   #FF2E9F
```

---

## Nature

Background:

```text
#F0FDF4
```

Board:

```text
#DCFCE7
```

---

## Ocean

Background:

```text
#ECFEFF
```

Board:

```text
#CFFAFE
```

Accent:

```text
#0891B2
```

---

## Sunset

Background:

```text
#FFF7ED
```

Board:

```text
#FFEDD5
```

Accent:

```text
#F97316
```

---

## Galaxy

Background:

```text
#1E1B4B
```

Board:

```text
#312E81
```

Accent:

```text
#A78BFA
```

---

## Golden (Secret)

Background:

```text
#1C1408
```

Board:

```text
#3D2E0A
```

Accent:

```text
#FFD700
```

---

# 24. Typography

## Font Family

```text
Poppins
```

Fallback:

```text
Sans Serif
```

---

## Weights

```text
Regular
Medium
Bold
```

---

# 25. Icon System

Use:

```text
Lucide Icons
```

---

Examples

```text
Settings
Statistics
Volume
Theme
Home
Replay
```

---

# 26. Haptic Feedback

Android Only.

---

Trigger On:

```text
Placement
Line Clear
Combo
Achievement
```

---

# 27. Particle System

Used For:

```text
Line Clear
Combo
Achievement
Theme Unlock
```

---

Target:

```text
Lightweight
60 FPS
```

---

# 28. Advertisement Placement

## Main Menu

Bottom Banner.

---

## Game Over

Bottom Banner.

---

## Interstitial

After:

```text
Every 4th Match
```

---

## Rewarded

Only:

```text
Continue Once
```

---

# 29. Accessibility

## Requirements

High Contrast

Large Buttons

Readable Fonts

Colorblind Friendly Themes

---

# 30. Responsive Design

Supports:

```text
Android Phones
Android Tablets
iPhones
Desktop Browsers
PWA
```

---

# 31. Performance Targets

Target:

```text
60 FPS
```

---

UI Load:

```text
< 100ms
```

---

Animation Budget:

```text
< 16ms/frame
```

---

# 32. UI Freeze

All UI decisions in this document are frozen for Version 1.0.

Changes require:

1. Design Review
2. Document Update
3. Approval

---

**Document Status:** APPROVED & FROZEN  
**Version:** 1.1  
**Owner:** PriorApp Games  
**Project:** Blockzu