import type { DeadlineBoardData, DeadlineItemData } from "@opusline/api-client";

import { eur, fiscalDeadline } from "@/test/fixtures";

/** The day every fixture below is read against. */
export const DEMO_TODAY = "2026-08-13";

function fiscalItem(
  overrides: Parameters<typeof fiscalDeadline>[0] = {},
): DeadlineItemData {
  const fiscal = fiscalDeadline(overrides);

  return { type: 2, dueOn: fiscal.dueOn, invoice: null, fiscal };
}

/** July's URSSAF, still owed: the account's most pressing fiscal obligation. */
const DEMO_URSSAF = fiscalItem();

/** June's, already declared — kept on the list so the record stays visible. */
const DEMO_URSSAF_DONE = fiscalItem({
  periodKey: "2026-06",
  periodStart: "2026-06-01",
  periodEnd: "2026-06-30",
  dueOn: "2026-07-31",
  amount: eur(98_600),
  completedOn: "2026-07-29",
});

/** December's CFE — estimated from what the bank paid for it last year. */
const DEMO_CFE = fiscalItem({
  kind: 3,
  periodKey: "2026",
  periodStart: "2026-01-01",
  periodEnd: "2026-12-31",
  dueOn: "2026-12-15",
  amount: eur(48_000),
  rateBp: null,
});

/** A period that has not started: no collections to estimate from yet. */
const DEMO_UNPRICED = fiscalItem({
  periodKey: "2026-09",
  periodStart: "2026-09-01",
  periodEnd: "2026-09-30",
  dueOn: "2026-10-31",
  amount: null,
});

/** An invoice already past due, and the relance it calls for. */
const DEMO_LATE_INVOICE_BLOCK: DeadlineItemData[] = (() => {
  const invoice = {
    id: 28,
    number: "F-2026-028",
    clientName: "Lunaprint",
    missionName: "Refonte identité",
    periodStart: "2026-03-01",
    amount: eur(171_600),
    dueOn: "2026-03-16",
    remindersSent: 0,
    lastRemindedOn: null,
  };

  return [
    { type: 0, dueOn: invoice.dueOn, invoice, fiscal: null },
    { type: 1, dueOn: invoice.dueOn, invoice, fiscal: null },
  ];
})();

/** An invoice comfortably ahead of its due date. */
const DEMO_OPEN_INVOICE: DeadlineItemData = {
  type: 0,
  dueOn: "2026-09-14",
  invoice: {
    id: 41,
    number: "F-2026-041",
    clientName: "Callisto",
    missionName: "Callisto front",
    periodStart: "2026-07-01",
    amount: eur(1_254_000),
    dueOn: "2026-09-14",
    remindersSent: 0,
    lastRemindedOn: null,
  },
  fiscal: null,
};

export const DEMO_BOARD: DeadlineBoardData = {
  next: DEMO_LATE_INVOICE_BLOCK[0],
  items: [
    ...DEMO_LATE_INVOICE_BLOCK,
    DEMO_URSSAF,
    DEMO_OPEN_INVOICE,
    DEMO_UNPRICED,
    DEMO_CFE,
    DEMO_URSSAF_DONE,
  ],
  reminders: [
    { deadline: fiscalDeadline(), isRead: false },
    {
      deadline: fiscalDeadline({ periodKey: "2026-06", dueOn: "2026-07-31" }),
      isRead: true,
    },
  ],
  calendarToken:
    "Kx7pQm2ZvNr4TbHy8LcWd3FgJ6sAeR9UnPzXqB5MvYtCkD1hSjE0wG7iOaLuNfVx",
  calendarFeed: {
    invoices: true,
    reminders: false,
    vat: true,
    urssaf: true,
    other: true,
  },
  calendarSubscribedOn: null,
  calendarLastSyncedAt: null,
};

/** The same board once the address lives in a calendar app. */
export const DEMO_SUBSCRIBED_BOARD: DeadlineBoardData = {
  ...DEMO_BOARD,
  calendarSubscribedOn: "2026-08-12",
  calendarLastSyncedAt: "2026-08-13T10:00:00Z",
};

export const DEMO_EMPTY_BOARD: DeadlineBoardData = {
  ...DEMO_BOARD,
  next: null,
  items: [],
  reminders: [],
};
