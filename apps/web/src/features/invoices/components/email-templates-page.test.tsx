import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { StoryRouter } from "@/test/story-router";
import { EMAIL_PREVIEW, EMAIL_TEMPLATES } from "../lib/email-template-fixtures";
import { insertToken } from "../lib/email-templates";
import { EmailTemplatesPage } from "./email-templates-page";

function renderPage(
  props: Partial<Parameters<typeof EmailTemplatesPage>[0]> = {},
) {
  const onSelect = vi.fn();
  const onDraftChange = vi.fn();
  const onSave = vi.fn();
  const onReset = vi.fn();
  const onSendTest = vi.fn();
  const onReminderDefaultsChange = vi.fn();

  render(
    <StoryRouter>
      <EmailTemplatesPage
        draft={{
          subject: EMAIL_TEMPLATES[0]?.subject ?? "",
          body: EMAIL_TEMPLATES[0]?.body ?? "",
        }}
        error={null}
        isDirty={false}
        isPreviewFailed={false}
        isSaving={false}
        isSendingTest={false}
        mailEnabled={true}
        onCancel={vi.fn()}
        onDraftChange={onDraftChange}
        onReminderDefaultsChange={onReminderDefaultsChange}
        onReset={onReset}
        onSave={onSave}
        onSelect={onSelect}
        onSendTest={onSendTest}
        preview={EMAIL_PREVIEW}
        reminderDefaults={{ enabled: false, frequency: 0 }}
        selected={0}
        templates={EMAIL_TEMPLATES}
        {...props}
      />
    </StoryRouter>,
  );

  return {
    onSelect,
    onDraftChange,
    onSave,
    onReset,
    onSendTest,
    onReminderDefaultsChange,
  };
}

it("lists the four templates and marks the reworded one", async () => {
  renderPage();

  const kinds = await screen.findAllByTestId("emails-kind");
  expect(kinds).toHaveLength(4);
  expect(
    kinds.find((kind) => kind.dataset.kind === "payment-reminder"),
  ).toHaveAttribute("data-modified", "true");
  expect(
    kinds.find((kind) => kind.dataset.kind === "new-invoice"),
  ).toHaveAttribute("data-modified", "false");
});

it("picks another template", async () => {
  const { onSelect } = renderPage();

  const quote = (await screen.findAllByTestId("emails-kind")).find(
    (kind) => kind.dataset.kind === "new-quote",
  ) as HTMLElement;
  fireEvent.click(quote);

  expect(onSelect).toHaveBeenCalledWith(1);
});

it("offers the placeholders this kind knows, and drops one into the text", async () => {
  const { onDraftChange } = renderPage();

  const variables = await screen.findAllByTestId("emails-variable");
  expect(variables.map((chip) => chip.dataset.name)).toEqual([
    "numero",
    "titre",
    "montant",
    "reste",
    "echeance",
    "contact",
    "client",
  ]);

  fireEvent.click(variables[6] as HTMLElement);

  expect(onDraftChange).toHaveBeenCalledWith(
    expect.objectContaining({
      body: expect.stringContaining("{client}"),
    }),
  );
});

it("puts the token where the caret is", () => {
  expect(insertToken("Bonjour , voici", "contact", 8, 8)).toEqual({
    text: "Bonjour {contact}, voici",
    caret: 17,
  });
  expect(insertToken("Bonjour", "contact", null, null)).toEqual({
    text: "Bonjour{contact}",
    caret: 16,
  });
});

it("only restores a template that was reworded", async () => {
  const { onReset } = renderPage({ selected: 3 });

  fireEvent.click(await screen.findByTestId("emails-reset"));
  expect(onReset).toHaveBeenCalledOnce();
});

it("has nothing to restore on a stock template", async () => {
  renderPage();

  await screen.findByTestId("emails-editor");
  expect(screen.queryByTestId("emails-reset")).toBeNull();
});

it("saves from the bar once something changed, and holds the test send meanwhile", async () => {
  const { onSave } = renderPage({ isDirty: true });

  fireEvent.click(await screen.findByTestId("emails-save"));

  expect(onSave).toHaveBeenCalledOnce();
  expect(screen.getByTestId("emails-send-test")).toBeDisabled();
});

it("sends the sample e-mail to the account itself", async () => {
  const { onSendTest } = renderPage();

  fireEvent.click(await screen.findByTestId("emails-send-test"));

  expect(onSendTest).toHaveBeenCalledOnce();
});

it("keeps the test send off an instance that sends no mail", async () => {
  renderPage({ mailEnabled: false });

  await screen.findByTestId("emails-editor");
  expect(screen.queryByTestId("emails-send-test")).toBeNull();
});

it("shows the rendered e-mail and its subject", async () => {
  renderPage();

  expect(await screen.findByTestId("emails-preview-subject")).toHaveTextContent(
    "Facture F-2026-014 (Refonte du site)",
  );
  expect(screen.getByTestId("emails-preview")).toHaveAttribute(
    "srcdoc",
    expect.stringContaining("Bonjour Sophie,"),
  );
});

it("keeps the reminder defaults on the reminder template alone, saved as they change", async () => {
  const { onReminderDefaultsChange } = renderPage({ selected: 3 });

  fireEvent.click(await screen.findByTestId("emails-reminders-toggle"));
  expect(onReminderDefaultsChange).toHaveBeenCalledWith({
    enabled: true,
    frequency: 0,
  });

  fireEvent.change(screen.getByTestId("emails-reminders-frequency"), {
    target: { value: "2" },
  });
  expect(onReminderDefaultsChange).toHaveBeenLastCalledWith({
    enabled: false,
    frequency: 2,
  });
});

it("shows no reminder defaults on the other templates", async () => {
  renderPage();

  await screen.findByTestId("emails-editor");
  expect(screen.queryByTestId("emails-reminders")).toBeNull();
});
