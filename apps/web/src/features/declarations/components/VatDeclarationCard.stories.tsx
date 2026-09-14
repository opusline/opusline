import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import {
  creditCarriedVatDeclaration,
  creditVatDeclaration,
  vatDeclaration,
} from "../lib/fixtures";
import { VatDeclarationCard } from "./vat-declaration-card";

const meta = {
  title: "Web/Declarations/VatDeclarationCard",
  component: VatDeclarationCard,
  tags: ["autodocs"],
  args: {
    vat: vatDeclaration(),
    isBusy: false,
    onMarkFiled: () => {},
    onMarkPaid: () => {},
    onUndo: () => {},
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="max-w-lg">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof VatDeclarationCard>;

export default meta;
type Story = StoryObj<typeof VatDeclarationCard>;

/** Every box of the 3310-CA3 with a copy button, « Tout copier » above. */
export const Default: Story = {};

/** Deductions above the collected TVA: box 25 appears, box 32 goes quiet. */
export const CreditMonth: Story = { args: { vat: creditVatDeclaration() } };

/** Last month's credit lands in box 22 and lowers the tax to pay. */
export const CreditCarried: Story = {
  args: { vat: creditCarriedVatDeclaration() },
};

/** Billed at a reduced rate: the base belongs on line 9B or 09. */
export const ReducedRate: Story = {
  args: { vat: vatDeclaration({ rateBp: 1000 }) },
};

export const Filed: Story = {
  args: {
    vat: vatDeclaration({
      completion: { declaredOn: "2026-08-09", paidOn: null },
    }),
  },
};
