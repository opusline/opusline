import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const inputVariants = cva(
  "w-full min-w-0 rounded-md border border-input bg-muted py-0.5 text-foreground-hi text-sm transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground placeholder:text-muted-foreground-5 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      font: {
        sans: "",
        mono: "font-mono tabular-nums",
      },
      size: {
        sm: "h-8 px-2.5",
        default: "h-10 px-3",
      },
    },
    defaultVariants: {
      font: "sans",
      size: "default",
    },
  },
);

function Input({
  className,
  type,
  font,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ font, size }), className)}
      {...props}
    />
  );
}

export { Input, inputVariants };
