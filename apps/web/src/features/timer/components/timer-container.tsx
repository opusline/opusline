import { Popover, PopoverContent } from "@opusline/ui/components/popover";
import { useRef } from "react";

import { calendarDateLabel } from "@/lib/dates";
import { entryRoundingLabel } from "@/lib/entry-rounding";

import { formatClock } from "../lib/elapsed";
import { START_TITLE } from "../lib/labels";
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

    const { relatedTarget } = details.event as FocusEvent;

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
          aria-label={START_TITLE}
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
            className="w-84 bg-card-2 p-4"
          >
            <TimerDetailPopover
              elapsedSeconds={timer.elapsedSeconds}
              error={timer.error}
              idle={timer.idle}
              isBusy={timer.isBusy}
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
  const running = timer.timer;

  if (running === null) {
    return null;
  }

  const { droppedMinutes, options } = stopChoices(
    timer.elapsedSeconds,
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
      droppedMinutes={droppedMinutes}
      clockLabel={formatClock(timer.elapsedSeconds)}
      dateLabel={calendarDateLabel(startDate)}
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
