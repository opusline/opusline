import type { Meta, StoryObj } from "@storybook/react";

import { MissionStatusBadge } from "./mission-status-badge";

const meta = {
  title: "Web/MissionStatusBadge",
  component: MissionStatusBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof MissionStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = { args: { status: 0, clientType: 0 } };

export const Paused: Story = { args: { status: 1, clientType: 0 } };

export const Finished: Story = { args: { status: 2, clientType: 0 } };

export const InternalClient: Story = { args: { status: 0, clientType: 2 } };
