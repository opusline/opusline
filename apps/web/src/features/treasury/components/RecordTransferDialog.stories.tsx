import type { Meta, StoryObj } from "@storybook/react";

import { RecordTransferDialog } from "./record-transfer-dialog";

const meta = {
  title: "Web/Treasury/RecordTransferDialog",
  component: RecordTransferDialog,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    accountToday: "2026-08-13",
    coveredThrough: "2026-08-10",
    transferableCents: 851_300,
    isSaving: false,
    error: null,
    onOpenChange: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof RecordTransferDialog>;

export default meta;
type Story = StoryObj<typeof RecordTransferDialog>;

export const Default: Story = {};

export const Saving: Story = {
  args: { isSaving: true },
};

export const WithError: Story = {
  args: { error: "Le virement n'a pas pu être enregistré." },
};

/** Nothing safe to take: the field opens empty rather than seeded with a debt. */
export const NothingTransferable: Story = {
  args: { transferableCents: -588_700 },
};
