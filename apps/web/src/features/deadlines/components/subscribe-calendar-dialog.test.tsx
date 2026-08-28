import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { DEMO_BOARD, DEMO_SUBSCRIBED_BOARD } from "../lib/fixtures";
import { SubscribeCalendarDialog } from "./subscribe-calendar-dialog";

function renderDialog(
  overrides: Partial<React.ComponentProps<typeof SubscribeCalendarDialog>> = {},
) {
  const onSave = vi.fn();
  const onRotate = vi.fn();
  const onInterrupt = vi.fn();
  const onOpenChange = vi.fn();

  render(
    <SubscribeCalendarDialog
      calendarToken={DEMO_BOARD.calendarToken}
      feed={DEMO_BOARD.calendarFeed}
      isInterrupting={false}
      isRotating={false}
      isSaving={false}
      lastSyncedAt={null}
      onInterrupt={onInterrupt}
      onOpenChange={onOpenChange}
      onRotate={onRotate}
      onSave={onSave}
      open
      subscribedOn={null}
      {...overrides}
    />,
  );

  return { onSave, onRotate, onInterrupt, onOpenChange };
}

it("shows the address under the webcal scheme a calendar app subscribes to", () => {
  renderDialog();

  expect(
    screen.getByDisplayValue(
      new RegExp(`^webcal://.*${DEMO_BOARD.calendarToken}`),
    ),
  ).toBeInTheDocument();
});

it("warns that the address is a credential", () => {
  renderDialog();

  expect(
    screen.getByText(/Traitez-la comme un mot de passe/),
  ).toBeInTheDocument();
});

it("commits the toggled categories only when the primary is pressed", () => {
  const { onSave } = renderDialog();

  fireEvent.click(screen.getByRole("checkbox", { name: "Relances à envoyer" }));

  expect(onSave).not.toHaveBeenCalled();

  fireEvent.click(
    screen.getByRole("button", { name: "J'ai ajouté l'adresse" }),
  );

  expect(onSave).toHaveBeenCalledWith({
    ...DEMO_BOARD.calendarFeed,
    reminders: true,
  });
});

it("counts the categories the draft carries", () => {
  renderDialog();

  fireEvent.click(screen.getByRole("checkbox", { name: "Relances à envoyer" }));

  expect(
    screen.getByText("5 types d'échéances publiés sur cette adresse."),
  ).toBeInTheDocument();
});

it("rotates the address when asked", () => {
  const { onRotate } = renderDialog();

  fireEvent.click(screen.getByRole("button", { name: "Régénérer l'adresse" }));

  expect(onRotate).toHaveBeenCalledOnce();
});

it("reads as a subscription once the address is in a calendar", () => {
  renderDialog({
    subscribedOn: DEMO_SUBSCRIBED_BOARD.calendarSubscribedOn,
    lastSyncedAt: DEMO_SUBSCRIBED_BOARD.calendarLastSyncedAt,
  });

  expect(screen.getByText("Abonnement au calendrier")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Enregistrer" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/ajoutée le 12 août 2026/)).toBeInTheDocument();
  expect(screen.getByText(/Dernière synchronisation/)).toBeInTheDocument();
});

it("waits honestly while no calendar has come yet", () => {
  renderDialog({
    subscribedOn: DEMO_SUBSCRIBED_BOARD.calendarSubscribedOn,
    lastSyncedAt: null,
  });

  expect(
    screen.getByText(/En attente de la première synchronisation/),
  ).toBeInTheDocument();
});

it("hands the interruption back rather than just closing", () => {
  const { onInterrupt, onOpenChange } = renderDialog({
    subscribedOn: DEMO_SUBSCRIBED_BOARD.calendarSubscribedOn,
    lastSyncedAt: DEMO_SUBSCRIBED_BOARD.calendarLastSyncedAt,
  });

  fireEvent.click(screen.getByRole("button", { name: "Interrompre" }));

  expect(onInterrupt).toHaveBeenCalledOnce();
  expect(onOpenChange).not.toHaveBeenCalled();
});
