import { client as apiClient } from "@opusline/api-client/client";
import { listExpensesOptions } from "@opusline/api-client/react-query";

export function expenseReceiptHref(expenseId: number): string {
  return apiClient.buildUrl({
    url: "/expenses/{expense}/receipt",
    path: { expense: expenseId },
  });
}

/**
 * The sidebar's « factures à lier » count reads the current month's journal.
 * Fetched lazily and kept for ten minutes: the badge is a hint, and every
 * expense write refreshes it through invalidateExpenseWrites anyway.
 */
export function expensesBadgeQueryOptions(
  hasFrenchFiscality: boolean,
): ReturnType<typeof listExpensesOptions> {
  return {
    ...listExpensesOptions(),
    enabled: hasFrenchFiscality,
    staleTime: 10 * 60_000,
  };
}
