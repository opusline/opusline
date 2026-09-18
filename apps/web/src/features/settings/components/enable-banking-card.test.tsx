import type { EnableBankingSettingsData } from "@opusline/api-client";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import type { FormSubmitResult } from "@/lib/form";
import { StoryRouter } from "@/test/story-router";
import { EnableBankingCard } from "./enable-banking-card";

const APPLICATION_ID = "6f1c1a52-9d1e-4b9e-8a53-0c1e2f3a4b5c";
const PEM = "-----BEGIN PRIVATE KEY-----\nMIIEvQ\n-----END PRIVATE KEY-----";

const unconfigured: EnableBankingSettingsData = {
  applicationId: null,
  redirectUrl: "https://opusline.example/bank-account",
};

function renderCard({
  settings = unconfigured,
  onSave = async () => ({ status: "success" }),
  onRemove = () => {},
}: {
  settings?: EnableBankingSettingsData;
  onSave?: () => Promise<FormSubmitResult>;
  onRemove?: () => void;
} = {}) {
  const save = vi.fn(onSave);
  const remove = vi.fn(onRemove);

  render(
    <StoryRouter>
      <EnableBankingCard
        error={null}
        isRemoving={false}
        onRemove={remove}
        onSave={save}
        settings={settings}
      />
    </StoryRouter>,
  );

  return { save, remove };
}

async function fillAndSave(applicationId: string, privateKey: string) {
  fireEvent.change(await screen.findByTestId("enable-banking-application-id"), {
    target: { value: applicationId },
  });
  fireEvent.blur(screen.getByTestId("enable-banking-application-id"));
  fireEvent.change(screen.getByTestId("enable-banking-private-key"), {
    target: { value: privateKey },
  });
  fireEvent.click(screen.getByTestId("enable-banking-save"));
}

it("shows the redirect url the application must whitelist", async () => {
  renderCard();

  expect(
    await screen.findByTestId("enable-banking-redirect-url"),
  ).toHaveTextContent("https://opusline.example/bank-account");
});

it("sends the application id and the key, trimmed", async () => {
  const { save } = renderCard();

  await fillAndSave(` ${APPLICATION_ID} `, `\n${PEM}\n`);

  await waitFor(() =>
    expect(save).toHaveBeenCalledWith({
      applicationId: APPLICATION_ID,
      privateKey: PEM,
    }),
  );
});

it("refuses an application id that is not one before asking the API", async () => {
  const { save } = renderCard();

  await fillAndSave("orvella-app", PEM);

  await waitFor(() =>
    expect(screen.getByTestId("enable-banking-application-id")).toHaveAttribute(
      "aria-invalid",
      "true",
    ),
  );
  expect(save).not.toHaveBeenCalled();
});

it("shows the API's reason next to the field it refused", async () => {
  renderCard({
    onSave: async () => ({
      status: "invalid",
      fieldErrors: {
        privateKey: { message: "Enable Banking a refusé cette clé." },
      },
    }),
  });

  await fillAndSave(APPLICATION_ID, PEM);

  expect(
    await screen.findByText("Enable Banking a refusé cette clé."),
  ).toBeInTheDocument();
});

it("reads a chosen key file into the key field", async () => {
  renderCard();

  fireEvent.change(await screen.findByTestId("enable-banking-key-file"), {
    target: { files: [new File([PEM], "opusline.pem")] },
  });

  await waitFor(() =>
    expect(screen.getByTestId("enable-banking-private-key")).toHaveValue(PEM),
  );
});

it("shows a saved application by its id, never its key", async () => {
  renderCard({
    settings: {
      ...unconfigured,
      applicationId: APPLICATION_ID,
    },
  });

  expect(
    await screen.findByText(`Identifiant ${APPLICATION_ID}`),
  ).toBeInTheDocument();
  expect(screen.queryByTestId("enable-banking-private-key")).toBeNull();
  expect(screen.getByTestId("enable-banking-card")).toHaveAttribute(
    "data-status",
    "configured",
  );
});

it("removes the application only once confirmed", async () => {
  const { remove } = renderCard({
    settings: {
      ...unconfigured,
      applicationId: APPLICATION_ID,
    },
  });

  fireEvent.click(await screen.findByTestId("enable-banking-remove"));
  expect(remove).not.toHaveBeenCalled();

  fireEvent.click(await screen.findByTestId("enable-banking-remove-confirm"));
  expect(remove).toHaveBeenCalledOnce();
});
