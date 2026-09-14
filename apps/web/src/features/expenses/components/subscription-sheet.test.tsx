import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import {
  SUBSCRIPTIONS_TODAY,
  subscription,
} from "../lib/subscription-fixtures";
import { SubscriptionSheet } from "./subscription-sheet";

it.each([
  ["the next debit", "2026-09-01", "2026-09-01"],
  ["today without a next debit", null, SUBSCRIPTIONS_TODAY],
])(
  "starts an amount change on the current price and %s",
  async (_, nextDebitOn, effectiveFrom) => {
    const onSubmitAmount = vi.fn();
    const nordlys = subscription({ nextDebitOn });

    render(
      <SubscriptionSheet
        error={null}
        fieldErrors={null}
        isSaving={false}
        isVatLiable
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
        onSubmitAmount={onSubmitAmount}
        state={{ mode: "amount", subscription: nordlys }}
        today={SUBSCRIPTIONS_TODAY}
      />,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Enregistrer" }));

    expect(onSubmitAmount).toHaveBeenCalledWith(nordlys, {
      ht: "24",
      effectiveFrom,
    });
  },
);
