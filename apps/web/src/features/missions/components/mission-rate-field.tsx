import type { BillingMode } from "@opusline/api-client";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import type { ReactNode } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatRateDraft } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";
import {
  billingModeAmountLabel,
  billingModeRatePlaceholder,
  billingModeUnit,
} from "../lib/labels";

type MissionRateFieldProps = {
  id: string;
  billingMode: BillingMode;
  rateDraft: string;
  /** Receives the draft already normalized to the account locale's notation. */
  onDraftChange: (draft: string) => void;
  /** Defaults to what the billing mode calls its amount. */
  label?: string;
  placeholder?: string;
  /** Sits under the input, for a rate whose purpose is not obvious from its name. */
  hint?: ReactNode;
  /** Only a mission's own rate is required; a reference rate is optional. */
  isRateMissing?: boolean;
  className?: string;
  labelClassName?: string;
};

export function MissionRateField({
  id,
  billingMode,
  rateDraft,
  onDraftChange,
  label,
  placeholder,
  hint,
  isRateMissing = false,
  className,
  labelClassName,
}: MissionRateFieldProps) {
  const format = useMoneyFormat();
  const fieldLabel = label ?? billingModeAmountLabel(billingMode);

  return (
    <Field className={className} data-invalid={isRateMissing}>
      <FieldLabel className={labelClassName} htmlFor={id}>
        {fieldLabel}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          aria-invalid={isRateMissing}
          aria-label={fieldLabel}
          className="flex-1 text-base"
          id={id}
          inputMode="decimal"
          onChange={(event) =>
            onDraftChange(formatRateDraft(format.locale, event.target.value))
          }
          placeholder={placeholder ?? billingModeRatePlaceholder(billingMode)}
          value={rateDraft}
        />
        <InputGroupSuffix className="pl-2">
          {billingModeUnit(format, billingMode)}
        </InputGroupSuffix>
      </InputGroup>
      {hint !== undefined && (
        <p className="text-pretty text-muted-foreground-3 text-xs leading-relaxed">
          {hint}
        </p>
      )}
      {isRateMissing ? (
        <FieldError errors={[{ message: m.missions_rate_required() }]} />
      ) : null}
    </Field>
  );
}
