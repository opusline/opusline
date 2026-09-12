import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { ProShareField } from "./pro-share-field";

function Controlled({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);

  return <ProShareField onChange={setValue} value={value} />;
}

const meta = {
  title: "Web/Expenses/ProShareField",
  component: ProShareField,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-105">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProShareField>;

export default meta;
type Story = StoryObj<typeof ProShareField>;

export const Default: Story = { render: () => <Controlled initial="100" /> };

/** A share off the presets keeps the chips unpressed. */
export const Custom: Story = { render: () => <Controlled initial="80" /> };

export const Unreadable: Story = {
  render: () => (
    <ProShareField
      error="Indiquez une part entre 0 et 100."
      onChange={() => {}}
      value="7O"
    />
  ),
};
