import type { InvoiceTodoData } from "@opusline/api-client";
import {
  createInvoiceMutation,
  listInvoicesOptions,
  listInvoicesQueryKey,
  payInvoiceMutation,
  remindInvoiceMutation,
  sendInvoiceMutation,
  showInvoiceOptions,
  showInvoiceQueryKey,
  showInvoiceSummaryOptions,
  showInvoiceSummaryQueryKey,
  showNextInvoiceNumberOptions,
  showNextInvoiceNumberQueryKey,
  updateInvoiceMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMoneyFormat } from "@/components/money-format-provider";
import {
  CreateInvoiceDialog,
  type CreateInvoiceSubmit,
} from "@/features/invoices/components/create-invoice-dialog";
import { InvoiceDrawer } from "@/features/invoices/components/invoice-drawer";
import { InvoiceForecastCard } from "@/features/invoices/components/invoice-forecast-card";
import { InvoiceLifecycleActions } from "@/features/invoices/components/invoice-lifecycle-actions";
import { InvoiceMonthCard } from "@/features/invoices/components/invoice-month-card";
import { InvoiceSummaryTiles } from "@/features/invoices/components/invoice-summary-tiles";
import { InvoiceTodoPanel } from "@/features/invoices/components/invoice-todo-panel";
import { InvoicesTable } from "@/features/invoices/components/invoices-table";
import { accountTodayCalendarDate } from "@/lib/dates";
import { serverErrorMessage } from "@/lib/validation";

export const Route = createFileRoute("/_authed/invoices")({
  component: FacturesPage,
});

