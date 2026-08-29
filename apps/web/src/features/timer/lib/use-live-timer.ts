import type { TimerData } from "@opusline/api-client";
import { showTimerOptions } from "@opusline/api-client/react-query";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { displayedElapsedSeconds, isRunning } from "./elapsed";

export type TimerSnapshot = {
  timer: TimerData | null;
  isRunning: boolean;
  lastMissionId: number | null;
  /**
   * The seconds the clock reads at the given instant — for event handlers
   * that need the figure once, without subscribing the caller to the tick.
   */
  elapsedSecondsAt: (atMs: number) => number;
};

/** The timer's server state, without the 1 Hz tick — see useLiveTimer for that. */
export function useTimerSnapshot(): TimerSnapshot {
  const query = useQuery({ ...showTimerOptions(), staleTime: 0 });

  const timer = query.data?.timer ?? null;
  const dataUpdatedAt = query.dataUpdatedAt;

  return {
    elapsedSecondsAt: (atMs) =>
      timer === null ? 0 : displayedElapsedSeconds(timer, dataUpdatedAt, atMs),
    isRunning: timer !== null && isRunning(timer.state),
    lastMissionId: query.data?.lastMissionId ?? null,
    timer,
  };
}

export type LiveTimer = {
  elapsedSeconds: number;
  isRunning: boolean;
  now: number;
  timer: TimerData | null;
};

/**
 * The ticking variant: re-renders its caller every second while a timer runs.
 * Reserved for the components that actually paint the moving clock.
 */
export function useLiveTimer(): LiveTimer {
  const snapshot = useTimerSnapshot();

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!snapshot.isRunning) {
      return;
    }

    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(id);
  }, [snapshot.isRunning]);

  return {
    elapsedSeconds: snapshot.elapsedSecondsAt(now),
    isRunning: snapshot.isRunning,
    now,
    timer: snapshot.timer,
  };
}
