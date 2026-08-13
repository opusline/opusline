import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

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

  expect(onSend).toHaveBeenCalledWith(null);
});

it("collects the reference first when the draft has none", () => {
  const { onSend } = renderActions({
    invoice: invoiceDetail({ status: 0, number: null }).invoice,
  });

  fireEvent.change(screen.getByLabelText("Référence"), {
    target: { value: " F-2026-041 " },
  });
  fireEvent.click(screen.getByRole("button", { name: "Marquer envoyée" }));

  expect(onSend).toHaveBeenCalledWith("F-2026-041");
});

it("refuses to send a referenceless draft on an empty field", () => {
  renderActions({
    invoice: invoiceDetail({ status: 0, number: null }).invoice,
  });

  expect(
    screen.getByRole("button", { name: "Marquer envoyée" }),
  ).toBeDisabled();
});

it("banks a payment on the date the money landed", () => {
  const { onPay } = renderActions();

  fireEvent.change(screen.getByLabelText("Encaissée le"), {
    target: { value: "2026-07-24" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Marquer encaissée" }));

  expect(onPay).toHaveBeenCalledWith("2026-07-24");
});

it("never books a payment before the invoice existed", () => {
  renderActions({
    invoice: invoiceDetail({ status: 1, issuedOn: "2026-07-01" }).invoice,
  });

  expect(screen.getByLabelText("Encaissée le")).toHaveAttribute(
    "min",
    "2026-07-01",
  );
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
