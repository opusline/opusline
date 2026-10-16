import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { eInvoicingConnected } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";
import { PlatformInboxCard } from "./platform-inbox-card";

it("reads the inbox on demand and says when it was last read", async () => {
  const onSync = vi.fn();

  render(
    <StoryRouter>
      <PlatformInboxCard
        count={2}
        error={null}
        isSyncing={false}
        onSync={onSync}
        settings={{
          ...eInvoicingConnected,
          lastSyncedAt: "2026-10-16T05:30:00+02:00",
        }}
      />
    </StoryRouter>,
  );

  expect(await screen.findByTestId("platform-inbox")).toHaveAttribute(
    "data-status",
    "ok",
  );
  expect(screen.getByTestId("platform-inbox")).toHaveAttribute(
    "data-count",
    "2",
  );
  expect(screen.queryByTestId("platform-inbox-error")).toBeNull();

  fireEvent.click(screen.getByTestId("einvoice-sync"));

  expect(onSync).toHaveBeenCalledOnce();
});

it("shows why the last run was refused", async () => {
  render(
    <StoryRouter>
      <PlatformInboxCard
        count={0}
        error={null}
        isSyncing={false}
        onSync={() => {}}
        settings={{ ...eInvoicingConnected, lastError: 1 }}
      />
    </StoryRouter>,
  );

  expect(await screen.findByTestId("platform-inbox")).toHaveAttribute(
    "data-status",
    "failed",
  );
  expect(screen.getByTestId("platform-inbox-error")).not.toHaveTextContent(
    "Injoignable.",
  );
});

it("puts a sync that just failed over the connection's own error", async () => {
  render(
    <StoryRouter>
      <PlatformInboxCard
        count={0}
        error="Injoignable."
        isSyncing={true}
        onSync={() => {}}
        settings={{ ...eInvoicingConnected, lastError: 1 }}
      />
    </StoryRouter>,
  );

  expect(await screen.findByTestId("platform-inbox-error")).toHaveTextContent(
    "Injoignable.",
  );
  expect(screen.getByTestId("einvoice-sync")).toBeDisabled();
});
