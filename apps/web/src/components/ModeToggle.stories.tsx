import type { Meta, StoryObj } from "@storybook/react";
import { ModeToggle } from "./mode-toggle";
import { ThemeProvider } from "./theme-provider";

const meta = {
  title: "Web/ModeToggle",
  component: ModeToggle,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider storageKey="storybook-theme">
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ModeToggle>;

export default meta;
type Story = StoryObj<typeof ModeToggle>;

export const Default: Story = {};
