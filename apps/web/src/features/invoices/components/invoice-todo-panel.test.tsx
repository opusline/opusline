import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { invoiceSummary, unbilledTodoRow } from "../lib/fixtures";
import { InvoiceTodoPanel } from "./invoice-todo-panel";

const summary = invoiceSummary();

function renderPanel(
  props: Partial<Parameters<typeof InvoiceTodoPanel>[0]> = {},
) {
  const onRemind = vi.fn();
  const onCreateInvoice = vi.fn();

  render(
    <InvoiceTodoPanel
      todo={summary.todo}
      todoTotal={summary.todoTotal}
      onRemind={onRemind}
      onCreateInvoice={onCreateInvoice}
      {...props}
    />,
  );

  return { onRemind, onCreateInvoice };
}

it("offers a reminder on money that is owed and late", () => {
  const { onRemind } = renderPanel();
  const row = screen.getByText("F-2026-036 · Vesterhus").closest("div")
    ?.parentElement as HTMLElement;

  fireEvent.click(
    within(row).getByRole("button", { name: "Noter une relance" }),
  );

  expect(onRemind).toHaveBeenCalledWith(36);
});

it("offers an invoice on work that has not been billed", () => {
  const { onCreateInvoice } = renderPanel();

  fireEvent.click(screen.getByRole("button", { name: "Créer la facture" }));

  expect(onCreateInvoice).toHaveBeenCalledWith(
    expect.objectContaining({
      work: expect.objectContaining({ missionId: 20 }),
    }),
  );
});

it("says how late an overdue invoice is, not just that it is", () => {
  renderPanel();

  expect(
    screen.getByText("Échue le 30/06/2026 · 41 j de retard"),
  ).toBeInTheDocument();
});

it("measures unbilled work in the mission's own unit", () => {
  renderPanel({ todo: [unbilledTodoRow()], todoTotal: 1 });

  expect(screen.getByText("3 j sur Orvella front")).toBeInTheDocument();
});

it("bills hourly missions in hours", () => {
  renderPanel({
    todo: [
      unbilledTodoRow({
        valuedDays: null,
        valuedMinutes: 210,
        missionName: "Vesterhus maintenance",
      }),
    ],
    todoTotal: 1,
  });

  expect(
    screen.getByText("3,5 h sur Vesterhus maintenance"),
  ).toBeInTheDocument();
});

it("marks unbilled amounts as net, since they are not on a document yet", () => {
  renderPanel({ todo: [unbilledTodoRow()], todoTotal: 1 });

  expect(screen.getByText("1 650 € HT")).toBeInTheDocument();
});

it("names both months when the work spans two", () => {
  renderPanel({
    todo: [
      unbilledTodoRow({
        firstEntryOn: "2026-07-31",
        lastEntryOn: "2026-08-13",
      }),
    ],
    todoTotal: 1,
  });

  expect(
    screen.getByText("Entrées du 31 juillet au 13 août"),
  ).toBeInTheDocument();
});

it("collapses a single day into one date", () => {
  renderPanel({
    todo: [
      unbilledTodoRow({
        firstEntryOn: "2026-08-03",
        lastEntryOn: "2026-08-03",
      }),
    ],
    todoTotal: 1,
  });

  expect(screen.getByText("Entrées du 03 août")).toBeInTheDocument();
});

it("says how many rows were left out when the list is capped", () => {
  renderPanel({ todoTotal: 24 });

  expect(screen.getByText("+ 22 autres")).toBeInTheDocument();
});

it("says so when there is nothing to act on", () => {
  renderPanel({ todo: [], todoTotal: 0 });

  expect(screen.getByText("Tout est facturé et encaissé.")).toBeInTheDocument();
});
