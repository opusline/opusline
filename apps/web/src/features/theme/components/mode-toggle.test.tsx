import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { ModeToggle } from "./mode-toggle";

it("switches to light when the resolved theme is dark", () => {
  const onChange = vi.fn();
  render(<ModeToggle onChange={onChange} resolvedTheme="dark" />);

  fireEvent.click(screen.getByRole("button"));

  expect(onChange).toHaveBeenCalledWith("light");
});

it("switches to dark when the resolved theme is light", () => {
  const onChange = vi.fn();
  render(<ModeToggle onChange={onChange} resolvedTheme="light" />);

  fireEvent.click(screen.getByRole("button"));

  expect(onChange).toHaveBeenCalledWith("dark");
});

it("names the action it will take", () => {
  render(<ModeToggle onChange={vi.fn()} resolvedTheme="dark" />);

  expect(
    screen.getByRole("button", { name: "Passer en thème clair" }),
  ).toBeInTheDocument();
});
