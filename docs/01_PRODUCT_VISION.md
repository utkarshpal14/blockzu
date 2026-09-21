# BLOCKZU
## Document 01 — Product Vision
### Version 1.1

**Project Name:** Blockzu  
**Genre:** Casual Puzzle / Block Puzzle  
**Platform:** Web, PWA, Android  
**Developer:** PriorApp Games  
**Status:** Planning Phase

---

# 1. Vision Statement

Blockzu is a modern block puzzle game designed to provide a simple, relaxing, and highly replayable experience for players of all ages.

The game allows players to place blocks strategically on an 8×8 board, clear rows and columns, create satisfying combo chains, and continuously improve their high score.

Blockzu will be built using a single codebase and distributed across Web, PWA, and Android platforms, ensuring maximum reach with minimal operational cost.

The long-term goal is to establish Blockzu as the first game within the PriorApp Games ecosystem and create a scalable foundation for future game releases.

---

# 2. Mission Statement

Our mission is to create a lightweight, accessible, and enjoyable puzzle game that anyone can instantly play, regardless of device, location, or technical knowledge.

Blockzu should:

- Load quickly
- Be easy to learn
- Be difficult to master
- Work on every major platform
- Require no account to play
- Deliver satisfying gameplay sessions

---

# 3. Product Goals

## Goal 1 — Accessibility

Allow users to start playing within seconds.

### Success Criteria

- No login required
- No onboarding required
- Instant gameplay
- Minimal loading times

---

## Goal 2 — Cross Platform Availability

Support multiple platforms from a single codebase.

### Supported Platforms

- Web Browser
- Progressive Web App (PWA)
- Android Application

---

## Goal 3 — Replayability

Create an endless gameplay loop that encourages repeated play sessions.

### Success Criteria

- Random piece generation
- Increasing challenge
- High-score chasing
- Satisfying progression through skill improvement

---

## Goal 4 — Zero Infrastructure Cost

Operate without dedicated backend infrastructure during Version 1.

### Success Criteria

- Local storage only
- No database
- No authentication
- No server hosting costs
- No cloud dependencies

---

# 4. Target Audience

## Primary Audience

Casual puzzle players.

### Demographics

- Age: 8–60+
- Mobile-first users
- Casual gamers
- Puzzle enthusiasts

### Characteristics

- Enjoy relaxing puzzle games
- Prefer short gaming sessions
- Play during breaks or free time
- Enjoy improving personal records

---

## Secondary Audience

Students and working professionals seeking short mental breaks.

### Use Cases

- During travel
- During work breaks
- Before sleep
- Casual entertainment
- Stress relief

---

# 5. Core Gameplay Pillars

## Pillar 1 — Simple

The player should understand the rules within 30 seconds.

### Design Principles

- Minimal UI
- Intuitive controls
- No tutorials required
- Immediate gameplay

---

## Pillar 2 — Satisfying

Every placement and line clear should feel rewarding.

### Design Principles

- Smooth animations
- Combo effects
- Responsive controls
- Visual feedback
- Audio feedback

---

## Pillar 3 — Endless

There should be no level limits.

### Challenge Sources

- Board management
- Strategic placement
- Piece forecasting
- High score optimization

---

# 6. Unique Value Proposition

Unlike many puzzle games that require energy systems, subscriptions, or complicated progression systems, Blockzu focuses on instant accessibility and endless replayability.

Players can:

- Open the game instantly
- Play offline
- Enjoy unlimited sessions
- Improve personal high scores
- Play without registration

The experience remains lightweight, fast, and accessible.

---

# 7. Platform Strategy

## Web

### Purpose

- Primary distribution platform
- Instant browser play
- SEO visibility
- Traffic generation for PriorApp

### Access Method

```text
priorapp.co.in/games/blockzu
```

---

## Progressive Web App (PWA)

### Purpose

- iPhone compatibility
- Installable experience
- Offline support
- Home screen access

### Benefits

- No App Store required
- No Apple Developer account required
- Same codebase as web version

---

## Android

### Purpose

- Google Play Store distribution
- Mobile gaming audience
- Revenue generation

### Distribution

