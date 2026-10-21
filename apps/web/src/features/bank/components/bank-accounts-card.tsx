import type {
  BankAccountEntryData,
  BankConnectionData,
} from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import { PencilIcon, PlusIcon, Settings2Icon, WalletIcon } from "lucide-react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { bankBalanceSubLabel, bankBalanceTileValue } from "@/lib/bank";
import { m } from "@/paraglide/messages.js";
import { bankAccountName } from "../lib/connection";

type BankAccountsCardProps = {
  accounts: BankAccountEntryData[];
  connections: BankConnectionData[];
  /** Marks the card while several accounts are still a beta. */
  isBeta: boolean;
  onEditBalance: (accountId: number) => void;
  /** Renaming and closing belong to the multi-account beta; absent, the button is too. */
  onEditAccount?: (accountId: number) => void;
  /** Opening an account fed by files only; also part of the beta. */
  onCreateAccount?: () => void;
};

/** Each bank account's own balance, beside the total the tiles show. */
export function BankAccountsCard({
  accounts,
  connections,
  isBeta,
  onEditBalance,
  onEditAccount,
  onCreateAccount,
}: BankAccountsCardProps) {
  return (
    <section
      className="rounded-md border bg-card p-5"
      data-testid="bank-accounts-card"
    >
      <div className="flex items-center gap-2">
        <h2 className={eyebrowVariants()}>{m.bank_accounts_title()}</h2>
        {isBeta && (
          <Badge data-testid="bank-accounts-beta" variant="brand">
            {m.beta_badge()}
          </Badge>
        )}
        {onCreateAccount !== undefined && (
          <Button
            className="ml-auto"
            data-testid="bank-account-create"
            onClick={onCreateAccount}
            size="sm"
            variant="ghost"
          >
            <PlusIcon aria-hidden data-icon="inline-start" />
            {m.bank_account_create()}
          </Button>
        )}
      </div>
      <div className="mt-1.5">
        {accounts.map((account) => (
          <AccountRow
            account={account}
            key={account.id}
            name={bankAccountName(account, connections)}
            onEditAccount={
              onEditAccount === undefined
                ? undefined
                : () => onEditAccount(account.id)
            }
            onEditBalance={() => onEditBalance(account.id)}
          />
        ))}
      </div>
    </section>
  );
}

function AccountRow({
  account,
  name,
  onEditBalance,
  onEditAccount,
}: {
  account: BankAccountEntryData;
  name: string;
  onEditBalance: () => void;
  onEditAccount: (() => void) | undefined;
}) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  return (
    <div
      className="flex flex-wrap items-center gap-3.5 border-secondary border-t py-3 first:border-t-0"
      data-account={account.id}
      data-archived={account.isArchived}
      data-testid="bank-account-row"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <WalletIcon aria-hidden className="size-3.5 text-muted-foreground-2" />
      </span>
      <div className="min-w-0 flex-1 basis-40">
        <div className="flex items-center gap-2 truncate text-foreground-2 text-sm">
          {name}
          {account.isArchived && (
            <Badge variant="quiet">{m.bank_account_archived_badge()}</Badge>
          )}
        </div>
        <div className="mt-0.5 text-muted-foreground-3 text-xs">
          {bankBalanceSubLabel(dateFormat, account.balance)}
        </div>
      </div>
      <span
        className="shrink-0 font-mono text-foreground-hi text-sm"
        data-amount-cents={account.balance?.amount.amount}
      >
        {bankBalanceTileValue(format, account.balance)}
      </span>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          aria-label={m.bank_account_balance_edit_aria({ name })}
          data-testid="bank-account-balance-edit"
          onClick={onEditBalance}
          size="icon-sm"
          variant="ghost"
        >
          <PencilIcon aria-hidden />
        </Button>
        {onEditAccount !== undefined && (
          <Button
            aria-label={m.bank_account_edit_aria({ name })}
            data-testid="bank-account-edit"
            onClick={onEditAccount}
            size="icon-sm"
            variant="ghost"
          >
            <Settings2Icon aria-hidden />
          </Button>
        )}
      </div>
    </div>
  );
}
