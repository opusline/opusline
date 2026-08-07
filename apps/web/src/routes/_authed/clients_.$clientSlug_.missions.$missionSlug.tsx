import type { MissionStatus, UpdateMissionData } from "@opusline/api-client";
import {
  deleteMissionDocumentMutation,
  listClientsQueryKey,
  listMissionDocumentsOptions,
  listMissionDocumentsQueryKey,
  showClientOptions,
  showMissionOptions,
  showMissionQueryKey,
  updateMissionMutation,
  uploadMissionDocumentMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DocumentsTab } from "@/components/documents-tab";
import { MissionDetailPage } from "@/features/missions/components/mission-detail-page";
import {
  documentHandlers,
  isClientDocument,
  missionDocumentDownloadHref,
} from "@/lib/documents";
import type { FormSubmitResult } from "@/lib/form";
import { serverFieldErrors } from "@/lib/validation";

export const Route = createFileRoute(
  "/_authed/clients_/$clientSlug_/missions/$missionSlug",
)({
  component: MissionDetailRoute,
});

function MissionDetailRoute() {
  const { clientSlug, missionSlug } = Route.useParams();
  const queryClient = useQueryClient();

  const missionPath = { client: clientSlug, mission: missionSlug };
  const clientQuery = useQuery(
    showClientOptions({ path: { client: clientSlug } }),
  );
  const missionQuery = useQuery(showMissionOptions({ path: missionPath }));
  const documentsQuery = useQuery(
    listMissionDocumentsOptions({ path: missionPath }),
  );

  const updateMission = useMutation(updateMissionMutation());
  const [isMutating, setIsMutating] = useState(false);
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
    setIsMutating(true);

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
      setIsMutating(false);
    }
  };

  const handleSetStatus = async (status: MissionStatus) => {
    const mission = missionQuery.data;

    if (mission === undefined) {
      return;
    }

    setIsMutating(true);

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
      setIsMutating(false);
    }
  };

  const {
    handleUpload: handleUploadDocument,
    handleDelete: handleDeleteDocument,
  } = documentHandlers({
    upload: (file, category) =>
      uploadDocument.mutateAsync({
        body: { file, category },
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
        <AlertDescription>
          Impossible de charger cette mission. Réessayez dans un instant.
        </AlertDescription>
      </Alert>
    );
  }

  const documentsTab = documentsQuery.isPending ? (
    <Skeleton className="h-40 w-full" />
  ) : documentsQuery.data === undefined ? (
    <Alert variant="destructive">
      <AlertDescription>
        Impossible de charger les documents. Réessayez dans un instant.
      </AlertDescription>
    </Alert>
  ) : (
    <DocumentsTab
      canRemove={(document) => !isClientDocument(document)}
      documents={documentsQuery.data.documents}
      downloadHref={(document) =>
        missionDocumentDownloadHref(clientSlug, missionSlug, document)
      }
      emptyLabel="Aucun document pour cette mission. Les documents du client apparaissent aussi ici."
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
          ? "L'action a échoué. Réessayez dans un instant."
          : null
      }
      isStatusPending={isMutating}
      isUpdatePending={isMutating}
      mission={missionQuery.data}
      onSetStatus={(status) => void handleSetStatus(status)}
      onUpdate={handleUpdate}
    />
  );
}
