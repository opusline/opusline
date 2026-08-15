import type { BillingMode } from "@opusline/api-client";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatRateDraft } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";
import { billingModeRatePlaceholder, billingModeUnit } from "../lib/labels";

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
        {m.missions_rate_ht()}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          aria-invalid={isRateMissing}
          aria-label={m.missions_rate_ht()}
          className="flex-1 text-base"
          id={id}
          inputMode="decimal"
          onChange={(event) =>
            onDraftChange(formatRateDraft(format.locale, event.target.value))
          }
          placeholder={billingModeRatePlaceholder(billingMode)}
          value={rateDraft}
        />
        <InputGroupSuffix className="pl-2">
          {billingModeUnit(format, billingMode)}
        </InputGroupSuffix>
      </InputGroup>
      {isRateMissing ? (
        <FieldError errors={[{ message: m.missions_rate_required() }]} />
      ) : null}
    </Field>
  );
}
