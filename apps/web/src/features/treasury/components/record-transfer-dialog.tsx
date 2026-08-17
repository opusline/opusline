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
import { Input } from "@opusline/ui/components/input";
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
  formatRateDraft,
  parseRateToCents,
} from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

export type RecordTransferSubmit = {
  amountCents: number;
  transferredOn: string;
  note: string | null;
};

type RecordTransferDialogProps = {
  open: boolean;
  /** `Y-m-d`, passed in rather than read from the clock so stories stay fixed. */
  today: string;
  isSaving: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: RecordTransferSubmit) => void;
};

export function RecordTransferDialog({
  open,
  today,
  isSaving,
  error,
  onOpenChange,
  onSubmit,
}: RecordTransferDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <RecordTransferForm
            error={error}
            isSaving={isSaving}
            onSubmit={onSubmit}
            today={today}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type RecordTransferFormProps = {
  today: string;
  isSaving: boolean;
  error: string | null;
  onSubmit: (input: RecordTransferSubmit) => void;
};

function RecordTransferForm({
  today,
  isSaving,
  error,
  onSubmit,
}: RecordTransferFormProps) {
  const format = useMoneyFormat();
  const amountId = useId();
  const dateId = useId();
  const noteId = useId();
  const errorId = `${amountId}-error`;

  const [amountDraft, setAmountDraft] = useState("");
  const [transferredOn, setTransferredOn] = useState(today);
  const [note, setNote] = useState("");

  const amountCents = parseRateToCents(format.locale, amountDraft);
  const isInvalidAmount = amountDraft.trim() !== "" && amountCents === null;
  const canSubmit =
    amountCents !== null &&
    amountCents > 0 &&
    transferredOn !== "" &&
    !isSaving;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (canSubmit && amountCents !== null) {
          onSubmit({
            amountCents,
            transferredOn,
            note: note.trim() === "" ? null : note.trim(),
          });
        }
      }}
    >
      <DialogHeader>
        <DialogTitle size="lg">{m.treasury_record()}</DialogTitle>
        <DialogDescription className="text-pretty text-sm">
          {m.treasury_record_hint()}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <Label size="md" htmlFor={amountId}>
            {m.treasury_amount_label()}
          </Label>
          <InputGroup>
            <InputGroupInput
              aria-describedby={error === null ? undefined : errorId}
              aria-invalid={isInvalidAmount}
              autoFocus
              className="flex-1 font-mono"
              id={amountId}
              inputMode="decimal"
              onChange={(event) =>
                setAmountDraft(
                  formatRateDraft(format.locale, event.target.value),
                )
              }
              value={amountDraft}
            />
            <InputGroupSuffix>{currencySymbol(format)}</InputGroupSuffix>
          </InputGroup>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label size="md" htmlFor={dateId}>
            {m.treasury_date_label()}
          </Label>
          <Input
            id={dateId}
            // A transfer is noted after the fact, so tomorrow is never valid.
            max={today}
            onChange={(event) => setTransferredOn(event.target.value)}
            type="date"
            value={transferredOn}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label size="md" htmlFor={noteId}>
            {m.treasury_note_label()}
          </Label>
          <Input
            id={noteId}
            onChange={(event) => setNote(event.target.value)}
            placeholder={m.treasury_note_placeholder()}
            value={note}
          />
        </div>
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
          {isSaving ? m.common_saving() : m.treasury_save()}
        </Button>
      </DialogFooter>
    </form>
  );
}
