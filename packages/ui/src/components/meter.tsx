import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const meterIndicatorVariants = cva("h-full rounded-sm transition-[width]", {
  variants: {
    tone: {
      brand: "bg-primary",
      /** A share that is not the point of the row: the « Abonnements » bar among categories. */
      quiet: "bg-muted-foreground-4",
    },
  },
  defaultVariants: { tone: "brand" },
});

type MeterProps = Omit<MeterPrimitive.Root.Props, "children"> &
  VariantProps<typeof meterIndicatorVariants> &
  ({ "aria-label": string } | { "aria-labelledby": string });

/**
 * A read-only bar for a share of a whole: how much of the ceiling is used,
 * how a category compares to the largest. `value` runs from `min` to `max`
 * (0 to 1 by default). It needs a name — pass `aria-label` or point
 * `aria-labelledby` at the row's own label.
 */
function Meter({ className, max = 1, min = 0, tone, ...props }: MeterProps) {
  return (
    <MeterPrimitive.Root
      data-slot="meter"
      className={cn("w-full", className)}
      max={max}
      min={min}
      {...props}
    >
      <MeterPrimitive.Track className="h-2 w-full overflow-hidden rounded-sm bg-secondary">
        <MeterPrimitive.Indicator
          className={meterIndicatorVariants({ tone })}
        />
      </MeterPrimitive.Track>
    </MeterPrimitive.Root>
  );
}

export { Meter, meterIndicatorVariants };
