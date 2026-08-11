import { Button } from "@opusline/ui/components/button";
import { Checkbox } from "@opusline/ui/components/checkbox";
import { ChipGroup, ChipOption } from "@opusline/ui/components/chip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import { Input } from "@opusline/ui/components/input";
import { Kbd } from "@opusline/ui/components/kbd";
import { Label } from "@opusline/ui/components/label";
import { useId } from "react";

import { matchingNotes, NoteSuggestions } from "@/components/note-suggestions";
import { formatAmountWithCents } from "@/lib/billing";
import { formatDurationInput, formatWorkedTime } from "@/lib/durations";
import {
  AMOUNT_LABEL,
  CANCEL,
  DEFAULT_BADGE,
  durationClamped,
  EXACT_DURATION_HINT,
  EXACT_DURATION_LABEL,
  measuredDuration,
  missionRoundingHint,
  NON_BILLABLE,
  NOT_BILLABLE_VALUE,
  NOTE_LABEL,
  ROUNDING_LABEL,
  roundingDeviation,
  SAVE,
  SAVING,
  STOP_NOTE_PLACEHOLDER,
  STOP_TITLE,
  stopSummary,
} from "../lib/labels";
import { HOURLY_BILLING } from "../lib/long-run";
import type { StopOption } from "../lib/rounding";

export type TimerStopDialogProps = {
  measuredLabel: string | null;
  correctionDraft: string;
  quickDurations: number[];
  workdayMinutes: number;
  onCorrectDuration: (draft: string) => void;
  droppedMinutes: number;
  billable: boolean;
  clockLabel: string;
  dateLabel: string;
  error: string | null;
  isSaving: boolean;
  missionName: string;
  missionRoundingLabel: string | null;
  note: string;
  noteSuggestions: string[];
  onChangeBillable: (billable: boolean) => void;
  onChangeNote: (note: string) => void;
  onOpenChange: (open: boolean) => void;
  onSelectRounding: (key: string) => void;
  onSubmit: (option: StopOption) => void;
  open: boolean;
  options: [StopOption, ...StopOption[]];
  selectedKey: string;
};

export function TimerStopDialog({
  measuredLabel,
  correctionDraft,
  quickDurations,
  workdayMinutes,
  onCorrectDuration,
  droppedMinutes,
  billable,
  clockLabel,
  dateLabel,
  error,
  isSaving,
  missionName,
  missionRoundingLabel,
  note,
  noteSuggestions,
  onChangeBillable,
  onChangeNote,
  onOpenChange,
  onSelectRounding,
  onSubmit,
  open,
  options,
  selectedKey,
}: TimerStopDialogProps) {
  const billableId = useId();
  const noteId = useId();

  const selected =
    options.find((option) => option.key === selectedKey) ?? options[0];
  const isDeviating = !selected.isDefault && missionRoundingLabel !== null;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="font-heading font-semibold text-foreground-hi text-lg">
            {STOP_TITLE}
          </DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-4 px-5 pt-1 pb-4.5"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(selected);
          }}
        >
          <p className="text-muted-foreground-3 text-sm">
            {stopSummary(clockLabel, missionName, dateLabel, billable)}
          </p>

          {droppedMinutes > 0 && (
            <p
              className="text-destructive text-xs leading-relaxed"
              role="alert"
            >
              {durationClamped(droppedMinutes)}
            </p>
          )}

          {measuredLabel !== null && (
            <div className="flex flex-col gap-3 rounded-md border border-primary/45 bg-primary/8 p-3">
              <p className="text-foreground-2 text-sm leading-relaxed">
                {measuredDuration(measuredLabel)}
              </p>
              <div className="flex flex-wrap gap-2">
                {quickDurations.map((minutes) => (
                  <Button
                    key={minutes}
                    onClick={() =>
                      onCorrectDuration(
                        formatDurationInput(minutes, {
                          billingMode: HOURLY_BILLING,
                          workdayMinutes,
                        }),
                      )
                    }
                    size="lg"
                    variant="outline"
                  >
                    {formatWorkedTime(minutes)}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2.5">
                <Input
                  aria-label={EXACT_DURATION_LABEL}
                  className="w-24"
                  font="mono"
                  onChange={(event) => onCorrectDuration(event.target.value)}
                  placeholder="3:30"
                  size="sm"
                  value={correctionDraft}
                />
                <span className="text-muted-foreground-3 text-xs">
                  {EXACT_DURATION_HINT}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-muted-foreground-3 text-xs">
                {ROUNDING_LABEL}
              </span>
              {missionRoundingLabel !== null && (
                <span className="text-muted-foreground-4 text-xs">
                  {missionRoundingHint(missionRoundingLabel)}
                </span>
              )}
            </div>

            <ChipGroup
              aria-label={ROUNDING_LABEL}
              className="flex-nowrap items-stretch"
              onValueChange={(value) => {
                const [picked] = value;

                if (picked !== undefined) {
                  onSelectRounding(picked);
                }
              }}
              value={[selected.key]}
            >
              {options.map((option) => (
                <ChipOption
                  align="center"
                  className="flex-1"
                  font="mono"
                  hint={option.isDefault ? DEFAULT_BADGE : undefined}
                  key={option.key}
                  label={option.label}
                  value={option.key}
                />
              ))}
            </ChipGroup>

            {isDeviating && (
              <p className="text-primary-note text-xs leading-relaxed">
                {roundingDeviation(missionRoundingLabel)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground-3 text-xs" htmlFor={noteId}>
              {NOTE_LABEL}
            </Label>
            <Input
              id={noteId}
              onChange={(event) => onChangeNote(event.target.value)}
              placeholder={STOP_NOTE_PLACEHOLDER}
              value={note}
            />
            <NoteSuggestions
              onPick={onChangeNote}
              suggestions={matchingNotes(noteSuggestions, note)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={!billable}
              id={billableId}
              onCheckedChange={(checked) => onChangeBillable(!checked)}
            />
            <Label
              className="text-muted-foreground-3 text-xs"
              htmlFor={billableId}
            >
              {NON_BILLABLE}
            </Label>
          </div>

          <div className="flex items-center justify-between gap-3 border-border border-t pt-4">
            <span className="text-muted-foreground-3 text-sm">
              {AMOUNT_LABEL}
            </span>
            <span className="font-mono text-primary-text text-sm tabular-nums">
              {selected.amountCents === null || !billable
                ? NOT_BILLABLE_VALUE
                : formatAmountWithCents(selected.amountCents)}
            </span>
          </div>

          {error !== null && (
            <p className="text-destructive text-xs" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center gap-2">
            <Button
              className="flex-1"
              disabled={isSaving}
              size="2xl"
              type="submit"
            >
              {isSaving ? SAVING : SAVE}
              <Kbd>⏎</Kbd>
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              size="2xl"
              type="button"
              variant="outline"
            >
              {CANCEL}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
