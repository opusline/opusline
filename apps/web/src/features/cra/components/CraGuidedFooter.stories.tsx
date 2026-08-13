import type { Meta, StoryObj } from "@storybook/react";

import { CraGuidedFooter } from "./cra-guided-footer";

const meta = {
  title: "Web/Cra/CraGuidedFooter",
  component: CraGuidedFooter,
  tags: ["autodocs"],
  args: {
    isBusy: false,
    onAdvance: () => undefined,
    onBack: () => undefined,
    onDownload: () => undefined,
    step: "days",
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CraGuidedFooter>;

export default meta;
type Story = StoryObj<typeof CraGuidedFooter>;

export const Days: Story = {};
export const Review: Story = { args: { step: "review" } };
export const Document: Story = { args: { step: "document" } };
