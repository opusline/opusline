import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { expect, it, vi } from "vitest";

import { DateField } from "./date-field";
import { MoneyFormatProvider } from "./money-format-provider";

/** A parent that accepts the change, the way every real call site does. */
function Controlled({
  onChange,
  initial = "",
  ...props
}: Partial<React.ComponentProps<typeof DateField>> & {
  onChange: (value: string) => void;
  initial?: string;
}) {
  const [value, setValue] = useState(initial);

  return (
    <MoneyFormatProvider currency="EUR" locale="fr-FR">
      <DateField
        {...props}
        aria-label="Date"
        id="date"
        onChange={(next) => {
          setValue(next);
          onChange(next);
        }}
        value={value}
      />
    </MoneyFormatProvider>
  );
}

function renderField(
  props: Partial<React.ComponentProps<typeof DateField>> & {
    initial?: string;
  } = {},
) {
  const onChange = vi.fn();
  render(<Controlled onChange={onChange} {...props} />);

  return onChange;
}

function field(): HTMLElement {
  return screen.getByLabelText("Date");
}

async function openCalendar(): Promise<HTMLElement> {
  fireEvent.click(field());

  return await screen.findByRole("grid");
}

it("spells the date out rather than showing digits to be decoded", () => {
  renderField({ initial: "2026-08-21" });

  expect(field()).toHaveTextContent("21 août 2026");
});

it("says nothing is picked while it is empty", () => {
  renderField();

  expect(field()).toHaveTextContent("Choisir une date");
});

it("picks a day from the calendar", async () => {
  const onChange = renderField({ initial: "2026-08-21" });

  const calendar = await openCalendar();
  fireEvent.click(within(calendar).getByText("19"));

  expect(onChange).toHaveBeenLastCalledWith("2026-08-19");
  expect(field()).toHaveTextContent("19 août 2026");
});

it("will not pick a day outside the window it was given", async () => {
  const onChange = renderField({
    initial: "2026-08-21",
    max: "2026-08-21",
    min: "2026-08-01",
  });

  const calendar = await openCalendar();
  fireEvent.click(within(calendar).getByText("22"));

  expect(onChange).not.toHaveBeenCalled();
  expect(field()).toHaveTextContent("21 août 2026");
});

it("offers no way to empty a date the form requires", async () => {
  renderField({ initial: "2026-08-21" });

  await openCalendar();

  expect(
    screen.queryByRole("button", { name: "Effacer la date" }),
  ).not.toBeInTheDocument();
});

it("empties a date the form lets go", async () => {
  const onChange = renderField({ clearable: true, initial: "2026-08-21" });

  await openCalendar();
  fireEvent.click(screen.getByRole("button", { name: "Effacer la date" }));

  expect(onChange).toHaveBeenLastCalledWith("");
  expect(field()).toHaveTextContent("Choisir une date");
});

it("has nothing to clear while it is already empty", async () => {
  renderField({ clearable: true });

  await openCalendar();

  expect(
    screen.queryByRole("button", { name: "Effacer la date" }),
  ).not.toBeInTheDocument();
});
