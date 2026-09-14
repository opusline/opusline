import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const segmentedControlVariants = cva(
  "group/segmented flex rounded-md border bg-muted p-0.75",
  {
    variants: {
      /**
       * `raised` lifts the pressed segment as a card instead of painting it in
       * the brand colour — for a toolbar switch (HT | TTC, Saisir | Depuis la
       * facture) that changes a reading rather than committing a choice.
       */
      variant: {
        default: "",
        raised: "",
      },
      size: {
        default: "",
        sm: "gap-0.5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function SegmentedControl({
  className,
  size,
  variant,
  ...props
}: ToggleGroupPrimitive.Props & VariantProps<typeof segmentedControlVariants>) {
  return (
    <ToggleGroupPrimitive
      data-slot="segmented-control"
      data-size={size ?? "default"}
      data-variant={variant ?? "default"}
      className={cn(segmentedControlVariants({ size, variant }), className)}
      {...props}
    />
  );
}

function SegmentedControlItem({ className, ...props }: TogglePrimitive.Props) {
  return (
    <TogglePrimitive
      data-slot="segmented-control-item"
      className={cn(
        "flex h-8.5 flex-1 items-center justify-center whitespace-nowrap rounded-sm px-3 text-muted-foreground-3 text-sm transition-colors outline-none hover:text-foreground-hi focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50",
        "group-data-[variant=default]/segmented:data-pressed:bg-primary group-data-[variant=default]/segmented:data-pressed:font-medium group-data-[variant=default]/segmented:data-pressed:text-primary-foreground",
        "group-data-[variant=raised]/segmented:data-pressed:bg-card group-data-[variant=raised]/segmented:data-pressed:text-foreground-hi group-data-[variant=raised]/segmented:data-pressed:shadow-xs",
        "group-data-[size=sm]/segmented:h-6.5 group-data-[size=sm]/segmented:px-2.75 group-data-[size=sm]/segmented:text-xs",
        className,
      )}
      {...props}
    />
  );
}

export { SegmentedControl, SegmentedControlItem, segmentedControlVariants };
