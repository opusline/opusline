import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { ReceiptField } from "./receipt-field";

function Controlled({ storedFileName }: { storedFileName?: string | null }) {
  const [value, setValue] = useState<File | null>(null);

  return (
    <ReceiptField
      onChange={setValue}
      storedFileName={storedFileName}
      value={value}
    />
  );
}

const meta = {
  title: "Web/Expenses/ReceiptField",
  component: ReceiptField,
  tags: ["autodocs"],
  args: { value: null, onChange: () => {} },
  decorators: [
    (Story) => (
      <div className="w-105">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReceiptField>;

export default meta;
type Story = StoryObj<typeof ReceiptField>;

export const Empty: Story = { render: () => <Controlled /> };

export const Picked: Story = {
  args: { value: new File(["%PDF-1.4"], "lunaprint-facture-9921.pdf") },
};

/** Editing a row that already has its receipt: shown, not removable from here. */
export const Stored: Story = {
  render: () => <Controlled storedFileName="callisto-aout.pdf" />,
};

export const Rejected: Story = {
  args: { value: new File(["x"], "releve.csv") },
};
