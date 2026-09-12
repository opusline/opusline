import {
  type ExpenseData,
  type ExpensesMonthData,
  readExpenseReceipt,
} from "@opusline/api-client";
import {
  attachExpenseReceiptMutation,
  createExpenseMutation,
  deferExpensesVatMutation,
  deleteExpenseMutation,
  detachExpenseReceiptMutation,
  linkExpenseBankMovementMutation,
  listExpensesOptions,
  listExpensesQueryKey,
  listSubscriptionsOptions,
  recategorizeExpensesMutation,
  reintegrateExpenseVatMutation,
  unmarkDeclarationFiledMutation,
  updateExpenseMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Chip, ChipGroup } from "@opusline/ui/components/chip";
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
import { CheckIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { DeleteExpenseDialog } from "@/features/expenses/components/delete-expense-dialog";
import {
  ExpenseSheet,
  type ExpenseSheetState,
} from "@/features/expenses/components/expense-sheet";
import {
  ExpensesPage,
  type ExpensesTab,
} from "@/features/expenses/components/expenses-page";
import { JournalTab } from "@/features/expenses/components/journal-tab";
import type { SubscriptionSheetState } from "@/features/expenses/components/subscription-sheet";
import { SubscriptionsPanel } from "@/features/expenses/components/subscriptions-panel";
import { type AmountUnit, isAmountUnit } from "@/features/expenses/lib/amounts";
import {
  draftToPayload,
  type ExpenseDraft,
  emptyExpenseDraft,
  expenseToDraft,
} from "@/features/expenses/lib/expense-draft";
import { monthName } from "@/features/expenses/lib/labels";
import { receiptRejection } from "@/features/expenses/lib/receipts";
import { emptySubscriptionDraft } from "@/features/expenses/lib/subscription-draft";
import { formatAmount } from "@/lib/billing";
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

type ExpensesSearch = {
  period?: string;
  expense?: number;
  tab?: "subscriptions";
};

export const Route = createFileRoute("/_authed/expenses")({
  validateSearch: (search: Record<string, unknown>): ExpensesSearch => {
    const expense = Number(search.expense);

    return {
      period:
        isPeriod(search.period) && periodKind(search.period) === "month"
          ? search.period
          : undefined,
      expense: Number.isInteger(expense) && expense > 0 ? expense : undefined,
      tab: search.tab === "subscriptions" ? "subscriptions" : undefined,
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
  const tab: ExpensesTab = search.tab ?? "journal";
  const subscriptions = useQuery({
    ...listSubscriptionsOptions(),
    enabled: tab === "subscriptions",
  });
  const [showCancelled, setShowCancelled] = useState(false);
  const [subscriptionSheet, setSubscriptionSheet] =
    useState<SubscriptionSheetState | null>(null);

  const [unit, setUnit] = useState<AmountUnit>("ht");
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseData | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [sheet, setSheet] = useState<ExpenseSheetState | null>(null);
  const [sheetError, setSheetError] = useState<unknown>(null);
  // The compte pro debit a « Créer la dépense » card came from: linked to
  // the row once it exists.
  const [debitToLink, setDebitToLink] = useState<number | null>(null);

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

  // A write from the journal that fails lands in the banner above it, with
  // the server's own word when it has one.
  const withActionError = (fallback: () => string) => ({
    onMutate: () => setActionError(null),
    onError: (error: unknown) =>
      setActionError(serverErrorMessage(error, fallback())),
  });

  const attachReceipt = useMutation({
    ...attachExpenseReceiptMutation(),
    ...withActionError(m.expenses_receipt_attach_failed),
    onSuccess: acceptMonth,
  });

  const detachReceipt = useMutation({
    ...detachExpenseReceiptMutation(),
    ...withActionError(m.expenses_receipt_detach_failed),
    onSuccess: async (month) => {
      await acceptMonth(month);
      toast.add({ title: m.expenses_receipt_detached() });
    },
  });

  const showPeriod = (period: string) => {
    navigate({ to: "/expenses", search: { period } });
  };

  const closeSheet = () => {
    setSheet(null);
    setSheetError(null);
    setDebitToLink(null);
  };

  const linkDebit = useMutation({
    ...linkExpenseBankMovementMutation(),
    ...withActionError(m.expenses_link_debit_failed),
    onSuccess: acceptMonth,
  });

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

      if (isCreate && row !== null && debitToLink !== null) {
        linkDebit.mutate({
          path: { expense: row.id },
          body: { bankMovementId: debitToLink },
        });
      }

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

  const recategorize = useMutation({
    ...recategorizeExpensesMutation(),
    ...withActionError(m.expenses_recategorize_failed),
    onSuccess: async (month, variables) => {
      await acceptMonth(month);
      toast.add({
        title: m.expenses_recategorized({
          count: variables.body.expenseIds.length,
        }),
        tone: "success",
      });
    },
  });

  const deferVat = useMutation({
    ...deferExpensesVatMutation(),
    ...withActionError(m.expenses_vat_action_failed),
    onSuccess: async (month, variables) => {
      await acceptMonth(month);
      toast.add({
        title: m.expenses_deferred_count({
          count: variables.body.expenseIds.length,
        }),
        tone: "success",
      });
    },
  });

  const reintegrateVat = useMutation({
    ...reintegrateExpenseVatMutation(),
    ...withActionError(m.expenses_vat_action_failed),
    onSuccess: async (month) => {
      await acceptMonth(month);
      toast.add({ title: m.expenses_reintegrated(), tone: "success" });
    },
  });

  // Un-marking the CA3 lives on the declarations screen; here it only unlocks
  // the month, so the journal refetches rather than trusting that answer.
  const undoDeclared = useMutation({
    ...unmarkDeclarationFiledMutation(),
    ...withActionError(m.expenses_declared_undo_failed),
    onSuccess: async () => {
      await invalidateExpenseWrites(queryClient);
      toast.add({ title: m.expenses_declared_undone(), tone: "success" });
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
  const loadedMonth = journal.data.month;
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
          tab === "journal" ? (
            <Button
              onClick={() =>
                setSheet({ mode: "create", initial: emptyExpenseDraft(today) })
              }
              size="xl"
            >
              <PlusIcon aria-hidden />
              {m.expenses_add()}
            </Button>
          ) : (
            <Button
              onClick={() =>
                setSubscriptionSheet({
                  mode: "create",
                  initial: emptySubscriptionDraft(today),
                })
              }
              size="xl"
            >
              <PlusIcon aria-hidden />
              {m.subscriptions_add()}
            </Button>
          )
        }
        controls={
          tab === "journal" ? (
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
          ) : (
            <ChipGroup
              aria-label={m.subscriptions_cancelled_toggle_aria()}
              onValueChange={(value) => setShowCancelled(value.length > 0)}
              value={showCancelled ? ["cancelled"] : []}
            >
              <Chip size="sm" value="cancelled">
                <CheckIcon aria-hidden />
                {m.subscriptions_cancelled_toggle({
                  count:
                    subscriptions.data?.subscriptions.filter(
                      (subscription) => subscription.cancelledOn !== null,
                    ).length ?? 0,
                })}
              </Chip>
            </ChipGroup>
          )
        }
        onTabChange={(next) => {
          setSubscriptionSheet(null);
          navigate({
            to: "/expenses",
            search: {
              period: search.period,
              tab: next === "subscriptions" ? "subscriptions" : undefined,
            },
          });
        }}
        tab={tab}
      >
        {tab === "subscriptions" ? (
          subscriptions.data === undefined ? (
            subscriptions.isError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  {m.subscriptions_load_failed()}
                </AlertDescription>
              </Alert>
            ) : (
              <Skeleton className="h-96 w-full" />
            )
          ) : (
            <SubscriptionsPanel
              data={subscriptions.data}
              isRefreshing={subscriptions.isFetching}
              isVatLiable={isVatLiable}
              onSheetChange={setSubscriptionSheet}
              sheet={subscriptionSheet}
              showCancelled={showCancelled}
              today={today}
            />
          )
        ) : (
          <JournalTab
            isRefreshing={journal.isPlaceholderData}
            key={loadedMonth}
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
            isBulkBusy={recategorize.isPending || deferVat.isPending}
            isUndoBusy={undoDeclared.isPending}
            onCreateFromDebit={(todo) => {
              setDebitToLink(todo.bankMovementId);
              setSheet({
                mode: "create",
                initial: {
                  ...emptyExpenseDraft(today),
                  supplier: todo.label,
                  spentOn: todo.date,
                  ttc: formatAmount(format, todo.amount.amount),
                },
              });
            }}
            onDeferSelectedVat={(expenseIds) =>
              deferVat.mutate({ body: { expenseIds } })
            }
            onDeferVat={(expense) =>
              deferVat.mutate({ body: { expenseIds: [expense.id] } })
            }
            onLinkReceiptHint={() =>
              toast.add({ title: m.expenses_bulk_link_hint() })
            }
            onRecategorize={(expenseIds, category) =>
              recategorize.mutate({ body: { expenseIds, category } })
            }
            onReintegrateVat={(expense) =>
              reintegrateVat.mutate({ path: { expense: expense.id } })
            }
            onUndoDeclared={() =>
              undoDeclared.mutate({
                path: { kind: 1, periodKey: loadedMonth },
                query: { period: loadedMonth },
              })
            }
            unit={isVatLiable ? unit : "ttc"}
            uploadingExpenseId={
              attachReceipt.isPending
                ? (attachReceipt.variables?.path.expense ?? null)
                : null
            }
          />
        )}
      </ExpensesPage>

      <ExpenseSheet
        error={writeErrorBanner(sheetError, m.expenses_save_failed())}
        onReadReceipt={(file) =>
          readExpenseReceipt({ body: { file }, throwOnError: true }).then(
            (result) => result.data,
          )
        }
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
