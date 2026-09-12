import type { CraDetailData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import { Dropzone } from "@opusline/ui/components/dropzone";
import { cn } from "@opusline/ui/lib/utils";
import { UploadIcon } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/components/money-format-provider";
import { formatFileSize } from "@/lib/documents";
import { monthTitle } from "@/lib/months";
import { m } from "@/paraglide/messages.js";

const ACCEPT = ".pdf,.jpg,.jpeg,.png";
const ACCEPTED_EXTENSIONS = new Set(["pdf", "jpg", "jpeg", "png"]);
/** Mirrors UploadSignedCraData's Max(20480) KB — refused here rather than after the upload. */
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

type CraSignedReturnDialogProps = {
  detail: CraDetailData;
  open: boolean;
  isPending: boolean;
  error: string | null;
  onUpload: (file: File) => void;
  onOpenChange: (open: boolean) => void;
};

export function CraSignedReturnDialog({
  detail,
  open,
  isPending,
  error,
  onUpload,
  onOpenChange,
}: CraSignedReturnDialogProps) {
  const locale = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [rejected, setRejected] = useState<string | null>(null);

  const accept = (candidate: File | undefined) => {
    if (candidate === undefined) {
      return;
    }

    const extension = candidate.name.toLowerCase().split(".").pop() ?? "";

    if (!ACCEPTED_EXTENSIONS.has(extension)) {
      setRejected(m.cra_rejected_type({ name: candidate.name }));
      setFile(null);

      return;
    }

    if (candidate.size > MAX_UPLOAD_BYTES) {
      setRejected(m.cra_rejected_size({ name: candidate.name }));
      setFile(null);

      return;
    }

    setRejected(null);
    setFile(candidate);
  };

  const close = (next: boolean) => {
    if (!next) {
      setFile(null);
      setRejected(null);
    }

    onOpenChange(next);
  };

  return (
    <Dialog onOpenChange={close} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.cra_signed_return_title()}</DialogTitle>
          <DialogDescription>
            {m.cra_signed_return_description({
              month: monthTitle(locale, detail.cra.month),
              mission: detail.mission.name,
            })}
          </DialogDescription>
        </DialogHeader>

        {file === null ? (
          <Dropzone
            accept={ACCEPT}
            aria-label={m.cra_signed_return_drop()}
            className="h-auto gap-3.5 px-5 py-5"
            onFiles={(files) => accept(files[0])}
          >
            <span className="flex size-9.5 shrink-0 items-center justify-center rounded-md bg-muted">
              <UploadIcon
                aria-hidden
                className="size-4 text-muted-foreground-3"
              />
            </span>
            <span className="flex min-w-0 flex-col gap-0.75">
              <span className="text-foreground-hi text-sm">
                {m.cra_signed_return_drop()}
              </span>
              <span className="text-muted-foreground-3 text-xs">
                {m.cra_signed_return_hint()}
              </span>
            </span>
          </Dropzone>
        ) : (
          <div className="flex items-center gap-3 rounded-md border px-4 py-3.5">
            <span className="flex size-8.5 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-muted-foreground-3 text-xs uppercase">
              {file.name.split(".").pop()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-foreground-hi text-sm">
                {file.name}
              </span>
              <span className="mt-0.75 block text-muted-foreground-3 text-xs">
                {formatFileSize(locale, file.size)}
              </span>
            </span>
            <Button
              disabled={isPending}
              onClick={() => setFile(null)}
              size="xl"
              variant="outline"
            >
              {m.cra_signed_return_remove()}
            </Button>
          </div>
        )}

        {rejected !== null && (
          <Alert variant="warn">
            <AlertDescription>{rejected}</AlertDescription>
          </Alert>
        )}

        {error !== null && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button onClick={() => close(false)} size="2xl" variant="ghost">
            {m.common_cancel()}
          </Button>
          <Button
            disabled={file === null || isPending}
            onClick={() => file !== null && onUpload(file)}
            size="2xl"
          >
            {m.cra_signed_return_submit()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
