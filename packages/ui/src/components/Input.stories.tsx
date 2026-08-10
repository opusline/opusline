import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "theo@marchand.dev",
    type: "email",
  },
};

export const Mono: Story = {
  args: {
    font: "mono",
    placeholder: "123 456 789 00012",
  },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "pas-un-email",
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: "Champ verrouillé",
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    placeholder: "Contrat Nordlys",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    font: "mono",
    placeholder: "1 · 0,5 · 2h",
    size: "lg",
  },
};
