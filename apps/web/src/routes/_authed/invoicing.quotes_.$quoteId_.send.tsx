import { previewQuoteEmail } from "@opusline/api-client";
import {
  getPingOptions,
  sendQuoteEmailMutation,
  showQuoteOptions,
  showQuotePaperOptions,
  showSettingsOptions,
  testQuoteEmailMutation,
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
import { invalidateQuoteWrites } from "@/lib/query-invalidation";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute(
  "/_authed/invoicing/quotes_/$quoteId_/send",
)({
  beforeLoad: ({ context }) => requireInvoicing(context.user),
  component: SendQuoteRoute,
});

function SendQuoteRoute() {
  const { user } = Route.useRouteContext();
  const quoteId = Number(Route.useParams().quoteId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const detail = useQuery({
    ...showQuoteOptions({ path: { quote: quoteId } }),
    retry: false,
  });
  const identity = useQuery(showSettingsOptions());
  const ping = useQuery(getPingOptions());
  const paper = useQuery({
    ...showQuotePaperOptions({
      path: { quote: quoteId },
      query: { language: detail.data?.quote.language ?? 0 },
    }),
    enabled: detail.data !== undefined && detail.data.quote.source === 1,
  });
  const [error, setError] = useState<string | null>(null);
  const send = useSendDocument({
    kind: 1,
    knownAddress: detail.data?.client.billingEmail ?? null,
    previewKey: `quote-${quoteId}`,
    preview: async (draft) => {
      const { data } = await previewQuoteEmail({
        path: { quote: quoteId },
        body: draft,
        throwOnError: true,
      });

      return data;
    },
  });

  const sendEmail = useMutation({
    ...sendQuoteEmailMutation(),
    onMutate: () => setError(null),
    onSuccess: async (sent) => {
      toast.add({
        title: m.send_sent_toast({ recipients: sent.recipients.join(", ") }),
      });
      await invalidateQuoteWrites(queryClient);
      await navigate({
        to: "/invoicing/quotes/$quoteId",
        params: { quoteId: String(quoteId) },
      });
    },
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.send_failed())),
  });
  const sendTest = useMutation({
    ...testQuoteEmailMutation(),
    onMutate: () => setError(null),
    onSuccess: () => toast.add({ title: m.emails_test_sent() }),
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.emails_test_failed())),
  });

  if (detail.isPending || send.isPending) {
    return <Skeleton className="h-150 w-full" />;
  }

  if (
    detail.isError ||
    send.isError ||
    send.draft === null ||
    detail.data.quote.number === null
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
      onResetDraft={send.resetDraft}
      onSend={() =>
        sendEmail.mutate({
          path: { quote: quoteId },
          body: {
            recipients: chosen,
            copyToSender: send.copyToSender,
            ...wording,
          },
        })
      }
      onSendTest={() =>
        sendTest.mutate({ path: { quote: quoteId }, body: wording })
      }
      paper={paper.data ?? null}
      preview={send.preview}
      recipients={send.recipients}
      senderEmail={user.email}
      subject={{ kind: "quote", id: quoteId, number: detail.data.quote.number }}
    />
  );
}
