import type { Meta, StoryObj } from "@storybook/react";
import { eur } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";

import { liberatingPaymentOutlook } from "../lib/fixtures";
import { LiberatingPaymentNotice } from "./liberating-payment-notice";

const meta = {
  title: "Web/Declarations/LiberatingPaymentNotice",
  component: LiberatingPaymentNotice,
  tags: ["autodocs"],
  args: { outlook: liberatingPaymentOutlook(), today: "2026-09-17" },
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof LiberatingPaymentNotice>;

export default meta;
type Story = StoryObj<typeof LiberatingPaymentNotice>;

/** The 2025 avis is over the limit for one part: the option stops on 1 January 2027. */
export const EndsWithIncome: Story = {};

/** A couple with a child in shared custody: the limit reads for two and a quarter parts. */
export const EndsWithIncomeForSeveralParts: Story = {
  args: {
    outlook: liberatingPaymentOutlook({
      referenceTaxIncome: eur(6_850_000),
      referenceTaxIncomeLimit: eur(6_655_275),
      taxHouseholdQuarterParts: 9,
    }),
  },
};

/** Two years over the micro-BNC ceiling ended the régime this January already. */
export const EndedWithCeiling: Story = {
  args: {
    outlook: liberatingPaymentOutlook({
      endsOn: "2026-01-01",
      reason: 1,
      referenceTaxIncome: null,
      referenceTaxIncomeYear: null,
      referenceTaxIncomeLimit: null,
      taxHouseholdQuarterParts: null,
      ceiling: eur(7_770_000),
    }),
  },
};

/** Nothing in sight, but no avis figures either: the one quiet nudge. */
export const NeedsIncome: Story = {
  args: {
    outlook: liberatingPaymentOutlook({
      endsOn: null,
      reason: null,
      referenceTaxIncome: null,
      referenceTaxIncomeYear: null,
      referenceTaxIncomeLimit: null,
      taxHouseholdQuarterParts: null,
      needsReferenceTaxIncome: true,
    }),
  },
};
