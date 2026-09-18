import type { BankConnectionAccountData } from "@opusline/api-client";
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
import { RadioCard, RadioGroup } from "@opusline/ui/components/radio-group";
import { useState } from "react";

import { m } from "@/paraglide/messages.js";

type ChooseBankAccountDialogProps = {
  open: boolean;
  accounts: BankConnectionAccountData[];
  isSaving: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (accountUid: string) => void;
};

/** A consent covering several accounts: the one the Compte pro page follows. */
export function ChooseBankAccountDialog({
  open,
  accounts,
  isSaving,
  error,
  onOpenChange,
  onSubmit,
}: ChooseBankAccountDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <ChooseBankAccountForm
            accounts={accounts}
            error={error}
            isSaving={isSaving}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ChooseBankAccountForm({
  accounts,
  isSaving,
  error,
  onSubmit,
}: Omit<ChooseBankAccountDialogProps, "open" | "onOpenChange">) {
  const [accountUid, setAccountUid] = useState<string | null>(null);

  return (
    <form
      data-testid="bank-account-choice"
      onSubmit={(event) => {
        event.preventDefault();

        if (accountUid !== null) {
          onSubmit(accountUid);
        }
      }}
    >
      <DialogHeader>
        <DialogTitle size="lg">{m.bank_choose_account_title()}</DialogTitle>
        <DialogDescription className="text-pretty text-sm">
          {m.bank_choose_account_description()}
        </DialogDescription>
      </DialogHeader>

      <RadioGroup
        aria-label={m.bank_choose_account_title()}
        className="mt-4"
        onValueChange={(value) => setAccountUid(String(value))}
        value={accountUid}
      >
        {accounts.map((account) => (
          <RadioCard
            description={
              account.ibanLast4 === null ? "" : `IBAN ••${account.ibanLast4}`
            }
            key={account.uid}
            title={account.name ?? m.bank_connection_unnamed_account()}
            value={account.uid}
          />
        ))}
      </RadioGroup>

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
          data-testid="bank-account-choice-submit"
          disabled={accountUid === null || isSaving}
          size="xl"
          type="submit"
        >
          {m.bank_choose_account_submit()}
        </Button>
      </DialogFooter>
    </form>
  );
}
