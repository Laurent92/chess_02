import { useState, useEffect } from 'react'
import PIECES, { rotateCells, getRotatedCellColor } from '../data/pieces'
import { createPieceDragImage } from '../utils/dragImage'

const CELL_SIZE = 48

export default function Board({ placedPieces, onDrop }) {
  const [draggingPieceId, setDraggingPieceId] = useState(null)

  useEffect(() => {
    const handler = () => setDraggingPieceId(null)
    document.addEventListener('dragend', handler)
    return () => document.removeEventListener('dragend', handler)
  }, [])
  // Compute occupancy: "r,c" -> { pieceId, localRow, localCol }
  const occupancy = {}
  for (const [idStr, { row, col }] of Object.entries(placedPieces)) {
    const pieceId = parseInt(idStr)
    const piece = PIECES.find(p => p.id === pieceId)
    const rotated = rotateCells(piece.cells, piece.rotation)
    rotated.forEach(([cr, cc]) => {
      occupancy[`${row + cr},${col + cc}`] = { pieceId, localRow: cr, localCol: cc }
    })
  }

  // Number label positions for placed pieces
  const pieceLabels = []
  for (const [idStr, { row, col }] of Object.entries(placedPieces)) {
    const pieceId = parseInt(idStr)
    const piece = PIECES.find(p => p.id === pieceId)
    if (piece.label) {
      const rotated = rotateCells(piece.cells, piece.rotation)
      const [lr, lc] = rotated[piece.label.valueCellIndexDisplay]
      pieceLabels.push({ pieceId, boardRow: row + lr, boardCol: col + lc, value: piece.label.value })
    }
  }

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

  const cells = []
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const occ = occupancy[`${r},${c}`]

      if (occ && occ.pieceId !== draggingPieceId) {
        const { pieceId, localRow, localCol } = occ
        const piece = PIECES.find(p => p.id === pieceId)
        const cellColor = getRotatedCellColor(localRow, localCol, piece.rotation, piece.cells, piece.phase)
        const sameUp    = occupancy[`${r-1},${c}`]?.pieceId === pieceId
        const sameDown  = occupancy[`${r+1},${c}`]?.pieceId === pieceId
        const sameLeft  = occupancy[`${r},${c-1}`]?.pieceId === pieceId
        const sameRight = occupancy[`${r},${c+1}`]?.pieceId === pieceId
        cells.push(
          <div
            key={`${r}-${c}`}
            className={`board-cell piece-${cellColor === 'R' ? 'red' : 'yellow'}`}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              borderTop:    sameUp    ? 'none' : undefined,
              borderBottom: sameDown  ? 'none' : undefined,
              borderLeft:   sameLeft  ? 'none' : undefined,
              borderRight:  sameRight ? 'none' : undefined,
            }}
            draggable
            onDragStart={e => {
              e.dataTransfer.setData('text/plain', JSON.stringify({
                pieceId,
                anchorRow: localRow,
                anchorCol: localCol,
              }))
              e.dataTransfer.effectAllowed = 'move'
              const { element, offsetX, offsetY } = createPieceDragImage(piece, localRow, localCol)
              e.dataTransfer.setDragImage(element, offsetX, offsetY)
              setTimeout(() => document.body.removeChild(element), 0)
              setDraggingPieceId(pieceId)
            }}
            onDragOver={handleDragOver}
            onDrop={e => handleCellDrop(r, c, e)}
          />
        )
      } else {
        cells.push(
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
  }

  return (
    <div className="board-container">
      <div className="board-label">Plateau</div>
      <div style={{ position: 'relative' }}>
        <div
          className="board-grid"
          style={{ gridTemplateColumns: `repeat(8, ${CELL_SIZE}px)` }}
        >
          {cells}
        </div>
        {pieceLabels.filter(({ pieceId }) => pieceId !== draggingPieceId).map(({ pieceId, boardRow, boardCol, value }) => (
          <div
            key={pieceId}
            className="board-piece-number"
            style={{
              position: 'absolute',
              top: boardRow * CELL_SIZE + CELL_SIZE / 2,
              left: boardCol * CELL_SIZE + CELL_SIZE / 2,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  )
}
