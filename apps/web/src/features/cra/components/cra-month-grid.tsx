import { Button } from "@opusline/ui/components/button";
import { cn } from "@opusline/ui/lib/utils";
import {
  type ComponentProps,
  type KeyboardEvent,
  type RefCallback,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  type CraCell,
  type CraGridModel,
  cellKeyAt,
  cycleDayFraction,
  defaultCellKey,
  locateCell,
} from "../lib/cra-grid";
import { nextCell } from "../lib/cra-keyboard";
import {
  EYEBROW,
  FILL_WEEKDAYS,
  GRID_HINT,
  HOLIDAY_SHORT,
  LEGEND_CLOSED,
  LEGEND_IDLE,
  LEGEND_WORKED,
  RESET_DAYS,
  reportedAgainstTrackedLabel,
} from "../lib/labels";

const GridRow = (props: ComponentProps<"div">) => (
  // biome-ignore lint/a11y/useSemanticElements: an ARIA grid, not a table.
  <div role="row" tabIndex={-1} {...props} />
);

const ColumnHeader = (props: ComponentProps<"div">) => (
  // biome-ignore lint/a11y/useSemanticElements: see above.
  <div role="columnheader" tabIndex={-1} {...props} />
);

type CraMonthGridProps = {
  model: CraGridModel;
  reportedDays: number;
  trackedDays: number;
  editable: boolean;
  isDirty: boolean;
  /** Dates whose write is still in flight, so the cell can say so. */
  pendingDates?: Set<string>;
  onChange: (date: string, dayFractionBp: number) => void;
  onFillWeekdays: () => void;
  onReset: () => void;
};

