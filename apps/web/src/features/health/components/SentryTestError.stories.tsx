import type { Meta, StoryObj } from "@storybook/react";
import { SentryTestError } from "./sentry-test-error";

const meta = {
  title: "Web/Health/SentryTestError",
  component: SentryTestError,
  tags: ["autodocs"],
} satisfies Meta<typeof SentryTestError>;

export default meta;
type Story = StoryObj<typeof SentryTestError>;

export const Default: Story = {};
