import type { BankBalanceData, DateFormat } from "@opusline/api-client";

import { formatWholeAmount, type MoneyFormat } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

/**
 * Where the shown balance comes from: the statement it was read off, the fact
 * it was typed by hand, or that it is the sum of the imported movements. Both
 * the Compte pro tile and the invoices tile cite it, and features must not
 * import each other, so the accessor lives here.
 */
function bankBalanceSourceLabel(
  dateFormat: DateFormat,
  balance: BankBalanceData,
): string {
  if (balance.source === 1 && balance.asOf !== null) {
    return m.bank_balance_from_statement({
      date: calendarDateNumericLabel(dateFormat, balance.asOf),
    });
  }

  if (balance.source === 2) {
    return m.bank_balance_derived();
  }

  return m.bank_balance_manual();
}

/**
 * The figure both balance tiles show; the dash means "nothing recorded yet",
 * never a zero.
 */
export function bankBalanceTileValue(
  format: MoneyFormat,
  balance: BankBalanceData | null | undefined,
): string {
  return balance == null
    ? "—"
    : formatWholeAmount(format, balance.amount.amount);
}

/** The line under the figure — a source when one exists, the placeholder otherwise. */
export function bankBalanceSubLabel(
  dateFormat: DateFormat,
  balance: BankBalanceData | null | undefined,
): string {
  return balance == null
    ? m.invoices_bank_balance_sub()
    : bankBalanceSourceLabel(dateFormat, balance);
}
