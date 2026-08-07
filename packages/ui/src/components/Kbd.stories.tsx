import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Kbd } from "./kbd";

const meta = {
  title: "UI/Kbd",
  component: Kbd,
  tags: ["autodocs"],
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  args: {
    children: "N",
  },
};

export const InsideAButton: Story = {
  render: () => (
    <Button size="xl">
      Nouvelle entrée
      <Kbd>N</Kbd>
    </Button>
  ),
};
