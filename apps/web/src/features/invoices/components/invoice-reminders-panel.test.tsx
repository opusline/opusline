import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { MoneyFormatProvider } from "@/components/money-format-provider";
import { invoiceDetail } from "../lib/fixtures";
import { InvoiceRemindersPanel } from "./invoice-reminders-panel";

function renderPanel(detail = withReminders()) {
  const onChange = vi.fn();
  const onRemindNow = vi.fn();

  render(
    <MoneyFormatProvider currency="EUR" dateFormat={0} locale="fr-FR">
      <InvoiceRemindersPanel
        detail={detail}
        isPending={false}
        onChange={onChange}
        onRemindNow={onRemindNow}
      />
    </MoneyFormatProvider>,
  );

  return { onChange, onRemindNow };
}

function withReminders(recipients = ["compta@nordlys.test"]) {
  return {
    ...invoiceDetail({
      status: 1,
      remindersEnabled: true,
      remindersFrequency: 1,
      reminderRecipients: recipients,
    }),
    nextReminderOn: "2026-11-03",
    emails: [
      {
        id: 2,
        kind: 3 as const,
        recipients,
        copyToSender: false,
        subject: "Relance",
        sentAt: "2026-10-20T08:00:00+00:00",
      },
    ],
  };
}

it("says who is reminded, when next, and what already left", () => {
  renderPanel();

  expect(screen.getByTestId("invoice-reminders-recipients")).toHaveTextContent(
    "compta@nordlys.test",
  );
  expect(screen.getByTestId("invoice-reminders-next")).toHaveAttribute(
    "data-date",
    "2026-11-03",
  );
  expect(screen.getAllByTestId("invoice-reminders-sent")).toHaveLength(1);
});

it("saves the switch and the frequency as they change", () => {
  const { onChange } = renderPanel();

  fireEvent.change(screen.getByTestId("invoice-reminders-frequency"), {
    target: { value: "2" },
  });
  expect(onChange).toHaveBeenCalledWith({ enabled: true, frequency: 2 });

  fireEvent.click(screen.getByTestId("invoice-reminders-toggle"));
  expect(onChange).toHaveBeenLastCalledWith({ enabled: false, frequency: 1 });
});

it("reminds now", () => {
  const { onRemindNow } = renderPanel();

  fireEvent.click(screen.getByTestId("invoice-remind-now"));

  expect(onRemindNow).toHaveBeenCalledOnce();
});

it("has nobody to remind on an invoice that never left Opusline", () => {
  renderPanel(withReminders([]));

  expect(
    screen.getByTestId("invoice-reminders-no-recipients"),
  ).toBeInTheDocument();
  expect(screen.getByTestId("invoice-remind-now")).toBeDisabled();
});
