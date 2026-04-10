import { rotateCells, getRotatedCellColor } from '../data/pieces';

const CELL_SIZE = 48;

export default function Piece({ piece }) {
  const { id, label, cells, phase, rotation = 0 } = piece;

  const displayCells = rotateCells(cells, rotation);

  const maxRow = Math.max(...displayCells.map(([r]) => r));
  const maxCol = Math.max(...displayCells.map(([, c]) => c));
  const rows = maxRow + 1;
  const cols = maxCol + 1;

  const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
  displayCells.forEach(([r, c]) => {
    grid[r][c] = true;
  });

  // La case d'affichage du label suit la rotation
  const labelDisplayCell = label != null
    ? rotateCells(cells, rotation)[label.valueCellIndexDisplay]
    : null;

  return (
    <div className="piece-container">
      <div className="piece-label">#{id}</div>
      <div
        className="piece-grid"
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
          gap: 0,
        }}
      >
        {grid.flatMap((row, r) =>
          row.map((occupied, c) => {
            if (!occupied) {
              return (
                <div
                  key={`${r}-${c}`}
                  className="piece-cell empty"
                  style={{ gridRow: r + 1, gridColumn: c + 1 }}
                />
              );
            }
            const color = getRotatedCellColor(r, c, rotation, cells, phase);
            const hasTop = r > 0 && grid[r - 1]?.[c];
            const hasBottom = r < rows - 1 && grid[r + 1]?.[c];
            const hasLeft = c > 0 && grid[r][c - 1];
            const hasRight = c < cols - 1 && grid[r][c + 1];

            return (
              <div
                key={`${r}-${c}`}
                className={`piece-cell ${color === 'R' ? 'red' : 'yellow'}`}
                style={{
                  gridRow: r + 1,
                  gridColumn: c + 1,
                  borderTop: hasTop ? 'none' : undefined,
                  borderBottom: hasBottom ? 'none' : undefined,
                  borderLeft: hasLeft ? 'none' : undefined,
                  borderRight: hasRight ? 'none' : undefined,
                }}
              />
            );
          })
        )}
        {labelDisplayCell && (
          <div
            className="piece-number"
            style={{
              position: 'absolute',
              top: (labelDisplayCell[0] + 0.5) * CELL_SIZE,
              left: (labelDisplayCell[1] + 0.5) * CELL_SIZE,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {label.value}
          </div>
        )}
      </div>
      <div className="piece-info">{cells.length} cases</div>
    </div>
  );
}
