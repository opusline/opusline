import type {
  BankAccountData,
  BankMatchReason,
  BankStatementData,
  DateFormat,
} from "@opusline/api-client";

import { formatAmountWithCents, type MoneyFormat } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

const BANK_MATCH_REASON_MESSAGES: Record<BankMatchReason, () => string> = {
  0: m.bank_match_reason_reference,
  1: m.bank_match_reason_client,
  2: m.bank_match_reason_overdue,
};

export function bankMatchReasonLabel(reason: BankMatchReason): string {
  return BANK_MATCH_REASON_MESSAGES[reason]();
}

/**
 * Bank movements always carry their sign: "+ 612,00 €" / "− 2 431,00 €". The
 * explicit plus is the design's way of making credits scannable in a mixed
 * column.
 */
export function signedAmountLabel(format: MoneyFormat, cents: number): string {
  const magnitude = formatAmountWithCents(format, Math.abs(cents));

  return cents < 0 ? `− ${magnitude}` : `+ ${magnitude}`;
}

/** The newest import — the API sends statements newest first. */
export function latestStatement(
  data: BankAccountData,
): BankStatementData | null {
  return data.statements[0] ?? null;
}

export function reconciliationNote(
  dateFormat: DateFormat,
  data: BankAccountData,
): string {
  const hasPending = data.pendingMatches.length > 0;

  // The newest import may have brought nothing new (a re-import dedups to
  // zero rows), so while suggestions are pending the note cites the newest
  // statement still being worked through — never "tout est traité" next to
  // a badge that says otherwise.
  const statement = hasPending
    ? (data.statements.find(
        (candidate) => candidate.matchCount > candidate.validatedMatchCount,
      ) ?? latestStatement(data))
    : latestStatement(data);

  if (statement === null) {
    return m.bank_statement_note_none();
  }

  const range = {
    start: calendarDateNumericLabel(dateFormat, statement.periodStart),
    end: calendarDateNumericLabel(dateFormat, statement.periodEnd),
  };

  if (!hasPending) {
    return m.bank_statement_note_done(range);
  }

  return m.bank_statement_note({
    ...range,
    validated: statement.validatedMatchCount,
    total: statement.matchCount,
  });
}

export function movementsSourceNote(
  dateFormat: DateFormat,
  data: BankAccountData,
): string {
  const statement = latestStatement(data);

  if (statement === null) {
    return m.bank_movements_source_manual();
  }

  return m.bank_movements_source_statement({
    start: calendarDateNumericLabel(dateFormat, statement.periodStart),
    end: calendarDateNumericLabel(dateFormat, statement.periodEnd),
    date: calendarDateNumericLabel(dateFormat, statement.importedAt),
  });
}
