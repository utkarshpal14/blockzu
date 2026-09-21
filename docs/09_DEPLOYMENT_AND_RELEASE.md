# BLOCKZU
## Document 09 — Deployment & Release Strategy
### Version 1.0

**Project Name:** Blockzu  
**Genre:** Casual Puzzle / Block Puzzle  
**Platform:** Web, PWA, Android  
**Developer:** PriorApp Games  
**Status:** Release Process Frozen

---

# 1. Purpose

This document defines:

- Deployment Process
- Release Workflow
- Versioning Strategy
- Play Store Release
- Web Deployment
- PWA Deployment
- Production Rollout

The goal is to ensure every release is:

```text
Repeatable
Reliable
Professional
```

---

# 2. Release Targets

Version 1.0 launch includes:

```text
Web
PWA
Android
```

---

## Not Included

```text
iOS App Store
Desktop Apps
Steam
```

---

# 3. Source Control Strategy

## Platform

```text
GitHub
```

Repository:

```text
github.com/priorapp/blockzu
```

(Example)

---

# 4. Branch Strategy

## Main Branch

```text
main
```

Production Ready Code.

---

## Development Branch

```text
develop
```

Feature Integration.

---

## Feature Branches

Examples:

```text
feature/board-system
feature/save-system
feature-achievements
feature-monetization
```

---

# 5. Development Workflow

```text
Feature Branch
      ↓
Develop
      ↓
Testing
      ↓
Main
      ↓
Release
```

---

# 6. Versioning Strategy

Format:

```text
MAJOR.MINOR.PATCH
```

---

Examples

```text
1.0.0

1.0.1

1.1.0

2.0.0
```

---

# 7. Version Definitions

## Major

```text
2.0.0
```

Large feature releases.

Examples:

```text
Cloud Save
Leaderboards
Multiplayer
```

---

## Minor

```text
1.1.0
```

New features.

Examples:

```text
New Themes
New Achievements
New Missions
```

---

## Patch

```text
1.0.1
```

Bug fixes.

---

# 8. Environment Structure

## Local

```text
npm run dev
```

---

## Staging

```text
Vercel Preview
```

---

## Production

```text
Vercel Production
```

---

# 9. Build Commands

## Development

```bash
npm run dev
```

---

## Production

```bash
npm run build
```

---

## Preview

```bash
npm run preview
```

---

# 10. Web Deployment

## Platform

```text
Vercel
```

---

## Flow

```text
GitHub Push
      ↓
Vercel Build
      ↓
Deployment
```

---

# 11. Production Domain

Primary:

```text
blockzu.priorapp.co.in
```

---

Fallback:

```text
blockzu.vercel.app
```

---

# 12. PWA Deployment

## Requirements

```text
Manifest
Icons
Service Worker
Offline Support
```

---

## Install Targets

```text
Android
iPhone
Desktop
```

---

# 13. PWA Checklist

```text
✓ App Name

✓ Icons

✓ Splash Screen

✓ Offline Support

✓ Install Prompt

✓ Responsive Layout
```

---

# 14. Android Build Process

## Step 1

Build Production Files

```bash
npm run build
```

---

## Step 2

Sync Capacitor

```bash
npx cap sync
```

---

## Step 3

Open Android Studio

```bash
npx cap open android
```

---

## Step 4

Generate AAB

```text
Build Bundle (AAB)
```

---

# 15. Android Signing

## Keystore

Generate once.

Store securely.

---

Files:

```text
blockzu.keystore
```

---

Never commit:

```text
Keystore
Passwords
Keys
```

to GitHub.

---

# 16. Android Release Format

Release:

```text
AAB
```

---

Not:

```text
APK
```

for Play Store.

---

# 17. Play Console Setup

Required:

```text
Developer Account
```

---

One-time Fee:

```text
Google Play Console
```

---

# 18. Play Store Listing

## Title

```text
Blockzu: Block Puzzle Game
```

---

## Category

```text
Puzzle
```

---

## Content Rating

```text
Everyone
```

---

# 19. Store Assets

Required:

## App Icon

```text
512 x 512
```

---

## Feature Graphic

```text
1024 x 500
```

---

## Screenshots

Minimum:

```text
Phone Screenshots
```

Recommended:

```text
8 Screenshots
```

---

# 20. Store Description

Short Description:

```text
Drag, fit & clear blocks in this addictive puzzle game. No wifi needed!
```

---

Long Description:

Stored separately.

---

# 21. Required URLs

## Privacy Policy

```text
https://priorapp.co.in/privacy/blockzu
```

---

## Terms

```text
https://priorapp.co.in/terms/blockzu
```

---

## Support

```text
https://priorapp.co.in/support
```

---

# 22. AdMob Production Release

Before Launch:

```text
Test Ads
```

---

After QA Approval:

```text
Production IDs
```

---

Verify:

```text
Banner
Interstitial
Rewarded
```

---

# 23. AdSense Production Release

Requirements:

```text
Approved Site
Published Domain
Privacy Policy
```

---

# 24. Analytics

Version 1.0 Optional:

```text
Google Analytics
```

---

Track:

```text
Sessions
Users
Retention
```

---

# 25. Crash Reporting

Recommended:

```text
Firebase Crashlytics
```

---

Track:

```text
Crashes
Errors
Device Issues
```

---

# 26. Release Candidate Process

## RC1

```text
Feature Complete
```

---

## RC2

```text
Bug Fixes
```

---

## RC3

```text
Final Verification
```

---

# 27. Launch Checklist

## Gameplay

```text
✓ Board Works

✓ Placement Works

✓ Scoring Works

✓ Combo Works

✓ Game Over Works
```

---

## Save System

```text
✓ Save

✓ Load

✓ Reset

✓ Statistics
```

---

## Progression

```text
✓ Missions

✓ Achievements

✓ Themes
```

---

## Monetization

```text
✓ Banner Ads

✓ Interstitial Ads

✓ Rewarded Ads
```

---

## Deployment

```text
✓ Vercel

✓ PWA

✓ Android Build
```

---

# 28. Soft Launch

Recommended:

```text
Friends
Family
Classmates
```

Target:

```text
20–50 Test Users
```

---

Collect:

```text
Feedback
Bugs
Suggestions
```

---

# 29. Public Launch

After:

```text
Critical Bugs = 0

Major Bugs = 0
```

---

Release:

```text
Version 1.0.0
```

---

# 30. Post Launch Monitoring

Monitor Daily:

```text
Play Store Reviews
Crash Reports
Ad Revenue
Retention
```

---

# 31. Emergency Rollback Strategy

If severe issues occur:

```text
Fix
↓
Patch
↓
1.0.1 Release
```

---

Critical issues:

```text
Data Loss
Crashes
Broken Ads
```

---

# 32. Release Calendar

## Internal Testing

```text
2 Weeks
```

---

## Device Testing

```text
1 Week
```

---

## Soft Launch

```text
1 Week
```

---

## Public Release

```text
Version 1.0.0
```

---

# 33. Success Metrics

First Goals:

```text
100 Downloads

4.5+ Rating

<1% Crash Rate

Positive Reviews
```

---

# 34. Release Freeze

The deployment and release process defined in this document is frozen for Version 1.0.

Changes require:

1. Release Review
2. Documentation Update
3. Approval

---

**Document Status:** APPROVED & FROZEN  
**Version:** 1.0  
**Owner:** PriorApp Games  
**Project:** Blockzu