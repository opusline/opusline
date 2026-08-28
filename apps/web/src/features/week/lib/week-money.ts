import type {
  ClientWithMissionsData,
  TimeEntryData,
} from "@opusline/api-client";

import { isFixedPrice } from "@/lib/durations";
import { findMissionById } from "@/lib/missions";

export type WeekBillableSummary = {
  /** What the week's billable time is worth, HT, in cents of the account currency. */
  amountCents: number;
  /** Entries that carry a figure — billable, on a mission with a rate. */
  valuedEntryCount: number;
  /** Entries deliberately excluded from billing. */
  nonBillableEntryCount: number;
  /**
   * Entries on a forfait mission. Real work, but a fixed-price mission bills
   * its price, not its hours, so their time is worth nothing per entry and
   * counting them in the figure would invent revenue.
   */
  fixedPriceEntryCount: number;
  /**
   * Billable entries the API put no figure on, their mission carrying no rate
   * yet. Counted rather than dropped so the detail line accounts for every entry.
   */
  unratedEntryCount: number;
};

/**
 * Classifies and sums a week of tracked time.
 *
 * Every figure is the API's own `value`: a day fraction is a float, and 1/3 of a
 * day has no float to round a rate from — see EntryRounding::billedDayFraction().
 */
export function summarizeWeekBillable(
  clients: ClientWithMissionsData[],
  timeEntries: TimeEntryData[],
): WeekBillableSummary {
  const summary: WeekBillableSummary = {
    amountCents: 0,
    valuedEntryCount: 0,
    nonBillableEntryCount: 0,
    fixedPriceEntryCount: 0,
    unratedEntryCount: 0,
  };

  for (const entry of timeEntries) {
    if (!entry.billable) {
      summary.nonBillableEntryCount += 1;
      continue;
    }

    const mission = findMissionById(clients, entry.missionId);

    // Before the rate check: a forfait mission whose price is not set yet is
    // still forfait time, not time waiting for a rate.
    if (mission !== null && isFixedPrice(mission.billingMode)) {
      summary.fixedPriceEntryCount += 1;
      continue;
    }

    if (entry.value === null) {
      summary.unratedEntryCount += 1;
      continue;
    }

    summary.amountCents += entry.value.amount;
    summary.valuedEntryCount += 1;
  }

  return summary;
}
