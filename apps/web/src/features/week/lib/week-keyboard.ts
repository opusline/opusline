export type CellPosition = { row: number; column: number };

type GridShape = { rowCount: number; columnCount: number };

const ROWS_PER_PAGE = 5;

function clamp(value: number, max: number): number {
  return Math.min(Math.max(value, 0), max);
}

/**
 * Where a key moves the grid's single tab stop. Returns null when the key is
 * none of the grid's business, so the caller knows not to swallow it.
 */
export function nextCell(
  current: CellPosition,
  key: string,
  options: GridShape & { ctrlKey: boolean },
): CellPosition | null {
  const lastRow = options.rowCount - 1;
  const lastColumn = options.columnCount - 1;

  switch (key) {
    case "ArrowLeft":
      return { ...current, column: clamp(current.column - 1, lastColumn) };
    case "ArrowRight":
      return { ...current, column: clamp(current.column + 1, lastColumn) };
    case "ArrowUp":
      return { ...current, row: clamp(current.row - 1, lastRow) };
    case "ArrowDown":
      return { ...current, row: clamp(current.row + 1, lastRow) };
    case "Home":
      return options.ctrlKey
        ? { row: 0, column: 0 }
        : { ...current, column: 0 };
    case "End":
      return options.ctrlKey
        ? { row: lastRow, column: lastColumn }
        : { ...current, column: lastColumn };
    case "PageUp":
      return { ...current, row: clamp(current.row - ROWS_PER_PAGE, lastRow) };
    case "PageDown":
      return { ...current, row: clamp(current.row + ROWS_PER_PAGE, lastRow) };
    default:
      return null;
  }
}

/** A bare digit or decimal separator opens the editor seeded with it. */
export function isDurationKey(key: string): boolean {
  return /^[0-9,.]$/.test(key);
}
