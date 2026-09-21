import { PieceDefinition } from '../types/Piece';

/**
 * PIECE CATALOG (19 Standard Polyomino Shapes with Difficulty Weights)
 * Pure data representation.
 */
export const PIECE_CATALOG: PieceDefinition[] = [
  // --- Single Block (High frequency) ---
  {
    id: 'single_1x1',
    name: 'Single Dot',
    cells: [[1]],
    weight: 12,
    blockCount: 1
  },

  // --- 2-Block Lines ---
  {
    id: 'line_1x2',
    name: 'Line 2H',
    cells: [[1, 1]],
    weight: 10,
    blockCount: 2
  },
  {
    id: 'line_2x1',
    name: 'Line 2V',
    cells: [[1], [1]],
    weight: 10,
    blockCount: 2
  },

  // --- 3-Block Lines ---
  {
    id: 'line_1x3',
    name: 'Line 3H',
    cells: [[1, 1, 1]],
    weight: 8,
    blockCount: 3
  },
  {
    id: 'line_3x1',
    name: 'Line 3V',
    cells: [[1], [1], [1]],
    weight: 8,
    blockCount: 3
  },

  // --- 4-Block Lines ---
  {
    id: 'line_1x4',
    name: 'Line 4H',
    cells: [[1, 1, 1, 1]],
    weight: 5,
    blockCount: 4
  },
  {
    id: 'line_4x1',
    name: 'Line 4V',
    cells: [[1], [1], [1], [1]],
    weight: 5,
    blockCount: 4
  },

  // --- 5-Block Lines ---
  {
    id: 'line_1x5',
    name: 'Line 5H',
    cells: [[1, 1, 1, 1, 1]],
    weight: 3,
    blockCount: 5
  },
  {
    id: 'line_5x1',
    name: 'Line 5V',
    cells: [[1], [1], [1], [1], [1]],
    weight: 3,
    blockCount: 5
  },

  // --- Squares ---
  {
    id: 'square_2x2',
    name: 'Small Square',
    cells: [
      [1, 1],
      [1, 1]
    ],
    weight: 7,
    blockCount: 4
  },
  {
    id: 'square_3x3',
    name: 'Large Square',
    cells: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ],
    weight: 2,
    blockCount: 9
  },

  // --- L-Shapes (4 Rotations) ---
  {
    id: 'l_shape_1',
    name: 'L-Shape 1',
    cells: [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    weight: 6,
    blockCount: 4
  },
  {
    id: 'l_shape_2',
    name: 'L-Shape 2',
    cells: [
      [0, 1],
      [0, 1],
      [1, 1]
    ],
    weight: 6,
    blockCount: 4
  },
  {
    id: 'l_shape_3',
    name: 'L-Shape 3',
    cells: [
      [1, 1, 1],
      [1, 0, 0]
    ],
    weight: 6,
    blockCount: 4
  },
  {
    id: 'l_shape_4',
    name: 'L-Shape 4',
    cells: [
      [1, 1, 1],
      [0, 0, 1]
    ],
    weight: 6,
    blockCount: 4
  },

  // --- T-Shapes (4 Rotations) ---
  {
    id: 't_shape_down',
    name: 'T-Shape Down',
    cells: [
      [1, 1, 1],
      [0, 1, 0]
    ],
    weight: 5,
    blockCount: 4
  },
  {
    id: 't_shape_up',
    name: 'T-Shape Up',
    cells: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    weight: 5,
    blockCount: 4
  },
  {
    id: 't_shape_right',
    name: 'T-Shape Right',
    cells: [
      [1, 0],
      [1, 1],
      [1, 0]
    ],
    weight: 5,
    blockCount: 4
  },
  {
    id: 't_shape_left',
    name: 'T-Shape Left',
    cells: [
      [0, 1],
      [1, 1],
      [0, 1]
    ],
    weight: 5,
    blockCount: 4
  },

  // --- Z / S Shapes (4 Rotations) ---
  {
    id: 'z_shape_horiz',
    name: 'Z-Shape Horiz',
    cells: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    weight: 5,
    blockCount: 4
  },
  {
    id: 's_shape_horiz',
    name: 'S-Shape Horiz',
    cells: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    weight: 5,
    blockCount: 4
  },
  {
    id: 'z_shape_vert',
    name: 'Z-Shape Vert',
    cells: [
      [1, 0],
      [1, 1],
      [0, 1]
    ],
    weight: 4,
    blockCount: 4
  },
  {
    id: 's_shape_vert',
    name: 'S-Shape Vert',
    cells: [
      [0, 1],
      [1, 1],
      [1, 0]
    ],
    weight: 4,
    blockCount: 4
  }
];
