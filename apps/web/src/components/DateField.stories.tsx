import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { DateField } from "./date-field";

function Example(props: {
  value?: string;
  min?: string;
  max?: string;
  size?: "sm" | "default";
}) {
  const [value, setValue] = useState(props.value ?? "");

  return (
    <div className="w-64">
      <DateField
        max={props.max}
        min={props.min}
        onChange={setValue}
        size={props.size}
        value={value}
      />
    </div>
  );
}

const meta = {
  title: "Web/DateField",
  component: DateField,
  tags: ["autodocs"],
  args: { value: "2026-08-21", onChange: () => {} },
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof DateField>;

export const Default: Story = {
  render: () => <Example value="2026-08-21" />,
};

export const Empty: Story = {
  render: () => <Example />,
};

/** Days outside the window are greyed out, and typing one is refused too. */
export const Bounded: Story = {
  render: () => (
    <Example max="2026-08-21" min="2026-08-01" value="2026-08-10" />
  ),
};

export const Small: Story = {
  args: { size: "sm" },
  render: (args) => <Example size={args.size} value="2026-08-21" />,
};

export const Disabled: Story = {
  args: { disabled: true },
};
