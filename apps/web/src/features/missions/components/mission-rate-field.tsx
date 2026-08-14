import type { BillingMode } from "@opusline/api-client";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatRateDraft } from "@/lib/billing";
import { BILLING_MODE_RATE_PLACEHOLDERS, billingModeUnit } from "../lib/labels";

type MissionRateFieldProps = {
  id: string;
  billingMode: BillingMode;
  rateDraft: string;
  isRateMissing: boolean;
  /** Receives the draft already normalized to the account locale's notation. */
  onDraftChange: (draft: string) => void;
  className?: string;
  labelClassName?: string;
};

export function MissionRateField({
  id,
  billingMode,
  rateDraft,
  isRateMissing,
  onDraftChange,
  className,
  labelClassName,
}: MissionRateFieldProps) {
  const format = useMoneyFormat();

  return (
    <Field className={className} data-invalid={isRateMissing}>
      <FieldLabel className={labelClassName} htmlFor={id}>
        Tarif HT
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          aria-invalid={isRateMissing}
          aria-label="Tarif HT"
          className="flex-1 text-base"
          id={id}
          inputMode="decimal"
          onChange={(event) =>
            onDraftChange(formatRateDraft(format.locale, event.target.value))
          }
          placeholder={BILLING_MODE_RATE_PLACEHOLDERS[billingMode]}
          value={rateDraft}
        />
        <InputGroupSuffix className="pl-2">
          {billingModeUnit(format, billingMode)}
        </InputGroupSuffix>
      </InputGroup>
      {isRateMissing ? (
        <FieldError
          errors={[{ message: "Indiquez un tarif pour cette mission." }]}
        />
      ) : null}
    </Field>
  );
}
