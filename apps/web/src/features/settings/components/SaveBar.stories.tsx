import { Button } from "@opusline/ui/components/button";
import type { Meta, StoryObj } from "@storybook/react";

import { SaveBar } from "./save-bar";

const meta = {
  title: "Web/SaveBar",
  component: SaveBar,
  tags: ["autodocs"],
} satisfies Meta<typeof SaveBar>;

export default meta;
type Story = StoryObj<typeof SaveBar>;

export const Default: Story = {
  args: {
    label: "2 modifications non enregistrées",
    isSaving: false,
    onCancel: () => {},
    children: <Button size="xl">Enregistrer</Button>,
  },
};

export const Saving: Story = {
  args: {
    label: "1 modification non enregistrée",
    isSaving: true,
    onCancel: () => {},
    children: (
      <Button disabled size="xl">
        Enregistrement…
      </Button>
    ),
  },
};
