import type { Meta, StoryObj } from "@storybook/react";

import { eur } from "@/test/fixtures";

import { vatDeclaration } from "../lib/fixtures";
import { VatDeclarationCard } from "./vat-declaration-card";

const meta = {
  title: "Web/Declarations/VatDeclarationCard",
  component: VatDeclarationCard,
  tags: ["autodocs"],
  args: {
    vat: vatDeclaration(),
  },
} satisfies Meta<typeof VatDeclarationCard>;

export default meta;
type Story = StoryObj<typeof VatDeclarationCard>;

export const Default: Story = {};

export const ReducedRate: Story = {
  args: {
    vat: vatDeclaration({ rateBp: 1000 }),
  },
};

export const MixedRates: Story = {
  args: {
    vat: vatDeclaration({ rateBp: null }),
  },
};

export const QuietMonth: Story = {
  args: {
    vat: vatDeclaration({ salesHt: eur(0), collected: eur(0) }),
  },
};
