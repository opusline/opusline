import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PaymentTermsPicker } from "./payment-terms-picker";

const meta = {
  title: "Web/PaymentTermsPicker",
  component: PaymentTermsPicker,
  tags: ["autodocs"],
} satisfies Meta<typeof PaymentTermsPicker>;

export default meta;
type Story = StoryObj<typeof PaymentTermsPicker>;

function ControlledExample({ initial }: { initial: number }) {
  const [days, setDays] = useState(initial);

  return <PaymentTermsPicker onChange={setDays} value={days} />;
}

export const Default: Story = {
  render: () => <ControlledExample initial={45} />,
};

export const CustomTerm: Story = {
  render: () => <ControlledExample initial={90} />,
};

export const CustomValue: Story = {
  args: { value: 90, onChange: () => {} },
};
