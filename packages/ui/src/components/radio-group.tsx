import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cn } from "@opusline/ui/lib/utils";
import { useId } from "react";

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary",
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

function RadioCard({
  className,
  description,
  title,
  value,
}: {
  className?: string;
  description: string;
  title: string;
  value: string;
}) {
  const id = useId();

  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-md border border-border-2 bg-muted px-4 py-3.5 transition-colors hover:border-border-3 has-data-checked:border-border-4 has-data-checked:bg-secondary",
        className,
      )}
      htmlFor={id}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-medium text-foreground-hi text-sm">{title}</span>
        <span className="text-muted-foreground-3 text-xs leading-normal">
          {description}
        </span>
      </span>
      <RadioGroupItem id={id} value={value} />
    </label>
  );
}

export { RadioCard, RadioGroup, RadioGroupItem };
