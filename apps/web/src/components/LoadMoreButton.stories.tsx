import type { Meta, StoryObj } from "@storybook/react";

import { LoadMoreButton } from "./load-more-button";

const meta = {
  title: "Web/LoadMoreButton",
  component: LoadMoreButton,
  tags: ["autodocs"],
} satisfies Meta<typeof LoadMoreButton>;

export default meta;
type Story = StoryObj<typeof LoadMoreButton>;

export const Default: Story = {
  args: {
    label: "Afficher les mouvements plus anciens",
    isLoading: false,
    onClick: () => {},
  },
};

export const Loading: Story = {
  args: { ...Default.args, isLoading: true },
};
