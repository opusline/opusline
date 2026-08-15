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
import { cn } from "@opusline/ui/lib/utils";
import { UploadIcon } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/components/money-format-provider";
import { formatFileSize } from "@/lib/documents";
import { monthTitle } from "@/lib/months";
import {
  CANCEL,
  SIGNED_RETURN_DROP,
  SIGNED_RETURN_HINT,
  SIGNED_RETURN_REMOVE,
  SIGNED_RETURN_TITLE,
} from "../lib/labels";

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
  const [isDragOver, setIsDragOver] = useState(false);

  const accept = (candidate: File | undefined) => {
    if (candidate === undefined) {
      return;
    }

    const extension = candidate.name.toLowerCase().split(".").pop() ?? "";

    if (!ACCEPTED_EXTENSIONS.has(extension)) {
      setRejected(`${candidate.name} — un CRA signé est un PDF ou une image`);
      setFile(null);

      return;
    }

    if (candidate.size > MAX_UPLOAD_BYTES) {
      setRejected(`${candidate.name} — 20 Mo maximum`);
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
          <DialogTitle>{SIGNED_RETURN_TITLE}</DialogTitle>
          <DialogDescription>
            CRA de {monthTitle(locale, detail.cra.month)} ·{" "}
            {detail.mission.name}. Le document rejoint les pièces de la mission
            à côté de l'original.
          </DialogDescription>
        </DialogHeader>

        {file === null ? (
          <label
            className={cn(
              "flex cursor-pointer items-center gap-3.5 rounded-md border border-border-3 border-dashed px-5 py-5 transition-colors",
              "hover:border-muted-foreground-6 has-[input:focus-visible]:border-primary has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-primary/20",
              isDragOver && "border-primary bg-primary/7",
            )}
            onDragLeave={() => setIsDragOver(false)}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragOver(true);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragOver(false);
              accept(event.dataTransfer.files[0]);
            }}
          >
            <input
              accept={ACCEPT}
              aria-label={SIGNED_RETURN_DROP}
              className="sr-only"
              onChange={(event) => {
                accept(event.target.files?.[0]);
                event.target.value = "";
              }}
              type="file"
            />
            <span className="flex size-9.5 shrink-0 items-center justify-center rounded-md bg-muted">
              <UploadIcon
                aria-hidden
                className="size-4 text-muted-foreground-3"
              />
            </span>
            <span className="flex min-w-0 flex-col gap-0.75">
              <span className="text-foreground-hi text-sm">
                {SIGNED_RETURN_DROP}
              </span>
              <span className="text-muted-foreground-3 text-xs">
                {SIGNED_RETURN_HINT}
              </span>
            </span>
          </label>
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
              {SIGNED_RETURN_REMOVE}
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
            {CANCEL}
          </Button>
          <Button
            disabled={file === null || isPending}
            onClick={() => file !== null && onUpload(file)}
            size="2xl"
          >
            Enregistrer le retour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
