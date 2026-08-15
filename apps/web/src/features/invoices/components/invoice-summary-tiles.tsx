import type { InvoiceSummaryData } from "@opusline/api-client";
import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import { openInvoicesLabel, overdueLabel } from "../lib/summary-labels";

export function InvoiceSummaryTiles({
  summary,
}: {
  summary: InvoiceSummaryData;
}) {
  const format = useMoneyFormat();
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
      {/*
        Nothing in the app knows this figure yet — there is no bank import and no field
        to type it into — so the tile holds its place in the row and says where the
        number would come from. It gains a value in the same change that produces one.
      */}
      <StatTile
        label={m.invoices_bank_balance_tile()}
        value="—"
        sub={m.invoices_bank_balance_sub()}
        tone="quiet"
      />
    </StatTileRow>
  );
}
