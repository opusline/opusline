import type {
  SubscriptionData,
  SubscriptionOccurrenceData,
} from "@opusline/api-client";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import {
  annualSubscription,
  SUBSCRIPTIONS_TODAY,
  subscription,
} from "../lib/subscription-fixtures";
import { SubscriptionRowMenu } from "./subscription-row-menu";

const noop = () => {};

function monthly(
  states: Record<string, SubscriptionOccurrenceData["state"]>,
): SubscriptionData {
  return subscription({
    occurrences: Object.entries(states).map(([period, state], index) => ({
      period,
      debitOn: `${period}-01`,
      state,
      expenseId: 500 + index,
    })),
  });
}

async function linkItems(row: SubscriptionData) {
  render(
    <SubscriptionRowMenu
      onCancel={noop}
      onChangeAmount={noop}
      onDelete={noop}
      onEdit={noop}
      onLinkReceipt={noop}
      onPause={noop}
      onReactivate={noop}
      onResume={noop}
      onToggleProvision={noop}
      subscription={row}
      today={SUBSCRIPTIONS_TODAY}
    />,
  );

  fireEvent.click(
    screen.getByRole("button", { name: `Actions pour ${row.supplier}` }),
  );
  await screen.findByRole("menuitem", { name: "Modifier" });

  return screen
    .queryAllByRole("menuitem", { name: /^Lier la facture/ })
    .map((item) => item.textContent);
}

it.each([
  {
    receipts: "every receipt in",
    row: monthly({ "2026-07": 0, "2026-08": 0 }),
    offered: [],
  },
  {
    receipts: "two months missing",
    row: monthly({ "2026-05": 1, "2026-06": 0, "2026-07": 1 }),
    offered: ["Lier la facture de juillet", "Lier la facture de mai"],
  },
  {
    receipts: "a missing month older than the strip",
    row: monthly({ "2025-08": 1, "2026-08": 0 }),
    offered: [],
  },
  {
    receipts: "an annual debit missing its receipt",
    row: {
      ...annualSubscription(),
      occurrences: [
        {
          period: "2026",
          debitOn: "2026-01-15",
          state: 1 as const,
          expenseId: 310,
        },
      ],
    },
    offered: ["Lier la facture de janvier"],
  },
])(
  "offers a link for each month the strip shows missing: $receipts",
  async ({ row, offered }) => {
    expect(await linkItems(row)).toEqual(offered);
  },
);
