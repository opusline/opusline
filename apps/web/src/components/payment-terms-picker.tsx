import { Chip, ChipGroup } from "@opusline/ui/components/chip";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import { useRef, useState } from "react";
import { m } from "@/paraglide/messages.js";

const PAYMENT_TERM_PRESETS = [30, 45, 60];

type PaymentTermsPickerProps = {
  id?: string;
  value: number;
  onChange: (days: number) => void;
  onBlur?: () => void;
  isInvalid?: boolean;
  /**
   * "inline" keeps the free-day input always visible after an « ou », the way
   * the settings screen draws it; the default reveals it behind « Autre… ».
   */
  variant?: "default" | "inline";
};

export function PaymentTermsPicker({
  id,
  value,
  onChange,
  onBlur,
  isInvalid,
  variant = "default",
}: PaymentTermsPickerProps) {
  const Picker =
    variant === "inline"
      ? InlinePaymentTermsPicker
      : RevealingPaymentTermsPicker;

  return (
    <Picker
      id={id}
      isInvalid={isInvalid}
      onBlur={onBlur}
      onChange={onChange}
      value={value}
    />
  );
}

function DaysInput({
  draft,
  value,
  onDraft,
  onDays,
  onBlur,
  isInvalid,
  autoFocus = false,
  placeholder,
  groupClassName,
}: {
  draft: string;
  value: number;
  onDraft: (draft: string) => void;
  onDays: (days: number) => void;
  onBlur?: () => void;
  isInvalid?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  groupClassName?: string;
}) {
  return (
    <InputGroup className={groupClassName} size="sm">
      <InputGroupInput
        autoFocus={autoFocus}
        aria-invalid={isInvalid || undefined}
        aria-label={m.payment_terms_days_aria()}
        className="w-13 text-sm"
        inputMode="numeric"
        maxLength={3}
        onBlur={() => {
          if (draft === "") {
            onDraft(String(value));
          }
          onBlur?.();
        }}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, "");
          onDraft(digits);

          if (digits !== "") {
            onDays(Number.parseInt(digits, 10));
          }
        }}
        placeholder={placeholder}
        value={draft}
      />
      <InputGroupSuffix>{m.payment_terms_days_suffix()}</InputGroupSuffix>
    </InputGroup>
  );
}

function InlinePaymentTermsPicker({
  id,
  value,
  onChange,
  onBlur,
  isInvalid,
}: Omit<PaymentTermsPickerProps, "variant">) {
  const [draft, setDraft] = useState(() => String(value));
  const [lastValue, setLastValue] = useState(value);

  if (value !== lastValue) {
    setLastValue(value);
    setDraft(String(value));
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <ChipGroup
        aria-invalid={isInvalid || undefined}
        aria-label={m.clients_payment_terms_label()}
        id={id}
        value={[String(value)]}
        onValueChange={(nextValue) => {
          const next = nextValue[0];

          if (typeof next === "string") {
            onChange(Number(next));
          }
        }}
      >
        {PAYMENT_TERM_PRESETS.map((days) => (
          <Chip key={days} size="lg" value={String(days)}>
            {m.payment_terms_preset({ days })}
          </Chip>
        ))}
      </ChipGroup>
      <span className="px-1 text-muted-foreground-3 text-sm">
        {m.payment_terms_or()}
      </span>
      <DaysInput
        draft={draft}
        isInvalid={isInvalid}
        onBlur={onBlur}
        onDays={onChange}
        onDraft={setDraft}
        value={value}
      />
    </div>
  );
}

function RevealingPaymentTermsPicker({
  id,
  value,
  onChange,
  onBlur,
  isInvalid,
}: Omit<PaymentTermsPickerProps, "variant">) {
  const [isCustom, setIsCustom] = useState(
    () => !PAYMENT_TERM_PRESETS.includes(value),
  );
  const [customDraft, setCustomDraft] = useState(() =>
    PAYMENT_TERM_PRESETS.includes(value) ? "" : String(value),
  );
  const [lastValue, setLastValue] = useState(value);
  const emittedRef = useRef<number | null>(null);

  if (value !== lastValue) {
    setLastValue(value);

    if (emittedRef.current !== value) {
      setIsCustom(!PAYMENT_TERM_PRESETS.includes(value));
      setCustomDraft(PAYMENT_TERM_PRESETS.includes(value) ? "" : String(value));
    }
  }

  const emit = (days: number) => {
    emittedRef.current = days;
    onChange(days);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <ChipGroup
        aria-invalid={isInvalid || undefined}
        aria-label={m.clients_payment_terms_label()}
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
              emit(draftedDays);
            }
            return;
          }

          if (typeof next === "string") {
            setIsCustom(false);
            emit(Number(next));
          }
        }}
      >
        {PAYMENT_TERM_PRESETS.map((days) => (
          <Chip key={days} size="lg" value={String(days)}>
            {m.payment_terms_preset({ days })}
          </Chip>
        ))}
        <Chip size="lg" value="custom">
          {m.payment_terms_other()}
        </Chip>
      </ChipGroup>
      {isCustom && (
        <DaysInput
          autoFocus
          draft={customDraft}
          groupClassName="border-primary ring-3 ring-primary/20"
          isInvalid={isInvalid}
          onBlur={onBlur}
          onDays={emit}
          onDraft={setCustomDraft}
          placeholder="90"
          value={value}
        />
      )}
    </div>
  );
}
