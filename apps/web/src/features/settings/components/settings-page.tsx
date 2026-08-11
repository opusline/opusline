import type { SettingsData, UpdateSettingsData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@opusline/ui/components/tabs";
import { useEffect, useMemo } from "react";

import type { FormSubmitResult } from "@/lib/form";
import type { ThemePreference } from "@/lib/theme";
import {
  countChanges,
  SETTINGS_TAB_DETAILS,
  SETTINGS_TABS,
  type SettingsTab,
  toSettingsValues,
  unsavedChangesLabel,
} from "../lib/settings-form";
import { useSettingsForm } from "../lib/use-settings-form";
import { AppearanceSettings } from "./appearance-settings";
import { BillingSettingsForm } from "./billing-settings-form";
import { FiscalSettingsForm } from "./fiscal-settings-form";
import { IdentitySettingsForm } from "./identity-settings-form";
import { SignatureSettings } from "./signature-settings";

const FORM_ID = "settings-form";

type SignatureProps = {
  src: string;
  isPending: boolean;
  error: string | null;
  onSave: (signature: File) => void;
  onRemove: () => void;
};

type RatesProps = {
  isRefreshing: boolean;
  error: string | null;
  onRefresh: () => void;
};

type SettingsPageProps = {
  settings: SettingsData;
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  onSubmit: (body: UpdateSettingsData) => Promise<FormSubmitResult>;
  theme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
  signature: SignatureProps;
  rates: RatesProps;
};

export function SettingsPage({
  settings,
  activeTab,
  onTabChange,
  onSubmit,
  theme,
  onThemeChange,
  signature,
  rates,
}: SettingsPageProps) {
  const form = useSettingsForm(settings, onSubmit);
  const savedValues = useMemo(() => toSettingsValues(settings), [settings]);

  const savedContributionRate = savedValues.contributionRate;
  useEffect(() => {
    form.setFieldValue("contributionRate", savedContributionRate);
  }, [form, savedContributionRate]);

  return (
    <div>
      <div className="mb-6.5">
        <h1 className="mb-1 font-heading font-semibold text-2xl text-foreground-hi">
          Réglages
        </h1>
        <p className="text-muted-foreground-3 text-sm">
          Identité de la société, signature et fiscalité de votre
          micro-entreprise.
        </p>
      </div>

      <Tabs
        className="items-start gap-8"
        onValueChange={(value) => onTabChange(value as SettingsTab)}
        orientation="vertical"
        value={activeTab}
      >
        <TabsList className="w-55 shrink-0" variant="sidebar">
          {SETTINGS_TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              <span className="flex flex-col gap-0.75">
                <span className="text-sm">
                  {SETTINGS_TAB_DETAILS[tab].label}
                </span>
                <span className="text-muted-foreground-3 text-xs">
                  {SETTINGS_TAB_DETAILS[tab].hint}
                </span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="min-w-0 max-w-160 flex-1">
          <form
            id={FORM_ID}
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <TabsContent keepMounted value="identite">
              <IdentitySettingsForm form={form} />
            </TabsContent>
            <TabsContent keepMounted value="fiscalite">
              <FiscalSettingsForm
                effectiveContributionRateBp={
                  settings.effectiveContributionRateBp
                }
                form={form}
                isRefreshingRates={rates.isRefreshing}
                liberatingPaymentRateBp={settings.liberatingPaymentRateBp}
                onRefreshRates={rates.onRefresh}
                ratesCheckedAt={settings.ratesCheckedAt}
                ratesError={rates.error}
                ratesYear={settings.ratesYear}
                savedAcre={settings.acre}
                savedBusinessStartedOn={settings.businessStartedOn}
              />
            </TabsContent>
            <TabsContent keepMounted value="facturation">
              <BillingSettingsForm form={form} />
            </TabsContent>
          </form>

          <TabsContent value="signature">
            <SignatureSettings
              error={signature.error}
              hasSignature={settings.hasSignature}
              isPending={signature.isPending}
              onRemove={signature.onRemove}
              onSave={signature.onSave}
              signatureSrc={signature.src}
            />
          </TabsContent>
          <TabsContent value="apparence">
            <AppearanceSettings onChange={onThemeChange} theme={theme} />
          </TabsContent>

          <form.Subscribe
            selector={(state) => ({
              values: state.values,
              isSubmitting: state.isSubmitting,
            })}
          >
            {({ values, isSubmitting }) => {
              const changes = countChanges(savedValues, values);

              if (changes === 0) {
                return null;
              }

              return (
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 rounded-md border bg-card px-5 py-4 shadow-2xl shadow-black/50">
                  <span
                    aria-live="polite"
                    className="text-muted-foreground text-sm"
                  >
                    {unsavedChangesLabel(changes)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      disabled={isSubmitting}
                      onClick={() => form.reset(savedValues)}
                      size="xl"
                      type="button"
                      variant="outline"
                    >
                      Annuler
                    </Button>
                    <Button
                      disabled={isSubmitting}
                      form={FORM_ID}
                      size="xl"
                      type="submit"
                    >
                      Enregistrer
                    </Button>
                  </div>
                </div>
              );
            }}
          </form.Subscribe>
        </div>
      </Tabs>
    </div>
  );
}
