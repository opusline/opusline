import type { BankAccountData } from "@opusline/api-client";
import {
  dismissBankMatchMutation,
  importBankStatementMutation,
  showBankAccountOptions,
  showBankAccountQueryKey,
  updateBankBalanceMutation,
  validateBankMatchMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Skeleton } from "@opusline/ui/components/skeleton";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { XIcon } from "lucide-react";
import { useState } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { BankPage } from "@/features/bank/components/bank-page";
import { EditBalanceDialog } from "@/features/bank/components/edit-balance-dialog";
import {
  ImportStatementDialog,
  type ImportStatementSubmit,
} from "@/features/bank/components/import-statement-dialog";
import { requireFrenchFiscality } from "@/lib/fiscality";
import {
  invalidateInvoiceWrites,
  invalidateTreasury,
} from "@/lib/query-invalidation";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/bank-account")({
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: BankRoute,
});

type ImportResult = { lineCount: number; suggestionCount: number };

function BankRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const format = useMoneyFormat();

  const bank = useQuery({
    ...showBankAccountOptions(),
    placeholderData: keepPreviousData,
  });

  const [importOpen, setImportOpen] = useState(false);
  const [editingBalance, setEditingBalance] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Every mutation answers with the freshly computed account summary — writing
  // it straight into the cache spares a second identical GET per action.
  const acceptSummary = (account: BankAccountData) => {
    queryClient.setQueryData(showBankAccountQueryKey(), account);
  };

  // Validating a suggestion marks an invoice paid, so it owes the same fan-out
  // as any other invoice write.
  const refreshInvoices = () => invalidateInvoiceWrites(queryClient);

  const importStatement = useMutation({
    ...importBankStatementMutation(),
    onMutate: () => setImportError(null),
    onSuccess: async (result) => {
      setImportOpen(false);
      setImportResult({
        lineCount: result.lineCount,
        suggestionCount: result.suggestionCount,
      });
      acceptSummary(result.account);
      await refreshInvoices();
    },
    onError: (error) => {
      setImportError(serverErrorMessage(error, m.bank_import_failed()));
    },
  });

  const updateBalance = useMutation({
    ...updateBankBalanceMutation(),
    onMutate: () => setBalanceError(null),
    onSuccess: async (account) => {
      setEditingBalance(false);
      acceptSummary(account);
      // The balance is the Virement figure's starting point; the other writes
      // here go through invalidateInvoiceWrites, which already carries it.
      await invalidateTreasury(queryClient);
    },
    onError: (error) => {
      setBalanceError(serverErrorMessage(error, m.bank_balance_save_failed()));
    },
  });

  const validate = useMutation({
    ...validateBankMatchMutation(),
    onMutate: () => setActionError(null),
    onSuccess: async (account) => {
      acceptSummary(account);
      await refreshInvoices();
    },
    onError: (error) => {
      setActionError(serverErrorMessage(error, m.bank_validate_failed()));
    },
  });

  const dismiss = useMutation({
    ...dismissBankMatchMutation(),
    onMutate: () => setActionError(null),
    onSuccess: acceptSummary,
    onError: (error) => {
      setActionError(serverErrorMessage(error, m.bank_dismiss_failed()));
    },
  });

  const pendingMatchId = validate.isPending
    ? (validate.variables?.path.match ?? null)
    : dismiss.isPending
      ? (dismiss.variables?.path.match ?? null)
      : null;

  const submitImport = ({ file, balanceCents }: ImportStatementSubmit) => {
    importStatement.mutate({
      body: {
        file,
        balanceAmount: balanceCents ?? undefined,
        balanceCurrency: balanceCents === null ? undefined : format.currency,
      },
    });
  };

  if (bank.isPending) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (bank.data === undefined) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{m.bank_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {/* A failed refetch keeps the last good figures on screen. */}
      {bank.isError && (
        <Alert variant="destructive">
          <AlertDescription>{m.bank_load_failed()}</AlertDescription>
        </Alert>
      )}
      {actionError !== null && (
        <Alert variant="destructive">
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}
      {importResult !== null && (
        <Alert variant="brand">
          <AlertDescription className="flex items-center gap-2">
            <span>
              {m.bank_import_success_lines({ count: importResult.lineCount })}
              {" · "}
              {m.bank_import_success_suggestions({
                count: importResult.suggestionCount,
              })}
            </span>
            <Button
              aria-label={m.bank_import_success_dismiss_aria()}
              className="ml-auto"
              onClick={() => setImportResult(null)}
              size="icon-sm"
              variant="ghost"
            >
              <XIcon aria-hidden />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <BankPage
        data={bank.data}
        isRefreshing={bank.isPlaceholderData}
        onDismissMatch={(matchId) =>
          dismiss.mutate({ path: { match: matchId } })
        }
        onEditBalance={() => setEditingBalance(true)}
        onImport={() => {
          setImportError(null);
          setImportResult(null);
          setImportOpen(true);
        }}
        onOpenInvoice={(invoiceId) =>
          navigate({ to: "/invoices", search: { invoice: invoiceId } })
        }
        onValidateMatch={(matchId) =>
          validate.mutate({ path: { match: matchId } })
        }
        pendingMatchId={pendingMatchId}
      />

      <ImportStatementDialog
        error={importError}
        isSaving={importStatement.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setImportOpen(false);
            setImportError(null);
          }
        }}
        onSubmit={submitImport}
        open={importOpen}
      />

      <EditBalanceDialog
        balance={bank.data.balance?.amount ?? null}
        error={balanceError}
        isSaving={updateBalance.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setEditingBalance(false);
            setBalanceError(null);
          }
        }}
        onSubmit={(cents) =>
          updateBalance.mutate({
            body: { balance: { amount: cents, currency: format.currency } },
          })
        }
        open={editingBalance}
      />
    </div>
  );
}
