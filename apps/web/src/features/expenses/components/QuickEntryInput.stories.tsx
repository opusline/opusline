import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { QuickEntryInput } from "./quick-entry-input";

function Controlled() {
  const [value, setValue] = useState("");

  return <QuickEntryInput onChange={setValue} value={value} />;
}

const meta = {
  title: "Web/Expenses/QuickEntryInput",
  component: QuickEntryInput,
  tags: ["autodocs"],
  args: { value: "", onChange: () => {} },
  decorators: [
    (Story) => (
      <div className="w-105">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof QuickEntryInput>;

export default meta;
type Story = StoryObj<typeof QuickEntryInput>;

export const Default: Story = { render: () => <Controlled /> };

export const Filled: Story = { args: { value: "lunaprint 429 écran 20%" } };
