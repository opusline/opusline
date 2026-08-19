import { listInvoicesOptions } from "@opusline/api-client/react-query";
import { useQuery } from "@tanstack/react-query";

import { useOpenInvoice } from "./invoice-drawer-provider";
import { InvoiceListPanel } from "./invoice-list-panel";

type InvoiceListTabProps = {
  /** Which slice of the ledger this tab shows — one client's, or one mission's. */
  query: { clientId: number } | { missionId: number };
  /** Today in the account's timezone — the date isLate was derived from. */
  accountToday: string;
  emptyHint: string;
  /** A client's list spans missions, so its rows name theirs; a mission's do not. */
  withMission?: boolean;
};

/**
 * The invoices tab of a client or mission fiche.
 *
 * It fetches rather than taking rows as props because the tab panel only mounts
 * once opened: a fiche visit that never leaves the first tab costs no request.
 */
export function InvoiceListTab({
  query,
  accountToday,
  emptyHint,
  withMission,
}: InvoiceListTabProps) {
  const openInvoice = useOpenInvoice();
  const invoices = useQuery(listInvoicesOptions({ query }));

  return (
    <InvoiceListPanel
      accountToday={accountToday}
      emptyHint={emptyHint}
      invoices={invoices.data?.invoices ?? []}
      isError={invoices.isError}
      isPending={invoices.isPending}
      onOpen={openInvoice}
      withMission={withMission}
    />
  );
}
