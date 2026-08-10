import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { DEMO_ELAPSED_SECONDS, DEMO_TIMER } from "../lib/timer-fixtures";
import {
  TimerDetailPopover,
  type TimerDetailPopoverProps,
} from "./timer-detail-popover";

function renderPopover(overrides: Partial<TimerDetailPopoverProps> = {}) {
  const onCancelDiscard = vi.fn();
  const onConfirmDiscard = vi.fn();
  const onDiscard = vi.fn();
  const onDismissIdle = vi.fn();
  const onTrimIdle = vi.fn();

  render(
    <TimerDetailPopover
      elapsedSeconds={DEMO_ELAPSED_SECONDS}
      error={null}
      idle={null}
      isBusy={false}
      isConfirmingDiscard={false}
      missionName="OGF front"
      missionSubtitle="Catamania · 550 €/j"
      note=""
      onCancelDiscard={onCancelDiscard}
      onChangeNote={vi.fn()}
      onConfirmDiscard={onConfirmDiscard}
      onDiscard={onDiscard}
      onDismissIdle={onDismissIdle}
      onStop={vi.fn()}
      onTogglePause={vi.fn()}
      onTrimIdle={onTrimIdle}
      startedAt={DEMO_TIMER.startedAt}
      state={DEMO_TIMER.state}
      {...overrides}
    />,
  );

  return {
    onCancelDiscard,
    onConfirmDiscard,
    onDiscard,
    onDismissIdle,
    onTrimIdle,
  };
}

const IDLE_25_MIN = { idleMinutes: 25, idleSeconds: 1500, key: 1 };

it("names what the popover is about, not just its state", () => {
  renderPopover();

  expect(screen.getByText("Suivi en cours")).toBeInTheDocument();
});

it("says the timer is paused when it is", () => {
  renderPopover({ state: 1 });

  expect(screen.getByText("Suivi en pause")).toBeInTheDocument();
});

it("labels the start time rather than showing a bare clock", () => {
  renderPopover();

  expect(screen.getByText(/^démarré \d{2}:\d{2}$/)).toBeInTheDocument();
});

it("identifies the mission by its client, not the client's type", () => {
  renderPopover({ missionSubtitle: "Catamania · 550 €/j" });

  expect(screen.getByText(/Catamania · 550 €\/j/)).toBeInTheDocument();
});

it("says nothing about idleness while the user is active", () => {
  renderPopover();

  expect(screen.queryByText(/Inactivité/)).not.toBeInTheDocument();
});

it("names the measured idle span rather than the threshold", () => {
  renderPopover({ idle: IDLE_25_MIN });

  expect(
    screen.getByText("Inactivité détectée : 25 min sans activité."),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Retirer 25 min" }),
  ).toBeInTheDocument();
});

it("trims the idle span on request", () => {
  const { onTrimIdle } = renderPopover({ idle: IDLE_25_MIN });

  fireEvent.click(screen.getByRole("button", { name: "Retirer 25 min" }));

  expect(onTrimIdle).toHaveBeenCalledTimes(1);
});

it("keeps the idle span when the user says so", () => {
  const { onDismissIdle, onTrimIdle } = renderPopover({ idle: IDLE_25_MIN });

  fireEvent.click(screen.getByRole("button", { name: "Garder" }));

  expect(onDismissIdle).toHaveBeenCalledTimes(1);
  expect(onTrimIdle).not.toHaveBeenCalled();
});

/** Throwing away a session is destructive: one click must not do it. */
it("asks before discarding rather than discarding on the first click", () => {
  const { onConfirmDiscard, onDiscard } = renderPopover();

  fireEvent.click(
    screen.getByRole("button", { name: "Abandonner sans enregistrer" }),
  );

  expect(onDiscard).toHaveBeenCalledTimes(1);
  expect(onConfirmDiscard).not.toHaveBeenCalled();
});

it("discards only from the confirmation", () => {
  const { onConfirmDiscard } = renderPopover({ isConfirmingDiscard: true });

  expect(
    screen.queryByRole("button", { name: "Abandonner sans enregistrer" }),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Confirmer l'abandon" }));

  expect(onConfirmDiscard).toHaveBeenCalledTimes(1);
});

it("offers to resume rather than pause once paused", () => {
  renderPopover({ state: 1 });

  expect(screen.getByRole("button", { name: "Reprendre" })).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Mettre en pause" }),
  ).not.toBeInTheDocument();
});

it("locks the write actions while one is in flight", () => {
  renderPopover({ isBusy: true });

  expect(
    screen.getByRole("button", { name: "Arrêter et enregistrer" }),
  ).toBeDisabled();
});

it("surfaces a refused write next to the controls", () => {
  renderPopover({ error: "Aucun suivi n'est en cours." });

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Aucun suivi n'est en cours.",
  );
});
