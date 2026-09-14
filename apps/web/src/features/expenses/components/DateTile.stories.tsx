import type { Meta, StoryObj } from "@storybook/react";

import { DateTile } from "./date-tile";

const meta = {
  title: "Web/Expenses/DateTile",
  component: DateTile,
  tags: ["autodocs"],
  args: { date: "2026-08-21" },
} satisfies Meta<typeof DateTile>;

export default meta;
type Story = StoryObj<typeof DateTile>;

export const Default: Story = {};

export const Small: Story = { args: { size: "sm" } };
