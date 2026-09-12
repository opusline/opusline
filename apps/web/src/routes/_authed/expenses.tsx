import type { ExpenseData, ExpensesMonthData } from "@opusline/api-client";
import {
  attachExpenseReceiptMutation,
  deleteExpenseMutation,
  detachExpenseReceiptMutation,
  listExpensesOptions,
  listExpensesQueryKey,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { PeriodNavigator } from "@opusline/ui/components/period-navigator";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useToast } from "@opusline/ui/components/toast";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useLocale } from "@/components/money-format-provider";
import { DeleteExpenseDialog } from "@/features/expenses/components/delete-expense-dialog";
import { ExpensesPage } from "@/features/expenses/components/expenses-page";
import { JournalTab } from "@/features/expenses/components/journal-tab";
import { type AmountUnit, isAmountUnit } from "@/features/expenses/lib/amounts";
import { receiptRejection } from "@/features/expenses/lib/receipts";
import { accountTodayCalendarDate } from "@/lib/dates";
import { requireFrenchFiscality } from "@/lib/fiscality";
import {
  isAtOrAfterCurrent,
  isPeriod,
  periodKind,
  periodTitle,
  shiftPeriod,
} from "@/lib/periods";
import { invalidateExpenseWrites } from "@/lib/query-invalidation";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

type ExpensesSearch = { period?: string };

export const Route = createFileRoute("/_authed/expenses")({
  validateSearch: (search: Record<string, unknown>): ExpensesSearch => ({
    period:
      isPeriod(search.period) && periodKind(search.period) === "month"
        ? search.period
        : undefined,
  }),
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: ExpensesRoute,
});

function ExpensesRoute() {
  const search = Route.useSearch();
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const locale = useLocale();
  const toast = useToast();

  // A bare URL sends no month: the server answers with its own current month,
  // so the account's calendar decides, not the browser's.
  const journal = useQuery({
    ...listExpensesOptions(
      search.period === undefined
        ? undefined
        : { query: { month: search.period } },
    ),
    placeholderData: keepPreviousData,
  });

  const [unit, setUnit] = useState<AmountUnit>("ht");
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseData | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  // Every write answers with the month it touched, recomputed: write it
  // straight into the cache, then let the other months and screens refetch.
  const acceptMonth = async (month: ExpensesMonthData) => {
    queryClient.setQueryData(
      listExpensesQueryKey({ query: { month: month.month } }),
      month,
    );

    // The bare key is what a URL without a month — and the sidebar badge — reads.
    if (search.period === undefined) {
      queryClient.setQueryData(listExpensesQueryKey(), month);
    }

    await invalidateExpenseWrites(queryClient);
  };

  const attachReceipt = useMutation({
    ...attachExpenseReceiptMutation(),
    onMutate: () => setActionError(null),
    onSuccess: acceptMonth,
    onError: (error) => {
      setActionError(
        serverErrorMessage(error, m.expenses_receipt_attach_failed()),
      );
    },
  });

  const detachReceipt = useMutation({
    ...detachExpenseReceiptMutation(),
    onMutate: () => setActionError(null),
    onSuccess: async (month) => {
      await acceptMonth(month);
      toast.add({ title: m.expenses_receipt_detached() });
    },
    onError: (error) => {
      setActionError(
        serverErrorMessage(error, m.expenses_receipt_detach_failed()),
      );
    },
  });

  const deleteExpense = useMutation({
    ...deleteExpenseMutation(),
    onMutate: () => setActionError(null),
    onSuccess: async () => {
      setExpenseToDelete(null);
      await invalidateExpenseWrites(queryClient);
      toast.add({ title: m.expenses_deleted() });
    },
    onError: (error) => {
      setExpenseToDelete(null);
      setActionError(serverErrorMessage(error, m.expenses_delete_failed()));
    },
  });

  const showPeriod = (period: string) => {
    navigate({ to: "/expenses", search: { period } });
  };

  // One upload at a time: a second drop while one is in flight would race it.
  const onAttachReceipt = (expense: ExpenseData, files: FileList) => {
    const file = files[0];

    if (file === undefined || attachReceipt.isPending) {
      return;
    }

    const rejection = receiptRejection(file);

    if (rejection !== null) {
      setActionError(rejection);
      return;
    }

    attachReceipt.mutate(
      { path: { expense: expense.id }, body: { file } },
      {
        onSuccess: () =>
          toast.add({
            title: m.expenses_receipt_attached({ name: file.name }),
            tone: "success",
          }),
      },
    );
  };

  if (journal.isPending) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (journal.data === undefined) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{m.expenses_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  // The URL is the anchor: after a failed refetch the figures are the last
  // good month's, but the stepper must still move from the month asked for.
  const month = search.period ?? journal.data.month;
  const today = accountTodayCalendarDate(user.timezone);
  const isVatLiable = journal.data.vat !== null;

  return (
    <div className="flex flex-col gap-3.5">
      {journal.isError && (
        <Alert variant="destructive">
          <AlertDescription>{m.expenses_load_failed()}</AlertDescription>
        </Alert>
      )}
      {actionError !== null && (
        <Alert variant="destructive">
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      <ExpensesPage
        action={null}
        controls={
          <>
            <PeriodNavigator
              isNextDisabled={isAtOrAfterCurrent(month, today)}
              label={periodTitle(locale, month)}
              nextLabel={m.expenses_next_month()}
              onNext={() => showPeriod(shiftPeriod(month, 1))}
              onPrevious={() => showPeriod(shiftPeriod(month, -1))}
              previousLabel={m.expenses_previous_month()}
              size="sm"
            />
            {isVatLiable && (
              <SegmentedControl
                aria-label={m.expenses_unit_aria()}
                onValueChange={(value) => {
                  const next = value[0];

                  if (isAmountUnit(next)) {
                    setUnit(next);
                  }
                }}
                size="sm"
                value={[unit]}
                variant="raised"
              >
                <SegmentedControlItem value="ht">
                  {m.common_ht()}
                </SegmentedControlItem>
                <SegmentedControlItem value="ttc">
                  {m.expenses_col_ttc()}
                </SegmentedControlItem>
              </SegmentedControl>
            )}
          </>
        }
      >
        <JournalTab
          isRefreshing={journal.isPlaceholderData}
          month={journal.data}
          onAttachReceipt={onAttachReceipt}
          onDelete={setExpenseToDelete}
          onDetachReceipt={(expense) =>
            detachReceipt.mutate({ path: { expense: expense.id } })
          }
          unit={isVatLiable ? unit : "ttc"}
          uploadingExpenseId={
            attachReceipt.isPending
              ? (attachReceipt.variables?.path.expense ?? null)
              : null
          }
        />
      </ExpensesPage>

      <DeleteExpenseDialog
        expense={expenseToDelete}
        isDeleting={deleteExpense.isPending}
        onConfirm={(expense) =>
          deleteExpense.mutate({ path: { expense: expense.id } })
        }
        onOpenChange={(open) => {
          if (!open) {
            setExpenseToDelete(null);
          }
        }}
      />
    </div>
  );
}
