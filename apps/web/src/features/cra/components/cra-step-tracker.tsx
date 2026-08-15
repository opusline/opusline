import type { CraData } from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";
import { CheckIcon } from "lucide-react";
import { useLocale } from "@/components/money-format-provider";
import { m } from "@/paraglide/messages.js";
import {
  CRA_STEP_LABELS,
  CRA_STEPS,
  type CraStep,
  craStepState,
} from "../lib/cra-steps";

type CraStepTrackerProps = {
  cra: CraData;
  current: CraStep;
  onGo: (step: CraStep) => void;
};

export function CraStepTracker({ cra, current, onGo }: CraStepTrackerProps) {
  const locale = useLocale();
  const currentIndex = CRA_STEPS.indexOf(current);

  return (
    <ol aria-label={m.cra_steps_aria()} className="flex flex-wrap gap-2">
      {CRA_STEPS.map((step, index) => {
        const isCurrent = step === current;
        const isDone = index < currentIndex;

        return (
          <li className="min-w-0 flex-1" key={step}>
            <button
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                // Same active vocabulary as the settings tabs: a secondary surface and a
                // primary rail, so "where you are" reads the same everywhere in the app.
                "relative flex w-full items-center gap-2.5 rounded-md border py-3 pr-3 pl-6.5 text-left transition-colors",
                "focus-visible:outline-2 focus-visible:outline-primary-text focus-visible:outline-offset-2",
                "after:absolute after:inset-y-3 after:left-3 after:w-0.75 after:rounded-xs after:bg-primary after:opacity-0 after:transition-opacity",
                isCurrent
                  ? "border-border-4 bg-secondary after:opacity-100"
                  : "border-border hover:bg-accent",
              )}
              onClick={() => onGo(step)}
              type="button"
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full font-medium text-xs",
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isDone
                      ? "bg-success/20 text-success"
                      : "bg-secondary text-muted-foreground-3",
                )}
              >
                {isDone ? <CheckIcon className="size-3" /> : index + 1}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block truncate text-sm",
                    isCurrent ? "text-foreground-hi" : "text-foreground-3",
                  )}
                >
                  {CRA_STEP_LABELS[step]()}
                </span>
                <span className="block truncate text-muted-foreground-3 text-xs">
                  {craStepState(locale, step, cra)}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
