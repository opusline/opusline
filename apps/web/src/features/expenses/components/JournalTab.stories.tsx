import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import {
  declaredExpensesMonth,
  emptyExpensesMonth,
  expensesMonth,
  franchiseExpensesMonth,
} from "../lib/fixtures";
import { JournalTab } from "./journal-tab";

const meta = {
  title: "Web/Expenses/JournalTab",
  component: JournalTab,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    month: expensesMonth(),
    unit: "ht",
    isRefreshing: false,
    uploadingExpenseId: null,
    onAttachReceipt: () => {},
    onDetachReceipt: () => {},
    onEdit: () => {},
    onDuplicate: () => {},
    onDeferVat: () => {},
    onReintegrateVat: () => {},
    onDelete: () => {},
    onRecategorize: () => {},
    onDeferSelectedVat: () => {},
    onLinkReceiptHint: () => {},
    onUndoDeclared: () => {},
    onCreateFromDebit: () => {},
    isBulkBusy: false,
    isUndoBusy: false,
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="mx-auto max-w-6xl p-6">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof JournalTab>;

export default meta;
type Story = StoryObj<typeof JournalTab>;

export const Default: Story = {};

export const Ttc: Story = {
  args: { unit: "ttc" },
};

/** The CA3 is filed: the deductions are done and every TVA row is locked. */
export const Declared: Story = {
  args: { month: declaredExpensesMonth() },
};

/** A franchise en base account: no TVA anywhere, the pill only tracks the receipt. */
export const Franchise: Story = {
  args: { month: franchiseExpensesMonth() },
};

export const Uploading: Story = {
  args: { uploadingExpenseId: 2 },
};

export const Empty: Story = {
  args: { month: emptyExpensesMonth() },
};
