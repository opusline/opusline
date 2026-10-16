import type { QuoteData, QuoteStatus } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

const QUOTE_STATUS_MESSAGES: Record<QuoteStatus, () => string> = {
  0: m.quote_status_draft,
  1: m.quote_status_sent,
  2: m.quote_status_accepted,
  3: m.quote_status_refused,
};

/** What a test or a stylesheet can match on: the label moves with the locale. */
export const QUOTE_STATUS_TOKENS: Record<QuoteStatus, string> = {
  0: "draft",
  1: "sent",
  2: "accepted",
  3: "refused",
};

type BadgeTone = "brand" | "neutral" | "success" | "warn";

const STATUS_TONES: Record<QuoteStatus, BadgeTone> = {
  0: "neutral",
  1: "brand",
  2: "success",
  3: "neutral",
};

/** The token the row carries: « expired » is derived by the API, never stored. */
export function quoteStatusToken(quote: QuoteData): string {
  return quote.isExpired ? "expired" : QUOTE_STATUS_TOKENS[quote.status];
}

/**
 * Expired is not a fifth status — the API derives it from the validity date and
 * reports it as `isExpired` on a sent quote. It gets its own badge because it is
 * the one state that asks something of you.
 */
export function quoteStatusBadge(quote: QuoteData): {
  variant: BadgeTone;
  label: string;
} {
  if (quote.isExpired) {
    return { variant: "warn", label: m.quote_status_expired() };
  }

  return {
    variant: STATUS_TONES[quote.status],
    label: QUOTE_STATUS_MESSAGES[quote.status](),
  };
}
