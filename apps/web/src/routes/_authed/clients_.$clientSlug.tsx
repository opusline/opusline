import type { UpdateClientData } from "@opusline/api-client";
import {
  archiveClientMutation,
  deleteClientDocumentMutation,
  deleteClientLogoMutation,
  listClientDocumentsOptions,
  listClientDocumentsQueryKey,
  listClientsQueryKey,
  showClientOptions,
  showClientQueryKey,
  showClientRevenueOptions,
  unarchiveClientMutation,
  updateClientMutation,
  uploadClientDocumentMutation,
  uploadClientLogoMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { DocumentsTab } from "@/components/documents-tab";
import { ClientDetailPage } from "@/features/clients/components/client-detail-page";
import { clientDocumentDownloadHref, documentHandlers } from "@/lib/documents";
import type { FormSubmitResult } from "@/lib/form";
import { clientLogoHref, logoHandlers } from "@/lib/logos";
import { operationFilter } from "@/lib/query-invalidation";
import { serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/clients_/$clientSlug")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { logoFailed?: boolean } =>
    search.logoFailed === true || search.logoFailed === "true"
      ? { logoFailed: true }
      : {},
  component: ClientDetailRoute,
});

function ClientDetailRoute() {
  const { user } = Route.useRouteContext();
  const { clientSlug: client } = Route.useParams();
  const { logoFailed } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery(
    showClientOptions({ path: { client } }),
  );
  const documentsQuery = useQuery(
    listClientDocumentsOptions({ path: { client } }),
  );
  const revenueQuery = useQuery(showClientRevenueOptions({ path: { client } }));

  const updateClient = useMutation(updateClientMutation());
  const archiveClient = useMutation(archiveClientMutation());
  const unarchiveClient = useMutation(unarchiveClientMutation());
  const uploadLogo = useMutation(uploadClientLogoMutation());
  const deleteLogo = useMutation(deleteClientLogoMutation());
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
      queryClient.invalidateQueries(operationFilter("listMissionDocuments")),
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

  const [logoVersion, setLogoVersion] = useState(0);

  const { handleUpload: handleUploadLogo, handleRemove: handleRemoveLogo } =
    logoHandlers({
      upload: (logo) =>
        uploadLogo.mutateAsync({ body: { logo }, path: { client } }),
      remove: () => deleteLogo.mutateAsync({ path: { client } }),
      invalidate: async () => {
        setLogoVersion((version) => version + 1);

        if (logoFailed) {
          await navigate({ replace: true, search: {}, to: "." });
        }

        await invalidateClient();
      },
    });

  const {
    handleUpload: handleUploadDocument,
    handleDelete: handleDeleteDocument,
  } = documentHandlers({
    upload: (file, category, fileName) =>
      uploadDocument.mutateAsync({
        body: { file, category, fileName },
        path: { client },
      }),
    remove: (document) =>
      deleteDocument.mutateAsync({
        path: { client, document: document.id },
      }),
    invalidate: invalidateDocuments,
  });

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
        <AlertDescription>{m.clients_load_one_failed()}</AlertDescription>
      </Alert>
    );
  }

  const hasActionFailed =
    (updateClient.error && !serverFieldErrors(updateClient.error)) ||
    archiveClient.error ||
    unarchiveClient.error;

  const genericError = hasActionFailed
    ? m.common_action_failed()
    : logoFailed
      ? m.clients_logo_failed_note()
      : null;

  const documentsTab = documentsQuery.isPending ? (
    <Skeleton className="h-40 w-full" />
  ) : documentsQuery.data === undefined ? (
    <Alert variant="destructive">
      <AlertDescription>{m.documents_load_failed()}</AlertDescription>
    </Alert>
  ) : (
    <DocumentsTab
      documents={documentsQuery.data.documents}
      downloadHref={(document) =>
        clientDocumentDownloadHref(client, document.id)
      }
      emptyLabel={m.clients_documents_empty()}
      onDelete={handleDeleteDocument}
      onUpload={handleUploadDocument}
    />
  );

  return (
    <ClientDetailPage
      accountVatRateBp={user.effectiveVatRateBp}
      client={data}
      documentsTab={documentsTab}
      error={genericError}
      isArchivePending={archiveClient.isPending || unarchiveClient.isPending}
      isUpdatePending={updateClient.isPending}
      logoSrc={clientLogoHref(client, logoVersion)}
      onRemoveLogo={handleRemoveLogo}
      onToggleArchive={() => void handleToggleArchive()}
      onUpdate={handleUpdate}
      onUploadLogo={handleUploadLogo}
      revenue={revenueQuery.data?.revenue}
      revenueFailed={revenueQuery.isError}
      revenueYear={revenueQuery.data?.year}
      vatLiable={user.vatLiable}
    />
  );
}
