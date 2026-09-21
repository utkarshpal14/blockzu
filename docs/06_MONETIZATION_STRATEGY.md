# BLOCKZU
## Document 06 — Monetization Strategy
### Version 1.0

**Project Name:** Blockzu  
**Genre:** Casual Puzzle / Block Puzzle  
**Platform:** Web, PWA, Android  
**Developer:** PriorApp Games  
**Status:** Monetization Frozen

---

# 1. Purpose

This document defines the complete monetization strategy for Blockzu.

Goals:

- Generate revenue
- Preserve player experience
- Maintain retention
- Avoid aggressive advertising
- Comply with Google Play policies

---

# 2. Monetization Philosophy

Blockzu is:

```text
Free To Play
```

Revenue should come from:

```text
Advertisements
```

NOT from:

```text
Pay To Win
Energy Systems
Forced Purchases
```

---

# 3. Revenue Sources

Version 1.0 Revenue Streams:

```text
Google AdMob
Google AdSense
Rewarded Ads
```

---

# 4. Launch Monetization Scope

Before public release:

```text
APK Testing
↓
2-3 Physical Devices
↓
AdMob Integration
↓
Final QA
↓
Release
```

Advertisements are integrated BEFORE launch.

---

# 5. Platform Monetization

## Android

Revenue Source:

```text
Google AdMob
```

---

## Web

Revenue Source:

```text
Google AdSense
```

---

# 6. Ad Types

Version 1.0 uses:

```text
Banner Ads
Interstitial Ads
Rewarded Ads
```

---

# 7. Banner Ads

## Purpose

Passive revenue.

Lowest interruption.

---

## Android Placement

### Main Menu

Location:

```text
Bottom Section
```

---

### Game Over Screen

Location:

```text
Bottom Section
```

---

## Banner Rules

Never display:

```text
Over Board
Over Piece Tray
Over Score Area
```

---

# 8. Web AdSense Placement

Location 1:

```text
Below Game Canvas
```

---

Location 2:

```text
Below Game Description
```

---

Never place ads:

```text
Inside Gameplay Area
```

---

# 9. Interstitial Ads

## Purpose

Primary revenue source.

---

## Trigger Frequency

```text
Every 4th Game Over
```

---

Example

```text
Game 1 → No Ad

Game 2 → No Ad

Game 3 → No Ad

Game 4 → Show Ad
```

---

# 10. Interstitial Rules

Never show:

```text
During Gameplay
```

Never show:

```text
During Placement
```

Never show:

```text
During Combo Animation
```

---

Only show:

```text
Game Over
```

---

# 11. Rewarded Ads

## Purpose

Voluntary monetization.

Highest player satisfaction.

---

# 12. Rewarded Continue

Flow:

```text
Game Over
↓
Watch Ad
↓
Continue Match
```

---

## Limit

```text
1 Continue Per Match
```

---

# 13. Rewarded Coin Ads

Players may watch ads for:

```text
Coins
```

---

Reward:

```text
100 Coins
```

---

# 14. Daily Rewarded Limit

Maximum:

```text
5 Rewarded Coin Ads / Day
```

---

Maximum Coins:

```text
500 Coins / Day
```

---

# 15. Advertisement Frequency Rules

## Target

Ads should feel:

```text
Optional
Fair
Non-Intrusive
```

---

## Hard Limits

Never:

```text
More Than 1 Interstitial
Per 3 Minutes
```

---

Never:

```text
Chain Ads
```

---

Never:

```text
Rewarded Ad
Immediately After Rewarded Ad
```

---

# 16. Ad Manager Architecture

```text
AdManager
│
├── Banner
├── Interstitial
└── Rewarded
```

---

# 17. Android AdMob Setup

Required Ad Units:

```text
Banner
Interstitial
Rewarded
```

---

Environment:

```text
Test Ads
↓
Production Ads
```

Only after QA approval.

---

# 18. Web AdSense Setup

Requirements:

```text
Published Website
Privacy Policy
Terms of Service
Valid Domain
```

---

Domain:

```text
blockzu.priorapp.co.in
```

---

# 19. Store Compliance

Must comply with:

```text
Google Play Policies
AdMob Policies
AdSense Policies
```

---

# 20. Child Safety

Target Audience:

```text
General Audience
```

---

Ads must comply with:

```text
Family Safe Content
```

when applicable.

---

# 21. Privacy Requirements

Required Pages:

```text
Privacy Policy
Terms of Service
Support Page
```

---

Hosted On:

```text
priorapp.co.in
```

---

# 22. Data Collection

Version 1.0 collects:

```text
Local Save Data
Anonymous Ad Data
Crash Analytics (Optional)
```

---

Does NOT collect:

```text
Passwords
Personal Information
User Accounts
```

---

# 23. Reward Economy Protection

Players cannot:

```text
Buy Score
Buy Achievements
Buy Mission Completion
```

---

Rewarded ads only accelerate:

```text
Coins
Theme Unlocks
```

---

# 24. Monetization Balance

Priority Order:

```text
Player Experience
↓
Retention
↓
Revenue
```

Never the reverse.

---

# 25. Expected Revenue Sources

## Early Stage

```text
Rewarded Ads
Interstitial Ads
```

Most important.

---

## Web

```text
AdSense
```

Secondary revenue.

---

# 26. Future Monetization (Post Launch)

Reserved For:

```text
Premium Themes
Board Skins
Particle Packs
Special Effects
```

---

Not included in:

```text
Version 1.0
```

---

# 27. Future Premium Version

Potential:

```text
Blockzu Premium
```

Benefits:

```text
No Ads
Exclusive Themes
Exclusive Effects
```

---

Not planned for launch.

---

# 28. Revenue KPI Targets

Monitor:

```text
DAU
Retention
Session Length
Ad Impressions
Rewarded Ad Usage
ARPDAU
```

---

# 29. Launch Readiness Checklist

Before Release:

```text
✓ AdMob Test Ads Working

✓ AdMob Production IDs Added

✓ Rewarded Ads Working

✓ Interstitial Frequency Verified

✓ Privacy Policy Published

✓ Terms Published

✓ AdSense Approved

✓ Play Store Compliance Check
```

---

# 30. Monetization Freeze

The monetization strategy defined in this document is frozen for Version 1.0.

Changes require:

1. Product Review
2. Documentation Update
3. Approval

---

**Document Status:** APPROVED & FROZEN  
**Version:** 1.0  
**Owner:** PriorApp Games  
**Project:** Blockzu