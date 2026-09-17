import type { Meta, StoryObj } from "@storybook/react";

import { ConfirmDeleteDialog } from "./confirm-delete-dialog";

const meta = {
  title: "UI/ConfirmDeleteDialog",
  component: ConfirmDeleteDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    title: "Delete this client?",
    description:
      "Orvella Studio will be removed for good. Its documents go with it.",
    confirmLabel: "Delete the client",
    cancelLabel: "Cancel",
    isDeleting: false,
    onOpenChange: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof ConfirmDeleteDialog>;

export default meta;
type Story = StoryObj<typeof ConfirmDeleteDialog>;

export const Default: Story = {};

export const Deleting: Story = { args: { isDeleting: true } };
