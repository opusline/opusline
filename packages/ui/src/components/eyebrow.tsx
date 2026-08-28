import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

/**
 * The small capitalised label that titles a panel or a column.
 *
 * Exported as classes too, the way `buttonVariants` is: a `<TableHead>` or a
 * grid header cell needs the role's styling without another element around it.
 */
const eyebrowVariants = cva("font-medium text-xs uppercase tracking-widest", {
  variants: {
    tone: {
      default: "text-muted-foreground-2",
      quiet: "text-muted-foreground-3",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

function Eyebrow({
  className,
  tone,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof eyebrowVariants>) {
  return (
    <div
      data-slot="eyebrow"
      className={cn(eyebrowVariants({ tone }), className)}
      {...props}
    />
  );
}

export { Eyebrow, eyebrowVariants };
