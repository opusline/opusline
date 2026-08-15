import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@opusline/ui/components/field";
import { NativeSelect } from "@opusline/ui/components/native-select";

import { FormTextField } from "@/components/form-text-field";
import { useMoneyFormat } from "@/components/money-format-provider";
import { PaymentTermsPicker } from "@/components/payment-terms-picker";
import { currencySymbol, formatRateDraft } from "@/lib/billing";
import { formatWorkedTime } from "@/lib/durations";
import { m } from "@/paraglide/messages.js";
import {
  hasInvoiceNumberCounter,
  parseBufferCents,
  previewInvoiceNumber,
} from "../lib/settings-form";
import type { SettingsForm } from "../lib/use-settings-form";
import { SettingsSection } from "./settings-section";

const WORKDAY_MIN_MINUTES = 300;
const WORKDAY_MAX_MINUTES = 600;
const WORKDAY_STEP_MINUTES = 30;

const WORKDAY_OPTIONS = Array.from(
  {
    length:
      (WORKDAY_MAX_MINUTES - WORKDAY_MIN_MINUTES) / WORKDAY_STEP_MINUTES + 1,
  },
  (_, step) => WORKDAY_MIN_MINUTES + step * WORKDAY_STEP_MINUTES,
);

function workdayOptions(saved: number): number[] {
  return WORKDAY_OPTIONS.includes(saved)
    ? WORKDAY_OPTIONS
    : [saved, ...WORKDAY_OPTIONS].sort((left, right) => left - right);
}

export function BillingSettingsForm({
  form,
  savedWorkdayMinutes,
}: {
  form: SettingsForm;
  savedWorkdayMinutes: number;
}) {
  const format = useMoneyFormat();

  return (
    <SettingsSection
      description={m.settings_billing_description()}
      title={m.settings_billing_title()}
    >
      <form.Field name="defaultPaymentTermsDays">
        {(field) => {
          const isInvalid = !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel
                className="text-foreground-3 text-sm"
                htmlFor={`${field.name}-options`}
              >
                {m.settings_payment_terms_label()}
              </FieldLabel>
              <PaymentTermsPicker
                id={`${field.name}-options`}
                isInvalid={isInvalid}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
                value={field.state.value}
                variant="inline"
              />
              {isInvalid ? (
                <FieldError errors={field.state.meta.errors} />
              ) : (
                <FieldDescription>
                  {m.settings_payment_terms_hint()}
                </FieldDescription>
              )}
            </Field>
          );
        }}
      </form.Field>

      <div className="my-5.5 h-px bg-secondary" />

      <form.Field
        name="invoiceNumberFormat"
        validators={{
          onChange: ({ value }: { value: string }) =>
            hasInvoiceNumberCounter(value)
              ? undefined
              : { message: m.settings_invoice_number_counter_error() },
        }}
      >
        {(field) => (
          <FormTextField
            beside={
              <span
                aria-live="polite"
                className="text-muted-foreground-3 text-sm"
                id={`${field.name}-preview`}
              >
                {m.settings_invoice_number_next()}{" "}
                <span className="font-mono text-foreground-3">
                  {previewInvoiceNumber(field.state.value, new Date())}
                </span>
              </span>
            }
            describedBy={`${field.name}-preview`}
            description={m.settings_invoice_number_hint()}
            field={field}
            font="mono"
            inputClassName="min-w-45 flex-1"
            label={m.settings_invoice_number_label()}
            labelClassName="text-foreground-3 text-sm"
          />
        )}
      </form.Field>

      <div className="my-5.5 h-px bg-secondary" />

      <form.Field
        name="treasuryBuffer"
        validators={{
          onChange: ({ value }: { value: string }) =>
            value.trim() === "" ||
            parseBufferCents(format.locale, value) !== null
              ? undefined
              : { message: m.settings_buffer_invalid() },
        }}
      >
        {(field) => (
          <FormTextField
            adornment={currencySymbol(format)}
            beside={
              <span
                className="min-w-50 flex-1 text-muted-foreground-3 text-xs"
                id={`${field.name}-hint`}
              >
                {m.settings_buffer_hint()}
              </span>
            }
            controlClassName="w-37.5 shrink-0"
            describedBy={`${field.name}-hint`}
            field={{
              name: field.name,
              state: field.state,
              handleBlur: field.handleBlur,
              handleChange: (value: string) =>
                field.handleChange(formatRateDraft(format.locale, value)),
            }}
            font="mono"
            inputMode="decimal"
            label={m.settings_buffer_label()}
            labelClassName="text-foreground-3 text-sm"
            placeholder="0"
          />
        )}
      </form.Field>

      <div className="my-5.5 h-px bg-secondary" />

      <form.Field name="workdayMinutes">
        {(field) => (
          <Field>
            <FieldLabel
              className="text-foreground-3 text-sm"
              htmlFor={field.name}
            >
              {m.settings_workday_label()}
            </FieldLabel>
            <NativeSelect
              className="w-70"
              id={field.name}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(Number(event.target.value))
              }
              value={String(field.state.value)}
            >
              {workdayOptions(savedWorkdayMinutes).map((minutes) => (
                <option key={minutes} value={String(minutes)}>
                  {formatWorkedTime(minutes)}
                </option>
              ))}
            </NativeSelect>
            <FieldDescription>{m.settings_workday_hint()}</FieldDescription>
          </Field>
        )}
      </form.Field>
    </SettingsSection>
  );
}
