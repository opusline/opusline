import type { Meta, StoryObj } from "@storybook/react";

import { Fact } from "./invoice-fact";

const meta = {
  title: "Web/Invoices/Fact",
  component: Fact,
  tags: ["autodocs"],
  render: (args) => (
    <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
      <Fact {...args} />
    </dl>
  ),
} satisfies Meta<typeof Fact>;

export default meta;
type Story = StoryObj<typeof Fact>;

export const Figure: Story = {
  args: { label: "Montant HT", value: "1 650,00 €" },
};

export const Text: Story = {
  args: { label: "Client", value: "HartPrint", tone: "text" },
};

export const FactList: Story = {
  render: () => (
    <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
      <Fact label="Client" value="HartPrint" tone="text" />
      <Fact label="Mission" value="Refonte catalogue" tone="text" />
      <Fact label="Période" value="01/06/2026 – 30/06/2026" />
      <Fact label="Montant HT" value="1 650,00 €" />
      <Fact label="TVA 20 %" value="330,00 €" />
      <Fact label="Total TTC" value="1 980,00 €" />
    </dl>
  ),
};
