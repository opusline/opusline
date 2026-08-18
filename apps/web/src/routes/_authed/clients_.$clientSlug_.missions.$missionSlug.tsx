import type {
  MissionBillingStepData,
  MissionStatus,
  UpdateMissionData,
} from "@opusline/api-client";
import {
  createInvoiceMutation,
  createMissionBillingStepMutation,
  deleteMissionBillingStepMutation,
  deleteMissionDocumentMutation,
  listClientsQueryKey,
  listInvoicesOptions,
  listMissionBillingStepsOptions,
  listMissionBillingStepsQueryKey,
  listMissionDocumentsOptions,
  listMissionDocumentsQueryKey,
  listMissionTimeEntriesOptions,
  markMissionBillingStepReadyMutation,
  showClientOptions,
  showMissionBillingOptions,
  showMissionOptions,
  showMissionQueryKey,
  showMissionRevenueOptions,
  showNextInvoiceNumberOptions,
  updateMissionMutation,
  uploadMissionDocumentMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { DocumentsTab } from "@/components/documents-tab";
import { useMoneyFormat } from "@/components/money-format-provider";
import {
  CreateInvoiceDialog,
  type CreateInvoiceSubmit,
} from "@/features/invoices/components/create-invoice-dialog";
import { MissionInvoicesTab } from "@/features/invoices/components/mission-invoices-tab";
import {
  createInvoiceBody,
  type InvoicePrefill,
  prefillFromForfait,
} from "@/features/invoices/lib/invoice-prefill";
import { MissionBillingSchedule } from "@/features/missions/components/mission-billing-schedule";
import { MissionDetailPage } from "@/features/missions/components/mission-detail-page";
import { accountTodayCalendarDate } from "@/lib/dates";
import {
  documentHandlers,
  isClientDocument,
  missionDocumentDownloadHref,
} from "@/lib/documents";
import { isFixedPrice } from "@/lib/durations";
import type { FormSubmitResult } from "@/lib/form";
import { invalidateInvoiceWrites } from "@/lib/query-invalidation";
import { serverErrorMessage, serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute(
  "/_authed/clients_/$clientSlug_/missions/$missionSlug",
)({
  component: MissionDetailRoute,
});

function MissionDetailRoute() {
  const { clientSlug, missionSlug } = Route.useParams();
  const { user } = Route.useRouteContext();
  const format = useMoneyFormat();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [creatingFor, setCreatingFor] = useState<InvoicePrefill | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const missionPath = { client: clientSlug, mission: missionSlug };
  const clientQuery = useQuery(
    showClientOptions({ path: { client: clientSlug } }),
  );
  const missionQuery = useQuery(showMissionOptions({ path: missionPath }));
  const documentsQuery = useQuery(
    listMissionDocumentsOptions({ path: missionPath }),
  );
  const revenueQuery = useQuery(
    showMissionRevenueOptions({ path: missionPath }),
  );
  const billingQuery = useQuery(
    showMissionBillingOptions({ path: missionPath }),
  );
  const entriesQuery = useQuery(
    listMissionTimeEntriesOptions({ path: missionPath }),
  );
  const invoicesQuery = useQuery({
    ...listInvoicesOptions({ query: { missionId: missionQuery.data?.id } }),
    // Without the mission the filter is dropped and the request fetches the whole
    // account's invoices, under a key the filtered one then replaces.
    enabled: missionQuery.data !== undefined,
  });
  const nextNumberQuery = useQuery({
    ...showNextInvoiceNumberOptions(),
    enabled: creatingFor !== null,
  });
  const scheduleQuery = useQuery({
    ...listMissionBillingStepsOptions({ path: missionPath }),
    // Only a fixed price can carry one, and the API refuses the rest.
    enabled:
      missionQuery.data !== undefined &&
      isFixedPrice(missionQuery.data.billingMode),
  });

  const updateMission = useMutation(updateMissionMutation());
  const [isMutating, setIsMutating] = useState(false);
  const inFlightMutations = useRef(0);

  const beginMutation = (): boolean => {
    if (inFlightMutations.current > 0) {
      return false;
    }

    inFlightMutations.current += 1;
    setIsMutating(true);

    return true;
  };

  const endMutation = () => {
    inFlightMutations.current -= 1;

    if (inFlightMutations.current === 0) {
      setIsMutating(false);
    }
  };
  const uploadDocument = useMutation(uploadMissionDocumentMutation());
  const deleteDocument = useMutation(deleteMissionDocumentMutation());

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: showMissionQueryKey({ path: missionPath }),
      }),
      queryClient.invalidateQueries({
        queryKey: showClientOptions({ path: { client: clientSlug } }).queryKey,
      }),
      queryClient.invalidateQueries({ queryKey: listClientsQueryKey() }),
    ]);
  };

  const invalidateDocuments = async () => {
    await queryClient.invalidateQueries({
      queryKey: listMissionDocumentsQueryKey({ path: missionPath }),
    });
  };

  const handleUpdate = async (
    body: UpdateMissionData,
  ): Promise<FormSubmitResult> => {
    if (!beginMutation()) {
      return { status: "failed" };
    }

    try {
      await updateMission.mutateAsync({ body, path: missionPath });
      await invalidate();
      return { status: "success" };
    } catch (error) {
      const fieldErrors = serverFieldErrors(error);

      return fieldErrors
        ? { status: "invalid", fieldErrors }
        : { status: "failed" };
    } finally {
      endMutation();
    }
  };

  const handleSetStatus = async (status: MissionStatus) => {
    const mission = missionQuery.data;

    if (mission === undefined || !beginMutation()) {
      return;
    }

    try {
      await updateMission.mutateAsync({
        body: {
          name: mission.name,
          billingMode: mission.billingMode,
          status,
          rate: mission.rate,
          rounding: mission.rounding,
          craRequired: mission.craRequired,
          endClientName: mission.endClientName,
          color: mission.color,
          notes: mission.notes,
          startDate: mission.startDate,
          endDate: mission.endDate,
        },
        path: missionPath,
      });
      await invalidate();
    } catch {
      // Surfaced through updateMission.error below.
    } finally {
      endMutation();
    }
  };

  const refreshSchedule = async () => {
    await queryClient.invalidateQueries({
      queryKey: listMissionBillingStepsQueryKey({ path: missionPath }),
    });
  };

  const createInvoice = useMutation({
    ...createInvoiceMutation(),
    onSuccess: async () => {
      setCreatingFor(null);
      setCreateError(null);
      await invalidateInvoiceWrites(queryClient, [
        // Billing an instalment stamps it, so the schedule row flips to invoiced.
        refreshSchedule(),
        queryClient.invalidateQueries({ queryKey: listClientsQueryKey() }),
      ]);
    },
    onError: (error) => {
      setCreateError(serverErrorMessage(error, m.invoices_create_failed()));
    },
  });

  /** Every schedule write reports the same way and refetches the same list. */
  const scheduleWrite = {
    onMutate: () => setScheduleError(null),
    onSuccess: refreshSchedule,
    onError: (error: unknown) =>
      setScheduleError(
        serverErrorMessage(error, m.missions_schedule_save_failed()),
      ),
  };

  const addStep = useMutation({
    ...createMissionBillingStepMutation(),
    ...scheduleWrite,
  });
  const deleteStep = useMutation({
    ...deleteMissionBillingStepMutation(),
    ...scheduleWrite,
  });
  const setStepReady = useMutation({
    ...markMissionBillingStepReadyMutation(),
    ...scheduleWrite,
  });

  const submitInvoice = (input: CreateInvoiceSubmit) => {
    setCreateError(null);
    createInvoice.mutate({
      body: createInvoiceBody(input, format.currency),
    });
  };

  const {
    handleUpload: handleUploadDocument,
    handleDelete: handleDeleteDocument,
  } = documentHandlers({
    upload: (file, category, fileName) =>
      uploadDocument.mutateAsync({
        body: { file, category, fileName },
        path: missionPath,
      }),
    remove: (document) =>
      deleteDocument.mutateAsync({
        path: { ...missionPath, document: document.id },
      }),
    invalidate: invalidateDocuments,
  });

  if (clientQuery.isPending || missionQuery.isPending) {
    return (
      <div className="flex max-w-270 flex-col gap-5">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-22 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (
    clientQuery.isError ||
    missionQuery.isError ||
    clientQuery.data === undefined ||
    missionQuery.data === undefined
  ) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{m.missions_load_one_failed()}</AlertDescription>
      </Alert>
    );
  }

  const documentsTab = documentsQuery.isPending ? (
    <Skeleton className="h-40 w-full" />
  ) : documentsQuery.data === undefined ? (
    <Alert variant="destructive">
      <AlertDescription>{m.documents_load_failed()}</AlertDescription>
    </Alert>
  ) : (
    <DocumentsTab
      canRemove={(document) => !isClientDocument(document)}
      documents={documentsQuery.data.documents}
      downloadHref={(document) =>
        missionDocumentDownloadHref(clientSlug, missionSlug, document)
      }
      emptyLabel={m.missions_documents_empty()}
      onDelete={handleDeleteDocument}
      onUpload={handleUploadDocument}
      showSourceBadge
    />
  );

  const mission = missionQuery.data;
  const progress = billingQuery.data ?? null;
  /**
   * Both ways onto a forfait open the same dialog; the schedule only says which
   * instalment is being billed, and the factory decides what that changes.
   */
  const openForfaitInvoice = (step?: MissionBillingStepData) => {
    if (progress === null) {
      return;
    }

    setCreateError(null);
    setCreatingFor(
      prefillFromForfait({
        clientId: mission.clientId,
        clientName: clientQuery.data.name,
        missionId: mission.id,
        missionName: mission.name,
        progress,
        vatRateBp: clientQuery.data.defaultVatRateBp ?? user.effectiveVatRateBp,
        step,
      }),
    );
  };

  const invoicesTab = (
    <div className="flex flex-col gap-5">
      {progress !== null && (
        <MissionBillingSchedule
          steps={scheduleQuery.data?.steps ?? []}
          scheduledCents={scheduleQuery.data?.scheduled.amount ?? 0}
          fixedPrice={progress.fixedPrice}
          isPending={scheduleQuery.isPending}
          isError={scheduleQuery.isError}
          isSaving={
            addStep.isPending || deleteStep.isPending || setStepReady.isPending
          }
          error={scheduleError}
          onAdd={(body) => addStep.mutate({ body, path: missionPath })}
          onDelete={(stepId) =>
            deleteStep.mutate({
              path: { ...missionPath, billingStep: stepId },
            })
          }
          onSetReady={(stepId, isReady) =>
            setStepReady.mutate({
              body: { isReady },
              path: { ...missionPath, billingStep: stepId },
            })
          }
          onBill={(step) => openForfaitInvoice(step)}
        />
      )}

      <MissionInvoicesTab
        accountToday={accountTodayCalendarDate(user.timezone)}
        invoices={invoicesQuery.data?.invoices ?? []}
        isError={invoicesQuery.isError}
        isPending={invoicesQuery.isPending}
        mission={mission}
        onCreateInvoice={() => openForfaitInvoice()}
        onOpenInvoice={(invoiceId) =>
          void navigate({ to: "/invoices", search: { invoice: invoiceId } })
        }
      />
    </div>
  );

  return (
    <>
      <MissionDetailPage
        billingProgress={billingQuery.data ?? null}
        client={clientQuery.data}
        documentsTab={documentsTab}
        invoicesTab={invoicesTab}
        error={
          updateMission.error && !serverFieldErrors(updateMission.error)
            ? m.common_action_failed()
            : null
        }
        isStatusPending={isMutating}
        isUpdatePending={isMutating}
        mission={missionQuery.data}
        onOpenCra={() => void navigate({ to: "/cra" })}
        onSetStatus={(status) => void handleSetStatus(status)}
        onUpdate={handleUpdate}
        entries={entriesQuery.data?.timeEntries}
        isEntriesError={entriesQuery.isError}
        isEntriesPending={entriesQuery.isPending}
        revenue={revenueQuery.data}
        revenueFailed={revenueQuery.isError}
      />

      <CreateInvoiceDialog
        prefill={creatingFor}
        suggestedNumber={nextNumberQuery.data?.number ?? null}
        vatLiable={user.vatLiable}
        isSaving={createInvoice.isPending}
        error={createError}
        onOpenChange={(open) => {
          if (!open) {
            setCreatingFor(null);
            setCreateError(null);
          }
        }}
        onSubmit={submitInvoice}
      />
    </>
  );
}
