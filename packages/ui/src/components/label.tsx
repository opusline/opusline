"use client";

import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const labelVariants = cva(
  "flex items-center gap-2 text-xs/relaxed leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  {
    variants: {
      tone: {
        default: "",
        quiet: "text-muted-foreground-3",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

function Label({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"label"> & VariantProps<typeof labelVariants>) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: generic primitive; consumers provide the association via htmlFor in props
    <label
      data-slot="label"
      className={cn(labelVariants({ tone, className }))}
      {...props}
    />
  );
}

export { Label, labelVariants };
