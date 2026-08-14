import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import type * as React from "react";

const nativeSelectVariants = cva(
  "peer min-w-0 grow cursor-pointer appearance-none rounded-md border border-input bg-muted text-foreground-hi text-sm transition-colors outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        sm: "h-8 pr-8 pl-2.5",
        default: "h-10 pr-9 pl-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function NativeSelect({
  className,
  size,
  ...props
}: Omit<React.ComponentProps<"select">, "size"> &
  VariantProps<typeof nativeSelectVariants>) {
  return (
    <span className={cn("relative inline-flex", className)}>
      <select
        data-slot="native-select"
        className={nativeSelectVariants({ size })}
        {...props}
      />
      <ChevronDownIcon
        aria-hidden
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 size-4 text-muted-foreground-2 peer-disabled:opacity-50"
      />
    </span>
  );
}

export { NativeSelect, nativeSelectVariants };
