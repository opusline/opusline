import { Button } from "@opusline/ui/components/button";
import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

const periodNavigatorLabelVariants = cva(
  "whitespace-nowrap px-2 text-center text-foreground-2",
  {
    variants: {
      size: {
        default: "min-w-30 text-sm",
        sm: "min-w-27.5 text-sm",
      },
    },
    defaultVariants: { size: "default" },
  },
);

type PeriodNavigatorProps = Omit<ComponentProps<"div">, "children"> &
  VariantProps<typeof periodNavigatorLabelVariants> & {
    /** The period as the user reads it: « août 2026 », « S36 · 31 août – 6 sept. ». */
    label: ReactNode;
    previousLabel: string;
    nextLabel: string;
    isPreviousDisabled?: boolean;
    isNextDisabled?: boolean;
    onPrevious: () => void;
    onNext: () => void;
  };

/**
 * Previous / label / next, the way every dated screen steps through time. The
 * label is announced when it changes so a keyboard user hears where the
 * arrows took them.
 */
function PeriodNavigator({
  className,
  isNextDisabled = false,
  isPreviousDisabled = false,
  label,
  nextLabel,
  onNext,
  onPrevious,
  previousLabel,
  size,
  ...props
}: PeriodNavigatorProps) {
  return (
    <div
      data-slot="period-navigator"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    >
      <Button
        aria-label={previousLabel}
        disabled={isPreviousDisabled}
        onClick={onPrevious}
        size={size === "sm" ? "icon" : "icon-lg"}
        title={previousLabel}
        variant="outline"
      >
        <ChevronLeftIcon aria-hidden />
      </Button>
      <span
        aria-live="polite"
        className={periodNavigatorLabelVariants({ size })}
      >
        {label}
      </span>
      <Button
        aria-label={nextLabel}
        disabled={isNextDisabled}
        onClick={onNext}
        size={size === "sm" ? "icon" : "icon-lg"}
        title={nextLabel}
        variant="outline"
      >
        <ChevronRightIcon aria-hidden />
      </Button>
    </div>
  );
}

export { PeriodNavigator, periodNavigatorLabelVariants };
