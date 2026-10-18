import type { InvoiceEventData } from "@opusline/api-client";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { MoneyFormatProvider } from "@/components/money-format-provider";
import { formatAmountWithCents } from "@/lib/billing";
import { InvoiceHistory } from "./invoice-history";

function event(
  overrides: Pick<InvoiceEventData, "kind" | "note">,
): InvoiceEventData {
  return { id: 1, occurredOn: "2026-10-18", ...overrides };
}

function renderHistory(history: InvoiceEventData[]) {
  render(
    <MoneyFormatProvider currency="EUR" dateFormat={0} locale="fr-FR">
      <InvoiceHistory history={history} />
    </MoneyFormatProvider>,
  );
}

it("states a recorded payment as money, not as the cents it is stored in", () => {
  renderHistory([event({ kind: 6, note: "50000" })]);

  expect(screen.getByTestId("invoice-history-note").textContent).toBe(
    formatAmountWithCents({ locale: "fr-FR", currency: "EUR" }, 50_000),
  );
});

it("prints any other note as it was written", () => {
  renderHistory([event({ kind: 2, note: "Relance par téléphone" })]);

  expect(screen.getByTestId("invoice-history-note")).toHaveTextContent(
    "Relance par téléphone",
  );
});
