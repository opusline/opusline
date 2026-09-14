import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

/**
 * The small capitalised label that titles a panel or a column.
 *
 * Exported as classes too, the way `buttonVariants` is: a `<TableHead>` or a
 * grid header cell needs the role's styling without another element around it.
 */
const eyebrowVariants = cva("font-medium text-xs uppercase", {
  variants: {
    tone: {
      default: "text-muted-foreground-2",
      quiet: "text-muted-foreground-3",
    },
    /**
     * Named after the scale step, because the choice between them is a design
     * one: the wider the letter spacing, the more the label reads as chrome
     * rather than as a word. Anything tighter than `wider` stops reading as an
     * eyebrow at all.
     */
    tracking: {
      widest: "tracking-widest",
      "wider-2": "tracking-wider-2",
      wider: "tracking-wider",
    },
  },
  defaultVariants: {
    tone: "default",
    tracking: "widest",
  },
});

function Eyebrow({
  className,
  tone,
  tracking,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof eyebrowVariants>) {
  return (
    <div
      data-slot="eyebrow"
      className={cn(eyebrowVariants({ tone, tracking }), className)}
      {...props}
    />
  );
}

export { Eyebrow, eyebrowVariants };
