import type { Meta, StoryObj } from "@storybook/react";

import type { FormSubmitResult } from "@/lib/form";
import { AnthropicCard } from "./anthropic-card";

const meta = {
  title: "Web/Settings/AnthropicCard",
  component: AnthropicCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-160">
        <Story />
      </div>
    ),
  ],
  args: {
    settings: { hasApiKey: false, model: "claude-opus-5-5" },
    isRemoving: false,
    error: null,
    onSave: async (): Promise<FormSubmitResult> => ({ status: "success" }),
    onRemove: () => {},
  },
} satisfies Meta<typeof AnthropicCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoKey: Story = {};

export const KeySaved: Story = {
  args: { settings: { hasApiKey: true, model: "claude-opus-5-5" } },
};

/** Anthropic could not be reached to check the key: nothing was saved. */
export const Unreachable: Story = {
  args: {
    error:
      "Anthropic could not be reached to check the key. Try again in a few minutes.",
  },
};
