import { getCellColor } from '../data/pieces';

const CELL_SIZE = 48;

export default function Piece({ piece }) {
  const { id, label, cells, phase } = piece;

  const maxRow = Math.max(...cells.map(([r]) => r));
  const maxCol = Math.max(...cells.map(([, c]) => c));
  const rows = maxRow + 1;
  const cols = maxCol + 1;

  const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
  cells.forEach(([r, c]) => {
    grid[r][c] = true;
  });

  // Case sur laquelle afficher le label
  const labelCell = label != null ? cells[label.cellIndex] : null;

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
            const color = getCellColor(r, c, phase);
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
        {labelCell && (
          <div
            className="piece-number"
            style={{
              position: 'absolute',
              top: (labelCell[0] + 0.5) * CELL_SIZE,
              left: (labelCell[1] + 0.5) * CELL_SIZE,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {label.text}
          </div>
        )}
      </div>
      <div className="piece-info">{cells.length} cases</div>
    </div>
  );
}
