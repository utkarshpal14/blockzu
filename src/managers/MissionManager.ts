import { MISSION_TEMPLATES } from '../data/missions';
import { MissionDefinition, MissionType } from '../types/Mission';
import { MissionData } from '../types/PlayerData';
import { SaveManager } from './SaveManager';

/**
 * MISSION MANAGER
 * Manages 3 active missions with dynamic generation and instant refresh upon claim.
 * Defined in Document 05 (Section 17-26).
 */
export class MissionManager {
  private static instance: MissionManager;
  private saveManager: SaveManager;

  private constructor() {
    this.saveManager = SaveManager.getInstance();
    this.ensureActiveMissions();
  }

  public static getInstance(): MissionManager {
    if (!MissionManager.instance) {
      MissionManager.instance = new MissionManager();
    }
    return MissionManager.instance;
  }

  public ensureActiveMissions() {
    const data = this.saveManager.getData();
    if (!data.missions || data.missions.length < 3) {
      data.missions = [];
      // Pick 1 easy, 1 medium, 1 hard
      const easyPool = MISSION_TEMPLATES.filter((m) => m.tier === 'easy');
      const medPool = MISSION_TEMPLATES.filter((m) => m.tier === 'medium');
      const hardPool = MISSION_TEMPLATES.filter((m) => m.tier === 'hard');

      const easy = easyPool[Math.floor(Math.random() * easyPool.length)];
      const med = medPool[Math.floor(Math.random() * medPool.length)];
      const hard = hardPool[Math.floor(Math.random() * hardPool.length)];

      [easy, med, hard].forEach((def) => {
        if (def) {
          data.missions.push({
            id: def.id,
            progress: 0,
            target: def.target,
            claimed: false
          });
        }
      });
      this.saveManager.save();
    }
  }

  public getActiveMissions(): { state: MissionData; definition: MissionDefinition }[] {
    const data = this.saveManager.getData();
    return data.missions.map((state) => {
      const def = MISSION_TEMPLATES.find((m) => m.id === state.id) || MISSION_TEMPLATES[0];
      return { state, definition: def };
    });
  }

  /**
   * Updates progress on active missions matching the specified type.
   */
  public reportProgress(type: MissionType, amount: number, isCumulative: boolean = true) {
    const active = this.getActiveMissions();
    let changed = false;

    active.forEach(({ state, definition }) => {
      if (definition.type === type && !state.claimed && state.progress < state.target) {
        if (isCumulative) {
          state.progress = Math.min(state.progress + amount, state.target);
        } else {
          state.progress = Math.min(Math.max(state.progress, amount), state.target);
        }
        changed = true;
      }
    });

    if (changed) {
      this.saveManager.save();
    }
  }

  /**
   * Claims mission coins reward and instantly generates a new replacement mission.
   */
  public claimMission(missionId: string): boolean {
    const data = this.saveManager.getData();
    const index = data.missions.findIndex((m) => m.id === missionId);
    if (index === -1) return false;

    const mission = data.missions[index];
    const def = MISSION_TEMPLATES.find((m) => m.id === mission.id);
    if (!def || mission.progress < mission.target || mission.claimed) return false;

    // Award coins
    this.saveManager.addCoins(def.rewardCoins);

    // Pick new random mission to replace this slot
    const activeIds = data.missions.map((m) => m.id);
    const available = MISSION_TEMPLATES.filter((m) => !activeIds.includes(m.id) && m.tier === def.tier);
    const pool = available.length > 0 ? available : MISSION_TEMPLATES.filter((m) => m.id !== def.id);
    const nextDef = pool[Math.floor(Math.random() * pool.length)];

    data.missions[index] = {
      id: nextDef.id,
      progress: 0,
      target: nextDef.target,
      claimed: false
    };

    this.saveManager.save();
    return true;
  }
}
