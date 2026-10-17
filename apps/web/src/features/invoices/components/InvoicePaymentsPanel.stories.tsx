import type { Meta, StoryObj } from "@storybook/react";

import { MoneyFormatProvider } from "@/components/money-format-provider";
import { eur } from "@/test/fixtures";
import { InvoicePaymentsPanel } from "./invoice-payments-panel";

const meta = {
  title: "Web/InvoicePaymentsPanel",
  component: InvoicePaymentsPanel,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MoneyFormatProvider currency="EUR" dateFormat={0} locale="fr-FR">
        <div className="max-w-md">
          <Story />
        </div>
      </MoneyFormatProvider>
    ),
  ],
  args: {
    payments: [
      {
        id: 1,
        amount: eur(100_000),
        paidOn: "2026-08-10",
        bankMovementId: null,
        creditNoteId: null,
        note: null,
      },
      {
        id: 2,
        amount: eur(98_000),
        paidOn: "2026-09-02",
        bankMovementId: 55,
        creditNoteId: null,
        note: null,
      },
    ],
    isPending: false,
    onRemove: () => {},
  },
} satisfies Meta<typeof InvoicePaymentsPanel>;

export default meta;
type Story = StoryObj<typeof InvoicePaymentsPanel>;

/** Two transfers, the second matched from the bank statement. */
export const TwoPayments: Story = {};

/** Read-only, as the drawer would show it. */
export const ReadOnly: Story = {
  args: { onRemove: undefined },
};
