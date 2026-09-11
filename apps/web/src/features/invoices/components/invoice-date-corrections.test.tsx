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
import { InvoiceDateCorrections } from "./invoice-date-corrections";

function renderCorrections(
  props: Partial<Parameters<typeof InvoiceDateCorrections>[0]> = {},
) {
  const onSubmit = vi.fn();

  render(
    <InvoiceDateCorrections
      accountToday="2026-08-14"
      error={null}
      invoice={invoiceDetail({ status: 1 }).invoice}
      isPending={false}
      onSubmit={onSubmit}
      sentOn="2026-07-01"
      {...props}
    />,
  );

  return { onSubmit };
}

const save = () =>
  screen.getByRole("button", { name: "Enregistrer les dates" });

it("offers nothing on a draft, which has no dates yet", () => {
  renderCorrections({ invoice: invoiceDetail({ status: 0 }).invoice });

  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

it("starts on the dates the invoice already carries", () => {
  renderCorrections({
    invoice: invoiceDetail({ status: 2, paidOn: "2026-07-24" }).invoice,
  });

  expect(screen.getByLabelText("Envoyée le")).toHaveTextContent(
    "1 juillet 2026",
  );
  expect(screen.getByLabelText("Encaissée le")).toHaveTextContent(
    "24 juillet 2026",
  );
});

it("stays quiet until something actually changes", () => {
  renderCorrections();

  expect(save()).toBeDisabled();
});

it("moves the day the invoice went out", async () => {
  const { onSubmit } = renderCorrections();

  await pickDate("Envoyée le", "2026-07-04");
  fireEvent.click(save());

  expect(onSubmit).toHaveBeenCalledWith({
    issuedOn: "2026-07-01",
    sentOn: "2026-07-04",
    paidOn: null,
  });
});

it("moves a payment date backwards, where the money actually landed", async () => {
  const { onSubmit } = renderCorrections({
    invoice: invoiceDetail({ status: 2, paidOn: "2026-07-24" }).invoice,
  });

  await pickDate("Encaissée le", "2026-07-18");
  fireEvent.click(save());

  expect(onSubmit).toHaveBeenCalledWith({
    issuedOn: "2026-07-01",
    sentOn: "2026-07-01",
    paidOn: "2026-07-18",
  });
});

it("never books a payment before the invoice was sent", async () => {
  renderCorrections({
    invoice: invoiceDetail({ status: 2, paidOn: "2026-07-24" }).invoice,
  });

  await openDatePicker("Encaissée le");

  // The send date is the floor, so a day before it is not on offer at all.
  expect(queryCalendarDay("2026-06-30")).not.toBeInTheDocument();
});

it("surfaces what the server refused", () => {
  renderCorrections({
    error: "La date d'envoi ne peut pas précéder la date d'émission.",
  });

  expect(screen.getByRole("alert")).toHaveTextContent(
    "La date d'envoi ne peut pas précéder la date d'émission.",
  );
});

it("moves the day the invoice bears, which the send date stands on", async () => {
  const { onSubmit } = renderCorrections();

  await openDatePicker("Émise le");
  showPreviousMonth();
  fireEvent.click(calendarDay("2026-06-01"));
  fireEvent.click(save());

  expect(onSubmit).toHaveBeenCalledWith({
    issuedOn: "2026-06-01",
    sentOn: "2026-07-01",
    paidOn: null,
  });
});

it("lets the send date follow the issue date back", async () => {
  renderCorrections();

  // Before: the send date could not go earlier than 01/07, the day the invoice
  // bears. That floor is the field above now, so moving it frees the one below.
  await openDatePicker("Émise le");
  showPreviousMonth();
  fireEvent.click(calendarDay("2026-06-01"));

  await openDatePicker("Envoyée le");
  showPreviousMonth();
  fireEvent.click(calendarDay("2026-06-15"));

  expect(save()).toBeEnabled();
});
