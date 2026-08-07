import type { TimeEntryData, TimeEntryInputData } from "@opusline/api-client";

import { isoWeekDates } from "@/lib/weeks";

/**
 * Carries a week's entries onto the same weekdays of another week. Everything
 * about an entry travels except its date — including whether it was billable,
 * which is part of what made the original week worth repeating.
 *
 * Entries whose date falls outside the source week are skipped rather than
 * guessed at, so the caller can tell "nothing to copy" from "copied nothing".
 */
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
      },
    ];
  });
}
