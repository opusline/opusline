import type { Meta, StoryObj } from "@storybook/react";

import { MoneyFormatProvider } from "@/components/money-format-provider";
import { creditNoteFixture } from "../lib/invoice-document-fixture";
import { CreditNotesPanel } from "./credit-notes-panel";

const meta = {
  title: "Web/CreditNotesPanel",
  component: CreditNotesPanel,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MoneyFormatProvider currency="EUR" dateFormat={0} locale="fr-FR">
        <div className="max-w-80">
          <Story />
        </div>
      </MoneyFormatProvider>
    ),
  ],
  args: {
    creditNotes: [creditNoteFixture],
    accountToday: "2026-08-14",
    isPending: false,
    pdfHref: () => "#",
    onRefund: () => {},
  },
} satisfies Meta<typeof CreditNotesPanel>;

export default meta;
type Story = StoryObj<typeof CreditNotesPanel>;

/** A refund still to make. */
export const ToRefund: Story = {};

/** A cancellation: nothing left to do. */
export const Cancelled: Story = {
  args: {
    creditNotes: [
      {
        ...creditNoteFixture,
        kind: 0,
        settlement: 0,
        status: 1,
        settledOn: "2026-08-10",
      },
    ],
  },
};
