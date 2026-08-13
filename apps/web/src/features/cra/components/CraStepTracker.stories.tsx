import type { Meta, StoryObj } from "@storybook/react";

import { craDetail } from "../lib/fixtures";
import { CraStepTracker } from "./cra-step-tracker";

const meta = {
  title: "Web/Cra/CraStepTracker",
  component: CraStepTracker,
  tags: ["autodocs"],
  args: {
    cra: craDetail().cra,
    current: "days",
    onGo: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CraStepTracker>;

export default meta;
type Story = StoryObj<typeof CraStepTracker>;

export const Days: Story = {};
export const Review: Story = { args: { current: "review" } };
export const Document: Story = { args: { current: "document" } };

export const WithAnEcart: Story = {
  args: {
    cra: craDetail({ dirty: true, differenceDays: 0.5 }).cra,
    current: "review",
  },
};
