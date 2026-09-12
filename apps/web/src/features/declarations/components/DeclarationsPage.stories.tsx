import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import {
  beforeStartDeclarationsData,
  creditVatDeclaration,
  declarationsData,
  filedDeclarationsData,
} from "../lib/fixtures";
import { DeclarationsPage } from "./declarations-page";

const meta = {
  title: "Web/Declarations/DeclarationsPage",
  component: DeclarationsPage,
  tags: ["autodocs"],
  args: {
    data: declarationsData(),
    isRefreshing: false,
    pendingTarget: null,
    onPeriodChange: () => {},
    onMarkFiled: () => {},
    onMarkPaid: () => {},
    onUnmark: () => {},
    onClearPayment: () => {},
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof DeclarationsPage>;

export default meta;
type Story = StoryObj<typeof DeclarationsPage>;

/** July under réel normal: both cards, the ceiling and the last months. */
export const Default: Story = {};

export const Filed: Story = { args: { data: filedDeclarationsData() } };

/** A month whose deductions exceed the collected TVA: box 25, nothing to pay. */
export const CreditMonth: Story = {
  args: {
    data: declarationsData({
      period: "2026-08",
      previousPeriod: "2026-07",
      nextPeriod: null,
      vat: creditVatDeclaration(),
    }),
  },
};

export const FranchiseEnBase: Story = {
  args: { data: declarationsData({ vat: null }) },
};

export const BeforeStart: Story = {
  args: { data: beforeStartDeclarationsData() },
};
