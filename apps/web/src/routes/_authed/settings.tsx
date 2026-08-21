import type {
  SettingsData,
  UpdateSettingsData,
  UserData,
} from "@opusline/api-client";
import {
  currentUserQueryKey,
  deleteUserSignatureMutation,
  refreshSettingsRatesMutation,
  showSettingsOptions,
  showSettingsQueryKey,
  updateSettingsCurrencyMutation,
  updateSettingsMutation,
  uploadUserSignatureMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import type { LocalisationDraft } from "@/features/settings/components/localisation-settings";
import { SettingsPage } from "@/features/settings/components/settings-page";
import {
  isSettingsTab,
  type SettingsTab,
  toSettingsPayload,
  toSettingsValues,
} from "@/features/settings/lib/settings-form";
import { signatureHref } from "@/features/settings/lib/signature";
import type { FormSubmitResult } from "@/lib/form";
import { treasuryFilter } from "@/lib/query-invalidation";
import { serverErrorMessage, serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

type ReglagesSearch = { tab?: SettingsTab };

export const Route = createFileRoute("/_authed/settings")({
  validateSearch: (search: Record<string, unknown>): ReglagesSearch => ({
    tab: isSettingsTab(search.tab) ? search.tab : undefined,
  }),
  component: ReglagesRoute,
});

/**
 * Every field UserData derives from the settings — which is exactly what the two
 * DTOs have in common. Spelling it as the intersection rather than by hand means
 * adding a settings-derived field to the API fails to compile here until it is
 * mirrored, instead of going stale after every save until someone notices.
 */
type SettingsDerivedUserFields = Pick<
  UserData,
  keyof UserData & keyof SettingsData
>;

function settingsDerivedUserFields(
  settings: SettingsData,
): SettingsDerivedUserFields {
  return {
    currency: settings.currency,
    businessCountry: settings.businessCountry,
    hasFrenchFiscality: settings.hasFrenchFiscality,
    vatLiable: settings.vatLiable,
    effectiveVatRateBp: settings.effectiveVatRateBp,
    locale: settings.locale,
    dateFormat: settings.dateFormat,
    timezone: settings.timezone,
    workdayMinutes: settings.workdayMinutes,
  };
}

/**
 * The formatting context and the fiscal gates read the current user; a save
 * that moves the country or currency must reach them without a reload — and
 * the PUT response already carries both, so patch the cache instead of paying
 * a refetch round trip on every save.
 */
function patchCurrentUser(queryClient: QueryClient, settings: SettingsData) {
  queryClient.setQueryData(
    currentUserQueryKey(),
    (user) => user && { ...user, ...settingsDerivedUserFields(settings) },
  );
}

function ReglagesRoute() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const format = useMoneyFormat();

  const [signatureVersion, setSignatureVersion] = useState(0);
  const [signatureError, setSignatureError] = useState<string | null>(null);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [localisationError, setLocalisationError] = useState<string | null>(
    null,
  );

  const settings = useQuery(showSettingsOptions());

  const applySettingsResponse = (data: SettingsData) => {
    queryClient.setQueryData(showSettingsQueryKey(), data);
    patchCurrentUser(queryClient, data);
    // The matelas, the contribution rate and the TVA régime are all terms of
    // the Virement figure the sidebar shows on every screen.
    void queryClient.invalidateQueries(treasuryFilter());
  };

  const updateSettings = useMutation({
    ...updateSettingsMutation(),
    onSuccess: applySettingsResponse,
  });

  // The Localisation card saves through its own instance so its failures land
  // in the card alone — sharing updateSettings would also raise the page-top
  // alert and show the same error twice.
  const saveLocalisationSettings = useMutation({
    ...updateSettingsMutation(),
    onSuccess: applySettingsResponse,
  });

  const updateCurrency = useMutation({
    ...updateSettingsCurrencyMutation(),
    onSuccess: applySettingsResponse,
  });

  const refreshRates = useMutation({
    ...refreshSettingsRatesMutation(),
    onSuccess: (data) => {
      setRatesError(null);
      applySettingsResponse(data);
    },
    onError: (error) =>
      setRatesError(serverErrorMessage(error, m.settings_rates_failed())),
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
          serverErrorMessage(error, m.common_upload_failed()),
      );
    },
  });

  const deleteSignature = useMutation({
    ...deleteUserSignatureMutation(),
    onSuccess: refreshSignature,
    onError: () => setSignatureError(m.common_upload_failed()),
  });

  const isSavingLocalisation =
    saveLocalisationSettings.isPending || updateCurrency.isPending;

  if (settings.isPending) {
    return <Skeleton className="h-96 w-full max-w-4xl" />;
  }

  if (settings.data === undefined) {
    return (
      <Alert variant="warn">
        <CircleAlert />
        <AlertDescription>
          {serverErrorMessage(settings.error, m.settings_load_failed())}
        </AlertDescription>
      </Alert>
    );
  }

  const savedSettings = settings.data;
  const savedLocalisation: LocalisationDraft = {
    businessCountry: savedSettings.businessCountry,
    currency: savedSettings.currency,
    locale: savedSettings.locale,
    dateFormat: savedSettings.dateFormat,
    timezone: savedSettings.timezone,
  };

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

  /**
   * One draft, two endpoints: the guarded currency change first (its 422 is
   * the one worth stopping on), then a single settings save carrying the
   * country, locale and date format together.
   */
  const saveLocalisation = async (draft: LocalisationDraft) => {
    setLocalisationError(null);

    try {
      // The currency PUT clears the treasury buffer and re-denominates the
      // account, so the follow-up payload must build on its response — the
      // render-time snapshot would re-send the buffer in the old currency.
      let baseSettings = savedSettings;

      if (draft.currency !== savedLocalisation.currency) {
        baseSettings = await updateCurrency.mutateAsync({
          body: { currency: draft.currency },
        });
      }

      if (
        draft.businessCountry !== savedLocalisation.businessCountry ||
        draft.locale !== savedLocalisation.locale ||
        draft.dateFormat !== savedLocalisation.dateFormat ||
        draft.timezone !== savedLocalisation.timezone
      ) {
        await saveLocalisationSettings.mutateAsync({
          body: toSettingsPayload(
            format,
            toSettingsValues(format, baseSettings),
            baseSettings,
            draft,
          ),
        });
      }

      if (
        draft.businessCountry !== savedLocalisation.businessCountry ||
        draft.currency !== savedLocalisation.currency
      ) {
        // Holiday greying, fiscal screens and every server-denominated amount
        // hang off the country or the currency, cached under many keys; both
        // moves are rare enough to just mark everything stale.
        void queryClient.invalidateQueries();
      }
    } catch (error) {
      const fieldErrors = serverFieldErrors(error);
      const firstFieldError =
        fieldErrors === null
          ? null
          : (Object.values(fieldErrors)[0]?.message ?? null);

      setLocalisationError(
        firstFieldError ?? serverErrorMessage(error, m.common_save_failed()),
      );
    }
  };

  return (
    <>
      {updateSettings.isError &&
      serverFieldErrors(updateSettings.error) === null ? (
        <Alert className="mb-3.5" variant="warn">
          <CircleAlert />
          <AlertDescription>
            {serverErrorMessage(updateSettings.error, m.common_save_failed())}
          </AlertDescription>
        </Alert>
      ) : null}
      <SettingsPage
        activeTab={tab ?? "identite"}
        onSubmit={submit}
        onTabChange={(nextTab) =>
          void navigate({ to: "/settings", search: { tab: nextTab } })
        }
        settings={savedSettings}
        signature={{
          src: signatureHref(signatureVersion),
          isPending: uploadSignature.isPending || deleteSignature.isPending,
          error: signatureError,
          onSave: async (file) => {
            try {
              await uploadSignature.mutateAsync({ body: { signature: file } });

              return true;
            } catch {
              return false;
            }
          },
          onRemove: () => deleteSignature.mutate({}),
        }}
        rates={{
          isRefreshing: refreshRates.isPending,
          error: ratesError,
          onRefresh: () => refreshRates.mutate({}),
        }}
        localisation={{
          saved: savedLocalisation,
          isSaving: isSavingLocalisation,
          error: localisationError,
          onSave: (draft) => void saveLocalisation(draft),
          onCancel: () => setLocalisationError(null),
        }}
      />
    </>
  );
}
