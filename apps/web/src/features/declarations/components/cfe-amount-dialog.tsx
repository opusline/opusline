import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import { useId, useState } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { currencySymbol, formatAmount, parseDecimal } from "@/lib/billing";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

type CfeAmountDialogProps = {
  open: boolean;
  /** What the avis says today, if it was entered already. */
  initialCents: number | null;
  onOpenChange: (open: boolean) => void;
  /** Resolves once saved (the dialog closes), rejects with the server's error. */
  onSave: (cents: number) => Promise<void>;
};

export function CfeAmountDialog({
  open,
  initialCents,
  onOpenChange,
  onSave,
}: CfeAmountDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <CfeAmountForm
            initialCents={initialCents}
            onCancel={() => onOpenChange(false)}
            onSave={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CfeAmountForm({
  initialCents,
  onCancel,
  onSave,
}: Pick<CfeAmountDialogProps, "initialCents" | "onSave"> & {
  onCancel: () => void;
}) {
  const format = useMoneyFormat();
  const id = useId();
  const [draft, setDraft] = useState(
    initialCents === null ? "" : formatAmount(format, initialCents),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const amount = parseDecimal(format.locale, draft);
  const cents = amount === null ? null : Math.round(amount * 100);
  const isPositiveAmount = cents !== null && cents > 0;
  const amountError =
    draft.trim() !== "" && !isPositiveAmount
      ? m.declarations_cfe_amount_invalid()
      : null;

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        if (!isPositiveAmount) {
          return;
        }

        setIsSaving(true);
        setError(null);

        try {
          await onSave(cents);
        } catch (failure) {
          setError(serverErrorMessage(failure, m.common_save_failed()));
        } finally {
          setIsSaving(false);
        }
      }}
    >
      <DialogHeader>
        <DialogTitle>{m.declarations_cfe_enter_amount()}</DialogTitle>
        <DialogDescription>
          {m.declarations_cfe_amount_hint()}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-3 py-4">
        {error !== null && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Field data-invalid={amountError !== null}>
          <FieldLabel htmlFor={id}>
            {m.declarations_cfe_amount_label()}
          </FieldLabel>
          <InputGroup className="w-48">
            <InputGroupInput
              aria-invalid={amountError !== null}
              className="font-mono tabular-nums"
              id={id}
              inputMode="decimal"
              onChange={(event) => setDraft(event.target.value)}
              value={draft}
            />
            <InputGroupSuffix>{currencySymbol(format)}</InputGroupSuffix>
          </InputGroup>
          {amountError !== null && <FieldError>{amountError}</FieldError>}
        </Field>
      </div>
      <DialogFooter>
        <Button onClick={onCancel} size="2xl" type="button" variant="outline">
          {m.common_cancel()}
        </Button>
        <Button
          disabled={!isPositiveAmount || isSaving}
          size="2xl"
          type="submit"
        >
          {m.common_save()}
        </Button>
      </DialogFooter>
    </form>
  );
}
