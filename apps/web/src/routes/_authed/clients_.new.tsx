import type { CreateClientData } from "@opusline/api-client";
import {
  createClientMutation,
  listClientsQueryKey,
} from "@opusline/api-client/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { NewClientPage } from "@/features/clients/components/new-client-page";
import { serverFieldErrors } from "@/lib/validation";

export const Route = createFileRoute("/_authed/clients_/new")({
  component: NewClientRoute,
});

function NewClientRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createClient = useMutation(createClientMutation());

  const handleSubmit = async (body: CreateClientData) => {
    try {
      await createClient.mutateAsync({ body });
      await queryClient.invalidateQueries({ queryKey: listClientsQueryKey() });
      await navigate({ to: "/clients" });
      return null;
    } catch (error) {
      return serverFieldErrors(error);
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
