import type { Meta, StoryObj } from "@storybook/react";

import { SwitchRow } from "./switch-row";

const meta = {
  title: "Web/SwitchRow",
  component: SwitchRow,
  tags: ["autodocs"],
  args: {
    label: "Afficher l'IBAN et le BIC sur la facture",
    checked: true,
    onChange: () => {},
    testId: "switch-row",
  },
} satisfies Meta<typeof SwitchRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const On: Story = {};

export const Off: Story = { args: { checked: false } };
