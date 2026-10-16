import type { DocumentLanguage } from "@opusline/api-client";
import { client as apiClient } from "@opusline/api-client/client";
import {
  acceptQuoteMutation,
  deleteQuoteMutation,
  refuseQuoteMutation,
  reopenQuoteMutation,
  showQuoteOptions,
  showQuotePaperOptions,
  showSettingsOptions,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useToast } from "@opusline/ui/components/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { useMoneyFormat } from "@/components/money-format-provider";
import { QuoteDocumentPage } from "@/features/invoices/components/quote-document-page";
import { formatAmountWithCents } from "@/lib/billing";
import { requireInvoicing } from "@/lib/features";
import { companyLogoHref } from "@/lib/logos";
import { invalidateQuoteWrites } from "@/lib/query-invalidation";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/invoicing/quotes_/$quoteId")({
  beforeLoad: ({ context }) => requireInvoicing(context.user),
  component: QuoteDocumentRoute,
});

function pdfHref(quoteId: number, language: DocumentLanguage): string {
  return apiClient.buildUrl({
    url: "/invoicing/quotes/{quote}/pdf",
    path: { quote: quoteId },
    query: { language },
  });
}

function QuoteDocumentRoute() {
  const quoteId = Number(Route.useParams().quoteId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const format = useMoneyFormat();
  const detail = useQuery({
    ...showQuoteOptions({ path: { quote: quoteId } }),
    retry: false,
  });
  const identity = useQuery(showSettingsOptions());
  const [chosenLanguage, setLanguage] = useState<DocumentLanguage | null>(null);
  const language = chosenLanguage ?? detail.data?.quote.language ?? 0;
  const paper = useQuery({
    ...showQuotePaperOptions({
      path: { quote: quoteId },
      query: { language },
    }),
    enabled: detail.data !== undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const refresh = () => invalidateQuoteWrites(queryClient);
  const number = () => detail.data?.quote.number ?? "";
  const accept = useMutation({
    ...acceptQuoteMutation(),
    onMutate: () => setError(null),
    onSuccess: async () => {
      toast.add({ title: m.quote_accepted_toast({ number: number() }) });
      await refresh();
    },
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.quote_decide_failed())),
  });
  const refuse = useMutation({
    ...refuseQuoteMutation(),
    onMutate: () => setError(null),
    onSuccess: async () => {
      toast.add({ title: m.quote_refused_toast({ number: number() }) });
      await refresh();
    },
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.quote_decide_failed())),
  });
  const reopen = useMutation({
    ...reopenQuoteMutation(),
    onMutate: () => setError(null),
    onSuccess: async () => {
      toast.add({ title: m.quote_reopened_toast({ number: number() }) });
      await refresh();
    },
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.quote_reopen_failed())),
  });
  const remove = useMutation({
    ...deleteQuoteMutation(),
    onMutate: () => setError(null),
    onSuccess: async () => {
      toast.add({ title: m.quote_deleted() });
      await navigate({ to: "/invoicing/quotes" });
      await refresh();
    },
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.quote_delete_failed())),
  });

  if (detail.isPending) {
    return <Skeleton className="h-150 w-full" />;
  }

  if (detail.isError) {
    return (
      <Alert className="max-w-200" variant="warn">
        <CircleAlert />
        <AlertDescription>{m.quote_document_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  const path = { path: { quote: quoteId } };

  return (
    <>
      <QuoteDocumentPage
        detail={detail.data}
        error={error}
        isPending={
          accept.isPending ||
          refuse.isPending ||
          reopen.isPending ||
          remove.isPending
        }
        language={language}
        logoSrc={identity.data?.hasLogo ? companyLogoHref() : undefined}
        onAccept={() => accept.mutate({ ...path, body: {} })}
        onDelete={() => setIsConfirmingDelete(true)}
        onLanguageChange={setLanguage}
        onRefuse={() => refuse.mutate({ ...path, body: {} })}
        onReopen={() => reopen.mutate(path)}
        onRetryPaper={paper.isError ? () => void paper.refetch() : undefined}
        paper={paper.data ?? null}
        pdfHref={(chosen) => pdfHref(quoteId, chosen)}
      />
      <ConfirmDeleteDialog
        confirmLabel={m.quote_delete_draft()}
        description={m.quote_delete_body({
          amount: formatAmountWithCents(
            format,
            detail.data.quote.amountTtc.amount,
          ),
          client: detail.data.client.name,
        })}
        isDeleting={remove.isPending}
        onConfirm={() => {
          setIsConfirmingDelete(false);
          remove.mutate(path);
        }}
        onOpenChange={setIsConfirmingDelete}
        open={isConfirmingDelete}
        title={m.quote_delete_title()}
      />
    </>
  );
}
