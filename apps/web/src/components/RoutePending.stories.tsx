import type { Meta, StoryObj } from "@storybook/react";

import { RoutePending } from "./route-pending";

const meta = {
  title: "Web/RoutePending",
  component: RoutePending,
  tags: ["autodocs"],
} satisfies Meta<typeof RoutePending>;

export default meta;
type Story = StoryObj<typeof RoutePending>;

export const Default: Story = {};
