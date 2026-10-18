import type { ClaudeReadingFailure, ReceiptReader } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Dropzone } from "@opusline/ui/components/dropzone";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
import { FileTextIcon, LoaderCircleIcon } from "lucide-react";

import { m } from "@/paraglide/messages.js";

import { RECEIPT_ACCEPT } from "../lib/receipts";

/** Who read the receipt, and why not Claude when the account's key was tried. */
export type ReceiptReading = {
  reader: ReceiptReader;
  claudeFailure: ClaudeReadingFailure | null;
};

export type ReceiptScanState =
  | { status: "idle" }
  | { status: "busy"; fileName: string }
  | ({
      status: "done";
      fileName: string;
      readCount: number;
      hasCategory: boolean;
    } & ReceiptReading)
  /** The API answered but read nothing: a photo, a scan, an empty PDF. */
  | ({ status: "unreadable"; fileName: string } & ReceiptReading)
  | { status: "failed"; fileName: string; message: string };

const CLAUDE_FAILURE_NOTES: Record<ClaudeReadingFailure, () => string> = {
  0: m.expenses_scan_claude_key_rejected,
  1: m.expenses_scan_claude_unavailable,
  2: m.expenses_scan_claude_unreadable,
};

function readerNote({ reader, claudeFailure }: ReceiptReading): string | null {
  if (claudeFailure !== null) {
    return CLAUDE_FAILURE_NOTES[claudeFailure]();
  }

  return reader === 1 ? m.expenses_scan_read_by_claude() : null;
}

/** Who reads the next receipt, offered only to an account with an Anthropic key. */
export type ReceiptReaderChoice = {
  reader: ReceiptReader;
  onChange: (reader: ReceiptReader) => void;
};

const READERS: ReceiptReader[] = [1, 0];

const READER_LABELS: Record<ReceiptReader, () => string> = {
  0: m.expenses_scan_reader_server,
  1: m.expenses_scan_reader_claude,
};

type ReceiptScanZoneProps = {
  state: ReceiptScanState;
  onFile: (file: File) => void;
  onReset: () => void;
  readerChoice?: ReceiptReaderChoice | null;
};

export function ReceiptScanZone({
  state,
  onFile,
  onReset,
  readerChoice = null,
}: ReceiptScanZoneProps) {
  const isReadByClaude = readerChoice?.reader === 1;

  return (
    <>
      {state.status === "idle" && readerChoice !== null && (
        <div className="mb-2.5 flex items-center gap-3">
          <span className="text-muted-foreground-3 text-xs">
            {m.expenses_scan_reader_label()}
          </span>
          <SegmentedControl
            aria-label={m.expenses_scan_reader_label()}
            data-testid="receipt-reader"
            onValueChange={(value) => {
              const next = value[0];

              if (typeof next === "string") {
                readerChoice.onChange(Number(next) as ReceiptReader);
              }
            }}
            size="sm"
            value={[String(readerChoice.reader)]}
            variant="raised"
          >
            {READERS.map((reader) => (
              <SegmentedControlItem
                data-reader={reader}
                data-testid="receipt-reader-item"
                key={reader}
                value={String(reader)}
              >
                {READER_LABELS[reader]()}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </div>
      )}
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
              {isReadByClaude
                ? m.expenses_scan_zone_sub_claude()
                : m.expenses_scan_zone_sub()}
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
                {state.status === "failed" ? null : (
                  <ReaderNote reading={state} />
                )}
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

function ReaderNote({ reading }: { reading: ReceiptReading }) {
  const note = readerNote(reading);

  if (note === null) {
    return null;
  }

  return (
    <span
      className="mt-1 block text-muted-foreground-3 text-xs leading-relaxed"
      data-claude-failure={reading.claudeFailure ?? undefined}
      data-reader={reading.reader}
      data-testid="receipt-scan-reader"
    >
      {note}
    </span>
  );
}
