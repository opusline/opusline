import type { CreateMissionData } from "@opusline/api-client";
import {
  createMissionMutation,
  listClientsOptions,
  listClientsQueryKey,
  showClientOptions,
  showClientQueryKey,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { NewMissionPage } from "@/features/missions/components/new-mission-page";
import type { FormSubmitResult } from "@/lib/form";
import { serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/missions_/new")({
  validateSearch: (search: Record<string, unknown>): { client?: string } => ({
    client: typeof search.client === "string" ? search.client : undefined,
  }),
  component: NewMissionRoute,
});

function NewMissionRoute() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const { client: initialClientSlug } = Route.useSearch();
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery(listClientsOptions());
  const createMission = useMutation(createMissionMutation());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    clientSlug: string,
    body: CreateMissionData,
  ): Promise<FormSubmitResult> => {
    setIsSubmitting(true);

    let created: Awaited<ReturnType<typeof createMission.mutateAsync>>;

    try {
      created = await createMission.mutateAsync({
        body,
        path: { client: clientSlug },
      });
    } catch (error) {
      setIsSubmitting(false);
      const fieldErrors = serverFieldErrors(error);

      return fieldErrors
        ? { status: "invalid", fieldErrors }
        : { status: "failed" };
    }

    try {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: listClientsQueryKey(),
          refetchType: "none",
        }),
        queryClient.invalidateQueries({
          queryKey: showClientQueryKey({ path: { client: clientSlug } }),
          refetchType: "none",
        }),
      ]);
      await queryClient.fetchQuery(
        showClientOptions({ path: { client: clientSlug } }),
      );
    } catch {
      // A stale list is recoverable; a duplicate mission is not.
    }

    try {
      await navigate({
        to: "/clients/$clientSlug/missions/$missionSlug",
        params: { clientSlug, missionSlug: created.slug },
      });
    } finally {
      setIsSubmitting(false);
    }

    return { status: "success" };
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
        <AlertDescription>{m.missions_load_clients_failed()}</AlertDescription>
      </Alert>
    );
  }

  return (
    <NewMissionPage
      clients={data.clients}
      hasFrenchFiscality={user.hasFrenchFiscality}
      error={
        createMission.error && !serverFieldErrors(createMission.error)
          ? m.missions_create_failed()
          : null
      }
      initialClientSlug={initialClientSlug}
      isPending={isSubmitting}
      onCancel={() => void navigate({ to: "/clients" })}
      onSubmit={handleSubmit}
    />
  );
}
