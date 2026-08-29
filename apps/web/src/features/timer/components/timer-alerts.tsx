import { createContext, use } from "react";

import type { IdleNotice } from "../lib/idle";

/**
 * The tick-derived notices, split from the plain clock in @/lib/timer-clock:
 * they depend on timer-feature state (idle spans, the kept-long-run flag), so
 * they stay inside the feature, while the bare clock is shared with the week
 * grid's live pill.
 */
export type TimerAlerts = {
  /** The inactivity notice, recomputed each tick while a timer exists. */
  idle: IdleNotice | null;
  /** Set while the run has outgrown a workday and has not been kept. */
  longRunHours: string | null;
};

export const QUIET_TIMER_ALERTS: TimerAlerts = {
  idle: null,
  longRunHours: null,
};

/** Defaulted for the same reason as TimerClockContext — see @/lib/timer-clock. */
export const TimerAlertsContext =
  createContext<TimerAlerts>(QUIET_TIMER_ALERTS);

export function useTimerAlerts(): TimerAlerts {
  return use(TimerAlertsContext);
}
