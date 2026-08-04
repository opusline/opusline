import type { UpdateClientData } from "@opusline/api-client";
import {
  archiveClientMutation,
  listClientsQueryKey,
  showClientOptions,
  showClientQueryKey,
  unarchiveClientMutation,
  updateClientMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ClientDetailPage } from "@/features/clients/components/client-detail-page";
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

  const updateClient = useMutation(updateClientMutation());
  const archiveClient = useMutation(archiveClientMutation());
  const unarchiveClient = useMutation(unarchiveClientMutation());

  const invalidateClient = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: showClientQueryKey({ path: { client } }),
      }),
      queryClient.invalidateQueries({ queryKey: listClientsQueryKey() }),
    ]);
  };

  const handleUpdate = async (body: UpdateClientData) => {
    try {
      await updateClient.mutateAsync({ body, path: { client } });
      await invalidateClient();
      return null;
    } catch (error) {
      return serverFieldErrors(error);
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

  if (isPending) {
    return (
      <div className="flex max-w-5xl flex-col gap-5">
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

  return (
    <ClientDetailPage
      client={data}
      error={genericError}
      isArchivePending={archiveClient.isPending || unarchiveClient.isPending}
      isUpdatePending={updateClient.isPending}
      onToggleArchive={() => void handleToggleArchive()}
      onUpdate={handleUpdate}
    />
  );
}
