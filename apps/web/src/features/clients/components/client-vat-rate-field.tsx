import type { Locale } from "@opusline/api-client";

import { ExemptField } from "@/components/exempt-field";
import {
  FormTextField,
  type StringFieldApi,
} from "@/components/form-text-field";
import { formatPercentFromBp } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

type ClientVatRateFieldProps = {
  field: StringFieldApi;
  locale: Locale;
  /** What an empty field falls back to — the account's own rate. */
  accountVatRateBp: number;
  labelClassName?: string;
};

export function ClientVatRateField({
  field,
  locale,
  accountVatRateBp,
  labelClassName,
}: ClientVatRateFieldProps) {
  const accountRate = formatPercentFromBp(locale, accountVatRateBp);

  return (
    <FormTextField
      adornment="%"
      description={m.clients_vat_rate_hint({ rate: accountRate })}
      field={field}
      inputMode="decimal"
      label={m.clients_vat_rate_label()}
      labelClassName={labelClassName}
      placeholder={accountRate}
    />
  );
}

/** What the field is replaced by when the account charges no TVA to anyone. */
export function ClientVatRateExempt({
  labelClassName,
}: {
  labelClassName?: string;
}) {
  return (
    <ExemptField
      label={m.clients_vat_rate_label()}
      labelClassName={labelClassName}
      reason={m.clients_vat_rate_franchise()}
    />
  );
}
