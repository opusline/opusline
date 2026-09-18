import type {
  IntegrationsData,
  SaveEnableBankingCredentialsData,
} from "@opusline/api-client";
import {
  deleteEnableBankingCredentialsMutation,
  saveEnableBankingCredentialsMutation,
  showBankAccountQueryKey,
  showIntegrationsOptions,
  showIntegrationsQueryKey,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

import type { FormSubmitResult } from "@/lib/form";
import { serverErrorMessage, serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";
import { EnableBankingCard } from "./enable-banking-card";

/** The Intégrations tab: owns the account's third-party credentials. */
export function IntegrationsSettings() {
  const queryClient = useQueryClient();
  const integrations = useQuery(showIntegrationsOptions());
  const [error, setError] = useState<string | null>(null);

  const saveCredentials = useMutation(saveEnableBankingCredentialsMutation());
  const deleteCredentials = useMutation(
    deleteEnableBankingCredentialsMutation(),
  );

  // Both answers carry the tab's whole state; the Compte pro page reads the
  // same credentials to decide which connection step to offer.
  const applyIntegrations = (data: IntegrationsData) => {
    queryClient.setQueryData(showIntegrationsQueryKey(), data);
    void queryClient.invalidateQueries({ queryKey: showBankAccountQueryKey() });
  };

  const save = async (
    body: SaveEnableBankingCredentialsData,
  ): Promise<FormSubmitResult> => {
    setError(null);

    try {
      applyIntegrations(await saveCredentials.mutateAsync({ body }));

      return { status: "success" };
    } catch (saveError) {
      const fieldErrors = serverFieldErrors(saveError);

      if (fieldErrors !== null) {
        return { status: "invalid", fieldErrors };
      }

      setError(serverErrorMessage(saveError, m.common_save_failed()));

      return { status: "failed" };
    }
  };

  const remove = () => {
    setError(null);
    deleteCredentials.mutate(
      {},
      {
        onSuccess: applyIntegrations,
        onError: (removeError) =>
          setError(serverErrorMessage(removeError, m.common_action_failed())),
      },
    );
  };

  if (integrations.isPending) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (integrations.data === undefined) {
    return (
      <Alert variant="warn">
        <CircleAlert />
        <AlertDescription>
          {serverErrorMessage(integrations.error, m.integrations_load_failed())}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <EnableBankingCard
      error={error}
      isRemoving={deleteCredentials.isPending}
      onRemove={remove}
      onSave={save}
      settings={integrations.data.enableBanking}
    />
  );
}
