import type { InvoiceTodoData } from "@opusline/api-client";
import {
  createInvoiceMutation,
  listInvoicesOptions,
  listInvoicesQueryKey,
  remindInvoiceMutation,
  showInvoiceOptions,
  showInvoiceSummaryOptions,
  showInvoiceSummaryQueryKey,
  showNextInvoiceNumberOptions,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  CreateInvoiceDialog,
  type CreateInvoiceSubmit,
} from "@/features/invoices/components/create-invoice-dialog";
import { InvoiceDrawer } from "@/features/invoices/components/invoice-drawer";
import { InvoiceForecastCard } from "@/features/invoices/components/invoice-forecast-card";
import { InvoiceMonthCard } from "@/features/invoices/components/invoice-month-card";
import { InvoiceSummaryTiles } from "@/features/invoices/components/invoice-summary-tiles";
import { InvoiceTodoPanel } from "@/features/invoices/components/invoice-todo-panel";
import { InvoicesTable } from "@/features/invoices/components/invoices-table";
import { todayCalendarDate } from "@/lib/dates";

export const Route = createFileRoute("/_authed/factures")({
  component: FacturesPage,
});

function FacturesPage() {
  const queryClient = useQueryClient();
  const invoices = useQuery(listInvoicesOptions());
  const summary = useQuery(showInvoiceSummaryOptions());

  const [openInvoiceId, setOpenInvoiceId] = useState<number | null>(null);
  const [creatingFor, setCreatingFor] = useState<InvoiceTodoData | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const detail = useQuery({
    ...showInvoiceOptions({ path: { invoice: openInvoiceId ?? 0 } }),
    enabled: openInvoiceId !== null,
  });

  const nextNumber = useQuery({
    ...showNextInvoiceNumberOptions(),
    enabled: creatingFor !== null,
  });

  const refreshInvoices = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: listInvoicesQueryKey() }),
      queryClient.invalidateQueries({ queryKey: showInvoiceSummaryQueryKey() }),
    ]);
  };

  const remind = useMutation({
    ...remindInvoiceMutation(),
    onSuccess: refreshInvoices,
  });

  const create = useMutation({
    ...createInvoiceMutation(),
    onSuccess: async () => {
      setCreatingFor(null);
      setCreateError(null);
      await refreshInvoices();
    },
    onError: () => {
      setCreateError(
        "La facture n'a pas pu être créée. Vérifiez la référence et le montant.",
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
        amountHt: { amount: input.amountHtCents, currency: "EUR" },
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        timeEntryIds: input.timeEntryIds,
      },
    });
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
          {summary.data !== undefined && (
            <InvoiceTodoPanel
              todo={summary.data.todo}
              todoTotal={summary.data.todoTotal}
              pendingInvoiceId={
                remind.isPending ? remind.variables?.path.invoice : null
              }
              onRemind={(invoiceId) => {
                remind.mutate({
                  path: { invoice: invoiceId },
                  body: { occurredOn: todayCalendarDate(), note: null },
                });
              }}
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
        clientId={creatingFor?.clientId ?? null}
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
