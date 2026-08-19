import type { InvoiceTodoData } from "@opusline/api-client";
import {
  createInvoiceMutation,
  listInvoicesOptions,
  remindInvoiceMutation,
  showBankAccountOptions,
  showInvoiceSummaryOptions,
  showNextInvoiceNumberOptions,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMoneyFormat } from "@/components/money-format-provider";
import {
  CreateInvoiceDialog,
  type CreateInvoiceSubmit,
} from "@/features/invoices/components/create-invoice-dialog";
import { useOpenInvoice } from "@/features/invoices/components/invoice-drawer-provider";
import { InvoiceForecastCard } from "@/features/invoices/components/invoice-forecast-card";
import { InvoiceMonthCard } from "@/features/invoices/components/invoice-month-card";
import { InvoiceSummaryTiles } from "@/features/invoices/components/invoice-summary-tiles";
import { InvoiceTodoPanel } from "@/features/invoices/components/invoice-todo-panel";
import { InvoicesTable } from "@/features/invoices/components/invoices-table";
import { accountTodayCalendarDate } from "@/lib/dates";
import { invalidateInvoiceWrites } from "@/lib/query-invalidation";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

type FacturesSearch = { invoice?: number };

export const Route = createFileRoute("/_authed/invoices")({
  validateSearch: (search: Record<string, unknown>): FacturesSearch => {
    const invoice = Number(search.invoice);

    return Number.isInteger(invoice) && invoice > 0 ? { invoice } : {};
  },
  component: FacturesPage,
});

function FacturesPage() {
  const { user } = Route.useRouteContext();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const format = useMoneyFormat();
  const queryClient = useQueryClient();
  const invoices = useQuery(listInvoicesOptions());
  const summary = useQuery(showInvoiceSummaryOptions());

  // The Compte pro balance tile; the endpoint exists for every account, but the
  // screen it belongs to is gated, so ungated accounts keep the placeholder.
  const bank = useQuery({
    ...showBankAccountOptions(),
    enabled: user.hasFrenchFiscality,
  });

  const openInvoice = useOpenInvoice();
  const [creatingFor, setCreatingFor] = useState<InvoiceTodoData | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [remindError, setRemindError] = useState<string | null>(null);

  // `?invoice=` is how the other screens deep-link a fiche — the Compte pro
  // suggestions, a shared link. The drawer owns it from there, so the parameter
  // is consumed rather than mirrored, and back does not walk every fiche viewed.
  useEffect(() => {
    if (search.invoice === undefined) {
      return;
    }

    openInvoice(search.invoice);
    void navigate({ to: "/invoices", search: {}, replace: true });
  }, [search.invoice, openInvoice, navigate]);

  const nextNumber = useQuery({
    ...showNextInvoiceNumberOptions(),
    enabled: creatingFor !== null,
  });

  const refreshInvoices = () => invalidateInvoiceWrites(queryClient);

  // Noting a reminder from the "à traiter" panel reports here rather than in the
  // drawer, which is not open when the panel triggers it.
  const remind = useMutation({
    ...remindInvoiceMutation(),
    onMutate: () => setRemindError(null),
    onSuccess: refreshInvoices,
    onError: (error) => {
      setRemindError(serverErrorMessage(error, m.invoices_remind_failed()));
    },
  });

  const create = useMutation({
    ...createInvoiceMutation(),
    onSuccess: async () => {
      setCreatingFor(null);
      setCreateError(null);
      await refreshInvoices();
    },
    onError: (error) => {
      setCreateError(serverErrorMessage(error, m.invoices_create_failed()));
    },
  });

  const noteReminder = (invoiceId: number) => {
    remind.mutate({
      path: { invoice: invoiceId },
      body: { occurredOn: accountTodayCalendarDate(user.timezone), note: null },
    });
  };

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
        vatRateBp: input.vatRateBp,
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
          {m.nav_invoices()}
        </h1>
        <p className="mt-1 max-w-[60ch] text-muted-foreground-3 text-sm text-pretty">
          {m.invoices_page_intro()}
        </p>
      </div>

      {summary.isPending && <Skeleton className="h-24 w-full" />}
      {summary.data !== undefined && (
        <InvoiceSummaryTiles
          bankBalance={bank.data?.balance}
          summary={summary.data}
        />
      )}

      {(invoices.isError || summary.isError) && (
        <Alert variant="destructive">
          <AlertDescription>{m.invoices_load_failed()}</AlertDescription>
        </Alert>
      )}
      {/* Without this, a failed bank fetch would leave the balance tile
          claiming no balance was ever recorded. */}
      {bank.isError && (
        <Alert variant="destructive">
          <AlertDescription>{m.bank_load_failed()}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="flex flex-col gap-5">
          {remindError !== null && (
            <Alert variant="destructive">
              <AlertDescription>{remindError}</AlertDescription>
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
              onOpen={openInvoice}
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
        vatLiable={user.vatLiable}
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
    </div>
  );
}
