import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cn } from "@opusline/ui/lib/utils";

function SwatchGroup({ className, ...props }: ToggleGroupPrimitive.Props) {
  return (
    <ToggleGroupPrimitive
      data-slot="swatch-group"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

function Swatch({ className, ...props }: TogglePrimitive.Props) {
  return (
    <TogglePrimitive
      data-slot="swatch"
      className={cn(
        "size-7 rounded-md border border-black/10 transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-pressed:ring-2 data-pressed:ring-foreground-hi dark:border-white/12",
        className,
      )}
      {...props}
    />
  );
}

export { Swatch, SwatchGroup };
