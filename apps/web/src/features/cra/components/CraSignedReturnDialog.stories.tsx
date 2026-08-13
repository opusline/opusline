import type { Meta, StoryObj } from "@storybook/react";

import { craDetail } from "../lib/fixtures";
import { CraSignedReturnDialog } from "./cra-signed-return-dialog";

const meta = {
  title: "Web/Cra/CraSignedReturnDialog",
  component: CraSignedReturnDialog,
  tags: ["autodocs"],
  args: {
    detail: craDetail({ status: 1, sentOn: "2026-08-01", editable: false }),
    error: null,
    isPending: false,
    onOpenChange: () => undefined,
    onUpload: () => undefined,
    open: true,
  },
} satisfies Meta<typeof CraSignedReturnDialog>;

export default meta;
type Story = StoryObj<typeof CraSignedReturnDialog>;

export const Default: Story = {};

export const Failed: Story = {
  args: { error: "Le retour signé n'a pas pu être enregistré." },
};
