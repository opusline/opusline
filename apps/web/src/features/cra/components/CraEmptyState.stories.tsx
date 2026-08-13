import type { Meta, StoryObj } from "@storybook/react";

import { CraEmptyState } from "./cra-empty-state";

const meta = {
  title: "Web/Cra/CraEmptyState",
  component: CraEmptyState,
  tags: ["autodocs"],
  args: { onGoToClients: () => undefined },
  decorators: [
    (Story) => (
      <div className="max-w-2xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CraEmptyState>;

export default meta;
type Story = StoryObj<typeof CraEmptyState>;

export const NoCraMission: Story = {};
