import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { expect, it, vi } from "vitest";
import { MoneyFormatProvider } from "./money-format-provider";
import { MonthField } from "./month-field";

function renderField(
  props: Partial<React.ComponentProps<typeof MonthField>> = {},
) {
  const onChange = vi.fn();

  render(
    <MoneyFormatProvider currency="EUR" dateFormat={0} locale="fr-FR">
      <MonthField
        defaultMonth="2026-08"
        onChange={onChange}
        value=""
        {...props}
        aria-label="Période"
        id="period"
      />
    </MoneyFormatProvider>,
  );

  return onChange;
}

function trigger(): HTMLElement {
  return screen.getByLabelText("Période");
}

it("names the month it is holding, in the account's language", () => {
  renderField({ value: "2026-08" });

  expect(trigger()).toHaveTextContent("Août 2026");
});

it("asks for a month while it holds none", () => {
  renderField();

  expect(trigger()).toHaveTextContent("Choisir un mois");
});

it("reports a picked month as the Y-m the API speaks", async () => {
  const onChange = renderField();

  fireEvent.click(trigger());

  const grid = await screen.findByRole("dialog");
  fireEvent.click(within(grid).getByRole("button", { name: "Août 2026" }));

  expect(onChange).toHaveBeenLastCalledWith("2026-08");
});

it("opens on the year of the month it was given", async () => {
  renderField({ defaultMonth: "2024-01", value: "" });

  fireEvent.click(trigger());

  const grid = await screen.findByRole("dialog");

  expect(
    within(grid).getByRole("button", { name: "Janvier 2024" }),
  ).toBeInTheDocument();
});

it("walks back a year to reach an older month", async () => {
  const onChange = renderField();

  fireEvent.click(trigger());

  const grid = await screen.findByRole("dialog");
  fireEvent.click(
    within(grid).getByRole("button", { name: "Année précédente" }),
  );
  fireEvent.click(within(grid).getByRole("button", { name: "Décembre 2025" }));

  expect(onChange).toHaveBeenLastCalledWith("2025-12");
});

/** A parent that accepts the change, the way every real call site does. */
function Controlled() {
  const [value, setValue] = useState("");

  return (
    <MoneyFormatProvider currency="EUR" dateFormat={0} locale="fr-FR">
      <MonthField
        aria-label="Période"
        defaultMonth="2026-08"
        id="period"
        onChange={setValue}
        value={value}
      />
    </MoneyFormatProvider>
  );
}

it("closes on a pick and shows the month back on the trigger", async () => {
  render(<Controlled />);

  fireEvent.click(trigger());

  const grid = await screen.findByRole("dialog");
  fireEvent.click(within(grid).getByRole("button", { name: "Mars 2026" }));

  expect(trigger()).toHaveTextContent("Mars 2026");
});
