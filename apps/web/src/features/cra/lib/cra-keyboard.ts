export type CellPosition = { row: number; column: number };

type GridShape = { rowCount: number; columnCount: number };

/**
 * Where a key moves the calendar's single tab stop. Returns null when the key is none
 * of the grid's business, so the caller knows not to swallow it.
 *
 * Unlike the week grid, which clamps at the edges, this one wraps: the rows are
 * consecutive weeks, so the cell after Sunday really is the following Monday and
 * stopping there would read as broken.
 */
export function nextCell(
  current: CellPosition,
  key: string,
  options: GridShape & { ctrlKey: boolean },
): CellPosition | null {
  const lastRow = options.rowCount - 1;
  const lastColumn = options.columnCount - 1;
  const index = current.row * options.columnCount + current.column;
  const lastIndex = options.rowCount * options.columnCount - 1;

  switch (key) {
    case "ArrowLeft":
      return positionAt(Math.max(index - 1, 0), options.columnCount);
    case "ArrowRight":
      return positionAt(Math.min(index + 1, lastIndex), options.columnCount);
    case "ArrowUp":
      return { ...current, row: Math.max(current.row - 1, 0) };
    case "ArrowDown":
      return { ...current, row: Math.min(current.row + 1, lastRow) };
    case "Home":
      return options.ctrlKey
        ? { row: 0, column: 0 }
        : { ...current, column: 0 };
    case "End":
      return options.ctrlKey
        ? { row: lastRow, column: lastColumn }
        : { ...current, column: lastColumn };
    case "PageUp":
      return { ...current, row: 0 };
    case "PageDown":
      return { ...current, row: lastRow };
    default:
      return null;
  }
}

function positionAt(index: number, columnCount: number): CellPosition {
  return {
    row: Math.floor(index / columnCount),
    column: index % columnCount,
  };
}
