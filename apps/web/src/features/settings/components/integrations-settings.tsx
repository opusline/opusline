import type {
  IntegrationsData,
  SaveAnthropicApiKeyData,
  SaveEnableBankingCredentialsData,
  SaveSuperPdpCredentialsData,
} from "@opusline/api-client";
import {
  checkSuperPdpConnectionMutation,
  currentUserQueryKey,
  deleteAnthropicApiKeyMutation,
  deleteEnableBankingCredentialsMutation,
  deleteSuperPdpCredentialsMutation,
  saveAnthropicApiKeyMutation,
  saveEnableBankingCredentialsMutation,
  saveSuperPdpCredentialsMutation,
  showBankAccountQueryKey,
  showIntegrationsOptions,
  showIntegrationsQueryKey,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

import { INVOICING, useFeature } from "@/lib/features";
import type { FormSubmitResult } from "@/lib/form";
import { serverErrorMessage, serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";
import { AnthropicCard } from "./anthropic-card";
import { EnableBankingCard } from "./enable-banking-card";
import { SuperPdpCard } from "./super-pdp-card";

/** The Intégrations tab: owns the account's third-party credentials. */
export function IntegrationsSettings() {
  const queryClient = useQueryClient();
  const integrations = useQuery(showIntegrationsOptions());
  const hasInvoicing = useFeature(INVOICING);
  const [error, setError] = useState<string | null>(null);

  const saveCredentials = useMutation(saveEnableBankingCredentialsMutation());
  const deleteCredentials = useMutation(
    deleteEnableBankingCredentialsMutation(),
  );
  const [superPdpError, setSuperPdpError] = useState<string | null>(null);
  const saveSuperPdp = useMutation(saveSuperPdpCredentialsMutation());
  const checkSuperPdp = useMutation(checkSuperPdpConnectionMutation());
  const deleteSuperPdp = useMutation(deleteSuperPdpCredentialsMutation());
  const [anthropicError, setAnthropicError] = useState<string | null>(null);
  const saveAnthropic = useMutation(saveAnthropicApiKeyMutation());
  const deleteAnthropic = useMutation(deleteAnthropicApiKeyMutation());

  const applyIntegrations = (data: IntegrationsData) => {
    queryClient.setQueryData(showIntegrationsQueryKey(), data);
  };

  // The Compte pro page reads the bank credentials to decide which
  // connection step to offer, so it follows their changes.
  const applyBankIntegrations = (data: IntegrationsData) => {
    applyIntegrations(data);
    void queryClient.invalidateQueries({ queryKey: showBankAccountQueryKey() });
  };

  const save = async (
    body: SaveEnableBankingCredentialsData,
  ): Promise<FormSubmitResult> => {
    setError(null);

    try {
      applyBankIntegrations(await saveCredentials.mutateAsync({ body }));

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
        onSuccess: applyBankIntegrations,
        onError: (removeError) =>
          setError(serverErrorMessage(removeError, m.common_action_failed())),
      },
    );
  };

  const connectSuperPdp = async (
    body: SaveSuperPdpCredentialsData,
  ): Promise<FormSubmitResult> => {
    setSuperPdpError(null);

    try {
      applyIntegrations(await saveSuperPdp.mutateAsync({ body }));

      return { status: "success" };
    } catch (saveError) {
      const fieldErrors = serverFieldErrors(saveError);

      if (fieldErrors !== null) {
        return { status: "invalid", fieldErrors };
      }

      setSuperPdpError(serverErrorMessage(saveError, m.common_save_failed()));

      return { status: "failed" };
    }
  };

  const recheckSuperPdp = async (): Promise<boolean> => {
    setSuperPdpError(null);

    try {
      applyIntegrations(await checkSuperPdp.mutateAsync({}));

      return true;
    } catch (checkError) {
      setSuperPdpError(
        serverErrorMessage(checkError, m.common_action_failed()),
      );

      return false;
    }
  };

  const disconnectSuperPdp = () => {
    setSuperPdpError(null);
    deleteSuperPdp.mutate(
      {},
      {
        onSuccess: applyIntegrations,
        onError: (removeError) =>
          setSuperPdpError(
            serverErrorMessage(removeError, m.common_action_failed()),
          ),
      },
    );
  };

  const saveAnthropicKey = async (
    body: SaveAnthropicApiKeyData,
  ): Promise<FormSubmitResult> => {
    setAnthropicError(null);

    try {
      applyAnthropicIntegrations(await saveAnthropic.mutateAsync({ body }));

      return { status: "success" };
    } catch (saveError) {
      const fieldErrors = serverFieldErrors(saveError);

      if (fieldErrors !== null) {
        return { status: "invalid", fieldErrors };
      }

      setAnthropicError(serverErrorMessage(saveError, m.common_save_failed()));

      return { status: "failed" };
    }
  };

  const removeAnthropicKey = () => {
    setAnthropicError(null);
    deleteAnthropic.mutate(
      {},
      {
        onSuccess: applyAnthropicIntegrations,
        onError: (removeError) =>
          setAnthropicError(
            serverErrorMessage(removeError, m.common_action_failed()),
          ),
      },
    );
  };

  // The expense form reads the key's presence off the current user.
  const applyAnthropicIntegrations = (data: IntegrationsData) => {
    applyIntegrations(data);
    void queryClient.invalidateQueries({ queryKey: currentUserQueryKey() });
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
    <div className="flex flex-col gap-6">
      <EnableBankingCard
        error={error}
        isRemoving={deleteCredentials.isPending}
        onRemove={remove}
        onSave={save}
        settings={integrations.data.enableBanking}
      />
      <AnthropicCard
        error={anthropicError}
        isRemoving={deleteAnthropic.isPending}
        onRemove={removeAnthropicKey}
        onSave={saveAnthropicKey}
        settings={integrations.data.anthropic}
      />
      {hasInvoicing ? (
        <SuperPdpCard
          error={superPdpError}
          isChecking={checkSuperPdp.isPending}
          isRemoving={deleteSuperPdp.isPending}
          onCheck={recheckSuperPdp}
          onRemove={disconnectSuperPdp}
          onSave={connectSuperPdp}
          settings={integrations.data.eInvoicing}
        />
      ) : null}
    </div>
  );
}
