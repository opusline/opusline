import type { DeclarationsData } from "@opusline/api-client";
import {
  clearDeclarationPaymentMutation,
  markDeclarationFiledMutation,
  recordDeclarationPaymentMutation,
  showDeclarationsOptions,
  showDeclarationsQueryKey,
  unmarkDeclarationFiledMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useToast } from "@opusline/ui/components/toast";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useLocale } from "@/components/money-format-provider";
import {
  DeclarationsPage,
  type DeclarationTarget,
} from "@/features/declarations/components/declarations-page";
import {
  declarationKindLabel,
  declarationPeriodLabel,
} from "@/features/declarations/lib/labels";
import { requireFrenchFiscality } from "@/lib/fiscality";
import { isPeriod, periodKind } from "@/lib/periods";
import { invalidateDeclarationWrites } from "@/lib/query-invalidation";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

type DeclarationsSearch = { period?: string };

export const Route = createFileRoute("/_authed/declarations")({
  validateSearch: (search: Record<string, unknown>): DeclarationsSearch => ({
    period:
      isPeriod(search.period) && periodKind(search.period) === "month"
        ? search.period
        : undefined,
  }),
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: DeclarationsRoute,
});

function DeclarationsRoute() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const locale = useLocale();
  const toast = useToast();

  // A bare URL sends no period: the server answers with the month to file
  // next, so the account's calendar decides, not the browser's.
  const declarations = useQuery({
    ...showDeclarationsOptions(
      search.period === undefined
        ? undefined
        : { query: { period: search.period } },
    ),
    placeholderData: keepPreviousData,
  });

  const [pendingTarget, setPendingTarget] = useState<DeclarationTarget | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  // Every completion write answers with the period it was asked for,
  // recomputed: write it under that period's key (and the bare key a URL
  // without a period reads, when it is the month on screen), then let the
  // journal, the treasury and the deadlines refetch.
  const acceptDeclarations = async (data: DeclarationsData) => {
    queryClient.setQueryData(
      showDeclarationsQueryKey({ query: { period: data.period } }),
      data,
    );

    if (
      search.period === undefined &&
      data.period === declarations.data?.period
    ) {
      queryClient.setQueryData(showDeclarationsQueryKey(), data);
    }

    await invalidateDeclarationWrites(queryClient);
  };

  const completionWrite = {
    onMutate: () => setActionError(null),
    onSuccess: acceptDeclarations,
    onError: (error: unknown) =>
      setActionError(serverErrorMessage(error, m.declarations_action_failed())),
  };
  const markFiled = useMutation({
    ...markDeclarationFiledMutation(),
    ...completionWrite,
  });
  const unmark = useMutation({
    ...unmarkDeclarationFiledMutation(),
    ...completionWrite,
  });
  const markPaid = useMutation({
    ...recordDeclarationPaymentMutation(),
    ...completionWrite,
  });
  const clearPayment = useMutation({
    ...clearDeclarationPaymentMutation(),
    ...completionWrite,
  });

  // The card being written greys its buttons out until its own write settles.
  const track = (target: DeclarationTarget) => {
    setPendingTarget(target);

    return {
      onSettled: () =>
        setPendingTarget((current) => (current === target ? null : current)),
    };
  };

  if (declarations.isPending) {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(22rem,1fr))] gap-4">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const loadFailed = (
    <Alert variant="destructive">
      <AlertDescription>
        {serverErrorMessage(declarations.error, m.declarations_load_failed())}
      </AlertDescription>
    </Alert>
  );

  if (declarations.data === undefined) {
    return loadFailed;
  }

  const period = declarations.data.period;
  const unmarkTarget = (target: DeclarationTarget) =>
    unmark.mutate(
      { path: target, query: { period } },
      {
        ...track(target),
        onSuccess: () => toast.add({ title: m.declarations_unmarked() }),
      },
    );

  return (
    <div className="flex flex-col gap-3.5">
      {/* A failed refetch keeps the last good figures on screen — they are what
          the user came to copy, so the error sits above them. */}
      {declarations.isError && loadFailed}
      {actionError !== null && (
        <Alert variant="destructive">
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      <DeclarationsPage
        data={declarations.data}
        isRefreshing={declarations.isPlaceholderData}
        onClearPayment={(target) =>
          clearPayment.mutate(
            { path: target, query: { period } },
            {
              ...track(target),
              onSuccess: () =>
                toast.add({ title: m.declarations_payment_cleared() }),
            },
          )
        }
        onMarkFiled={(target) =>
          markFiled.mutate(
            { body: { ...target, period } },
            {
              ...track(target),
              onSuccess: () =>
                toast.add({
                  title: m.declarations_marked_filed({
                    kind: declarationKindLabel(target.kind),
                    period: declarationPeriodLabel(locale, target.periodKey),
                  }),
                  tone: "success",
                  action: {
                    label: m.declarations_undo(),
                    onClick: () => unmarkTarget(target),
                  },
                }),
            },
          )
        }
        onMarkPaid={(target) =>
          markPaid.mutate(
            { path: target, body: { period } },
            {
              ...track(target),
              onSuccess: () =>
                toast.add({
                  title: m.declarations_payment_recorded(),
                  tone: "success",
                }),
            },
          )
        }
        onPeriodChange={(next) =>
          navigate({ to: "/declarations", search: { period: next } })
        }
        onUnmark={unmarkTarget}
        pendingTarget={pendingTarget}
      />
    </div>
  );
}
