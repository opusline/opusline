import { cn } from "@opusline/ui/lib/utils";
import type * as React from "react";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        // No dimming here: the shortcut sits on a primary button, where 60%
        // opacity drops the label to 2.9:1 against the amber.
        "inline-flex select-none items-center justify-center font-mono text-xs",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
