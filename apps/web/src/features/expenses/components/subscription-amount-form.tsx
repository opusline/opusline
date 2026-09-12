import type { SubscriptionData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import { SheetBody, SheetFooter } from "@opusline/ui/components/sheet";
import { useId, useState } from "react";

import { DateField } from "@/components/date-field";
import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { currencySymbol, formatSignedDraft } from "@/lib/billing";
import type { FieldErrorMap } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

import { draftHtCents } from "../lib/subscription-draft";
import { occurrencesPerYear } from "../lib/subscriptions";
import { expenseAmountsFromHt } from "../lib/vat";
import { CalcBox, perYearCell } from "./expense-calc-box";

export type AmountChangeDraft = {
  /** The new HT amount as typed. */
  ht: string;
  /** `Y-m-d`, the first debit at the new amount. */
  effectiveFrom: string;
};

type SubscriptionAmountFormProps = {
  subscription: SubscriptionData;
  initial: AmountChangeDraft;
  isVatLiable: boolean;
  isSaving: boolean;
  error: string | null;
  fieldErrors: FieldErrorMap | null;
  onSubmit: (draft: AmountChangeDraft) => void;
  onCancel: () => void;
};

export function SubscriptionAmountForm({
  subscription,
  initial,
  isVatLiable,
  isSaving,
  error,
  fieldErrors,
  onSubmit,
  onCancel,
}: SubscriptionAmountFormProps) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const id = useId();
  const [draft, setDraft] = useState(initial);
  const htCents = draftHtCents(format, draft);
  const vatTerms = {
    vatTreatment: subscription.vatTreatment,
    vatRateBp: subscription.vatRateBp,
  };
  const amounts =
    htCents === null
      ? null
      : expenseAmountsFromHt(htCents, vatTerms, subscription.proShareBp);
  const amountError =
    fieldErrors?.["amountHt.amount"]?.message ??
    (draft.ht.trim() !== "" && htCents === null
      ? m.subscriptions_amount_invalid()
      : undefined);
  const dateError = fieldErrors?.effectiveFrom?.message;
  const canSave = !isSaving && htCents !== null;

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();

        if (canSave) {
          onSubmit(draft);
        }
      }}
    >
      <SheetBody className="flex flex-col gap-4 pb-4">
        {error !== null && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-2 gap-3.5">
          <Field data-invalid={amountError !== undefined}>
            <FieldLabel htmlFor={`${id}-ht`}>
              {m.subscriptions_field_amount_ht()}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                aria-invalid={amountError !== undefined}
                className="font-mono tabular-nums"
                id={`${id}-ht`}
                inputMode="decimal"
                onBlur={() =>
                  setDraft((current) => ({
                    ...current,
                    ht: formatSignedDraft(locale, current.ht),
                  }))
                }
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    ht: event.target.value,
                  }))
                }
                value={draft.ht}
              />
              <InputGroupSuffix>{currencySymbol(format)}</InputGroupSuffix>
            </InputGroup>
            {amountError !== undefined && (
              <FieldError>{amountError}</FieldError>
            )}
          </Field>
          <Field data-invalid={dateError !== undefined}>
            <FieldLabel htmlFor={`${id}-from`}>
              {m.subscriptions_field_effective_from()}
            </FieldLabel>
            <DateField
              id={`${id}-from`}
              onChange={(effectiveFrom) =>
                setDraft((current) => ({ ...current, effectiveFrom }))
              }
              value={draft.effectiveFrom}
            />
            {dateError !== undefined && <FieldError>{dateError}</FieldError>}
          </Field>
        </div>
        <CalcBox
          amounts={amounts}
          isVatLiable={isVatLiable}
          trailing={perYearCell(
            format,
            amounts,
            occurrencesPerYear(subscription.periodicity),
          )}
          vatTerms={vatTerms}
        />
      </SheetBody>
      <SheetFooter className="flex-row justify-end gap-2 border-t pt-4">
        <Button onClick={onCancel} size="2xl" type="button" variant="outline">
          {m.common_cancel()}
        </Button>
        <Button disabled={!canSave} size="2xl" type="submit">
          {m.common_save()}
        </Button>
      </SheetFooter>
    </form>
  );
}
