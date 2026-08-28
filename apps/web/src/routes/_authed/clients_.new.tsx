import type { CreateClientData } from "@opusline/api-client";
import {
  createClientMutation,
  listClientsOptions,
  listClientsQueryKey,
  uploadClientLogoMutation,
} from "@opusline/api-client/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { NewClientPage } from "@/features/clients/components/new-client-page";
import type { FormSubmitResult } from "@/lib/form";
import { revenueFilter } from "@/lib/query-invalidation";
import { serverFieldErrors, writeErrorBanner } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/clients_/new")({
  component: NewClientRoute,
});

function NewClientRoute() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createClient = useMutation(createClientMutation());
  const uploadLogo = useMutation(uploadClientLogoMutation());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    body: CreateClientData,
    chainToMission: boolean,
    logo: File | null,
  ): Promise<FormSubmitResult> => {
    setIsSubmitting(true);

    try {
      const created = await createClient.mutateAsync({ body });
      let hasLogoFailed = false;

      if (logo !== null) {
        try {
          await uploadLogo.mutateAsync({
            body: { logo },
            path: { client: created.slug },
          });
        } catch {
          hasLogoFailed = true;
        }
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: listClientsQueryKey(),
          refetchType: "none",
        }),
        // The new client is absent from the cached fold, and an unmatched row
        // reads as "—" where the API would answer zero.
        queryClient.invalidateQueries(revenueFilter()),
      ]);
      await queryClient.fetchQuery(listClientsOptions());

      if (hasLogoFailed) {
        await navigate({
          to: "/clients/$clientSlug",
          params: { clientSlug: created.slug },
          search: { logoFailed: true },
        });
      } else if (chainToMission) {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NewClientPage
      accountVatRateBp={user.effectiveVatRateBp}
      error={writeErrorBanner(createClient.error, m.clients_create_failed())}
      isPending={isSubmitting}
      onCancel={() => void navigate({ to: "/clients" })}
      onSubmit={handleSubmit}
      vatLiable={user.vatLiable}
    />
  );
}
