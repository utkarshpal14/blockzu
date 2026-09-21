import { PIECE_CATALOG } from '../data/pieces';
import { PieceDefinition } from '../types/Piece';
import { BoardManager } from './BoardManager';

/**
 * PIECE MANAGER
 * Manages the 3-piece batch lifecycle, weighted RNG selection, and solvability validation.
 * Defined in Document 02 & Milestone 2.
 */
export class PieceManager {
  private static instance: PieceManager;
  private activeSlots: (PieceDefinition | null)[];
  private totalWeight: number;

  private constructor() {
    this.activeSlots = [null, null, null];
    this.totalWeight = PIECE_CATALOG.reduce((acc, p) => acc + p.weight, 0);
    this.generateNewBatch();
  }

  public static getInstance(): PieceManager {
    if (!PieceManager.instance) {
      PieceManager.instance = new PieceManager();
    }
    return PieceManager.instance;
  }

  /**
   * Resets and spawns a fresh 3-piece batch.
   */
  public reset(): void {
    this.activeSlots = [null, null, null];
    this.generateNewBatch();
  }

  public getActiveSlots(): (PieceDefinition | null)[] {
    return this.activeSlots;
  }

  public getPieceAt(slotIndex: number): PieceDefinition | null {
    if (slotIndex >= 0 && slotIndex < 3) {
      return this.activeSlots[slotIndex];
    }
    return null;
  }

  /**
   * Consumes a piece from its slot when placed onto the board.
   */
  public consumePiece(slotIndex: number): PieceDefinition | null {
    if (slotIndex >= 0 && slotIndex < 3) {
      const piece = this.activeSlots[slotIndex];
      this.activeSlots[slotIndex] = null;
      return piece;
    }
    return null;
  }

  /**
   * Checks if all 3 slots in the current batch are empty.
   */
  public isTrayEmpty(): boolean {
    return this.activeSlots.every((p) => p === null);
  }

  /**
   * Generates a new 3-piece batch if all slots are empty.
   */
  public refillIfEmpty(): boolean {
    if (this.isTrayEmpty()) {
      this.generateNewBatch();
      return true;
    }
    return false;
  }

  /**
   * Generates a balanced batch of 3 pieces with solvability check.
   */
  private generateNewBatch(): void {
    const boardManager = BoardManager.getInstance();
    const batch: PieceDefinition[] = [
      this.pickWeightedPiece(),
      this.pickWeightedPiece(),
      this.pickWeightedPiece()
    ];

    // Solvability check: Ensure at least one piece can fit on the current board state
    const hasPlayable = batch.some((p) => boardManager.hasAnyValidPlacement(p.cells));
    if (!hasPlayable) {
      // Find a small piece from catalog that can fit (e.g., single or 2-block line)
      const playablePiece = PIECE_CATALOG.find((p) => boardManager.hasAnyValidPlacement(p.cells));
      if (playablePiece) {
        batch[2] = playablePiece;
      }
    }

    this.activeSlots = batch;
  }

  /**
   * Weighted random selection from PIECE_CATALOG.
   */
  private pickWeightedPiece(): PieceDefinition {
    let rand = Math.random() * this.totalWeight;
    for (const piece of PIECE_CATALOG) {
      if (rand < piece.weight) {
        return piece;
      }
      rand -= piece.weight;
    }
    return PIECE_CATALOG[0];
  }
}
