import type { Locale } from "@opusline/api-client";

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
  return (
    <FormTextField
      adornment="%"
      description={m.clients_vat_rate_hint({
        rate: formatPercentFromBp(locale, accountVatRateBp),
      })}
      field={field}
      inputMode="decimal"
      label={m.clients_vat_rate_label()}
      labelClassName={labelClassName}
      placeholder={formatPercentFromBp(locale, accountVatRateBp)}
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
    <div>
      <span className={`mb-1.5 block ${labelClassName ?? ""}`}>
        {m.clients_vat_rate_label()}
      </span>
      <div className="flex h-10 items-center rounded-md border border-border-3 border-dashed bg-muted px-3 text-muted-foreground-3 text-sm">
        {m.clients_vat_rate_franchise()}
      </div>
    </div>
  );
}
