import type { Meta, StoryObj } from "@storybook/react";

import { ConfirmDeleteDialog } from "./confirm-delete-dialog";

const meta = {
  title: "Web/ConfirmDeleteDialog",
  component: ConfirmDeleteDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    title: "Delete this client?",
    description:
      "Orvella Studio will be removed for good. Its documents go with it.",
    confirmLabel: "Delete the client",
    isDeleting: false,
    onOpenChange: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof ConfirmDeleteDialog>;

export default meta;
type Story = StoryObj<typeof ConfirmDeleteDialog>;

export const Default: Story = {};

export const Deleting: Story = { args: { isDeleting: true } };
