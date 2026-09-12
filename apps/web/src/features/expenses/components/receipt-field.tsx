import { Button } from "@opusline/ui/components/button";
import { Dropzone } from "@opusline/ui/components/dropzone";
import { Field, FieldError, FieldLegend } from "@opusline/ui/components/field";
import { FileTextIcon, PaperclipIcon } from "lucide-react";
import { useState } from "react";

import { m } from "@/paraglide/messages.js";

import { RECEIPT_ACCEPT, receiptRejection } from "../lib/receipts";

type ReceiptFieldProps = {
  value: File | null;
  onChange: (file: File | null) => void;
  storedFileName?: string | null;
  /** Offered while the picked file has not been read yet. */
  onFill?: () => void;
};

/**
 * The stored file is shown but not detached from here — that is the row
 * menu's job; « Remplacer » opens the zone so a new file takes its place.
 */
export function ReceiptField({
  value,
  onChange,
  storedFileName = null,
  onFill,
}: ReceiptFieldProps) {
  const [isReplacing, setIsReplacing] = useState(false);
  const rejection = value === null ? null : receiptRejection(value);
  const shownFileName = value?.name ?? (isReplacing ? null : storedFileName);

  return (
    <Field data-invalid={rejection !== null}>
      <FieldLegend variant="label">{m.expenses_field_receipt()}</FieldLegend>
      {shownFileName === null ? (
        <Dropzone
          accept={RECEIPT_ACCEPT}
          aria-label={m.expenses_field_receipt()}
          onFiles={(files) => onChange(files[0] ?? null)}
        >
          <PaperclipIcon aria-hidden className="text-muted-foreground-2" />
          <span>{m.expenses_receipt_zone()}</span>
        </Dropzone>
      ) : (
        <div className="flex h-11 items-center justify-between gap-2.5 rounded-md border bg-muted px-3">
          <span className="flex min-w-0 items-center gap-2 text-foreground-3 text-sm">
            <FileTextIcon aria-hidden className="size-3.5 shrink-0" />
            <span className="truncate">{shownFileName}</span>
          </span>
          {value !== null ? (
            <span className="flex shrink-0 items-center gap-1">
              {onFill !== undefined && (
                <Button onClick={onFill} size="sm" variant="link">
                  {m.expenses_receipt_fill()}
                </Button>
              )}
              <Button onClick={() => onChange(null)} size="sm" variant="ghost">
                {m.expenses_receipt_remove()}
              </Button>
            </span>
          ) : (
            <Button
              onClick={() => setIsReplacing(true)}
              size="sm"
              variant="ghost"
            >
              {m.expenses_receipt_replace()}
            </Button>
          )}
        </div>
      )}
      <FieldError>{rejection}</FieldError>
    </Field>
  );
}
