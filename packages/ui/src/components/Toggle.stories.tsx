import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./toggle";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    children: "CRA mensuel requis",
  },
};

export const Pressed: Story = {
  args: {
    children: "CRA mensuel requis",
    defaultPressed: true,
  },
};

export const Outline: Story = {
  args: {
    children: "0,5 j",
    variant: "outline",
  },
};