export function CraMonthGrid({
  model,
  reportedDays,
  trackedDays,
  editable,
  isDirty,
  pendingDates,
  onChange,
  onFillWeekdays,
  onReset,
}: CraMonthGridProps) {
  const cellRefs = useRef(new Map<string, HTMLElement>());
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState(0);

  const tabStop = focusedKey ?? defaultCellKey(model);

  /*
   * One stable callback that recovers its cell from `data-cell`, rather than a new
   * closure per cell: rebuilding them every render detached and reattached all
   * thirty-odd refs on each keystroke.
   */
  const registerCell: RefCallback<HTMLDivElement> = useCallback((element) => {
    const key = element?.dataset.cell;

    if (element === null || key === undefined) {
      return;
    }

    cellRefs.current.set(key, element);

    return () => {
      cellRefs.current.delete(key);
    };
  }, []);

  // Keyed on the request rather than on the key itself: re-rendering after a write
  // must not drag focus back to a cell the user has already moved off.
  // biome-ignore lint/correctness/useExhaustiveDependencies: the nonce is the signal.
  useEffect(() => {
    if (focusRequest > 0 && focusedKey !== null) {
      cellRefs.current.get(focusedKey)?.focus();
    }
  }, [focusRequest]);

  const moveTo = (key: string | null) => {
    if (key === null) {
      return;
    }

    setFocusedKey(key);
    setFocusRequest((request) => request + 1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, key: string) => {
    const located = locateCell(model, key);

    if (located === null) {
      return;
    }

    const ctrlKey = event.ctrlKey || event.metaKey;
    const moved = nextCell(
      { row: located.rowIndex, column: located.columnIndex },
      event.key,
      { columnCount: 7, ctrlKey, rowCount: model.weeks.length },
    );

    if (moved !== null) {
      event.preventDefault();
      moveTo(cellKeyAt(model, moved));

      return;
    }

    if (!editable || located.cell.date === null) {
      return;
    }

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onChange(located.cell.date, cycleDayFraction(located.cell.dayFractionBp));

      return;
    }

    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      onChange(located.cell.date, 0);
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-md border bg-card p-5.5">
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-muted-foreground-3 text-sm">
          {reportedAgainstTrackedLabel(reportedDays, trackedDays)}
        </span>
        {editable && (
          <div className="flex flex-wrap gap-1.5">
            <Button onClick={onFillWeekdays} size="xl" variant="outline">
              {FILL_WEEKDAYS}
            </Button>
            {isDirty && (
              <Button onClick={onReset} size="xl" variant="ghost">
                {RESET_DAYS}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* biome-ignore lint/a11y/useSemanticElements: the WAI-ARIA grid pattern. */}
      <div
        aria-colcount={7}
        aria-label="Jours du mois"
        aria-rowcount={model.weeks.length + 1}
        className="grid grid-cols-7 gap-1.5"
        role="grid"
      >
        <GridRow
          aria-rowindex={1}
          className="col-span-7 grid grid-cols-7 gap-1.5"
        >
          {model.weekdayLabels.map((label, index) => (
            <ColumnHeader
              aria-colindex={index + 1}
              className={cn("pb-1.5 text-center", EYEBROW)}
              key={label}
            >
              {label}
            </ColumnHeader>
          ))}
        </GridRow>

        {model.weeks.map((week, rowIndex) => (
          <GridRow
            aria-rowindex={rowIndex + 2}
            className="col-span-7 grid grid-cols-7 gap-1.5"
            key={week.key}
          >
            {week.cells.map((cell, columnIndex) => (
              <DayCell
                cell={cell}
                cellRef={registerCell}
                columnIndex={columnIndex}
                editable={editable}
                isFocused={cell.key === tabStop}
                isPending={
                  cell.date !== null && (pendingDates?.has(cell.date) ?? false)
                }
                key={cell.key}
                onActivate={() => {
                  moveTo(cell.key);

                  if (editable && cell.date !== null) {
                    onChange(cell.date, cycleDayFraction(cell.dayFractionBp));
                  }
                }}
                onKeyDown={handleKeyDown}
              />
            ))}
          </GridRow>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4.5 border-secondary border-t pt-3.5 text-muted-foreground-3 text-sm">
        <Legend
          className="border border-primary/45 bg-primary/16"
          label={LEGEND_WORKED}
        />
        <Legend
          className="border border-border-3 border-dashed"
          label={LEGEND_IDLE}
        />
        <Legend className="bg-muted" label={LEGEND_CLOSED} />
        <span className="ml-auto">{GRID_HINT}</span>
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden className={cn("size-3 rounded-sm", className)} />
      {label}
    </span>
  );
}

type DayCellProps = {
  cell: CraCell;
  cellRef: RefCallback<HTMLDivElement>;
  columnIndex: number;
  editable: boolean;
  isFocused: boolean;
  isPending: boolean;
  onActivate: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>, key: string) => void;
};

function DayCell({
  cell,
  cellRef,
  columnIndex,
  editable,
  isFocused,
  isPending,
  onActivate,
  onKeyDown,
}: DayCellProps) {
  if (cell.date === null) {
    return <div aria-hidden role="presentation" />;
  }

  const isWorked = cell.dayFractionBp > 0;

  return (
    // biome-ignore lint/a11y/useSemanticElements: the grid pattern owns its own focus.
    <div
      aria-busy={isPending || undefined}
      aria-colindex={columnIndex + 1}
      aria-label={cell.ariaLabel}
      className={cn(
        "flex h-20 flex-col rounded-md px-2 py-1.5 outline-none transition-colors",
        "focus-visible:outline-2 focus-visible:outline-primary-text focus-visible:-outline-offset-2",
        editable && "cursor-pointer",
        cell.isOffDayWorked
          ? "border border-primary/50 bg-primary/25"
          : isWorked
            ? "border border-primary/40 bg-primary/14"
            : // A weekend carries no chrome at all: nothing is expected of it, so the
              // grid should not draw a box asking to be filled. A holiday falling on a
              // working day still gets one — the reader needs to see why the week is short.
              cell.isWeekend
              ? ""
              : cell.isHoliday
                ? "bg-muted"
                : "border border-border-3 border-dashed",
        isPending && "opacity-60",
      )}
      data-cell={cell.key}
      onClick={onActivate}
      onKeyDown={(event) => onKeyDown(event, cell.key)}
      ref={cellRef}
      role="gridcell"
      tabIndex={isFocused ? 0 : -1}
      title={cell.holidayName ?? undefined}
    >
      <span
        aria-hidden
        className={cn(
          "text-xs",
          cell.isWeekend || cell.isHoliday
            ? "text-muted-foreground-5"
            : "text-muted-foreground-4",
        )}
      >
        {cell.dayOfMonth}
      </span>
      {/* One slot at the foot of the cell: what was worked, or why nothing was. */}
      <span
        aria-hidden
        className={cn(
          "mt-auto pb-1 text-center",
          isWorked
            ? "font-mono text-base text-primary-text tabular-nums"
            : EYEBROW,
        )}
      >
        {isWorked ? cell.valueLabel : cell.isHoliday ? HOLIDAY_SHORT : ""}
      </span>
    </div>
  );
}
