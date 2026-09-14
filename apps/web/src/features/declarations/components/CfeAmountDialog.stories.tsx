import type { Meta, StoryObj } from "@storybook/react";

import { CfeAmountDialog } from "./cfe-amount-dialog";

const meta = {
  title: "Web/Declarations/CfeAmountDialog",
  component: CfeAmountDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    initialCents: null,
    onOpenChange: () => {},
    onSave: async () => {},
  },
} satisfies Meta<typeof CfeAmountDialog>;

export default meta;
type Story = StoryObj<typeof CfeAmountDialog>;

export const Default: Story = {};

export const Prefilled: Story = { args: { initialCents: 31_200 } };
