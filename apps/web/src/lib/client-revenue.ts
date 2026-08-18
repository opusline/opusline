import type {
  ClientRevenueData,
  ClientRevenueListData,
  Locale,
  MissionForfaitData,
  MissionRevenueData,
  MoneyData,
} from "@opusline/api-client";

import { formatWholeAmount, type MoneyFormat } from "@/lib/billing";
import { billedQuantityLabel } from "@/lib/durations";
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
 * The month's tracked time in the unit its mission bills in, already rounded to
 * the mission's increment by the API. The placeholder is for figures that have
 * not arrived — an empty month is a real "0 j", not an unknown, and the API
 * always sets exactly one of the two, so the second fallback is a type guard.
 */
export function formatTrackedMonth(
  locale: Locale,
  revenue:
    | Pick<MissionRevenueData, "currentMonthDays" | "currentMonthMinutes">
    | null
    | undefined,
): string {
  if (revenue == null) {
    return REVENUE_PLACEHOLDER;
  }

  return (
    billedQuantityLabel(locale, {
      valuedDays: revenue.currentMonthDays,
      valuedMinutes: revenue.currentMonthMinutes,
    }) ?? REVENUE_PLACEHOLDER
  );
}

/**
 * A payment delay in days, or the placeholder while the client has never
 * settled an invoice — no history reads better than an implied zero-day payer.
 */
export function formatPaymentDelay(days: number | null | undefined): string {
  return days == null ? REVENUE_PLACEHOLDER : m.clients_delay_days({ days });
}

/** A whole, in the basis points the API reports shares in. */
export const FULL_SHARE_BP = 10_000;

/** Past this a forfait is worth a second look before more time goes into it. */
export const WARN_SHARE_BP = 8_000;

/**
 * More effort has gone into a fixed price than its target day rate paid for.
 *
 * Takes either the mission's revenue or its forfait block, because the clients
 * table holds one and the mission page the other. Null-safe throughout: only a
 * forfait carries the block, and only one with a target rate carries the share,
 * so everything else has nothing to be over.
 */
export function isOverBudget(
  revenue: MissionRevenueData | MissionForfaitData | null | undefined,
): boolean {
  if (revenue === null || revenue === undefined) {
    return false;
  }

  const forfait = "forfait" in revenue ? revenue.forfait : revenue;

  return (forfait?.consumedShareBp ?? 0) > FULL_SHARE_BP;
}
