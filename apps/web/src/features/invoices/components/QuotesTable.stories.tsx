import type { Meta, StoryObj } from "@storybook/react";

import { quoteItem } from "../lib/quote-fixtures";
import { QuotesTable } from "./quotes-table";

const meta = {
  title: "Web/QuotesTable",
  component: QuotesTable,
  tags: ["autodocs"],
  args: {
    quotes: [
      quoteItem(),
      quoteItem({
        id: 2,
        number: "D-2026-002",
        title: "Maintenance annuelle",
        status: 2,
        acceptedOn: "2026-09-20",
        amountTtc: { amount: 540_000, currency: "EUR" },
        depositRateBp: null,
        depositAmount: null,
      }),
      quoteItem({
        id: 3,
        number: "D-2026-001",
        title: "Audit de performance",
        status: 1,
        isExpired: true,
        issuedOn: "2026-08-01",
        validUntil: "2026-08-31",
        amountTtc: { amount: 180_000, currency: "EUR" },
      }),
      quoteItem({
        id: 4,
        number: null,
        title: "Application mobile",
        status: 0,
        amountTtc: { amount: 2_400_000, currency: "EUR" },
      }),
    ],
    onOpen: () => {},
  },
} satisfies Meta<typeof QuotesTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One quote in every state the chips name. */
export const EveryState: Story = {};

/** Nothing written yet. */
export const Empty: Story = { args: { quotes: [] } };
