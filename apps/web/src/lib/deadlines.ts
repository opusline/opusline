import type {
  DateFormat,
  DeadlineItemData,
  DeadlineReminderData,
  FiscalDeadlineData,
  FiscalDeadlineKind,
} from "@opusline/api-client";

import { client as apiClient } from "@opusline/api-client/client";
import { listDeadlinesOptions } from "@opusline/api-client/react-query";

import { calendarDateNumericLabel, calendarDaysBetween } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

/**
 * The vocabulary of a fiscal deadline — what it is called, how far off it is,
 * how far through its period we are. The Échéances screen and the week tile
 * both speak it and features must not import each other, so it lives here.
 *
 * The French fiscal terms stay French in both catalogs: an English-speaking
 * freelance in France still files a « CA3 ».
 */
const FISCAL_DEADLINE_KIND_MESSAGES: Record<FiscalDeadlineKind, () => string> =
  {
    0: m.deadline_kind_urssaf,
    1: m.deadline_kind_vat_ca3,
    2: m.deadline_kind_vat_ca12,
    3: m.deadline_kind_cfe,
    4: m.deadline_kind_cfe_instalment,
  };

export function fiscalDeadlineKindLabel(kind: FiscalDeadlineKind): string {
  return FISCAL_DEADLINE_KIND_MESSAGES[kind]();
}

/** What the sidebar badge shows: the reminders that have spoken up since the last look. */
export function unreadReminderCount(reminders: DeadlineReminderData[]): number {
  return reminders.filter((reminder) => !reminder.isRead).length;
}

/**
 * How every reader of the fiscal calendar asks for it: the Échéances screen,
 * the sidebar badge and the week tile share one cache entry, so the gate and
 * the staleness have to be decided here rather than per call site.
 *
 * Deadlines move by the day, not by the keystroke — and every write on the
 * Échéances screen replaces this same entry, so the badge clears without a
 * refetch.
 */
export function deadlinesQueryOptions(
  hasFrenchFiscality: boolean,
): ReturnType<typeof listDeadlinesOptions> {
  return {
    ...listDeadlinesOptions(),
    enabled: hasFrenchFiscality,
    staleTime: 10 * 60_000,
  };
}

/**
 * The ICS feed's address, absolute because a calendar app subscribes to it from
 * outside the page. Built against the host the app is actually served from
 * rather than the API's own APP_URL: behind a reverse proxy those differ, and
 * only the former is reachable from the user's phone.
 */
export function calendarFeedHref(calendarToken: string): string {
  return new URL(
    apiClient.buildUrl({
      url: "/calendar/{token}.ics",
      path: { token: calendarToken },
    }),
    window.location.origin,
  ).toString();
}

/**
 * One occurrence's identity, mirroring FiscalDeadline::key() on the API — it is
 * what a completion is written against, so the two must not drift.
 */
export function occurrenceKey(deadline: FiscalDeadlineData): string {
  return `${deadline.kind}:${deadline.periodKey}`;
}

/**
 * Whole days from the account's today to the due date, negative once it has
 * passed. Derived here rather than sent by the API, the way every other
 * lateness in the app is — see `accountTodayCalendarDate`.
 */
export function daysUntilDue(dueOn: string, today: string): number {
  return calendarDaysBetween(today, dueOn);
}

export function deadlineTimingLabel(days: number): string {
  if (days === 0) {
    return m.deadlines_due_today();
  }

  return days < 0
    ? m.deadlines_overdue_by({ count: -days })
    : m.deadlines_due_in({ count: days });
}

/** When it falls and how long is left, the one line both surfaces show. */
export function deadlineDueLabel(
  dateFormat: DateFormat,
  deadline: { dueOn: string },
  today: string,
): string {
  return `${m.deadlines_due_on({
    date: calendarDateNumericLabel(dateFormat, deadline.dueOn),
  })} · ${deadlineTimingLabel(daysUntilDue(deadline.dueOn, today))}`;
}

