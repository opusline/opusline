import type {
  ClientWithMissionsData,
  TimeEntryData,
} from "@opusline/api-client";

const MINUTES_PER_HOUR = 60;

type Mission = ClientWithMissionsData["missions"][number];

/**
 * Local rather than shared with the timer's identical lookup: features must not
 * import each other, and one small loop is cheaper than promoting a helper into
 * `lib/` for a second caller.
 */
function findMission(
  clients: ClientWithMissionsData[],
  missionId: number,
): Mission | null {
  for (const client of clients) {
    const mission = client.missions.find(
      (candidate) => candidate.id === missionId,
    );

    if (mission !== undefined) {
      return mission;
    }
  }

  return null;
}

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
  };

  for (const entry of timeEntries) {
    if (!entry.billable) {
      summary.nonBillableEntryCount += 1;
      continue;
    }

    const mission = findMission(clients, entry.missionId);

    if (mission === null || mission.rate === null) {
      continue;
    }

    if (mission.billingMode === 2) {
      summary.fixedPriceEntryCount += 1;
      continue;
    }

    const value =
      mission.billingMode === 1
        ? ((entry.valuedMinutes ?? 0) / MINUTES_PER_HOUR) * mission.rate.amount
        : (entry.valuedDayFraction ?? 0) * mission.rate.amount;

    if (value === 0) {
      continue;
    }

    summary.amountCents += Math.round(value);
    summary.valuedEntryCount += 1;
  }

  return summary;
}
