import { useState } from 'react'
import PIECES, { rotateCells, getRotatedCellColor } from './data/pieces'
import Piece from './components/Piece'
import Board from './components/Board'
import './App.css'

function App() {
  const [placedPieces, setPlacedPieces] = useState({})

  function isValidPlacement(piece, originRow, originCol, currentPlaced) {
    const rotation = piece.rotation ?? 0
    const rotated = rotateCells(piece.cells, rotation)

    // Occupancy de toutes les pièces déjà placées, sauf la pièce elle-même
    const occupied = new Set()
    for (const [idStr, { row, col }] of Object.entries(currentPlaced)) {
      if (parseInt(idStr) === piece.id) continue
      const other = PIECES.find(p => p.id === parseInt(idStr))
      rotateCells(other.cells, other.rotation ?? 0).forEach(([cr, cc]) => {
        occupied.add(`${row + cr},${col + cc}`)
      })
    }

    return rotated.every(([cr, cc]) => {
      const br = originRow + cr
      const bc = originCol + cc
      if (br < 0 || br > 7 || bc < 0 || bc > 7) return false
      if (occupied.has(`${br},${bc}`)) return false
      const boardDark = (br + bc) % 2 === 0
      const color = getRotatedCellColor(cr, cc, rotation, piece.cells, piece.phase)
      return color === 'R' ? boardDark : !boardDark
    })
  }

  function handleDrop(boardRow, boardCol, { pieceId, anchorRow, anchorCol }) {
    const piece = PIECES.find(p => p.id === pieceId)
    const originRow = boardRow - anchorRow
    const originCol = boardCol - anchorCol
    setPlacedPieces(prev => {
      if (!isValidPlacement(piece, originRow, originCol, prev)) return prev
      return { ...prev, [pieceId]: { row: originRow, col: originCol } }
    })
  }

  function handleReturnToInventory(pieceId) {
    setPlacedPieces(prev => {
      const next = { ...prev }
      delete next[pieceId]
      return next
    })
  }

  const placedIds = new Set(Object.keys(placedPieces).map(Number))

  return (
    <div className="app">
      <h1>Sectional Checkerboard</h1>
      <p className="subtitle">Puzzle de Luers (1880) — 15 pièces, 6 013 solutions</p>
      <div className="app-layout">
        <div
          className="pieces-gallery"
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault()
            try {
              const { pieceId } = JSON.parse(e.dataTransfer.getData('text/plain'))
              if (placedIds.has(pieceId)) handleReturnToInventory(pieceId)
            } catch { /* ignore malformed drag data */ }
          }}
        >
          {PIECES.filter(p => !placedIds.has(p.id)).map((piece) => (
            <Piece key={piece.id} piece={piece} />
          ))}
        </div>
        <Board placedPieces={placedPieces} onDrop={handleDrop} />
      </div>
    </div>
  )
}

export default App
