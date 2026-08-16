import type { Meta, StoryObj } from "@storybook/react";

import { BankHeader } from "./bank-header";

const meta = {
  title: "Web/Bank/BankHeader",
  component: BankHeader,
  tags: ["autodocs"],
  args: {
    onImport: () => {},
  },
} satisfies Meta<typeof BankHeader>;

export default meta;
type Story = StoryObj<typeof BankHeader>;

export const Default: Story = {};
