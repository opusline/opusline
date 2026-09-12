import type { ExpenseData, ExpensesMonthData } from "@opusline/api-client";
import {
  attachExpenseReceiptMutation,
  createExpenseMutation,
  deleteExpenseMutation,
  detachExpenseReceiptMutation,
  listExpensesOptions,
  listExpensesQueryKey,
  updateExpenseMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
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
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { DeleteExpenseDialog } from "@/features/expenses/components/delete-expense-dialog";
import {
  ExpenseSheet,
  type ExpenseSheetState,
} from "@/features/expenses/components/expense-sheet";
import { ExpensesPage } from "@/features/expenses/components/expenses-page";
import { JournalTab } from "@/features/expenses/components/journal-tab";
import { type AmountUnit, isAmountUnit } from "@/features/expenses/lib/amounts";
import {
  draftToPayload,
  type ExpenseDraft,
  emptyExpenseDraft,
  expenseToDraft,
} from "@/features/expenses/lib/expense-draft";
import { monthName } from "@/features/expenses/lib/labels";
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
import {
  serverErrorMessage,
  serverFieldErrors,
  writeErrorBanner,
} from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

type ExpensesSearch = { period?: string; expense?: number };

export const Route = createFileRoute("/_authed/expenses")({
  validateSearch: (search: Record<string, unknown>): ExpensesSearch => {
    const expense = Number(search.expense);

    return {
      period:
        isPeriod(search.period) && periodKind(search.period) === "month"
          ? search.period
          : undefined,
      expense: Number.isInteger(expense) && expense > 0 ? expense : undefined,
    };
  },
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: ExpensesRoute,
});

function ExpensesRoute() {
  const search = Route.useSearch();
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const locale = useLocale();
  const format = useMoneyFormat();
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
  const [sheet, setSheet] = useState<ExpenseSheetState | null>(null);
  const [sheetError, setSheetError] = useState<unknown>(null);

  // Every write answers with the month it touched, recomputed: write it
  // straight into the cache, then let the other months and screens refetch.
  const acceptMonth = async (month: ExpensesMonthData) => {
    queryClient.setQueryData(
      listExpensesQueryKey({ query: { month: month.month } }),
      month,
    );

    // The bare key is what a URL without a month — and the sidebar badge — reads:
    // only the current month belongs there, whatever month a write just touched.
    if (month.month === journal.data?.month && search.period === undefined) {
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

  const showPeriod = (period: string) => {
    navigate({ to: "/expenses", search: { period } });
  };

  const closeSheet = () => {
    setSheet(null);
    setSheetError(null);
  };

  // The API answers a create with the month, not the row: the new row is the
  // youngest one matching what was sent, which is where a picked receipt goes.
  const createdRow = (month: ExpensesMonthData, draft: ExpenseDraft) =>
    month.expenses
      .filter(
        (row) =>
          row.supplier === draft.supplier.trim() &&
          row.spentOn === draft.spentOn,
      )
      .sort((a, b) => b.id - a.id)[0] ?? null;

  // The receipt picked in the sheet rides after the save; a failure there is
  // told once, in the toast — the row stays Bloquée and the journal offers
  // the drop target again.
  const attachPickedReceipt = useMutation({
    ...attachExpenseReceiptMutation(),
    onSuccess: acceptMonth,
  });

  const savedToast = (row: ExpenseData | null, isCreate: boolean) => {
    if (row?.isRegularisation) {
      const claimMonth = monthName(locale, row.vatClaimPeriod);

      return isCreate
        ? m.expenses_created_regularised({ month: claimMonth })
        : m.expenses_updated_regularised({ month: claimMonth });
    }

    if (!isCreate) {
      return m.expenses_updated();
    }

    return row?.receipt === null
      ? m.expenses_created_no_receipt()
      : m.expenses_created();
  };

  const createExpense = useMutation({
    ...createExpenseMutation(),
    onMutate: () => setSheetError(null),
    onError: setSheetError,
  });

  const updateExpense = useMutation({
    ...updateExpenseMutation(),
    onMutate: () => setSheetError(null),
    onError: setSheetError,
  });

  const submitSheet = (draft: ExpenseDraft) => {
    if (sheet === null || journal.data === undefined) {
      return;
    }

    const body = draftToPayload(format, draft, journal.data.vat !== null);

    if (body === null) {
      return;
    }

    const shownMonth = search.period ?? journal.data.month;
    const isCreate = sheet.mode === "create";

    const onSaved = async (
      month: ExpensesMonthData,
      row: ExpenseData | null,
    ) => {
      closeSheet();
      await acceptMonth(month);

      if (month.month !== shownMonth) {
        showPeriod(month.month);
      }

      if (row === null || draft.receipt === null) {
        toast.add({ title: savedToast(row, isCreate), tone: "success" });
        return;
      }

      attachPickedReceipt.mutate(
        { path: { expense: row.id }, body: { file: draft.receipt } },
        {
          onSuccess: (withReceipt) =>
            toast.add({
              title: savedToast(
                withReceipt.expenses.find(
                  (candidate) => candidate.id === row.id,
                ) ?? row,
                isCreate,
              ),
              tone: "success",
            }),
          onError: () =>
            toast.add({ title: m.expenses_created_receipt_failed() }),
        },
      );
    };

    if (sheet.mode === "edit") {
      const expenseId = sheet.expense.id;

      updateExpense.mutate(
        { path: { expense: expenseId }, body },
        {
          onSuccess: (month) =>
            onSaved(
              month,
              month.expenses.find((row) => row.id === expenseId) ?? null,
            ),
        },
      );

      return;
    }

    createExpense.mutate(
      { body },
      { onSuccess: (month) => onSaved(month, createdRow(month, draft)) },
    );
  };

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

  const today = accountTodayCalendarDate(user.timezone);

  // `?expense=` deep-links a row into its sheet — the rail, the declarations
  // screen. Consumed rather than mirrored, so back does not reopen it; and
  // only once the linked month is really on screen, not a placeholder.
  const deepLinkedId = search.expense;
  const deepLinkedRow =
    deepLinkedId === undefined
      ? undefined
      : journal.data?.expenses.find((row) => row.id === deepLinkedId);
  useEffect(() => {
    if (
      deepLinkedId === undefined ||
      journal.data === undefined ||
      journal.isPlaceholderData
    ) {
      return;
    }

    if (deepLinkedRow !== undefined) {
      setSheet({ mode: "edit", expense: deepLinkedRow });
    }

    void navigate({
      to: "/expenses",
      search: { period: search.period },
      replace: true,
    });
  }, [
    deepLinkedId,
    deepLinkedRow,
    journal.data,
    journal.isPlaceholderData,
    navigate,
    search.period,
  ]);

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
        action={
          <Button
            onClick={() =>
              setSheet({ mode: "create", initial: emptyExpenseDraft(today) })
            }
            size="xl"
          >
            <PlusIcon aria-hidden />
            {m.expenses_add()}
          </Button>
        }
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
          onDuplicate={(expense) =>
            setSheet({
              mode: "create",
              initial: { ...expenseToDraft(format, expense), spentOn: today },
            })
          }
          onEdit={(expense) => setSheet({ mode: "edit", expense })}
          unit={isVatLiable ? unit : "ttc"}
          uploadingExpenseId={
            attachReceipt.isPending
              ? (attachReceipt.variables?.path.expense ?? null)
              : null
          }
        />
      </ExpensesPage>

      <ExpenseSheet
        error={writeErrorBanner(sheetError, m.expenses_save_failed())}
        fieldErrors={serverFieldErrors(sheetError)}
        isSaving={createExpense.isPending || updateExpense.isPending}
        isVatLiable={isVatLiable}
        onOpenChange={(open) => {
          if (!open) {
            closeSheet();
          }
        }}
        onSubmit={submitSheet}
        state={sheet}
        today={today}
      />

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
