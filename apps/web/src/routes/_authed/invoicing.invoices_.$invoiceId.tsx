import type { DocumentLanguage } from "@opusline/api-client";
import { client as apiClient } from "@opusline/api-client/client";
import {
  deleteInvoiceMutation,
  payInvoiceMutation,
  remindInvoiceMutation,
  showInvoiceOptions,
  showInvoicePaperOptions,
  showSettingsOptions,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useToast } from "@opusline/ui/components/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { useMoneyFormat } from "@/components/money-format-provider";
import { InvoiceDocumentPage } from "@/features/invoices/components/invoice-document-page";
import { formatAmountWithCents } from "@/lib/billing";
import { accountTodayCalendarDate } from "@/lib/dates";
import { companyLogoHref } from "@/lib/logos";
import { invalidateInvoiceWrites } from "@/lib/query-invalidation";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/invoicing/invoices_/$invoiceId")(
  { component: InvoiceDocumentRoute },
);

function pdfHref(invoiceId: number, language: DocumentLanguage): string {
  return apiClient.buildUrl({
    url: "/invoices/{invoice}/pdf",
    path: { invoice: invoiceId },
    query: { language },
  });
}

function InvoiceDocumentRoute() {
  const { user } = Route.useRouteContext();
  const invoiceId = Number(Route.useParams().invoiceId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const format = useMoneyFormat();
  const detail = useQuery({
    ...showInvoiceOptions({ path: { invoice: invoiceId } }),
    retry: false,
  });
  const identity = useQuery(showSettingsOptions());
  const [chosenLanguage, setLanguage] = useState<DocumentLanguage | null>(null);
  const language = chosenLanguage ?? detail.data?.content?.language ?? 0;
  const paper = useQuery({
    ...showInvoicePaperOptions({
      path: { invoice: invoiceId },
      query: { language },
    }),
    enabled: detail.data?.content != null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const accountToday = accountTodayCalendarDate(user.timezone);

  const refresh = () => invalidateInvoiceWrites(queryClient);
  const pay = useMutation({
    ...payInvoiceMutation(),
    onMutate: () => setError(null),
    onSuccess: refresh,
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.invoices_pay_failed())),
  });
  const remind = useMutation({
    ...remindInvoiceMutation(),
    onMutate: () => setError(null),
    onSuccess: refresh,
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.invoices_remind_failed())),
  });
  const remove = useMutation({
    ...deleteInvoiceMutation(),
    onMutate: () => setError(null),
    onSuccess: async () => {
      toast.add({ title: m.invoices_deleted() });
      await navigate({ to: "/invoicing/invoices" });
      await refresh();
    },
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.invoices_delete_failed())),
  });

  if (detail.isPending) {
    return <Skeleton className="h-150 w-full" />;
  }

  if (detail.isError) {
    return (
      <Alert className="max-w-200" variant="warn">
        <CircleAlert />
        <AlertDescription>{m.document_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  // Recorded from another tool: no sheet to show, so its fiche stays the drawer.
  if (detail.data.content === null) {
    return (
      <Navigate search={{ invoice: invoiceId }} to="/invoicing/invoices" />
    );
  }

  return (
    <>
      <InvoiceDocumentPage
        accountToday={accountToday}
        detail={detail.data}
        error={error}
        isPending={pay.isPending || remind.isPending || remove.isPending}
        language={language}
        logoSrc={identity.data?.hasLogo ? companyLogoHref() : undefined}
        onDelete={() => setIsConfirmingDelete(true)}
        onLanguageChange={setLanguage}
        onPay={(paidOn) =>
          pay.mutate({ path: { invoice: invoiceId }, body: { paidOn } })
        }
        onRemind={() =>
          remind.mutate({
            path: { invoice: invoiceId },
            body: { occurredOn: accountToday, note: null },
          })
        }
        onRetryPaper={paper.isError ? () => void paper.refetch() : undefined}
        paper={paper.data ?? null}
        pdfHref={(chosen) => pdfHref(invoiceId, chosen)}
      />
      <ConfirmDeleteDialog
        confirmLabel={m.invoices_delete_draft()}
        description={m.invoices_delete_body({
          amount: formatAmountWithCents(
            format,
            detail.data.invoice.amountTtc.amount,
          ),
          client: detail.data.client.name,
        })}
        isDeleting={remove.isPending}
        onConfirm={() => {
          setIsConfirmingDelete(false);
          remove.mutate({ path: { invoice: invoiceId } });
        }}
        onOpenChange={setIsConfirmingDelete}
        open={isConfirmingDelete}
        title={m.invoices_delete_title()}
      />
    </>
  );
}
