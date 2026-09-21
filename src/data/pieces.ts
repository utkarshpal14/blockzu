import { Piece } from '../types/Piece';

/**
 * PIECE SHAPES CATALOG (19 Standard Polyominoes)
 * Defined in Document 02 (Game Design Document) & Document 03 (Technical Architecture).
 */
export const PIECE_CATALOG: Piece[] = [
  // --- Single Block ---
  {
    id: 'dot_1x1',
    name: 'Dot',
    category: 'single',
    shape: [[1]],
    blockSize: 1
  },

  // --- Line Pieces (Horizontal & Vertical) ---
  {
    id: 'line_1x2',
    name: 'Line 2H',
    category: 'line',
    shape: [[1, 1]],
    blockSize: 2
  },
  {
    id: 'line_2x1',
    name: 'Line 2V',
    category: 'line',
    shape: [[1], [1]],
    blockSize: 2
  },
  {
    id: 'line_1x3',
    name: 'Line 3H',
    category: 'line',
    shape: [[1, 1, 1]],
    blockSize: 3
  },
  {
    id: 'line_3x1',
    name: 'Line 3V',
    category: 'line',
    shape: [[1], [1], [1]],
    blockSize: 3
  },
  {
    id: 'line_1x4',
    name: 'Line 4H',
    category: 'line',
    shape: [[1, 1, 1, 1]],
    blockSize: 4
  },
  {
    id: 'line_4x1',
    name: 'Line 4V',
    category: 'line',
    shape: [[1], [1], [1], [1]],
    blockSize: 4
  },
  {
    id: 'line_1x5',
    name: 'Line 5H',
    category: 'line',
    shape: [[1, 1, 1, 1, 1]],
    blockSize: 5
  },
  {
    id: 'line_5x1',
    name: 'Line 5V',
    category: 'line',
    shape: [[1], [1], [1], [1], [1]],
    blockSize: 5
  },

  // --- Square Pieces ---
  {
    id: 'square_2x2',
    name: 'Small Square',
    category: 'square',
    shape: [
      [1, 1],
      [1, 1]
    ],
    blockSize: 4
  },
  {
    id: 'square_3x3',
    name: 'Large Square',
    category: 'square',
    shape: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ],
    blockSize: 9
  },

  // --- L Pieces (All 4 Orientations) ---
  {
    id: 'l_shape_1',
    name: 'L-Shape 1',
    category: 'l_shape',
    shape: [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    blockSize: 4
  },
  {
    id: 'l_shape_2',
    name: 'L-Shape 2',
    category: 'l_shape',
    shape: [
      [0, 1],
      [0, 1],
      [1, 1]
    ],
    blockSize: 4
  },
  {
    id: 'l_shape_3',
    name: 'L-Shape 3',
    category: 'l_shape',
    shape: [
      [1, 1, 1],
      [1, 0, 0]
    ],
    blockSize: 4
  },
  {
    id: 'l_shape_4',
    name: 'L-Shape 4',
    category: 'l_shape',
    shape: [
      [1, 1, 1],
      [0, 0, 1]
    ],
    blockSize: 4
  },

  // --- T Pieces (All 4 Orientations) ---
  {
    id: 't_shape_1',
    name: 'T-Shape Down',
    category: 't_shape',
    shape: [
      [1, 1, 1],
      [0, 1, 0]
    ],
    blockSize: 4
  },
  {
    id: 't_shape_2',
    name: 'T-Shape Up',
    category: 't_shape',
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    blockSize: 4
  },
  {
    id: 't_shape_3',
    name: 'T-Shape Right',
    category: 't_shape',
    shape: [
      [1, 0],
      [1, 1],
      [1, 0]
    ],
    blockSize: 4
  },
  {
    id: 't_shape_4',
    name: 'T-Shape Left',
    category: 't_shape',
    shape: [
      [0, 1],
      [1, 1],
      [0, 1]
    ],
    blockSize: 4
  },

  // --- Z / S Pieces (All Orientations) ---
  {
    id: 'z_shape_1',
    name: 'Z-Shape Horiz',
    category: 'z_shape',
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    blockSize: 4
  },
  {
    id: 'z_shape_2',
    name: 'S-Shape Horiz',
    category: 'z_shape',
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    blockSize: 4
  },
  {
    id: 'z_shape_3',
    name: 'Z-Shape Vert',
    category: 'z_shape',
    shape: [
      [1, 0],
      [1, 1],
      [0, 1]
    ],
    blockSize: 4
  },
  {
    id: 'z_shape_4',
    name: 'S-Shape Vert',
    category: 'z_shape',
    shape: [
      [0, 1],
      [1, 1],
      [1, 0]
    ],
    blockSize: 4
  }
];
