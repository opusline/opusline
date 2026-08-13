import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { craItem } from "../lib/fixtures";
import { CraPicker } from "./cra-picker";

const items = [
  craItem({ id: null, month: "2026-08", status: 0 }),
  craItem({ id: 1, month: "2026-07", status: 1 }),
  craItem({
    id: 2,
    missionId: 20,
    missionName: "Lunaprint maintenance",
    clientName: "Lunaprint",
    month: "2026-06",
    status: 2,
  }),
];

function renderPicker(
  overrides: Partial<React.ComponentProps<typeof CraPicker>> = {},
) {
  const onPick = vi.fn();
  const onQueryChange = vi.fn();

  render(
    <CraPicker
      counts={{ toProduce: 1, sent: 1, signed: 1 }}
      items={items}
      onPick={onPick}
      onQueryChange={onQueryChange}
      query=""
      selectedKey={null}
      {...overrides}
    />,
  );

  return { onPick, onQueryChange };
}

it("files each CRA under what it is waiting on", () => {
  renderPicker();

  expect(screen.getByText("À produire")).toBeInTheDocument();
  expect(screen.getByText("En attente de signature")).toBeInTheDocument();
  expect(screen.getByText("Signés")).toBeInTheDocument();
});

it("counts what is still owed", () => {
  renderPicker();

  expect(screen.getByText("1 à produire")).toBeInTheDocument();
});

it("says nothing about a counter at zero", () => {
  renderPicker({ counts: { toProduce: 0, sent: 1, signed: 1 } });

  expect(screen.queryByText("0 à produire")).not.toBeInTheDocument();
});

it("names the client and the month under each mission", () => {
  renderPicker();

  expect(screen.getByText("Nordlys · Juillet 2026")).toBeInTheDocument();
});

it("reports what was typed rather than filtering on its own", () => {
  const { onQueryChange } = renderPicker();

  fireEvent.change(screen.getByRole("textbox", { name: /rechercher/i }), {
    target: { value: "luna" },
  });

  expect(onQueryChange).toHaveBeenCalledWith("luna");
});

it("narrows to what the search matches", () => {
  renderPicker({ query: "lunaprint" });

  expect(screen.getByText("Lunaprint maintenance")).toBeInTheDocument();
  expect(screen.queryByText("Callisto front")).not.toBeInTheDocument();
});

it("explains an empty result rather than showing nothing", () => {
  renderPicker({ query: "zzz" });

  expect(screen.getByText("Aucun CRA ne correspond")).toBeInTheDocument();
});

it("opens the CRA it was asked to open", () => {
  const { onPick } = renderPicker();

  fireEvent.click(
    screen.getByRole("button", { name: /Lunaprint maintenance/ }),
  );

  expect(onPick).toHaveBeenCalledWith(
    expect.objectContaining({ missionId: 20 }),
  );
});

it("can open a month that has no CRA behind it yet", () => {
  const { onPick } = renderPicker();

  fireEvent.click(screen.getByRole("button", { name: /Août 2026/ }));

  expect(onPick).toHaveBeenCalledWith(expect.objectContaining({ id: null }));
});

it("marks the CRA currently open", () => {
  renderPicker({ selectedKey: "10:2026-07" });

  expect(screen.getByRole("button", { name: /Juillet 2026/ })).toHaveAttribute(
    "aria-current",
    "true",
  );
});
