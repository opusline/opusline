import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { getRouter } from "@/router";
import { seedCurrentUser } from "@/test/current-user";
import { personalTransfer, treasuryData } from "@/test/fixtures";

type RecordedRequest = { method: string; path: string };

function stubApi(): RecordedRequest[] {
  const requests: RecordedRequest[] = [];
  const data = treasuryData({ transfers: [personalTransfer()] });

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      requests.push({
        method: request.method,
        path: new URL(request.url, "http://localhost").pathname,
      });

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }),
  );

  return requests;
}

async function renderTreasury() {
  window.history.replaceState(null, "", "/treasury");
  const router = getRouter();
  seedCurrentUser(router.options.context.queryClient);

  render(
    <QueryClientProvider client={router.options.context.queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  await screen.findByRole(
    "button",
    { name: "Supprimer le virement du 28/07/2026" },
    { timeout: 5000 },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

const isDeletion = (request: RecordedRequest) =>
  request.method === "DELETE" && request.path === "/api/treasury/transfers/1";

it("asks before deleting a transfer", async () => {
  const requests = stubApi();
  await renderTreasury();

  fireEvent.click(
    screen.getByRole("button", { name: "Supprimer le virement du 28/07/2026" }),
  );

  expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
  expect(requests.some(isDeletion)).toBe(false);
});

it("deletes the transfer once confirmed", async () => {
  const requests = stubApi();
  await renderTreasury();

  fireEvent.click(
    screen.getByRole("button", { name: "Supprimer le virement du 28/07/2026" }),
  );
  fireEvent.click(
    within(await screen.findByRole("alertdialog")).getByRole("button", {
      name: "Supprimer le virement",
    }),
  );

  await waitFor(() => expect(requests.some(isDeletion)).toBe(true));
});
