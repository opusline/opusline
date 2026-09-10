import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { MonthField } from "./month-field";

function Example(props: { value?: string; defaultMonth?: string }) {
  const [value, setValue] = useState(props.value ?? "");

  return (
    <div className="w-64">
      <MonthField
        defaultMonth={props.defaultMonth}
        onChange={setValue}
        value={value}
      />
    </div>
  );
}

const meta = {
  title: "Web/MonthField",
  component: MonthField,
  tags: ["autodocs"],
  args: { value: "2026-08", onChange: () => {} },
} satisfies Meta<typeof MonthField>;

export default meta;
type Story = StoryObj<typeof MonthField>;

export const Default: Story = {
  render: () => <Example value="2026-08" />,
};

/** Nothing picked yet: the grid still has to open somewhere. */
export const Empty: Story = {
  render: () => <Example defaultMonth="2026-08" />,
};

export const Disabled: Story = {
  args: { disabled: true },
};
