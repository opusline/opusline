import type { Meta, StoryObj } from "@storybook/react";

import { quoteItem } from "../lib/quote-fixtures";
import { QuoteSummaryTiles } from "./quote-summary-tiles";

const meta = {
  title: "Web/QuoteSummaryTiles",
  component: QuoteSummaryTiles,
  tags: ["autodocs"],
  args: {
    quotes: [
      quoteItem(),
      quoteItem({ id: 2, status: 2, acceptedOn: "2026-09-20" }),
      quoteItem({ id: 3, status: 1, isExpired: true }),
    ],
  },
} satisfies Meta<typeof QuoteSummaryTiles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Nothing: Story = { args: { quotes: [] } };
