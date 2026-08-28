import type { Meta, StoryObj } from "@storybook/react";

import { eur } from "@/test/fixtures";

import { urssafDeclaration } from "../lib/fixtures";
import { UrssafDeclarationCard } from "./urssaf-declaration-card";

const meta = {
  title: "Web/Declarations/UrssafDeclarationCard",
  component: UrssafDeclarationCard,
  tags: ["autodocs"],
  args: {
    urssaf: urssafDeclaration(),
  },
} satisfies Meta<typeof UrssafDeclarationCard>;

export default meta;
type Story = StoryObj<typeof UrssafDeclarationCard>;

export const Default: Story = {};

export const Quarterly: Story = {
  args: {
    urssaf: urssafDeclaration({ period: "2026-Q2", periodicity: 1 }),
  },
};

export const QuietMonth: Story = {
  args: {
    urssaf: urssafDeclaration({ base: eur(0) }),
  },
};
