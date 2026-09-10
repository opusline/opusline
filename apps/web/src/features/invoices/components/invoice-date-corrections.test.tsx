import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

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

  expect(screen.getByLabelText("Envoyée le")).toHaveValue("01/07/2026");
  expect(screen.getByLabelText("Encaissée le")).toHaveValue("24/07/2026");
});

it("stays quiet until something actually changes", () => {
  renderCorrections();

  expect(save()).toBeDisabled();
});

it("moves the day the invoice went out", () => {
  const { onSubmit } = renderCorrections();

  fireEvent.change(screen.getByLabelText("Envoyée le"), {
    target: { value: "04/07/2026" },
  });
  fireEvent.click(save());

  expect(onSubmit).toHaveBeenCalledWith({
    sentOn: "2026-07-04",
    paidOn: null,
  });
});

it("moves a payment date backwards, where the money actually landed", () => {
  const { onSubmit } = renderCorrections({
    invoice: invoiceDetail({ status: 2, paidOn: "2026-07-24" }).invoice,
  });

  fireEvent.change(screen.getByLabelText("Encaissée le"), {
    target: { value: "18/07/2026" },
  });
  fireEvent.click(save());

  expect(onSubmit).toHaveBeenCalledWith({
    sentOn: "2026-07-01",
    paidOn: "2026-07-18",
  });
});

it("never books a payment before the invoice was sent", () => {
  renderCorrections({
    invoice: invoiceDetail({ status: 2, paidOn: "2026-07-24" }).invoice,
  });

  fireEvent.change(screen.getByLabelText("Encaissée le"), {
    target: { value: "30/06/2026" },
  });

  expect(save()).toBeDisabled();
});

it("surfaces what the server refused", () => {
  renderCorrections({
    error: "La date d'envoi ne peut pas précéder la date d'émission.",
  });

  expect(screen.getByRole("alert")).toHaveTextContent(
    "La date d'envoi ne peut pas précéder la date d'émission.",
  );
});
