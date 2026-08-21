import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { DateField } from "./date-field";

function renderField(
  props: Partial<React.ComponentProps<typeof DateField>> = {},
) {
  const onChange = vi.fn();

  render(
    <DateField
      onChange={onChange}
      value=""
      {...props}
      aria-label="Date"
      id="date"
    />,
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

it("opens a calendar to pick from", () => {
  renderField({ value: "2026-08-21" });

  fireEvent.click(screen.getByRole("button", { name: "Ouvrir le calendrier" }));

  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
