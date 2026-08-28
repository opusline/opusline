import type { Meta, StoryObj } from "@storybook/react";

import { CopyButton } from "./copy-button";

const meta = {
  title: "UI/CopyButton",
  component: CopyButton,
  tags: ["autodocs"],
  args: {
    value: "10450",
    label: "Copier",
    copiedLabel: "Copié",
    failedLabel: "Échec de la copie",
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {};

export const Icon: Story = {
  args: {
    size: "icon",
    "aria-label": "Copier la valeur",
  },
};
