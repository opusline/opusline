import type { QuoteListItemData } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

export const QUOTE_SCOPES = [
  "all",
  "draft",
  "open",
  "accepted",
  "refused",
  "expired",
] as const;

export type QuoteScope = (typeof QUOTE_SCOPES)[number];

const QUOTE_SCOPE_MESSAGES: Record<QuoteScope, () => string> = {
  all: m.quotes_scope_all,
  draft: m.quotes_scope_draft,
  open: m.quotes_scope_open,
  accepted: m.quotes_scope_accepted,
  refused: m.quotes_scope_refused,
  expired: m.quotes_scope_expired,
};

export function quoteScopeLabel(scope: QuoteScope): string {
  return QUOTE_SCOPE_MESSAGES[scope]();
}

export function isQuoteScope(value: unknown): value is QuoteScope {
  return (QUOTE_SCOPES as readonly unknown[]).includes(value);
}

/** The scopes partition the list: a sent quote is open or expired, never both. */
export function matchesQuoteScope(
  item: QuoteListItemData,
  scope: QuoteScope,
): boolean {
  const { quote } = item;

  switch (scope) {
    case "all":
      return true;
    case "draft":
      return quote.status === 0;
    case "open":
      return quote.status === 1 && !quote.isExpired;
    case "expired":
      return quote.isExpired;
    case "accepted":
      return quote.status === 2;
    case "refused":
      return quote.status === 3;
  }
}

export function countByQuoteScope(
  items: QuoteListItemData[],
): Record<QuoteScope, number> {
  const counts = Object.fromEntries(
    QUOTE_SCOPES.map((scope) => [scope, 0]),
  ) as Record<QuoteScope, number>;

  for (const item of items) {
    for (const scope of QUOTE_SCOPES) {
      if (matchesQuoteScope(item, scope)) {
        counts[scope] += 1;
      }
    }
  }

  return counts;
}

/** Number, title or client, the three things one remembers a quote by. */
export function matchesQuoteSearch(
  item: QuoteListItemData,
  query: string,
): boolean {
  const needle = query.trim().toLocaleLowerCase();

  if (needle === "") {
    return true;
  }

  return [item.quote.number, item.quote.title, item.client.name].some(
    (value) => value?.toLocaleLowerCase().includes(needle) ?? false,
  );
}
