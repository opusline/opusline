import type { Meta, StoryObj } from "@storybook/react";

import {
  emptySubscriptionDraft,
  type SubscriptionDraft,
} from "../lib/subscription-draft";
import { SUBSCRIPTIONS_TODAY } from "../lib/subscription-fixtures";
import { vatChoiceTerms } from "../lib/vat";
import { SubscriptionForm } from "./subscription-form";

function draft(overrides: Partial<SubscriptionDraft> = {}): SubscriptionDraft {
  return {
    ...emptySubscriptionDraft(SUBSCRIPTIONS_TODAY),
    supplier: "Nordlys Cloud",
    description: "VPS + domaine",
    category: 5,
    ht: "24",
    debitDay: "1",
    startedOn: "2025-03-01",
    customerSpaceUrl: "https://espace.nordlys.example",
    ...overrides,
  };
}

const meta = {
  title: "Web/Expenses/SubscriptionForm",
  component: SubscriptionForm,
  tags: ["autodocs"],
  args: {
    initial: draft(),
    isVatLiable: true,
    isSaving: false,
    error: null,
    fieldErrors: null,
    onSubmit: () => {},
    onCancel: () => {},
  },
} satisfies Meta<typeof SubscriptionForm>;

export default meta;
type Story = StoryObj<typeof SubscriptionForm>;

/** A monthly French purchase at 20 %: the calc box splits HT, TVA and TTC. */
export const Default: Story = {};

/**
 * Autoliquidation: the supplier invoices without TVA, the account assesses it
 * on top, and the TTC stays the HT.
 */
export const ReverseCharged: Story = {
  args: {
    initial: draft({
      supplier: "Callisto Télécom",
      description: "Forfait mobile pro",
      category: 3,
      ht: "24,17",
      proShare: "70",
      vatChoice: "eu",
      vatTerms: vatChoiceTerms("eu"),
      debitDay: "12",
    }),
  },
};

/** An insurance premium: exempt, so there is no TVA line to recover. */
export const Exempt: Story = {
  args: {
    initial: draft({
      supplier: "Orvella Assurances",
      description: "RC pro",
      category: 10,
      ht: "312",
      vatChoice: "exempt",
      vatTerms: vatChoiceTerms("exempt"),
    }),
  },
};

/**
 * Annual: the debit month appears beside the day, and the provision switch
 * offers to set a twelfth aside each month.
 */
export const Annual: Story = {
  args: {
    initial: draft({
      supplier: "Orvella Assurances",
      description: "RC pro",
      category: 10,
      ht: "312",
      periodicity: 2,
      debitMonth: 1,
      debitDay: "15",
      provisionMonthly: true,
    }),
  },
};

/**
 * Under the franchise en base: no TVA anywhere, so the pro share and the régime
 * chips have nothing to decide and the sheet drops them.
 */
export const NotVatLiable: Story = {
  args: { isVatLiable: false },
};

export const WithServerErrors: Story = {
  args: {
    initial: draft({ supplier: "", ht: "" }),
    error: "L'enregistrement a échoué. Réessayez dans un instant.",
    fieldErrors: {
      supplier: { message: "Le fournisseur est obligatoire." },
      "amountHt.amount": { message: "Le montant doit être supérieur à 0." },
    },
  },
};
