import type { EntryRounding, FixedPriceBudgetData } from "@opusline/api-client";
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
import { ForfaitProjectionNote } from "@/components/forfait-projection-note";
import { useMoneyFormat } from "@/components/money-format-provider";
import { matchingNotes, NoteSuggestions } from "@/components/note-suggestions";
import { formatDurationInput, formatWorkedTime } from "@/lib/durations";
import { m } from "@/paraglide/messages.js";
import { stopSummary } from "../lib/labels";
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
  /** The forfait this entry lands on, when it lands on one. */
  missionBudget?: FixedPriceBudgetData | null;
  missionRounding?: EntryRounding | null;
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
  missionBudget = null,
  missionRounding = null,
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
  const format = useMoneyFormat();
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
          <DialogTitle size="lg">{m.timer_stop_title()}</DialogTitle>
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
              {m.timer_duration_clamped({ minutes: droppedMinutes })}
            </p>
          )}

          {measuredLabel !== null && (
            <div className="flex flex-col gap-3 rounded-md border border-primary/45 bg-primary/8 p-3">
              <p className="text-foreground-2 text-sm leading-relaxed">
                {m.timer_measured_duration({ duration: measuredLabel })}
              </p>
              <div className="flex flex-wrap gap-2">
                {quickDurations.map((minutes) => (
                  <Button
                    key={minutes}
                    onClick={() =>
                      onCorrectDuration(
                        formatDurationInput(format.locale, minutes, {
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
                  aria-label={m.timer_exact_duration_label()}
                  className="w-24"
                  font="mono"
                  onChange={(event) => onCorrectDuration(event.target.value)}
                  placeholder="3:30"
                  size="sm"
                  value={correctionDraft}
                />
                <span className="text-muted-foreground-3 text-xs">
                  {m.timer_exact_duration_hint()}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-muted-foreground-3 text-xs">
                {m.timer_rounding_label()}
              </span>
              {missionRoundingLabel !== null && (
                <span className="text-muted-foreground-4 text-xs">
                  {m.timer_mission_rounding_hint({
                    rounding: missionRoundingLabel,
                  })}
                </span>
              )}
            </div>

            <ChipGroup
              aria-label={m.timer_rounding_label()}
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
                  hint={option.isDefault ? m.timer_default_badge() : undefined}
                  key={option.key}
                  label={option.label}
                  value={option.key}
                />
              ))}
            </ChipGroup>

            {isDeviating && (
              <p className="text-primary-note text-xs leading-relaxed">
                {m.timer_rounding_deviation({ rounding: missionRoundingLabel })}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label tone="quiet" htmlFor={noteId}>
              {m.timer_note_label()}
            </Label>
            <Input
              id={noteId}
              onChange={(event) => onChangeNote(event.target.value)}
              placeholder={m.timer_stop_note_placeholder()}
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
            <Label tone="quiet" htmlFor={billableId}>
              {m.timer_non_billable()}
            </Label>
          </div>

          {missionBudget !== null && (
            <>
              <div className="flex items-baseline justify-between gap-3 border-t pt-3.5">
                <span className="text-muted-foreground-3 text-xs">
                  {m.timer_billable_amount_label()}
                </span>
                <span className="text-foreground-3 text-xs">
                  {m.timer_included_in_forfait()}
                </span>
              </div>
              <ForfaitProjectionNote
                budget={missionBudget}
                minutes={selected.minutes}
                rounding={selected.rounding ?? missionRounding}
                workdayMinutes={workdayMinutes}
              />
            </>
          )}

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
              {isSaving ? m.common_saving() : m.common_save()}
              <Kbd>⏎</Kbd>
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              size="2xl"
              type="button"
              variant="outline"
            >
              {m.common_cancel()}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
