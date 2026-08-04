import type { CreateMissionData } from "@opusline/api-client";
import {
  createMissionMutation,
  listClientsOptions,
  listClientsQueryKey,
  showClientQueryKey,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { NewMissionPage } from "@/features/missions/components/new-mission-page";
import type { FormSubmitResult } from "@/lib/form";
import { serverFieldErrors } from "@/lib/validation";

export const Route = createFileRoute("/_authed/missions_/new")({
  validateSearch: (search: Record<string, unknown>): { client?: string } => ({
    client: typeof search.client === "string" ? search.client : undefined,
  }),
  component: NewMissionRoute,
});

function NewMissionRoute() {
  const navigate = useNavigate();
  const { client: initialClientSlug } = Route.useSearch();
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery(listClientsOptions());
  const createMission = useMutation(createMissionMutation());

  const handleSubmit = async (
    clientSlug: string,
    body: CreateMissionData,
  ): Promise<FormSubmitResult> => {
    try {
      await createMission.mutateAsync({ body, path: { client: clientSlug } });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: listClientsQueryKey() }),
        queryClient.invalidateQueries({
          queryKey: showClientQueryKey({ path: { client: clientSlug } }),
        }),
      ]);
      await navigate({ to: "/clients/$clientSlug", params: { clientSlug } });
      return { status: "success" };
    } catch (error) {
      const fieldErrors = serverFieldErrors(error);

      return fieldErrors
        ? { status: "invalid", fieldErrors }
        : { status: "failed" };
    }
  };

  if (isPending) {
    return (
      <div className="flex max-w-270 flex-col gap-5">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || data === undefined) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Impossible de charger vos clients. Réessayez dans un instant.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <NewMissionPage
      clients={data.clients}
      error={
        createMission.error && !serverFieldErrors(createMission.error)
          ? "Impossible de créer la mission. Réessayez dans un instant."
          : null
      }
      initialClientSlug={initialClientSlug}
      isPending={createMission.isPending}
      onCancel={() => void navigate({ to: "/clients" })}
      onSubmit={handleSubmit}
    />
  );
}