- Google Play Store
- APK (internal testing)

---

# 8. Monetization Strategy

## Philosophy

Monetization should never interrupt core gameplay.

The player experience always comes first.

Advertisements should be introduced only after gameplay is stable, tested, and production-ready.

---

## Monetization Timeline

### Phase 1

Development

```text
No Ads
No Analytics
No Monetization
```

### Phase 2

Internal Testing

```text
Gameplay Validation
Bug Fixing
Performance Testing
```

### Phase 3

APK Testing

Test on:

- Primary Android Device
- Secondary Android Device
- Different Screen Size Device

Verify:

- Performance
- Saves
- Audio
- UI Scaling

---

### Phase 4

Advertisement Integration

After successful device testing:

#### Android

Google AdMob

##### Banner Ads

Locations:

- Main Menu
- Game Over Screen

Never:

- During gameplay

##### Interstitial Ads

Display:

- After Game Over
- Every 3–5 matches

Never:

- Mid-game

##### Rewarded Ads

Offer:

```text
Watch Ad
↓
Continue Once
```

---

#### Web

Google AdSense

Locations:

- Below game canvas
- Below game description

Never:

- Over gameplay
- Blocking controls

---

### Phase 5

Final QA

Verify:

- Ad loading
- Ad performance
- Gameplay performance
- Cross-device compatibility

---

### Phase 6

Public Release

Release Channels:

- Website
- PWA
- Google Play Store

---

# 9. Success Metrics

## Launch Goals

- Functional Web Release
- Functional PWA Release
- Functional Android Release
- Advertisement Integration Complete
- Stable Gameplay Experience

---

## Early Growth Goals

- 100+ installs
- 50+ active users
- 4.0+ average rating
- Positive user feedback

---

## Long-Term Goals

- Become a flagship PriorApp Games title
- Generate first gaming revenue
- Build audience for future games
- Establish PriorApp Games ecosystem

---

# 10. Non-Goals (Version 1)

The following features are intentionally excluded from Version 1.

## Social Features

- Multiplayer
- Chat System
- Friends System
- Guilds

## Account Features

- User Accounts
- Login System
- Cloud Saves

## Online Features

- Global Leaderboards
- Daily Challenges
- Online Events
- Backend Infrastructure

## Advanced Features

- Seasonal Content
- Battle Pass
- Player Profiles
- Competitive Rankings

These may be evaluated after launch.

---

# 11. Future Vision

Blockzu serves as the foundation of the PriorApp Games ecosystem.

## Ecosystem Roadmap

```text
PriorApp Games
│
├── Blockzu
├── Sudoku
├── 2048
├── Chess
├── Ludo
├── Carrom
└── Future Titles
```

The deployment pipeline, monetization system, analytics strategy, and development workflow created for Blockzu should accelerate future game development and publishing.

---

# 12. Product Principles

Every future decision should align with these principles.

## Accessibility First

Anyone should be able to play.

## Performance First

Fast loading and smooth gameplay on low-end devices.

## Simplicity First

Avoid unnecessary complexity.

## Cross-Platform First

Every feature should work across Web, PWA, and Android.

## Player Experience First

Gameplay quality takes priority over monetization.

---

# 13. Version 1 Release Definition

Blockzu Version 1.0 is considered complete when:

- Core gameplay loop is fully functional
- Piece spawning works correctly
- Line clearing works correctly
- Score system works correctly
- Game over system works correctly
- Best score is saved locally
- Audio system is implemented
- Advertisement system is integrated
- PWA installation works
- Android build passes device testing
- Web version is deployed
- Play Store build is production ready
- No critical bugs remain

---

# 14. Development Milestones

```text
M0 Project Setup
M1 Grid System
M2 Piece System
M3 Drag & Drop
M4 Line Clear System
M5 Scoring System
M6 Game Over System
M7 UI & UX
M8 Save System
M9 PWA Setup
M10 Android Build
M11 Device Testing
M12 Advertisement Integration
M13 Final QA
M14 Web Release
M15 Play Store Release
```

---

**Document Status:** Approved  
**Version:** 1.1  
**Owner:** PriorApp Games  
**Project:** Blockzu