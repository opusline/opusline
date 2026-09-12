import type {
  ExpenseCategory,
  SubscriptionPeriodicity,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
} from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import { Label } from "@opusline/ui/components/label";
import { NativeSelect } from "@opusline/ui/components/native-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@opusline/ui/components/popover";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
import { SheetBody, SheetFooter } from "@opusline/ui/components/sheet";
import { Switch } from "@opusline/ui/components/switch";
import { useId, useState } from "react";

import { DateField } from "@/components/date-field";
import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import {
  currencySymbol,
  formatSignedDraft,
  formatWholeAmount,
} from "@/lib/billing";
import type { FieldErrorMap } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";
import { draftProShareBp, draftVatTerms } from "../lib/expense-draft";
import { EXPENSE_CATEGORIES, expenseCategoryLabel } from "../lib/labels";
import {
  draftDebitDay,
  draftHtCents,
  type SubscriptionDraft,
} from "../lib/subscription-draft";
import {
  monthOptions,
  occurrencesPerYear,
  SUBSCRIPTION_PERIODICITIES,
  subscriptionPeriodicityShortLabel,
} from "../lib/subscriptions";
import { expenseAmountsFromHt } from "../lib/vat";
import { CalcBox, perYearCell } from "./expense-calc-box";
import { ProShareField } from "./pro-share-field";
import { VatChoiceField } from "./vat-choice-field";

type SubscriptionFormProps = {
  initial: SubscriptionDraft;
  isVatLiable: boolean;
  isSaving: boolean;
  error: string | null;
  fieldErrors: FieldErrorMap | null;
  onSubmit: (draft: SubscriptionDraft) => void;
  onCancel: () => void;
};

function periodicityOf(
  value: string | undefined,
): SubscriptionPeriodicity | null {
  const parsed = Number(value);

  return (
    SUBSCRIPTION_PERIODICITIES.find((candidate) => candidate === parsed) ?? null
  );
}

