import { expect, it } from "vitest";

import { m } from "@/paraglide/messages.js";

import { quoteDetail } from "./quote-fixtures";
import { quoteStatusBadge, quoteStatusToken } from "./quote-status";

it("tells an expired quote apart from a sent one, though the API stores it as sent", () => {
  const { quote } = quoteDetail({ status: 1, isExpired: true });

  expect(quoteStatusToken(quote)).toBe("expired");
  expect(quoteStatusBadge(quote)).toEqual({
    variant: "warn",
    label: m.quote_status_expired(),
  });
});

it("badges an accepted quote as money on its way", () => {
  const { quote } = quoteDetail({ status: 2 });

  expect(quoteStatusToken(quote)).toBe("accepted");
  expect(quoteStatusBadge(quote).variant).toBe("success");
});
