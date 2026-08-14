import { cn } from "@opusline/ui/lib/utils";
import {
  LAST_MISSION_PILL,
  START_EMPTY,
  START_HINT,
  START_TITLE,
} from "../lib/labels";
import type { TimerMissionOption } from "../lib/mission-options";

export type TimerStartPopoverProps = {
  error: string | null;
  isStarting: boolean;
  missions: TimerMissionOption[];
  onPick: (missionId: number) => void;
};

export function TimerStartPopover({
  error,
  isStarting,
  missions,
  onPick,
}: TimerStartPopoverProps) {
  return (
    <div className="flex flex-col">
      <p className="px-2.5 pt-2.5 pb-3 font-medium text-muted-foreground-3 text-xs uppercase tracking-wider-2">
        {START_TITLE}
      </p>

      {missions.length === 0 ? (
        <p className="px-2.5 pb-2.5 text-muted-foreground-3 text-sm">
          {START_EMPTY}
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
          {missions.map((mission) => (
            <li key={mission.missionId}>
              <button
                className="flex w-full items-center gap-3 rounded-md border border-border-2 bg-card-2 px-3.5 py-3 text-left transition-colors hover:border-muted-foreground-6 hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                disabled={isStarting}
                onClick={() => onPick(mission.missionId)}
                type="button"
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-8 w-0.75 shrink-0 rounded-sm",
                    mission.colorClass,
                  )}
                />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-foreground-hi text-sm">
                    {mission.name}
                  </span>
                  <span className="truncate text-muted-foreground-3 text-xs">
                    {mission.subtitle}
                  </span>
                </span>
                {mission.isLast && (
                  <span className="shrink-0 rounded-full border border-border-2 px-2 py-0.5 text-muted-foreground-3 text-xs">
                    {LAST_MISSION_PILL}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error !== null && (
        <p className="px-2.5 pt-2.5 text-destructive text-xs" role="alert">
          {error}
        </p>
      )}

      {missions.length > 0 && (
        <p className="px-2.5 pt-2.5 pb-1 text-muted-foreground-3 text-xs leading-relaxed">
          {START_HINT}
        </p>
      )}
    </div>
  );
}