export function SubscriptionForm({
  initial,
  isVatLiable,
  isSaving,
  error,
  fieldErrors,
  onSubmit,
  onCancel,
}: SubscriptionFormProps) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const id = useId();
  const [draft, setDraft] = useState(initial);
  const patch = (changes: Partial<SubscriptionDraft>) =>
    setDraft((current) => ({ ...current, ...changes }));

  const htCents = draftHtCents(format, draft);
  const proShareBp = draftProShareBp(format, draft);
  const vatTerms = draftVatTerms(draft);
  const isAnnual = draft.periodicity === 2;
  const amounts =
    htCents === null
      ? null
      : expenseAmountsFromHt(
          htCents,
          isVatLiable ? vatTerms : { vatTreatment: 3, vatRateBp: 0 },
          proShareBp ?? 10_000,
        );

  const supplierError = fieldErrors?.supplier?.message;
  const amountError =
    fieldErrors?.["amountHt.amount"]?.message ??
    (draft.ht.trim() !== "" && htCents === null
      ? m.subscriptions_amount_invalid()
      : undefined);
  const proShareError =
    fieldErrors?.proShareBp?.message ??
    (proShareBp === null ? m.expenses_pro_share_invalid() : undefined);
  const debitDayError =
    fieldErrors?.debitDay?.message ??
    (draftDebitDay(draft) === null
      ? m.expenses_recurring_day_invalid()
      : undefined);
  const startedOnError = fieldErrors?.startedOn?.message;
  const urlError = fieldErrors?.customerSpaceUrl?.message;

  const canSave =
    !isSaving &&
    draft.supplier.trim() !== "" &&
    htCents !== null &&
    proShareBp !== null &&
    debitDayError === undefined;

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
          <Field data-invalid={supplierError !== undefined}>
            <FieldLabel htmlFor={`${id}-supplier`}>
              {m.expenses_field_supplier()}
            </FieldLabel>
            <Input
              aria-invalid={supplierError !== undefined}
              id={`${id}-supplier`}
              onChange={(event) => patch({ supplier: event.target.value })}
              value={draft.supplier}
            />
            {supplierError !== undefined && (
              <FieldError>{supplierError}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor={`${id}-category`}>
              {m.expenses_field_category()}
            </FieldLabel>
            <NativeSelect
              id={`${id}-category`}
              onChange={(event) =>
                patch({
                  category: Number(event.target.value) as ExpenseCategory,
                })
              }
              value={String(draft.category)}
            >
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={String(category)}>
                  {expenseCategoryLabel(category)}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor={`${id}-description`}>
            {m.expenses_field_description()}
          </FieldLabel>
          <Input
            id={`${id}-description`}
            onChange={(event) => patch({ description: event.target.value })}
            placeholder={m.subscriptions_field_description_placeholder()}
            value={draft.description}
          />
        </Field>

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
                  patch({ ht: formatSignedDraft(locale, draft.ht) })
                }
                onChange={(event) => patch({ ht: event.target.value })}
                value={draft.ht}
              />
              <InputGroupSuffix>{currencySymbol(format)}</InputGroupSuffix>
            </InputGroup>
            {amountError !== undefined && (
              <FieldError>{amountError}</FieldError>
            )}
          </Field>
          {isVatLiable && (
            <ProShareField
              error={proShareError}
              onChange={(proShare) => patch({ proShare })}
              value={draft.proShare}
            />
          )}
        </div>

        {isVatLiable && (
          <VatChoiceField
            keptTerms={draft.vatTerms}
            onChange={(vatChoice) => patch({ vatChoice })}
            value={draft.vatChoice}
          />
        )}

        <div className="grid grid-cols-2 gap-3.5">
          <Field>
            <FieldLegend id={`${id}-periodicity`} variant="label">
              {m.subscriptions_col_periodicity()}
            </FieldLegend>
            <SegmentedControl
              aria-labelledby={`${id}-periodicity`}
              className="w-full"
              onValueChange={(value) => {
                const periodicity = periodicityOf(value[0]);

                if (periodicity !== null) {
                  patch({ periodicity });
                }
              }}
              value={[String(draft.periodicity)]}
              variant="raised"
            >
              {SUBSCRIPTION_PERIODICITIES.map((periodicity) => (
                <SegmentedControlItem
                  className="flex-1"
                  key={periodicity}
                  value={String(periodicity)}
                >
                  {subscriptionPeriodicityShortLabel(periodicity)}
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
          </Field>
          <div className="flex gap-2.5">
            <Field
              className="w-auto"
              data-invalid={debitDayError !== undefined}
            >
              <FieldLabel htmlFor={`${id}-day`}>
                {m.expenses_field_recurring_day()}
              </FieldLabel>
              <Input
                aria-invalid={debitDayError !== undefined}
                className="w-16"
                font="mono"
                id={`${id}-day`}
                inputMode="numeric"
                max={31}
                min={1}
                onChange={(event) => patch({ debitDay: event.target.value })}
                type="number"
                value={draft.debitDay}
              />
              {debitDayError !== undefined && (
                <FieldError>{debitDayError}</FieldError>
              )}
            </Field>
            {isAnnual && (
              <Field className="min-w-0 flex-1">
                <FieldLabel htmlFor={`${id}-month`}>
                  {m.subscriptions_field_debit_month()}
                </FieldLabel>
                <NativeSelect
                  id={`${id}-month`}
                  onChange={(event) =>
                    patch({ debitMonth: Number(event.target.value) })
                  }
                  value={String(draft.debitMonth)}
                >
                  {monthOptions(locale).map((option) => (
                    <option key={option.value} value={String(option.value)}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
            )}
          </div>
          <Field data-invalid={startedOnError !== undefined}>
            <FieldLabel htmlFor={`${id}-start`}>
              {m.subscriptions_field_started_on()}
            </FieldLabel>
            <DateField
              id={`${id}-start`}
              onChange={(startedOn) => patch({ startedOn })}
              value={draft.startedOn}
            />
            {startedOnError !== undefined && (
              <FieldError>{startedOnError}</FieldError>
            )}
          </Field>
          <Field data-invalid={urlError !== undefined}>
            <FieldLabel htmlFor={`${id}-url`}>
              {m.subscriptions_field_url()}
            </FieldLabel>
            <Input
              aria-invalid={urlError !== undefined}
              id={`${id}-url`}
              inputMode="url"
              onChange={(event) =>
                patch({ customerSpaceUrl: event.target.value })
              }
              placeholder="https://"
              type="url"
              value={draft.customerSpaceUrl}
            />
            {urlError !== undefined && <FieldError>{urlError}</FieldError>}
          </Field>
        </div>

        <CalcBox
          amounts={amounts}
          isVatLiable={isVatLiable}
          trailing={perYearCell(
            format,
            amounts,
            occurrencesPerYear(draft.periodicity),
          )}
          vatTerms={vatTerms}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2.5">
              <Label htmlFor={`${id}-auto`} size="md">
                {m.subscriptions_auto_create()}
              </Label>
              <Popover>
                <PopoverTrigger render={<Button size="sm" variant="link" />}>
                  {m.subscriptions_auto_create_more()}
                </PopoverTrigger>
                <PopoverContent align="start" size="lg">
                  <div className="flex flex-col gap-2.5 text-muted-foreground-3 text-xs leading-relaxed">
                    <p>{m.subscriptions_auto_create_help_1()}</p>
                    <p>{m.subscriptions_auto_create_help_2()}</p>
                    <p>{m.subscriptions_auto_create_help_3()}</p>
                    <p className="rounded-md border border-primary/45 bg-primary/8 px-3 py-2.5 text-foreground-3">
                      {m.subscriptions_auto_create_note()}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <FieldDescription className="mt-1">
              {draft.autoCreateExpenses
                ? m.subscriptions_auto_create_on()
                : m.subscriptions_auto_create_off()}
            </FieldDescription>
          </div>
          <Switch
            checked={draft.autoCreateExpenses}
            className="mt-1"
            id={`${id}-auto`}
            onCheckedChange={(autoCreateExpenses) =>
              patch({ autoCreateExpenses })
            }
          />
        </div>

        {isAnnual && (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Label htmlFor={`${id}-provision`} size="md">
                {m.subscriptions_provision()}
              </Label>
              <FieldDescription className="mt-1">
                {amounts === null
                  ? m.subscriptions_provision_hint()
                  : m.subscriptions_provision_amount({
                      amount: formatWholeAmount(
                        format,
                        Math.round(amounts.ttcCents / 12),
                      ),
                    })}
              </FieldDescription>
            </div>
            <Switch
              checked={draft.provisionMonthly}
              className="mt-1"
              id={`${id}-provision`}
              onCheckedChange={(provisionMonthly) =>
                patch({ provisionMonthly })
              }
            />
          </div>
        )}
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
