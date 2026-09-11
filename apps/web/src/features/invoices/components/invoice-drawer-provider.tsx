import type { InvoiceDetailData } from "@opusline/api-client";
import {
  correctInvoiceDatesMutation,
  deleteInvoiceDocumentMutation,
  payInvoiceMutation,
  remindInvoiceMutation,
  reopenInvoiceMutation,
  sendInvoiceMutation,
  showInvoiceOptions,
  updateInvoiceMutation,
  uploadInvoiceDocumentMutation,
} from "@opusline/api-client/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { accountTodayCalendarDate } from "@/lib/dates";
import { invalidateInvoiceWrites } from "@/lib/query-invalidation";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

import { sentOnFrom } from "../lib/history";
import type { InvoiceDateCorrection } from "./invoice-date-corrections";
import { InvoiceDateCorrections } from "./invoice-date-corrections";
import { InvoiceDocumentPanel } from "./invoice-document-panel";
import { InvoiceDrawer } from "./invoice-drawer";
import { InvoiceLifecycleActions } from "./invoice-lifecycle-actions";

type OpenInvoice = (invoiceId: number) => void;

const InvoiceDrawerContext = createContext<OpenInvoice | null>(null);

/**
 * The invoice fiche, mounted once for the whole authed app.
 *
 * Every screen that lists invoices — the ledger, the revenue page, the client
 * and mission fiches — used to carry its own copy of the detail query and of
 * the lifecycle writes around the drawer. Holding them here means a row opens a
 * fiche with `useOpenInvoice()` and nothing else, and an invoice behaves the
 * same wherever it was opened from.
 */
