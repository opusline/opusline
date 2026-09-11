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
  const onReopen = vi.fn();

  render(
    <InvoiceLifecycleActions
      invoice={invoiceDetail({ status: 1 }).invoice}
      accountToday="2026-08-14"
      isPending={false}
      error={null}
      onSend={onSend}
      onPay={onPay}
      onRemind={onRemind}
      onReopen={onReopen}
      {...props}
    />,
  );

  return { onSend, onPay, onRemind, onReopen };
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

it("sends on the day the document actually left", () => {
  const { onSend } = renderActions({
    invoice: invoiceDetail({ status: 0, number: "2026-014" }).invoice,
  });

  fireEvent.change(screen.getByLabelText("Envoyée le"), {
    target: { value: "04/07/2026" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Marquer envoyée" }));

  expect(onSend).toHaveBeenCalledWith(null, "2026-07-04");
});

it("never sends a draft before the date it carries", () => {
  const { onSend } = renderActions({
    invoice: invoiceDetail({
      status: 0,
      number: "2026-014",
      issuedOn: "2026-07-01",
    }).invoice,
  });

  fireEvent.change(screen.getByLabelText("Envoyée le"), {
    target: { value: "30/06/2026" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Marquer envoyée" }));

  expect(onSend).not.toHaveBeenCalled();
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

  // Typed in the account's own layout, sent as the Y-m-d the API speaks.
  fireEvent.change(screen.getByLabelText("Encaissée le"), {
    target: { value: "24/07/2026" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Marquer encaissée" }));

  expect(onPay).toHaveBeenCalledWith("2026-07-24");
});

it("never books a payment before the invoice existed", () => {
  const { onPay } = renderActions({
    invoice: invoiceDetail({ status: 1, issuedOn: "2026-07-01" }).invoice,
  });

  fireEvent.change(screen.getByLabelText("Encaissée le"), {
    target: { value: "30/06/2026" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Marquer encaissée" }));

  expect(onPay).not.toHaveBeenCalled();
});

it("chases an invoice that is out but unpaid", () => {
  const { onRemind } = renderActions();

  fireEvent.click(screen.getByRole("button", { name: "Noter une relance" }));

  expect(onRemind).toHaveBeenCalled();
});

it("offers no way forward once the money is in", () => {
  renderActions({ invoice: invoiceDetail({ status: 2 }).invoice });

  expect(
    screen.queryByRole("button", { name: "Marquer encaissée" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Noter une relance" }),
  ).not.toBeInTheDocument();
});

it("surfaces what the server refused", () => {
  renderActions({ error: "Seul un brouillon peut être marqué comme envoyé." });

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Seul un brouillon peut être marqué comme envoyé.",
  );
});

it("offers a draft no way back: there is nowhere to go", () => {
  renderActions({
    invoice: invoiceDetail({ status: 0, number: "2026-014" }).invoice,
  });

  expect(
    screen.queryByRole("button", { name: /finalement/ }),
  ).not.toBeInTheDocument();
});

it("takes a sent invoice back to a draft", () => {
  const { onReopen } = renderActions({
    invoice: invoiceDetail({ status: 1 }).invoice,
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Pas envoyée finalement" }),
  );

  expect(onReopen).toHaveBeenCalled();
});

it("takes a collected invoice back to sent, where the lifecycle used to end", () => {
  const { onReopen } = renderActions({
    invoice: invoiceDetail({ status: 2 }).invoice,
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Pas encaissée finalement" }),
  );

  expect(onReopen).toHaveBeenCalled();
});
