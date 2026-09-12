import type { SubscriptionData } from "@opusline/api-client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@opusline/ui/components/sheet";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatAmount } from "@/lib/billing";
import type { FieldErrorMap } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

import {
  type SubscriptionDraft,
  subscriptionToDraft,
} from "../lib/subscription-draft";
import {
  type AmountChangeDraft,
  SubscriptionAmountForm,
} from "./subscription-amount-form";
import { SubscriptionForm } from "./subscription-form";

export type SubscriptionSheetState =
  | { mode: "create"; initial: SubscriptionDraft }
  | { mode: "edit"; subscription: SubscriptionData }
  | { mode: "amount"; subscription: SubscriptionData };

type SubscriptionSheetProps = {
  /** Null keeps the sheet closed; the form mounts fresh on every open. */
  state: SubscriptionSheetState | null;
  isVatLiable: boolean;
  /** `Y-m-d`: the earliest day a new amount can start. */
  today: string;
  isSaving: boolean;
  error: string | null;
  fieldErrors: FieldErrorMap | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: SubscriptionDraft) => void;
  onSubmitAmount: (
    subscription: SubscriptionData,
    draft: AmountChangeDraft,
  ) => void;
};

export function SubscriptionSheet({
  state,
  isVatLiable,
  today,
  isSaving,
  error,
  fieldErrors,
  onOpenChange,
  onSubmit,
  onSubmitAmount,
}: SubscriptionSheetProps) {
  const format = useMoneyFormat();

  return (
    <Sheet onOpenChange={onOpenChange} open={state !== null}>
      <SheetContent side="right" size="md">
        {state !== null && (
          <>
            <SheetHeader className="pb-4">
              <SheetTitle size="lg">
                {state.mode === "create"
                  ? m.subscriptions_add()
                  : state.mode === "edit"
                    ? m.subscriptions_sheet_edit_title()
                    : m.subscriptions_sheet_amount_title({
                        supplier: state.subscription.supplier,
                      })}
              </SheetTitle>
              <SheetDescription className="sr-only">
                {state.mode === "amount"
                  ? m.subscriptions_sheet_amount_hint()
                  : m.subscriptions_sheet_hint()}
              </SheetDescription>
            </SheetHeader>
            {state.mode === "amount" ? (
              <SubscriptionAmountForm
                error={error}
                fieldErrors={fieldErrors}
                initial={{
                  ht: formatAmount(format, state.subscription.amountHt.amount),
                  effectiveFrom: state.subscription.nextDebitOn ?? today,
                }}
                isSaving={isSaving}
                isVatLiable={isVatLiable}
                onCancel={() => onOpenChange(false)}
                onSubmit={(draft) => onSubmitAmount(state.subscription, draft)}
                subscription={state.subscription}
              />
            ) : (
              <SubscriptionForm
                error={error}
                fieldErrors={fieldErrors}
                initial={
                  state.mode === "create"
                    ? state.initial
                    : subscriptionToDraft(format, state.subscription)
                }
                isSaving={isSaving}
                isVatLiable={isVatLiable}
                onCancel={() => onOpenChange(false)}
                onSubmit={onSubmit}
              />
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
