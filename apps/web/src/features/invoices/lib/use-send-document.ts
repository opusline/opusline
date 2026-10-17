import type {
  EmailPreviewData,
  EmailTemplateKind,
  ReminderDefaultsData,
} from "@opusline/api-client";
import { listEmailTemplatesOptions } from "@opusline/api-client/react-query";
import {
  keepPreviousData,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";

import { useSettled } from "@/lib/use-settled";

import type { SendRecipient } from "../components/send-document-page";
import type { EmailTemplateDraft } from "./email-templates";

type SendDocumentOptions = {
  kind: EmailTemplateKind;
  /** The client's known address, the first recipient offered. */
  knownAddress: string | null;
  preview: (draft: EmailTemplateDraft) => Promise<EmailPreviewData>;
  previewKey: string;
  reminderDefaults?: ReminderDefaultsData;
};

/**
 * What the send page edits before the e-mail leaves: who gets it, the wording
 * (the template until typed over), the copy to the sender, and for an invoice
 * the reminders. The preview follows the wording with a short delay.
 */
export function useSendDocument({
  kind,
  knownAddress,
  preview,
  previewKey,
  reminderDefaults,
}: SendDocumentOptions) {
  const templates = useQuery(listEmailTemplatesOptions());
  const template = templates.data?.templates.find((row) => row.kind === kind);
  const stored: EmailTemplateDraft | null =
    template === undefined
      ? null
      : { subject: template.subject, body: template.body };
  const [edited, setEdited] = useState<EmailTemplateDraft | null>(null);
  const draft = edited ?? stored;
  const [recipients, setRecipients] = useState<SendRecipient[] | null>(null);
  const [copyToSender, setCopyToSender] = useState(false);
  const [reminders, setReminders] = useState<ReminderDefaultsData | null>(null);

  const settledDraft = useSettled(draft);
  const previewQuery: UseQueryResult<EmailPreviewData> = useQuery({
    queryKey: ["send-document-preview", previewKey, settledDraft],
    queryFn: () => preview(settledDraft as EmailTemplateDraft),
    enabled: settledDraft !== null,
    placeholderData: keepPreviousData,
  });

  return {
    isPending: templates.isPending,
    isError: templates.isError,
    draft,
    isEdited: edited !== null,
    setDraft: setEdited,
    resetDraft: () => setEdited(null),
    recipients:
      recipients ??
      (knownAddress === null ? [] : [{ address: knownAddress, checked: true }]),
    setRecipients,
    copyToSender,
    setCopyToSender,
    reminders: reminders ?? reminderDefaults ?? null,
    setReminders,
    preview: previewQuery.data ?? null,
    isPreviewFailed: previewQuery.isError,
  };
}
