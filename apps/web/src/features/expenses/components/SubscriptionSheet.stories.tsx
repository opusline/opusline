import type { Meta, StoryObj } from "@storybook/react";

import { emptySubscriptionDraft } from "../lib/subscription-draft";
import { annualSubscription, subscription } from "../lib/subscription-fixtures";
import { SubscriptionSheet } from "./subscription-sheet";

const meta = {
  title: "Web/Expenses/SubscriptionSheet",
  component: SubscriptionSheet,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    state: { mode: "create", initial: emptySubscriptionDraft("2026-09-12") },
    isVatLiable: true,
    today: "2026-09-12",
    isSaving: false,
    error: null,
    fieldErrors: null,
    onOpenChange: () => {},
    onSubmit: () => {},
    onSubmitAmount: () => {},
  },
} satisfies Meta<typeof SubscriptionSheet>;

export default meta;
type Story = StoryObj<typeof SubscriptionSheet>;

/** « Ajouter un abonnement »: supplier, HT amount, TVA regime, rhythm, the two switches. */
export const Create: Story = {};

export const Edit: Story = {
  args: { state: { mode: "edit", subscription: annualSubscription() } },
};

/** « Changer le montant »: only the price and the day it starts. */
export const ChangeAmount: Story = {
  args: { state: { mode: "amount", subscription: subscription() } },
};

export const Franchise: Story = { args: { isVatLiable: false } };

export const ServerError: Story = {
  args: {
    state: { mode: "edit", subscription: subscription() },
    error:
      "L'abonnement n'a pas pu être mis à jour. Réessayez dans un instant.",
    fieldErrors: { debitDay: { message: "Indiquez un jour entre 1 et 31." } },
  },
};
