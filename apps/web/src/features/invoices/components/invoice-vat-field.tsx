import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import { Label } from "@opusline/ui/components/label";
import { cn } from "@opusline/ui/lib/utils";
import { useId } from "react";

import { m } from "@/paraglide/messages.js";

type InvoiceVatFieldProps = {
  draft: string;
  onDraftChange: (draft: string) => void;
  isInvalid: boolean;
  /**
   * Whether the account charges TVA at all. Under the franchise en base the field is
   * not offered: every rate it could hold would put an unlawful line on the invoice.
   */
  vatLiable: boolean;
};

/** The rate an invoice is recorded with, shared by both ways of recording one. */
export function InvoiceVatField({
  draft,
  onDraftChange,
  isInvalid,
  vatLiable,
}: InvoiceVatFieldProps) {
  const fieldId = useId();
  const hintId = useId();

  if (!vatLiable) {
    return (
      <p className="text-muted-foreground-3 text-xs">
        {m.invoices_vat_franchise_hint()}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={fieldId}>{m.invoices_vat_label()}</Label>
      <InputGroup>
        <InputGroupInput
          aria-describedby={hintId}
          aria-invalid={isInvalid}
          className="flex-1"
          id={fieldId}
          inputMode="decimal"
          onChange={(event) => onDraftChange(event.target.value)}
          value={draft}
        />
        <InputGroupSuffix>%</InputGroupSuffix>
      </InputGroup>
      <p
        className={cn(
          "text-xs",
          isInvalid ? "text-destructive" : "text-muted-foreground-3",
        )}
        id={hintId}
      >
        {isInvalid ? m.common_rate_invalid() : m.invoices_vat_hint()}
      </p>
    </div>
  );
}
