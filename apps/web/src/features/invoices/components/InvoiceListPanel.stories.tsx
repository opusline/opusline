import type { Meta, StoryObj } from "@storybook/react";

import { invoiceItem } from "../lib/fixtures";
import { InvoiceListPanel } from "./invoice-list-panel";

const meta = {
  title: "Web/InvoiceListPanel",
  component: InvoiceListPanel,
  tags: ["autodocs"],
  args: {
    accountToday: "2026-08-14",
    emptyHint:
      "Les factures apparaîtront ici dès que du temps facturable aura été saisi sur une mission de ce client.",
    onOpen: () => {},
  },
} satisfies Meta<typeof InvoiceListPanel>;

export default meta;
type Story = StoryObj<typeof InvoiceListPanel>;

const missionInvoices = [
  invoiceItem({ periodStart: "2026-07-01", periodEnd: "2026-07-31" }),
  invoiceItem({
    id: 2,
    number: "2026-012",
    status: 1,
    isLate: true,
    dueOn: "2026-06-30",
    periodStart: "2026-06-01",
    periodEnd: "2026-06-30",
    amountTtc: { amount: 96_000, currency: "EUR" },
  }),
  invoiceItem({
    id: 3,
    number: null,
    status: 0,
    amountTtc: { amount: 42_000, currency: "EUR" },
  }),
  invoiceItem({
    id: 4,
    number: "2026-009",
    status: 2,
    issuedOn: "2026-05-02",
    paidOn: "2026-05-20",
    periodStart: "2026-04-01",
    periodEnd: "2026-04-30",
    amountTtc: { amount: 300_000, currency: "EUR" },
  }),
];

/** A mission's own invoices: every row is on it, so no row repeats its name. */
export const OneMission: Story = {
  args: { invoices: missionInvoices },
};

/** A client's list spans missions, so each row says which one it covers. */
export const AcrossMissions: Story = {
  args: {
    withMission: true,
    invoices: [
      ...missionInvoices,
      invoiceItem(
        {
          id: 5,
          number: "2026-004",
          amountTtc: { amount: 74_000, currency: "EUR" },
        },
        { mission: null },
      ),
    ],
  },
};

/** Past the scroll box's height, so the card scrolls instead of the page. */
export const LongHistory: Story = {
  args: {
    withMission: true,
    invoices: Array.from({ length: 24 }, (_, index) =>
      invoiceItem({
        id: index + 1,
        number: `2026-${String(index + 1).padStart(3, "0")}`,
      }),
    ),
  },
};

export const Empty: Story = {
  args: { invoices: [] },
};

export const Loading: Story = {
  args: { invoices: [], isPending: true },
};

export const Failed: Story = {
  args: { invoices: [], isError: true },
};
