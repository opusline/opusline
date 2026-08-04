import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const inputVariants = cva(
  "h-10 w-full min-w-0 rounded-md border border-input bg-muted px-3 py-0.5 text-foreground-hi text-sm transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground placeholder:text-muted-foreground-5 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      font: {
        sans: "",
        mono: "font-mono tabular-nums",
      },
    },
    defaultVariants: {
      font: "sans",
    },
  },
);

function Input({
  className,
  type,
  font,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ font }), className)}
      {...props}
    />
  );
}

export { Input, inputVariants };
