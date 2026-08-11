import type { TimerState } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { Input } from "@opusline/ui/components/input";
import { Clock, TriangleAlert } from "lucide-react";
import { useEffect, useRef } from "react";

import { formatClock, formatStartedAt, isRunning } from "../lib/elapsed";
import type { IdleNotice } from "../lib/idle";
import {
  CANCEL,
  DISCARD,
  DISCARD_CONFIRM,
  idleDetected,
  KEEP_IDLE,
  LONG_RUN_KEEP,
  LONG_RUN_STOP,
  longRunMessage,
  NOTE_LABEL,
  NOTE_PLACEHOLDER,
  PAUSE,
  PAUSE_SHORT,
  PAUSED_STATE,
  RESUME,
  RUNNING_STATE,
  STOP_AND_SAVE,
  startedAtLabel,
  trimIdle,
} from "../lib/labels";

export type TimerDetailPopoverProps = {
  elapsedSeconds: number;
  error: string | null;
  idle: IdleNotice | null;
  longRunHours: string | null;
  isBusy: boolean;
  isConfirmingDiscard: boolean;
  missionName: string;
  missionSubtitle: string;
  note: string;
  onCancelDiscard: () => void;
  onChangeNote: (note: string) => void;
  onConfirmDiscard: () => void;
  onDiscard: () => void;
  onDismissIdle: () => void;
  onKeepLongRun: () => void;
  onStop: () => void;
  onTogglePause: () => void;
  onTrimIdle: () => void;
  startedAt: string;
  state: TimerState;
};

export function TimerDetailPopover({
  elapsedSeconds,
  error,
  idle,
  isBusy,
  longRunHours,
  isConfirmingDiscard,
  missionName,
  missionSubtitle,
  note,
  onCancelDiscard,
  onChangeNote,
  onConfirmDiscard,
  onDiscard,
  onDismissIdle,
  onKeepLongRun,
  onStop,
  onTogglePause,
  onTrimIdle,
  startedAt,
  state,
}: TimerDetailPopoverProps) {
  const running = isRunning(state);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isConfirmingDiscard) {
      confirmRef.current?.focus();
    }
  }, [isConfirmingDiscard]);

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="font-medium text-muted-foreground-3 text-xs uppercase tracking-[0.09em]">
          {running ? RUNNING_STATE : PAUSED_STATE}
        </span>
        <span className="font-mono text-muted-foreground-3 text-xs tabular-nums">
          {startedAtLabel(formatStartedAt(startedAt))}
        </span>
      </div>

      <p className="mb-1 whitespace-nowrap font-mono text-4xl text-primary-text leading-none tracking-[-0.01em] tabular-nums">
        {formatClock(elapsedSeconds)}
      </p>
      <p className="mb-3.5 text-foreground-3 text-sm">
        {missionName}{" "}
        <span className="text-muted-foreground-2">· {missionSubtitle}</span>
      </p>

      {longRunHours !== null && (
        <div className="mb-3.5 flex gap-2.5 rounded-md border border-primary/45 bg-primary/8 p-3">
          <TriangleAlert
            aria-hidden
            className="mt-0.5 size-3.5 shrink-0 text-primary-text"
          />
          <div className="min-w-0">
            <p className="text-foreground-2 text-sm leading-relaxed">
              {longRunMessage(longRunHours)}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <Button disabled={isBusy} onClick={onStop} variant="secondary">
                {LONG_RUN_STOP}
              </Button>
              <Button onClick={onKeepLongRun} variant="outline">
                {LONG_RUN_KEEP}
              </Button>
            </div>
          </div>
        </div>
      )}

      {idle !== null && (
        <div className="mb-3.5 flex gap-2.5 rounded-md border border-border-2 bg-muted p-3">
          <Clock
            aria-hidden
            className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
          />
          <div className="min-w-0">
            <p className="text-foreground-2 text-sm leading-relaxed">
              {idleDetected(idle.idleMinutes)}
            </p>
            <div className="mt-2.5 flex gap-2">
              <Button
                disabled={isBusy}
                onClick={onTrimIdle}
                variant="secondary"
              >
                {trimIdle(idle.idleMinutes)}
              </Button>
              <Button onClick={onDismissIdle} variant="ghost">
                {KEEP_IDLE}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Input
        aria-label={NOTE_LABEL}
        onChange={(event) => onChangeNote(event.target.value)}
        placeholder={NOTE_PLACEHOLDER}
        value={note}
      />

      {error !== null && (
        <p className="mt-2 text-destructive text-xs" role="alert">
          {error}
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <Button className="flex-1" disabled={isBusy} onClick={onStop} size="xl">
          {STOP_AND_SAVE}
        </Button>
        <Button
          aria-label={running ? PAUSE : RESUME}
          disabled={isBusy}
          onClick={onTogglePause}
          size="xl"
          variant="outline"
        >
          {running ? PAUSE_SHORT : RESUME}
        </Button>
      </div>

      <div className="mt-2 flex items-center justify-center gap-2">
        {isConfirmingDiscard ? (
          <>
            <Button
              disabled={isBusy}
              onClick={onConfirmDiscard}
              ref={confirmRef}
              variant="destructive"
            >
              {DISCARD_CONFIRM}
            </Button>
            <Button onClick={onCancelDiscard} variant="ghost">
              {CANCEL}
            </Button>
          </>
        ) : (
          <Button
            className="w-full"
            disabled={isBusy}
            onClick={onDiscard}
            variant="ghost"
          >
            {DISCARD}
          </Button>
        )}
      </div>
    </div>
  );
}
