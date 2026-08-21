import type { UpdateClientData } from "@opusline/api-client";
import {
  archiveClientMutation,
  deleteClientDocumentMutation,
  deleteClientLogoMutation,
  listClientDocumentsOptions,
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
import { type ClientTab, isClientTab } from "@/features/clients/lib/tabs";
import { InvoiceListTab } from "@/features/invoices/components/invoice-list-tab";
import { accountTodayCalendarDate } from "@/lib/dates";
import {
  ASSIGNABLE_DOCUMENT_CATEGORIES,
  clientDocumentDownloadHref,
  documentHandlers,
} from "@/lib/documents";
import type { FormSubmitResult } from "@/lib/form";
import { clientLogoHref, logoHandlers } from "@/lib/logos";
import { invalidateDocumentWrites } from "@/lib/query-invalidation";
import { serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

type ClientSearch = { logoFailed?: boolean; tab?: ClientTab };

export const Route = createFileRoute("/_authed/clients_/$clientSlug")({
  validateSearch: (search: Record<string, unknown>): ClientSearch => ({
    logoFailed:
      search.logoFailed === true || search.logoFailed === "true"
        ? true
        : undefined,
    tab: isClientTab(search.tab) ? search.tab : undefined,
  }),
  component: ClientDetailRoute,
});

function ClientDetailRoute() {
  const { user } = Route.useRouteContext();
  const { clientSlug: client } = Route.useParams();
  const { logoFailed, tab } = Route.useSearch();
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
          await navigate({
            replace: true,
            search: ({ tab }) => ({ tab }),
            to: ".",
          });
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
    invalidate: () => invalidateDocumentWrites(queryClient),
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
      assignableCategories={ASSIGNABLE_DOCUMENT_CATEGORIES}
      documents={documentsQuery.data.documents}
      downloadHref={(document) =>
        clientDocumentDownloadHref(client, document.id)
      }
      emptyLabel={m.clients_documents_empty()}
      onDelete={handleDeleteDocument}
      onUpload={handleUploadDocument}
    />
  );

  const invoicesTab = (
    <InvoiceListTab
      accountToday={accountTodayCalendarDate(user.timezone)}
      emptyHint={m.clients_invoices_empty_hint()}
      query={{ clientId: data.id }}
      withMission
    />
  );

  return (
    <ClientDetailPage
      accountVatRateBp={user.effectiveVatRateBp}
      client={data}
      documentsTab={documentsTab}
      error={genericError}
      invoicesTab={invoicesTab}
      isArchivePending={archiveClient.isPending || unarchiveClient.isPending}
      isUpdatePending={updateClient.isPending}
      logoSrc={clientLogoHref(client, logoVersion)}
      onRemoveLogo={handleRemoveLogo}
      onToggleArchive={() => void handleToggleArchive()}
      onTabChange={(next) =>
        void navigate({
          replace: true,
          search: (current) => ({ ...current, tab: next }),
          to: ".",
        })
      }
      onUpdate={handleUpdate}
      onUploadLogo={handleUploadLogo}
      tab={tab ?? "missions"}
      revenue={revenueQuery.data?.revenue}
      revenueFailed={revenueQuery.isError}
      revenueYear={revenueQuery.data?.year}
      vatLiable={user.vatLiable}
    />
  );
}
