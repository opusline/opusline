import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@opusline/ui/lib/utils";

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "relative h-5.5 w-9.5 shrink-0 cursor-pointer rounded-full bg-border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/30 data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="absolute top-0.5 left-0.5 size-4.5 rounded-full bg-muted-foreground-5 transition-[left,background-color] data-checked:left-4.5 data-checked:bg-primary-foreground"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
