import type { Meta, StoryObj } from "@storybook/react";

import { subscriptionsData } from "../lib/subscription-fixtures";
import { SubscriptionKpiTiles } from "./subscription-kpi-tiles";

const meta = {
  title: "Web/Expenses/SubscriptionKpiTiles",
  component: SubscriptionKpiTiles,
  tags: ["autodocs"],
  args: { kpis: subscriptionsData().kpis },
} satisfies Meta<typeof SubscriptionKpiTiles>;

export default meta;
type Story = StoryObj<typeof SubscriptionKpiTiles>;

export const Default: Story = {};

export const NothingMissing: Story = {
  args: { kpis: { ...subscriptionsData().kpis, missingReceipts: 0 } },
};
