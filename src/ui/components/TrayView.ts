import Phaser from 'phaser';
import { TRAY_Y, TRAY_SLOT_X_OFFSETS, TRAY_SCALE, DRAG_SCALE, DRAG_OFFSET_Y, SNAP_DURATION, SPRING_BACK_DURATION } from '../../constants/gameplay';
import { PieceManager } from '../../managers/PieceManager';
import { BoardManager } from '../../managers/BoardManager';
import { AudioManager } from '../../managers/AudioManager';
import { ScoreManager } from '../../managers/ScoreManager';
import { ThemeManager } from '../../managers/ThemeManager';
import { BoardView } from './BoardView';
import { PieceView } from './PieceView';
import { PieceDefinition } from '../../types/Piece';

/**
 * TRAY VIEW COMPONENT
 * Manages the 3-piece batch tray lifecycle, touch drag-and-drop, finger offset,
 * input locking, and grid snapping.
 * Defined in Document 02, 04 & Milestone 2/3/4.
 */
export class TrayView {
  private scene: Phaser.Scene;
  private boardView: BoardView;
  private pieceManager: PieceManager;
  private boardManager: BoardManager;
  private audioManager: AudioManager;
  private scoreManager: ScoreManager;

  private pieceViews: (PieceView | null)[];
  private isDragging: boolean = false;
  private isLocked: boolean = false;
  private draggedPiece: PieceView | null = null;
  private draggedSlotIndex: number = -1;
  private dragOriginX: number = 0;
  private dragOriginY: number = 0;

  private onPlacementCallback?: (piece: PieceDefinition, row: number, col: number, onComplete: () => void) => void;

  constructor(
    scene: Phaser.Scene,
    boardView: BoardView,
    onPlacement?: (piece: PieceDefinition, row: number, col: number, onComplete: () => void) => void
  ) {
    this.scene = scene;
    this.boardView = boardView;
    this.onPlacementCallback = onPlacement;

    this.pieceManager = PieceManager.getInstance();
    this.boardManager = BoardManager.getInstance();
    this.audioManager = AudioManager.getInstance();
    this.scoreManager = ScoreManager.getInstance();

    this.pieceViews = [null, null, null];
    this.spawnBatch();
  }

  public setLocked(locked: boolean): void {
    this.isLocked = locked;
  }

  /**
   * Spawns PieceViews for current active batch in PieceManager.
   */
  public spawnBatch(): void {
    const activeSlots = this.pieceManager.getActiveSlots();

    for (let i = 0; i < 3; i++) {
      if (this.pieceViews[i]) {
        this.pieceViews[i]?.destroy();
        this.pieceViews[i] = null;
      }

      const pieceDef = activeSlots[i];
      if (pieceDef) {
        const slotX = TRAY_SLOT_X_OFFSETS[i];
        const slotY = TRAY_Y;

        const pieceView = new PieceView(this.scene, slotX, slotY, pieceDef);
        this.setupPieceInteraction(pieceView, i, slotX, slotY);

        // Entrance scale animation
        pieceView.setScale(0);
        this.scene.tweens.add({
          targets: pieceView,
          scale: TRAY_SCALE,
          duration: 200,
          delay: i * 60,
          ease: 'Back.easeOut'
        });

        this.pieceViews[i] = pieceView;
      }
    }
  }

  /**
   * Configures touch drag-and-drop mechanics with Block Blast touch-first feel.
   */
  private setupPieceInteraction(pieceView: PieceView, slotIndex: number, slotX: number, slotY: number): void {
    pieceView.setInteractive({ useHandCursor: true });

    pieceView.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging || this.isLocked) return;

      this.isDragging = true;
      this.draggedPiece = pieceView;
      this.draggedSlotIndex = slotIndex;
      this.dragOriginX = slotX;
      this.dragOriginY = slotY;

      pieceView.setDepth(100);
      this.audioManager.playPickup();

      // Smoothly scale up to 1.0x (full board tile size)
      this.scene.tweens.add({
        targets: pieceView,
        scale: DRAG_SCALE,
        duration: 70,
        ease: 'Linear'
      });

      // Position with vertical finger offset
      pieceView.x = pointer.x;
      pieceView.y = pointer.y - DRAG_OFFSET_Y;

