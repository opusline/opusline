import type { TimeEntryData, TimeEntryInputData } from "@opusline/api-client";

import { isoWeekDates } from "@/lib/weeks";

export function planWeekRepeat(
  entries: TimeEntryData[],
  fromWeek: string,
  toWeek: string,
): TimeEntryInputData[] {
  const source = isoWeekDates(fromWeek);
  const target = isoWeekDates(toWeek);

  return entries.flatMap((entry) => {
    const dayIndex = source.indexOf(entry.date);

    if (dayIndex === -1) {
      return [];
    }

    return [
      {
        billable: entry.billable,
        date: target[dayIndex],
        durationMinutes: entry.durationMinutes,
        missionId: entry.missionId,
        note: entry.note,
        rounding: entry.rounding,
      },
    ];
  });
}
