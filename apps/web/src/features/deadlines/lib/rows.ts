import type { DeadlineItemData } from "@opusline/api-client";

import { daysUntilDue, isItemDone } from "@/lib/deadlines";

export type DeadlineRowTone = "late" | "action" | "quiet" | "done";

/**
 * How loud a timeline line is. The design's rule: red is for what is already
 * late, amber for what calls on the user now — a relance to send, a
 * declaration inside the week — grey for the future, green for the settled.
 */
export function deadlineRowTone(
  item: DeadlineItemData,
  today: string,
): DeadlineRowTone {
  if (isItemDone(item)) {
    return "done";
  }

  const days = daysUntilDue(item.dueOn, today);

  if (item.type === 1) {
    return "action";
  }

  if (days < 0) {
    return "late";
  }

  if (item.fiscal !== null && days <= 7) {
    return "action";
  }

  return "quiet";
}
