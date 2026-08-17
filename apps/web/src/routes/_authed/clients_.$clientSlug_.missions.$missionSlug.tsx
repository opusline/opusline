import type { MissionStatus, UpdateMissionData } from "@opusline/api-client";
import {
  deleteMissionDocumentMutation,
  listClientsQueryKey,
  listMissionDocumentsOptions,
  listMissionDocumentsQueryKey,
  showClientOptions,
  showMissionOptions,
  showMissionQueryKey,
  showMissionRevenueOptions,
  updateMissionMutation,
  uploadMissionDocumentMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { DocumentsTab } from "@/components/documents-tab";
import { MissionDetailPage } from "@/features/missions/components/mission-detail-page";
import {
  documentHandlers,
  isClientDocument,
  missionDocumentDownloadHref,
} from "@/lib/documents";
import type { FormSubmitResult } from "@/lib/form";
import { serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute(
  "/_authed/clients_/$clientSlug_/missions/$missionSlug",
)({
  component: MissionDetailRoute,
});

function MissionDetailRoute() {
  const { clientSlug, missionSlug } = Route.useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  return (
    <MissionDetailPage
      client={clientQuery.data}
      documentsTab={documentsTab}
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
      revenue={revenueQuery.data}
      revenueFailed={revenueQuery.isError}
    />
  );
}
