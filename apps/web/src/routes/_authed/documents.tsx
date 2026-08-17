import {
  deletePersonalDocumentMutation,
  listPersonalDocumentsOptions,
  listPersonalDocumentsQueryKey,
  uploadPersonalDocumentMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MyDocumentsPage } from "@/features/documents/components/my-documents-page";
import {
  documentHandlers,
  personalDocumentDownloadHref,
} from "@/lib/documents";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/documents")({
  component: MyDocumentsRoute,
});

function MyDocumentsRoute() {
  const queryClient = useQueryClient();
  const documents = useQuery(listPersonalDocumentsOptions());

  const uploadDocument = useMutation(uploadPersonalDocumentMutation());
  const deleteDocument = useMutation(deletePersonalDocumentMutation());

  const { handleUpload, handleDelete } = documentHandlers({
    upload: (file, category, fileName) =>
      uploadDocument.mutateAsync({ body: { file, category, fileName } }),
    remove: (document) =>
      deleteDocument.mutateAsync({ path: { document: document.id } }),
    invalidate: () =>
      queryClient.invalidateQueries({
        queryKey: listPersonalDocumentsQueryKey(),
      }),
  });

  if (documents.isPending) {
    return (
      <div className="flex max-w-270 flex-col gap-5">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-22 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (documents.data === undefined) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{m.my_documents_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  return (
    <MyDocumentsPage
      documents={documents.data.documents}
      downloadHref={(document) => personalDocumentDownloadHref(document.id)}
      onDelete={handleDelete}
      onUpload={handleUpload}
    />
  );
}
