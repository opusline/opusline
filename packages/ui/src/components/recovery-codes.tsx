import { Button } from "@opusline/ui/components/button";
import { CopyButton } from "@opusline/ui/components/copy-button";
import { cn } from "@opusline/ui/lib/utils";
import { DownloadIcon } from "lucide-react";

type RecoveryCodesProps = React.ComponentProps<"div"> & {
  codes: string[];
  /** Accessible name of the list. */
  label: string;
  copyLabel: string;
  copiedLabel: string;
  copyFailedLabel: string;
  downloadLabel: string;
  /** e.g. `opusline-recovery-codes.txt`. */
  downloadFileName: string;
};

/** One-time codes as a scannable mono grid with copy and download. */
function RecoveryCodes({
  codes,
  label,
  copyLabel,
  copiedLabel,
  copyFailedLabel,
  downloadLabel,
  downloadFileName,
  className,
  ...props
}: RecoveryCodesProps) {
  const asText = codes.join("\n");

  const download = () => {
    const url = URL.createObjectURL(
      new Blob([`${asText}\n`], { type: "text/plain" }),
    );
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = downloadFileName;
    anchor.click();

    // Some browsers resolve the blob URL after click() returns; revoking it
    // synchronously would cancel the very download of the one-time codes.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div
      data-slot="recovery-codes"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <ol
        aria-label={label}
        className="grid grid-cols-1 gap-x-4 gap-y-1.5 whitespace-nowrap rounded-md border bg-muted px-3.5 py-3.5 font-mono text-foreground-hi text-sm tabular-nums sm:grid-cols-2"
      >
        {codes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-2">
        <CopyButton
          copiedLabel={copiedLabel}
          failedLabel={copyFailedLabel}
          label={copyLabel}
          value={asText}
        />
        <Button onClick={download} size="xl" variant="outline">
          <DownloadIcon data-icon="inline-start" />
          {downloadLabel}
        </Button>
      </div>
    </div>
  );
}

export { RecoveryCodes };
