import {
  payInvoiceMutation,
  remindInvoiceMutation,
  sendInvoiceMutation,
  showInvoiceOptions,
  updateInvoiceMutation,
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
  };

  const openInvoice = useCallback((invoiceId: number) => {
    setActionError(null);
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
        }
      }),
    [router],
  );

  const refresh = () => invalidateInvoiceWrites(queryClient);

  /** Every lifecycle write reports through one message, wherever it was triggered. */
  const reportFailure = (fallback: string) => (error: unknown) => {
    setActionError(serverErrorMessage(error, fallback));
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

  const setReference = useMutation({
    ...updateInvoiceMutation(),
    onError: reportFailure(m.invoices_reference_failed()),
  });

  const pay = useMutation({
    ...payInvoiceMutation(),
    onMutate: () => setActionError(null),
    onSuccess: refresh,
    onError: reportFailure(m.invoices_pay_failed()),
  });

  /**
   * A draft with no reference cannot be sent — the API refuses an issued invoice
   * without one — so the reference is written first and the transition follows.
   */
  const markSent = async (reference: string | null) => {
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

    send.mutate({ path: { invoice: invoice.id } });
  };

  const accountToday = accountTodayCalendarDate(timezone);

  return (
    <InvoiceDrawerContext.Provider value={openInvoice}>
      {children}

      <InvoiceDrawer
        actions={
          detail.data === undefined ? null : (
            <InvoiceLifecycleActions
              accountToday={accountToday}
              error={actionError}
              invoice={detail.data.invoice}
              isPending={
                send.isPending ||
                setReference.isPending ||
                pay.isPending ||
                remind.isPending
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
              onSend={(reference) => void markSent(reference)}
            />
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
