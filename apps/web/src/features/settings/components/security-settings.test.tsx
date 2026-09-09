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
  webAuthn: Partial<TabProps["webAuthn"]> = {},
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
        <SecuritySettings
          guarded={guarded}
          webAuthn={{
            isSupported: true,
            createPasskey: vi.fn().mockResolvedValue('{"id":"cred"}'),
            failure: () => null,
            ...webAuthn,
          }}
        />
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
  renderTab(twoFactorOffFixture, {}, async () => ({ status: "cancelled" }));

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

it("adds a passkey: options, browser ceremony, then the name", async () => {
  const createPasskey = vi.fn().mockResolvedValue('{"id":"cred-new"}');
  const api = stubApi([
    {
      method: "POST",
      path: "/user/passkeys/options",
      status: 200,
      body: { options: { challenge: "abc" } },
    },
    {
      method: "POST",
      path: "/user/passkeys",
      status: 201,
      body: { id: 3, name: "Ma clé d'accès" },
    },
    {
      method: "GET",
      path: "/user/two-factor",
      status: 200,
      body: twoFactorOnFixture,
    },
  ]);
  renderTab(twoFactorOffFixture, { createPasskey });

  fireEvent.click(
    screen.getByRole("button", { name: /ajouter une clé d'accès/i }),
  );

  const input = await screen.findByLabelText("Nom");
  expect(createPasskey).toHaveBeenCalledWith({ challenge: "abc" });
  expect(input).toHaveValue("Ma clé d'accès");

  fireEvent.change(input, { target: { value: "MacBook de Théo" } });
  fireEvent.submit(screen.getByRole("button", { name: "Enregistrer" }));

  await waitFor(() =>
    expect(api.calls()).toEqual(
      expect.arrayContaining([
        "POST /api/user/passkeys",
        "GET /api/user/two-factor",
      ]),
    ),
  );
  await waitFor(() =>
    expect(screen.queryByLabelText("Nom")).not.toBeInTheDocument(),
  );
});

it("stays quiet when the browser ceremony is cancelled", async () => {
  stubApi([
    {
      method: "POST",
      path: "/user/passkeys/options",
      status: 200,
      body: { options: {} },
    },
  ]);
  renderTab(twoFactorOffFixture, {
    createPasskey: vi.fn().mockRejectedValue(new Error("aborted")),
    failure: () => "cancelled",
  });

  fireEvent.click(
    screen.getByRole("button", { name: /ajouter une clé d'accès/i }),
  );

  await waitFor(() =>
    expect(screen.queryByLabelText("Nom")).not.toBeInTheDocument(),
  );
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("names a passkey the browser already holds", async () => {
  stubApi([
    {
      method: "POST",
      path: "/user/passkeys/options",
      status: 200,
      body: { options: {} },
    },
  ]);
  renderTab(twoFactorOffFixture, {
    createPasskey: vi.fn().mockRejectedValue(new Error("dup")),
    failure: () => "duplicate",
  });

  fireEvent.click(
    screen.getByRole("button", { name: /ajouter une clé d'accès/i }),
  );

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Cette clé d'accès est déjà enregistrée.",
  );
});

it("surfaces the server's refusal of the credential on the card", async () => {
  stubApi([
    {
      method: "POST",
      path: "/user/passkeys/options",
      status: 200,
      body: { options: {} },
    },
    {
      method: "POST",
      path: "/user/passkeys",
      status: 422,
      body: {
        message: "Cette clé d'accès n'a pas pu être vérifiée.",
        errors: { credential: ["Cette clé d'accès n'a pas pu être vérifiée."] },
      },
    },
  ]);
  renderTab(twoFactorOffFixture);

  fireEvent.click(
    screen.getByRole("button", { name: /ajouter une clé d'accès/i }),
  );
  fireEvent.submit(await screen.findByRole("button", { name: "Enregistrer" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Cette clé d'accès n'a pas pu être vérifiée.",
  );
  await waitFor(() =>
    expect(screen.queryByLabelText("Nom")).not.toBeInTheDocument(),
  );
});

it("renames and deletes through the API and refreshes the status", async () => {
  const api = stubApi([
    {
      method: "PUT",
      path: "/user/passkeys/1",
      status: 200,
      body: { id: 1, name: "Bureau" },
    },
    { method: "DELETE", path: "/user/passkeys/2", status: 204 },
    {
      method: "GET",
      path: "/user/two-factor",
      status: 200,
      body: twoFactorOnFixture,
    },
  ]);
  renderTab(twoFactorOnFixture);

  fireEvent.click(screen.getAllByRole("button", { name: "Renommer" })[0]);
  fireEvent.change(await screen.findByLabelText("Nom"), {
    target: { value: "Bureau" },
  });
  fireEvent.submit(screen.getByRole("button", { name: "Enregistrer" }));

  await waitFor(() =>
    expect(api.calls()).toContain("PUT /api/user/passkeys/1"),
  );

  fireEvent.click(screen.getAllByRole("button", { name: "Supprimer" })[1]);
  const dialog = await screen.findByRole("alertdialog");
  fireEvent.click(
    dialog.querySelector("[data-slot=alert-dialog-action]") as HTMLElement,
  );

  await waitFor(() =>
    expect(api.calls()).toContain("DELETE /api/user/passkeys/2"),
  );
  await waitFor(() =>
    expect(
      api.calls().filter((call) => call === "GET /api/user/two-factor").length,
    ).toBeGreaterThanOrEqual(2),
  );
});

it("does nothing when the password dialog is dismissed before the options", async () => {
  const api = stubApi([]);
  renderTab(twoFactorOffFixture, {}, async () => ({ status: "cancelled" }));

  fireEvent.click(
    screen.getByRole("button", { name: /ajouter une clé d'accès/i }),
  );

  await waitFor(() =>
    expect(api.calls()).not.toContain("POST /api/user/passkeys/options"),
  );
  expect(screen.queryByLabelText("Nom")).not.toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("keeps the naming dialog open when the password dialog is dismissed at save", async () => {
  stubApi([
    {
      method: "POST",
      path: "/user/passkeys/options",
      status: 200,
      body: { options: {} },
    },
  ]);
  let call = 0;
  renderTab(twoFactorOffFixture, {}, async (action) => {
    call += 1;
    return call === 1
      ? { status: "done", value: await action() }
      : { status: "cancelled" };
  });

  fireEvent.click(
    screen.getByRole("button", { name: /ajouter une clé d'accès/i }),
  );
  fireEvent.submit(await screen.findByRole("button", { name: "Enregistrer" }));

  await waitFor(() => expect(call).toBe(2));
  expect(screen.getByLabelText("Nom")).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("reports a browser failure on the card", async () => {
  stubApi([
    {
      method: "POST",
      path: "/user/passkeys/options",
      status: 200,
      body: { options: {} },
    },
  ]);
  renderTab(twoFactorOffFixture, {
    createPasskey: vi.fn().mockRejectedValue(new Error("nope")),
    failure: () => "failed",
  });

  fireEvent.click(
    screen.getByRole("button", { name: /ajouter une clé d'accès/i }),
  );

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "La clé d'accès n'a pas pu être créée. Réessayez.",
  );
});

it("shows the server's objection to the options on the card", async () => {
  stubApi([
    {
      method: "POST",
      path: "/user/passkeys/options",
      status: 409,
      body: { message: "Pas maintenant." },
    },
  ]);
  renderTab(twoFactorOffFixture);

  fireEvent.click(
    screen.getByRole("button", { name: /ajouter une clé d'accès/i }),
  );

  expect(await screen.findByRole("alert")).toHaveTextContent("Pas maintenant.");
});

it("puts a refused name back in the dialog", async () => {
  stubApi([
    {
      method: "POST",
      path: "/user/passkeys/options",
      status: 200,
      body: { options: {} },
    },
    {
      method: "POST",
      path: "/user/passkeys",
      status: 422,
      body: { message: "x", errors: { name: ["Ce nom est déjà pris."] } },
    },
  ]);
  renderTab(twoFactorOffFixture);

  fireEvent.click(
    screen.getByRole("button", { name: /ajouter une clé d'accès/i }),
  );
  fireEvent.submit(await screen.findByRole("button", { name: "Enregistrer" }));

  expect(await screen.findByText("Ce nom est déjà pris.")).toBeInTheDocument();
  expect(screen.getByLabelText("Nom")).toBeInTheDocument();
});

it("shows a refused rename in its dialog and a failed one silently", async () => {
  stubApi([
    {
      method: "PUT",
      path: "/user/passkeys/1",
      status: 422,
      body: { message: "x", errors: { name: ["Trop long."] } },
    },
    {
      method: "PUT",
      path: "/user/passkeys/2",
      status: 500,
      body: { message: "Boom" },
    },
  ]);
  renderTab(twoFactorOnFixture);

  fireEvent.click(screen.getAllByRole("button", { name: "Renommer" })[0]);
  fireEvent.submit(await screen.findByRole("button", { name: "Enregistrer" }));
  expect(await screen.findByText("Trop long.")).toBeInTheDocument();

  fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
  await waitFor(() =>
    expect(screen.queryByLabelText("Nom")).not.toBeInTheDocument(),
  );

  fireEvent.click(screen.getAllByRole("button", { name: "Renommer" })[1]);
  fireEvent.submit(await screen.findByRole("button", { name: "Enregistrer" }));

  await waitFor(() => expect(screen.getByLabelText("Nom")).toBeInTheDocument());
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("reports a failed deletion on the card", async () => {
  stubApi([
    {
      method: "DELETE",
      path: "/user/passkeys/2",
      status: 500,
      body: { message: "Boom" },
    },
  ]);
  renderTab(twoFactorOnFixture);

  fireEvent.click(screen.getAllByRole("button", { name: "Supprimer" })[1]);
  const dialog = await screen.findByRole("alertdialog");
  fireEvent.click(
    dialog.querySelector("[data-slot=alert-dialog-action]") as HTMLElement,
  );

  expect(await screen.findByRole("alert")).toHaveTextContent("Boom");
});