export function InvoiceDrawerProvider({
  timezone,
  children,
}: {
  timezone: string;
  children: ReactNode;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [openInvoiceId, setOpenInvoiceId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  // Their own channels: the corrections form and the document panel are further
  // forms in the same drawer, and neither a refused correction nor a refused
  // upload must read as a refused transition.
  const [correctionError, setCorrectionError] = useState<string | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);

  const detail = useQuery({
    ...showInvoiceOptions({ path: { invoice: openInvoiceId ?? 0 } }),
    enabled: openInvoiceId !== null,
    // A deep-linked id can be stale (deleted invoice, foreign account); its
    // 404 is deterministic, so retrying only stretches the loading state.
    retry: false,
  });

  const closeInvoice = () => {
    setOpenInvoiceId(null);
    setActionError(null);
    setCorrectionError(null);
    setDocumentError(null);
  };

  const openInvoice = useCallback((invoiceId: number) => {
    setActionError(null);
    setCorrectionError(null);
    setDocumentError(null);
    setOpenInvoiceId(invoiceId);
  }, []);

  // The fiche is mounted above the Outlet, so a route change never unmounts it
  // and browser Back would leave a modal sheet stranded over the page behind.
  // Only a path change dismisses it: the ledger consuming its `?invoice=` is a
  // search-only navigation, and that must not close what it just opened.
  useEffect(
    () =>
      router.subscribe("onBeforeNavigate", (event) => {
        if (event.pathChanged) {
          setOpenInvoiceId(null);
          setActionError(null);
          setCorrectionError(null);
          setDocumentError(null);
        }
      }),
    [router],
  );

  const refresh = () => invalidateInvoiceWrites(queryClient);

  /** Every lifecycle write reports through one message, wherever it was triggered. */
  const reportFailure = (fallback: string) => (error: unknown) => {
    setActionError(serverErrorMessage(error, fallback));
  };

  const reportCorrectionFailure = (error: unknown) => {
    setCorrectionError(
      serverErrorMessage(error, m.invoices_correct_dates_failed()),
    );
  };

  const remind = useMutation({
    ...remindInvoiceMutation(),
    onMutate: () => setActionError(null),
    onSuccess: refresh,
    onError: reportFailure(m.invoices_remind_failed()),
  });

  const send = useMutation({
    ...sendInvoiceMutation(),
    onMutate: () => setActionError(null),
    onSuccess: refresh,
    onError: reportFailure(m.invoices_send_failed()),
  });

  // The reference lands even when the send that follows it fails, so it owes
  // the same refresh as any other write — otherwise the lists keep showing a
  // draft with no reference until a reload.
  const setReference = useMutation({
    ...updateInvoiceMutation(),
    onSuccess: refresh,
    onError: reportFailure(m.invoices_reference_failed()),
  });

  /**
   * Mark the open invoice paid in the cache before the server answers. Only the
   * fiche's own status and date are painted: `invalidateInvoiceWrites` fans out
   * to seven query sets — the ledger, the summaries, treasury, the fiscal board
   * — and guessing at money that is derived in four places is how a screen ends
   * up lying. Those follow on the refetch, as they always did.
   */
  const paintPaid = (invoice: number, paidOn: string) => {
    const queryKey = showInvoiceOptions({ path: { invoice } }).queryKey;
    const previous = queryClient.getQueryData<InvoiceDetailData>(queryKey);

    if (previous === undefined) {
      return () => undefined;
    }

    queryClient.setQueryData<InvoiceDetailData>(queryKey, {
      ...previous,
      invoice: { ...previous.invoice, status: 2, paidOn, isLate: false },
    });

    return () => queryClient.setQueryData(queryKey, previous);
  };

  const pay = useMutation({
    ...payInvoiceMutation(),
    onMutate: ({ path, body }) => {
      setActionError(null);

      return { undo: paintPaid(path.invoice, body.paidOn) };
    },
    onSuccess: refresh,
    onError: (error, _variables, context) => {
      context?.undo();
      reportFailure(m.invoices_pay_failed())(error);
    },
  });

  const reopen = useMutation({
    ...reopenInvoiceMutation(),
    onMutate: () => setActionError(null),
    onSuccess: refresh,
    onError: reportFailure(m.invoices_reopen_failed()),
  });

  const correctDates = useMutation({
    ...correctInvoiceDatesMutation(),
    onMutate: () => setCorrectionError(null),
    onSuccess: refresh,
    onError: reportCorrectionFailure,
  });

  const reportDocumentFailure = (fallback: string) => (error: unknown) => {
    setDocumentError(serverErrorMessage(error, fallback));
  };

  const fileDocument = useMutation({
    ...uploadInvoiceDocumentMutation(),
    onMutate: () => setDocumentError(null),
    onSuccess: refresh,
    onError: reportDocumentFailure(m.invoices_document_failed()),
  });

  const unfileDocument = useMutation({
    ...deleteInvoiceDocumentMutation(),
    onMutate: () => setDocumentError(null),
    onSuccess: refresh,
    onError: reportDocumentFailure(m.invoices_document_remove_failed()),
  });

  /**
   * A draft with no reference cannot be sent — the API refuses an issued invoice
   * without one — so the reference is written first and the transition follows.
   */
  const markSent = async (reference: string | null, sentOn: string) => {
    const invoice = detail.data?.invoice;

    if (invoice === undefined) {
      return;
    }

    setActionError(null);

    if (reference !== null) {
      try {
        await setReference.mutateAsync({
          path: { invoice: invoice.id },
          body: {
            clientId: invoice.clientId,
            missionId: invoice.missionId,
            number: reference,
            issuedOn: invoice.issuedOn,
            dueOn: invoice.dueOn,
            periodStart: invoice.periodStart,
            periodEnd: invoice.periodEnd,
            amountHt: invoice.amountHt,
            amountTtc: invoice.ttcOverridden ? invoice.amountTtc : null,
            vatRateBp: invoice.vatRateBp,
            notes: invoice.notes,
          },
        });
      } catch {
        return;
      }
    }

    send.mutate({ path: { invoice: invoice.id }, body: { sentOn } });
  };

  const accountToday = accountTodayCalendarDate(timezone);

  return (
    <InvoiceDrawerContext.Provider value={openInvoice}>
      {children}

      <InvoiceDrawer
        actions={
          detail.data === undefined ? null : (
            <>
              <InvoiceLifecycleActions
                accountToday={accountToday}
                error={actionError}
                invoice={detail.data.invoice}
                isPending={
                  send.isPending ||
                  setReference.isPending ||
                  pay.isPending ||
                  remind.isPending ||
                  reopen.isPending
                }
                onPay={(paidOn) =>
                  pay.mutate({
                    path: { invoice: detail.data.invoice.id },
                    body: { paidOn },
                  })
                }
                onRemind={() =>
                  remind.mutate({
                    path: { invoice: detail.data.invoice.id },
                    body: { occurredOn: accountToday, note: null },
                  })
                }
                onReopen={() =>
                  reopen.mutate({ path: { invoice: detail.data.invoice.id } })
                }
                onSend={(reference, sentOn) => void markSent(reference, sentOn)}
              />
              {/* Keyed on the invoice: the drawer stays mounted when a row
                  behind it opens another one, and the drafts must re-seed
                  from the invoice now on screen. */}
              <InvoiceDateCorrections
                accountToday={accountToday}
                error={correctionError}
                invoice={detail.data.invoice}
                isPending={correctDates.isPending}
                key={detail.data.invoice.id}
                onSubmit={(correction: InvoiceDateCorrection) =>
                  correctDates.mutate({
                    path: { invoice: detail.data.invoice.id },
                    body: correction,
                  })
                }
                sentOn={sentOnFrom(detail.data)}
              />
              <InvoiceDocumentPanel
                document={detail.data.document}
                error={documentError}
                invoice={detail.data.invoice}
                isPending={fileDocument.isPending || unfileDocument.isPending}
                onRemove={() =>
                  unfileDocument.mutate({
                    path: { invoice: detail.data.invoice.id },
                  })
                }
                onUpload={(file) =>
                  fileDocument.mutate({
                    path: { invoice: detail.data.invoice.id },
                    body: { file },
                  })
                }
              />
            </>
          )
        }
        detail={detail.data}
        error={detail.isError ? m.invoices_open_failed() : null}
        onOpenChange={(open) => {
          if (!open) {
            closeInvoice();
          }
        }}
        open={openInvoiceId !== null}
      />
    </InvoiceDrawerContext.Provider>
  );
}

/** Hand it an invoice id and the fiche opens over whatever page you are on. */
export function useOpenInvoice(): OpenInvoice {
  const openInvoice = useContext(InvoiceDrawerContext);

  if (openInvoice === null) {
    throw new Error("useOpenInvoice must be used inside InvoiceDrawerProvider");
  }

  return openInvoice;
}
