import PIECES from './data/pieces'
import Piece from './components/Piece'
import './App.css'

function App() {
  return (
    <div className="app">
      <h1>Sectional Checkerboard</h1>
      <p className="subtitle">Puzzle de Luers (1880) — 15 pièces, 6 013 solutions</p>
      <div className="pieces-gallery">
        {PIECES.map((piece) => (
          <Piece key={piece.id} piece={piece} />
        ))}
      </div>
    </div>
  )
}

export default App
