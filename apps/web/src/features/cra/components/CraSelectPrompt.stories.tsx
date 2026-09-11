import type { Meta, StoryObj } from "@storybook/react";

import { CraSelectPrompt } from "./cra-select-prompt";

const meta = {
  title: "Web/Cra/CraSelectPrompt",
  component: CraSelectPrompt,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-2xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CraSelectPrompt>;

export default meta;
type Story = StoryObj<typeof CraSelectPrompt>;

export const NothingOpenYet: Story = {};
