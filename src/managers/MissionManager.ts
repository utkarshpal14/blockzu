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
    
    // Check if we need to initialize or fix duplicate categories
    let needsRefresh = !data.missions || data.missions.length < 3;
    if (!needsRefresh && data.missions) {
      const types = data.missions.map((m) => {
        const def = MISSION_TEMPLATES.find((t) => t.id === m.id);
        return def ? def.type : null;
      });
      // Check for duplicates or invalid templates
      const uniqueTypes = new Set(types.filter(Boolean));
      if (uniqueTypes.size < data.missions.length) {
        needsRefresh = true;
      }
    }

    if (needsRefresh) {
      data.missions = [];
      const usedTypes = new Set<MissionType>();

      // 1. Easy Mission (Diverse Type)
      const easyPool = MISSION_TEMPLATES.filter((m) => m.tier === 'easy');
      const easy = easyPool[Math.floor(Math.random() * easyPool.length)];
      if (easy) {
        usedTypes.add(easy.type);
        data.missions.push({
          id: easy.id,
          progress: 0,
          target: easy.target,
          claimed: false
        });
      }

      // 2. Medium Mission (Diverse Type distinct from Easy)
      const medPool = MISSION_TEMPLATES.filter((m) => m.tier === 'medium' && !usedTypes.has(m.type));
      const med = medPool.length > 0
        ? medPool[Math.floor(Math.random() * medPool.length)]
        : MISSION_TEMPLATES.find((m) => m.tier === 'medium')!;
      if (med) {
        usedTypes.add(med.type);
        data.missions.push({
          id: med.id,
          progress: 0,
          target: med.target,
          claimed: false
        });
      }

      // 3. Hard Mission (Diverse Type distinct from Easy & Medium)
      const hardPool = MISSION_TEMPLATES.filter((m) => m.tier === 'hard' && !usedTypes.has(m.type));
      const hard = hardPool.length > 0
        ? hardPool[Math.floor(Math.random() * hardPool.length)]
        : MISSION_TEMPLATES.find((m) => m.tier === 'hard')!;
      if (hard) {
        data.missions.push({
          id: hard.id,
          progress: 0,
          target: hard.target,
          claimed: false
        });
      }

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

  public hasUnclaimedMissions(): boolean {
    return this.getUnclaimedCount() > 0;
  }

  public getUnclaimedCount(): number {
    const data = this.saveManager.getData();
    if (!data.missions) return 0;
    return data.missions.filter((m) => m.progress >= m.target && !m.claimed).length;
  }

  /**
   * Updates progress on active missions matching the specified type.
   * Returns newly completed missions for toast notifications.
   */
  public reportProgress(type: MissionType, amount: number, isCumulative: boolean = true): MissionDefinition[] {
    const active = this.getActiveMissions();
    let changed = false;
    const newlyCompleted: MissionDefinition[] = [];

    active.forEach(({ state, definition }) => {
      if (definition.type === type && !state.claimed && state.progress < state.target) {
        const prev = state.progress;
        if (isCumulative) {
          state.progress = Math.min(state.progress + amount, state.target);
        } else {
          state.progress = Math.min(Math.max(state.progress, amount), state.target);
        }
        changed = true;

        if (prev < state.target && state.progress >= state.target) {
          newlyCompleted.push(definition);
        }
      }
    });

    if (changed) {
      this.saveManager.save();
    }
    return newlyCompleted;
  }

  /**
   * Claims mission coins reward and instantly generates a new replacement mission
   * preserving category diversity across the 3 active slots.
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

    // Identify types of other active missions to maintain category diversity
    const otherActiveMissions = data.missions.filter((m, i) => i !== index);
    const otherTypes = new Set<MissionType>();
    const otherIds = new Set<string>();
    
    otherActiveMissions.forEach((m) => {
      otherIds.add(m.id);
      const otherDef = MISSION_TEMPLATES.find((t) => t.id === m.id);
      if (otherDef) otherTypes.add(otherDef.type);
    });

    // Filter available pool of the same tier that doesn't duplicate active types
    const diversePool = MISSION_TEMPLATES.filter(
      (m) => m.tier === def.tier && !otherIds.has(m.id) && !otherTypes.has(m.type)
    );

    // Fallback if needed
    const fallbackPool = MISSION_TEMPLATES.filter((m) => m.tier === def.tier && !otherIds.has(m.id));
    const pool = diversePool.length > 0 ? diversePool : (fallbackPool.length > 0 ? fallbackPool : MISSION_TEMPLATES);
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
