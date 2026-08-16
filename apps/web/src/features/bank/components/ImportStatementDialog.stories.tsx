import type { Meta, StoryObj } from "@storybook/react";

import { ImportStatementDialog } from "./import-statement-dialog";

const meta = {
  title: "Web/Bank/ImportStatementDialog",
  component: ImportStatementDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    isSaving: false,
    error: null,
    onOpenChange: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof ImportStatementDialog>;

export default meta;
type Story = StoryObj<typeof ImportStatementDialog>;

export const Open: Story = {};

export const Analysing: Story = {
  args: { isSaving: true },
};

export const Failed: Story = {
  args: { error: "Ce fichier n'a pas pu être lu comme un relevé bancaire." },
};
