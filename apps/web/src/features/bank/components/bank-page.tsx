import type { BankAccountData } from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";

import { BankHeader } from "./bank-header";
import { BankKpiTiles } from "./bank-kpi-tiles";
import { BankMovementsCard } from "./bank-movements-card";
import { BankReconciliationPanel } from "./bank-reconciliation-panel";
import { BankStatementsCard } from "./bank-statements-card";

type BankPageProps = {
  data: BankAccountData;
  isRefreshing: boolean;
  /** The suggestion a validate/dismiss request is in flight for. */
  pendingMatchId: number | null;
  onImport: () => void;
  onEditBalance: () => void;
  onValidateMatch: (matchId: number) => void;
  onDismissMatch: (matchId: number) => void;
  onOpenInvoice: (invoiceId: number) => void;
};

export function BankPage({
  data,
  isRefreshing,
  pendingMatchId,
  onImport,
  onEditBalance,
  onValidateMatch,
  onDismissMatch,
  onOpenInvoice,
}: BankPageProps) {
  return (
    <div
      aria-busy={isRefreshing || undefined}
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col gap-4 transition-opacity",
        isRefreshing && "opacity-60",
      )}
    >
      <BankHeader onImport={onImport} />
      <BankKpiTiles data={data} onEditBalance={onEditBalance} />
      <BankReconciliationPanel
        data={data}
        onDismiss={onDismissMatch}
        onImport={onImport}
        onOpenInvoice={onOpenInvoice}
        onValidate={onValidateMatch}
        pendingMatchId={pendingMatchId}
      />
      <BankMovementsCard data={data} />
      <BankStatementsCard data={data} />
    </div>
  );
}
