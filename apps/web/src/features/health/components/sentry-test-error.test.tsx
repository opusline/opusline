import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { m } from "@/paraglide/messages.js";
import { SentryTestError } from "./sentry-test-error";

it("throws from the click so the error reaches the global handlers", () => {
  const uncaught: unknown[] = [];
  const collect = (event: ErrorEvent) => {
    event.preventDefault();
    uncaught.push(event.error);
  };
  window.addEventListener("error", collect);

  try {
    render(<SentryTestError />);
    fireEvent.click(
      screen.getByRole("button", { name: m.health_sentry_test_button() }),
    );
  } finally {
    window.removeEventListener("error", collect);
  }

  expect(uncaught).toHaveLength(1);
  expect(uncaught[0]).toMatchObject({ name: "SentryTestError" });
});
