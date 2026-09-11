import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import {
  calendarDay,
  openDatePicker,
  pickDate,
  showPreviousMonth,
} from "@/test/date-picker";

import {
  CLIENT_FIXTURE,
  fixedPriceBudget,
  MISSION_FIXTURE,
} from "../lib/fixtures";
import { AddInvoiceDialog, type AddInvoiceMission } from "./add-invoice-dialog";

const client = { ...CLIENT_FIXTURE, missions: [] };

const daily: AddInvoiceMission = {
  budget: null,
  client,
  mission: MISSION_FIXTURE,
};

const forfait: AddInvoiceMission = {
  budget: fixedPriceBudget(),
  client,
  mission: {
    ...MISSION_FIXTURE,
    billingMode: 2,
    id: 11,
    name: "Lunaprint refonte boutique",
    rate: { amount: 1_000_000, currency: "EUR" },
  },
};

function renderDialog(
  props: Partial<Parameters<typeof AddInvoiceDialog>[0]> = {},
) {
  const onSubmit = vi.fn();

  render(
    <AddInvoiceDialog
      accountToday="2026-08-19"
      defaultVatRateBp={2000}
      error={null}
      isSaving={false}
      missions={[daily, forfait]}
      onOpenChange={() => {}}
      onSubmit={onSubmit}
      open
      suggestedNumber="F-2026-044"
      vatLiable
      {...props}
    />,
  );

  return { onSubmit };
}

function amountField(): HTMLInputElement {
  return screen.getByLabelText("Montant HT") as HTMLInputElement;
}

it("shows the forfait panel only for a mission billed as a fixed price", () => {
  renderDialog();

  expect(screen.queryByText("Mission au forfait")).not.toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("Mission"), {
    target: { value: String(forfait.mission.id) },
  });

  expect(screen.getByText("Mission au forfait")).toBeInTheDocument();
  expect(screen.getByText("Retenu par un brouillon")).toBeInTheDocument();
});

it("fills the amount with the balance left on the forfait", () => {
  renderDialog({ initialMissionId: forfait.mission.id });

  fireEvent.click(screen.getByRole("button", { name: /Solde/ }));

  expect(amountField().value.replaceAll(/[  ]/gu, " ")).toBe("5 680");
});

it("warns when the amount typed goes past what is left to invoice", () => {
  renderDialog({ initialMissionId: forfait.mission.id });

  fireEvent.change(amountField(), { target: { value: "6000" } });

  expect(screen.getByText(/dépasse de/)).toBeInTheDocument();
});

it("submits the period as the month it covers", async () => {
  const { onSubmit } = renderDialog({ initialMissionId: forfait.mission.id });

  fireEvent.change(amountField(), { target: { value: "1000" } });
  fireEvent.click(screen.getByLabelText("Période"));
  const months = await screen.findByRole("dialog", { name: "" });
  fireEvent.click(within(months).getByRole("button", { name: "Août 2026" }));
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      amountHtCents: 100_000,
      missionId: forfait.mission.id,
      periodEnd: "2026-08-31",
      periodStart: "2026-08-01",
      status: 1,
    }),
  );
});

it("explains itself instead of offering a form when no mission exists", () => {
  renderDialog({ missions: [] });

  expect(screen.getByText(/Créez d'abord une mission/)).toBeInTheDocument();
});

it("keeps the reference required once the invoice is marked issued", () => {
  const { onSubmit } = renderDialog({ suggestedNumber: null });

  fireEvent.change(amountField(), { target: { value: "1000" } });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).not.toHaveBeenCalled();
  expect(
    screen.getByText(/Une facture envoyée ou payée porte la référence/),
  ).toBeInTheDocument();
});

it("asks when a paid invoice was paid, and sends it", async () => {
  const { onSubmit } = renderDialog();

  fireEvent.change(amountField(), { target: { value: "1000" } });
  fireEvent.click(screen.getByRole("button", { name: "Payée" }));
  // Picked from the calendar, sent as the Y-m-d the API speaks.
  await pickDate("Payée le", "2026-08-10");
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ paidOn: "2026-08-10", status: 2 }),
  );
});

it("records the date the invoice was issued, not the day it is entered", async () => {
  const { onSubmit } = renderDialog();

  fireEvent.change(amountField(), { target: { value: "1000" } });
  await openDatePicker("Émise le");
  showPreviousMonth();
  fireEvent.click(calendarDay("2026-07-05"));
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ issuedOn: "2026-07-05", paidOn: null }),
  );
});

it("becomes usable when the missions land after the dialog opened", () => {
  const onSubmit = vi.fn();
  const props = {
    accountToday: "2026-08-19",
    defaultVatRateBp: 2000,
    error: null,
    isSaving: false,
    onOpenChange: () => {},
    onSubmit,
    open: true as const,
    suggestedNumber: "F-2026-044",
    vatLiable: true,
  };

  const { rerender } = render(
    <AddInvoiceDialog {...props} isLoading missions={[]} />,
  );

  expect(screen.getByText(/Chargement de vos missions/)).toBeInTheDocument();

  rerender(<AddInvoiceDialog {...props} missions={[daily, forfait]} />);

  fireEvent.change(amountField(), { target: { value: "1000" } });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ missionId: daily.mission.id }),
  );
});

it("never lets a paid invoice go out without the day it was paid", () => {
  const { onSubmit } = renderDialog();

  fireEvent.change(amountField(), { target: { value: "1000" } });
  fireEvent.click(screen.getByRole("button", { name: "Payée" }));
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  // Nothing was picked, so the field is still on today — which is the point:
  // the date cannot be emptied, so a paid invoice always carries one.
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ paidOn: "2026-08-19", status: 2 }),
  );
});
