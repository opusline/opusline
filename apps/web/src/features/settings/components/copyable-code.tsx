import { CopyButton } from "@opusline/ui/components/copy-button";

import { m } from "@/paraglide/messages.js";

/** A value to carry into another service's form: shown in full, copied in one click. */
export function CopyableCode({
  value,
  copyLabel,
  testId,
}: {
  value: string;
  copyLabel: string;
  testId: string;
}) {
  return (
    <span className="mt-1.5 flex items-center gap-2">
      <code
        className="min-w-0 break-all rounded-md border bg-muted px-2.5 py-1.5 font-mono text-foreground-hi text-xs"
        data-testid={testId}
      >
        {value}
      </code>
      <CopyButton
        aria-label={copyLabel}
        copiedLabel={m.common_copied()}
        failedLabel={m.common_copy_failed()}
        size="icon"
        value={value}
      />
    </span>
  );
}
