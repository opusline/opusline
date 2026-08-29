import { Input } from "@opusline/ui/components/input";
import { cn } from "@opusline/ui/lib/utils";
import { PlusIcon } from "lucide-react";
import type { KeyboardEvent, RefCallback, RefObject } from "react";

import { isHourly, provisionalBilledLabel } from "@/lib/durations";
import { formatClock, useTimerClock } from "@/lib/timer-clock";
import { m } from "@/paraglide/messages.js";

import { liveCellLabel, liveStateLabel } from "../lib/labels";
import { PILL_SKINS, type PillSkin, UNINVOICED_RING } from "../lib/pill-skins";
import type {
  LiveCell,
  WeekCell as WeekCellModel,
  WeekRow,
} from "../lib/week-grid";

export type CellEditor = { draft: string; error: string | null };

type WeekCellProps = {
  row: WeekRow;
  cell: WeekCellModel;
  live: LiveCell | null;
  columnIndex: number;
  isFocused: boolean;
  isActive: boolean;
  isPending: boolean;
  editor: CellEditor | null;
  editorRef: RefObject<HTMLInputElement | null>;
  cellRef: RefCallback<HTMLDivElement>;
  onActivate: (key: string) => void;
  onCellKeyDown: (event: KeyboardEvent<HTMLDivElement>, key: string) => void;
  onDraftChange: (draft: string) => void;
  onDraftKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onDraftBlur: () => void;
};

function skinOf(row: WeekRow, cell: WeekCellModel): PillSkin {
  if (!cell.isBillable) {
    return "nonBillable";
  }

  return isHourly(row.billingMode) ? "hourly" : "billedDay";
}

function LivePill({ live }: { live: LiveCell }) {
  // The only tick subscriber in the grid: the moving labels are derived here,
  // so each second repaints this pill and nothing else.
  const { elapsedSeconds } = useTimerClock();

  const billedLabel = provisionalBilledLabel(
    live.locale,
    Math.round(elapsedSeconds / 60),
    { billingMode: live.billingMode, workdayMinutes: live.workdayMinutes },
    live.rounding,
  );

  return (
    <button
      aria-label={m.week_stop_tracking()}
      className={cn(
        "min-h-11 w-full rounded-sm border px-2.5 py-2 text-left transition-colors hover:bg-primary/20",
        PILL_SKINS.live.pill,
      )}
      onClick={(event) => {
        event.stopPropagation();
        live.onStop();
      }}
      tabIndex={-1}
      title={m.week_stop_tracking()}
      type="button"
    >
      <div className="flex items-center gap-1.5">
        <span
          aria-hidden
          className={cn(
            "size-1.5 shrink-0 rounded-full bg-primary-text-strong",
            live.isRunning && "animate-pulse",
          )}
        />
        <span className="whitespace-nowrap font-mono text-sm tabular-nums">
          {billedLabel}
        </span>
      </div>
      <div className={cn("mt-0.5 truncate text-xs", PILL_SKINS.live.note)}>
        {liveCellLabel(live.isRunning, formatClock(elapsedSeconds))}
      </div>
    </button>
  );
}

export function WeekCell({
  row,
  cell,
  live,
  columnIndex,
  isFocused,
  isActive,
  isPending,
  editor,
  editorRef,
  cellRef,
  onActivate,
  onCellKeyDown,
  onDraftChange,
  onDraftKeyDown,
  onDraftBlur,
}: WeekCellProps) {
  if (cell.date === null) {
    return (
      <div
        aria-hidden
        className="border-secondary border-b border-l border-card-2 bg-muted"
        role="presentation"
      />
    );
  }

  const errorId = `${cell.key}-error`;
  const skin = skinOf(row, cell);

  return (
    // biome-ignore lint/a11y/useSemanticElements: the WAI-ARIA grid pattern owns its own roving focus, which a button would fight.
    <div
      aria-busy={isPending || undefined}
      aria-colindex={columnIndex + 2}
      // Running/paused only, no ticking clock: a label that changed every
      // second would chatter at screen readers, and the moving figure is
      // already inside the pill.
      aria-label={
        live === null
          ? cell.ariaLabel
          : `${cell.ariaLabel} — ${liveStateLabel(live.isRunning)}`
      }
      className={cn(
        "group relative border-secondary border-b border-l border-card-2 p-2.5 outline-none focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary-text",
        cell.isWeekend && "bg-muted",
        cell.isToday && "bg-primary/5",
        live !== null && "bg-primary/3",
        editor === null && "cursor-pointer",
        cell.entries.length === 0 &&
          live === null &&
          editor === null &&
          "text-transparent hover:bg-accent hover:text-muted-foreground-2",
        // Focus has moved into the popover, so the cell says so itself.
        isActive && "outline-2 -outline-offset-2 outline-primary-text",
        // A tint rather than opacity, which would drag the note's contrast
        // under AA; aria-busy above carries the state.
        isPending && "bg-muted-2",
      )}
      data-cell={cell.key}
      onClick={editor === null ? () => onActivate(cell.key) : undefined}
      onKeyDown={(event) => onCellKeyDown(event, cell.key)}
      ref={cellRef}
      role="gridcell"
      tabIndex={isFocused ? 0 : -1}
    >
      {editor === null ? (
        <div className="flex flex-col gap-1.5">
          {cell.entries.length === 0 ? (
            <span
              className={cn(
                "flex h-full items-center justify-center gap-1.5 text-xs",
                live === null ? "min-h-11" : "min-h-6 text-muted-foreground-2",
              )}
            >
              <PlusIcon aria-hidden className="size-3" strokeWidth={2.2} />
              {m.week_cell_add()}
            </span>
          ) : (
            <div
              className={cn(
                "relative min-h-11 rounded-sm border px-2.5 py-2 transition-colors",
                PILL_SKINS[skin].pill,
              )}
            >
              {cell.hasUninvoicedTime && (
                <span
                  aria-hidden
                  className={cn("absolute top-1 right-1", UNINVOICED_RING)}
                  title={m.week_uninvoiced_marker()}
                />
              )}
              <div className="whitespace-nowrap font-mono text-sm tabular-nums">
                {cell.billedLabel}
              </div>
              <div
                className={cn("mt-0.5 truncate text-xs", PILL_SKINS[skin].note)}
              >
                {cell.entries.length > 1
                  ? m.week_entries_count({ count: cell.entries.length })
                  : (cell.note ?? m.week_no_activity())}
              </div>
            </div>
          )}
          {live !== null && <LivePill live={live} />}
        </div>
      ) : (
        <>
          <Input
            aria-describedby={editor.error === null ? undefined : errorId}
            aria-invalid={editor.error !== null || undefined}
            aria-label={m.week_duration_cell_label({ cell: cell.ariaLabel })}
            font="mono"
            onBlur={onDraftBlur}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={onDraftKeyDown}
            placeholder="1 · 0,5 · 2h"
            ref={editorRef}
            size="lg"
            value={editor.draft}
          />
          {editor.error !== null && (
            <p
              className="mt-1 text-destructive text-xs"
              id={errorId}
              role="alert"
            >
              {editor.error}
            </p>
          )}
        </>
      )}
    </div>
  );
}
