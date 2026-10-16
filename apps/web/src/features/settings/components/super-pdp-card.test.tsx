import type { EInvoicingSettingsData } from "@opusline/api-client";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import type { FormSubmitResult } from "@/lib/form";
import { StoryRouter } from "@/test/story-router";
import { SuperPdpCard } from "./super-pdp-card";

const CLIENT_ID = "opusline_8f3c2e1a4d6f9b7c";
const CLIENT_SECRET = "secret_0b8f3c2e1a4d4e6f9b7c5d2e1f0a3b4c";

const unconfigured: EInvoicingSettingsData = {
  clientId: null,
  companyName: null,
  companyNumber: null,
  environment: null,
  companyVerified: false,
  receivingAddress: null,
  checkedAt: null,
};

const connected: EInvoicingSettingsData = {
  clientId: CLIENT_ID,
  companyName: "Théo Marchand",
  companyNumber: "123456782",
  environment: 0,
  companyVerified: true,
  receivingAddress: "0225:12345678200002",
  checkedAt: "2026-10-16T09:12:00+02:00",
};

function renderCard({
  settings = unconfigured,
  onSave = async () => ({ status: "success" }),
}: {
  settings?: EInvoicingSettingsData;
  onSave?: () => Promise<FormSubmitResult>;
} = {}) {
  const save = vi.fn(onSave);
  const check = vi.fn();
  const remove = vi.fn();

  render(
    <StoryRouter>
      <SuperPdpCard
        error={null}
        isChecking={false}
        isRemoving={false}
        notice={null}
        onCheck={check}
        onRemove={remove}
        onSave={save}
        settings={settings}
      />
    </StoryRouter>,
  );

  return { save, check, remove };
}

async function fillAndSave(clientId: string, clientSecret: string) {
  fireEvent.change(await screen.findByTestId("super-pdp-client-id"), {
    target: { value: clientId },
  });
  fireEvent.blur(screen.getByTestId("super-pdp-client-id"));
  fireEvent.change(screen.getByTestId("super-pdp-client-secret"), {
    target: { value: clientSecret },
  });
  fireEvent.click(screen.getByTestId("super-pdp-save"));
}

it("sends the client id and secret, trimmed", async () => {
  const { save } = renderCard();

  await fillAndSave(` ${CLIENT_ID} `, `${CLIENT_SECRET}\n`);

  await waitFor(() =>
    expect(save).toHaveBeenCalledWith({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }),
  );
});

it("refuses an empty secret before asking the API", async () => {
  const { save } = renderCard();

  await fillAndSave(CLIENT_ID, "");

  await waitFor(() =>
    expect(screen.getByTestId("super-pdp-card")).toHaveAttribute(
      "data-status",
      "unconfigured",
    ),
  );
  expect(save).not.toHaveBeenCalled();
});

it("shows the company, its environment and where it receives invoices", async () => {
  const { check } = renderCard({ settings: connected });

  expect(await screen.findByTestId("super-pdp-card")).toHaveAttribute(
    "data-status",
    "connected",
  );
  expect(screen.getByTestId("super-pdp-environment")).toHaveAttribute(
    "data-environment",
    "sandbox",
  );
  expect(screen.getByTestId("super-pdp-receiving-address")).toHaveAttribute(
    "data-address",
    "0225:12345678200002",
  );

  fireEvent.click(screen.getByTestId("super-pdp-check"));

  expect(check).toHaveBeenCalledOnce();
});

it("flags a company the platform has not verified yet", async () => {
  renderCard({
    settings: { ...connected, companyVerified: false, receivingAddress: null },
  });

  expect(await screen.findByTestId("super-pdp-card")).toHaveAttribute(
    "data-status",
    "unverified",
  );
  expect(screen.getByTestId("super-pdp-unverified")).toBeInTheDocument();
  expect(screen.getByTestId("super-pdp-no-address")).toBeInTheDocument();
});

it("removes only once confirmed", async () => {
  const { remove } = renderCard({ settings: connected });

  fireEvent.click(await screen.findByTestId("super-pdp-remove"));
  expect(remove).not.toHaveBeenCalled();

  fireEvent.click(await screen.findByTestId("super-pdp-remove-confirm"));

  expect(remove).toHaveBeenCalledOnce();
});

it("offers the form again when replacing the application", async () => {
  renderCard({ settings: connected });

  fireEvent.click(await screen.findByTestId("super-pdp-replace"));

  expect(await screen.findByTestId("super-pdp-client-id")).toBeInTheDocument();
});
