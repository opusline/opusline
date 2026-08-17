import type { TreasuryData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import { StoryRouter } from "@/test/story-router";
import { TreasuryPage } from "./treasury-page";

const meta = {
  title: "Web/TreasuryPage",
  component: TreasuryPage,
  tags: ["autodocs"],
  args: {
    today: "2026-08-13",
    onRecordTransfer: () => {},
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof TreasuryPage>;

export default meta;
type Story = StoryObj<typeof TreasuryPage>;

function money(amount: number) {
  return { amount, currency: "EUR" as const };
}

const base: TreasuryData = {
  balance: { amount: money(1_284_000), source: 1, asOf: "2026-08-10" },
  provisions: {
    vat: { amount: money(199_400), rateBp: null },
    urssaf: { amount: money(287_000), rateBp: 2600 },
    buffer: money(200_000),
    total: money(686_400),
  },
  transferable: money(597_600),
  shortfall: null,
  pendingTransfers: money(0),
  transfers: [
    {
      id: 3,
      transferredOn: "2026-07-30",
      amount: money(250_000),
      note: "Salaire juillet",
      isSettled: true,
    },
    {
      id: 2,
      transferredOn: "2026-06-28",
      amount: money(250_000),
      note: "Salaire juin",
      isSettled: true,
    },
  ],
};

export const Default: Story = {
  args: { treasury: base },
};

/** A transfer noted but not yet reported by the bank still holds its money. */
export const TransferAwaitingStatement: Story = {
  args: {
    treasury: {
      ...base,
      pendingTransfers: money(300_000),
      transferable: money(297_600),
      transfers: [
        {
          id: 4,
          transferredOn: "2026-08-12",
          amount: money(300_000),
          note: "Salaire août",
          isSettled: false,
        },
        ...base.transfers,
      ],
    },
  },
};

export const ShortOfProvisions: Story = {
  args: {
    treasury: {
      ...base,
      balance: { amount: money(400_000), source: 1, asOf: "2026-08-10" },
      transferable: money(0),
      shortfall: { amount: -286_400, currency: "EUR" },
    },
  },
};

export const NoBalanceYet: Story = {
  args: {
    treasury: {
      balance: null,
      provisions: { vat: null, urssaf: null, buffer: null, total: money(0) },
      transferable: money(0),
      shortfall: null,
      pendingTransfers: money(0),
      transfers: [],
    },
  },
};
