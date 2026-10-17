import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { StoryRouter } from "@/test/story-router";
import { EMAIL_PREVIEW, EMAIL_TEMPLATES } from "../lib/email-template-fixtures";
import { invoicePaperFixture } from "../lib/invoice-paper-fixture";
import { SendDocumentPage } from "./send-document-page";

function renderPage(
  props: Partial<Parameters<typeof SendDocumentPage>[0]> = {},
) {
  const onRecipientsChange = vi.fn();
  const onSend = vi.fn();
  const onSendTest = vi.fn();
  const onRemindersChange = vi.fn();
  const onResetDraft = vi.fn();

  render(
    <StoryRouter>
      <SendDocumentPage
        copyToSender={false}
        draft={{
          subject: EMAIL_TEMPLATES[0]?.subject ?? "",
          body: EMAIL_TEMPLATES[0]?.body ?? "",
        }}
        error={null}
        isEdited={false}
        isPreviewFailed={false}
        isSending={false}
        isSendingTest={false}
        mailEnabled={true}
        onCopyToSenderChange={vi.fn()}
        onDraftChange={vi.fn()}
        onRecipientsChange={onRecipientsChange}
        onRemindersChange={onRemindersChange}
        onResetDraft={onResetDraft}
        onSend={onSend}
        onSendTest={onSendTest}
        paper={invoicePaperFixture}
        preview={EMAIL_PREVIEW}
        recipients={[{ address: "compta@nordlys.test", checked: true }]}
        reminders={{ enabled: false, frequency: 0 }}
        senderEmail="camille@aubrac.test"
        subject={{ kind: "invoice", id: 41, number: "2026-041" }}
        {...props}
      />
    </StoryRouter>,
  );

  return {
    onRecipientsChange,
    onSend,
    onSendTest,
    onRemindersChange,
    onResetDraft,
  };
}

it("sends to the ticked recipients", async () => {
  const { onSend } = renderPage();

  fireEvent.click(await screen.findByTestId("send-submit"));

  expect(onSend).toHaveBeenCalledOnce();
});

it("holds the send while nobody is ticked", async () => {
  renderPage({
    recipients: [{ address: "compta@nordlys.test", checked: false }],
  });

  expect(await screen.findByTestId("send-submit")).toBeDisabled();
});

it("adds a typed address, ticked, and refuses one that is not an address", async () => {
  const { onRecipientsChange } = renderPage();

  const field = await screen.findByTestId("send-add-address");
  fireEvent.change(field, { target: { value: "Sophie" } });
  fireEvent.click(screen.getByTestId("send-add-address-submit"));
  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(onRecipientsChange).not.toHaveBeenCalled();

  fireEvent.change(field, { target: { value: " Sophie@Nordlys.test " } });
  fireEvent.click(screen.getByTestId("send-add-address-submit"));
  expect(onRecipientsChange).toHaveBeenCalledWith([
    { address: "compta@nordlys.test", checked: true },
    { address: "sophie@nordlys.test", checked: true },
  ]);
});

it("says when the client record has no address", async () => {
  renderPage({ recipients: [] });

  expect(await screen.findByTestId("send-no-contacts")).toBeInTheDocument();
});

it("offers the way back to the template once the wording changed", async () => {
  const { onResetDraft } = renderPage({ isEdited: true });

  fireEvent.click(await screen.findByTestId("send-reset"));

  expect(onResetDraft).toHaveBeenCalledOnce();
});

it("shows the e-mail, and the document on its tab", async () => {
  renderPage();

  expect(await screen.findByTestId("send-preview")).toHaveAttribute(
    "srcdoc",
    expect.stringContaining("Bonjour Sophie,"),
  );
  fireEvent.click(screen.getByTestId("send-tab-document"));
  expect(screen.getByTestId("invoice-paper")).toBeInTheDocument();
});

it("settles the reminders of an invoice, frequency once they are on", async () => {
  const { onRemindersChange } = renderPage();

  expect(await screen.findByTestId("send-reminders")).toBeInTheDocument();
  expect(screen.queryByTestId("send-reminders-frequency")).toBeNull();
  fireEvent.click(screen.getByTestId("send-reminders-toggle"));

  expect(onRemindersChange).toHaveBeenCalledWith({
    enabled: true,
    frequency: 0,
  });
});

it("has no reminders aside for a quote", async () => {
  renderPage({
    subject: { kind: "quote", id: 3, number: "D-2026-003" },
    reminders: undefined,
    onRemindersChange: undefined,
  });

  await screen.findByTestId("send-submit");
  expect(screen.queryByTestId("send-reminders")).toBeNull();
});

it("cannot send from an instance without a mailer, and says so", async () => {
  renderPage({ mailEnabled: false });

  expect(await screen.findByTestId("send-unavailable")).toBeInTheDocument();
  expect(screen.getByTestId("send-submit")).toBeDisabled();
});