      this.updateGhostPreview(pieceView);
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.isDragging || !this.draggedPiece || this.draggedPiece !== pieceView) return;

      this.draggedPiece.x = pointer.x;
      this.draggedPiece.y = pointer.y - DRAG_OFFSET_Y;

      this.updateGhostPreview(this.draggedPiece);
    });

    this.scene.input.on('pointerup', () => {
      if (!this.isDragging || !this.draggedPiece || this.draggedPiece !== pieceView) return;
      this.handlePieceDrop(this.draggedPiece, this.draggedSlotIndex);
    });
  }

  /**
   * Calculates target grid coordinates and projects live ghost preview.
   */
  private updateGhostPreview(pieceView: PieceView): void {
    const target = this.calculateTargetGridPosition(pieceView);

    if (target) {
      const isValid = this.boardManager.canPlacePiece(pieceView.getDefinition().cells, target.row, target.col);
      this.boardView.drawGhostPreview(pieceView.getDefinition().cells, target.row, target.col, isValid);
    } else {
      this.boardView.clearGhostPreview();
    }
  }

  /**
   * Maps current floating piece position to top-left grid row & col.
   */
  private calculateTargetGridPosition(pieceView: PieceView): { row: number; col: number } | null {
    const dims = pieceView.getShapeDimensions();
    const shapeTopLeftX = pieceView.x - dims.width / 2;
    const shapeTopLeftY = pieceView.y - dims.height / 2;

    const firstTileCenterX = shapeTopLeftX + 22.5;
    const firstTileCenterY = shapeTopLeftY + 22.5;

    return this.boardManager.getGridCoordinateFromWorld(firstTileCenterX, firstTileCenterY);
  }

  /**
   * Handles dropping a piece onto the board or springing back to tray.
   */
  private handlePieceDrop(pieceView: PieceView, slotIndex: number): void {
    const target = this.calculateTargetGridPosition(pieceView);
    const pieceDef = pieceView.getDefinition();
    const canPlace = target && this.boardManager.canPlacePiece(pieceDef.cells, target.row, target.col);

    if (canPlace && target) {
      // 1. Calculate exact destination snapping coordinate
      const targetPos = this.boardManager.getCellTopLeft(target.row, target.col);
      const dims = pieceView.getShapeDimensions();
      const snapTargetX = targetPos.x + dims.width / 2;
      const snapTargetY = targetPos.y + dims.height / 2;

      // 2. Snap Animation (80ms)
      this.scene.tweens.add({
        targets: pieceView,
        x: snapTargetX,
        y: snapTargetY,
        duration: SNAP_DURATION,
        ease: 'Quad.easeOut',
        onComplete: () => {
          // 3. Commit Placement to BoardManager
          const theme = ThemeManager.getInstance().getActiveColors();
          this.boardManager.placePiece(pieceDef.cells, target.row, target.col, theme.cellFilled);
          this.boardView.updateFilledTiles();

          // 4. Score points (+1 per block tile)
          this.scoreManager.addPlacementScore(pieceDef.blockCount);
          this.audioManager.playPlace();

          // 5. Consume from Tray Slot
          this.pieceManager.consumePiece(slotIndex);
          this.pieceViews[slotIndex] = null;
          pieceView.destroy();

          this.boardView.clearGhostPreview();
          this.resetDragState();

          // 6. Notify placement & coordinate line clearing lifecycle
          if (this.onPlacementCallback) {
            this.onPlacementCallback(pieceDef, target.row, target.col, () => {
              // 7. Check if Tray is Empty -> Refill with fresh 3-piece batch after lines finish!
              if (this.pieceManager.isTrayEmpty()) {
                this.pieceManager.refillIfEmpty();
                this.scene.time.delayedCall(80, () => {
                  this.spawnBatch();
                });
              }
            });
          } else {
            if (this.pieceManager.isTrayEmpty()) {
              this.pieceManager.refillIfEmpty();
              this.scene.time.delayedCall(80, () => {
                this.spawnBatch();
              });
            }
          }
        }
      });
    } else {
      // Invalid Placement: Spring back to tray slot
      this.audioManager.playInvalid();
      this.boardView.clearGhostPreview();

      this.scene.tweens.add({
        targets: pieceView,
        x: this.dragOriginX,
        y: this.dragOriginY,
        scale: TRAY_SCALE,
        duration: SPRING_BACK_DURATION,
        ease: 'Back.easeOut',
        onComplete: () => {
          pieceView.setDepth(1);
          this.resetDragState();
        }
      });
    }
  }

  private resetDragState(): void {
    this.isDragging = false;
    this.draggedPiece = null;
    this.draggedSlotIndex = -1;
  }

  public destroy(): void {
    this.pieceViews.forEach((pv) => pv?.destroy());
  }
}
