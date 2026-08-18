import { Field, FieldLabel } from "@opusline/ui/components/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";

import { useMoneyFormat } from "@/components/money-format-provider";
import { currencySymbol, formatRateDraft } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

type MissionTargetRateFieldProps = {
  id: string;
  targetDraft: string;
  /** Receives the draft already normalized to the account locale's notation. */
  onDraftChange: (draft: string) => void;
  className?: string;
  labelClassName?: string;
};

/**
 * Your usual TJM, on a mission that does not bill one.
 *
 * It never prices anything: a forfait bills its price. It is the yardstick that
 * turns that price into a number of days, so the mission can say whether it is
 * costing more than it earns.
 */
export function MissionTargetRateField({
  id,
  targetDraft,
  onDraftChange,
  className,
  labelClassName,
}: MissionTargetRateFieldProps) {
  const format = useMoneyFormat();

  return (
    <Field className={className}>
      <FieldLabel className={labelClassName} htmlFor={id}>
        {m.missions_target_rate_label()}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          aria-label={m.missions_target_rate_label()}
          className="flex-1 text-base"
          id={id}
          inputMode="decimal"
          onChange={(event) =>
            onDraftChange(formatRateDraft(format.locale, event.target.value))
          }
          placeholder={m.missions_target_rate_placeholder()}
          value={targetDraft}
        />
        <InputGroupSuffix className="pl-2">
          {currencySymbol(format) + m.missions_unit_daily()}
        </InputGroupSuffix>
      </InputGroup>
      <p className="text-muted-foreground-3 text-xs">
        {m.missions_target_rate_hint()}
      </p>
    </Field>
  );
}
