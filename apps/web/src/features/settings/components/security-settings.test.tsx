import { showTwoFactorQueryKey } from "@opusline/api-client/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { MoneyFormatProvider } from "@/components/money-format-provider";
import {
  recoveryCodesFixture,
  totpSetupFixture,
  twoFactorOffFixture,
  twoFactorOnFixture,
} from "../lib/security-fixture";
import { SecuritySettings } from "./security-settings";

type Route = { method: string; path: string; status: number; body?: unknown };

/** Answers the API calls the tab makes; unmatched requests fail loudly. */
function stubApi(routes: Route[]): { calls: () => string[] } {
  const calls: string[] = [];

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      const path = new URL(request.url, "http://localhost").pathname;

      if (path.endsWith("/sanctum/csrf-cookie")) {
        return new Response(null, { status: 204 });
      }

      calls.push(`${request.method} ${path}`);

      const route = routes.find(
        (candidate) =>
          candidate.method === request.method && path.endsWith(candidate.path),
      );

      if (route === undefined) {
        throw new Error(`Unexpected request: ${request.method} ${path}`);
      }

      return new Response(
        route.body === undefined ? null : JSON.stringify(route.body),
        {
          status: route.status,
          headers:
            route.body === undefined
              ? {}
              : { "Content-Type": "application/json" },
        },
      );
    }),
  );

  return { calls: () => calls };
}

type TabProps = React.ComponentProps<typeof SecuritySettings>;

function renderTab(
  status: typeof twoFactorOnFixture | null,
  guarded: TabProps["guarded"] = async (action) => ({
    status: "done",
    value: await action(),
  }),
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  if (status !== null) {
    queryClient.setQueryData(showTwoFactorQueryKey(), status);
  }

  render(
    <QueryClientProvider client={queryClient}>
      <MoneyFormatProvider currency="EUR" dateFormat={0} locale="fr-FR">
        <SecuritySettings guarded={guarded} />
      </MoneyFormatProvider>
    </QueryClientProvider>,
  );
}

