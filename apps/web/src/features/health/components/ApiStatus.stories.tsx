import type { Meta, StoryObj } from "@storybook/react";
import { ApiStatus } from "./api-status";

const meta = {
  title: "Web/Health/ApiStatus",
  component: ApiStatus,
  tags: ["autodocs"],
} satisfies Meta<typeof ApiStatus>;

export default meta;
type Story = StoryObj<typeof ApiStatus>;

export const Healthy: Story = {
  args: {
    status: "ok",
  },
};

export const Degraded: Story = {
  args: {
    status: "degraded",
  },
};

/** The ping never came back — the state the page exists to be able to show. */
export const Unreachable: Story = {
  args: {
    status: null,
  },
};
