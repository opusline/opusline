import type { Meta, StoryObj } from "@storybook/react";

import { invoiceDetail } from "../lib/fixtures";
import { InvoiceRemindersPanel } from "./invoice-reminders-panel";

const sentInvoice = invoiceDetail({
  status: 1,
  remindersEnabled: true,
  remindersFrequency: 1,
  reminderRecipients: ["compta@nordlys.test"],
});

const meta = {
  title: "Web/Invoices/InvoiceRemindersPanel",
  component: InvoiceRemindersPanel,
  tags: ["autodocs"],
  args: {
    detail: {
      ...sentInvoice,
      nextReminderOn: "2026-11-03",
      emails: [
        {
          id: 1,
          kind: 0,
          recipients: ["compta@nordlys.test"],
          copyToSender: false,
          subject: "Facture 2026-041 (Juillet 2026)",
          sentAt: "2026-10-01T09:12:00+00:00",
        },
      ],
    },
    isPending: false,
    onChange: () => {},
    onRemindNow: () => {},
  },
} satisfies Meta<typeof InvoiceRemindersPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Reminders on, days 3 and 10, nothing sent yet. */
export const Scheduled: Story = {};

/** One reminder already left; the next is set. */
export const Reminded: Story = {
  args: {
    detail: {
      ...sentInvoice,
      nextReminderOn: "2026-11-10",
      emails: [
        {
          id: 2,
          kind: 3,
          recipients: ["compta@nordlys.test"],
          copyToSender: false,
          subject: "Relance : facture 2026-041 en attente de paiement",
          sentAt: "2026-11-03T08:00:00+00:00",
        },
      ],
    },
  },
};

/** Never e-mailed from Opusline: no one to remind. */
export const NoRecipients: Story = {
  args: {
    detail: {
      ...invoiceDetail({ status: 1, remindersEnabled: false }),
      nextReminderOn: null,
      emails: [],
    },
  },
};