/**
 * How far through the period the deadline covers today sits, as a 0–1 ratio
 * for the tile's meter. Past the due date it is simply full.
 */
export function deadlineProgress(
  deadline: FiscalDeadlineData,
  today: string,
): number {
  const span = calendarDaysBetween(deadline.periodStart, deadline.dueOn);

  if (span <= 0) {
    return 1;
  }

  return calendarDaysBetween(deadline.periodStart, today) / span;
}

/**
 * The timeline's filter vocabulary — the dialog's checkboxes and the page's
 * chips speak the same five words, so the mapping from an item to its
 * category lives here once.
 */
export type DeadlineCategory =
  | "invoices"
  | "reminders"
  | "vat"
  | "urssaf"
  | "other";

export const DEADLINE_CATEGORIES: DeadlineCategory[] = [
  "invoices",
  "reminders",
  "vat",
  "urssaf",
  "other",
];

const DEADLINE_CATEGORY_MESSAGES: Record<DeadlineCategory, () => string> = {
  invoices: m.deadline_category_invoices,
  reminders: m.deadline_category_reminders,
  vat: m.deadline_category_vat,
  urssaf: m.deadline_category_urssaf,
  other: m.deadline_category_other,
};

export function deadlineCategoryLabel(category: DeadlineCategory): string {
  return DEADLINE_CATEGORY_MESSAGES[category]();
}

export function itemCategory(item: DeadlineItemData): DeadlineCategory {
  if (item.type === 0) {
    return "invoices";
  }

  if (item.type === 1) {
    return "reminders";
  }

  switch (item.fiscal?.kind) {
    case 1:
    case 2:
      return "vat";
    case 0:
      return "urssaf";
    default:
      return "other";
  }
}

/** Identity across a render: the occurrence for fiscal lines, the invoice otherwise. */
export function deadlineItemKey(item: DeadlineItemData): string {
  if (item.fiscal !== null) {
    return `fiscal:${occurrenceKey(item.fiscal)}`;
  }

  return `${item.type === 1 ? "reminder" : "invoice"}:${item.invoice?.id ?? 0}`;
}

export function isItemDone(item: DeadlineItemData): boolean {
  return item.fiscal?.completedOn != null;
}

/** What the line is called — « F-2026-028 · Catamania », « Relancer HartPrint », a fiscal kind. */
export function deadlineItemTitle(item: DeadlineItemData): string {
  if (item.fiscal !== null) {
    return fiscalDeadlineKindLabel(item.fiscal.kind);
  }

  const invoice = item.invoice;

  if (invoice === null) {
    return "";
  }

  if (item.type === 1) {
    return m.deadlines_reminder_title({ client: invoice.clientName });
  }

  return `${invoice.number ?? `#${invoice.id}`} · ${invoice.clientName}`;
}

export function deadlineItemAmountCents(item: DeadlineItemData): number | null {
  return item.fiscal !== null
    ? (item.fiscal.amount?.amount ?? null)
    : (item.invoice?.amount.amount ?? null);
}

/**
 * How long ago the feed was last fetched, coarsely — the dialog's heartbeat
 * line. The browser clock is fine here: hours-level precision about an event
 * the server stamped seconds is plenty.
 */
export function calendarSyncLabel(
  lastSyncedAt: string | null,
  nowMs: number = Date.now(),
): string {
  if (lastSyncedAt === null) {
    return m.deadlines_sync_waiting();
  }

  const minutes = Math.floor((nowMs - Date.parse(lastSyncedAt)) / 60_000);

  if (minutes < 1) {
    return m.deadlines_sync_just_now();
  }

  if (minutes < 60) {
    return m.deadlines_sync_minutes({ count: minutes });
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 48) {
    return m.deadlines_sync_hours({ count: hours });
  }

  return m.deadlines_sync_days({ count: Math.floor(hours / 24) });
}
