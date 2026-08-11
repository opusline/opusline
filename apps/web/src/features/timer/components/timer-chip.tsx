import type { TimerState } from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";
import { ChevronDown, Pause, Play, Square } from "lucide-react";

import { formatClock, isRunning } from "../lib/elapsed";
import {
  CHIP_PAUSED,
  DETAILS,
  LONG_RUN_BADGE,
  PAUSE,
  RESUME,
  RUNNING_STATE,
  STOP,
} from "../lib/labels";

export type TimerChipProps = {
  elapsedSeconds: number;
  isBusy: boolean;
  isDetailsOpen: boolean;
  isLongRun: boolean;
  missionName: string;
  onOpenDetails: () => void;
  onStop: () => void;
  onTogglePause: () => void;
  state: TimerState;
};

const CONTROL =
  "flex size-6 shrink-0 items-center justify-center rounded-sm transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text";

export function TimerChip({
  elapsedSeconds,
  isBusy,
  isDetailsOpen,
  isLongRun,
  missionName,
  onOpenDetails,
  onStop,
  onTogglePause,
  state,
}: TimerChipProps) {
  const running = isRunning(state);

  return (
    <div
      className={cn(
        "flex h-10 items-center gap-2.5 rounded-md px-3",
        running
          ? "border border-primary/55 bg-primary/15"
          : "border border-muted-foreground-6 border-dashed bg-card-2",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          running ? "animate-pulse bg-primary-text" : "bg-muted-foreground-3",
        )}
      />
      {running && <span className="sr-only">{RUNNING_STATE}</span>}
      <span
        className={cn(
          "font-mono text-sm tabular-nums",
          running ? "text-primary-text" : "text-muted-foreground",
        )}
      >
        {formatClock(elapsedSeconds)}
      </span>
      {!running && (
        <span className="whitespace-nowrap font-medium text-muted-foreground-2 text-xs uppercase tracking-[0.06em]">
          {CHIP_PAUSED}
        </span>
      )}
      {isLongRun && (
        <span className="whitespace-nowrap font-medium text-primary-text text-xs uppercase tracking-[0.06em]">
          {LONG_RUN_BADGE}
        </span>
      )}
      <span
        className={cn(
          "max-w-40 truncate text-sm",
          running ? "text-foreground-3" : "text-muted-foreground-3",
        )}
      >
        {missionName}
      </span>

      <button
        aria-label={running ? PAUSE : RESUME}
        className={cn(
          CONTROL,
          "text-foreground-2 hover:bg-primary/25 hover:text-primary-text",
        )}
        disabled={isBusy}
        onClick={onTogglePause}
        title={running ? PAUSE : RESUME}
        type="button"
      >
        {running ? (
          <Pause aria-hidden className="size-3.5" />
        ) : (
          <Play aria-hidden className="size-3 fill-current" />
        )}
      </button>
      <button
        aria-label={STOP}
        className={cn(
          CONTROL,
          "text-foreground-2 hover:bg-primary/25 hover:text-primary-text",
        )}
        disabled={isBusy}
        onClick={onStop}
        title={STOP}
        type="button"
      >
        <Square aria-hidden className="size-3 fill-current" />
      </button>
      <button
        aria-expanded={isDetailsOpen}
        aria-haspopup="dialog"
        aria-label={DETAILS}
        className={cn(
          CONTROL,
          "text-muted-foreground-2 hover:text-foreground-hi",
        )}
        onClick={onOpenDetails}
        title={DETAILS}
        type="button"
      >
        <ChevronDown aria-hidden className="size-3.5" />
      </button>
    </div>
  );
}
