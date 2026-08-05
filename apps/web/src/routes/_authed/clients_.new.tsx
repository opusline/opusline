import type { CreateClientData } from "@opusline/api-client";
import {
  createClientMutation,
  listClientsOptions,
  listClientsQueryKey,
} from "@opusline/api-client/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { NewClientPage } from "@/features/clients/components/new-client-page";
import type { FormSubmitResult } from "@/lib/form";
import { serverFieldErrors } from "@/lib/validation";

export const Route = createFileRoute("/_authed/clients_/new")({
  component: NewClientRoute,
});

function NewClientRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createClient = useMutation(createClientMutation());

  const handleSubmit = async (
    body: CreateClientData,
    chainToMission: boolean,
  ): Promise<FormSubmitResult> => {
    try {
      const created = await createClient.mutateAsync({ body });
      await queryClient.invalidateQueries({
        queryKey: listClientsQueryKey(),
        refetchType: "none",
      });
      await queryClient.fetchQuery(listClientsOptions());

      if (chainToMission) {
        await navigate({
          to: "/missions/new",
          search: { client: created.slug },
        });
      } else {
        await navigate({ to: "/clients" });
      }
      return { status: "success" };
    } catch (error) {
      const fieldErrors = serverFieldErrors(error);

      return fieldErrors
        ? { status: "invalid", fieldErrors }
        : { status: "failed" };
    }
  };

  return (
    <NewClientPage
      error={
        createClient.error && !serverFieldErrors(createClient.error)
          ? "Impossible de créer le client. Réessayez dans un instant."
          : null
      }
      isPending={createClient.isPending}
      onCancel={() => void navigate({ to: "/clients" })}
      onSubmit={handleSubmit}
    />
  );
}
