/**
 * Définition des 15 pièces du Sectional Checkerboard de Luers (1880).
 *
 * Chaque pièce est définie par :
 *   - id       : numéro interne de la pièce (1-15), trié par valeur croissante
 *   - label    : { value, valueCellIndexDisplay } — valeur de la pièce, affichée à la case d'index valueCellIndexDisplay dans cells[]
 *   - cells    : tableau de [row, col] en coordonnées locales (0,0 = coin haut-gauche du bounding box), orientation de référence (rotation 0°)
 *   - phase    : 0 = case (0,0) Rouge, 1 = case (0,0) Jaune
 *              La couleur d'une case (r,c) est :
 *              phase 0 → Rouge si (r+c) pair, Jaune si impair
 *              phase 1 → Jaune si (r+c) pair, Rouge si impair
 *   - rotation : orientation actuelle en degrés (0 | 90 | 180 | 270), sens horaire
 *
 * Total des cases : 64 (= grille 8×8)
 * Équilibre couleurs : 32 Rouge, 32 Jaune
 *
 * Formes identifiées d'après les photos docs/pieces.webp et docs/1.webp.
 */

const PIECES = [
  {
    id: 1,
    label: { value: 1, valueCellIndexDisplay: 0 },
    cells: [[0, 0], [0, 1]],
    phase: 1,
    rotation: 0,
  },
  {
    id: 2,
    label: { value: 2, valueCellIndexDisplay: 1 },
    cells: [[0, 0], [0, 1], [1, 1]],
    phase: 1,
    rotation: 0,
  },
  {
    id: 3,
    label: { value: 2, valueCellIndexDisplay: 1 },
    cells: [[0, 0], [0, 1], [1, 1]],
    phase: 1,
    rotation: 0,
  },
  {
    id: 4,
    label: { value: 3, valueCellIndexDisplay: 0 },
    cells: [[0, 0], [0, 1], [1, 0]],
    phase: 1,
    rotation: 0,
  },
  {
    id: 5,
    label: { value: 4, valueCellIndexDisplay: 2 },
    cells: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
    phase: 0,
    rotation: 0,
  },
  {
    id: 6,
    label: { value: 5, valueCellIndexDisplay: 2 },
    cells: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
    phase: 1,
    rotation: 0,
  },
  {
    id: 7,
    label: { value: 6, valueCellIndexDisplay: 2 },
    cells: [[0, 0], [1, 0], [2, 0], [2, 1]],
    phase: 0,
    rotation: 0,
  },
  {
    id: 8,
    label: { value: 7, valueCellIndexDisplay: 1 },
    cells: [[0, 0], [0, 1], [1, 1], [2, 1]],
    phase: 0,
    rotation: 0,
  },
  {
    id: 9,
    label: { value: 8, valueCellIndexDisplay: 2 },
    cells: [[1, 0], [1, 1], [0, 1], [0, 2], [0, 3]],
    phase: 1,
    rotation: 0,
  },
  {
    id: 10,
    label: { value: 9, valueCellIndexDisplay: 4 },
    cells: [[0, 2], [0, 3], [1, 0], [1, 1], [1, 2]],
    phase: 0,
    rotation: 0,
  },
  {
    id: 11,
    label: { value: 10, valueCellIndexDisplay: 2 },
    cells: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]],
    phase: 0,
    rotation: 0,
  },
  {
    id: 12,
    label: { value: 11, valueCellIndexDisplay: 1 },
    cells: [[0, 0], [1, 0], [1, 1], [2, 0], [3, 0]],
    phase: 0,
    rotation: 0,
  },
  {
    id: 13,
    label: { value: 12, valueCellIndexDisplay: 2 },
    cells: [[0, 2], [1, 0], [1, 1], [1, 2], [2, 0]],
    phase: 0,
    rotation: 0,
  },
  {
    id: 14,
    label: { value: 13, valueCellIndexDisplay: 2 },
    cells: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 1]],
    phase: 1,
    rotation: 0,
  },
  {
    id: 15,
    label: { value: 14, valueCellIndexDisplay: 2 },
    cells: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
    phase: 0,
    rotation: 0,
  },
];

/**
 * Retourne la couleur d'une case selon ses coordonnées locales et la phase de la pièce.
 * @param {number} row
 * @param {number} col
 * @param {number} phase - 0 ou 1
 * @returns {'R' | 'J'}
 */
export function getCellColor(row, col, phase) {
  const parity = (row + col) % 2;
  return (parity === 0) === (phase === 0) ? 'R' : 'J';
}

/**
 * Applique une rotation sens horaire aux cellules d'une pièce et normalise les coordonnées.
 * @param {number[][]} cells - coordonnées locales de référence
 * @param {0|90|180|270} rotation
 * @returns {number[][]} nouvelles coordonnées après rotation et normalisation
 */
export function rotateCells(cells, rotation) {
  if (rotation === 0) return cells;

  const maxRow = Math.max(...cells.map(([r]) => r));
  const maxCol = Math.max(...cells.map(([, c]) => c));

  let rotated;
  if (rotation === 90) {
    rotated = cells.map(([r, c]) => [c, maxRow - r]);
  } else if (rotation === 180) {
    rotated = cells.map(([r, c]) => [maxRow - r, maxCol - c]);
  } else { // 270
    rotated = cells.map(([r, c]) => [maxCol - c, r]);
  }

  const minR = Math.min(...rotated.map(([r]) => r));
  const minC = Math.min(...rotated.map(([, c]) => c));
  return rotated.map(([r, c]) => [r - minR, c - minC]);
}

/**
 * Retourne la couleur d'une case dans la pièce après rotation.
 * La couleur est calculée à partir des coordonnées d'origine (avant rotation),
 * car les couleurs sont fixées physiquement sur la pièce.
 * @param {number} r - ligne dans le repère après rotation
 * @param {number} c - colonne dans le repère après rotation
 * @param {0|90|180|270} rotation
 * @param {number[][]} originalCells - cells de référence (rotation 0°)
 * @param {number} phase
 * @returns {'R' | 'J'}
 */
export function getRotatedCellColor(r, c, rotation, originalCells, phase) {
  if (rotation === 0) return getCellColor(r, c, phase);

  const maxRow = Math.max(...originalCells.map(([r]) => r));
  const maxCol = Math.max(...originalCells.map(([, c]) => c));

  // Coordonnées d'origine correspondant à la position (r, c) après rotation
  let origR, origC;
  if (rotation === 90) {
    origR = maxRow - c;
    origC = r;
  } else if (rotation === 180) {
    origR = maxRow - r;
    origC = maxCol - c;
  } else { // 270
    origR = c;
    origC = maxCol - r;
  }

  return getCellColor(origR, origC, phase);
}

export default PIECES;
