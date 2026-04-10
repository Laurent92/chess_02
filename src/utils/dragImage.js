import { rotateCells, getRotatedCellColor } from '../data/pieces'

const CELL_SIZE = 48

/**
 * Crée un élément DOM temporaire représentant la pièce entière,
 * à utiliser comme image de drag via dataTransfer.setDragImage().
 * L'élément est inséré hors écran et doit être supprimé après usage.
 *
 * @param {object} piece
 * @param {number} anchorLocalRow - ligne locale (coords rotées) de la case saisie
 * @param {number} anchorLocalCol - colonne locale (coords rotées) de la case saisie
 * @returns {{ element: HTMLElement, offsetX: number, offsetY: number }}
 */
export function createPieceDragImage(piece, anchorLocalRow, anchorLocalCol) {
  const { cells, phase, rotation } = piece
  const rotated = rotateCells(cells, rotation)
  const maxRow = Math.max(...rotated.map(([r]) => r))
  const maxCol = Math.max(...rotated.map(([, c]) => c))
  const rows = maxRow + 1
  const cols = maxCol + 1

  const cellSet = new Set(rotated.map(([r, c]) => `${r},${c}`))

  const container = document.createElement('div')
  container.style.cssText = [
    'position: fixed',
    'left: -9999px',
    'top: -9999px',
    'display: grid',
    `grid-template-columns: repeat(${cols}, ${CELL_SIZE}px)`,
    `grid-template-rows: repeat(${rows}, ${CELL_SIZE}px)`,
    'gap: 0',
    'pointer-events: none',
  ].join(';')

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div')
      cell.style.cssText = `width:${CELL_SIZE}px;height:${CELL_SIZE}px;box-sizing:border-box;`
      if (cellSet.has(`${r},${c}`)) {
        const color = getRotatedCellColor(r, c, rotation, cells, phase)
        cell.style.background = color === 'R' ? '#c62828' : '#f9a825'
        cell.style.border = '2px solid #1a1a1a'
      }
      container.appendChild(cell)
    }
  }

  // Numéro de valeur
  if (piece.label) {
    const [lr, lc] = rotated[piece.label.valueCellIndexDisplay]
    const num = document.createElement('div')
    num.textContent = piece.label.value
    num.style.cssText = [
      'position: absolute',
      `top: ${lr * CELL_SIZE + CELL_SIZE / 2}px`,
      `left: ${lc * CELL_SIZE + CELL_SIZE / 2}px`,
      'transform: translate(-50%, -50%)',
      'font-size: 1.4rem',
      'font-weight: 800',
      'color: #1a3a1a',
      'text-shadow: 0 0 3px rgba(255,255,255,0.5)',
      'pointer-events: none',
      'user-select: none',
      'z-index: 1',
    ].join(';')
    container.style.position = 'relative'
    container.appendChild(num)
  }

  document.body.appendChild(container)

  return {
    element: container,
    offsetX: anchorLocalCol * CELL_SIZE + CELL_SIZE / 2,
    offsetY: anchorLocalRow * CELL_SIZE + CELL_SIZE / 2,
  }
}
