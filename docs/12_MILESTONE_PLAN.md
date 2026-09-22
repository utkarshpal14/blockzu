# BLOCKZU
## Document 12 — Milestone Plan
### Version 1.0

**Project Name:** Blockzu  
**Genre:** Casual Puzzle / Block Puzzle  
**Platform:** Web, PWA, Android  
**Developer:** PriorApp Games  
**Status:** Approved

---

# 1. Purpose

This document defines the official milestone plan for Blockzu Version 1.0.

The milestone system is used to:

- Track Development Progress
- Measure Completion
- Define Deliverables
- Validate Release Readiness

---

# 2. Development Overview

```text
M0 → Project Setup

M1 → Board System

M2 → Piece System

M3 → Placement System

M4 → Scoring & Line Clear

M5 → Game Flow

M6 → UI System

M7 → Progression System

M8 → Save System

M9 → Monetization

M10 → Polish

M11 → QA & Testing

M12 → Release
```

---

# M0 — Project Setup

## Goal

Create the development foundation.

### Deliverables

```text
GitHub Repository

Phaser Project Setup

TypeScript Setup

PWA Setup

Folder Structure

ESLint

Prettier
```

### Acceptance Criteria

```text
Project Builds Successfully

Runs In Browser

GitHub Connected

Code Standards Configured
```

### Estimated Time

```text
1–2 Days
```

### Status

```text
✅ Completed
```

---

# M1 — Board System

## Goal

Build the game board.

### Deliverables

```text
8x8 Grid

Board Renderer

Board State Management

Cell Components
```

### Acceptance Criteria

```text
Board Displays Correctly

Cells Track Occupied State

Board Updates In Real Time
```

### Estimated Time

```text
2 Days
```

### Status

```text
✅ Completed
```

---

# M2 — Piece System

## Goal

Implement all game pieces.

### Deliverables

```text
Shape Definitions

Piece Generator

Random Piece Selection

Piece Queue
```

### Acceptance Criteria

```text
All Shapes Render Correctly

Pieces Spawn Correctly

Randomization Works
```

### Estimated Time

```text
2 Days
```

### Status

```text
✅ Completed
```

---

# M3 — Placement System

## Goal

Allow players to place pieces.

### Deliverables

```text
Drag & Drop

Touch Controls

Mouse Controls

Placement Preview

Validation System
```

### Acceptance Criteria

```text
Valid Placements Accepted

Invalid Placements Rejected

Smooth Drag Experience
```

### Estimated Time

```text
3 Days
```

### Status

```text
✅ Completed
```

---

# M4 — Scoring & Line Clear

## Goal

Implement game mechanics.

### Deliverables

```text
Scoring Engine

Row Detection

Column Detection

Line Clearing

Combo System
```

### Acceptance Criteria

```text
Rows Clear Correctly

Columns Clear Correctly

Scores Update Correctly

Combo Logic Functions
```

### Estimated Time

```text
3 Days
```

### Status

```text
✅ Completed
```

---

# M5 — Game Flow

## Goal

Create complete gameplay loop.

### Deliverables

```text
Game Over Detection

Restart System

Best Score Tracking

Session Lifecycle
```

### Acceptance Criteria

```text
Game Ends Properly

Restart Works

Best Score Saves
```

### Estimated Time

```text
2 Days
```

### Status

```text
✅ Completed
```

---

# M6 — UI System

## Goal

Build production-ready UI.

### Deliverables

```text
Main Menu

Gameplay HUD

Game Over Screen

Settings Screen

Statistics Screen
```

### Acceptance Criteria

```text
All Screens Functional

Responsive Design

Portrait Layout Stable
```

### Estimated Time

```text
3 Days
```

### Status

```text
✅ Completed
```

---

# M7 — Progression System

## Goal

Implement retention features.

### Deliverables

```text
Achievements

Missions

Theme Unlocks

Reward System
```

### Acceptance Criteria

```text
Achievements Track Progress

Missions Generate Correctly

Themes Unlock Correctly
```

### Estimated Time

```text
3 Days
```

### Status

```text
✅ Completed
```

---

# M8 — Save System

## Goal

Persist player data with integrity validation, backup recovery, metadata tracking, and migration support.

### Deliverables

```text
Save Manager
Storage Service
Schema Validation
Backup Recovery
Migration System
30s Gameplay Autosave
Lifecycle Hooks (beforeunload, visibilitychange)
Save Metadata (createdAt, updatedAt, totalPlayTime)
Protected Reset Progress Flow
```

### Acceptance Criteria

```text
Progress Survives Restart
Data Loads Correctly
Backup Recovers Corrupted Saves
Autosave Triggers During Gameplay
Reset Works Correctly
Metadata Tracks Playtime & Timestamps
```

### Estimated Time

```text
2 Days
```

### Status

```text
✅ Completed
```

---

# M9 — Monetization & Economy Hardening

## Goal

