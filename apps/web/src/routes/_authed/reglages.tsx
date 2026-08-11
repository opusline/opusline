import type { UpdateSettingsData } from "@opusline/api-client";
import {
  deleteUserSignatureMutation,
  refreshSettingsRatesMutation,
  showSettingsOptions,
  showSettingsQueryKey,
  updateSettingsMutation,
  uploadUserSignatureMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

import { SettingsPage } from "@/features/settings/components/settings-page";
import {
  isSettingsTab,
  type SettingsTab,
} from "@/features/settings/lib/settings-form";
import { signatureHref } from "@/features/settings/lib/signature";
import { useThemeControl } from "@/features/theme/lib/use-theme-preference";
import type { FormSubmitResult } from "@/lib/form";
import { serverErrorMessage, serverFieldErrors } from "@/lib/validation";

type ReglagesSearch = { tab?: SettingsTab };

export const Route = createFileRoute("/_authed/reglages")({
  validateSearch: (search: Record<string, unknown>): ReglagesSearch => ({
    tab: isSettingsTab(search.tab) ? search.tab : undefined,
  }),
  component: ReglagesRoute,
});

const SIGNATURE_FAILED = "L'envoi a échoué. Réessayez dans un instant.";
const SAVE_FAILED = "L'enregistrement a échoué. Réessayez dans un instant.";
const RATES_FAILED =
  "Le barème de l'URSSAF n'a pas pu être lu. Vos taux actuels sont conservés.";

function ReglagesRoute() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useThemeControl();

  const [signatureVersion, setSignatureVersion] = useState(0);
  const [signatureError, setSignatureError] = useState<string | null>(null);
  const [ratesError, setRatesError] = useState<string | null>(null);

  const settings = useQuery(showSettingsOptions());

  const updateSettings = useMutation({
    ...updateSettingsMutation(),
    onSuccess: (data) => {
      queryClient.setQueryData(showSettingsQueryKey(), data);
    },
  });

  const refreshRates = useMutation({
    ...refreshSettingsRatesMutation(),
    onSuccess: (data) => {
      setRatesError(null);
      queryClient.setQueryData(showSettingsQueryKey(), data);
    },
    onError: (error) => setRatesError(serverErrorMessage(error, RATES_FAILED)),
  });

  const refreshSignature = async () => {
    setSignatureError(null);
    setSignatureVersion((version) => version + 1);
    await queryClient.invalidateQueries({ queryKey: showSettingsQueryKey() });
  };

  const uploadSignature = useMutation({
    ...uploadUserSignatureMutation(),
    onSuccess: refreshSignature,
    onError: (error) => {
      setSignatureError(
        serverFieldErrors(error)?.signature?.message ??
          serverErrorMessage(error, SIGNATURE_FAILED),
      );
    },
  });

  const deleteSignature = useMutation({
    ...deleteUserSignatureMutation(),
    onSuccess: refreshSignature,
    onError: () => setSignatureError(SIGNATURE_FAILED),
  });

  if (settings.isPending) {
    return <Skeleton className="h-96 w-full max-w-4xl" />;
  }

  if (settings.data === undefined) {
    return (
      <Alert variant="warn">
        <CircleAlert />
        <AlertDescription>
          {serverErrorMessage(
            settings.error,
            "Les réglages n'ont pas pu être chargés.",
          )}
        </AlertDescription>
      </Alert>
    );
  }

  const submit = async (
    body: UpdateSettingsData,
  ): Promise<FormSubmitResult> => {
    try {
      await updateSettings.mutateAsync({ body });

      return { status: "success" };
    } catch (error) {
      const fieldErrors = serverFieldErrors(error);

      return fieldErrors === null
        ? { status: "failed" }
        : { status: "invalid", fieldErrors };
    }
  };

  return (
    <>
      {updateSettings.isError &&
      serverFieldErrors(updateSettings.error) === null ? (
        <Alert className="mb-3.5" variant="warn">
          <CircleAlert />
          <AlertDescription>
            {serverErrorMessage(updateSettings.error, SAVE_FAILED)}
          </AlertDescription>
        </Alert>
      ) : null}
      <SettingsPage
        activeTab={tab ?? "identite"}
        onSubmit={submit}
        onTabChange={(nextTab) =>
          void navigate({ to: "/reglages", search: { tab: nextTab } })
        }
        onThemeChange={setTheme}
        settings={settings.data}
        signature={{
          src: signatureHref(signatureVersion),
          isPending: uploadSignature.isPending || deleteSignature.isPending,
          error: signatureError,
          onSave: (file) =>
            uploadSignature.mutate({ body: { signature: file } }),
          onRemove: () => deleteSignature.mutate({}),
        }}
        rates={{
          isRefreshing: refreshRates.isPending,
          error: ratesError,
          onRefresh: () => refreshRates.mutate({}),
        }}
        theme={theme}
      />
    </>
  );
}
