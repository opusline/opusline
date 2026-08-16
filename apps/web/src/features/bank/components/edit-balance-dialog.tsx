import type { SignedMoneyData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import { Label } from "@opusline/ui/components/label";
import { useId, useState } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import {
  currencySymbol,
  formatAmount,
  formatSignedDraft,
  parseSignedAmountToCents,
} from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

type EditBalanceDialogProps = {
  open: boolean;
  /** The current balance, seeding the field; null on a blank account. */
  balance: SignedMoneyData | null;
  isSaving: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (cents: number) => void;
};

export function EditBalanceDialog({
  open,
  balance,
  isSaving,
  error,
  onOpenChange,
  onSubmit,
}: EditBalanceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <EditBalanceForm
            balance={balance}
            error={error}
            isSaving={isSaving}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type EditBalanceFormProps = {
  balance: SignedMoneyData | null;
  isSaving: boolean;
  error: string | null;
  onSubmit: (cents: number) => void;
};

function EditBalanceForm({
  balance,
  isSaving,
  error,
  onSubmit,
}: EditBalanceFormProps) {
  const format = useMoneyFormat();
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const invalidId = `${fieldId}-invalid`;
  const [draft, setDraft] = useState(() =>
    balance === null ? "" : formatAmount(format, balance.amount),
  );

  const cents = parseSignedAmountToCents(format.locale, draft);
  const isInvalidDraft = draft.trim() !== "" && cents === null;
  const canSubmit = cents !== null && !isSaving;
  const describedBy =
    [isInvalidDraft ? invalidId : "", error === null ? "" : errorId]
      .join(" ")
      .trim() || undefined;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (cents !== null) {
          onSubmit(cents);
        }
      }}
    >
      <DialogHeader>
        <DialogTitle size="lg">{m.bank_balance_dialog_title()}</DialogTitle>
        <DialogDescription className="text-pretty text-sm">
          {m.bank_balance_dialog_description()}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-1.5">
        <Label size="md" htmlFor={fieldId}>
          {m.bank_balance_field_label()}
        </Label>
        <InputGroup>
          <InputGroupInput
            aria-describedby={describedBy}
            aria-invalid={isInvalidDraft}
            autoFocus
            className="flex-1 font-mono"
            id={fieldId}
            inputMode="decimal"
            onChange={(event) =>
              setDraft(formatSignedDraft(format.locale, event.target.value))
            }
            value={draft}
          />
          <InputGroupSuffix>{currencySymbol(format)}</InputGroupSuffix>
        </InputGroup>
        {isInvalidDraft && (
          <p className="text-destructive text-xs" id={invalidId} role="alert">
            {m.bank_balance_unreadable()}
          </p>
        )}
      </div>

      {error !== null && (
        <Alert className="mt-4" id={errorId} variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <DialogFooter className="mt-5">
        <DialogClose render={<Button size="xl" variant="outline" />}>
          {m.common_cancel()}
        </DialogClose>
        <Button disabled={!canSubmit} size="xl" type="submit">
          {isSaving ? m.common_saving() : m.common_save()}
        </Button>
      </DialogFooter>
    </form>
  );
}
