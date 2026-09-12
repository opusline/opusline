import { Button } from "@opusline/ui/components/button";
import { Chip, ChipGroup } from "@opusline/ui/components/chip";
import {
  Field,
  FieldDescription,
  FieldLegend,
} from "@opusline/ui/components/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@opusline/ui/components/popover";
import { cn } from "@opusline/ui/lib/utils";
import { useId } from "react";

import { useLocale } from "@/components/money-format-provider";
import { formatPercentFromBp } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import { VAT_CHOICES, type VatChoice, type VatTerms } from "../lib/vat";
import { VAT_CHOICE_MESSAGES } from "../lib/vat-help";

type VatChoiceFieldProps = {
  /** Null while the row keeps a rate no chip covers. */
  value: VatChoice | null;
  /** The pair a chipless row keeps, named under the chips. */
  keptTerms: VatTerms;
  onChange: (value: VatChoice) => void;
};

function isVatChoice(value: unknown): value is VatChoice {
  return VAT_CHOICES.includes(value as VatChoice);
}

function VatChoiceHelp({ choice }: { choice: VatChoice }) {
  const copy = VAT_CHOICE_MESSAGES[choice];

  return (
    <>
      {copy.help()}{" "}
      <em className="text-muted-foreground-2">
        {m.expense_vat_on_receipt({ cue: copy.cue() })}
      </em>
    </>
  );
}

export function VatChoiceField({
  value,
  keptTerms,
  onChange,
}: VatChoiceFieldProps) {
  const locale = useLocale();
  const legendId = useId();

  return (
    <Field>
      <div className="flex items-baseline justify-between gap-2.5">
        <FieldLegend id={legendId} variant="label">
          {m.expenses_field_vat()}
        </FieldLegend>
        <Popover>
          <PopoverTrigger render={<Button size="sm" variant="link" />}>
            {m.expense_vat_more()}
          </PopoverTrigger>
          <PopoverContent align="end" size="lg">
            <ul className="flex flex-col">
              {VAT_CHOICES.map((choice) => (
                <li key={choice}>
                  <button
                    aria-pressed={choice === value}
                    className={cn(
                      "w-full rounded-md px-3 py-2.5 text-left transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-primary-text",
                      choice === value && "bg-primary/8",
                    )}
                    onClick={() => onChange(choice)}
                    type="button"
                  >
                    <div className="text-foreground-hi text-sm">
                      {VAT_CHOICE_MESSAGES[choice].label()}
                    </div>
                    <div className="mt-0.5 text-muted-foreground-3 text-xs leading-relaxed">
                      <VatChoiceHelp choice={choice} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-1.5 rounded-md border border-primary/45 bg-primary/8 px-3 py-2.5 text-foreground-3 text-xs leading-relaxed">
              {m.expense_vat_note()}
            </p>
          </PopoverContent>
        </Popover>
      </div>
      <ChipGroup
        aria-labelledby={legendId}
        onValueChange={(next) => {
          if (isVatChoice(next[0])) {
            onChange(next[0]);
          }
        }}
        value={value === null ? [] : [value]}
      >
        {VAT_CHOICES.map((choice) => (
          <Chip key={choice} value={choice}>
            {VAT_CHOICE_MESSAGES[choice].label()}
          </Chip>
        ))}
      </ChipGroup>
      <FieldDescription>
        {value === null ? (
          m.expense_vat_kept_rate({
            rate: m.common_percent({
              value: formatPercentFromBp(locale, keptTerms.vatRateBp),
            }),
          })
        ) : (
          <VatChoiceHelp choice={value} />
        )}
      </FieldDescription>
    </Field>
  );
}
