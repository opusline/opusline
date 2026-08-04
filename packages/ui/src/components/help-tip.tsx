"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@opusline/ui/lib/utils";
import type * as React from "react";

type HelpTipProps = {
  /** Accessible label of the "?" trigger, e.g. "Qu'est-ce que l'arrondi ?" */
  label: string;
  children: React.ReactNode;
  className?: string;
};

function HelpTip({ label, children, className }: HelpTipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger
        aria-label={label}
        data-slot="help-tip-trigger"
        className={cn(
          "flex size-4.5 shrink-0 cursor-help items-center justify-center rounded-full border border-border-2 bg-transparent text-muted-foreground-4 text-xs transition-colors outline-none hover:border-muted-foreground-5 hover:text-foreground-hi focus-visible:ring-2 focus-visible:ring-ring/30",
          className,
        )}
      >
        ?
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner
          align="start"
          className="isolate z-50"
          side="bottom"
          sideOffset={6}
        >
          <TooltipPrimitive.Popup
            data-slot="help-tip-content"
            className="z-50 w-70 rounded-md border border-border-2 bg-popover px-3 py-2.75 text-muted-foreground text-xs leading-relaxed shadow-lg data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0"
          >
            {children}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export { HelpTip };
