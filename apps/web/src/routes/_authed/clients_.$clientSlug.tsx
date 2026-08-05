import type {
  DocumentCategory,
  DocumentData,
  UpdateClientData,
} from "@opusline/api-client";
import {
  archiveClientMutation,
  deleteClientDocumentMutation,
  listClientDocumentsOptions,
  listClientDocumentsQueryKey,
  listClientsQueryKey,
  showClientOptions,
  showClientQueryKey,
  unarchiveClientMutation,
  updateClientMutation,
  uploadClientDocumentMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DocumentsTab } from "@/components/documents-tab";
import { ClientDetailPage } from "@/features/clients/components/client-detail-page";
import {
  clientDocumentDownloadHref,
  type DocumentUploadResult,
  uploadFailureMessage,
} from "@/lib/documents";
import type { FormSubmitResult } from "@/lib/form";
import { serverFieldErrors } from "@/lib/validation";

export const Route = createFileRoute("/_authed/clients_/$clientSlug")({
  component: ClientDetailRoute,
});

function ClientDetailRoute() {
  const { clientSlug: client } = Route.useParams();
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery(
    showClientOptions({ path: { client } }),
  );
  const documentsQuery = useQuery(
    listClientDocumentsOptions({ path: { client } }),
  );

  const updateClient = useMutation(updateClientMutation());
  const archiveClient = useMutation(archiveClientMutation());
  const unarchiveClient = useMutation(unarchiveClientMutation());
  const uploadDocument = useMutation(uploadClientDocumentMutation());
  const deleteDocument = useMutation(deleteClientDocumentMutation());

  const invalidateClient = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: showClientQueryKey({ path: { client } }),
      }),
      queryClient.invalidateQueries({ queryKey: listClientsQueryKey() }),
    ]);
  };

  const invalidateDocuments = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: listClientDocumentsQueryKey({ path: { client } }),
      }),
      queryClient.invalidateQueries({
        queryKey: [{ _id: "listMissionDocuments" }],
      }),
    ]);
  };

  const handleUpdate = async (
    body: UpdateClientData,
  ): Promise<FormSubmitResult> => {
    try {
      await updateClient.mutateAsync({ body, path: { client } });
      await invalidateClient();
      return { status: "success" };
    } catch (error) {
      const fieldErrors = serverFieldErrors(error);

      return fieldErrors
        ? { status: "invalid", fieldErrors }
        : { status: "failed" };
    }
  };

  const handleToggleArchive = async () => {
    const toggle = data?.archivedAt == null ? archiveClient : unarchiveClient;

    try {
      await toggle.mutateAsync({ path: { client } });
      await invalidateClient();
    } catch {
      // The mutation error is surfaced through toggle.error below.
    }
  };

  const handleUploadDocument = async (
    file: File,
    category: DocumentCategory,
  ): Promise<DocumentUploadResult> => {
    try {
      await uploadDocument.mutateAsync({
        body: { file, category },
        path: { client },
      });
      await invalidateDocuments();
      return { status: "success" };
    } catch (error) {
      return { status: "failed", message: uploadFailureMessage(error) };
    }
  };

  const handleDeleteDocument = async (
    document: DocumentData,
  ): Promise<boolean> => {
    try {
      await deleteDocument.mutateAsync({
        path: { client, document: document.id },
      });
      await invalidateDocuments();
      return true;
    } catch {
      return false;
    }
  };

  if (isPending) {
    return (
      <div className="flex max-w-270 flex-col gap-5">
        <Skeleton className="h-18 w-full" />
        <Skeleton className="h-22 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || data === undefined) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Impossible de charger ce client. Réessayez dans un instant.
        </AlertDescription>
      </Alert>
    );
  }

  const genericError =
    (updateClient.error && !serverFieldErrors(updateClient.error)) ||
    archiveClient.error ||
    unarchiveClient.error
      ? "L'action a échoué. Réessayez dans un instant."
      : null;

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
      documents={documentsQuery.data.documents}
      downloadHref={(document) =>
        clientDocumentDownloadHref(client, document.id)
      }
      emptyLabel="Aucun document pour ce client. Contrats, devis et CRA signés viendront ici."
      onDelete={handleDeleteDocument}
      onUpload={handleUploadDocument}
    />
  );

  return (
    <ClientDetailPage
      client={data}
      documentsTab={documentsTab}
      error={genericError}
      isArchivePending={archiveClient.isPending || unarchiveClient.isPending}
      isUpdatePending={updateClient.isPending}
      onToggleArchive={() => void handleToggleArchive()}
      onUpdate={handleUpdate}
    />
  );
}
