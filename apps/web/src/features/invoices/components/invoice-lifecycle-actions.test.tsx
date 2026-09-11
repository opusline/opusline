import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import {
  calendarDay,
  openDatePicker,
  pickDate,
  queryCalendarDay,
  showPreviousMonth,
} from "@/test/date-picker";

import { invoiceDetail } from "../lib/fixtures";
import { InvoiceLifecycleActions } from "./invoice-lifecycle-actions";

function renderActions(
  props: Partial<Parameters<typeof InvoiceLifecycleActions>[0]> = {},
) {
  const onSend = vi.fn();
  const onPay = vi.fn();
  const onRemind = vi.fn();

  render(
    <InvoiceLifecycleActions
      invoice={invoiceDetail({ status: 1 }).invoice}
      accountToday="2026-08-14"
      isPending={false}
      error={null}
      onSend={onSend}
      onPay={onPay}
      onRemind={onRemind}
      {...props}
    />,
  );

  return { onSend, onPay, onRemind };
}

it("sends a draft that already carries its reference", () => {
  const { onSend } = renderActions({
    invoice: invoiceDetail({ status: 0, number: "2026-014" }).invoice,
  });

  fireEvent.click(screen.getByRole("button", { name: "Marquer envoyée" }));

  expect(onSend).toHaveBeenCalledWith(null, "2026-07-01");
});

it("collects the reference first when the draft has none", () => {
  const { onSend } = renderActions({
    invoice: invoiceDetail({ status: 0, number: null }).invoice,
  });

  fireEvent.change(screen.getByLabelText("Référence"), {
    target: { value: " F-2026-041 " },
  });
  fireEvent.click(screen.getByRole("button", { name: "Marquer envoyée" }));

  expect(onSend).toHaveBeenCalledWith("F-2026-041", "2026-07-01");
});

it("sends on the day the document actually left", async () => {
  const { onSend } = renderActions({
    invoice: invoiceDetail({ status: 0, number: "2026-014" }).invoice,
  });

  await pickDate("Envoyée le", "2026-07-04");
  fireEvent.click(screen.getByRole("button", { name: "Marquer envoyée" }));

  expect(onSend).toHaveBeenCalledWith(null, "2026-07-04");
});

it("never sends a draft before the date it carries", async () => {
  renderActions({
    invoice: invoiceDetail({
      status: 0,
      number: "2026-014",
      issuedOn: "2026-07-01",
    }).invoice,
  });

  await openDatePicker("Envoyée le");

  // The floor is the issue date, so the calendar does not reach June at all.
  expect(queryCalendarDay("2026-06-30")).not.toBeInTheDocument();
});

it("refuses to send a referenceless draft on an empty field", () => {
  renderActions({
    invoice: invoiceDetail({ status: 0, number: null }).invoice,
  });

  expect(
    screen.getByRole("button", { name: "Marquer envoyée" }),
  ).toBeDisabled();
});

it("banks a payment on the date the money landed", async () => {
  const { onPay } = renderActions();

  // The field opens on today, so July is a month back — and the Y-m-d it sends
  // is the shape the API speaks, whatever the calendar printed.
  await openDatePicker("Encaissée le");
  showPreviousMonth();
  fireEvent.click(calendarDay("2026-07-24"));
  fireEvent.click(screen.getByRole("button", { name: "Marquer encaissée" }));

  expect(onPay).toHaveBeenCalledWith("2026-07-24");
});

it("never books a payment before the invoice existed", async () => {
  renderActions({
    invoice: invoiceDetail({ status: 1, issuedOn: "2026-07-01" }).invoice,
  });

  await openDatePicker("Encaissée le");
  showPreviousMonth();

  expect(queryCalendarDay("2026-06-30")).not.toBeInTheDocument();
});

it("chases an invoice that is out but unpaid", () => {
  const { onRemind } = renderActions();

  fireEvent.click(screen.getByRole("button", { name: "Noter une relance" }));

  expect(onRemind).toHaveBeenCalled();
});

it("offers nothing once the money is in", () => {
  renderActions({ invoice: invoiceDetail({ status: 2 }).invoice });

  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

it("surfaces what the server refused", () => {
  renderActions({ error: "Seul un brouillon peut être marqué comme envoyé." });

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Seul un brouillon peut être marqué comme envoyé.",
  );
});
