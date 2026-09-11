import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "@opusline/ui/lib/utils";

/**
 * How far along something is.
 *
 * `value` is a percentage, or null while the work is under way with no figure to
 * report — the primitive renders that as indeterminate, which is honest about a
 * server that has taken the bytes and not answered yet.
 */
function Progress({ className, ...props }: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      className={cn("w-full", className)}
      data-slot="progress"
      {...props}
    />
  );
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "block h-1.5 w-full overflow-hidden rounded-xs bg-muted",
        className,
      )}
      data-slot="progress-track"
      {...props}
    />
  );
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      className={cn(
        "block h-full rounded-xs bg-primary transition-[width] duration-150",
        // Indeterminate has no width to animate, so it sweeps instead.
        "data-indeterminate:w-2/5 data-indeterminate:animate-pulse",
        className,
      )}
      data-slot="progress-indicator"
      {...props}
    />
  );
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("text-muted-foreground-3 text-xs", className)}
      data-slot="progress-label"
      {...props}
    />
  );
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "font-mono text-muted-foreground-3 text-xs tabular-nums",
        className,
      )}
      data-slot="progress-value"
      {...props}
    />
  );
}

export {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
};
