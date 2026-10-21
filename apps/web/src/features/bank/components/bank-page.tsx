import type { BankAccountData, BankConnectionData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { cn } from "@opusline/ui/lib/utils";
import { PlusIcon } from "lucide-react";

import { m } from "@/paraglide/messages.js";
import type { OlderMovements } from "../lib/use-older-movements";

import { BankAccountsCard } from "./bank-accounts-card";
import { BankConnectionCard } from "./bank-connection-card";
import { BankHeader } from "./bank-header";
import { BankKpiTiles } from "./bank-kpi-tiles";
import { BankMovementsCard } from "./bank-movements-card";
import { BankReconciliationPanel } from "./bank-reconciliation-panel";
import { BankStatementsCard } from "./bank-statements-card";

export type BankConnectionControls = {
  /** The connection a sync request is in flight for. */
  syncingConnectionId: number | null;
  disconnectingConnectionId: number | null;
  /** Null opens a new connection; a connection renews that one. */
  onConnect: (connection: BankConnectionData | null) => void;
  onChooseAccount: (connectionId: number) => void;
  onSync: (connectionId: number) => void;
  onDisconnect: (connectionId: number) => void;
};

type BankPageProps = {
  data: BankAccountData;
  isRefreshing: boolean;
  /** The suggestion a validate/dismiss request is in flight for. */
  pendingMatchId: number | null;
  olderMovements?: OlderMovements;
  connection: BankConnectionControls;
  /** The multi-account beta: a bank next to the connected ones, and the accounts card. */
  canManageAccounts: boolean;
  onImport: () => void;
  /** Null when there is only one account to type a balance for. */
  onEditBalance: (accountId: number | null) => void;
  onEditAccount: (accountId: number) => void;
  onCreateAccount: () => void;
  onValidateMatch: (matchId: number) => void;
  onDismissMatch: (matchId: number) => void;
  onOpenInvoice: (invoiceId: number) => void;
  onUnpairTransfer: (movementId: number) => void;
  /** The movement an undo request is in flight for. */
  unpairingMovementId: number | null;
};

export function BankPage({
  data,
  isRefreshing,
  pendingMatchId,
  olderMovements,
  connection,
  canManageAccounts,
  onImport,
  onEditBalance,
  onEditAccount,
  onCreateAccount,
  onValidateMatch,
  onDismissMatch,
  onOpenInvoice,
  onUnpairTransfer,
  unpairingMovementId,
}: BankPageProps) {
  const canAddConnection =
    canManageAccounts && data.bankSyncConfigured && data.connections.length > 0;

  return (
    <div
      aria-busy={isRefreshing || undefined}
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col gap-4 transition-opacity",
        isRefreshing && "opacity-60",
      )}
    >
      <BankHeader onImport={onImport} />
      {data.connections.length === 0 ? (
        <BankConnectionCard
          bankSyncConfigured={data.bankSyncConfigured}
          connection={null}
          isDisconnecting={false}
          isSyncing={false}
          onChooseAccount={() => undefined}
          onConnect={() => connection.onConnect(null)}
          onDisconnect={() => undefined}
          onSync={() => undefined}
        />
      ) : (
        data.connections.map((bankConnection) => (
          <BankConnectionCard
            bankSyncConfigured={data.bankSyncConfigured}
            connection={bankConnection}
            isDisconnecting={
              connection.disconnectingConnectionId === bankConnection.id
            }
            isSyncing={connection.syncingConnectionId === bankConnection.id}
            key={bankConnection.id}
            onChooseAccount={() =>
              connection.onChooseAccount(bankConnection.id)
            }
            onConnect={() => connection.onConnect(bankConnection)}
            onDisconnect={() => connection.onDisconnect(bankConnection.id)}
            onSync={() => connection.onSync(bankConnection.id)}
          />
        ))
      )}
      {canAddConnection && (
        <Button
          className="self-start"
          data-testid="bank-connection-add"
          onClick={() => connection.onConnect(null)}
          size="lg"
          variant="secondary"
        >
          <PlusIcon aria-hidden data-icon="inline-start" />
          {m.bank_connection_add()}
        </Button>
      )}
      <BankKpiTiles data={data} onEditBalance={() => onEditBalance(null)} />
      {/* Past the beta, an account that already holds several still needs
          somewhere to type each balance. */}
      {(canManageAccounts || data.accounts.length > 1) && (
        <BankAccountsCard
          accounts={data.accounts}
          connections={data.connections}
          isBeta={canManageAccounts}
          onCreateAccount={canManageAccounts ? onCreateAccount : undefined}
          onEditAccount={canManageAccounts ? onEditAccount : undefined}
          onEditBalance={onEditBalance}
        />
      )}
      <BankReconciliationPanel
        data={data}
        onDismiss={onDismissMatch}
        onImport={onImport}
        onOpenInvoice={onOpenInvoice}
        onValidate={onValidateMatch}
        pendingMatchId={pendingMatchId}
      />
      <BankMovementsCard
        data={data}
        olderMovements={olderMovements}
        onUnpairTransfer={onUnpairTransfer}
        unpairingMovementId={unpairingMovementId}
      />
      <BankStatementsCard data={data} />
    </div>
  );
}
