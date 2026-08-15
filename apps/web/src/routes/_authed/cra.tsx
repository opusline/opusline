import type { CraDetailData } from "@opusline/api-client";
import { client as apiClient } from "@opusline/api-client/client";
import {
  createCraMutation,
  listCrasOptions,
  listCrasQueryKey,
  reopenCraMutation,
  resetCraMutation,
  sendCraMutation,
  showCraOptions,
  showCraQueryKey,
  showSettingsOptions,
  updateCraDaysMutation,
  uploadSignedCraMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import type { QueryClient } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { CraPage } from "@/features/cra/components/cra-page";
import { type CraStep, isCraStep } from "@/features/cra/lib/cra-steps";
import { signatureHref } from "@/features/settings/lib/signature";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

type CraSearch = { cra?: number; step?: CraStep };

export const Route = createFileRoute("/_authed/cra")({
  validateSearch: (search: Record<string, unknown>): CraSearch => ({
    cra: typeof search.cra === "number" ? search.cra : undefined,
    step: isCraStep(search.step) ? search.step : undefined,
  }),
  component: CraRoute,
});

/**
 * Fold a sparse day payload back onto the cached CRA, which carries every day of the
 * month. Days the payload leaves out were cleared, so they go to zero.
 *
 * The totals are deliberately left to the refetch: the API owns the money, and the
 * screen has never claimed to recompute it.
 */
function applyDaysToCache(
  queryClient: QueryClient,
  cra: number,
  days: { date: string; dayFractionBp: number }[],
) {
  const written = new Map(days.map((day) => [day.date, day.dayFractionBp]));

  queryClient.setQueryData<CraDetailData>(
    showCraQueryKey({ path: { cra } }),
    (current) =>
      current === undefined
        ? current
        : {
            ...current,
            cra: {
              ...current.cra,
              days: current.cra.days.map((day) => ({
                ...day,
                dayFractionBp: written.get(day.date) ?? 0,
              })),
            },
          },
  );
}

function CraRoute() {
  const search = Route.useSearch();
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingDates, setPendingDates] = useState<Set<string>>(new Set());
  // Owned here rather than in the page: the upload that closes it is a mutation, and
  // the mutation is what knows whether it succeeded.
  const [isSignedReturnOpen, setIsSignedReturnOpen] = useState(false);

  const cras = useQuery(listCrasOptions());
  const settings = useQuery(showSettingsOptions());
  const detail = useQuery({
    ...showCraOptions({ path: { cra: search.cra ?? 0 } }),
    enabled: search.cra !== undefined,
  });

  const step = search.step ?? "days";

  /**
   * The list carries the counters and the open CRA carries the grid, so a write that
   * touches either has to refresh both.
   */
  const refreshCras = async () => {
    const refreshing = [
      queryClient.invalidateQueries({ queryKey: listCrasQueryKey() }),
    ];

    if (search.cra !== undefined) {
      refreshing.push(
        queryClient.invalidateQueries({
          queryKey: showCraQueryKey({ path: { cra: search.cra } }),
        }),
      );
    }

    await Promise.all(refreshing);
  };

  /** Every write reports through one message, wherever it was triggered. */
  const reportFailure = (fallback: string) => (caught: unknown) => {
    setError(serverErrorMessage(caught, fallback));
  };

  /** The dialog keeps its own channel, so a failed upload is shown where it happened. */
  const reportUploadFailure = (caught: unknown) => {
    setUploadError(serverErrorMessage(caught, m.cra_error_upload()));
  };

  const create = useMutation({
    ...createCraMutation(),
    onMutate: () => setError(null),
    onError: reportFailure(m.cra_error_open()),
  });
  /**
   * The grid writes a whole snapshot, and the snapshot is derived from the cached CRA.
   * Without applying the write to that cache straight away, a second click lands before
   * the refetch and rebuilds its snapshot from data that predates the first — silently
   * dropping the day the user just entered.
   */
  const updateDays = useMutation({
    ...updateCraDaysMutation(),
    onMutate: ({ path, body }) => {
      setError(null);
      applyDaysToCache(queryClient, path.cra, body.days);
    },
    // onSettled, not onSuccess: after a refused write the optimistic cache is a
    // lie, and the grid must not keep showing the day the server rejected next
    // to the error banner. The refetch restores the server's truth either way.
    onSettled: refreshCras,
    onError: reportFailure(m.common_save_failed()),
  });
  const reset = useMutation({
    ...resetCraMutation(),
    onMutate: () => setError(null),
    onSuccess: refreshCras,
    onError: reportFailure(m.cra_error_reset()),
  });
  const send = useMutation({
    ...sendCraMutation(),
    onMutate: () => setError(null),
    onSuccess: refreshCras,
    onError: reportFailure(m.cra_error_send()),
  });
  const reopen = useMutation({
    ...reopenCraMutation(),
    onMutate: () => setError(null),
    onSuccess: refreshCras,
    onError: reportFailure(m.cra_error_reopen()),
  });
  const uploadSignedReturn = useMutation({
    ...uploadSignedCraMutation(),
    onMutate: () => setUploadError(null),
    onSuccess: async () => {
      setIsSignedReturnOpen(false);
      await refreshCras();
    },
    onError: reportUploadFailure,
  });

  const openCra = search.cra;

  const writeDays = async (
    days: { date: string; dayFractionBp: number }[],
    touched: string[] = [],
  ) => {
    if (openCra === undefined) {
      return;
    }

    setPendingDates(new Set(touched));

    try {
      await updateDays.mutateAsync({ path: { cra: openCra }, body: { days } });
    } catch {
      // reportFailure has already put the message on screen.
    } finally {
      setPendingDates(new Set());
    }
  };

  /**
   * A month still owed has no row behind it, so opening it creates one first and then
   * follows it. Listing never writes; only opening does.
   */
  const pick: React.ComponentProps<typeof CraPage>["onPick"] = async (item) => {
    setError(null);

    if (item.id !== null) {
      void navigate({
        search: { ...search, cra: item.id, step: undefined },
        to: "/cra",
      });

      return;
    }

    try {
      const created = await create.mutateAsync({
        body: { missionId: item.missionId, month: item.month },
      });

      await refreshCras();
      void navigate({
        search: { ...search, cra: created.cra.id, step: undefined },
        to: "/cra",
      });
    } catch {
      // reportFailure has already put the message on screen.
    }
  };

  /** Let the generated client serialize the flag rather than spelling its wire form here. */
  const downloadHref = (cra: number, applySignature: boolean) =>
    apiClient.buildUrl({
      url: "/cras/{cra}/pdf",
      path: { cra },
      query: { applySignature },
    });

  const isPending = cras.isPending || settings.isPending;
  const isBusy =
    updateDays.isPending ||
    reset.isPending ||
    send.isPending ||
    reopen.isPending ||
    uploadSignedReturn.isPending ||
    create.isPending;

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (cras.isError || settings.isError || settings.data === undefined) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{m.cra_error_load()}</AlertDescription>
      </Alert>
    );
  }

  return (
    <CraPage
      counts={cras.data?.counts ?? { toProduce: 0, sent: 0, signed: 0 }}
      detail={detail.data ?? null}
      // A CRA that will not load has to say so: the column it fills is otherwise just
      // empty, and the URL keeps pointing at it.
      error={error ?? (detail.isError ? m.cra_error_detail() : null)}
      isSignedReturnOpen={isSignedReturnOpen}
      onSignedReturnOpenChange={setIsSignedReturnOpen}
      isBusy={isBusy}
      isDetailPending={detail.isPending && search.cra !== undefined}
      issuerFallbackName={user.name}
      items={cras.data?.cras ?? []}
      onDaysChange={(days, touched) => void writeDays(days, touched)}
      onDownload={(applySignature) => {
        if (openCra !== undefined) {
          window.open(
            downloadHref(openCra, applySignature),
            "_blank",
            "noopener",
          );
        }
      }}
      onGoToClients={() => void navigate({ to: "/clients" })}
      onOpenSignatureSettings={() =>
        void navigate({ search: { tab: "signature" }, to: "/settings" })
      }
      onPick={pick}
      onReopen={() => {
        if (openCra !== undefined) {
          reopen.mutate({ path: { cra: openCra } });
        }
      }}
      onReset={() => {
        if (openCra !== undefined) {
          reset.mutate({ path: { cra: openCra } });
        }
      }}
      onSend={(applySignature) => {
        if (openCra !== undefined) {
          send.mutate({ path: { cra: openCra }, body: { applySignature } });
        }
      }}
      onStepChange={(next) =>
        void navigate({ search: { ...search, step: next }, to: "/cra" })
      }
      onUploadSignedReturn={(file) => {
        if (openCra !== undefined) {
          uploadSignedReturn.mutate({
            path: { cra: openCra },
            body: { file },
          });
        }
      }}
      pendingDates={pendingDates}
      settings={settings.data}
      signatureSrc={signatureHref()}
      step={step}
      uploadError={uploadError}
    />
  );
}
