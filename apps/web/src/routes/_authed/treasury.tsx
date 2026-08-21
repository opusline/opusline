import type { TreasuryData } from "@opusline/api-client";
import {
  createPersonalTransferMutation,
  deletePersonalTransferMutation,
  showTreasuryOptions,
  showTreasuryQueryKey,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { RecordTransferDialog } from "@/features/treasury/components/record-transfer-dialog";
import { TreasuryPage } from "@/features/treasury/components/treasury-page";
import { accountTodayCalendarDate } from "@/lib/dates";
import { requireFrenchFiscality } from "@/lib/fiscality";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/treasury")({
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: VirementRoute,
});

function VirementRoute() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const format = useMoneyFormat();

  const treasury = useQuery({
    ...showTreasuryOptions(),
    placeholderData: keepPreviousData,
  });

  const [recordOpen, setRecordOpen] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Both writes answer with the freshly computed treasury — writing it straight
  // into the cache spares a second identical GET, and the sidebar tile reads
  // the same key.
  const acceptTreasury = (data: TreasuryData) => {
    queryClient.setQueryData(showTreasuryQueryKey(), data);
  };

  const record = useMutation({
    ...createPersonalTransferMutation(),
    onMutate: () => setRecordError(null),
    onSuccess: (data) => {
      setRecordOpen(false);
      acceptTreasury(data);
    },
    onError: (error) => {
      setRecordError(serverErrorMessage(error, m.treasury_record_failed()));
    },
  });

  const remove = useMutation({
    ...deletePersonalTransferMutation(),
    onMutate: () => setDeleteError(null),
    onSuccess: acceptTreasury,
    onError: (error) => {
      setDeleteError(serverErrorMessage(error, m.treasury_delete_failed()));
    },
  });

  if (treasury.isPending) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3.5">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const loadFailed = (
    <Alert variant="destructive">
      <AlertDescription>{m.treasury_load_failed()}</AlertDescription>
    </Alert>
  );

  if (treasury.data === undefined) {
    return loadFailed;
  }

  // The API sets these two together, and TreasuryPage renders the hero — which
  // carries the record button — off the first. Reading both here keeps the
  // button and the dialog it opens from ever disagreeing.
  const { balance, coveredThrough } = treasury.data;
  const canRecord = balance !== null && coveredThrough !== null;

  return (
    <div className="flex flex-col gap-3.5">
      {/* A failed refetch keeps the last good figures on screen. */}
      {treasury.isError && loadFailed}
      {deleteError !== null && (
        <Alert variant="destructive">
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      <TreasuryPage
        data={treasury.data}
        deletingTransferId={
          remove.isPending ? (remove.variables?.path.transfer ?? null) : null
        }
        isRefreshing={treasury.isPlaceholderData}
        onDeleteTransfer={(transferId) =>
          remove.mutate({ path: { transfer: transferId } })
        }
        onRecord={() => setRecordOpen(true)}
      />

      {canRecord && (
        <RecordTransferDialog
          accountToday={accountTodayCalendarDate(user.timezone)}
          coveredThrough={coveredThrough}
          error={recordError}
          isSaving={record.isPending}
          onOpenChange={(open) => {
            if (!open) {
              setRecordOpen(false);
              setRecordError(null);
            }
          }}
          onSubmit={({ amountCents, transferredOn, note }) =>
            record.mutate({
              body: {
                amount: { amount: amountCents, currency: format.currency },
                transferredOn,
                note,
              },
            })
          }
          open={recordOpen}
        />
      )}
    </div>
  );
}
