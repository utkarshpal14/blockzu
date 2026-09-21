/**
 * PIECE DATA INTERFACES
 */

export type PieceMatrix = number[][];

export type PieceCategory = 'single' | 'line' | 'square' | 'l_shape' | 't_shape' | 'z_shape';

export interface Piece {
  id: string;
  name: string;
  category: PieceCategory;
  shape: PieceMatrix;
  color?: string;
  blockSize: number;
}

export interface PlacedTile {
  row: number;
  col: number;
  color: string;
}

export interface DragPieceState {
  piece: Piece;
  originTrayIndex: number;
  startX: number;
  startY: number;
}
