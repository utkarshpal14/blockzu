/**
 * PIECE DATA INTERFACES (Data-Only Model)
 * Rendering and styling are handled strictly in the View layer.
 */

export type PieceMatrix = number[][];

export interface PieceDefinition {
  id: string;
  name: string;
  cells: PieceMatrix;
  weight: number;
  blockCount: number;
}

export interface PlacedTile {
  row: number;
  col: number;
  color?: string;
}

export interface TraySlotState {
  slotIndex: number;
  piece: PieceDefinition | null;
}
