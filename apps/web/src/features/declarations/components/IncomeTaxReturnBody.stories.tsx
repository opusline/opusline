import type { Meta, StoryObj } from "@storybook/react";

import { incomeTaxReturn } from "../lib/fixtures";
import { IncomeTaxReturnBody } from "./income-tax-return-body";

const meta = {
  title: "Web/Declarations/IncomeTaxReturnBody",
  component: IncomeTaxReturnBody,
  tags: ["autodocs"],
  args: { incomeTaxReturn: incomeTaxReturn(), today: "2026-08-20" },
  decorators: [
    (Story) => (
      <div className="flex max-w-xl flex-col gap-3.5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IncomeTaxReturnBody>;

export default meta;
type Story = StoryObj<typeof IncomeTaxReturnBody>;

export const Default: Story = {};

/** Without the versement libératoire the receipts go in box 5HQ. */
export const WithoutOption: Story = {
  args: {
    incomeTaxReturn: incomeTaxReturn({ box: 1, liberatingPaymentPaid: null }),
  },
};

/** A quarterly account reconciles four declarations. */
export const Quarterly: Story = {
  args: {
    incomeTaxReturn: incomeTaxReturn({
      periods: [
        {
          period: "2026-Q1",
          base: { amount: 2_625_000, currency: "EUR" },
          declaredOn: "2026-04-30",
        },
        {
          period: "2026-Q2",
          base: { amount: 3_080_000, currency: "EUR" },
          declaredOn: "2026-07-31",
        },
        {
          period: "2026-Q3",
          base: { amount: 975_000, currency: "EUR" },
          declaredOn: null,
        },
        {
          period: "2026-Q4",
          base: { amount: 0, currency: "EUR" },
          declaredOn: null,
        },
      ],
    }),
    today: "2026-10-20",
  },
};
