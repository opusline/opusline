import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { expect, it, vi } from "vitest";

import { DateField } from "./date-field";
import { MoneyFormatProvider } from "./money-format-provider";

function renderField(
  props: Partial<React.ComponentProps<typeof DateField>> = {},
  dateFormat: 0 | 1 = 0,
) {
  const onChange = vi.fn();

  render(
    <MoneyFormatProvider currency="EUR" dateFormat={dateFormat} locale="fr-FR">
      <DateField
        onChange={onChange}
        value=""
        {...props}
        aria-label="Date"
        id="date"
      />
    </MoneyFormatProvider>,
  );

  return onChange;
}

function field(): HTMLElement {
  return screen.getByLabelText("Date");
}

it("shows a date in the account's layout, not the browser's", () => {
  renderField({ value: "2026-08-21" });

  expect(field()).toHaveValue("21/08/2026");
});

it("hints the layout it expects while empty", () => {
  renderField();

  expect(field()).toHaveAttribute("placeholder", "JJ/MM/AAAA");
});

it("follows the ISO layout when that is the account's preference", () => {
  const onChange = renderField({ value: "2026-08-21" }, 1);

  expect(field()).toHaveValue("2026-08-21");
  expect(field()).toHaveAttribute("placeholder", "AAAA-MM-JJ");

  fireEvent.change(field(), { target: { value: "2026-07-09" } });

  expect(onChange).toHaveBeenLastCalledWith("2026-07-09");
});

it("takes a day typed without a leading zero", () => {
  const onChange = renderField();

  fireEvent.change(field(), { target: { value: "1/8/2026" } });

  expect(onChange).toHaveBeenLastCalledWith("2026-08-01");
});

it("reports a typed date as the Y-m-d the API speaks", () => {
  const onChange = renderField();

  fireEvent.change(field(), { target: { value: "21/08/2026" } });

  expect(onChange).toHaveBeenLastCalledWith("2026-08-21");
});

it("reads a half-typed date as no date rather than erroring", () => {
  const onChange = renderField();

  fireEvent.change(field(), { target: { value: "21/08" } });

  expect(onChange).toHaveBeenLastCalledWith("");
  // The draft survives: emitting "" must not wipe what is being typed.
  expect(field()).toHaveValue("21/08");
});

it("refuses a day that does not exist", () => {
  const onChange = renderField();

  fireEvent.change(field(), { target: { value: "31/02/2026" } });

  expect(onChange).toHaveBeenLastCalledWith("");
});

it("refuses a typed date outside the window the calendar allows", () => {
  const onChange = renderField({ max: "2026-08-21", min: "2026-08-01" });

  fireEvent.change(field(), { target: { value: "22/08/2026" } });

  expect(onChange).toHaveBeenLastCalledWith("");
});

/** A parent that accepts the change, the way every real call site does. */
function Controlled({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = useState("2026-08-21");

  return (
    <MoneyFormatProvider currency="EUR" dateFormat={0} locale="fr-FR">
      <DateField
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

it("picks a day from the calendar and shows it back in the field", async () => {
  const onChange = vi.fn();
  render(<Controlled onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: "Ouvrir le calendrier" }));

  const calendar = await screen.findByRole("dialog");
  fireEvent.click(within(calendar).getByText("19"));

  expect(onChange).toHaveBeenLastCalledWith("2026-08-19");
  // The draft is reseeded from the pick, in the account's own layout.
  expect(field()).toHaveValue("19/08/2026");
});
