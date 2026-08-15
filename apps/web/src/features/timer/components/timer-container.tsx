import { Popover, PopoverContent } from "@opusline/ui/components/popover";
import { useRef } from "react";
import { useMoneyFormat } from "@/components/money-format-provider";
import { calendarDateLabel } from "@/lib/dates";
import { formatWorkedTime } from "@/lib/durations";
import { entryRoundingLabel } from "@/lib/entry-rounding";
import { m } from "@/paraglide/messages.js";
import { formatClock } from "../lib/elapsed";
import { quickDurations } from "../lib/long-run";
import {
  defaultStopOption,
  type StopOption,
  stopChoices,
} from "../lib/rounding";
import { TimerChip } from "./timer-chip";
import { TimerDetailPopover } from "./timer-detail-popover";
import { useTimer } from "./timer-provider";
import { TimerStartButton } from "./timer-start-button";
import { TimerStartPopover } from "./timer-start-popover";
import { TimerStopDialog } from "./timer-stop-dialog";

export function TimerContainer({ workdayMinutes }: { workdayMinutes: number }) {
  const timer = useTimer();
  const anchorRef = useRef<HTMLDivElement>(null);

  const running = timer.timer;
  const isStopping = timer.overlay === "stopping";

  const isInsideChip = (node: EventTarget | null) =>
    node instanceof Node && anchorRef.current?.contains(node) === true;

  const closeUnlessFromChip = (open: boolean, details: { event: Event }) => {
    if (open) {
      return;
    }

    const relatedTarget =
      details.event instanceof FocusEvent ? details.event.relatedTarget : null;

    if (isInsideChip(details.event.target) || isInsideChip(relatedTarget)) {
      return;
    }

    timer.close();
  };

  return (
    <>
      <div className="flex items-center" ref={anchorRef}>
        {running === null ? (
          <TimerStartButton onClick={timer.openStart} />
        ) : (
          <TimerChip
            elapsedSeconds={timer.elapsedSeconds}
            isBusy={timer.isBusy}
            isDetailsOpen={timer.overlay === "detail"}
            isLongRun={timer.longRunHours !== null}
            missionName={running.missionName}
            onOpenDetails={timer.toggleDetail}
            onStop={timer.openStop}
            onTogglePause={timer.togglePause}
            state={running.state}
          />
        )}
      </div>

      <Popover
        onOpenChange={closeUnlessFromChip}
        open={timer.overlay === "start"}
      >
        <PopoverContent
          align="end"
          anchor={anchorRef}
          aria-label={m.timer_start_title()}
          className="w-84 p-1.5"
        >
          <TimerStartPopover
            error={timer.error}
            isStarting={timer.isStarting}
            missions={timer.missions}
            onPick={timer.pick}
          />
        </PopoverContent>
      </Popover>

      {running !== null && (
        <Popover
          onOpenChange={closeUnlessFromChip}
          open={timer.overlay === "detail"}
        >
          <PopoverContent
            align="end"
            anchor={anchorRef}
            aria-label={running.missionName}
            className="w-84 p-4"
            surface="raised"
          >
            <TimerDetailPopover
              elapsedSeconds={timer.elapsedSeconds}
              error={timer.error}
              idle={timer.idle}
              isBusy={timer.isBusy}
              longRunHours={timer.longRunHours}
              isConfirmingDiscard={timer.isConfirmingDiscard}
              missionName={running.missionName}
              missionSubtitle={
                timer.missions.find(
                  (option) => option.missionId === running.missionId,
                )?.subtitle ?? ""
              }
              note={timer.noteDraft}
              onCancelDiscard={timer.cancelDiscard}
              onChangeNote={timer.changeNote}
              onConfirmDiscard={timer.confirmDiscard}
              onDiscard={timer.discard}
              onDismissIdle={timer.dismissIdle}
              onKeepLongRun={timer.keepLongRun}
              onStop={timer.openStop}
              onTogglePause={timer.togglePause}
              onTrimIdle={timer.trimIdle}
              startedAt={running.startedAt}
              state={running.state}
            />
          </PopoverContent>
        </Popover>
      )}

      {isStopping && running !== null && timer.startDate !== null && (
        <StopDialog
          startDate={timer.startDate}
          timer={timer}
          workdayMinutes={workdayMinutes}
        />
      )}
    </>
  );
}

function StopDialog({
  startDate,
  timer,
  workdayMinutes,
}: {
  startDate: string;
  timer: ReturnType<typeof useTimer>;
  workdayMinutes: number;
}) {
  const format = useMoneyFormat();
  const running = timer.timer;

  if (running === null) {
    return null;
  }

  const measuredSeconds = timer.elapsedSeconds;
  const recordedSeconds =
    timer.correctedMinutes === null
      ? measuredSeconds
      : timer.correctedMinutes * 60;

  const { droppedMinutes, options } = stopChoices(
    format.locale,
    recordedSeconds,
    timer.mission,
    workdayMinutes,
  );
  const selectedKey = timer.stopChoice ?? defaultStopOption(options).key;

  const submitStop = (option: StopOption) =>
    timer.stop({
      durationMinutes: option.minutes,
      rounding: option.rounding,
    });

  return (
    <TimerStopDialog
      billable={timer.billable}
      clockLabel={formatClock(measuredSeconds)}
      correctionDraft={timer.correctionDraft}
      dateLabel={calendarDateLabel(format.locale, startDate)}
      droppedMinutes={droppedMinutes}
      measuredLabel={
        timer.longRunHours === null
          ? null
          : formatWorkedTime(Math.round(measuredSeconds / 60))
      }
      onCorrectDuration={timer.correctDuration}
      quickDurations={quickDurations(workdayMinutes)}
      workdayMinutes={workdayMinutes}
      error={timer.error}
      isSaving={timer.isSaving}
      missionName={running.missionName}
      missionRoundingLabel={
        timer.mission === null
          ? null
          : entryRoundingLabel(
              timer.mission.rounding ?? 1,
              timer.mission.billingMode,
            )
      }
      note={timer.noteDraft}
      noteSuggestions={timer.noteSuggestions}
      onChangeBillable={timer.setBillable}
      onChangeNote={timer.changeNote}
      onOpenChange={(open) => {
        if (!open) {
          timer.close();
        }
      }}
      onSelectRounding={timer.selectRounding}
      onSubmit={submitStop}
      open
      options={options}
      selectedKey={selectedKey}
    />
  );
}