function FacturesPage() {
  const { user } = Route.useRouteContext();
  const format = useMoneyFormat();
  const queryClient = useQueryClient();
  const invoices = useQuery(listInvoicesOptions());
  const summary = useQuery(showInvoiceSummaryOptions());

  const [openInvoiceId, setOpenInvoiceId] = useState<number | null>(null);
  const [creatingFor, setCreatingFor] = useState<InvoiceTodoData | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const detail = useQuery({
    ...showInvoiceOptions({ path: { invoice: openInvoiceId ?? 0 } }),
    enabled: openInvoiceId !== null,
  });

  const nextNumber = useQuery({
    ...showNextInvoiceNumberOptions(),
    enabled: creatingFor !== null,
  });

  // The next free reference is derived from the numbers already taken, so creating an
  // invoice invalidates it — otherwise the following one is prefilled with a reference
  // that was just used and the save is refused as a duplicate.
  const refreshInvoices = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: listInvoicesQueryKey() }),
      queryClient.invalidateQueries({ queryKey: showInvoiceSummaryQueryKey() }),
      queryClient.invalidateQueries({
        queryKey: showNextInvoiceNumberQueryKey(),
      }),
      ...(openInvoiceId === null
        ? []
        : [
            queryClient.invalidateQueries({
              queryKey: showInvoiceQueryKey({
                path: { invoice: openInvoiceId },
              }),
            }),
          ]),
    ]);
  };

  /** Every lifecycle write reports through one message, wherever it was triggered. */
  const reportFailure = (fallback: string) => (error: unknown) => {
    setActionError(serverErrorMessage(error, fallback));
  };

  const remind = useMutation({
    ...remindInvoiceMutation(),
    onMutate: () => setActionError(null),
    onSuccess: refreshInvoices,
    onError: reportFailure("La relance n'a pas pu être notée."),
  });

  const send = useMutation({
    ...sendInvoiceMutation(),
    onMutate: () => setActionError(null),
    onSuccess: refreshInvoices,
    onError: reportFailure("La facture n'a pas pu être marquée envoyée."),
  });

  const setReference = useMutation({
    ...updateInvoiceMutation(),
    onError: reportFailure("La référence n'a pas pu être enregistrée."),
  });

  const pay = useMutation({
    ...payInvoiceMutation(),
    onMutate: () => setActionError(null),
    onSuccess: refreshInvoices,
    onError: reportFailure("L'encaissement n'a pas pu être enregistré."),
  });

  const create = useMutation({
    ...createInvoiceMutation(),
    onSuccess: async () => {
      setCreatingFor(null);
      setCreateError(null);
      await refreshInvoices();
    },
    onError: (error) => {
      setCreateError(
        serverErrorMessage(error, "La facture n'a pas pu être créée."),
      );
    },
  });

  const submitInvoice = (input: CreateInvoiceSubmit) => {
    setCreateError(null);
    create.mutate({
      body: {
        clientId: input.clientId,
        missionId: input.missionId,
        number: input.number,
        // A reference means the document exists somewhere: the invoice is issued, and
        // only an issued invoice counts towards what is still to be collected. Without
        // one it stays a draft, which is what the dialog says it will do.
        status: input.number === null ? 0 : 1,
        // A stale render-context currency is refused by the API (422);
        // see settings-form.ts for the one case needing the snapshot.
        amountHt: { amount: input.amountHtCents, currency: format.currency },
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        timeEntryIds: input.timeEntryIds,
      },
    });
  };

  const noteReminder = (invoiceId: number) => {
    remind.mutate({
      path: { invoice: invoiceId },
      body: { occurredOn: accountTodayCalendarDate(user.timezone), note: null },
    });
  };

  /**
   * A draft with no reference cannot be sent — the API refuses an issued invoice
   * without one — so the reference is written first and the transition follows.
   */
  const markSent = async (invoiceId: number, reference: string | null) => {
    setActionError(null);

    const invoice = detail.data?.invoice;

    if (reference !== null && invoice !== undefined) {
      try {
        await setReference.mutateAsync({
          path: { invoice: invoiceId },
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

    send.mutate({ path: { invoice: invoiceId } });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
          Factures
        </h1>
        <p className="mt-1 max-w-[60ch] text-muted-foreground-3 text-sm text-pretty">
          Les factures sont éditées ailleurs. Opusline garde la trace de ce qui
          est facturé, de ce qui reste à facturer et de ce qui est encaissé.
        </p>
      </div>

      {summary.isPending && <Skeleton className="h-24 w-full" />}
      {summary.data !== undefined && (
        <InvoiceSummaryTiles summary={summary.data} />
      )}

      {(invoices.isError || summary.isError) && (
        <Alert variant="destructive">
          <AlertDescription>
            Impossible de charger les factures. Réessayez dans un instant.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="flex flex-col gap-5">
          {actionError !== null && openInvoiceId === null && (
            <Alert variant="destructive">
              <AlertDescription>{actionError}</AlertDescription>
            </Alert>
          )}

          {summary.data !== undefined && (
            <InvoiceTodoPanel
              todo={summary.data.todo}
              todoTotal={summary.data.todoTotal}
              pendingInvoiceId={
                remind.isPending ? remind.variables?.path.invoice : null
              }
              onRemind={noteReminder}
              onCreateInvoice={(todo) => {
                setCreateError(null);
                setCreatingFor(todo);
              }}
            />
          )}

          {invoices.isPending && (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          )}
          {invoices.data !== undefined && (
            <InvoicesTable
              accountToday={accountTodayCalendarDate(user.timezone)}
              clientTotals={invoices.data.clientTotals}
              invoices={invoices.data.invoices}
              onOpen={setOpenInvoiceId}
            />
          )}
        </div>

        {summary.data !== undefined && (
          <div className="flex flex-col gap-5">
            <InvoiceForecastCard summary={summary.data} />
            <InvoiceMonthCard summary={summary.data} />
          </div>
        )}
      </div>

      <CreateInvoiceDialog
        todo={creatingFor}
        suggestedNumber={nextNumber.data?.number ?? null}
        isSaving={create.isPending}
        error={createError}
        onOpenChange={(open) => {
          if (!open) {
            setCreatingFor(null);
            setCreateError(null);
          }
        }}
        onSubmit={submitInvoice}
      />

      <InvoiceDrawer
        detail={detail.data}
        actions={
          detail.data === undefined ? null : (
            <InvoiceLifecycleActions
              accountToday={accountTodayCalendarDate(user.timezone)}
              invoice={detail.data.invoice}
              isPending={
                send.isPending || setReference.isPending || pay.isPending
              }
              error={actionError}
              onSend={(reference) =>
                markSent(detail.data.invoice.id, reference)
              }
              onPay={(paidOn) =>
                pay.mutate({
                  path: { invoice: detail.data.invoice.id },
                  body: { paidOn },
                })
              }
              onRemind={() => noteReminder(detail.data.invoice.id)}
            />
          )
        }
        open={openInvoiceId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setOpenInvoiceId(null);
          }
        }}
      />
    </div>
  );
}
