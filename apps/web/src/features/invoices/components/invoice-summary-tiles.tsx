import type { InvoiceSummaryData } from "@opusline/api-client";
import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";

import { formatEuros } from "@/lib/billing";

import { openInvoicesLabel, overdueLabel } from "../lib/summary-labels";

export function InvoiceSummaryTiles({
  summary,
}: {
  summary: InvoiceSummaryData;
}) {
  const { toCollect, overdue } = summary;

  return (
    <StatTileRow className="grid-cols-1 sm:grid-cols-3">
      <StatTile
        label="À encaisser"
        value={formatEuros(toCollect.amount.amount)}
        sub={openInvoicesLabel(toCollect)}
        tone="strong"
      />
      <StatTile
        label="Dont en retard"
        value={formatEuros(overdue.amount.amount)}
        sub={overdueLabel(overdue)}
        tone={overdue.count === 0 ? "quiet" : "warn"}
      />
      {/*
        Nothing in the app knows this figure yet — there is no bank import and no field
        to type it into — so the tile holds its place in the row and says where the
        number would come from. It gains a value in the same change that produces one.
      */}
      <StatTile
        label="Solde compte pro"
        value="—"
        sub="saisi à la main · importer un relevé"
        tone="quiet"
      />
    </StatTileRow>
  );
}
