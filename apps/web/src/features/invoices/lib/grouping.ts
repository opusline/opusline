import type {
  InvoiceClientTotalsData,
  InvoiceListItemData,
  InvoiceStatus,
  Locale,
} from "@opusline/api-client";

import { averageDaysToPay } from "./labels";

export const INVOICE_SCOPES = ["all", "open", "late", "paid", "draft"] as const;

export type InvoiceScope = (typeof INVOICE_SCOPES)[number];

/**
 * Provisional copy — the design's chips are bound values the canvas markup does not
 * carry. These follow the API's own vocabulary; correcting one is a one-line edit.
 */
export const INVOICE_SCOPE_LABELS: Record<InvoiceScope, string> = {
  all: "Toutes",
  open: "À encaisser",
  late: "En retard",
  paid: "Payées",
  draft: "Brouillons",
};

export function isInvoiceScope(value: unknown): value is InvoiceScope {
  return (INVOICE_SCOPES as readonly unknown[]).includes(value);
}

const SCOPE_STATUS: Record<
  Exclude<InvoiceScope, "all" | "late">,
  InvoiceStatus
> = {
  draft: 0,
  open: 1,
  paid: 2,
};

/**
 * "En retard" overlaps "À encaisser" rather than excluding it — lateness is derived
 * from the due date, not a separate status, so an overdue invoice is counted by both.
 */
export function matchesScope(
  item: InvoiceListItemData,
  scope: InvoiceScope,
): boolean {
  if (scope === "all") {
    return true;
  }

  if (scope === "late") {
    return item.invoice.isLate;
  }

  return item.invoice.status === SCOPE_STATUS[scope];
}

/**
 * How many invoices each chip stands for. The scopes overlap — an overdue invoice is
 * counted by "À encaisser" and by "En retard" — so this is one pass, not a partition.
 */
export function countByScope(
  items: InvoiceListItemData[],
): Record<InvoiceScope, number> {
  const counts = Object.fromEntries(
    INVOICE_SCOPES.map((scope) => [scope, 0]),
  ) as Record<InvoiceScope, number>;

  for (const item of items) {
    for (const scope of INVOICE_SCOPES) {
      if (matchesScope(item, scope)) {
        counts[scope] += 1;
      }
    }
  }

  return counts;
}

export type InvoiceGroup = {
  client: InvoiceListItemData["client"];
  items: InvoiceListItemData[];
  total: number;
  averageDaysToPay: number | null;
};

/**
 * Totals come from the API's clientTotals verbatim — the frontend never does
 * money arithmetic — and are gross: what is owed, not what gets declared.
 */
export function groupByClient(
  locale: Locale,
  items: InvoiceListItemData[],
  clientTotals: InvoiceClientTotalsData[],
  scope: InvoiceScope,
): InvoiceGroup[] {
  const totalsByClient = new Map(
    clientTotals.map((totals) => [totals.clientId, totals]),
  );
  const groups = new Map<number, Omit<InvoiceGroup, "averageDaysToPay">>();

  for (const item of items) {
    const group = groups.get(item.client.id) ?? {
      client: item.client,
      items: [],
      total: totalsByClient.get(item.client.id)?.[scope].amount ?? 0,
    };

    group.items.push(item);
    groups.set(item.client.id, group);
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      averageDaysToPay: averageDaysToPay(
        group.items.map((item) => item.invoice),
      ),
    }))
    .sort((a, b) => a.client.name.localeCompare(b.client.name, locale));
}
