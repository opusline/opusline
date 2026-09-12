import type { Meta, StoryObj } from "@storybook/react";

import {
  annualDeclarations,
  cfeReturn,
  incomeTaxReturn,
} from "../lib/fixtures";
import { AnnualReturnsCard } from "./annual-returns-card";

const meta = {
  title: "Web/Declarations/AnnualReturnsCard",
  component: AnnualReturnsCard,
  tags: ["autodocs"],
  args: { annual: annualDeclarations(), onOpen: () => {} },
  decorators: [
    (Story) => (
      <div className="max-w-4xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AnnualReturnsCard>;

export default meta;
type Story = StoryObj<typeof AnnualReturnsCard>;

export const Default: Story = {};

export const Done: Story = {
  args: {
    annual: annualDeclarations({
      incomeTaxReturn: incomeTaxReturn({
        completion: { declaredOn: "2027-05-02", paidOn: null },
      }),
      cfe: cfeReturn({
        isEstimate: false,
        provisioned: null,
        gap: null,
        monthsProvisioned: 12,
        completion: { declaredOn: "2026-12-10", paidOn: "2026-12-10" },
      }),
    }),
  },
};

/** The year the business started owes no CFE yet. */
export const NoCfe: Story = {
  args: { annual: annualDeclarations({ cfe: null }) },
};
