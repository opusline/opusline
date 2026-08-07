import { Input } from "@opusline/ui/components/input";
import { cn } from "@opusline/ui/lib/utils";
import { PlusIcon } from "lucide-react";
import type { KeyboardEvent, RefCallback, RefObject } from "react";

import { isHourly } from "@/lib/durations";

import { PILL_SKINS, type PillSkin } from "../lib/pill-skins";
import type { WeekCell as WeekCellModel, WeekRow } from "../lib/week-grid";

export type CellEditor = { draft: string; error: string | null };

type WeekCellProps = {
  row: WeekRow;
  cell: WeekCellModel;
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
  if (!cell.isInvoiced) {
    return "nonBillable";
  }

  return isHourly(row.billingMode) ? "hourly" : "billedDay";
}

export function WeekCell({
  row,
  cell,
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
      aria-label={cell.ariaLabel}
      className={cn(
        "group relative border-secondary border-b border-l border-card-2 p-2.5 outline-none focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary-text",
        cell.isWeekend && "bg-muted",
        cell.isToday && "bg-primary/5",
        editor === null && "cursor-pointer",
        cell.entries.length === 0 &&
          editor === null &&
          "text-transparent hover:bg-accent hover:text-muted-foreground-2",
        // Focus has moved into the popover, so the cell says so itself.
        isActive && "outline-2 -outline-offset-2 outline-primary-text",
        isPending && "opacity-60",
      )}
      data-cell={cell.key}
      onClick={editor === null ? () => onActivate(cell.key) : undefined}
      onKeyDown={(event) => onCellKeyDown(event, cell.key)}
      ref={cellRef}
      role="gridcell"
      tabIndex={isFocused ? 0 : -1}
    >
      {editor === null ? (
        cell.entries.length === 0 ? (
          <span className="flex h-full min-h-11 items-center justify-center gap-1.5 text-xs">
            <PlusIcon aria-hidden className="size-3" strokeWidth={2.2} />
            Ajouter
          </span>
        ) : (
          <div
            className={cn(
              "min-h-11 rounded-sm border px-2.5 py-2 transition-colors",
              PILL_SKINS[skin].pill,
            )}
          >
            <div className="whitespace-nowrap font-mono text-sm tabular-nums">
              {cell.billedLabel}
            </div>
            <div
              className={cn("mt-0.5 truncate text-xs", PILL_SKINS[skin].note)}
            >
              {cell.entries.length > 1
                ? `${cell.entries.length} entrées`
                : (cell.note ?? "Sans activité")}
            </div>
          </div>
        )
      ) : (
        <>
          <Input
            aria-describedby={editor.error === null ? undefined : errorId}
            aria-invalid={editor.error !== null || undefined}
            aria-label={`Durée — ${cell.ariaLabel}`}
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
