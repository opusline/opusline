import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { ModeToggle } from "./mode-toggle";

it("offers all three preferences, système included", async () => {
  render(<ModeToggle onChange={vi.fn()} resolvedTheme="dark" theme="system" />);

  fireEvent.click(screen.getByRole("button", { name: "Choisir le thème" }));

  expect(
    await screen.findByRole("menuitemradio", { name: "Système" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("menuitemradio", { name: "Clair" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("menuitemradio", { name: "Sombre" }),
  ).toBeInTheDocument();
});

it("hands back système, so an explicit theme is never a one-way door", async () => {
  const onChange = vi.fn();
  render(
    <ModeToggle onChange={onChange} resolvedTheme="light" theme="light" />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Choisir le thème" }));
  fireEvent.click(
    await screen.findByRole("menuitemradio", { name: "Système" }),
  );

  expect(onChange).toHaveBeenCalledWith("system");
});

it("checks the saved preference, not the resolved theme", async () => {
  render(<ModeToggle onChange={vi.fn()} resolvedTheme="dark" theme="system" />);

  fireEvent.click(screen.getByRole("button", { name: "Choisir le thème" }));

  expect(
    await screen.findByRole("menuitemradio", { name: "Système" }),
  ).toHaveAttribute("aria-checked", "true");
  expect(screen.getByRole("menuitemradio", { name: "Sombre" })).toHaveAttribute(
    "aria-checked",
    "false",
  );
});
