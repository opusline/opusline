import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import {
  annualDeclarations,
  cfeReturn,
  incomeTaxReturn,
} from "../lib/fixtures";
import { AnnualReturnSheet } from "./annual-return-sheet";

const meta = {
  title: "Web/Declarations/AnnualReturnSheet",
  component: AnnualReturnSheet,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    open: "incomeTax",
    annual: annualDeclarations(),
    today: "2026-08-20",
    isBusy: false,
    onOpenChange: () => {},
    onMarkDone: () => {},
    onUndo: () => {},
    onSaveCfeAmount: async () => {},
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof AnnualReturnSheet>;

export default meta;
type Story = StoryObj<typeof AnnualReturnSheet>;

/** The running year's 2042-C PRO: figures still provisional, nothing to file yet. */
export const IncomeTax: Story = {};

/** The year is over: the return can be marked filed. */
export const IncomeTaxToFile: Story = { args: { today: "2027-05-02" } };

export const IncomeTaxFiled: Story = {
  args: {
    today: "2027-05-10",
    annual: annualDeclarations({
      incomeTaxReturn: incomeTaxReturn({
        completion: { declaredOn: "2027-05-02", paidOn: null },
      }),
    }),
  },
};

/** The CFE: the estimate, the twelfths set aside, the avis to enter. */
export const Cfe: Story = { args: { open: "cfe" } };

export const CfePaid: Story = {
  args: {
    open: "cfe",
    annual: annualDeclarations({
      cfe: cfeReturn({
        expected: { amount: 34_000, currency: "EUR" },
        isEstimate: false,
        provisioned: null,
        gap: null,
        monthsProvisioned: 12,
        completion: { declaredOn: "2026-12-10", paidOn: "2026-12-10" },
      }),
    }),
  },
};
