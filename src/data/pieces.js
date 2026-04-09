/**
 * Définition des 15 pièces du Sectional Checkerboard de Luers (1880).
 *
 * Chaque pièce est définie par :
 *   - id      : numéro interne de la pièce (1-15)
 *   - label   : { text, cellIndex } — numéro affiché sur la pièce, à la case d'index cellIndex dans cells[]
 *   - cells   : tableau de [row, col] en coordonnées locales (0,0 = coin haut-gauche du bounding box)
 *   - phase   : 0 = case (0,0) Rouge, 1 = case (0,0) Jaune
 *              La couleur d'une case (r,c) est :
 *              phase 0 → Rouge si (r+c) pair, Jaune si impair
 *              phase 1 → Jaune si (r+c) pair, Rouge si impair
 *
 * Total des cases : 64 (= grille 8×8)
 * Équilibre couleurs : 32 Rouge, 32 Jaune
 *
 * Formes identifiées d'après les photos docs/pieces.webp et docs/1.webp.
 */

const PIECES = [
  {
    id: 1,
    label: { text: 1, cellIndex: 0 },
    name: 'Domino',
    cells: [[0, 0], [0, 1]],
    phase: 1,
  },
  {
    id: 2,
    label: { text: 6, cellIndex: 2 },
    name: 'Grand L',
    cells: [[0, 0], [1, 0], [2, 0], [2, 1]],
    phase: 0,
  },
  {
    id: 3,
    label: { text: 3, cellIndex: 0 },
    name: 'L-tromino A',
    cells: [[0, 0], [0, 1], [1, 0]],
    phase: 1,
  },
  {
    id: 4,
    label: null,
    name: 'J-tetromino',
    cells: [[0, 0], [0, 1], [1, 0], [2, 0]],
    phase: 0,
  },
  {
    id: 5,
    label: { text: 2, cellIndex: 1 },
    name: 'L-tromino B',
    cells: [[0, 0], [0, 1], [1, 1]],
    phase: 1,
  },
  {
    id: 6,
    label: { text: 10, cellIndex: 2 },
    name: 'Zigzag hexomino',
    cells: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]],
    phase: 0,
  },
  {
    id: 7,
    label: { text: 5, cellIndex: 2 },
    name: 'L-pentomino',
    cells: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
    phase: 1,
  },
  {
    id: 8,
    label: null,
    name: 'Z-tetromino',
    cells: [[0, 0], [1, 0], [1, 1], [2, 1]],
    phase: 0,
  },
  {
    id: 9,
    label: null,
    name: 'S-tetromino',
    cells: [[0, 1], [1, 0], [1, 1], [2, 0]],
    phase: 0,
  },
  {
    id: 10,
    label: { text: 7, cellIndex: 1 },
    name: 'L-tetromino',
    cells: [[0, 0], [0, 1], [1, 1], [2, 1]],
    phase: 0,
  },
  {
    id: 11,
    label: null,
    name: 'T-pentomino',
    cells: [[0, 0], [0, 1], [0, 2], [1, 1], [2, 1]],
    phase: 1,
  },
  {
    id: 12,
    label: null,
    name: 'S-pentomino',
    cells: [[0, 1], [1, 0], [1, 1], [2, 0], [3, 0]],
    phase: 1,
  },
  {
    id: 13,
    label: { text: 14, cellIndex: 2 },
    name: 'Plus',
    cells: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
    phase: 0,
  },
  {
    id: 14,
    label: null,
    name: 'S-horizontal',
    cells: [[0, 0], [0, 1], [1, 1], [1, 2]],
    phase: 0,
  },
  {
    id: 15,
    label: null,
    name: 'P-pentomino',
    cells: [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0]],
    phase: 1,
  },
];

/**
 * Retourne la couleur d'une case de pièce.
 * @param {number} row - ligne locale
 * @param {number} col - colonne locale
 * @param {number} phase - 0 ou 1
 * @returns {'R' | 'J'} Rouge ou Jaune
 */
export function getCellColor(row, col, phase) {
  const parity = (row + col) % 2;
  if (phase === 0) {
    return parity === 0 ? 'R' : 'J';
  }
  return parity === 0 ? 'J' : 'R';
}

export default PIECES;
