import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import { Label } from "@opusline/ui/components/label";
import { cn } from "@opusline/ui/lib/utils";
import { UploadIcon } from "lucide-react";
import { useId, useState } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import {
  currencySymbol,
  formatSignedDraft,
  parseSignedAmountToCents,
} from "@/lib/billing";
import { formatFileSize } from "@/lib/documents";
import { m } from "@/paraglide/messages.js";

import {
  BANK_STATEMENT_ACCEPT,
  rejectStatementReason,
} from "../lib/statements";

export type ImportStatementSubmit = {
  file: File;
  balanceCents: number | null;
};

type ImportStatementDialogProps = {
  open: boolean;
  isSaving: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: ImportStatementSubmit) => void;
};

export function ImportStatementDialog({
  open,
  isSaving,
  error,
  onOpenChange,
  onSubmit,
}: ImportStatementDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && (
          <ImportStatementForm
            error={error}
            isSaving={isSaving}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type ImportStatementFormProps = {
  isSaving: boolean;
  error: string | null;
  onSubmit: (input: ImportStatementSubmit) => void;
};

function ImportStatementForm({
  isSaving,
  error,
  onSubmit,
}: ImportStatementFormProps) {
  const format = useMoneyFormat();
  const balanceId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [rejected, setRejected] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [balanceDraft, setBalanceDraft] = useState("");

  const pick = (files: ArrayLike<File> | null) => {
    const picked = files?.[0];

    if (picked === undefined || isSaving) {
      return;
    }

    const reason = rejectStatementReason(picked);
    setRejected(reason);
    setFile(reason === null ? picked : null);
  };

  const balanceCents =
    balanceDraft.trim() === ""
      ? null
      : parseSignedAmountToCents(format.locale, balanceDraft);
  const balanceInvalid = balanceDraft.trim() !== "" && balanceCents === null;
  const balanceErrorId = `${balanceId}-invalid`;
  const canSubmit = file !== null && !balanceInvalid && !isSaving;

  const submit = () => {
    if (file === null || !canSubmit) {
      return;
    }

    onSubmit({ file, balanceCents });
  };

  const message = rejected ?? error;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <DialogHeader>
        <DialogTitle size="lg">{m.bank_import_title()}</DialogTitle>
        <DialogDescription className="text-pretty text-sm">
          {m.bank_import_description()}
        </DialogDescription>
      </DialogHeader>

      <label
        className={cn(
          "mt-4 flex items-center gap-3 rounded-md border border-border-3 border-dashed p-5 text-muted-foreground transition-colors",
          "has-[input:focus-visible]:border-primary has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-primary/20",
          isSaving
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-primary",
          isDragOver && !isSaving && "border-primary bg-primary/7",
          file !== null && "border-primary border-solid",
        )}
        onDragLeave={() => setIsDragOver(false)}
        onDragOver={(event) => {
          if (isSaving) {
            return;
          }

          event.preventDefault();
          setIsDragOver(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragOver(false);
          pick(event.dataTransfer.files);
        }}
      >
        <input
          accept={BANK_STATEMENT_ACCEPT}
          aria-label={m.bank_import_drop_hint()}
          className="sr-only"
          disabled={isSaving}
          onChange={(event) => {
            pick(event.target.files);
            event.target.value = "";
          }}
          type="file"
        />
        <UploadIcon aria-hidden className="size-4.5 shrink-0" />
        <span className="min-w-0 truncate text-sm">
          {file === null
            ? m.bank_import_drop_hint()
            : `${file.name} · ${formatFileSize(format.locale, file.size)}`}
        </span>
      </label>

      <div className="mt-4 flex flex-col gap-1.5">
        <Label size="md" htmlFor={balanceId}>
          {m.bank_import_balance_label()}
        </Label>
        <InputGroup>
          <InputGroupInput
            aria-describedby={balanceInvalid ? balanceErrorId : undefined}
            aria-invalid={balanceInvalid}
            className="flex-1 font-mono"
            id={balanceId}
            inputMode="decimal"
            onChange={(event) =>
              setBalanceDraft(
                formatSignedDraft(format.locale, event.target.value),
              )
            }
            value={balanceDraft}
          />
          <InputGroupSuffix>{currencySymbol(format)}</InputGroupSuffix>
        </InputGroup>
        {balanceInvalid && (
          <p
            className="text-destructive text-xs"
            id={balanceErrorId}
            role="alert"
          >
            {m.bank_balance_unreadable()}
          </p>
        )}
        <p className="text-muted-foreground-3 text-xs">
          {m.bank_import_balance_help()}
        </p>
      </div>

      {message !== null && (
        <Alert className="mt-4" variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <DialogFooter className="mt-5">
        <DialogClose render={<Button size="xl" variant="outline" />}>
          {m.common_cancel()}
        </DialogClose>
        <Button disabled={!canSubmit} size="xl" type="submit">
          {isSaving ? m.bank_import_analysing() : m.bank_import_submit()}
        </Button>
      </DialogFooter>
    </form>
  );
}
