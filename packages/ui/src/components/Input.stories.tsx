import type { Meta, StoryObj } from "@storybook/react";
import { SearchIcon } from "lucide-react";

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

/**
 * Chrome-less, for a field that sits inside a wrapper owning the border and the focus
 * ring — the shape a search box with a leading icon takes.
 */
export const Bare: Story = {
  args: {
    placeholder: "Client, mission, mois",
    size: "sm",
    surface: "bare",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-2.5 rounded-md border px-3 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20">
        <SearchIcon
          aria-hidden
          className="size-3.5 shrink-0 text-muted-foreground-3"
        />
        <Story />
      </div>
    ),
  ],
};
