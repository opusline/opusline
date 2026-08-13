import type { Meta, StoryObj } from "@storybook/react";

import { ModeToggle } from "./mode-toggle";

const meta = {
  title: "Web/ModeToggle",
  component: ModeToggle,
  tags: ["autodocs"],
  args: { onChange: () => {} },
} satisfies Meta<typeof ModeToggle>;

export default meta;
type Story = StoryObj<typeof ModeToggle>;

export const Dark: Story = {
  args: { resolvedTheme: "dark" },
};

export const Light: Story = {
  args: { resolvedTheme: "light" },
};
