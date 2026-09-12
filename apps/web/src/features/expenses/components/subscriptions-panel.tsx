import type {
  RecurringDebitData,
  SubscriptionData,
  SubscriptionsData,
} from "@opusline/api-client";
import {
  attachExpenseReceiptMutation,
  cancelSubscriptionMutation,
  changeSubscriptionAmountMutation,
  createSubscriptionMutation,
  deleteSubscriptionMutation,
  dismissRecurringDebitMutation,
  listSubscriptionsQueryKey,
  pauseSubscriptionMutation,
  reactivateSubscriptionMutation,
  resumeSubscriptionMutation,
  updateSubscriptionMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { useToast } from "@opusline/ui/components/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatAmount, formatWholeAmount } from "@/lib/billing";
import { calendarDateLabel } from "@/lib/dates";
import {
  invalidateExpenseWrites,
  invalidateSubscriptionWrites,
} from "@/lib/query-invalidation";
import {
  serverErrorMessage,
  serverFieldErrors,
  writeErrorBanner,
} from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

import { positiveCentsOrNull } from "../lib/expense-draft";
import { monthName } from "../lib/labels";
import { receiptRejection } from "../lib/receipts";
import {
  draftToSubscriptionPayload,
  emptySubscriptionDraft,
  subscriptionToPayload,
} from "../lib/subscription-draft";
import { occurrenceMonth } from "../lib/subscriptions";
import { expenseAmountsFromTtc, vatChoiceTerms } from "../lib/vat";
import { DeleteSubscriptionDialog } from "./delete-subscription-dialog";
import {
  SubscriptionSheet,
  type SubscriptionSheetState,
} from "./subscription-sheet";
import { SubscriptionsTab } from "./subscriptions-tab";

type ToastOptions = Parameters<ReturnType<typeof useToast>["add"]>[0];

type SubscriptionsPanelProps = {
  data: SubscriptionsData;
  isVatLiable: boolean;
  isRefreshing: boolean;
  showCancelled: boolean;
  /** `Y-m-d`, the account's today. */
  today: string;
  /** The sheet opens from the page header as well as from the rows. */
  sheet: SubscriptionSheetState | null;
  onSheetChange: (state: SubscriptionSheetState | null) => void;
};

/**
 * The Abonnements tab with its writes. Every one answers with the whole
 * list, recomputed: it goes straight into the cache, then the journal, the
 * treasury and the deadlines refetch — the list itself does not.
 */
export function SubscriptionsPanel({
  data,
  isVatLiable,
  isRefreshing,
  showCancelled,
  today,
  sheet,
  onSheetChange,
}: SubscriptionsPanelProps) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const format = useMoneyFormat();
  const locale = useLocale();
  const [actionError, setActionError] = useState<string | null>(null);
  const [sheetError, setSheetError] = useState<unknown>(null);
  const [toDelete, setToDelete] = useState<SubscriptionData | null>(null);

  const acceptList = async (list: SubscriptionsData) => {
    queryClient.setQueryData(listSubscriptionsQueryKey(), list);
    await invalidateExpenseWrites(queryClient);
  };
  const accepted =
    (notice: ToastOptions | ((list: SubscriptionsData) => ToastOptions)) =>
    async (list: SubscriptionsData) => {
      await acceptList(list);
      toast.add(typeof notice === "function" ? notice(list) : notice);
    };

  // A write from a row that fails lands in the banner above the tab, with
  // the server's own word when it has one.
  const withActionError = (fallback: () => string) => ({
    onMutate: () => setActionError(null),
    onError: (error: unknown) =>
      setActionError(serverErrorMessage(error, fallback())),
  });
  const rowWrite = withActionError(m.subscriptions_action_failed);

  const pause = useMutation({ ...pauseSubscriptionMutation(), ...rowWrite });
  const resume = useMutation({ ...resumeSubscriptionMutation(), ...rowWrite });
  const cancel = useMutation({ ...cancelSubscriptionMutation(), ...rowWrite });
  const reactivate = useMutation({
    ...reactivateSubscriptionMutation(),
    ...rowWrite,
  });
  const update = useMutation({ ...updateSubscriptionMutation(), ...rowWrite });
  const remove = useMutation({
    ...deleteSubscriptionMutation(),
    ...rowWrite,
    // The banner sits behind the dialog: close it so the error can be read.
    onError: (error) => {
      setToDelete(null);
      rowWrite.onError(error);
    },
  });
  const attachReceipt = useMutation({
    ...attachExpenseReceiptMutation(),
    ...withActionError(m.expenses_receipt_attach_failed),
  });
  const dismissDebit = useMutation({
    ...dismissRecurringDebitMutation(),
    ...rowWrite,
  });

  // The debit is TTC; the sheet is priced HT, so the draft opens at the HT a
  // 20 % purchase would carry — the regime chips put it right if not.
  const draftFromDebit = (debit: RecurringDebitData) => {
    const [firstMonth] = debit.months;
    const day = String(debit.debitDay).padStart(2, "0");

    return {
      ...emptySubscriptionDraft(today),
      supplier: debit.label,
      description: m.subscriptions_detected_description(),
      ht: formatAmount(
        format,
        expenseAmountsFromTtc(
          debit.amount.amount,
          vatChoiceTerms("fr20"),
          10_000,
        ).htCents,
      ),
      debitDay: String(debit.debitDay),
      startedOn: firstMonth === undefined ? today : `${firstMonth}-${day}`,
    };
  };

  const sheetWrite = {
    onMutate: () => setSheetError(null),
    onError: setSheetError,
  };
  const create = useMutation({
    ...createSubscriptionMutation(),
    ...sheetWrite,
  });
  const save = useMutation({ ...updateSubscriptionMutation(), ...sheetWrite });
  const changeAmount = useMutation({
    ...changeSubscriptionAmountMutation(),
    ...sheetWrite,
  });

  const closeSheet = () => {
    onSheetChange(null);
    setSheetError(null);
  };
  const saved = (title: string) => async (list: SubscriptionsData) => {
    closeSheet();
    await accepted({ title, tone: "success" })(list);
  };

  const reactivateRow = (subscription: SubscriptionData) =>
    reactivate.mutate(
      { path: { subscription: subscription.id } },
      {
        onSuccess: accepted({
          title: m.subscriptions_reactivated({
            supplier: subscription.supplier,
          }),
          tone: "success",
        }),
      },
    );

  const isRowBusy =
    pause.isPending ||
    resume.isPending ||
    cancel.isPending ||
    reactivate.isPending ||
    update.isPending;

  return (
    <>
      {actionError !== null && (
        <Alert variant="destructive">
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      <SubscriptionsTab
        data={data}
        isRefreshing={isRefreshing || isRowBusy}
        isVatLiable={isVatLiable}
        onCancel={(subscription) =>
          cancel.mutate(
            { path: { subscription: subscription.id }, body: {} },
            {
              onSuccess: accepted({
                title: m.subscriptions_cancelled({
                  supplier: subscription.supplier,
                  date: calendarDateLabel(locale, today),
                }),
                action: {
                  label: m.common_cancel(),
                  onClick: () => reactivateRow(subscription),
                },
              }),
            },
          )
        }
        onChangeAmount={(subscription) =>
          onSheetChange({ mode: "amount", subscription })
        }
        onDelete={setToDelete}
        onEdit={(subscription) => onSheetChange({ mode: "edit", subscription })}
        onLinkReceipt={(subscription, occurrence, files) => {
          const file = files[0];

          if (
            attachReceipt.isPending ||
            occurrence.expenseId === null ||
            file === undefined
          ) {
            return;
          }

          const rejection = receiptRejection(file);

          if (rejection !== null) {
            setActionError(rejection);
            return;
          }

          attachReceipt.mutate(
            { path: { expense: occurrence.expenseId }, body: { file } },
            {
              onSuccess: async () => {
                await invalidateSubscriptionWrites(queryClient);
                toast.add({
                  title: m.subscriptions_receipt_linked({
                    month: monthName(locale, occurrenceMonth(occurrence)),
                    supplier: subscription.supplier,
                  }),
                  tone: "success",
                });
              },
            },
          );
        }}
        onPause={(subscription) =>
          pause.mutate(
            { path: { subscription: subscription.id } },
            {
              onSuccess: accepted({
                title: m.subscriptions_paused({
                  supplier: subscription.supplier,
                }),
              }),
            },
          )
        }
        onReactivate={reactivateRow}
        onResume={(subscription) =>
          resume.mutate(
            { path: { subscription: subscription.id } },
            {
              onSuccess: accepted({
                title: m.subscriptions_resumed({
                  supplier: subscription.supplier,
                }),
                tone: "success",
              }),
            },
          )
        }
        onToggleProvision={(subscription) => {
          const provisionMonthly = !subscription.provisionMonthly;

          update.mutate(
            {
              path: { subscription: subscription.id },
              body: subscriptionToPayload(subscription, { provisionMonthly }),
            },
            {
              // The twelfth comes back on the row, rounded by the API.
              onSuccess: accepted((list) => {
                const provision =
                  list.subscriptions.find((row) => row.id === subscription.id)
                    ?.monthlyProvision ?? null;

                return {
                  title:
                    provisionMonthly && provision !== null
                      ? m.subscriptions_provisioned({
                          supplier: subscription.supplier,
                          amount: formatWholeAmount(format, provision.amount),
                        })
                      : m.subscriptions_unprovisioned({
                          supplier: subscription.supplier,
                        }),
                  tone: "success",
                };
              }),
            },
          );
        }}
        isDetectedBusy={dismissDebit.isPending}
        onCreateFromDebit={(debit) =>
          onSheetChange({ mode: "create", initial: draftFromDebit(debit) })
        }
        onDismissDebit={(debit) =>
          dismissDebit.mutate(
            { body: { label: debit.label, amount: debit.amount } },
            {
              onSuccess: accepted({
                title: m.subscriptions_detected_dismissed(),
              }),
            },
          )
        }
        showCancelled={showCancelled}
        today={today}
      />

      <SubscriptionSheet
        error={writeErrorBanner(sheetError, m.subscriptions_action_failed())}
        fieldErrors={serverFieldErrors(sheetError)}
        isSaving={create.isPending || save.isPending || changeAmount.isPending}
        isVatLiable={isVatLiable}
        onOpenChange={(open) => {
          if (!open) {
            closeSheet();
          }
        }}
        onSubmit={(draft) => {
          const body = draftToSubscriptionPayload(format, draft, isVatLiable);

          if (sheet === null || body === null) {
            return;
          }

          if (sheet.mode === "edit") {
            save.mutate(
              { path: { subscription: sheet.subscription.id }, body },
              { onSuccess: saved(m.subscriptions_updated()) },
            );
            return;
          }

          create.mutate(
            { body },
            { onSuccess: saved(m.subscriptions_created()) },
          );
        }}
        onSubmitAmount={(subscription, draft) => {
          const cents = positiveCentsOrNull(format, draft.ht);

          if (cents === null) {
            return;
          }

          changeAmount.mutate(
            {
              path: { subscription: subscription.id },
              body: {
                amountHt: { amount: cents, currency: format.currency },
                effectiveFrom: draft.effectiveFrom,
              },
            },
            { onSuccess: saved(m.subscriptions_amount_changed()) },
          );
        }}
        state={sheet}
        today={today}
      />

      <DeleteSubscriptionDialog
        isDeleting={remove.isPending}
        onConfirm={(subscription) =>
          remove.mutate(
            { path: { subscription: subscription.id } },
            {
              onSuccess: async () => {
                setToDelete(null);
                await invalidateSubscriptionWrites(queryClient);
                toast.add({ title: m.subscriptions_deleted() });
              },
            },
          )
        }
        onOpenChange={(open) => {
          if (!open) {
            setToDelete(null);
          }
        }}
        subscription={toDelete}
      />
    </>
  );
}
