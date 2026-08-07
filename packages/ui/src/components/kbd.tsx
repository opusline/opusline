import { cn } from "@opusline/ui/lib/utils";
import type * as React from "react";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex select-none items-center justify-center font-mono text-xs opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
