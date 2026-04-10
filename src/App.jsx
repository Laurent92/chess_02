import { useReducer, useCallback, useEffect } from 'react'
import PIECES, { rotateCells, getRotatedCellColor } from './data/pieces'
import Piece from './components/Piece'
import Board from './components/Board'
import './App.css'

function undoableReducer(state, action) {
  const { past, present, future } = state
  switch (action.type) {
    case 'SET': {
      const next = typeof action.updater === 'function' ? action.updater(present) : action.updater
      if (next === present) return state
      return { past: [...past, present], present: next, future: [] }
    }
    case 'UNDO': {
      if (past.length === 0) return state
      return { past: past.slice(0, -1), present: past[past.length - 1], future: [present, ...future] }
    }
    case 'REDO': {
      if (future.length === 0) return state
      return { past: [...past, present], present: future[0], future: future.slice(1) }
    }
    default: return state
  }
}

function useUndoable(initialState) {
  const [{ past, present, future }, dispatch] = useReducer(undoableReducer, {
    past: [], present: initialState, future: [],
  })

  const setState = useCallback((updater) => dispatch({ type: 'SET', updater }), [])
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [])
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [])

  return { state: present, setState, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 }
}

function App() {
  const { state: placedPieces, setState: setPlacedPieces, undo, redo, canUndo, canRedo } = useUndoable({})

  // Ctrl+Z / Ctrl+Y keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

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

  function handleReset() {
    if (Object.keys(placedPieces).length === 0) return
    setPlacedPieces({})
  }

  const placedIds = new Set(Object.keys(placedPieces).map(Number))

  return (
    <div className="app">
      <h1>Sectional Checkerboard</h1>
      <p className="subtitle">Puzzle de Luers (1880) — 15 pièces, 6 013 solutions</p>
      <div className="toolbar">
        <button onClick={undo} disabled={!canUndo} title="Annuler (Ctrl+Z)">Annuler</button>
        <button onClick={redo} disabled={!canRedo} title="Rétablir (Ctrl+Y)">Rétablir</button>
        <button onClick={handleReset} disabled={placedIds.size === 0} title="Tout remettre dans l'inventaire">Reset</button>
      </div>
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
          {[...PIECES].sort((a, b) => a.label.value - b.label.value).map((piece) => (
            <Piece key={piece.id} piece={piece} placed={placedIds.has(piece.id)} />
          ))}
        </div>
        <Board placedPieces={placedPieces} onDrop={handleDrop} />
      </div>
    </div>
  )
}

export default App
