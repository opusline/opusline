import { cn } from "@opusline/ui/lib/utils";

import { m } from "@/paraglide/messages.js";

import type { FieldSource } from "../lib/receipt-suggestion";

export function FieldSourceTag({
  source,
}: {
  source: FieldSource | undefined;
}) {
  if (source === undefined) {
    return null;
  }

  return (
    <span
      className={cn(
        "font-normal text-2xs",
        source === "read" ? "text-success" : "text-attention",
      )}
    >
      {source === "read"
        ? m.expenses_scan_source_read()
        : m.expenses_scan_source_suggested()}
    </span>
  );
}
