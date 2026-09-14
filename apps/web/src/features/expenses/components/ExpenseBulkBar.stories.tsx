import type { Meta, StoryObj } from "@storybook/react";

import { ExpenseBulkBar } from "./expense-bulk-bar";

const meta = {
  title: "Web/Expenses/ExpenseBulkBar",
  component: ExpenseBulkBar,
  tags: ["autodocs"],
  args: {
    count: 3,
    canDefer: true,
    isBusy: false,
    onRecategorize: () => {},
    onDefer: () => {},
    onLinkReceipt: () => {},
    onClear: () => {},
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-12 w-2xl items-center gap-2 rounded-md border bg-card px-3 py-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExpenseBulkBar>;

export default meta;
type Story = StoryObj<typeof ExpenseBulkBar>;

/** Takes the chips' place while rows are selected. */
export const Default: Story = {};

/** Only reverse-charged or exempt rows selected: nothing to defer. */
export const NothingToDefer: Story = { args: { canDefer: false, count: 1 } };

export const Busy: Story = { args: { isBusy: true } };
