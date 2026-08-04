import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cn } from "@opusline/ui/lib/utils";

function SegmentedControl({ className, ...props }: ToggleGroupPrimitive.Props) {
  return (
    <ToggleGroupPrimitive
      data-slot="segmented-control"
      className={cn("flex rounded-md border bg-muted p-0.75", className)}
      {...props}
    />
  );
}

function SegmentedControlItem({ className, ...props }: TogglePrimitive.Props) {
  return (
    <TogglePrimitive
      data-slot="segmented-control-item"
      className={cn(
        "flex h-8.5 flex-1 items-center justify-center whitespace-nowrap rounded-sm px-3 text-muted-foreground-3 text-sm transition-colors outline-none hover:text-foreground-hi focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-pressed:bg-primary data-pressed:font-medium data-pressed:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { SegmentedControl, SegmentedControlItem };
