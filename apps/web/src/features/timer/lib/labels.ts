import { m } from "@/paraglide/messages.js";

export function stopSummary(
  clock: string,
  missionName: string,
  dateLabel: string,
  billable: boolean,
): string {
  const parts = [m.timer_stop_summary_part({ clock, missionName }), dateLabel];

  if (!billable) {
    parts.push(m.timer_not_billable_value());
  }

  return parts.join(" · ");
}
