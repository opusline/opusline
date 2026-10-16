import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { CLIENT_FIXTURE } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";
import { secondClient } from "../lib/fixtures";
import { ExternalQuotePage } from "./external-quote-page";

function renderPage(clients = [CLIENT_FIXTURE, secondClient]) {
  const onSubmit = vi.fn();

  render(
    <StoryRouter>
      <ExternalQuotePage
        accountToday="2026-10-16"
        clients={clients}
        error={null}
        isSaving={false}
        onSubmit={onSubmit}
      />
    </StoryRouter>,
  );

  return { onSubmit };
}

it("records the quote with its reference, its figure and the client's answer", async () => {
  const { onSubmit } = renderPage();

  fireEvent.change(await screen.findByTestId("external-quote-client"), {
    target: { value: String(secondClient.id) },
  });
  fireEvent.change(screen.getByTestId("external-quote-title"), {
    target: { value: " Refonte du back-office " },
  });
  fireEvent.change(screen.getByTestId("external-quote-reference"), {
    target: { value: "DEV-118" },
  });
  fireEvent.change(screen.getByTestId("external-quote-amount"), {
    target: { value: "4 800" },
  });
  fireEvent.click(
    screen
      .getAllByTestId("external-quote-status")
      .find((chip) => chip.dataset.status === "2") as HTMLElement,
  );
  fireEvent.click(screen.getByTestId("external-quote-submit"));

  expect(onSubmit).toHaveBeenCalledWith({
    clientId: secondClient.id,
    title: "Refonte du back-office",
    number: "DEV-118",
    amountHtCents: 480_000,
    issuedOn: "2026-10-16",
    status: 2,
    file: null,
  });
});

it("waits for the reference and the amount before it can be added", async () => {
  const { onSubmit } = renderPage();

  const submit = await screen.findByTestId("external-quote-submit");
  expect(submit).toBeDisabled();

  fireEvent.change(screen.getByTestId("external-quote-reference"), {
    target: { value: "DEV-118" },
  });
  expect(submit).toBeDisabled();

  fireEvent.change(screen.getByTestId("external-quote-amount"), {
    target: { value: "4800" },
  });
  expect(submit).toBeEnabled();

  fireEvent.click(submit);
  expect(onSubmit).toHaveBeenCalledOnce();
});

it("carries the picked PDF along, and lets it go again", async () => {
  const { onSubmit } = renderPage();
  const file = new File(["%PDF-1.4"], "devis.pdf", { type: "application/pdf" });

  fireEvent.change(await screen.findByTestId("external-quote-file"), {
    target: { files: [file] },
  });
  expect(screen.getByTestId("external-quote-file-chosen")).toHaveTextContent(
    "devis.pdf",
  );

  fireEvent.change(screen.getByTestId("external-quote-reference"), {
    target: { value: "DEV-118" },
  });
  fireEvent.change(screen.getByTestId("external-quote-amount"), {
    target: { value: "4800" },
  });
  fireEvent.click(screen.getByTestId("external-quote-submit"));
  expect(onSubmit).toHaveBeenLastCalledWith(expect.objectContaining({ file }));

  fireEvent.click(screen.getByRole("button", { name: "Retirer le fichier" }));
  expect(screen.getByTestId("external-quote-file-pick")).toBeInTheDocument();
});

it("refuses a file a quote would never be, without keeping it", async () => {
  renderPage();

  fireEvent.change(await screen.findByTestId("external-quote-file"), {
    target: {
      files: [
        new File(["x"], "devis.xlsx", { type: "application/vnd.ms-excel" }),
      ],
    },
  });

  expect(screen.getByRole("alert")).toHaveTextContent("devis.xlsx");
  expect(screen.queryByTestId("external-quote-file-chosen")).toBeNull();
});

it("asks for a client first when the account has none", async () => {
  renderPage([]);

  expect(
    await screen.findByTestId("external-quote-no-clients"),
  ).toBeInTheDocument();
  expect(screen.queryByTestId("external-quote-submit")).toBeNull();
});
