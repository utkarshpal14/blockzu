# BLOCKZU
## Document 08 — Testing Strategy & Quality Assurance
### Version 1.0

**Project Name:** Blockzu  
**Genre:** Casual Puzzle / Block Puzzle  
**Platform:** Web, PWA, Android  
**Developer:** PriorApp Games  
**Status:** QA Strategy Frozen

---

# 1. Purpose

This document defines the complete testing strategy for Blockzu.

Goals:

- Prevent critical bugs
- Ensure gameplay stability
- Validate monetization
- Verify save integrity
- Ensure smooth release

---

# 2. Testing Philosophy

Before launch:

```text
Quality > Features
```

A stable game with fewer features is better than a feature-rich game with bugs.

---

# 3. Testing Levels

```text
Unit Testing
System Testing
Integration Testing
Device Testing
User Experience Testing
Release Testing
```

---

# 4. Testing Environment

## Development

```text
Localhost
Vite Dev Server
```

---

## Staging

```text
Vercel Preview Deployment
```

---

## Production

```text
Production Build
```

---

# 5. Core Gameplay Testing

## Board System

Verify:

```text
Board Creates Correctly
8x8 Grid Renders
Cell States Update
No Visual Glitches
```

---

## Piece System

Verify:

```text
All Pieces Spawn
Shapes Correct
No Missing Pieces
No Invalid Shapes
```

---

## Drag & Drop

Verify:

```text
Drag Starts
Drag Cancels
Drop Works
Touch Controls Work
Mouse Controls Work
```

---

## Placement Validation

Verify:

```text
Valid Placement Accepted
Invalid Placement Rejected
No Overlap Allowed
Out-of-Bounds Blocked
```

---

# 6. Line Clear Testing

Verify:

```text
Single Row Clear
Single Column Clear
Multiple Row Clear
Multiple Column Clear
Mixed Clear
```

---

# 7. Combo Testing

Verify:

```text
2-Line Combo
3-Line Combo
4+ Line Combo
Combo Score Bonus
Combo Animation
```

---

# 8. Scoring Testing

Verify:

```text
Block Placement Score
Line Clear Score
Combo Bonus Score
Final Score Calculation
Best Score Update
```

---

# 9. Game Over Testing

Verify:

```text
No Moves Remaining
Game Over Triggers
Game Over Screen Appears
Score Displays Correctly
```

---

# 10. Save System Testing

Verify:

```text
Fresh Install
Save Creation
Save Loading
Save Updating
Reset Progress
```

---

## Persistence Testing

Verify:

```text
Close App
Reopen App
Progress Preserved
```

---

# 11. Statistics Testing

Verify:

```text
Games Played
Highest Score
Average Score
Lines Cleared
Blocks Placed
Longest Combo
```

Updates correctly.

---

# 12. Achievement Testing

Verify:

```text
Progress Updates
Unlock Conditions
Reward Claims
Save Persistence
```

---

# 13. Mission Testing

Verify:

```text
Mission Generation
Mission Progress
Mission Completion
Reward Claims
Mission Replacement
```

---

# 14. Theme Testing

Verify:

```text
Theme Unlock
Theme Purchase
Theme Apply
Theme Save
Theme Restore
```

---

# 15. Settings Testing

Verify:

```text
Music Toggle
Sound Toggle
Vibration Toggle
Reset Progress
```

---

# 16. Audio Testing

Verify:

```text
Placement Sound
Line Clear Sound
Combo Sound
Achievement Sound
Game Over Sound
```

---

## Music Testing

Verify:

```text
Play
Pause
Resume
Mute
```

---

# 17. Animation Testing

Verify:

```text
Placement Animation
Clear Animation
Combo Animation
Achievement Animation
Theme Unlock Animation
```

---

# 18. Performance Testing

Target:

```text
60 FPS
```

---

Verify:

```text
No Frame Drops
No Memory Leaks
No Freezes
```

---

# 19. Load Testing

Target:

```text
< 3 Seconds
```

---

Verify:

```text
First Load
PWA Load
Cached Load
```

---

# 20. Advertisement Testing

## Banner Ads

Verify:

```text
Display Correctly
No Overlap
Correct Position
```

---

## Interstitial Ads

Verify:

```text
Every 4th Game Over
No Unexpected Triggers
Close Works
```

---

## Rewarded Ads

Verify:

```text
Reward Granted
Reward Not Granted On Failure
Continue Works
Limit Enforced
```

---

# 21. AdMob Testing

Use:

```text
Google Test Ad Units
```

Never use production ads during QA.

---

# 22. AdSense Testing

Verify:

```text
Ads Render
No Layout Breaks
Mobile Responsive
```

---

# 23. Mobile Device Testing

Minimum:

```text
3 Physical Devices
```

---

## Recommended

### Device 1

Low-End Android

```text
4GB RAM
```

---

### Device 2

Mid-Range Android

```text
6GB-8GB RAM
```

---

### Device 3

High-End Android

```text
8GB+ RAM
```

---

# 24. Screen Size Testing

Verify:

```text
Small Phones
Large Phones
Tablets
Desktop Browsers
```

---

# 25. Browser Testing

Verify:

```text
Chrome
Edge
Firefox
Safari
```

---

# 26. PWA Testing

Verify:

```text
Install Prompt
Offline Launch
App Icon
Splash Screen
```

---

# 27. Android Testing

Verify:

```text
APK Install
AAB Build
Orientation Lock
Performance
```

---

# 28. Error Handling Testing

Verify:

```text
Corrupted Save
Missing Data
Ad Failure
Audio Failure
```

Game must continue safely.

---

# 29. UX Testing

Questions:

```text
Can user understand game immediately?

Can user find Settings?

Can user understand Themes?

Can user understand Achievements?
```

---

# 30. Accessibility Testing

Verify:

```text
Readable Fonts
Large Buttons
Color Contrast
Theme Visibility
```

---

# 31. Regression Testing

After every major feature:

Verify:

```text
Gameplay Still Works
Saving Still Works
Ads Still Work
Themes Still Work
```

---

# 32. Release Candidate Testing

Version:

```text
v1.0.0-RC1
```

Checklist:

```text
No Critical Bugs
No Save Issues
No Ad Issues
No Crashes
```

---

# 33. Bug Severity Levels

## Critical

Examples:

```text
Crash
Data Loss
Game Unplayable
```

Release Blocker.

---

## Major

Examples:

```text
Feature Broken
Wrong Rewards
Save Failure
```

Must Fix.

---

## Minor

Examples:

```text
UI Alignment
Animation Glitch
Typo
```

Can Ship.

---

# 34. Launch Criteria

Release only if:

```text
0 Critical Bugs
0 Major Bugs
Stable Performance
Ads Working
Save System Stable
```

---

# 35. Post-Launch Monitoring

Track:

```text
Crash Reports
Retention
Ad Performance
User Reviews
```

---

# 36. QA Checklist Summary

Before Launch:

```text
✓ Gameplay Stable

✓ Save System Stable

✓ Themes Stable

✓ Achievements Stable

✓ Missions Stable

✓ Ads Stable

✓ Android Build Stable

✓ Web Build Stable

✓ PWA Stable

✓ No Critical Bugs
```

---

# 37. Testing Freeze

The testing strategy defined in this document is frozen for Version 1.0.

Changes require:

1. QA Review
2. Documentation Update
3. Approval

---

**Document Status:** APPROVED & FROZEN  
**Version:** 1.0  
**Owner:** PriorApp Games  
**Project:** Blockzu