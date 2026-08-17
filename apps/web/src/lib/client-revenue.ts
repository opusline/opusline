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

export function findClientRevenue(
  revenue: ClientRevenueListData | undefined,
  clientId: number,
): ClientRevenueData | undefined {
  return revenue?.clients.find((client) => client.clientId === clientId);
}

export function findMissionRevenue(
  client: ClientRevenueData | undefined,
  missionId: number,
): MissionRevenueData | undefined {
  return client?.missions.find((mission) => mission.missionId === missionId);
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
