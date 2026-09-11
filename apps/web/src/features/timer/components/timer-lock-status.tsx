import { formatClock, useTimerClock } from "@/lib/timer-clock";
import { m } from "@/paraglide/messages.js";
import { isRunning } from "../lib/elapsed";
import { useTimer } from "./timer-provider";

/**
 * What the lock screen puts in its status slot: the one thing the app can
 * honestly say is still happening behind the overlay.
 */
export function TimerLockStatus() {
  const { timer } = useTimer();
  const { elapsedSeconds } = useTimerClock();

  if (timer === null || !isRunning(timer.state)) {
    return null;
  }

  return (
    <div className="mt-4 rounded-md border bg-card px-4 py-3">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="size-1.5 shrink-0 animate-pulse rounded-full bg-primary-text"
        />
        <span className="font-medium text-foreground-3 text-sm">
          {m.session_lock_running_timer()}
        </span>
        <span className="flex-1" />
        <span className="font-mono text-primary-text text-sm tabular-nums">
          {formatClock(elapsedSeconds)}
        </span>
      </div>
      <p className="mt-1.5 truncate text-muted-foreground-3 text-sm">
        {timer.missionName}
      </p>
      <p className="mt-2 text-muted-foreground-4 text-xs leading-relaxed">
        {m.session_lock_timer_note()}
      </p>
    </div>
  );
}
