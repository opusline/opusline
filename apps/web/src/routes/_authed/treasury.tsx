import {
  recordTreasuryTransferMutation,
  showTreasuryOptions,
  showTreasuryQueryKey,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { TreasuryPage } from "@/features/treasury/components/treasury-page";
import { accountTodayCalendarDate } from "@/lib/dates";
import { requireFrenchFiscality } from "@/lib/fiscality";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/treasury")({
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: TreasuryRoute,
});

function TreasuryRoute() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const [saveError, setSaveError] = useState<string | null>(null);

  const treasury = useQuery(showTreasuryOptions());
  const recordTransfer = useMutation(recordTreasuryTransferMutation());

  const handleRecordTransfer = async (input: {
    amountCents: number;
    transferredOn: string;
    note: string | null;
  }) => {
    setSaveError(null);

    try {
      await recordTransfer.mutateAsync({
        body: {
          amount: { amount: input.amountCents, currency: user.currency },
          note: input.note,
          transferredOn: input.transferredOn,
        },
      });
      await queryClient.invalidateQueries({ queryKey: showTreasuryQueryKey() });
    } catch (error) {
      setSaveError(serverErrorMessage(error, m.treasury_save_failed()));
    }
  };

  if (treasury.isPending) {
    return (
      <div className="flex max-w-270 flex-col gap-5">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (treasury.data === undefined) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{m.treasury_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  return (
    <TreasuryPage
      isSaving={recordTransfer.isPending}
      onRecordTransfer={(input) => void handleRecordTransfer(input)}
      saveError={saveError}
      today={accountTodayCalendarDate(user.timezone)}
      treasury={treasury.data}
    />
  );
}
