import { Popover, PopoverContent } from "@opusline/ui/components/popover";
import { cn } from "@opusline/ui/lib/utils";
import { useMachine } from "@xstate/react";
import type { ComponentProps, KeyboardEvent, RefCallback } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { fromPromise } from "xstate";

import { BudgetShareBadge } from "@/components/budget-share-badge";
import { isHourly } from "@/lib/durations";
import { m } from "@/paraglide/messages.js";
import {
  focusableColumnCount,
  type LiveCell,
  locateCell,
  type WeekGridModel,
} from "../lib/week-grid";
import { isDurationKey, nextCell } from "../lib/week-keyboard";
import { type WriteRequest, weekMachine } from "../lib/week-machine";
import { ActivityPopover } from "./activity-popover";
import { WeekCell } from "./week-cell";

const COLUMN_TEMPLATES = {
  open: "grid-cols-[10rem_repeat(7,minmax(5rem,1fr))_8.5rem]",
  collapsed: "grid-cols-[10rem_repeat(5,minmax(5rem,1fr))_2.75rem_8.5rem]",
} as const;

const HEAD_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-wider-2";

const GridRow = (props: ComponentProps<"div">) => (
  // biome-ignore lint/a11y/useSemanticElements: see above — ARIA grid, not a table.
  <div role="row" tabIndex={-1} {...props} />
);

const ColumnHeader = (props: ComponentProps<"div">) => (
  // biome-ignore lint/a11y/useSemanticElements: see above — ARIA grid, not a table.
  <div role="columnheader" tabIndex={-1} {...props} />
);

const RowHeader = (props: ComponentProps<"div">) => (
  // biome-ignore lint/a11y/useSemanticElements: see above — ARIA grid, not a table.
  <div role="rowheader" tabIndex={-1} {...props} />
);

/** A total: part of the grid, but never a focus target for editing. */
const ReadOnlyCell = (props: ComponentProps<"div">) => (
  // biome-ignore lint/a11y/useSemanticElements: see above — ARIA grid, not a table.
  <div role="gridcell" tabIndex={-1} {...props} />
);

export type WeekGridProps = {
  model: WeekGridModel;
  live: LiveCell | null;
  workdayMinutes: number;
  noteSuggestions: string[];
  pendingCellKeys: ReadonlySet<string>;
  onCreate: (input: {
    cellKey: string;
    missionId: number;
    date: string;
    durationMinutes: number;
  }) => Promise<boolean>;
  onUpdate: (input: {
    cellKey: string;
    entryId: number;
    durationMinutes?: number;
    note?: string | null;
    billable?: boolean;
  }) => Promise<boolean>;
  onDelete: (input: {
    cellKey: string;
    entryIds: number[];
  }) => Promise<boolean>;
};

type WriteHandlers = Pick<WeekGridProps, "onCreate" | "onDelete" | "onUpdate">;

async function performWrite(
  handlers: WriteHandlers,
  request: WriteRequest,
): Promise<boolean> {
  if (request.kind === "create") {
    return handlers.onCreate({
      cellKey: request.cellKey,
      date: request.date,
      durationMinutes: request.durationMinutes,
      missionId: request.missionId,
    });
  }

  if (request.kind === "update") {
    return handlers.onUpdate({
      cellKey: request.cellKey,
      durationMinutes: request.durationMinutes,
      entryId: request.entryId,
    });
  }

  return handlers.onDelete({
    cellKey: request.cellKey,
    entryIds: request.entryIds,
  });
}

