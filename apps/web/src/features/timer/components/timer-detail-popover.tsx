import type { TimerState } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { Input } from "@opusline/ui/components/input";
import { Clock, TriangleAlert } from "lucide-react";
import { useEffect, useRef } from "react";

import { useLocale } from "@/components/money-format-provider";
import { m } from "@/paraglide/messages.js";
import { formatClock, formatStartedAt, isRunning } from "../lib/elapsed";
import type { IdleNotice } from "../lib/idle";

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
  const locale = useLocale();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isConfirmingDiscard) {
      confirmRef.current?.focus();
    }
  }, [isConfirmingDiscard]);

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="font-medium text-muted-foreground-3 text-xs uppercase tracking-wider-2">
          {running ? m.timer_running_state() : m.timer_paused_state()}
        </span>
        <span className="font-mono text-muted-foreground-3 text-xs tabular-nums">
          {m.timer_started_at({ clock: formatStartedAt(locale, startedAt) })}
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
              {m.timer_long_run_message({ hours: longRunHours })}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <Button disabled={isBusy} onClick={onStop} variant="secondary">
                {m.timer_long_run_stop()}
              </Button>
              <Button onClick={onKeepLongRun} variant="outline">
                {m.timer_long_run_keep()}
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
              {m.timer_idle_detected({ minutes: idle.idleMinutes })}
            </p>
            <div className="mt-2.5 flex gap-2">
              <Button
                disabled={isBusy}
                onClick={onTrimIdle}
                variant="secondary"
              >
                {m.timer_trim_idle({ minutes: idle.idleMinutes })}
              </Button>
              <Button onClick={onDismissIdle} variant="ghost">
                {m.timer_keep_idle()}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Input
        aria-label={m.timer_note_label()}
        onChange={(event) => onChangeNote(event.target.value)}
        placeholder={m.timer_note_placeholder()}
        value={note}
      />

      {error !== null && (
        <p className="mt-2 text-destructive text-xs" role="alert">
          {error}
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <Button className="flex-1" disabled={isBusy} onClick={onStop} size="xl">
          {m.timer_stop_and_save()}
        </Button>
        <Button
          aria-label={running ? m.timer_pause() : m.timer_resume()}
          disabled={isBusy}
          onClick={onTogglePause}
          size="xl"
          variant="outline"
        >
          {running ? m.timer_pause_short() : m.timer_resume()}
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
              {m.timer_discard_confirm()}
            </Button>
            <Button onClick={onCancelDiscard} variant="ghost">
              {m.common_cancel()}
            </Button>
          </>
        ) : (
          <Button
            className="w-full"
            disabled={isBusy}
            onClick={onDiscard}
            variant="ghost"
          >
            {m.timer_discard()}
          </Button>
        )}
      </div>
    </div>
  );
}
