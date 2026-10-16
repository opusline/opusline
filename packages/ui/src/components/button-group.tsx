import { cn } from "@opusline/ui/lib/utils";
import type { ComponentProps } from "react";

/**
 * Buttons joined into one control — a split button, a primary action with its
 * menu of alternatives. The group squares the inner corners; a
 * ButtonGroupSeparator between two solid buttons keeps them apart.
 */
function ButtonGroup({ className, ...props }: ComponentProps<"fieldset">) {
  return (
    <fieldset
      className={cn(
        "m-0 flex w-fit min-w-0 items-stretch border-0 p-0 [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
        className,
      )}
      data-slot="button-group"
      {...props}
    />
  );
}

function ButtonGroupSeparator({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "w-px shrink-0 self-stretch bg-primary-text-strong",
        className,
      )}
      data-slot="button-group-separator"
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupSeparator };
