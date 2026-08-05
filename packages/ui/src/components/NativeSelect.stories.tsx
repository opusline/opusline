import type { Meta, StoryObj } from "@storybook/react";
import { NativeSelect } from "./native-select";

const meta = {
  title: "UI/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof NativeSelect>;

export const Default: Story = {
  args: {
    "aria-label": "Type de document",
    defaultValue: "0",
    children: (
      <>
        <option value="0">Contrat</option>
        <option value="1">Devis</option>
        <option value="2">CRA signé</option>
        <option value="3">Facture reçue</option>
        <option value="4">Autre</option>
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    ...Default.args,
    size: "sm",
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};
