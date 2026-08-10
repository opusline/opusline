import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { BillableToggle } from "./billable-toggle";

const toggle = () => screen.getByRole("checkbox", { name: "Non facturable" });

it("leaves the box unticked while the entry still bills", () => {
  render(<BillableToggle billable onChange={vi.fn()} />);

  expect(toggle()).not.toBeChecked();
});

it("ticks the box once the entry is off the invoice", () => {
  render(<BillableToggle billable={false} onChange={vi.fn()} />);

  expect(toggle()).toBeChecked();
});

it("puts the entry back on the invoice when the box is unticked", () => {
  const onChange = vi.fn();

  render(<BillableToggle billable={false} onChange={onChange} />);
  fireEvent.click(toggle());

  expect(onChange).toHaveBeenCalledWith(true);
});
