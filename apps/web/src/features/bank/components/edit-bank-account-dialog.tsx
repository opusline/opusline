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
import { Input } from "@opusline/ui/components/input";
import { Label } from "@opusline/ui/components/label";
import { Switch } from "@opusline/ui/components/switch";
import { useId, useState } from "react";

import { m } from "@/paraglide/messages.js";

export type EditBankAccountSubmit = {
  name: string | null;
  archived: boolean;
};

type EditBankAccountDialogProps = {
  open: boolean;
  /** The account as it stands, seeding the form; null names a new one. */
  account: { name: string | null; isArchived: boolean } | null;
  /** A connected account still receives movements and cannot be closed. */
  isConnected: boolean;
  isSaving: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: EditBankAccountSubmit) => void;
};

export function EditBankAccountDialog({
  open,
  onOpenChange,
  ...formProps
}: EditBankAccountDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        {open && <EditBankAccountForm {...formProps} />}
      </DialogContent>
    </Dialog>
  );
}

function EditBankAccountForm({
  account,
  isConnected,
  isSaving,
  error,
  onSubmit,
}: Omit<EditBankAccountDialogProps, "open" | "onOpenChange">) {
  const id = useId();
  const isNew = account === null;
  const [name, setName] = useState(account?.name ?? "");
  const [isArchived, setIsArchived] = useState(account?.isArchived ?? false);
  const canSubmit = !isSaving && (!isNew || name.trim() !== "");

  return (
    <form
      data-testid="bank-account-dialog"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          name: name.trim() === "" ? null : name.trim(),
          archived: isArchived,
        });
      }}
    >
      <DialogHeader>
        <DialogTitle size="lg">
          {isNew
            ? m.bank_account_new_dialog_title()
            : m.bank_account_dialog_title()}
        </DialogTitle>
        <DialogDescription className="text-pretty text-sm">
          {m.bank_account_dialog_description()}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-1.5">
        <Label htmlFor={`${id}-name`} size="md">
          {m.bank_account_name_label()}
        </Label>
        <Input
          autoFocus
          data-testid="bank-account-name"
          id={`${id}-name`}
          maxLength={120}
          onChange={(event) => setName(event.target.value)}
          placeholder={m.bank_account_default_name()}
          value={name}
        />
      </div>

      {!isNew && (
        <div className="mt-4 flex items-center gap-3">
          <Switch
            aria-describedby={`${id}-archived-hint`}
            checked={isArchived}
            data-testid="bank-account-archived"
            disabled={isConnected && !isArchived}
            id={`${id}-archived`}
            onCheckedChange={(checked) => setIsArchived(checked)}
          />
          <div>
            <label
              className="text-foreground-3 text-sm"
              htmlFor={`${id}-archived`}
            >
              {m.bank_account_archived_label()}
            </label>
            <div
              className="mt-0.5 text-muted-foreground-3 text-xs"
              id={`${id}-archived-hint`}
            >
              {isConnected
                ? m.bank_account_archived_connected_hint()
                : m.bank_account_archived_hint()}
            </div>
          </div>
        </div>
      )}

      {error !== null && (
        <Alert className="mt-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <DialogFooter className="mt-5">
        <DialogClose render={<Button size="xl" variant="outline" />}>
          {m.common_cancel()}
        </DialogClose>
        <Button
          data-testid="bank-account-submit"
          disabled={!canSubmit}
          size="xl"
          type="submit"
        >
          {isSaving ? m.common_saving() : m.common_save()}
        </Button>
      </DialogFooter>
    </form>
  );
}
