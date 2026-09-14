import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { emptySubscriptionDraft } from "../lib/subscription-draft";
import {
  SUBSCRIPTIONS_TODAY,
  subscription,
} from "../lib/subscription-fixtures";
import {
  SubscriptionSheet,
  type SubscriptionSheetState,
} from "./subscription-sheet";

function renderSheet(state: SubscriptionSheetState) {
  const onOpenChange = vi.fn();

  render(
    <SubscriptionSheet
      error={null}
      fieldErrors={null}
      isSaving={false}
      isVatLiable
      onOpenChange={onOpenChange}
      onSubmit={vi.fn()}
      onSubmitAmount={vi.fn()}
      state={state}
      today={SUBSCRIPTIONS_TODAY}
    />,
  );

  return { onOpenChange };
}

const SHEET_STATES: [string, SubscriptionSheetState, string][] = [
  [
    "adding",
    { mode: "create", initial: emptySubscriptionDraft(SUBSCRIPTIONS_TODAY) },
    "Ajouter un abonnement",
  ],
  [
    "editing",
    { mode: "edit", subscription: subscription() },
    "Modifier l'abonnement",
  ],
  [
    "changing the amount",
    { mode: "amount", subscription: subscription() },
    "Changer le montant · Nordlys Cloud",
  ],
];

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

it.each(SHEET_STATES)("titles the sheet after %s", async (_, state, title) => {
  renderSheet(state);

  expect(
    await screen.findByRole("dialog", { name: title }),
  ).toBeInTheDocument();
});

it.each(SHEET_STATES)(
  "closes the sheet on « Annuler » while %s",
  async (_, state) => {
    const { onOpenChange } = renderSheet(state);

    fireEvent.click(await screen.findByRole("button", { name: "Annuler" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  },
);
