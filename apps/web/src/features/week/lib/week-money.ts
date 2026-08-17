import type {
  BillingMode,
  ClientWithMissionsData,
  TimeEntryData,
} from "@opusline/api-client";

import { isHourly } from "@/lib/durations";
import { findMissionById } from "@/lib/missions";

const MINUTES_PER_HOUR = 60;

const FIXED_PRICE: BillingMode = 2;

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
   * Billable entries the week cannot value: their mission carries no rate yet,
   * or is missing from the loaded clients. Counted rather than dropped so the
   * detail line accounts for every entry of the week.
   */
  unratedEntryCount: number;
};

/**
 * Values a week of tracked time against the rate of the mission each entry sits
 * on. Reads the API's already-rounded `valued*` quantities rather than the raw
 * duration, so the tile agrees with the figures in the grid cells above it.
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
    if (mission?.billingMode === FIXED_PRICE) {
      summary.fixedPriceEntryCount += 1;
      continue;
    }

    if (mission === null || mission.rate === null) {
      summary.unratedEntryCount += 1;
      continue;
    }

    const value = isHourly(mission.billingMode)
      ? ((entry.valuedMinutes ?? 0) / MINUTES_PER_HOUR) * mission.rate.amount
      : (entry.valuedDayFraction ?? 0) * mission.rate.amount;

    summary.amountCents += Math.round(value);
    summary.valuedEntryCount += 1;
  }

  return summary;
}
