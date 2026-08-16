"use client";

import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const labelVariants = cva(
  "flex items-center gap-2 leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  {
    variants: {
      tone: {
        default: "",
        quiet: "text-muted-foreground-3",
      },
      size: {
        default: "text-xs/relaxed",
        md: "text-sm",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "default",
    },
  },
);

function Label({
  className,
  tone = "default",
  size = "default",
  ...props
}: React.ComponentProps<"label"> & VariantProps<typeof labelVariants>) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: generic primitive; consumers provide the association via htmlFor in props
    <label
      data-slot="label"
      className={cn(labelVariants({ tone, size, className }))}
      {...props}
    />
  );
}

export { Label, labelVariants };
