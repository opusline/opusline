import type {
  ClientRevenueData,
  ClientRevenueListData,
  MissionRevenueData,
  MoneyData,
} from "@opusline/api-client";

import { formatWholeAmount, type MoneyFormat } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

/** What every revenue cell shows before the figures land, or when there are none. */
export const REVENUE_PLACEHOLDER = "—";

/**
 * The listing renders one row per client and one per mission, each needing its
 * own figures — indexing once beats scanning the payload per row.
 */
export function indexClientRevenue(
  revenue: ClientRevenueListData | undefined,
): Map<number, ClientRevenueData> {
  return new Map(
    revenue?.clients.map((client) => [client.clientId, client]) ?? [],
  );
}

/** Mission ids are unique account-wide, so one flat index covers every client. */
export function indexMissionRevenue(
  clients: ClientRevenueData[] | undefined,
): Map<number, MissionRevenueData> {
  return new Map(
    clients?.flatMap((client) =>
      client.missions.map((mission) => [mission.missionId, mission] as const),
    ) ?? [],
  );
}

/**
 * The authoritative year is cut in the account timezone and arrives with the
 * figures, so the label carries no year until they land.
 */
export function revenueYearLabel(year: number | undefined): string {
  return year === undefined
    ? m.clients_head_revenue_short()
    : m.clients_head_revenue({ year });
}

/**
 * Money for a table cell or a stat tile: whole units, and the placeholder when
 * the figures have not arrived rather than a zero the reader would take as real.
 */
export function formatRevenue(
  format: MoneyFormat,
  amount: MoneyData | null | undefined,
): string {
  return amount == null
    ? REVENUE_PLACEHOLDER
    : formatWholeAmount(format, amount.amount);
}

/**
 * A payment delay in days, or the placeholder while the client has never
 * settled an invoice — no history reads better than an implied zero-day payer.
 */
export function formatPaymentDelay(days: number | null | undefined): string {
  return days == null ? REVENUE_PLACEHOLDER : m.clients_delay_days({ days });
}
