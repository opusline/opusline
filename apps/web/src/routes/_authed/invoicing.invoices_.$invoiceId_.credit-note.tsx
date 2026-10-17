import {
  type IssueCreditNoteData,
  previewCreditNotePaper,
} from "@opusline/api-client";
import {
  issueCreditNoteMutation,
  showInvoiceOptions,
  showInvoicingSettingsOptions,
  showSettingsOptions,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useToast } from "@opusline/ui/components/toast";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { useDeferredValue, useState } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { CreditNoteEditorPage } from "@/features/invoices/components/credit-note-editor-page";
import {
  type CreditNoteDraft,
  creditNotePayload,
  hasReceivedMoney,
  newCreditNoteDraft,
} from "@/features/invoices/lib/credit-note-draft";
import { requireInvoicing } from "@/lib/features";
import { companyLogoHref } from "@/lib/logos";
import { invalidateInvoiceWrites } from "@/lib/query-invalidation";
import { useSettled } from "@/lib/use-settled";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

type CreditNoteSearch = {
  /** Which credit note the invoice's action opened: full, partial or balance. */
  kind?: CreditNoteDraft["kind"];
  /** « Corriger la facture »: a corrected invoice opens after. */
  reissue?: boolean;
};

export const Route = createFileRoute(
  "/_authed/invoicing/invoices_/$invoiceId_/credit-note",
)({
  beforeLoad: ({ context }) => requireInvoicing(context.user),
  validateSearch: (search: Record<string, unknown>): CreditNoteSearch => {
    const kind = Number(search.kind);

    return {
      ...(kind === 0 || kind === 1 || kind === 2 ? { kind } : {}),
      ...(search.reissue === true || search.reissue === "true"
        ? { reissue: true }
        : {}),
    };
  },
  component: CreditNoteRoute,
});

function CreditNoteRoute() {
  const invoiceId = Number(Route.useParams().invoiceId);
  const { kind, reissue } = Route.useSearch();
  const format = useMoneyFormat();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const detail = useQuery({
    ...showInvoiceOptions({ path: { invoice: invoiceId } }),
    retry: false,
  });
  const settings = useQuery(showInvoicingSettingsOptions());
  const identity = useQuery(showSettingsOptions());
  const [draft, setDraft] = useState(() =>
    newCreditNoteDraft(kind ?? 1, reissue === true),
  );
  const [error, setError] = useState<string | null>(null);
  const payload = useDeferredValue(
    detail.data === undefined
      ? null
      : creditNotePayload(format, draft, hasReceivedMoney(detail.data)),
  );
  const previewBody = useSettled(JSON.stringify(payload));
  const preview = useQuery({
    queryKey: ["credit-note-preview", invoiceId, previewBody],
    queryFn: async () => {
      const { data } = await previewCreditNotePaper({
        path: { invoice: invoiceId },
        body: JSON.parse(previewBody) as IssueCreditNoteData,
        throwOnError: true,
      });

      return data;
    },
    enabled: payload !== null,
    placeholderData: keepPreviousData,
    retry: false,
  });
  const issue = useMutation({
    ...issueCreditNoteMutation(),
    onMutate: () => setError(null),
    onSuccess: async (issued) => {
      await invalidateInvoiceWrites(queryClient);
      toast.add({
        title: m.credit_note_issued({ number: issued.creditNote.number }),
      });

      if (draft.reissue) {
        await navigate({
          to: "/invoicing/invoices/new",
          search: { duplicate: invoiceId },
        });

        return;
      }

      await navigate({
        to: "/invoicing/invoices/$invoiceId",
        params: { invoiceId: String(invoiceId) },
      });
    },
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.credit_note_issue_failed())),
  });

  if (detail.isError || settings.isError) {
    return (
      <Alert className="max-w-200" variant="warn">
        <CircleAlert />
        <AlertDescription>{m.editor_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  if (detail.data === undefined || settings.data === undefined) {
    return <Skeleton className="h-150 w-full" />;
  }

  return (
    <CreditNoteEditorPage
      canIssue={payload !== null}
      detail={detail.data}
      draft={draft}
      error={
        error ??
        (preview.isError
          ? serverErrorMessage(preview.error, m.credit_note_preview_failed())
          : null)
      }
      isPending={issue.isPending}
      logoSrc={identity.data?.hasLogo ? companyLogoHref() : undefined}
      nextNumber={settings.data.nextCreditNoteNumber}
      onChange={setDraft}
      onIssue={() => {
        if (payload !== null) {
          issue.mutate({ path: { invoice: invoiceId }, body: payload });
        }
      }}
      paper={payload === null ? null : (preview.data ?? null)}
      vatLiable={settings.data.vatLiable}
    />
  );
}
