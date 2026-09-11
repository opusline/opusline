import type { DocumentData, InvoiceData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@opusline/ui/components/progress";
import { cn } from "@opusline/ui/lib/utils";
import { UploadIcon } from "lucide-react";
import { useRef, useState } from "react";

import { DocumentDownloadButton, DocumentRow } from "@/components/document-row";
import { invoiceDocumentDownloadHref } from "@/lib/documents";
import { fileRejector } from "@/lib/files";
import { m } from "@/paraglide/messages.js";

/** Mirrors UploadInvoiceDocumentData's Mimes and Max(20480) KB — refused before the upload. */
const ACCEPT = ".pdf,.jpg,.jpeg,.png";
const MAX_BYTES = 20_480 * 1024;

const rejectReason = fileRejector({
  accept: ACCEPT,
  maxBytes: MAX_BYTES,
  rejectType: m.documents_reject_type,
  rejectSize: m.documents_reject_size,
});

type InvoiceDocumentPanelProps = {
  invoice: InvoiceData;
  /** The filed document, or null while the invoice carries none. */
  document: DocumentData | null;
  isPending: boolean;
  /** Narrower than isPending: a removal is not an upload and has nothing to show. */
  isUploading?: boolean;
  /** Bytes sent, or null once they are gone and the API is still storing them. */
  uploadPercent?: number | null;
  error: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
};

/**
 * The invoice itself, filed against the record of it.
 *
 * Opusline never produces the document — the user's billing tool does — so until it
 * is dropped here the only copy is in someone's downloads folder. A draft has none:
 * nothing has been issued yet.
 */
export function InvoiceDocumentPanel({
  invoice,
  document,
  isPending,
  isUploading = false,
  uploadPercent = null,
  error,
  onUpload,
  onRemove,
}: InvoiceDocumentPanelProps) {
  // Hidden rather than sr-only, and opened by the visible controls: a file input
  // in the tab order is a focus stop nobody can see.
  const picker = useRef<HTMLInputElement>(null);
  const [rejected, setRejected] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  // Kept here rather than handed down: the panel is what knows which file was
  // picked, and the name is the only thing that makes the bar mean anything.
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  if (invoice.status === 0) {
    return null;
  }

  const pick = (candidate: File | undefined) => {
    if (candidate === undefined) {
      return;
    }

    const reason = rejectReason(candidate);

    setRejected(
      reason === null
        ? null
        : m.invoices_document_rejected({ name: candidate.name, reason }),
    );

    if (reason === null) {
      setUploadingFile(candidate.name);
      onUpload(candidate);
    }
  };

  return (
    <section className="border-t px-4 py-5">
      <h3 className={eyebrowVariants()}>{m.invoices_document_title()}</h3>

      <input
        accept={ACCEPT}
        className="hidden"
        onChange={(event) => {
          pick(event.target.files?.[0]);
          // The same file picked twice in a row must still fire a change.
          event.target.value = "";
        }}
        ref={picker}
        type="file"
      />

      {isUploading && uploadingFile !== null && (
        <Progress className="mt-3" value={uploadPercent}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <ProgressLabel>
              {uploadPercent === null
                ? m.upload_finishing()
                : m.upload_progress({ name: uploadingFile })}
            </ProgressLabel>
            {uploadPercent !== null && <ProgressValue />}
          </div>
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
      )}

      {document === null ? (
        <>
          <p className="mt-3 text-muted-foreground-3 text-sm">
            {m.invoices_document_empty()}
          </p>
          <button
            className={cn(
              "mt-3 flex w-full cursor-pointer items-center gap-3.5 rounded-md border border-border-3 border-dashed px-5 py-5 text-left transition-colors",
              "hover:border-muted-foreground-6 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20",
              isDragOver && "border-primary bg-primary/7",
            )}
            disabled={isPending}
            onClick={() => picker.current?.click()}
            onDragLeave={() => setIsDragOver(false)}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragOver(true);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragOver(false);
              pick(event.dataTransfer.files[0]);
            }}
            type="button"
          >
            <span className="flex size-9.5 shrink-0 items-center justify-center rounded-md bg-muted">
              <UploadIcon
                aria-hidden
                className="size-4 text-muted-foreground-3"
              />
            </span>
            <span className="flex min-w-0 flex-col gap-0.75">
              <span className="text-foreground-hi text-sm">
                {m.invoices_document_drop()}
              </span>
              <span className="text-muted-foreground-3 text-xs">
                {m.invoices_document_hint()}
              </span>
            </span>
          </button>
        </>
      ) : (
        <div className="mt-3 rounded-md border">
          <DocumentRow document={document}>
            <DocumentDownloadButton
              document={document}
              href={invoiceDocumentDownloadHref(invoice.id)}
            />
          </DocumentRow>
          <div className="flex flex-wrap gap-2 border-t px-4 py-3">
            <Button
              disabled={isPending}
              onClick={() => picker.current?.click()}
              size="lg"
              variant="outline"
            >
              {m.invoices_document_replace()}
            </Button>
            <Button
              disabled={isPending}
              onClick={onRemove}
              size="lg"
              variant="outline"
            >
              {m.invoices_document_remove()}
            </Button>
          </div>
        </div>
      )}

      {rejected !== null && (
        <p className="mt-3 text-destructive text-sm" role="alert">
          {rejected}
        </p>
      )}

      {error !== null && (
        <p className="mt-3 text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
