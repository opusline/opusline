import type { Meta, StoryObj } from "@storybook/react";

import { NoteSuggestions } from "./note-suggestions";

const meta = {
  title: "Web/Week/NoteSuggestions",
  component: NoteSuggestions,
  tags: ["autodocs"],
  args: {
    onPick: () => {},
    suggestions: ["Revue PR", "Cadrage V2", "Rétro + backlog"],
  },
  decorators: [
    (Story) => (
      <div className="w-70 rounded-md bg-popover p-2.5 ring-1 ring-foreground/10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NoteSuggestions>;

export default meta;
type Story = StoryObj<typeof NoteSuggestions>;

export const Default: Story = {};

/** Nothing matches what the user typed, so the list renders nothing at all. */
export const NoSuggestions: Story = {
  args: { suggestions: [] },
};

/** Inside a popover, picking must not blur the input the suggestion feeds. */
export const KeepsFocus: Story = {
  args: { keepFocus: true },
};
