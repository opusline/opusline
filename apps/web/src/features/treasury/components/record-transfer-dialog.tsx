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
import { DateField } from "@/components/date-field";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import {
  currencySymbol,
  formatAmount,
  formatRateDraft,
  parseRateToCents,
} from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { valueOrNull } from "@/lib/form";
import { m } from "@/paraglide/messages.js";

export type RecordTransferSubmit = {
  amountCents: number;
  transferredOn: string;
  note: string | null;
};

type RecordTransferDialogProps = {
  open: boolean;
  /** The account's today — a transfer already made is never post-dated. */
  accountToday: string;
  /** The date the known balance covers; the dialog only opens once there is one. */
  coveredThrough: string;
  /** What is safe to transfer — seeds the field, since taking all of it is the point. */
  transferableCents: number;
  isSaving: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (submit: RecordTransferSubmit) => void;
};

export function RecordTransferDialog({
  open,
  accountToday,
  coveredThrough,
  transferableCents,
  isSaving,
  error,
  onOpenChange,
  onSubmit,
}: RecordTransferDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && (
          <RecordTransferForm
            accountToday={accountToday}
            coveredThrough={coveredThrough}
            error={error}
            isSaving={isSaving}
            onSubmit={onSubmit}
            transferableCents={transferableCents}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type RecordTransferFormProps = Omit<
  RecordTransferDialogProps,
  "open" | "onOpenChange"
>;

function RecordTransferForm({
  accountToday,
  coveredThrough,
  transferableCents,
  isSaving,
  error,
  onSubmit,
}: RecordTransferFormProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const fieldId = useId();
  const amountId = `${fieldId}-amount`;
  const dateId = `${fieldId}-date`;
  const noteId = `${fieldId}-note`;
  const invalidId = `${fieldId}-invalid`;
  const errorId = `${fieldId}-error`;

  // Seeded with the whole safe amount: the dialog is reached from a figure the
  // user has just read, and "take all of it" is the common answer. Nothing to
  // seed when the provisions already outgrow the account. The form remounts on
  // each open, so the seed follows the figure.
  //
  // Rounded DOWN to whole units, both because nobody transfers themselves four
  // cents and because rounding up would seed more than is actually safe — the
  // hero's own figure is rounded to the nearest, so the two can differ by one
  // unit, always in the conservative direction.
  const [amountDraft, setAmountDraft] = useState(() =>
    transferableCents > 0
      ? formatAmount(format, Math.floor(transferableCents / 100) * 100)
      : "",
  );
  const [transferredOn, setTransferredOn] = useState(accountToday);
  const [note, setNote] = useState("");

  const amountCents = parseRateToCents(format.locale, amountDraft);
  const isInvalidAmount = amountDraft.trim() !== "" && amountCents === null;
  // parseRateToCents already rejects zero and negatives; a native date input
  // can be cleared, and an empty date is a 422 waiting to happen.
  const draft: RecordTransferSubmit | null =
    amountCents !== null && transferredOn !== ""
      ? { amountCents, transferredOn, note: valueOrNull(note) }
      : null;
  const describedBy =
    [isInvalidAmount ? invalidId : "", error === null ? "" : errorId]
      .join(" ")
      .trim() || undefined;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (draft !== null) {
          onSubmit(draft);
        }
      }}
    >
      <DialogHeader>
        <DialogTitle size="lg">{m.treasury_dialog_title()}</DialogTitle>
        <DialogDescription className="text-pretty text-sm">
          {m.treasury_dialog_description()}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label size="md" htmlFor={amountId}>
            {m.treasury_amount_label()}
          </Label>
          <InputGroup>
            <InputGroupInput
              aria-describedby={describedBy}
              aria-invalid={isInvalidAmount}
              autoFocus
              className="flex-1 font-mono"
              id={amountId}
              inputMode="decimal"
              // Seeded, so focusing means "confirm or replace", not "append".
              onFocus={(event) => event.target.select()}
              onChange={(event) =>
                setAmountDraft(
                  formatRateDraft(format.locale, event.target.value),
                )
              }
              value={amountDraft}
            />
            <InputGroupSuffix>{currencySymbol(format)}</InputGroupSuffix>
          </InputGroup>
          {isInvalidAmount && (
            <p className="text-destructive text-xs" id={invalidId} role="alert">
              {m.treasury_amount_unreadable()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label size="md" htmlFor={dateId}>
            {m.treasury_date_label()}
          </Label>
          <DateField
            id={dateId}
            max={accountToday}
            onChange={setTransferredOn}
            value={transferredOn}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label size="md" htmlFor={noteId}>
            {m.treasury_note_label()}
          </Label>
          <Input
            id={noteId}
            maxLength={255}
            onChange={(event) => setNote(event.target.value)}
            placeholder={m.treasury_note_placeholder()}
            value={note}
          />
        </div>
      </div>

      <p className="mt-3 text-pretty text-muted-foreground-3 text-xs">
        {m.treasury_dialog_hint({
          date: calendarDateNumericLabel(dateFormat, coveredThrough),
        })}
      </p>

      {error !== null && (
        <Alert className="mt-4" id={errorId} variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <DialogFooter className="mt-5">
        <DialogClose render={<Button size="xl" variant="outline" />}>
          {m.common_cancel()}
        </DialogClose>
        <Button disabled={draft === null || isSaving} size="xl" type="submit">
          {isSaving ? m.common_saving() : m.common_save()}
        </Button>
      </DialogFooter>
    </form>
  );
}
