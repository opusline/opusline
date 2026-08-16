import type { BankBalanceData, InvoiceSummaryData } from "@opusline/api-client";
import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { bankBalanceSubLabel, bankBalanceTileValue } from "@/lib/bank";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import { openInvoicesLabel, overdueLabel } from "../lib/summary-labels";

export function InvoiceSummaryTiles({
  summary,
  bankBalance,
}: {
  summary: InvoiceSummaryData;
  /** The Compte pro balance; undefined while it loads or outside its gate. */
  bankBalance?: BankBalanceData | null;
}) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const { toCollect, overdue } = summary;

  return (
    <StatTileRow className="grid-cols-1 sm:grid-cols-3">
      <StatTile
        label={m.invoices_scope_open()}
        value={formatWholeAmount(format, toCollect.amount.amount)}
        sub={openInvoicesLabel(toCollect)}
        tone="strong"
      />
      <StatTile
        label={m.invoices_overdue_tile()}
        value={formatWholeAmount(format, overdue.amount.amount)}
        sub={overdueLabel(overdue)}
        tone={overdue.count === 0 ? "quiet" : "warn"}
      />
      <StatTile
        label={m.invoices_bank_balance_tile()}
        value={bankBalanceTileValue(format, bankBalance)}
        sub={bankBalanceSubLabel(dateFormat, bankBalance)}
        tone={bankBalance == null ? "quiet" : "strong"}
      />
    </StatTileRow>
  );
}