Integrate player-friendly monetization (interstitials, rewarded ads, revives) and harden the long-term economy.

### Deliverables

```text
AdManager Subsystem
Simulated Interactive Video Ad Modal (RewardedAdModal)
Fair Rewarded Revive (1 continue, 8-12 cells cleared, combo reset)
Rewarded Free Coins (+50 coins, 5 ads/day cap)
Interstitial Frequency Throttling (every 4th game over, 3m cooldown)
Prestige Theme Pricing Ladder (1.4k to 27k)
Tiered Achievements (Bronze/Silver/Gold/Legendary up to 25k score)
Multi-Session Scaled Missions (Easy/Medium/Hard)
Save Metadata Tracking (totalCoinsEarned, adsWatched)
```

### Acceptance Criteria

```text
Ads Display Correctly
Rewarded Revive Clears 8-12 Cells and Preserves Score
Rewarded Ads Grant +50 Coins (Max 5/Day)
Interstitial Frequency Rules Followed
No Ads During Active Gameplay
Prestige Themes Unlock via Earned Coins
```

### Estimated Time

```text
2 Days
```

### Status

```text
✅ Completed
```

---

# M10 — Polish

## Goal

Improve game feel and quality.

### Deliverables

```text
Animations

Particles

Audio

Transitions

Visual Feedback
```

### Acceptance Criteria

```text
60 FPS

Smooth Animations

Professional Feel
```

### Estimated Time

```text
3 Days
```

### Status

```text
✅ Completed
```

---

# M11 — QA & Testing

## Goal

Prepare for release.

### Deliverables

```text
Gameplay Testing

Device Testing

Browser Testing

Save Testing

Ad Testing

Performance Testing
```

### Acceptance Criteria

```text
0 Critical Bugs

0 Major Bugs

Stable Performance
```

### Estimated Time

```text
4 Days
```

### Status

```text
✅ Completed
```

---

# M11.5 — Beta Analytics

## Goal

Capture core player telemetry, retention metrics, and progression data locally to evaluate balance and economy before public launch.

### Deliverables

```text
Average Score Telemetry

Games Played Tracking

Themes Purchased Counter

Achievements Claimed Counter

Revives Used Counter

Session Length & Playtime Analytics

Developer Console Export (window.blockzuAnalytics)

In-Game Beta Analytics Dashboard View
```

### Acceptance Criteria

```text
Real-time Local Telemetry Aggregation

Zero Loss Across Saves & Backups

Accurate Math for Averages & Durations

One-Click Telemetry JSON Export

100% Invariant Test Coverage
```

### Estimated Time

```text
1 Day
```

### Status

```text
✅ Completed
```

---

# M12 — Release

## Goal

Launch Blockzu publicly.

### Deliverables

```text
Play Store Listing

Store Assets

Android AAB

Vercel Deployment

PWA Release
```

### Acceptance Criteria

```text
Game Publicly Available

Play Store Approved

Website Live

PWA Installable
```

### Estimated Time

```text
1–2 Days
```

### Status

```text
⬜ Not Started
```

---

# Project Timeline Summary

| Milestone | Name | Duration |
|------------|--------|----------|
| M0 | Project Setup | 1–2 Days |
| M1 | Board System | 2 Days |
| M2 | Piece System | 2 Days |
| M3 | Placement System | 3 Days |
| M4 | Scoring & Line Clear | 3 Days |
| M5 | Game Flow | 2 Days |
| M6 | UI System | 3 Days |
| M7 | Progression System | 3 Days |
| M8 | Save System | 2 Days |
| M9 | Monetization | 2 Days |
| M10 | Polish | 3 Days |
| M11 | QA & Testing | 4 Days |
| M11.5 | Beta Analytics | 1 Day |
| M12 | Release | 1–2 Days |

---

# Total Estimated Duration

```text
31–33 Days
```

For a single developer working consistently.

---

# Completion Criteria

Blockzu Version 1.0 is complete when:

```text
✓ M0 Completed

✓ M1 Completed

✓ M2 Completed

✓ M3 Completed

✓ M4 Completed

✓ M5 Completed

✓ M6 Completed

✓ M7 Completed

✓ M8 Completed

✓ M9 Completed

✓ M10 Completed

✓ M11 Completed

✓ M11.5 Completed

✓ M12 Completed
```

---

# Milestone Tracking

Use the following format during development:

```text
M0 Project Setup           ✅
M1 Board System            ✅
M2 Piece System            ✅
M3 Placement System        ✅
M4 Scoring & Line Clear    ✅
M5 Game Flow               ✅
M6 UI System               ✅
M7 Progression System      ✅
M8 Save System             ✅
M9 Monetization            ✅
M10 Polish                 ✅
M11 QA & Testing           ✅
M11.5 Beta Analytics       ✅
M12 Release                ⬜
```

---

**Document Status:** APPROVED  
**Version:** 1.0  
**Owner:** PriorApp Games  
**Project:** Blockzu