export function WeekGrid({
  model,
  live,
  workdayMinutes,
  noteSuggestions,
  pendingCellKeys,
  onCreate,
  onUpdate,
  onDelete,
}: WeekGridProps) {
  const editorRef = useRef<HTMLInputElement>(null);
  const cellRefs = useRef(new Map<string, HTMLElement>());

  const handlersRef = useRef<WriteHandlers>({ onCreate, onDelete, onUpdate });
  handlersRef.current = { onCreate, onDelete, onUpdate };

  const machine = useMemo(
    () =>
      weekMachine.provide({
        actors: {
          write: fromPromise<boolean, WriteRequest>(({ input }) =>
            performWrite(handlersRef.current, input),
          ),
        },
      }),
    [],
  );

  const [state, send, actorRef] = useMachine(machine, {
    input: { model, workdayMinutes },
  });
  const { context } = state;

  const isEditing = state.matches("editing");
  const isLabelling = state.matches("labelling");

  useEffect(() => {
    send({ model, type: "MODEL", workdayMinutes });
  }, [model, workdayMinutes, send]);

  /*
   * Keyed on the machine's focus request rather than on `focusedKey`: setting
   * the tab stop and moving the caret are different intentions, and opening the
   * editor must not pull focus back onto the cell behind it.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: the nonce is the signal.
  useEffect(() => {
    if (context.focusedKey !== null) {
      cellRefs.current.get(context.focusedKey)?.focus();
    }
  }, [context.focusRequest]);

  /*
   * Keyed on the editing session, not on the draft: re-running `select()` on
   * every keystroke would make the next character overwrite everything typed.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: caret is read at open time only.
  useEffect(() => {
    const input = editorRef.current;

    if (!isEditing || input === null) {
      return;
    }

    input.focus();

    if (context.caret === "select") {
      input.select();
    } else {
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, [isEditing, context.targetKey]);

  /*
   * Every handler below is stable, and recovers its cell from `data-cell` on the
   * node the event came from. Rebuilding them per cell per render detached and
   * reattached all ~70 refs on every keystroke.
   */
  const registerCell: RefCallback<HTMLDivElement> = useCallback((element) => {
    const key = element?.dataset.cell;

    if (element === null || key === undefined) {
      return;
    }

    cellRefs.current.set(key, element);

    // React 19 calls the cleanup on unmount, so a week change does not leave
    // the previous week's cells behind in the map.
    return () => {
      cellRefs.current.delete(key);
    };
  }, []);

  const handleActivate = useCallback(
    (key: string) => send({ key, type: "ACTIVATE" }),
    [send],
  );

  const handleDraftBlur = useCallback(() => send({ type: "BLUR" }), [send]);

  const handleDraftChange = useCallback(
    (draft: string) => send({ draft, type: "CHANGE" }),
    [send],
  );

  const handleCellKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    key: string,
  ) => {
    const located = locateCell(model, key);

    if (located === null) {
      return;
    }

    const ctrlKey = event.ctrlKey || event.metaKey;

    // Asked here as well as in the machine so the browser default is only
    // swallowed for keys the grid actually consumes.
    const moves =
      nextCell(
        { column: located.columnIndex, row: located.rowIndex },
        event.key,
        {
          columnCount: focusableColumnCount(model),
          ctrlKey,
          rowCount: model.rows.length,
        },
      ) !== null;

    if (moves) {
      event.preventDefault();
      send({ ctrlKey, from: key, key: event.key, type: "NAVIGATE" });

      return;
    }

    if (located.cell.date === null) {
      return;
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      send({ key, type: "LABEL" });

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      send({ key, type: "EDIT" });

      return;
    }

    if (event.key === " ") {
      event.preventDefault();
      send({ key, type: "TOGGLE_DAY" });

      return;
    }

    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      send({ key, type: "CLEAR" });

      return;
    }

    if (isDurationKey(event.key) && !ctrlKey) {
      event.preventDefault();
      send({ key, seed: event.key, type: "EDIT" });
    }
  };

  const handleDraftKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // The editor owns the keyboard while it is open — arrows move the caret,
    // Enter commits. None of that is the grid's business.
    event.stopPropagation();

    if (event.key === "Escape") {
      event.preventDefault();
      send({ type: "CANCEL" });

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      send({ move: "stay", type: "COMMIT" });

      return;
    }

    if (event.key === "Tab" && !event.shiftKey) {
      send({ move: "right", type: "COMMIT" });

      // A typo must not be thrown away by tabbing on, so the default is only
      // swallowed once the editor has actually closed.
      if (!actorRef.getSnapshot().matches("editing")) {
        event.preventDefault();
      }
    }
  };

  const template =
    model.columns.length === 7
      ? COLUMN_TEMPLATES.open
      : COLUMN_TEMPLATES.collapsed;
  // Only needed while the popover is open; the editor keeps `targetKey` set.
  const detailTarget = isLabelling
    ? locateCell(model, context.targetKey)
    : null;

  return (
    <div className="overflow-x-auto rounded-md border bg-card">
      {/* biome-ignore lint/a11y/useSemanticElements: see the note above GridRow — ARIA grid, not a table. */}
      <div
        aria-colcount={model.columns.length + 2}
        aria-rowcount={model.rows.length + 2}
        role="grid"
      >
        <GridRow aria-rowindex={1} className={cn("grid", template)}>
          <ColumnHeader
            aria-colindex={1}
            className={cn(HEAD_CLASSES, "border-b px-3.5 py-3")}
          >
            {m.week_column_mission()}
          </ColumnHeader>
          {model.columns.map((column, columnIndex) =>
            column.kind === "day" ? (
              <ColumnHeader
                aria-colindex={columnIndex + 2}
                className={cn(
                  "flex flex-col gap-1.5 border-b px-3.5 py-3",
                  column.isWeekend && "bg-muted",
                  // The tint runs the full height of today's column.
                  column.isToday && "bg-primary/5",
                )}
                key={column.date}
              >
                <span className={HEAD_CLASSES}>{column.weekdayLabel}</span>
                <span
                  className={cn(
                    "font-mono text-base tabular-nums",
                    column.isToday ? "text-primary-text" : "text-foreground-2",
                  )}
                >
                  {column.dayOfMonth}
                </span>
              </ColumnHeader>
            ) : (
              // Decorative: the toolbar's toggle is the reachable control, and
              // the weekend opens itself whenever it carries entries.
              <div
                aria-hidden
                className="flex flex-col gap-1.5 border-b bg-muted px-2 py-3"
                key="collapsed-weekend"
              >
                <span className={HEAD_CLASSES}>{m.week_weekend_short()}</span>
                <span className="font-mono text-muted-foreground-5 text-sm">
                  –
                </span>
              </div>
            ),
          )}
          <ColumnHeader
            aria-colindex={model.columns.length + 2}
            className={cn(
              HEAD_CLASSES,
              "border-b border-l px-3.5 py-3 text-right",
            )}
          >
            {m.week_column_total()}
          </ColumnHeader>
        </GridRow>

        {model.rows.map((row, rowIndex) => (
          <GridRow
            aria-rowindex={rowIndex + 2}
            className={cn("grid", template)}
            key={row.missionId}
          >
            <RowHeader
              aria-colindex={1}
              className="flex flex-col gap-0.75 border-secondary border-b p-3.5"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "h-3.5 w-0.75 shrink-0 rounded-sm",
                    row.colorClass,
                  )}
                />
                <span
                  className={cn(
                    "truncate font-medium text-sm",
                    row.hasRate ? "text-foreground-hi" : "text-foreground-4",
                  )}
                >
                  {row.name}
                </span>
              </span>
              <span className="flex min-w-0 items-center gap-2 pl-3">
                <span
                  className={cn(
                    "truncate text-xs",
                    row.hasRate
                      ? "text-muted-foreground-2"
                      : "text-muted-foreground-3",
                  )}
                >
                  {row.subtitle}
                </span>
                {row.budget === null ? null : (
                  <BudgetShareBadge budget={row.budget} />
                )}
              </span>
            </RowHeader>
            {row.cells.map((cell, columnIndex) => (
              <WeekCell
                cell={cell}
                live={
                  live !== null &&
                  live.missionId === cell.missionId &&
                  live.date === cell.date
                    ? live
                    : null
                }
                cellRef={registerCell}
                columnIndex={columnIndex}
                editor={
                  isEditing && context.targetKey === cell.key
                    ? { draft: context.draft, error: context.error }
                    : null
                }
                editorRef={editorRef}
                isActive={isLabelling && context.targetKey === cell.key}
                isFocused={context.focusedKey === cell.key}
                isPending={pendingCellKeys.has(cell.key)}
                key={cell.key}
                onActivate={handleActivate}
                onCellKeyDown={handleCellKeyDown}
                // A blur that arrives once the editor has closed lands in a
                // state with no handler for it, so it cannot commit twice.
                onDraftBlur={handleDraftBlur}
                onDraftChange={handleDraftChange}
                onDraftKeyDown={handleDraftKeyDown}
                row={row}
              />
            ))}
            <ReadOnlyCell
              aria-colindex={model.columns.length + 2}
              aria-label={m.week_row_total_label({ mission: row.name })}
              className={cn(
                "whitespace-nowrap border-secondary border-b border-l px-3 py-3.5 text-right font-mono text-sm tabular-nums",
                row.hasRate && !isHourly(row.billingMode)
                  ? "text-primary-text"
                  : "text-foreground-2",
              )}
            >
              {row.totalLabel}
            </ReadOnlyCell>
          </GridRow>
        ))}

        <GridRow
          aria-rowindex={model.rows.length + 2}
          className={cn("grid", template)}
        >
          <RowHeader
            aria-colindex={1}
            className={cn(HEAD_CLASSES, "bg-muted p-3.5")}
          >
            {m.week_day_total()}
          </RowHeader>
          {model.dayTotals.map((total, columnIndex) => {
            const column = model.columns[columnIndex];

            return column.kind === "day" ? (
              <ReadOnlyCell
                aria-colindex={columnIndex + 2}
                className="whitespace-nowrap border-card-2 border-l bg-muted p-3.5 text-center font-mono text-foreground-3 text-sm tabular-nums"
                key={column.date}
              >
                {total}
              </ReadOnlyCell>
            ) : (
              <div
                aria-hidden
                className="border-card-2 border-l bg-muted"
                key="collapsed-weekend-total"
              />
            );
          })}
          <ReadOnlyCell
            aria-colindex={model.columns.length + 2}
            aria-label={m.week_week_total_label()}
            // Not nowrap: the week total is the one figure that can outgrow its
            // track, and wrapping beats spilling over the card edge.
            className="border-l bg-muted px-3 py-3.5 text-right font-mono font-medium text-primary-text text-sm tabular-nums"
          >
            {model.weekTotal}
          </ReadOnlyCell>
        </GridRow>
      </div>

      <Popover
        onOpenChange={(open) => {
          if (!open) {
            send({ type: "CLOSE" });
          }
        }}
        open={isLabelling}
      >
        {isLabelling && detailTarget !== null && (
          <PopoverContent
            align="start"
            anchor={
              context.targetKey === null
                ? undefined
                : cellRefs.current.get(context.targetKey)
            }
            aria-label={detailTarget.cell.ariaLabel}
            className="w-70"
          >
            <ActivityPopover
              canBill={detailTarget.row.hasRate}
              cell={detailTarget.cell}
              noteSuggestions={noteSuggestions}
              onClose={() => send({ type: "CLOSE" })}
              onDeleteEntry={(entryId) =>
                onDelete({
                  cellKey: detailTarget.cell.key,
                  entryIds: [entryId],
                })
              }
              onUpdateEntry={(entryId, patch) =>
                onUpdate({ cellKey: detailTarget.cell.key, entryId, ...patch })
              }
            />
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
