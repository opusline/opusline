import type { BankAccountData, BankImportData } from "@opusline/api-client";
import {
  chooseBankConnectionAccountMutation,
  completeBankConnectionMutation,
  disconnectBankConnectionMutation,
  dismissBankMatchMutation,
  importBankStatementMutation,
  listBankAspspsOptions,
  showBankAccountOptions,
  showBankAccountQueryKey,
  startBankConnectionMutation,
  syncBankConnectionMutation,
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
import { ChooseBankAccountDialog } from "@/features/bank/components/choose-bank-account-dialog";
import { ConnectBankDialog } from "@/features/bank/components/connect-bank-dialog";
import { EditBalanceDialog } from "@/features/bank/components/edit-balance-dialog";
import {
  ImportStatementDialog,
  type ImportStatementSubmit,
} from "@/features/bank/components/import-statement-dialog";
import {
  parseBankCallbackSearch,
  useBankAuthorizationCallback,
} from "@/features/bank/lib/bank-callback";
import { connectionState } from "@/features/bank/lib/connection";
import { useOlderMovements } from "@/features/bank/lib/use-older-movements";
import { requireFrenchFiscality } from "@/lib/fiscality";
import {
  expensesFilter,
  invalidateInvoiceWrites,
  invalidateTreasury,
  operationFilter,
  subscriptionsFilter,
} from "@/lib/query-invalidation";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/bank-account")({
  // The bank sends the browser back here with the authorization's outcome.
  validateSearch: parseBankCallbackSearch,
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: BankRoute,
});

/** What the last import or sync brought in, for the dismissible banner. */
type MovementsResult =
  | { kind: "import"; lineCount: number; suggestionCount: number }
  | { kind: "sync"; importedCount: number; suggestionCount: number };

