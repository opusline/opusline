import type {
  IntegrationsData,
  SaveEnableBankingCredentialsData,
  SaveSuperPdpCredentialsData,
} from "@opusline/api-client";
import {
  checkSuperPdpConnectionMutation,
  deleteEnableBankingCredentialsMutation,
  deleteSuperPdpCredentialsMutation,
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
  const [superPdpNotice, setSuperPdpNotice] = useState<string | null>(null);
  const saveSuperPdp = useMutation(saveSuperPdpCredentialsMutation());
  const checkSuperPdp = useMutation(checkSuperPdpConnectionMutation());
  const deleteSuperPdp = useMutation(deleteSuperPdpCredentialsMutation());

  // Every answer carries the tab's whole state.
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
    setSuperPdpNotice(null);

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

  const recheckSuperPdp = () => {
    setSuperPdpError(null);
    setSuperPdpNotice(null);
    checkSuperPdp.mutate(
      {},
      {
        onSuccess: (data) => {
          applyIntegrations(data);
          setSuperPdpNotice(m.integrations_super_pdp_checked_ok());
        },
        onError: (checkError) =>
          setSuperPdpError(
            serverErrorMessage(checkError, m.common_action_failed()),
          ),
      },
    );
  };

  const disconnectSuperPdp = () => {
    setSuperPdpError(null);
    setSuperPdpNotice(null);
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
      {hasInvoicing ? (
        <SuperPdpCard
          error={superPdpError}
          isChecking={checkSuperPdp.isPending}
          isRemoving={deleteSuperPdp.isPending}
          notice={superPdpNotice}
          onCheck={recheckSuperPdp}
          onRemove={disconnectSuperPdp}
          onSave={connectSuperPdp}
          settings={integrations.data.eInvoicing}
        />
      ) : null}
    </div>
  );
}
