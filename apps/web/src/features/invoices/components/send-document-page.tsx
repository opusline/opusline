import type {
  EmailPreviewData,
  InvoicePaperData,
  ReminderDefaultsData,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button, buttonVariants } from "@opusline/ui/components/button";
import { Checkbox } from "@opusline/ui/components/checkbox";
import { Field, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { NativeSelect } from "@opusline/ui/components/native-select";
import { Panel, PanelTitle } from "@opusline/ui/components/panel";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { Switch } from "@opusline/ui/components/switch";
import { Textarea } from "@opusline/ui/components/textarea";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, CircleAlert, Send } from "lucide-react";
import { useId, useState } from "react";

import { m } from "@/paraglide/messages.js";
import {
  type EmailTemplateDraft,
  REMINDER_FREQUENCIES,
  reminderFrequencyLabel,
} from "../lib/email-templates";
import { InvoicePaper } from "./invoice-paper";

const LABEL = "text-muted-foreground-2 text-xs";

/** The document being sent, as the header names it and the back link finds it. */
export type SendDocumentSubject =
  | { kind: "invoice"; id: number; number: string }
  | { kind: "quote"; id: number; number: string };

export type SendRecipient = {
  address: string;
  checked: boolean;
};

type SendDocumentPageProps = {
  subject: SendDocumentSubject;
  recipients: SendRecipient[];
  onRecipientsChange: (recipients: SendRecipient[]) => void;
  /** The account's own address, offered as a copy. */
  senderEmail: string;
  copyToSender: boolean;
  onCopyToSenderChange: (copy: boolean) => void;
  /** The wording for this send; the template until typed over. */
  draft: EmailTemplateDraft;
  onDraftChange: (draft: EmailTemplateDraft) => void;
  isEdited: boolean;
  onResetDraft: () => void;
  preview: EmailPreviewData | null;
  isPreviewFailed: boolean;
  /** The document's sheet, for the second tab; null for a document that has none here. */
  paper: InvoicePaperData | null;
  logoSrc?: string;
  /** Invoices only: what this invoice will do once past due. */
  reminders?: ReminderDefaultsData;
  onRemindersChange?: (reminders: ReminderDefaultsData) => void;
  mailEnabled: boolean;
  isSending: boolean;
  onSend: () => void;
  isSendingTest: boolean;
  onSendTest: () => void;
  error: string | null;
};

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The design's « Send page »: who gets the document, with what words, and what they will see. */
export function SendDocumentPage({
  subject,
  recipients,
  onRecipientsChange,
  senderEmail,
  copyToSender,
  onCopyToSenderChange,
  draft,
  onDraftChange,
  isEdited,
  onResetDraft,
  preview,
  isPreviewFailed,
  paper,
  logoSrc,
  reminders,
  onRemindersChange,
  mailEnabled,
  isSending,
  onSend,
  isSendingTest,
  onSendTest,
  error,
}: SendDocumentPageProps) {
  const ids = {
    subject: useId(),
    body: useId(),
    address: useId(),
    frequency: useId(),
  };
  const [newAddress, setNewAddress] = useState("");
  const [isAddressInvalid, setIsAddressInvalid] = useState(false);
  const [tab, setTab] = useState<"mail" | "document">("mail");
  const chosen = recipients.filter((recipient) => recipient.checked);
  const canSend =
    mailEnabled &&
    chosen.length > 0 &&
    draft.subject.trim() !== "" &&
    draft.body.trim() !== "" &&
    !isSending;
  const backTo =
    subject.kind === "invoice"
      ? ({
          to: "/invoicing/invoices/$invoiceId",
          params: { invoiceId: String(subject.id) },
        } as const)
      : ({
          to: "/invoicing/quotes/$quoteId",
          params: { quoteId: String(subject.id) },
        } as const);

  const addAddress = () => {
    const address = newAddress.trim().toLowerCase();

    if (!EMAIL_SHAPE.test(address)) {
      setIsAddressInvalid(true);

      return;
    }

    setIsAddressInvalid(false);
    setNewAddress("");

    if (recipients.some((recipient) => recipient.address === address)) {
      onRecipientsChange(
        recipients.map((recipient) =>
          recipient.address === address
            ? { ...recipient, checked: true }
            : recipient,
        ),
      );

      return;
    }

    onRecipientsChange([...recipients, { address, checked: true }]);
  };

  return (
    <div className="pb-16">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          aria-label={m.quote_document_back()}
          className={buttonVariants({ size: "icon-lg", variant: "ghost" })}
          data-testid="send-back"
          {...backTo}
        >
          <ChevronLeft />
        </Link>
        <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-1">
          <Link
            className="text-muted-foreground-3 text-sm hover:text-foreground-hi"
            {...backTo}
          >
            {subject.kind === "invoice"
              ? m.document_heading({ number: subject.number })
              : m.quote_document_heading({ number: subject.number })}
          </Link>
          <span aria-hidden className="text-muted-foreground-4 text-sm">
            /
          </span>
          <h1
            className="font-heading font-semibold text-foreground-hi text-xl"
            data-testid="page-heading"
          >
            {subject.kind === "invoice"
              ? m.send_heading_invoice({ number: subject.number })
              : m.send_heading_quote({ number: subject.number })}
          </h1>
        </div>
        <Button
          data-testid="send-submit"
          disabled={!canSend}
          onClick={onSend}
          size="xl"
        >
          {isSending ? m.send_sending() : m.send_submit()}
          <Send data-icon="inline-end" />
        </Button>
      </div>

      {error === null ? null : (
        <Alert className="mb-4" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {mailEnabled ? null : (
        <Alert className="mb-4" data-testid="send-unavailable" variant="warn">
          <CircleAlert />
          <AlertDescription>{m.send_unavailable()}</AlertDescription>
        </Alert>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19.375rem]">
        <div className="flex min-w-0 flex-col gap-4">
          <Panel className="flex flex-col gap-3.5 px-5 py-5" padding="none">
            <PanelTitle>{m.send_recipients_title()}</PanelTitle>
            {recipients.length === 0 ? (
              <p
                className="text-destructive text-sm"
                data-testid="send-no-contacts"
              >
                {m.send_no_contacts()}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {recipients.map((recipient) => (
                  // biome-ignore lint/a11y/noLabelWithoutControl: Base UI's Checkbox renders a hidden input beside its span, so the wrapping label is its control
                  <label
                    className="flex cursor-pointer items-center gap-2.5 rounded-md border bg-muted px-3 py-2.5 text-foreground-2 text-sm"
                    data-address={recipient.address}
                    data-checked={recipient.checked}
                    data-testid="send-recipient"
                    key={recipient.address}
                  >
                    <Checkbox
                      checked={recipient.checked}
                      onCheckedChange={(checked) =>
                        onRecipientsChange(
                          recipients.map((row) =>
                            row.address === recipient.address
                              ? { ...row, checked: checked === true }
                              : row,
                          ),
                        )
                      }
                    />
                    {recipient.address}
                  </label>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                aria-invalid={isAddressInvalid}
                aria-label={m.send_add_address()}
                data-testid="send-add-address"
                id={ids.address}
                inputMode="email"
                onChange={(event) => {
                  setNewAddress(event.target.value);
                  setIsAddressInvalid(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addAddress();
                  }
                }}
                placeholder={m.send_add_address_placeholder()}
                value={newAddress}
              />
              <Button
                data-testid="send-add-address-submit"
                onClick={addAddress}
                type="button"
                variant="outline"
              >
                {m.send_add_address()}
              </Button>
            </div>
            {isAddressInvalid ? (
              <p className="text-destructive text-xs" role="alert">
                {m.send_add_address_invalid()}
              </p>
            ) : null}
            {/* biome-ignore lint/a11y/noLabelWithoutControl: Base UI's Checkbox renders a hidden input beside its span, so the wrapping label is its control */}
            <label className="flex cursor-pointer items-center gap-2.5 text-foreground-3 text-sm">
              <Checkbox
                checked={copyToSender}
                data-testid="send-copy-me"
                onCheckedChange={(checked) =>
                  onCopyToSenderChange(checked === true)
                }
              />
              {m.send_copy_me({ email: senderEmail })}
            </label>
          </Panel>

          <Panel className="flex flex-col gap-3.5 px-5 py-5" padding="none">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <PanelTitle>{m.send_message_title()}</PanelTitle>
              {isEdited ? (
                <Button
                  data-testid="send-reset"
                  onClick={onResetDraft}
                  size="sm"
                  variant="link"
                >
                  {m.send_reset_template()}
                </Button>
              ) : null}
            </div>
            <Field>
              <FieldLabel className={LABEL} htmlFor={ids.subject}>
                {m.emails_subject_label()}
              </FieldLabel>
              <Input
                data-testid="send-subject"
                id={ids.subject}
                onChange={(event) =>
                  onDraftChange({ ...draft, subject: event.target.value })
                }
                value={draft.subject}
              />
            </Field>
            <Field>
              <FieldLabel className={LABEL} htmlFor={ids.body}>
                {m.emails_body_label()}
              </FieldLabel>
              <Textarea
                className="min-h-56 leading-relaxed"
                data-testid="send-body"
                id={ids.body}
                onChange={(event) =>
                  onDraftChange({ ...draft, body: event.target.value })
                }
                rows={9}
                value={draft.body}
              />
            </Field>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-muted-foreground-3 text-xs">
                {m.send_attachment_note()}
              </span>
              {mailEnabled ? (
                <Button
                  data-testid="send-test"
                  disabled={isSendingTest}
                  onClick={onSendTest}
                  size="sm"
                  variant="link"
                >
                  {m.send_test()}
                </Button>
              ) : null}
            </div>
          </Panel>

          <div className="mt-1.5 flex items-center justify-between gap-3">
            <span className="text-muted-foreground-3 text-xs">
              {m.send_preview_label()}
            </span>
            <SegmentedControl
              aria-label={m.send_preview_label()}
              onValueChange={(value) => {
                const next = value[0];

                if (next === "mail" || next === "document") {
                  setTab(next);
                }
              }}
              size="sm"
              value={[tab]}
            >
              <SegmentedControlItem data-testid="send-tab-mail" value="mail">
                {m.send_tab_email()}
              </SegmentedControlItem>
              <SegmentedControlItem
                data-testid="send-tab-document"
                disabled={paper === null}
                value="document"
              >
                {m.send_tab_document()}
              </SegmentedControlItem>
            </SegmentedControl>
          </div>
          {tab === "document" && paper !== null ? (
            <div className="overflow-x-auto">
              <div className="min-w-150">
                <InvoicePaper logoSrc={logoSrc} paper={paper} />
              </div>
            </div>
          ) : isPreviewFailed ? (
            <Alert data-testid="send-preview-failed" variant="warn">
              <CircleAlert />
              <AlertDescription>{m.emails_preview_failed()}</AlertDescription>
            </Alert>
          ) : preview === null ? (
            <Skeleton className="h-190 w-full" />
          ) : (
            <iframe
              className="h-190 w-full rounded-md border bg-white"
              data-testid="send-preview"
              sandbox=""
              srcDoc={preview.html}
              title={m.send_preview_label()}
            />
          )}
        </div>

        {reminders !== undefined && onRemindersChange !== undefined ? (
          <aside className="flex flex-col gap-5">
            <Panel
              className="flex flex-col gap-4 px-5 py-5"
              data-testid="send-reminders"
              padding="none"
            >
              <div>
                <PanelTitle>{m.send_reminders_title()}</PanelTitle>
                <p className="mt-1.5 text-muted-foreground text-sm text-pretty">
                  {m.send_reminders_text()}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3.5 rounded-md border border-border-2 px-3.5 py-3.5">
                <span className="text-foreground-2 text-sm">
                  {m.send_reminders_toggle()}
                </span>
                <Switch
                  aria-label={m.send_reminders_toggle()}
                  checked={reminders.enabled}
                  data-testid="send-reminders-toggle"
                  onCheckedChange={(enabled) =>
                    onRemindersChange({ ...reminders, enabled })
                  }
                />
              </div>
              {reminders.enabled ? (
                <Field>
                  <FieldLabel className={LABEL} htmlFor={ids.frequency}>
                    {m.send_reminders_frequency()}
                  </FieldLabel>
                  <NativeSelect
                    data-testid="send-reminders-frequency"
                    id={ids.frequency}
                    onChange={(event) =>
                      onRemindersChange({
                        ...reminders,
                        frequency: Number(
                          event.target.value,
                        ) as ReminderDefaultsData["frequency"],
                      })
                    }
                    value={String(reminders.frequency)}
                  >
                    {REMINDER_FREQUENCIES.map((frequency) => (
                      <option key={frequency} value={String(frequency)}>
                        {reminderFrequencyLabel(frequency)}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
              ) : null}
            </Panel>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
