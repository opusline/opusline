import { m } from "@/paraglide/messages.js";

export function durationClamped(droppedMinutes: number): string {
  return m.timer_duration_clamped({ minutes: droppedMinutes });
}

export function missionRoundingHint(roundingLabel: string): string {
  return m.timer_mission_rounding_hint({ rounding: roundingLabel });
}

export function roundingDeviation(roundingLabel: string): string {
  return m.timer_rounding_deviation({ rounding: roundingLabel });
}

export function startedAtLabel(clock: string): string {
  return m.timer_started_at({ clock });
}

export function longRunMessage(hours: string): string {
  return m.timer_long_run_message({ hours });
}

export function measuredDuration(duration: string): string {
  return m.timer_measured_duration({ duration });
}

export function idleDetected(minutes: number): string {
  return m.timer_idle_detected({ minutes });
}

export function trimIdle(minutes: number): string {
  return m.timer_trim_idle({ minutes });
}

export function stopSummary(
  clock: string,
  missionName: string,
  dateLabel: string,
  billable: boolean,
): string {
  const parts = [
    m.timer_stop_summary_part({ clock, missionName }),
    dateLabel.toLowerCase(),
  ];

  if (!billable) {
    parts.push(m.timer_not_billable_value());
  }

  return parts.join(" · ");
}