function BankRoute() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const format = useMoneyFormat();

  const bank = useQuery({
    ...showBankAccountOptions(),
    placeholderData: keepPreviousData,
  });

  const olderMovements = useOlderMovements(bank.data);

  const [importOpen, setImportOpen] = useState(false);
  const [editingBalance, setEditingBalance] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [chooseAccountOpen, setChooseAccountOpen] = useState(false);
  const [importResult, setImportResult] = useState<MovementsResult | null>(
    null,
  );
  const [importError, setImportError] = useState<string | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [chooseAccountError, setChooseAccountError] = useState<string | null>(
    null,
  );

  const aspsps = useQuery({
    ...listBankAspspsOptions(),
    enabled: connectOpen,
    staleTime: 5 * 60_000,
  });

  // Every mutation answers with the freshly computed account summary — writing
  // it straight into the cache spares a second identical GET per action. The
  // loaded older pages derive their running balances from that summary, and a
  // write can move the figures without moving the cursor — refetch them too.
  const acceptSummary = (account: BankAccountData) => {
    queryClient.setQueryData(showBankAccountQueryKey(), account);
    void queryClient.invalidateQueries(operationFilter("listBankMovements"));
  };

  // Validating a suggestion marks an invoice paid, so it owes the same fan-out
  // as any other invoice write.
  const refreshInvoices = () => invalidateInvoiceWrites(queryClient);

  const acceptMovements = async (result: BankImportData) => {
    acceptSummary(result.account);
    // New debits can pair with a subscription's expense or surface as a
    // recurring one to create: the subscriptions read both.
    await Promise.all([
      refreshInvoices(),
      queryClient.invalidateQueries(subscriptionsFilter()),
      queryClient.invalidateQueries(expensesFilter()),
    ]);
  };

  const importStatement = useMutation({
    ...importBankStatementMutation(),
    onMutate: () => setImportError(null),
    onSuccess: async (result) => {
      setImportOpen(false);
      setImportResult({
        kind: "import",
        lineCount: result.lineCount,
        suggestionCount: result.suggestionCount,
      });
      await acceptMovements(result);
    },
    onError: (error) => {
      setImportError(serverErrorMessage(error, m.bank_import_failed()));
    },
  });

  const syncConnection = useMutation({
    ...syncBankConnectionMutation(),
    onMutate: () => setActionError(null),
    onSuccess: async (result) => {
      setImportResult({
        kind: "sync",
        importedCount: result.importedCount,
        suggestionCount: result.suggestionCount,
      });
      await acceptMovements(result);
    },
    onError: async (error) => {
      setActionError(serverErrorMessage(error, m.bank_sync_failed()));
      // A refused sync records why on the connection, which the card shows.
      await queryClient.invalidateQueries({
        queryKey: showBankAccountQueryKey(),
      });
    },
  });

  const startConnection = useMutation({
    ...startBankConnectionMutation(),
    onMutate: () => setConnectError(null),
    // The bank's own pages take over from here; it sends the browser back
    // to this route with the outcome in the query string.
    onSuccess: ({ url }) => window.location.assign(url),
    onError: (error) => {
      setConnectError(serverErrorMessage(error, m.bank_connect_failed()));
    },
  });

  const clearBankCallback = () =>
    navigate({ to: "/bank-account", search: {}, replace: true });

  const completeConnection = useMutation({
    ...completeBankConnectionMutation(),
    onMutate: () => setActionError(null),
    onSuccess: (account) => {
      acceptSummary(account);
      void clearBankCallback();

      const state = connectionState(account);

      if (state === "active") {
        syncConnection.mutate({});
      } else if (state === "awaiting-account") {
        setChooseAccountOpen(true);
      }
    },
    onError: (error) => {
      setActionError(
        serverErrorMessage(error, m.bank_connection_complete_failed()),
      );
      void clearBankCallback();
    },
  });

  useBankAuthorizationCallback(search, {
    complete: (body) => completeConnection.mutate({ body }),
    cancel: () => {
      setActionError(m.bank_connection_cancelled());
      void clearBankCallback();
    },
    // The first send is still being answered: show what it made of the
    // connection rather than a failure the replay would report.
    replayed: () => {
      void clearBankCallback();
      void queryClient.invalidateQueries({
        queryKey: showBankAccountQueryKey(),
      });
    },
  });

  const chooseAccount = useMutation({
    ...chooseBankConnectionAccountMutation(),
    onMutate: () => setChooseAccountError(null),
    onSuccess: (account) => {
      setChooseAccountOpen(false);
      acceptSummary(account);
      syncConnection.mutate({});
    },
    onError: (error) => {
      setChooseAccountError(
        serverErrorMessage(error, m.bank_choose_account_failed()),
      );
    },
  });

  const disconnect = useMutation({
    ...disconnectBankConnectionMutation(),
    onMutate: () => setActionError(null),
    onSuccess: acceptSummary,
    onError: (error) => {
      setActionError(
        serverErrorMessage(error, m.bank_connection_disconnect_failed()),
      );
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
              {importResult.kind === "import"
                ? m.bank_import_success_lines({ count: importResult.lineCount })
                : m.bank_sync_success({ count: importResult.importedCount })}
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
        olderMovements={olderMovements}
        connection={{
          isSyncing: syncConnection.isPending || completeConnection.isPending,
          isDisconnecting: disconnect.isPending,
          onConnect: () => {
            setConnectError(null);
            setConnectOpen(true);
          },
          onChooseAccount: () => {
            setChooseAccountError(null);
            setChooseAccountOpen(true);
          },
          onSync: () => syncConnection.mutate({}),
          onDisconnect: () => disconnect.mutate({}),
        }}
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

      <ConnectBankDialog
        banks={aspsps.data?.aspsps}
        defaultBankName={bank.data.connection?.aspspName ?? null}
        error={
          connectError ??
          (aspsps.isError
            ? serverErrorMessage(aspsps.error, m.bank_connect_banks_failed())
            : null)
        }
        isStarting={startConnection.isPending || startConnection.isSuccess}
        onOpenChange={(open) => {
          if (!open) {
            setConnectOpen(false);
            setConnectError(null);
            // A success only means the browser was sent to the bank; coming
            // back through history must find the dialog usable again.
            startConnection.reset();
          }
        }}
        onSubmit={(body) => startConnection.mutate({ body })}
        open={connectOpen}
      />

      <ChooseBankAccountDialog
        accounts={bank.data.connection?.accounts ?? []}
        error={chooseAccountError}
        isSaving={chooseAccount.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setChooseAccountOpen(false);
            setChooseAccountError(null);
          }
        }}
        onSubmit={(accountUid) =>
          chooseAccount.mutate({ body: { accountUid } })
        }
        open={chooseAccountOpen}
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
