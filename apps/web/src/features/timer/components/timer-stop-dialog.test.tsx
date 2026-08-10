import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { defaultStopOption, stopChoices } from "../lib/rounding";
import {
  DEMO_ELAPSED_SECONDS,
  DEMO_MISSIONS,
  DEMO_WORKDAY_MINUTES,
} from "../lib/timer-fixtures";
import {
  TimerStopDialog,
  type TimerStopDialogProps,
} from "./timer-stop-dialog";

const HALF_DAY_MISSION = { ...DEMO_MISSIONS.ogf, rounding: 0 as const };
const { options: OPTIONS } = stopChoices(
  DEMO_ELAPSED_SECONDS,
  HALF_DAY_MISSION,
  DEMO_WORKDAY_MINUTES,
);

function renderDialog(overrides: Partial<TimerStopDialogProps> = {}) {
  const onChangeBillable = vi.fn();
  const onSelectRounding = vi.fn();
  const onSubmit = vi.fn();

  render(
    <TimerStopDialog
      billable
      droppedMinutes={0}
      clockLabel="03:42:18"
      dateLabel="jeudi 30 juillet"
      error={null}
      isSaving={false}
      missionName="OGF front"
      missionRoundingLabel="0,5 j"
      note=""
      noteSuggestions={["Revue PR", "Cadrage V2"]}
      onChangeBillable={onChangeBillable}
      onChangeNote={vi.fn()}
      onOpenChange={vi.fn()}
      onSelectRounding={onSelectRounding}
      onSubmit={onSubmit}
      open
      options={OPTIONS}
      selectedKey={defaultStopOption(OPTIONS).key}
      {...overrides}
    />,
  );

  return { onChangeBillable, onSelectRounding, onSubmit };
}

it("leads with the value the mission itself would give", () => {
  renderDialog();

  expect(screen.getByRole("button", { name: /1 j/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

it("marks that choice as the mission's default", () => {
  renderDialog();

  expect(screen.getByText("Défaut")).toBeInTheDocument();
});

it("names the rounding the mission is set to", () => {
  renderDialog();

  expect(screen.getByText("mission : 0,5 j")).toBeInTheDocument();
});

it("offers the exact time as the way to deviate", () => {
  renderDialog();

  expect(screen.getByRole("button", { name: /3,70 h/ })).toBeInTheDocument();
});

it("warns that deviating affects this entry only", () => {
  renderDialog({ selectedKey: "exact" });

  expect(
    screen.getByText(
      "Vous dérogez à l'arrondi 0,5 j de cette mission, pour cette entrée seulement.",
    ),
  ).toBeInTheDocument();
});

it("says nothing about deviating while the default is selected", () => {
  renderDialog();

  expect(screen.queryByText(/Vous dérogez/)).not.toBeInTheDocument();
});

it("submits the mission's rounding as an inherited one", () => {
  const { onSubmit } = renderDialog();

  fireEvent.click(screen.getByRole("button", { name: /Enregistrer/ }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ minutes: 222, rounding: null }),
  );
});

it("submits an explicit rounding when the entry deviates", () => {
  const { onSubmit } = renderDialog({ selectedKey: "exact" });

  fireEvent.click(screen.getByRole("button", { name: /Enregistrer/ }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ minutes: 222, rounding: 2 }),
  );
});

it("reports the rounding choice back up", () => {
  const { onSelectRounding } = renderDialog();

  fireEvent.click(screen.getByRole("button", { name: /3,70 h/ }));

  expect(onSelectRounding).toHaveBeenCalledWith("exact");
});

it("summarises the session on the day it started", () => {
  renderDialog();

  expect(
    screen.getByText("03:42:18 sur OGF front · jeudi 30 juillet"),
  ).toBeInTheDocument();
});

it("says so in the summary when the entry will not be billed", () => {
  renderDialog({ billable: false });

  expect(
    screen.getByText(
      "03:42:18 sur OGF front · jeudi 30 juillet · non facturable",
    ),
  ).toBeInTheDocument();
});

it("previews what the entry will be worth", () => {
  renderDialog();

  expect(screen.getByText("550,00 €")).toBeInTheDocument();
});

it("previews the smaller amount once the entry deviates", () => {
  renderDialog({ selectedKey: "exact" });

  expect(screen.getByText("290,71 €")).toBeInTheDocument();
});

it("shows no amount for an entry taken off the invoice", () => {
  renderDialog({ billable: false });

  expect(screen.getAllByText("non facturable").length).toBeGreaterThan(0);
});

it("takes the entry off the invoice", () => {
  const { onChangeBillable } = renderDialog();

  fireEvent.click(screen.getByRole("checkbox", { name: "Non facturable" }));

  expect(onChangeBillable).toHaveBeenCalledWith(false);
});

it("offers notes already used elsewhere", () => {
  renderDialog();

  expect(screen.getByRole("button", { name: /Revue PR/ })).toBeInTheDocument();
});

it("surfaces a refused save without closing", () => {
  renderDialog({ error: "Le suivi n'existe plus." });

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Le suivi n'existe plus.",
  );
});
