import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const inputGroupVariants = cva(
  "flex items-center rounded-md border border-input bg-muted transition-colors focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20 has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:focus-within:border-destructive has-[[aria-invalid=true]]:focus-within:ring-destructive/20",
  {
    variants: {
      size: {
        sm: "h-9 px-3",
        default: "h-10 px-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

/** A bordered row that groups a borderless input with a unit or suffix label. */
function InputGroup({
  className,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupVariants>) {
  return (
    <div
      data-slot="input-group"
      className={cn(inputGroupVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input-group-input"
      className={cn(
        "min-w-0 border-none bg-transparent font-mono text-foreground-hi tabular-nums outline-none",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupSuffix({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-suffix"
      className={cn(
        "shrink-0 whitespace-nowrap text-muted-foreground-2 text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { InputGroup, InputGroupInput, InputGroupSuffix, inputGroupVariants };
