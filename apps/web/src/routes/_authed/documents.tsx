import {
  deleteUserDocumentMutation,
  listDocumentLibraryOptions,
  listUserDocumentsOptions,
  uploadUserDocumentMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DocumentsPage } from "@/features/documents/components/documents-page";
import { documentHandlers } from "@/lib/documents";
import { operationFilter } from "@/lib/query-invalidation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/documents")({
  component: DocumentsRoute,
});

function DocumentsRoute() {
  const queryClient = useQueryClient();

  const personalQuery = useQuery(listUserDocumentsOptions());
  const libraryQuery = useQuery(listDocumentLibraryOptions());

  const uploadDocument = useMutation(uploadUserDocumentMutation());
  const deleteDocument = useMutation(deleteUserDocumentMutation());

  const { handleUpload, handleDelete } = documentHandlers({
    upload: (file, category, fileName) =>
      uploadDocument.mutateAsync({ body: { file, category, fileName } }),
    remove: (document) =>
      deleteDocument.mutateAsync({ path: { document: document.id } }),
    invalidate: () =>
      queryClient.invalidateQueries(operationFilter("listUserDocuments")),
  });

  if (personalQuery.isPending || libraryQuery.isPending) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <Skeleton className="h-18 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (personalQuery.data === undefined || libraryQuery.data === undefined) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{m.documents_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  return (
    <DocumentsPage
      libraryGroups={libraryQuery.data.groups}
      onDelete={handleDelete}
      onUpload={handleUpload}
      personalDocuments={personalQuery.data.documents}
    />
  );
}
