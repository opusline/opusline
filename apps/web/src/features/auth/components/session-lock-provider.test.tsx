import { client } from "@opusline/api-client/client";
import { currentUserQueryKey } from "@opusline/api-client/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { setupApiClient } from "@/lib/api";
import { reportSessionExpired } from "@/lib/session-lock";
import { CURRENT_USER_FIXTURE, seedCurrentUser } from "@/test/current-user";
import { StoryRouter } from "@/test/story-router";
import { SessionLockProvider } from "./session-lock-provider";

setupApiClient();
// The interceptors are the subject here — a 401 has to reach the lock — but the
// app's relative "/api" base is a browser trick Node's Request cannot repeat.
client.setConfig({ baseUrl: "http://localhost/api" });

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/** Routes are matched in insertion order, so /login must come after the longer paths. */
function stubApi(routes: Record<string, () => Response>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = input instanceof Request ? input.url : String(input);

      if (url.includes("csrf-cookie")) {
        return new Response(null, { status: 204 });
      }

      const route = Object.entries(routes).find(([path]) => url.includes(path));

      if (route === undefined) {
        throw new Error(`Unstubbed request: ${url}`);
      }

      return route[1]();
    }),
  );
}

// The memory router only paints after its first tick, so every render awaits it.
async function renderApp({ signedIn = true } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  if (signedIn) {
    seedCurrentUser(queryClient);
  }

  render(
    <QueryClientProvider client={queryClient}>
      <StoryRouter>
        <SessionLockProvider>
          <p>Ma semaine</p>
        </SessionLockProvider>
      </StoryRouter>
    </QueryClientProvider>,
  );

  await screen.findByText("Ma semaine");

  return queryClient;
}

function unlockWith(password: string) {
  fireEvent.change(screen.getByLabelText(/^mot de passe$/i), {
    target: { value: password },
  });
  fireEvent.submit(screen.getByRole("button", { name: /déverrouiller/i }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("covers the app when the API says the session is gone", async () => {
  await renderApp();

  act(() => reportSessionExpired());

  expect(await screen.findByRole("dialog")).toHaveAccessibleName(
    /session expirée/i,
  );
  expect(screen.getByText("Ma semaine")).toBeInTheDocument();
});

it("leaves a signed-out visitor to the login redirect", async () => {
  await renderApp({ signedIn: false });

  act(() => reportSessionExpired());

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("unlocks on a confirmed password, without signing in again", async () => {
  const login = vi.fn(() => jsonResponse(200, CURRENT_USER_FIXTURE));
  stubApi({
    "confirm-password": () => new Response(null, { status: 204 }),
    "/login": login,
  });
  await renderApp();
  act(() => reportSessionExpired());

  unlockWith("secret-password");

  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(login).not.toHaveBeenCalled();
});

it("signs back in when the session is too dead to confirm a password", async () => {
  stubApi({
    "confirm-password": () =>
      jsonResponse(401, { message: "Unauthenticated." }),
    "/login": () => jsonResponse(200, CURRENT_USER_FIXTURE),
  });
  const queryClient = await renderApp();
  act(() => reportSessionExpired());

  unlockWith("secret-password");

  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(queryClient.getQueryData(currentUserQueryKey())).toBeDefined();
});

it("keeps the lock up on a wrong password", async () => {
  stubApi({
    "confirm-password": () =>
      jsonResponse(422, {
        message: "x",
        errors: { password: ["Le mot de passe est incorrect."] },
      }),
  });
  await renderApp();
  act(() => reportSessionExpired());

  unlockWith("wrong");

  expect(
    await screen.findByText("Le mot de passe est incorrect."),
  ).toBeInTheDocument();
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
