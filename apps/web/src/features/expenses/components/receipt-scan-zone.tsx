import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Dropzone } from "@opusline/ui/components/dropzone";
import { FileTextIcon, LoaderCircleIcon } from "lucide-react";

import { m } from "@/paraglide/messages.js";

import { RECEIPT_ACCEPT } from "../lib/receipts";

export type ReceiptScanState =
  | { status: "idle" }
  | { status: "busy"; fileName: string }
  | {
      status: "done";
      fileName: string;
      readCount: number;
      hasCategory: boolean;
    }
  /** The API answered but read nothing: a photo, a scan, an empty PDF. */
  | { status: "unreadable"; fileName: string }
  | { status: "failed"; fileName: string; message: string };

type ReceiptScanZoneProps = {
  state: ReceiptScanState;
  onFile: (file: File) => void;
  onReset: () => void;
};

export function ReceiptScanZone({
  state,
  onFile,
  onReset,
}: ReceiptScanZoneProps) {
  return (
    <>
      {state.status === "idle" && (
        <Dropzone
          accept={RECEIPT_ACCEPT}
          aria-label={m.expenses_scan_zone_aria()}
          onFiles={(files) => {
            const [file] = files;

            if (file !== undefined) {
              onFile(file);
            }
          }}
          size="lg"
          tone="brand"
        >
          <FileTextIcon aria-hidden />
          <span>
            <span className="block text-foreground-hi">
              {m.expenses_receipt_zone()}
            </span>
            <span className="mt-0.75 block text-muted-foreground-3 text-xs">
              {m.expenses_scan_zone_sub()}
            </span>
          </span>
        </Dropzone>
      )}
      {/* Always mounted, so the reading and its outcome get announced. */}
      <div aria-live="polite" className="empty:hidden">
        {state.status === "busy" && (
          <div className="flex items-center gap-3 rounded-md border bg-muted px-3.5 py-4">
            <LoaderCircleIcon
              aria-hidden
              className="size-4.5 shrink-0 animate-spin text-primary"
            />
            <div className="min-w-0">
              <div className="truncate text-foreground-hi text-sm">
                {m.expenses_scan_reading({ file: state.fileName })}
              </div>
              <div className="mt-0.5 text-muted-foreground-3 text-xs">
                {m.expenses_scan_step_text()}
              </div>
            </div>
          </div>
        )}
        {(state.status === "done" ||
          state.status === "unreadable" ||
          state.status === "failed") && (
          <Alert
            variant={
              state.status === "done"
                ? "success"
                : state.status === "unreadable"
                  ? "brand"
                  : "warn"
            }
          >
            <AlertDescription className="flex flex-wrap items-start justify-between gap-2.5">
              <span className="min-w-0">
                <span className="block text-foreground-hi text-sm">
                  {state.status === "done"
                    ? m.expenses_scan_fields_read({
                        count: state.readCount,
                        file: state.fileName,
                      })
                    : state.status === "unreadable"
                      ? m.expenses_scan_unreadable({ file: state.fileName })
                      : state.message}
                </span>
                <span className="mt-1 block text-muted-foreground-3 text-xs leading-relaxed">
                  {state.status === "done"
                    ? state.hasCategory
                      ? m.expenses_scan_hint_category()
                      : m.expenses_scan_hint()
                    : m.expenses_scan_hint_manual()}
                </span>
              </span>
              <Button onClick={onReset} size="sm" variant="ghost">
                {m.expenses_scan_another()}
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}
