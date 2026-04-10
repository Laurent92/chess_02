import { useState, useEffect } from 'react'
import PIECES, { rotateCells, getRotatedCellColor } from '../data/pieces'
import { createPieceDragImage } from '../utils/dragImage'

const CELL_SIZE = 48
const BOARD_BORDER = 16

export default function Board({ placedPieces, onDrop }) {
  const [draggingPieceId, setDraggingPieceId] = useState(null)

  useEffect(() => {
    const handler = () => setDraggingPieceId(null)
    document.addEventListener('dragend', handler)
    return () => document.removeEventListener('dragend', handler)
  }, [])

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleCellDrop(r, c, e) {
    e.preventDefault()
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'))
      onDrop(r, c, data)
    } catch { /* ignore malformed drag data */ }
  }

  // 64 empty board cells — drop targets only
  const boardCells = []
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      boardCells.push(
        <div
          key={`${r}-${c}`}
          className={`board-cell ${(r + c) % 2 === 0 ? 'dark' : 'light'}`}
          style={{ width: CELL_SIZE, height: CELL_SIZE }}
          onDragOver={handleDragOver}
          onDrop={e => handleCellDrop(r, c, e)}
        />
      )
    }
  }

  // Piece overlays — absolutely positioned, use same piece-cell classes as inventory
  const pieceOverlays = Object.entries(placedPieces).map(([idStr, { row, col }]) => {
    const pieceId = parseInt(idStr)
    if (pieceId === draggingPieceId) return null

    const piece = PIECES.find(p => p.id === pieceId)
    const rotation = piece.rotation ?? 0
    const rotated = rotateCells(piece.cells, rotation)
    const maxRow = Math.max(...rotated.map(([r]) => r))
    const maxCol = Math.max(...rotated.map(([, c]) => c))
    const rows = maxRow + 1
    const cols = maxCol + 1

    const grid = Array.from({ length: rows }, () => Array(cols).fill(false))
    rotated.forEach(([r, c]) => { grid[r][c] = true })

    const labelCell = piece.label ? rotated[piece.label.valueCellIndexDisplay] : null

    return (
      <div
        key={pieceId}
        style={{
          position: 'absolute',
          top: BOARD_BORDER + row * CELL_SIZE,
          left: BOARD_BORDER + col * CELL_SIZE,
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
          pointerEvents: 'none',
        }}
      >
        {grid.flatMap((rowArr, r) =>
          rowArr.map((occupied, c) => {
            if (!occupied) {
              return (
                <div
                  key={`${r}-${c}`}
                  style={{ width: CELL_SIZE, height: CELL_SIZE, pointerEvents: 'none' }}
                />
              )
            }
            const color = getRotatedCellColor(r, c, rotation, piece.cells, piece.phase)
            const hasTop    = r > 0 && grid[r - 1]?.[c]
            const hasBottom = r < rows - 1 && grid[r + 1]?.[c]
            const hasLeft   = c > 0 && grid[r][c - 1]
            const hasRight  = c < cols - 1 && grid[r][c + 1]
            return (
              <div
                key={`${r}-${c}`}
                className={`piece-cell ${color === 'R' ? 'red' : 'yellow'}`}
                style={{
                  cursor: 'grab',
                  pointerEvents: 'auto',
                  borderTop:    hasTop    ? 'none' : undefined,
                  borderBottom: hasBottom ? 'none' : undefined,
                  borderLeft:   hasLeft   ? 'none' : undefined,
                  borderRight:  hasRight  ? 'none' : undefined,
                }}
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData('text/plain', JSON.stringify({
                    pieceId,
                    anchorRow: r,
                    anchorCol: c,
                  }))
                  e.dataTransfer.effectAllowed = 'move'
                  const { element, offsetX, offsetY } = createPieceDragImage(piece, r, c)
                  e.dataTransfer.setDragImage(element, offsetX, offsetY)
                  setTimeout(() => document.body.removeChild(element), 0)
                  setDraggingPieceId(pieceId)
                }}
                onDragOver={handleDragOver}
                onDrop={e => handleCellDrop(row + r, col + c, e)}
              />
            )
          })
        )}
        {labelCell && (
          <div
            className="piece-number"
            style={{
              position: 'absolute',
              top: (labelCell[0] + 0.5) * CELL_SIZE,
              left: (labelCell[1] + 0.5) * CELL_SIZE,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          >
            {piece.label.value}
          </div>
        )}
      </div>
    )
  })

  return (
    <div className="board-container">
      <div className="board-label">Plateau</div>
      <div style={{ position: 'relative' }}>
        <div
          className="board-grid"
          style={{ gridTemplateColumns: `repeat(8, ${CELL_SIZE}px)` }}
        >
          {boardCells}
        </div>
        {pieceOverlays}
      </div>
    </div>
  )
}
