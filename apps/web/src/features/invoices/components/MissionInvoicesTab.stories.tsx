import type { MissionData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";

import { invoiceItem, MISSION_FIXTURE } from "@/test/fixtures";

import { MissionInvoicesTab } from "./mission-invoices-tab";

const forfaitMission = {
  ...MISSION_FIXTURE,
  id: 20,
  slug: "orvella-front",
  name: "Orvella front",
  billingMode: 2,
  rate: { amount: 800_000, currency: "EUR" },
  rounding: null,
} satisfies MissionData;

const meta = {
  title: "Web/Invoices/MissionInvoicesTab",
  component: MissionInvoicesTab,
  tags: ["autodocs"],
  args: {
    mission: forfaitMission,
    accountToday: "2026-08-18",
    invoices: [],
    onCreateInvoice: () => {},
    onOpenInvoice: () => {},
  },
} satisfies Meta<typeof MissionInvoicesTab>;

export default meta;
type Story = StoryObj<typeof MissionInvoicesTab>;

/** A forfait billed in instalments: the deposit is paid, the staging step is out. */
export const Default: Story = {
  args: {
    invoices: [
      invoiceItem({
        id: 41,
        number: "2026-021",
        status: 1,
        issuedOn: "2026-08-12",
        dueOn: "2026-09-26",
        amountHt: { amount: 320_000, currency: "EUR" },
        amountTtc: { amount: 384_000, currency: "EUR" },
      }),
      invoiceItem({
        id: 40,
        number: "2026-014",
        status: 2,
        issuedOn: "2026-06-30",
        paidOn: "2026-07-18",
        amountHt: { amount: 240_000, currency: "EUR" },
        amountTtc: { amount: 288_000, currency: "EUR" },
      }),
    ],
  },
};

/** Nothing billed yet — the button is the only way onto a forfait. */
export const Empty: Story = {};

/**
 * A time-billed mission lists its invoices but offers no button: its way in is the
 * "à facturer" row, which knows which entries the invoice consumes.
 */
export const TimeBilledMission: Story = {
  args: {
    mission: MISSION_FIXTURE,
    invoices: [invoiceItem()],
  },
};

export const Loading: Story = {
  args: { isPending: true },
};

export const Failed: Story = {
  args: { isError: true },
};
