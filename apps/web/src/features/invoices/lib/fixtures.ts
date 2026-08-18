import type {
  ClientData,
  InvoiceClientTotalsData,
  InvoiceData,
  InvoiceDetailData,
  InvoiceTodoData,
  InvoiceTodoOverdueData,
  InvoiceTodoWorkData,
  MoneyData,
} from "@opusline/api-client";

import {
  CLIENT_FIXTURE,
  eur,
  invoiceItem,
  invoiceSummary,
  OVERDUE_TODO,
  UNBILLED_TODO,
} from "@/test/fixtures";

import {
  type InvoicePrefill,
  prefillFromForfait,
  prefillFromUnbilledWork,
} from "./invoice-prefill";

export { invoiceItem, invoiceSummary };

export const secondClient = {
  ...CLIENT_FIXTURE,
  id: 2,
  slug: "orvella",
  name: "Orvella",
  color: 4,
  paymentTermsDays: 30,
} satisfies ClientData;

const ZERO_EUR: MoneyData = eur(0);

/** The per-scope totals the API sends beside the list; scopes default to zero. */
export function clientTotals(
  clientId: number,
  overrides: Partial<Omit<InvoiceClientTotalsData, "clientId">> = {},
): InvoiceClientTotalsData {
  return {
    clientId,
    all: ZERO_EUR,
    open: ZERO_EUR,
    late: ZERO_EUR,
    paid: ZERO_EUR,
    draft: ZERO_EUR,
    ...overrides,
  };
}

export function invoiceDetail(
  overrides: Partial<InvoiceData> = {},
): InvoiceDetailData {
  const item = invoiceItem(overrides);

  return {
    invoice: item.invoice,
    client: item.client,
    mission: item.mission,
    history: [
      { id: 1, kind: 0, occurredOn: "2026-06-30", note: null },
      { id: 2, kind: 1, occurredOn: "2026-06-30", note: null },
      { id: 3, kind: 3, occurredOn: "2026-07-24", note: null },
    ],
  };
}

/** An overdue row, or — with `work` overrides — a row of work waiting to be billed. */
export function overdueTodoRow(
  overrides: Partial<InvoiceTodoOverdueData> = {},
): InvoiceTodoData {
  return {
    ...OVERDUE_TODO,
    overdue: { ...OVERDUE_TODO.overdue, ...overrides },
  };
}

export function unbilledTodoRow(
  overrides: Partial<InvoiceTodoWorkData> = {},
): InvoiceTodoData {
  return { ...UNBILLED_TODO, work: unbilledWork(overrides) };
}

function unbilledWork(
  overrides: Partial<InvoiceTodoWorkData> = {},
): InvoiceTodoWorkData {
  return { ...UNBILLED_TODO.work, ...overrides };
}

/** What the dialog opens on from a row of "à facturer". */
export function unbilledPrefill(
  overrides: Partial<InvoiceTodoWorkData> = {},
): InvoicePrefill {
  return prefillFromUnbilledWork(
    "fr-FR",
    UNBILLED_TODO,
    unbilledWork(overrides),
  );
}

/** What it opens on from a fixed-price mission: no time, no period, an empty amount. */
export function forfaitPrefill(
  overrides: Partial<InvoicePrefill> = {},
): InvoicePrefill {
  return {
    ...prefillFromForfait({
      clientId: 2,
      clientName: "Orvella",
      missionId: 20,
      missionName: "Orvella front",
      progress: {
        fixedPrice: eur(800_000),
        invoiced: eur(240_000),
        remaining: eur(560_000),
        progressBp: 3000,
        isOverBilled: false,
        issuedCount: 1,
        draftCount: 0,
      },
      vatRateBp: 2000,
    }),
    ...overrides,
  };
}
