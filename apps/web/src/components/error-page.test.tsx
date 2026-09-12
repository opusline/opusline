import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { m } from "@/paraglide/messages.js";
import { StoryRouter } from "@/test/story-router";
import { ErrorPage } from "./error-page";

it("retries by resetting the boundary", async () => {
  const reset = vi.fn();
  render(
    <StoryRouter>
      <ErrorPage error={new Error("boom")} reset={reset} />
    </StoryRouter>,
  );

  fireEvent.click(await screen.findByRole("button", { name: m.error_retry() }));

  expect(reset).toHaveBeenCalledOnce();
});
