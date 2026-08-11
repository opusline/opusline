import type { TimerData } from "@opusline/api-client";
import { showTimerOptions } from "@opusline/api-client/react-query";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { displayedElapsedSeconds, isRunning } from "./elapsed";

export type LiveTimer = {
  elapsedSeconds: number;
  isRunning: boolean;
  lastMissionId: number | null;
  now: number;
  timer: TimerData | null;
};

export function useLiveTimer(): LiveTimer {
  const query = useQuery({ ...showTimerOptions(), staleTime: 0 });

  const timer = query.data?.timer ?? null;
  const running = timer !== null && isRunning(timer.state);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!running) {
      return;
    }

    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(id);
  }, [running]);

  return {
    elapsedSeconds:
      timer === null
        ? 0
        : displayedElapsedSeconds(timer, query.dataUpdatedAt, now),
    isRunning: running,
    lastMissionId: query.data?.lastMissionId ?? null,
    now,
    timer,
  };
}
