import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { eur } from "@/test/fixtures";

import { billingStep as step } from "../lib/fixtures";
import { MissionBillingSchedule } from "./mission-billing-schedule";

const fixedPrice = eur(800_000);

function renderSchedule(
  props: Partial<Parameters<typeof MissionBillingSchedule>[0]> = {},
) {
  const onAdd = vi.fn();
  const onDelete = vi.fn();
  const onSetReady = vi.fn();
  const onBill = vi.fn();

  render(
    <MissionBillingSchedule
      steps={[step()]}
      scheduledCents={240_000}
      fixedPrice={fixedPrice}
      onAdd={onAdd}
      onDelete={onDelete}
      onSetReady={onSetReady}
      onBill={onBill}
      {...props}
    />,
  );

  return { onAdd, onDelete, onSetReady, onBill };
}

it("adds an instalment from the label and the amount", () => {
  const { onAdd } = renderSchedule();

  fireEvent.change(screen.getByLabelText("Libellé"), {
    target: { value: "Recette" },
  });
  fireEvent.change(screen.getByLabelText("Montant HT"), {
    target: { value: "3200" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Ajouter une échéance/ }));

  expect(onAdd).toHaveBeenCalledWith({
    label: "Recette",
    amount: { amount: 320_000, currency: "EUR" },
    dueOn: null,
  });
});

it("refuses to add an instalment with no amount", () => {
  const { onAdd } = renderSchedule();

  fireEvent.change(screen.getByLabelText("Libellé"), {
    target: { value: "Recette" },
  });

  const submit = screen.getByRole("button", { name: /Ajouter une échéance/ });

  expect(submit).toBeDisabled();

  fireEvent.click(submit);

  expect(onAdd).not.toHaveBeenCalled();
});

it("flips a step between ready and not", () => {
  const { onSetReady } = renderSchedule();

  fireEvent.click(screen.getByRole("button", { name: "Marquer prête" }));

  expect(onSetReady).toHaveBeenCalledWith(1, true);
});

it("offers nothing to change on a step an invoice already bills", () => {
  renderSchedule({ steps: [step({ invoiceId: 41 })] });

  expect(screen.getByText("Facturée")).toBeVisible();
  expect(screen.queryByRole("button", { name: "Facturer" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Marquer prête" })).toBeNull();
});

it("reports a schedule that does not add up to the price without blocking it", () => {
  renderSchedule({ scheduledCents: 240_000 });

  // An avenant is normal: the app says the two disagree and leaves the judgement
  // to whoever is reading it.
  expect(screen.getByText(/Les échéances totalisent/)).toBeVisible();
});

it("says nothing about the total when there is no schedule to compare", () => {
  renderSchedule({ steps: [], scheduledCents: 0 });

  expect(screen.queryByText(/Les échéances totalisent/)).toBeNull();
  expect(screen.getByText(/Pas d’échéancier/)).toBeVisible();
});

it("does not claim a step is billed while its invoice is still a draft", () => {
  renderSchedule({ steps: [step({ invoiceId: 41, invoiceStatus: 0 })] });

  // A draft has billed nothing, and every money figure on the page excludes it.
  expect(screen.getByText("Facture en brouillon")).toBeVisible();
  expect(screen.queryByText("Facturée")).toBeNull();
});
