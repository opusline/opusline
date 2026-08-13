import type { Meta, StoryObj } from "@storybook/react";

import { craDetail, DEMO_SETTINGS } from "../lib/fixtures";
import { CraReviewPanel } from "./cra-review-panel";

const meta = {
  title: "Web/Cra/CraReviewPanel",
  component: CraReviewPanel,
  tags: ["autodocs"],
  args: { detail: craDetail(), settings: DEMO_SETTINGS },
  decorators: [
    (Story) => (
      <div className="max-w-xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CraReviewPanel>;

export default meta;
type Story = StoryObj<typeof CraReviewPanel>;

export const AllClear: Story = {};

export const WithAnEcart: Story = {
  args: { detail: craDetail({ differenceDays: 0.5, dirty: true }) },
};

export const WithoutASignature: Story = {
  args: { settings: { ...DEMO_SETTINGS, hasSignature: false } },
};
