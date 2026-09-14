import type { Meta, StoryObj } from "@storybook/react";

import { subscription } from "../lib/subscription-fixtures";
import { DeleteSubscriptionDialog } from "./delete-subscription-dialog";

const meta = {
  title: "Web/Expenses/DeleteSubscriptionDialog",
  component: DeleteSubscriptionDialog,
  tags: ["autodocs"],
  args: {
    subscription: subscription(),
    isDeleting: false,
    onOpenChange: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof DeleteSubscriptionDialog>;

export default meta;
type Story = StoryObj<typeof DeleteSubscriptionDialog>;

export const Default: Story = {};
