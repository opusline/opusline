import { previewInvoiceEmail } from "@opusline/api-client";
import {
  getPingOptions,
  listEmailTemplatesOptions,
  sendInvoiceEmailMutation,
  showInvoiceOptions,
  showInvoicePaperOptions,
  showSettingsOptions,
  testInvoiceEmailMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useToast } from "@opusline/ui/components/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

import { SendDocumentPage } from "@/features/invoices/components/send-document-page";
import { useSendDocument } from "@/features/invoices/lib/use-send-document";
import { requireInvoicing } from "@/lib/features";
import { companyLogoHref } from "@/lib/logos";
import { invalidateInvoiceWrites } from "@/lib/query-invalidation";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute(
  "/_authed/invoicing/invoices_/$invoiceId_/send",
)({
  beforeLoad: ({ context }) => requireInvoicing(context.user),
  component: SendInvoiceRoute,
});

function SendInvoiceRoute() {
  const { user } = Route.useRouteContext();
  const invoiceId = Number(Route.useParams().invoiceId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const detail = useQuery({
    ...showInvoiceOptions({ path: { invoice: invoiceId } }),
    retry: false,
  });
  const identity = useQuery(showSettingsOptions());
  const ping = useQuery(getPingOptions());
  const templates = useQuery(listEmailTemplatesOptions());
  const paper = useQuery({
    ...showInvoicePaperOptions({
      path: { invoice: invoiceId },
      query: { language: detail.data?.content?.language ?? 0 },
    }),
    enabled: detail.data?.content != null,
  });
  const [error, setError] = useState<string | null>(null);
  const send = useSendDocument({
    kind: 0,
    knownAddress: detail.data?.client.billingEmail ?? null,
    previewKey: `invoice-${invoiceId}`,
    preview: async (draft) => {
      const { data } = await previewInvoiceEmail({
        path: { invoice: invoiceId },
        body: draft,
        throwOnError: true,
      });

      return data;
    },
    reminderDefaults: templates.data?.reminderDefaults,
  });

  const sendEmail = useMutation({
    ...sendInvoiceEmailMutation(),
    onMutate: () => setError(null),
    onSuccess: async (sent) => {
      toast.add({
        title: m.send_sent_toast({ recipients: sent.recipients.join(", ") }),
      });
      await invalidateInvoiceWrites(queryClient);
      await navigate({
        to: "/invoicing/invoices/$invoiceId",
        params: { invoiceId: String(invoiceId) },
      });
    },
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.send_failed())),
  });
  const sendTest = useMutation({
    ...testInvoiceEmailMutation(),
    onMutate: () => setError(null),
    onSuccess: () => toast.add({ title: m.emails_test_sent() }),
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.emails_test_failed())),
  });

  if (detail.isPending || send.isPending || templates.isPending) {
    return <Skeleton className="h-150 w-full" />;
  }

  if (
    detail.isError ||
    send.isError ||
    send.draft === null ||
    detail.data.invoice.number === null
  ) {
    return (
      <Alert className="max-w-200" variant="warn">
        <CircleAlert />
        <AlertDescription>{m.send_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  const chosen = send.recipients
    .filter((recipient) => recipient.checked)
    .map((recipient) => recipient.address);
  const draft = send.draft;
  const wording = send.isEdited
    ? { subject: draft.subject.trim(), body: draft.body.trim() }
    : {};

  return (
    <SendDocumentPage
      copyToSender={send.copyToSender}
      draft={draft}
      error={error}
      isEdited={send.isEdited}
      isPreviewFailed={send.isPreviewFailed}
      isSending={sendEmail.isPending}
      isSendingTest={sendTest.isPending}
      logoSrc={identity.data?.hasLogo ? companyLogoHref() : undefined}
      mailEnabled={ping.data?.mailEnabled !== false}
      onCopyToSenderChange={send.setCopyToSender}
      onDraftChange={send.setDraft}
      onRecipientsChange={send.setRecipients}
      onRemindersChange={send.setReminders}
      onResetDraft={send.resetDraft}
      onSend={() =>
        sendEmail.mutate({
          path: { invoice: invoiceId },
          body: {
            recipients: chosen,
            copyToSender: send.copyToSender,
            ...wording,
            remindersEnabled: send.reminders?.enabled,
            remindersFrequency: send.reminders?.frequency,
          },
        })
      }
      onSendTest={() =>
        sendTest.mutate({ path: { invoice: invoiceId }, body: wording })
      }
      paper={paper.data ?? null}
      preview={send.preview}
      recipients={send.recipients}
      reminders={send.reminders ?? undefined}
      senderEmail={user.email}
      subject={{
        kind: "invoice",
        id: invoiceId,
        number: detail.data.invoice.number,
      }}
    />
  );
}
