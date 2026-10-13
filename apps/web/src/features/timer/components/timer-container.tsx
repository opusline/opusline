import type { TimerData } from "@opusline/api-client";
import { Popover, PopoverContent } from "@opusline/ui/components/popover";
import { Sheet, SheetContent } from "@opusline/ui/components/sheet";
import { type ReactNode, type RefObject, useRef } from "react";
import { useMoneyFormat } from "@/components/money-format-provider";
import { calendarDateLabel } from "@/lib/dates";
import { formatWorkedTime, isFixedPrice } from "@/lib/durations";
import { entryRoundingLabel } from "@/lib/entry-rounding";
import { formatClock, useTimerClock } from "@/lib/timer-clock";
import { useIsPhone } from "@/lib/use-is-phone";
import { useMissionBudgets } from "@/lib/use-mission-budgets";
import { m } from "@/paraglide/messages.js";
import { quickDurations } from "../lib/long-run";
import {
  defaultStopOption,
  type StopOption,
  stopChoices,
} from "../lib/rounding";
import { useTimerAlerts } from "./timer-alerts";
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
          <LiveChip running={running} />
        )}
      </div>

      <TimerOverlay
        anchor={anchorRef}
        label={m.timer_start_title()}
        onOpenChange={closeUnlessFromChip}
        open={timer.overlay === "start"}
        padding="tight"
      >
        <TimerStartPopover
          error={timer.error}
          isLoading={timer.isLoadingMissions}
          isStarting={timer.isStarting}
          missions={timer.missions}
          onPick={timer.pick}
        />
      </TimerOverlay>

      {running !== null && (
        <TimerOverlay
          anchor={anchorRef}
          label={running.missionName}
          onOpenChange={closeUnlessFromChip}
          open={timer.overlay === "detail"}
          padding="roomy"
        >
          <LiveDetailPopover running={running} />
        </TimerOverlay>
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

/**
 * A popover hanging off the chip, or — on a phone, where it would be wider
 * than the room beside its anchor — a sheet rising from the bottom edge.
 */
function TimerOverlay({
  anchor,
  children,
  label,
  onOpenChange,
  open,
  padding,
}: {
  anchor: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  label: string;
  onOpenChange: (open: boolean, details: { event: Event }) => void;
  open: boolean;
  padding: "tight" | "roomy";
}) {
  const isPhone = useIsPhone();
  const sheetRef = useRef<HTMLDivElement>(null);

  if (isPhone) {
    return (
      <Sheet onOpenChange={onOpenChange} open={open}>
        <SheetContent
          aria-label={label}
          className={padding === "tight" ? "p-2.5" : "p-4"}
          data-testid="timer-sheet"
          // The sheet opens from state rather than from a trigger, so Base UI
          // cannot tell it was a touch: left alone it focuses the note field
          // and the keyboard covers the buttons the sheet was opened for.
          initialFocus={sheetRef}
          ref={sheetRef}
          showCloseButton={false}
          side="bottom"
        >
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverContent
        align="end"
        anchor={anchor}
        aria-label={label}
        className={padding === "tight" ? "w-84 p-1.5" : "w-84 p-4"}
        surface={padding === "tight" ? "default" : "raised"}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}

/**
 * The clock consumers, split out so the 1 Hz tick re-renders these leaves and
 * nothing above them; each mounts only while its surface is on screen.
 */
function LiveChip({ running }: { running: TimerData }) {
  const timer = useTimer();
  const { elapsedSeconds } = useTimerClock();
  const { longRunHours } = useTimerAlerts();

  return (
    <TimerChip
      elapsedSeconds={elapsedSeconds}
      isBusy={timer.isBusy}
      isDetailsOpen={timer.overlay === "detail"}
      isLongRun={longRunHours !== null}
      missionName={running.missionName}
      onOpenDetails={timer.toggleDetail}
      onStop={timer.openStop}
      onTogglePause={timer.togglePause}
      state={running.state}
    />
  );
}

function LiveDetailPopover({ running }: { running: TimerData }) {
  const timer = useTimer();
  const { elapsedSeconds } = useTimerClock();
  const { idle, longRunHours } = useTimerAlerts();

  return (
    <TimerDetailPopover
      elapsedSeconds={elapsedSeconds}
      error={timer.error}
      idle={idle}
      isBusy={timer.isBusy}
      longRunHours={longRunHours}
      isConfirmingDiscard={timer.isConfirmingDiscard}
      missionName={running.missionName}
      missionSubtitle={
        timer.missions.find((option) => option.missionId === running.missionId)
          ?.subtitle ?? ""
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
  const { elapsedSeconds } = useTimerClock();
  const { longRunHours } = useTimerAlerts();
  const running = timer.timer;
  // Read here rather than in the layout: this whole-account fold is only worth its
  // cost while an entry is actually being written against a forfait, and this
  // component only mounts then.
  const budgets = useMissionBudgets(
    timer.mission !== null && isFixedPrice(timer.mission.billingMode),
  );

  if (running === null) {
    return null;
  }

  const measuredSeconds = elapsedSeconds;
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
        longRunHours === null
          ? null
          : formatWorkedTime(Math.round(measuredSeconds / 60))
      }
      onCorrectDuration={timer.correctDuration}
      quickDurations={quickDurations(workdayMinutes)}
      workdayMinutes={workdayMinutes}
      error={timer.error}
      isSaving={timer.isSaving}
      missionBudget={budgets.get(running.missionId) ?? null}
      missionName={running.missionName}
      missionRounding={timer.mission?.rounding ?? null}
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
