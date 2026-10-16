import type { QuoteListItemData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Chip, ChipCount, ChipGroup } from "@opusline/ui/components/chip";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { Input } from "@opusline/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@opusline/ui/components/table";
import { useMemo, useState } from "react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatAmountWithCents, formatWholeAmount } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import { quoteStatusBadge, quoteStatusToken } from "../lib/quote-status";
import {
  countByQuoteScope,
  isQuoteScope,
  matchesQuoteScope,
  matchesQuoteSearch,
  QUOTE_SCOPES,
  type QuoteScope,
  quoteScopeLabel,
} from "../lib/scopes";

type QuotesTableProps = {
  quotes: QuoteListItemData[];
  onOpen?: (quoteId: number) => void;
};

/** The Devis list: a search, one chip per state with its count, and the rows. */
export function QuotesTable({ quotes, onOpen }: QuotesTableProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const [scope, setScope] = useState<QuoteScope>("all");
  const [search, setSearch] = useState("");

  const searched = useMemo(
    () => quotes.filter((item) => matchesQuoteSearch(item, search)),
    [quotes, search],
  );
  const counts = useMemo(() => countByQuoteScope(searched), [searched]);
  const shown = useMemo(
    () => searched.filter((item) => matchesQuoteScope(item, scope)),
    [searched, scope],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          aria-label={m.quotes_search_aria()}
          className="max-w-80 flex-1"
          data-testid="quote-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder={m.quotes_search_placeholder()}
          type="search"
          value={search}
        />
        <ChipGroup
          aria-label={m.quotes_filter_aria()}
          onValueChange={(value) => {
            const next = value.find(isQuoteScope);

            if (next !== undefined) {
              setScope(next);
            }
          }}
          value={[scope]}
        >
          {QUOTE_SCOPES.map((quoteScope) => (
            <Chip
              data-count={counts[quoteScope]}
              data-filter={quoteScope}
              data-testid="quote-filter"
              key={quoteScope}
              shape="pill"
              value={quoteScope}
            >
              {quoteScopeLabel(quoteScope)}{" "}
              <ChipCount>{counts[quoteScope]}</ChipCount>
            </Chip>
          ))}
        </ChipGroup>
      </div>

      {shown.length === 0 ? (
        <Empty className="px-6 py-10" data-testid="quotes-empty">
          <EmptyHeader className="gap-2">
            <EmptyTitle variant="strong">{m.quotes_empty_title()}</EmptyTitle>
            <EmptyDescription className="text-muted-foreground-3 text-sm">
              {quotes.length > 0
                ? m.quotes_empty_filtered()
                : m.quotes_empty_none()}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table
          className="table-fixed"
          containerClassName="overflow-hidden rounded-md border bg-card"
        >
          <colgroup>
            <col className="w-28 sm:w-32" />
            <col />
            <col className="w-28 sm:w-36" />
            <col className="w-0 sm:w-28" />
          </colgroup>
          <TableHeader>
            <TableRow className="sr-only">
              <TableHead>{m.quotes_column_number()}</TableHead>
              <TableHead>{m.quotes_column_title()}</TableHead>
              <TableHead>{m.quotes_column_amount()}</TableHead>
              <TableHead className="max-sm:hidden">
                {m.quotes_column_status()}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map(({ quote, client }) => {
              const badge = quoteStatusBadge(quote);
              const label = quote.number ?? quote.title ?? client.name;

              return (
                <TableRow
                  className="cursor-pointer"
                  data-amount-cents={quote.amountTtc.amount}
                  data-reference={quote.number ?? ""}
                  data-status={quoteStatusToken(quote)}
                  data-testid="quote-row"
                  key={quote.id}
                  onClick={() => onOpen?.(quote.id)}
                >
                  <TableCell className="px-3 py-3 font-mono text-foreground-2 text-sm tabular-nums sm:px-5">
                    <button
                      aria-label={m.quotes_open_aria({ label })}
                      className="rounded-sm text-left focus-visible:outline-2 focus-visible:outline-primary-text"
                      data-testid="quote-open"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpen?.(quote.id);
                      }}
                      type="button"
                    >
                      {quote.number ?? "—"}
                    </button>
                  </TableCell>
                  <TableCell className="min-w-0 px-0 py-3">
                    <span className="block truncate text-foreground-2 text-sm">
                      {quote.title ?? client.name}
                      {quote.title === null ? null : (
                        <span className="text-muted-foreground-3">
                          {" · "}
                          {client.name}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.75 block truncate text-muted-foreground-3 text-xs">
                      {quoteRowDetail(dateFormat, quote)}
                    </span>
                    <Badge className="mt-1.5 sm:hidden" variant={badge.variant}>
                      {badge.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 pr-3 pl-0 text-right sm:px-0">
                    <span className="block font-mono text-foreground-hi text-sm tabular-nums">
                      {formatWholeAmount(format, quote.amountTtc.amount)}
                    </span>
                    {quote.depositAmount === null ? null : (
                      <span className="block text-muted-foreground-3 text-xs">
                        {m.quotes_deposit_note({
                          amount: formatAmountWithCents(
                            format,
                            quote.depositAmount.amount,
                          ),
                        })}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-right max-sm:hidden">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

/** Where the quote stands, in one line: the date that matters for its state. */
export function quoteRowDetail(
  dateFormat: Parameters<typeof calendarDateNumericLabel>[0],
  quote: QuoteListItemData["quote"],
): string {
  const issued = calendarDateNumericLabel(dateFormat, quote.issuedOn);

  if (quote.status === 0) {
    return `${issued} · ${m.quotes_state_draft()}`;
  }

  if (quote.status === 2 && quote.acceptedOn !== null) {
    return `${issued} · ${m.quotes_state_accepted_on({ date: calendarDateNumericLabel(dateFormat, quote.acceptedOn) })}`;
  }

  if (quote.status === 3 && quote.refusedOn !== null) {
    return `${issued} · ${m.quotes_state_refused_on({ date: calendarDateNumericLabel(dateFormat, quote.refusedOn) })}`;
  }

  const until = calendarDateNumericLabel(dateFormat, quote.validUntil);

  return `${issued} · ${quote.isExpired ? m.quotes_state_expired_on({ date: until }) : m.quotes_state_valid_until({ date: until })}`;
}
