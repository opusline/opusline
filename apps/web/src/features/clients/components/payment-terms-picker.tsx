import { Chip, ChipGroup } from "@opusline/ui/components/chip";
import { useState } from "react";

const PAYMENT_TERM_PRESETS = [30, 45, 60];

type PaymentTermsPickerProps = {
  id?: string;
  value: number;
  onChange: (days: number) => void;
};

export function PaymentTermsPicker({
  id,
  value,
  onChange,
}: PaymentTermsPickerProps) {
  const [isCustom, setIsCustom] = useState(
    () => !PAYMENT_TERM_PRESETS.includes(value),
  );
  const [customDraft, setCustomDraft] = useState(() =>
    PAYMENT_TERM_PRESETS.includes(value) ? "" : String(value),
  );

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <ChipGroup
        aria-label="Délai de paiement"
        id={id}
        value={[isCustom ? "custom" : String(value)]}
        onValueChange={(nextValue) => {
          const next = nextValue[0];

          if (next === "custom") {
            setIsCustom(true);
            const draftedDays = Number.parseInt(customDraft, 10);

            if (Number.isNaN(draftedDays)) {
              setCustomDraft(String(value));
            } else {
              onChange(draftedDays);
            }
            return;
          }

          if (typeof next === "string") {
            setIsCustom(false);
            onChange(Number(next));
          }
        }}
      >
        {PAYMENT_TERM_PRESETS.map((days) => (
          <Chip key={days} size="lg" value={String(days)}>
            {days} j
          </Chip>
        ))}
        <Chip size="lg" value="custom">
          Autre…
        </Chip>
      </ChipGroup>
      {isCustom && (
        <div className="flex h-9 items-center rounded-md border border-primary bg-muted px-3 ring-3 ring-primary/20">
          <input
            // biome-ignore lint/a11y/noAutofocus: the input appears because the user just picked "Autre…" — focus follows their action
            autoFocus
            aria-label="Délai de paiement en jours"
            className="w-13 min-w-0 border-none bg-transparent font-mono text-foreground-hi text-sm tabular-nums outline-none"
            inputMode="numeric"
            maxLength={3}
            onBlur={() => {
              if (customDraft === "") {
                setCustomDraft(String(value));
              }
            }}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "");
              setCustomDraft(digits);

              if (digits !== "") {
                onChange(Number.parseInt(digits, 10));
              }
            }}
            placeholder="90"
            value={customDraft}
          />
          <span className="shrink-0 whitespace-nowrap text-muted-foreground-2 text-sm">
            jours
          </span>
        </div>
      )}
    </div>
  );
}
