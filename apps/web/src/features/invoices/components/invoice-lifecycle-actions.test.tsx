import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import {
  calendarDay,
  openDatePicker,
  pickDate,
  queryCalendarDay,
  showPreviousMonth,
} from "@/test/date-picker";

import { eur } from "@/test/fixtures";

import { invoiceDetail } from "../lib/fixtures";
import { InvoiceLifecycleActions } from "./invoice-lifecycle-actions";

function renderActions(
  props: Partial<Parameters<typeof InvoiceLifecycleActions>[0]> = {},
) {
  const onSend = vi.fn();
  const onPay = vi.fn();
  const onRemind = vi.fn();
  const onDelete = vi.fn();

  render(
    <InvoiceLifecycleActions
      invoice={invoiceDetail({ status: 1 }).invoice}
      accountToday="2026-08-14"
      isPending={false}
      error={null}
      onSend={onSend}
      onPay={onPay}
      onRemind={onRemind}
      onDelete={onDelete}
      {...props}
    />,
  );

  return { onSend, onPay, onRemind, onDelete };
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

it("offers to delete a draft", () => {
  const { onDelete } = renderActions({
    invoice: invoiceDetail({ status: 0 }).invoice,
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Supprimer le brouillon" }),
  );

  expect(onDelete).toHaveBeenCalled();
});

it("offers no deletion once the invoice is out", () => {
  renderActions();

  expect(
    screen.queryByRole("button", { name: "Supprimer le brouillon" }),
  ).not.toBeInTheDocument();
});

it("banks a payment on the date the money landed", async () => {
  const { onPay } = renderActions();

  // The field opens on today, so July is a month back — and the Y-m-d it sends
  // is the shape the API speaks, whatever the calendar printed.
  await openDatePicker("Encaissée le");
  showPreviousMonth();
  fireEvent.click(calendarDay("2026-07-24"));
  fireEvent.click(screen.getByRole("button", { name: "Marquer encaissée" }));

  expect(onPay).toHaveBeenCalledWith("2026-07-24", null);
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

it("records a part of the balance as a partial payment", () => {
  const { onPay } = renderActions();

  fireEvent.change(screen.getByTestId("invoice-amount-received"), {
    target: { value: "1 000" },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Enregistrer le paiement" }),
  );

  expect(onPay).toHaveBeenCalledWith("2026-08-14", 100_000);
});

it("refuses more than what is still due", () => {
  renderActions();

  fireEvent.change(screen.getByTestId("invoice-amount-received"), {
    target: { value: "5 000" },
  });

  expect(screen.getByTestId("invoice-mark-collected")).toBeDisabled();
});

it("shows what is still due on a partly paid invoice", () => {
  renderActions({
    invoice: invoiceDetail({
      status: 1,
      amountPaid: eur(100_000),
      amountDue: eur(98_000),
    }).invoice,
  });

  expect(screen.getByTestId("invoice-balance-due")).toHaveAttribute(
    "data-amount-cents",
    "98000",
  );
  expect(screen.getByTestId("invoice-amount-received")).toHaveValue("980");
});
