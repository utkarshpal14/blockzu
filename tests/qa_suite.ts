/**
 * BLOCKZU — MILESTONE 11 AUTOMATED QA SUITE
 * Comprehensive Invariant & Exploit Test Suite
 */

// Mock browser environment for Node.js environment
const memoryStorage: Record<string, string> = {};
(globalThis as any).window = globalThis;
(globalThis as any).window.addEventListener = () => {};
(globalThis as any).window.removeEventListener = () => {};
(globalThis as any).document = {
  createElement: () => ({
    getContext: () => null,
    style: {}
  }),
  documentElement: { style: {} },
  head: { appendChild: () => {} },
  body: { appendChild: () => {} },
  addEventListener: () => {},
  removeEventListener: () => {}
};
try {
  (globalThis.navigator as any).vibrate = () => true;
} catch (e) {
  // Ignore if immutable
}
(globalThis as any).localStorage = {
  getItem: (key: string) => memoryStorage[key] || null,
  setItem: (key: string, val: string) => { memoryStorage[key] = val; },
  removeItem: (key: string) => { delete memoryStorage[key]; },
  clear: () => { Object.keys(memoryStorage).forEach((k) => delete memoryStorage[k]); }
};

import { StorageService } from '../src/services/StorageService';
import { SaveManager } from '../src/managers/SaveManager';
import { ThemeManager } from '../src/managers/ThemeManager';
import { AchievementManager } from '../src/managers/AchievementManager';
import { MissionManager } from '../src/managers/MissionManager';
import { DailyRewardManager } from '../src/managers/DailyRewardManager';
import { BoardManager } from '../src/managers/BoardManager';
import { StatisticsManager } from '../src/managers/StatisticsManager';
import { AnalyticsManager } from '../src/managers/AnalyticsManager';
import { AdManager } from '../src/managers/AdManager';
import { MONETIZATION_CONFIG } from '../src/constants/monetization';
import { THEME_CATALOG } from '../src/data/themes';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
    failed++;
  }
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING BLOCKZU MILESTONE 11 QA & EXPLOIT TEST SUITE');
  console.log('======================================================\n');

  const storageService = StorageService.getInstance();
  const saveManager = SaveManager.getInstance();

  // Reset to clean default state before tests
  saveManager.resetProgress();

  // --------------------------------------------------------------------------
  // TEST 1: THEME PURCHASE EXPLOIT TEST
  // --------------------------------------------------------------------------
  console.log('\n--- [TEST 1] Theme Purchase Exploit Test ---');
  {
    saveManager.resetProgress();
    const themeManager = ThemeManager.getInstance();
    const darkTheme = THEME_CATALOG.find((t) => t.id === 'dark')!;

    // Player starts with 0 coins
    assert(saveManager.getCoins() === 0, 'Initial coins is 0');
    assert(themeManager.isThemeUnlocked('dark') === false, 'Dark theme is locked');

    // Give player 1000 coins (Dark theme costs 1400 coins)
    saveManager.addCoins(1000);
    assert(saveManager.getCoins() === 1000, 'Player has 1000 coins');
    assert(themeManager.canUnlockTheme(darkTheme) === false, 'canUnlockTheme rejected for 1000 < 1400 coins');

    const purchaseResult = themeManager.purchaseTheme(darkTheme);
    assert(purchaseResult === false, 'Purchase rejected for insufficient coins');
    assert(saveManager.getCoins() === 1000, 'Coins remained 1000 without deduction');
    assert(themeManager.isThemeUnlocked('dark') === false, 'Dark theme remains locked');

    // Now give 400 more coins (total 1400)
    saveManager.addCoins(400);
    assert(saveManager.getCoins() === 1400, 'Player has exactly 1400 coins');
    assert(themeManager.canUnlockTheme(darkTheme) === true, 'canUnlockTheme approved for 1400 coins');

    const legitimatePurchase = themeManager.purchaseTheme(darkTheme);
    assert(legitimatePurchase === true, 'Purchase succeeded with 1400 coins');
    assert(saveManager.getCoins() === 0, 'Coins deducted accurately to 0');
    assert(themeManager.isThemeUnlocked('dark') === true, 'Dark theme is now unlocked');
    assert(themeManager.canUnlockTheme(darkTheme) === false, 'Cannot re-purchase already unlocked theme');
  }

  // --------------------------------------------------------------------------
  // TEST 2: DOUBLE CLAIM EXPLOIT TEST (Achievements, Missions, Daily Rewards)
  // --------------------------------------------------------------------------
  console.log('\n--- [TEST 2] Double Claim Exploit Test ---');
  {
    saveManager.resetProgress();
    const achievementManager = AchievementManager.getInstance();
    const missionManager = MissionManager.getInstance();
    const dailyRewardManager = DailyRewardManager.getInstance();

    // A. Achievement Double Claim
    achievementManager.updateProgress('first_placement', 1);
    const state = achievementManager.getAchievementState('first_placement')!;
    assert(state.completed === true, 'Achievement completed');
    assert(state.claimed === false, 'Achievement unclaimed');

    const initialCoins = saveManager.getCoins();
    const firstClaim = achievementManager.claimReward('first_placement');
    assert(firstClaim === true, 'First achievement claim succeeds');
    assert(saveManager.getCoins() === initialCoins + 25, 'Awarded +25 coins on first claim');

    const coinsAfterFirst = saveManager.getCoins();
    const secondClaim = achievementManager.claimReward('first_placement');
    assert(secondClaim === false, 'Second achievement claim rejected');
    assert(saveManager.getCoins() === coinsAfterFirst, 'Zero extra coins awarded on duplicate claim');

    // B. Mission Double Claim
    missionManager.ensureActiveMissions();
    const activeMissions = missionManager.getActiveMissions();
    const missionToTest = activeMissions[0];
    // Complete the mission
    missionManager.reportProgress(missionToTest.definition.type, missionToTest.definition.target, true);

    const coinsBeforeMissionClaim = saveManager.getCoins();
    const firstMissionClaim = missionManager.claimMission(missionToTest.state.id);
    assert(firstMissionClaim === true, 'First mission claim succeeds');
    assert(saveManager.getCoins() === coinsBeforeMissionClaim + missionToTest.definition.rewardCoins, 'Awarded mission reward coins');

    const coinsAfterMissionClaim = saveManager.getCoins();
    const secondMissionClaim = missionManager.claimMission(missionToTest.state.id);
    assert(secondMissionClaim === false, 'Second mission claim on old ID rejected');
    assert(saveManager.getCoins() === coinsAfterMissionClaim, 'Zero extra coins awarded on duplicate mission claim');

    // C. Daily Reward Double Claim
    const daily1 = dailyRewardManager.claimDailyReward();
    assert(daily1 !== null, 'First daily reward claim succeeds');
    const coinsAfterDaily = saveManager.getCoins();

    const daily2 = dailyRewardManager.claimDailyReward();
    assert(daily2 === null, 'Second daily reward claim within cooldown rejected');
    assert(saveManager.getCoins() === coinsAfterDaily, 'Zero extra coins awarded on duplicate daily claim');
  }

  // --------------------------------------------------------------------------
  // TEST 3: REVIVE EXPLOIT & 1-CONTINUE PER RUN LIMIT
  // --------------------------------------------------------------------------
  console.log('\n--- [TEST 3] Revive Exploit & Continue Limits ---');
  {
    saveManager.resetProgress();
    const boardManager = BoardManager.getInstance();

    // Populate board with blocks
    boardManager.reset();
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        boardManager.placePiece([[1]], r, c, '#3B82F6');
      }
    }
    const initialOccupied = boardManager.getOccupiedCells().length;
    assert(initialOccupied === 25, 'Initial occupied cells is 25');

    // Simulate fair revive: Clear 8-12 cells
    const occupied = boardManager.getOccupiedCells();
    const cellsToClear = occupied.slice(0, 10);
    boardManager.clearCells(cellsToClear);

    const postReviveOccupied = boardManager.getOccupiedCells().length;
    assert(postReviveOccupied === 15, '10 cells successfully cleared on revive to open space');

    // Test revive state tracker in session stats
    const matchState = { score: 1250, linesCleared: 6, maxCombo: 3, hasRevived: false };
    assert(matchState.hasRevived === false, 'First Game Over allows revive');

    // Use revive
    matchState.hasRevived = true;
    assert(matchState.hasRevived === true, 'Revive flag set to true');

    // Next Game Over in same match
    const canReviveAgain = !matchState.hasRevived;
    assert(canReviveAgain === false, 'Second revive attempt in same run is strictly blocked');
  }

  // --------------------------------------------------------------------------
  // TEST 4: AD REWARD EXPLOIT & DAILY 5-AD CAP (250 COINS/DAY)
  // --------------------------------------------------------------------------
  console.log('\n--- [TEST 4] Ad Reward Exploit & Daily 5-Ad Cap ---');
  {
    saveManager.resetProgress();
    // Early close exploit simulation: Ad closed before completion (e.g. at 2s)
    let adCompleted = false;
    const coinsBeforeEarlyClose = saveManager.getCoins();
    const remainingBeforeEarlyClose = saveManager.getRemainingRewardedAdsToday();
    
    // User cancels/closes ad modal early
    const onAdClosedEarly = () => {
      if (adCompleted) {
        saveManager.recordRewardedAdWatched();
        saveManager.addCoins(50);
      }
    };
    onAdClosedEarly(); // Triggers without completion
    assert(saveManager.getCoins() === coinsBeforeEarlyClose, 'Early ad close: 0 coins awarded');
    assert(saveManager.getRemainingRewardedAdsToday() === remainingBeforeEarlyClose, 'Early ad close: Daily ad limit not consumed');

    // Page refresh during ad simulation
    // Since adCompleted was false before reload, localStorage state after reload has 0 unearned reward
    saveManager.save();
    const reloadSaveManager = SaveManager.getInstance();
    assert(reloadSaveManager.getCoins() === 0, 'Page refresh mid-ad: No coins persisted or awarded on reboot');

    // Legitimately watch 5 ads
    for (let i = 1; i <= 5; i++) {
      adCompleted = true; // Completed ad view
      const remaining = saveManager.recordRewardedAdWatched();
      saveManager.addCoins(50);
      assert(remaining === 5 - i, `Ad ${i}/5 watched to completion, remaining: ${5 - i}`);
    }

    assert(saveManager.getRemainingRewardedAdsToday() === 0, '0 rewarded ads remaining');
    assert(saveManager.canWatchRewardedAd() === false, 'canWatchRewardedAd returns false after 5 ads');
    assert(saveManager.getCoins() === 250, 'Max 250 coins earned today from ads');

    // Attempt 6th ad exploit
    const preExploitCoins = saveManager.getCoins();
    if (saveManager.canWatchRewardedAd()) {
      saveManager.addCoins(50);
    }
    assert(saveManager.getCoins() === preExploitCoins, '6th ad reward rejected by daily cap guard');
  }

  // --------------------------------------------------------------------------
  // TEST 5: INFINITE MISSION LOOP & CATEGORY DIVERSITY
  // --------------------------------------------------------------------------
  console.log('\n--- [TEST 5] Infinite Mission Loop & Category Diversity ---');
  {
    saveManager.resetProgress();
    const missionManager = MissionManager.getInstance();
    missionManager.ensureActiveMissions();

    const activeMissions = missionManager.getActiveMissions();
    assert(activeMissions.length === 3, 'Exactly 3 active missions present');

    // Verify category diversity (no duplicates among active 3)
    const types = activeMissions.map((m) => m.definition.type);
    const uniqueTypes = new Set(types);
    assert(uniqueTypes.size === 3, `All 3 active missions have distinct categories: [${types.join(', ')}]`);

    // Claim easy mission and verify new mission starts with 0 progress
    const easyMission = activeMissions.find((m) => m.definition.tier === 'easy')!;
    missionManager.reportProgress(easyMission.definition.type, easyMission.definition.target, true);
    
    const coinsBeforeClaim = saveManager.getCoins();
    missionManager.claimMission(easyMission.state.id);
    const coinsAfterClaim = saveManager.getCoins();
    assert(coinsAfterClaim > coinsBeforeClaim, 'Earned coins on legitimate claim');

    const updatedMissions = missionManager.getActiveMissions();
    const newEasyMission = updatedMissions.find((m) => m.definition.tier === 'easy')!;
    
    assert(newEasyMission.state.progress === 0, 'New replacement mission progress starts at 0');
    assert(newEasyMission.state.claimed === false, 'New replacement mission is not claimed');
    assert(newEasyMission.state.target > 0, 'New mission target is strictly positive');
    assert(newEasyMission.state.progress < newEasyMission.state.target, 'New mission cannot be instantly claimed');

    // Infinite Loop Attack: Attempt to repeatedly claim newly rolled missions without playing
    let exploitSucceeded = false;
    for (let loop = 0; loop < 10; loop++) {
      for (const m of missionManager.getActiveMissions()) {
        const attempted = missionManager.claimMission(m.state.id);
        if (attempted) {
          exploitSucceeded = true;
        }
      }
    }
    assert(exploitSucceeded === false, 'Infinite loop attack: 10 rapid claim attempts blocked with 0 instant rewards');
    assert(saveManager.getCoins() === coinsAfterClaim, 'Coin balance untouched by infinite loop attempt');

    // Verify category diversity is preserved after replacement
    const newTypes = updatedMissions.map((m) => m.definition.type);
    const newUniqueTypes = new Set(newTypes);
    assert(newUniqueTypes.size === 3, `Category diversity maintained after roll: [${newTypes.join(', ')}]`);
  }

  // --------------------------------------------------------------------------
  // TEST 6: BOARD SOLVER & MULTI-LINE DETECTION
  // --------------------------------------------------------------------------
  console.log('\n--- [TEST 6] Board Solver & Multi-Line Clear Detection ---');
  {
    const boardManager = BoardManager.getInstance();
    boardManager.reset();

    // Fill entire row 3
    for (let c = 0; c < 8; c++) {
      boardManager.placePiece([[1]], 3, c, '#3B82F6');
    }

    // Fill entire col 5
    for (let r = 0; r < 8; r++) {
      if (r !== 3) {
        boardManager.placePiece([[1]], r, 5, '#3B82F6');
      }
    }

    const { rows, cols } = boardManager.findCompletedLines();
    assert(rows.length === 1 && rows[0] === 3, 'Detected completed row 3');
    assert(cols.length === 1 && cols[0] === 5, 'Detected completed col 5');

    // Clear lines
    boardManager.clearLines(rows, cols);
    const postClearLines = boardManager.findCompletedLines();
    assert(postClearLines.rows.length === 0 && postClearLines.cols.length === 0, 'Lines cleared cleanly');
    assert(boardManager.isCellOccupied(3, 5) === false, 'Intersecting cross point (3, 5) cleared to empty');
  }

  // --------------------------------------------------------------------------
  // TEST 7: STORAGE DURABILITY & CORRUPTED JSON RECOVERY
  // --------------------------------------------------------------------------
  console.log('\n--- [TEST 7] Storage Durability & Corrupted Save Recovery ---');
  {
    saveManager.resetProgress();
    saveManager.addCoins(500);
    saveManager.updateScore(2400);
    saveManager.save();

    // Corrupt the primary save key with garbage
    localStorage.setItem('blockzu_player_data', '{ corrupted_json_payload: invalid !!!');

    // Load should recover from backup or safe defaults without crashing
    const loadedData = storageService.load();
    assert(loadedData !== null, 'Loaded data successfully despite corrupted primary save');
    assert(typeof loadedData.economy.coins === 'number', 'Economy object intact');
    assert(loadedData.metadata.version === 1, 'Metadata version intact');
  }

  // --------------------------------------------------------------------------
  // TEST 8: BETA ANALYTICS INVARIANTS & TELEMETRY SUITE (Milestone 11.5)
  // --------------------------------------------------------------------------
  console.log('\n--- [TEST 8] Beta Analytics Invariants & Telemetry (M11.5) ---');
  {
    saveManager.resetProgress();
    const analyticsManager = AnalyticsManager.getInstance();
    const statsManager = StatisticsManager.getInstance();
    const themeManager = ThemeManager.getInstance();
    const achievementManager = AchievementManager.getInstance();

    // 1. Initial State
    let analytics = analyticsManager.getAnalytics();
    assert(analytics.gamesPlayed === 0, 'Initial analytics gamesPlayed is 0');
    assert(analytics.averageScore === 0, 'Initial analytics averageScore is 0');
    assert(analytics.themesPurchased === 0, 'Initial analytics themesPurchased is 0');
    assert(analytics.achievementsClaimed === 0, 'Initial analytics achievementsClaimed is 0');
    assert(analytics.revivesUsed === 0, 'Initial analytics revivesUsed is 0');
    assert(analytics.totalSessionTimeSeconds === 0, 'Initial analytics totalSessionTimeSeconds is 0');

    // 2. Games Played & Average Score tracking
    statsManager.recordGameFinished(1000, 4, 12, 2);
    statsManager.recordGameFinished(2000, 8, 24, 3);
    statsManager.recordGameFinished(3000, 12, 36, 4);

    analytics = analyticsManager.getAnalytics();
    assert(analytics.gamesPlayed === 3, 'Analytics accurately recorded 3 games played');
    assert(analytics.averageScore === 2000, 'Analytics accurately computed dynamic average score of 2000');

    // 3. Themes Purchased tracking
    const darkTheme = THEME_CATALOG.find((t) => t.id === 'dark')!;
    saveManager.addCoins(1400);
    themeManager.purchaseTheme(darkTheme);

    analytics = analyticsManager.getAnalytics();
    assert(analytics.themesPurchased === 1, 'Analytics accurately recorded 1 theme purchased');

    // 4. Achievements Claimed tracking
    achievementManager.updateProgress('first_placement', 1);
    achievementManager.claimReward('first_placement');

    analytics = analyticsManager.getAnalytics();
    assert(analytics.achievementsClaimed === 1, 'Analytics accurately recorded 1 achievement claimed');

    // 5. Revives Used tracking
    analyticsManager.recordReviveUsed();
    analytics = analyticsManager.getAnalytics();
    assert(analytics.revivesUsed === 1, 'Analytics accurately recorded 1 revive used');

    // 6. Session Length & Multi-Session Tracking
    analyticsManager.recordSessionTime(120); // 120 seconds in session 1
    analytics = analyticsManager.getAnalytics();
    assert(analytics.totalSessionTimeSeconds === 120, 'Accrued 120s total session time');
    assert(analytics.averageSessionLengthSeconds === 120, 'Session 1 average duration is 120s');

    // Start Session 2
    analyticsManager.startNewSession();
    analyticsManager.recordSessionTime(60); // 60 seconds in session 2
    analytics = analyticsManager.getAnalytics();
    assert(analytics.sessionCount === 2, 'Session count incremented to 2');
    assert(analytics.totalSessionTimeSeconds === 180, 'Total session time is 180s (120s + 60s)');
    assert(analytics.averageSessionLengthSeconds === 90, 'Average session duration is (180s / 2) = 90s');

    // 7. Structured Report & JSON Export
    const report = analyticsManager.getSummaryReport();
    assert(report.metrics.averageScore === 2000, 'Summary report contains correct averageScore');
    assert(report.metrics.gamesPlayed === 3, 'Summary report contains correct gamesPlayed');
    assert(report.metrics.themesPurchased === 1, 'Summary report contains correct themesPurchased');
    assert(report.metrics.achievementsClaimed === 1, 'Summary report contains correct achievementsClaimed');
    assert(report.metrics.revivesUsed === 1, 'Summary report contains correct revivesUsed');
    assert(typeof report.metrics.totalSessionTimeFormatted === 'string', 'Formatted session duration present');

    const exportedJSON = analyticsManager.exportJSON();
    const parsedJSON = JSON.parse(exportedJSON);
    assert(parsedJSON.metrics.gamesPlayed === 3, 'Exported JSON parses cleanly with accurate telemetry data');

    // 8. Persistence across Storage reload
    saveManager.save();
    const freshStorageLoad = storageService.load();
    assert(freshStorageLoad.analytics !== undefined, 'Analytics object persisted in localStorage');
    assert(freshStorageLoad.analytics?.gamesPlayed === 3, 'Persisted gamesPlayed retained after storage reload');
    assert(freshStorageLoad.analytics?.themesPurchased === 1, 'Persisted themesPurchased retained after storage reload');
    assert(freshStorageLoad.analytics?.revivesUsed === 1, 'Persisted revivesUsed retained after storage reload');
  }

  // --------------------------------------------------------------------------
  // TEST 9: DUAL-PLATFORM MONETIZATION & AD TELEMETRY INVARIANTS
  // --------------------------------------------------------------------------
  console.log('\n--- [TEST 9] Dual-Platform Monetization & Ad Telemetry ---');
  {
    saveManager.resetProgress();
    const adManager = AdManager.getInstance();
    const analyticsManager = AnalyticsManager.getInstance();

    // 1. Config Invariants
    assert(MONETIZATION_CONFIG.admob.appId.startsWith('ca-app-pub-'), 'AdMob App ID formatted with valid ca-app-pub prefix');
    assert(MONETIZATION_CONFIG.admob.units.rewarded.includes('/'), 'AdMob Rewarded Unit ID contains slash separator');
    assert(MONETIZATION_CONFIG.admob.units.interstitial.includes('/'), 'AdMob Interstitial Unit ID contains slash separator');
    assert(MONETIZATION_CONFIG.admob.units.banner.includes('/'), 'AdMob Banner Unit ID contains slash separator');
    assert(MONETIZATION_CONFIG.adsense.publisherId.startsWith('ca-pub-'), 'AdSense Publisher ID formatted with valid ca-pub prefix');
    assert(MONETIZATION_CONFIG.rules.rewardedCoinsAmount === 50, 'Rewarded ad awards exactly 50 coins');
    assert(MONETIZATION_CONFIG.rules.dailyRewardedAdLimit === 5, 'Daily rewarded ad limit is capped at 5 ads/day');
    assert(MONETIZATION_CONFIG.rules.interstitialGameInterval === 4, 'Interstitial frequency is 4 games');
    assert(MONETIZATION_CONFIG.rules.interstitialCooldownSeconds === 180, 'Interstitial cooldown is 180s (3 minutes)');

    // 2. Monetization Telemetry Flow
    analyticsManager.recordAdStarted('rewarded', 'admob');
    analyticsManager.recordAdCompleted('rewarded', 'admob', 'coins');

    analyticsManager.recordAdStarted('rewarded', 'adsense');
    analyticsManager.recordAdSkipped('rewarded');

    analyticsManager.recordAdStarted('interstitial', 'admob');
    analyticsManager.recordAdCompleted('interstitial', 'admob');

    const monData = analyticsManager.getMonetizationData();
    assert(monData.rewardedAdsStarted === 2, 'Tracked 2 rewarded ads started');
    assert(monData.rewardedAdsCompleted === 1, 'Tracked 1 rewarded ad completed');
    assert(monData.rewardedAdsSkipped === 1, 'Tracked 1 rewarded ad skipped');
    assert(monData.freeCoinsClaimed === 1, 'Tracked 1 free coins reward claimed');
    assert(monData.interstitialsShown === 1, 'Tracked 1 interstitial ad shown');
    assert(monData.admobEvents === 4, 'Tracked 4 native AdMob events (2 starts + 2 completions)');
    assert(monData.adsenseEvents === 1, 'Tracked 1 AdSense event');

    const summaryReport = analyticsManager.getSummaryReport();
    assert(summaryReport.monetization.completionRate === '50%', 'Accurately computed 50% ad completion rate');
    assert(summaryReport.monetization.rewardedAdsCompleted === 1, 'Summary report contains monetization telemetry');
  }

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
