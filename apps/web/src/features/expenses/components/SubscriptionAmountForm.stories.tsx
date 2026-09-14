import type { Meta, StoryObj } from "@storybook/react";

import {
  annualSubscription,
  reverseChargedSubscription,
  subscription,
} from "../lib/subscription-fixtures";
import { SubscriptionAmountForm } from "./subscription-amount-form";

const meta = {
  title: "Web/Expenses/SubscriptionAmountForm",
  component: SubscriptionAmountForm,
  tags: ["autodocs"],
  args: {
    subscription: subscription(),
    initial: { ht: "26", effectiveFrom: "2026-09-01" },
    isVatLiable: true,
    isSaving: false,
    error: null,
    fieldErrors: null,
    onSubmit: () => {},
    onCancel: () => {},
  },
} satisfies Meta<typeof SubscriptionAmountForm>;

export default meta;
type Story = StoryObj<typeof SubscriptionAmountForm>;

/** A monthly price going up: the calc box prices the year at the new amount. */
export const Default: Story = {};

/** The row's own régime decides the split — here autoliquidation at 70 % pro. */
export const ReverseCharged: Story = {
  args: {
    subscription: reverseChargedSubscription(),
    initial: { ht: "26,50", effectiveFrom: "2026-09-12" },
  },
};

/** Once a year, so « Par an » is the amount itself rather than twelve of it. */
export const Annual: Story = {
  args: {
    subscription: annualSubscription(),
    initial: { ht: "324", effectiveFrom: "2027-01-15" },
  },
};

/** Franchise en base: no TVA line, so the box shows the amount alone. */
export const NotVatLiable: Story = {
  args: { isVatLiable: false },
};

export const WithServerErrors: Story = {
  args: {
    initial: { ht: "", effectiveFrom: "2026-09-01" },
    error: "L'enregistrement a échoué. Réessayez dans un instant.",
    fieldErrors: {
      "amountHt.amount": { message: "Le montant doit être supérieur à 0." },
      effectiveFrom: { message: "La date doit suivre le dernier changement." },
    },
  },
};
