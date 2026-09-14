import { Chip, ChipGroup } from "@opusline/ui/components/chip";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@opusline/ui/components/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import { useId } from "react";

import { useLocale } from "@/components/money-format-provider";
import { formatPercentFromBp } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

const PRESETS = ["100", "70", "50"];

type ProShareFieldProps = {
  /** 0–100, as typed. */
  value: string;
  /** Set when the typed share is not a number the form can send. */
  error?: string;
  onChange: (value: string) => void;
};

export function ProShareField({ value, error, onChange }: ProShareFieldProps) {
  const locale = useLocale();
  const id = useId();

  return (
    <Field data-invalid={error !== undefined}>
      <FieldLabel htmlFor={id}>{m.expenses_field_pro_share()}</FieldLabel>
      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="w-24">
          <InputGroupInput
            aria-invalid={error !== undefined}
            id={id}
            inputMode="decimal"
            onChange={(event) => onChange(event.target.value)}
            value={value}
          />
          <InputGroupSuffix>%</InputGroupSuffix>
        </InputGroup>
        <ChipGroup
          aria-label={m.expenses_pro_share_presets_aria()}
          onValueChange={(next) => {
            const preset = next[0];

            if (typeof preset === "string") {
              onChange(preset);
            }
          }}
          value={PRESETS.includes(value) ? [value] : []}
        >
          {PRESETS.map((preset) => (
            <Chip key={preset} value={preset}>
              {m.common_percent({
                value: formatPercentFromBp(locale, Number(preset) * 100),
              })}
            </Chip>
          ))}
        </ChipGroup>
      </div>
      <FieldError>{error}</FieldError>
      <FieldDescription>
        {m.expenses_pro_share_help()}{" "}
        <em className="text-muted-foreground-2">
          {m.expenses_pro_share_example()}
        </em>
      </FieldDescription>
    </Field>
  );
}