function confirmAlertDialog(dialog: HTMLElement) {
  fireEvent.click(
    dialog.querySelector("[data-slot=alert-dialog-action]") as HTMLElement,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("says so when the status cannot be loaded", async () => {
  stubApi([
    {
      method: "GET",
      path: "/user/two-factor",
      status: 500,
      body: { message: "Boom" },
    },
  ]);
  renderTab(null);

  expect(await screen.findByRole("alert")).toHaveTextContent("Boom");
});

it("enrols the authenticator: scan, confirm, save the codes", async () => {
  const api = stubApi([
    {
      method: "POST",
      path: "/user/two-factor/totp",
      status: 200,
      body: totpSetupFixture,
    },
    {
      method: "POST",
      path: "/user/two-factor/totp/confirm",
      status: 200,
      body: { codes: recoveryCodesFixture },
    },
    {
      method: "GET",
      path: "/user/two-factor",
      status: 200,
      body: twoFactorOnFixture,
    },
  ]);
  renderTab(twoFactorOffFixture);

  fireEvent.click(screen.getByRole("button", { name: "Activer" }));

  expect(
    await screen.findByRole("img", { name: /qr code à scanner/i }),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/code à six chiffres/i), {
    target: { value: "482913" },
  });

  expect(
    await screen.findByRole("list", { name: "Codes de secours" }),
  ).toBeInTheDocument();
  expect(api.calls()).toContain("POST /api/user/two-factor/totp/confirm");

  fireEvent.click(
    screen.getByRole("button", { name: /j'ai enregistré mes codes/i }),
  );

  await waitFor(() =>
    expect(
      screen.queryByRole("list", { name: "Codes de secours" }),
    ).not.toBeInTheDocument(),
  );
});

it("keeps the setup dialog open on a wrong code", async () => {
  stubApi([
    {
      method: "POST",
      path: "/user/two-factor/totp",
      status: 200,
      body: totpSetupFixture,
    },
    {
      method: "POST",
      path: "/user/two-factor/totp/confirm",
      status: 422,
      body: {
        message: "x",
        errors: { code: ["Le code est invalide ou a expiré."] },
      },
    },
  ]);
  renderTab(twoFactorOffFixture);

  fireEvent.click(screen.getByRole("button", { name: "Activer" }));
  fireEvent.change(await screen.findByLabelText(/code à six chiffres/i), {
    target: { value: "000000" },
  });

  expect(
    await screen.findByText("Le code est invalide ou a expiré."),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: /qr code à scanner/i }),
  ).toBeInTheDocument();
});

it("closes the setup and reports on the card when the confirm is refused outright", async () => {
  stubApi([
    {
      method: "POST",
      path: "/user/two-factor/totp",
      status: 200,
      body: totpSetupFixture,
    },
    {
      method: "POST",
      path: "/user/two-factor/totp/confirm",
      status: 409,
      body: { message: "Déjà activée." },
    },
    {
      method: "GET",
      path: "/user/two-factor",
      status: 200,
      body: twoFactorOnFixture,
    },
  ]);
  renderTab(twoFactorOffFixture);

  fireEvent.click(screen.getByRole("button", { name: "Activer" }));
  fireEvent.change(await screen.findByLabelText(/code à six chiffres/i), {
    target: { value: "482913" },
  });

  expect(await screen.findByRole("alert")).toHaveTextContent("Déjà activée.");
  await waitFor(() =>
    expect(
      screen.queryByRole("img", { name: /qr code à scanner/i }),
    ).not.toBeInTheDocument(),
  );
});

it("does nothing when the password dialog is dismissed before the setup", async () => {
  const api = stubApi([]);
  renderTab(twoFactorOffFixture, async () => ({ status: "cancelled" }));

  fireEvent.click(screen.getByRole("button", { name: "Activer" }));

  await waitFor(() =>
    expect(api.calls()).not.toContain("POST /api/user/two-factor/totp"),
  );
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("reports a setup that could not start", async () => {
  stubApi([
    {
      method: "POST",
      path: "/user/two-factor/totp",
      status: 500,
      body: { message: "Boom" },
    },
  ]);
  renderTab(twoFactorOffFixture);

  fireEvent.click(screen.getByRole("button", { name: "Activer" }));

  expect(await screen.findByRole("alert")).toHaveTextContent("Boom");
});

it("regenerates the recovery codes and shows them once", async () => {
  stubApi([
    {
      method: "POST",
      path: "/user/two-factor/recovery-codes",
      status: 200,
      body: { codes: recoveryCodesFixture },
    },
    {
      method: "GET",
      path: "/user/two-factor",
      status: 200,
      body: twoFactorOnFixture,
    },
  ]);
  renderTab(twoFactorOnFixture);

  fireEvent.click(
    screen.getByRole("button", { name: "Nouveaux codes de secours" }),
  );
  confirmAlertDialog(await screen.findByRole("alertdialog"));

  expect(
    await screen.findByRole("list", { name: "Codes de secours" }),
  ).toBeInTheDocument();
});

it("turns the authenticator off and refreshes the status", async () => {
  const api = stubApi([
    { method: "DELETE", path: "/user/two-factor/totp", status: 204 },
    {
      method: "GET",
      path: "/user/two-factor",
      status: 200,
      body: twoFactorOffFixture,
    },
  ]);
  renderTab(twoFactorOnFixture);

  fireEvent.click(screen.getByRole("button", { name: "Désactiver" }));
  confirmAlertDialog(await screen.findByRole("alertdialog"));

  await waitFor(() =>
    expect(api.calls()).toContain("DELETE /api/user/two-factor/totp"),
  );
  expect(
    await screen.findByRole("button", { name: "Activer" }),
  ).toBeInTheDocument();
});

it("revokes one browser, then all of them", async () => {
  const api = stubApi([
    { method: "DELETE", path: "/user/trusted-devices/2", status: 204 },
    { method: "DELETE", path: "/user/trusted-devices", status: 204 },
    {
      method: "GET",
      path: "/user/two-factor",
      status: 200,
      body: twoFactorOnFixture,
    },
  ]);
  renderTab(twoFactorOnFixture);

  fireEvent.click(screen.getAllByRole("button", { name: "Révoquer" })[1]);
  confirmAlertDialog(await screen.findByRole("alertdialog"));
  await waitFor(() =>
    expect(api.calls()).toContain("DELETE /api/user/trusted-devices/2"),
  );

  fireEvent.click(screen.getByRole("button", { name: "Tout révoquer" }));
  confirmAlertDialog(await screen.findByRole("alertdialog"));
  await waitFor(() =>
    expect(api.calls()).toContain("DELETE /api/user/trusted-devices"),
  );
});

it("reports a failed revocation on its card", async () => {
  stubApi([
    {
      method: "DELETE",
      path: "/user/trusted-devices/1",
      status: 500,
      body: { message: "Boom" },
    },
  ]);
  renderTab(twoFactorOnFixture);

  fireEvent.click(screen.getAllByRole("button", { name: "Révoquer" })[0]);
  confirmAlertDialog(await screen.findByRole("alertdialog"));

  expect(await screen.findByRole("alert")).toHaveTextContent("Boom");
});
