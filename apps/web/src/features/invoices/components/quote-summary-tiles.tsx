import type { QuoteListItemData } from "@opusline/api-client";
import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import { matchesQuoteScope } from "../lib/scopes";

/** What the quotes add up to, by where they stand; counted from the list itself. */
export function QuoteSummaryTiles({ quotes }: { quotes: QuoteListItemData[] }) {
  const format = useMoneyFormat();
  const open = quotes.filter((item) => matchesQuoteScope(item, "open"));
  const accepted = quotes.filter((item) => matchesQuoteScope(item, "accepted"));
  const closed = quotes.filter(
    (item) =>
      matchesQuoteScope(item, "expired") || matchesQuoteScope(item, "refused"),
  );
  const sum = (items: QuoteListItemData[]) =>
    items.reduce((total, item) => total + item.quote.amountTtc.amount, 0);

  return (
    <StatTileRow className="grid-cols-1 sm:grid-cols-3">
      <StatTile
        data-count={open.length}
        data-testid="quote-tile-open"
        label={m.quotes_tile_open()}
        sub={m.quotes_count({ count: open.length })}
        tone="strong"
        value={formatWholeAmount(format, sum(open))}
      />
      <StatTile
        data-count={accepted.length}
        data-testid="quote-tile-accepted"
        label={m.quotes_tile_accepted()}
        sub={m.quotes_count({ count: accepted.length })}
        tone={accepted.length === 0 ? "quiet" : "strong"}
        value={formatWholeAmount(format, sum(accepted))}
      />
      <StatTile
        data-count={closed.length}
        data-testid="quote-tile-closed"
        label={m.quotes_tile_closed()}
        sub={m.quotes_count({ count: closed.length })}
        tone={closed.length === 0 ? "quiet" : "warn"}
        value={String(closed.length)}
      />
    </StatTileRow>
  );
}
