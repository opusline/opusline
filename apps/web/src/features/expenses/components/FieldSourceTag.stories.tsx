import type { Meta, StoryObj } from "@storybook/react";

import { FieldSourceTag } from "./field-source-tag";

const meta = {
  title: "Web/Expenses/FieldSourceTag",
  component: FieldSourceTag,
  tags: ["autodocs"],
  args: { source: "read" },
  decorators: [
    (Story) => (
      <span className="text-foreground-3 text-sm">
        Fournisseur
        <Story />
      </span>
    ),
  ],
} satisfies Meta<typeof FieldSourceTag>;

export default meta;
type Story = StoryObj<typeof FieldSourceTag>;

export const Read: Story = {};

export const Suggested: Story = { args: { source: "suggested" } };
