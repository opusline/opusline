import type { InvoiceListItemData, InvoiceStatus } from "@opusline/api-client";

export const INVOICE_SCOPES = ["all", "draft", "sent", "late", "paid"] as const;

export type InvoiceScope = (typeof INVOICE_SCOPES)[number];

/**
 * Provisional copy — the design's chips are bound values the canvas markup does not
 * carry. These follow the API's own vocabulary; correcting one is a one-line edit.
 */
export const INVOICE_SCOPE_LABELS: Record<InvoiceScope, string> = {
  all: "Toutes",
  draft: "Brouillons",
  sent: "Envoyées",
  late: "En retard",
  paid: "Payées",
};

export function isInvoiceScope(value: unknown): value is InvoiceScope {
  return (INVOICE_SCOPES as readonly unknown[]).includes(value);
}

const SCOPE_STATUS: Record<
  Exclude<InvoiceScope, "all" | "late">,
  InvoiceStatus
> = {
  draft: 0,
  sent: 1,
  paid: 2,
};

/**
 * "En retard" overlaps "Envoyées" rather than excluding it — lateness is derived
 * from the due date, not a fourth status, so an overdue invoice is counted by both.
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

export type InvoiceGroup = {
  client: InvoiceListItemData["client"];
  items: InvoiceListItemData[];
  total: number;
};

/**
 * The screen reads by client, so the rows are grouped the way they are read. Totals
 * are gross: what is owed, not what gets declared.
 */
export function groupByClient(items: InvoiceListItemData[]): InvoiceGroup[] {
  const groups = new Map<number, InvoiceGroup>();

  for (const item of items) {
    const group = groups.get(item.client.id) ?? {
      client: item.client,
      items: [],
      total: 0,
    };

    group.items.push(item);
    group.total += item.invoice.amountTtc.amount;
    groups.set(item.client.id, group);
  }

  return [...groups.values()].sort((a, b) =>
    a.client.name.localeCompare(b.client.name, "fr"),
  );
}
