import type { BankAccountData } from "@opusline/api-client";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { StoryRouter } from "@/test/story-router";
import { bankConnection } from "../lib/fixtures";
import { BankConnectionCard } from "./bank-connection-card";

function renderCard(
  data: Pick<BankAccountData, "bankSyncConfigured" | "connection">,
) {
  const handlers = {
    onConnect: vi.fn(),
    onChooseAccount: vi.fn(),
    onSync: vi.fn(),
    onDisconnect: vi.fn(),
  };

  render(
    <StoryRouter>
      <BankConnectionCard
        data={data}
        isDisconnecting={false}
        isSyncing={false}
        {...handlers}
      />
    </StoryRouter>,
  );

  return handlers;
}

it("sends an account without an application to the settings", async () => {
  renderCard({ bankSyncConfigured: false, connection: null });

  expect(await screen.findByTestId("bank-connection-setup")).toHaveAttribute(
    "href",
    "/settings?tab=integrations",
  );
  expect(screen.getByTestId("bank-connection-card")).toHaveAttribute(
    "data-status",
    "unconfigured",
  );
});

it("offers to connect once the application is saved", async () => {
  const { onConnect } = renderCard({
    bankSyncConfigured: true,
    connection: null,
  });

  fireEvent.click(await screen.findByTestId("bank-connect-open"));

  expect(onConnect).toHaveBeenCalledOnce();
  expect(screen.queryByTestId("bank-disconnect")).toBeNull();
});

it("syncs an active connection on demand", async () => {
  const { onSync } = renderCard({
    bankSyncConfigured: true,
    connection: bankConnection(),
  });

  fireEvent.click(await screen.findByTestId("bank-sync"));

  expect(onSync).toHaveBeenCalledOnce();
  expect(
    screen.getByText(/Banque Orvella · Compte pro · ••0185/),
  ).toBeInTheDocument();
});

it("says why the last sync failed", async () => {
  renderCard({
    bankSyncConfigured: true,
    connection: bankConnection({ lastError: 1 }),
  });

  expect(await screen.findByTestId("bank-sync-error")).toHaveTextContent(
    "La banque limite les lectures",
  );
});

it("asks for the account when the consent covers several", async () => {
  const { onChooseAccount } = renderCard({
    bankSyncConfigured: true,
    connection: bankConnection({ status: 1, account: null }),
  });

  fireEvent.click(await screen.findByTestId("bank-account-choose-open"));

  expect(onChooseAccount).toHaveBeenCalledOnce();
});

it("offers to reconnect an expired consent instead of syncing", async () => {
  const { onConnect } = renderCard({
    bankSyncConfigured: true,
    connection: bankConnection({ status: 2 }),
  });

  fireEvent.click(await screen.findByTestId("bank-reconnect"));

  expect(onConnect).toHaveBeenCalledOnce();
  expect(screen.queryByTestId("bank-sync")).toBeNull();
});

it("disconnects only once confirmed", async () => {
  const { onDisconnect } = renderCard({
    bankSyncConfigured: true,
    connection: bankConnection(),
  });

  fireEvent.click(await screen.findByTestId("bank-disconnect"));
  expect(onDisconnect).not.toHaveBeenCalled();

  fireEvent.click(await screen.findByTestId("bank-disconnect-confirm"));
  expect(onDisconnect).toHaveBeenCalledOnce();
});

it("offers to renew a consent about to end, while it still syncs", async () => {
  const { onConnect } = renderCard({
    bankSyncConfigured: true,
    connection: bankConnection({
      validUntil: new Date(Date.now() + 3 * 86_400_000).toISOString(),
    }),
  });

  expect(await screen.findByTestId("bank-sync")).toBeInTheDocument();
  fireEvent.click(screen.getByTestId("bank-reconnect"));

  expect(onConnect).toHaveBeenCalledOnce();
});
