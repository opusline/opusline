import type { InvoiceListData } from "@opusline/api-client";
import { listInvoicesInfiniteOptions } from "@opusline/api-client/react-query";

/**
 * The invoices ledger's cursor contract — how the next page is addressed and
 * where the first one starts — decided once for the Factures screen and the
 * fiche tabs, so the two lists cannot drift apart on how they page.
 */
export function invoicePagesOptions(query?: {
  clientId?: number;
  missionId?: number;
}) {
  return {
    ...listInvoicesInfiniteOptions(query === undefined ? undefined : { query }),
    getNextPageParam: (lastPage: InvoiceListData) => lastPage.nextCursor,
    initialPageParam: {},
  };
}
