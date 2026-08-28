import type { Meta, StoryObj } from "@storybook/react";

import { declarationsData } from "../lib/fixtures";
import { DeclarationsPage } from "./declarations-page";

const meta = {
  title: "Web/Declarations/DeclarationsPage",
  component: DeclarationsPage,
  tags: ["autodocs"],
  args: {
    data: declarationsData(),
  },
} satisfies Meta<typeof DeclarationsPage>;

export default meta;
type Story = StoryObj<typeof DeclarationsPage>;

export const Default: Story = {};

export const FranchiseEnBase: Story = {
  args: {
    data: declarationsData({ vat: null }),
  },
};
