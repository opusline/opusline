import type { SettingsData, UpdateSettingsData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@opusline/ui/components/tabs";
import { useEffect, useMemo } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { hasEuVat } from "@/lib/countries";
import { abroadTaxTerms } from "@/lib/fiscality";
import type { FormSubmitResult } from "@/lib/form";
import { m } from "@/paraglide/messages.js";
import {
  countChanges,
  SETTINGS_TAB_DETAILS,
  SETTINGS_TABS,
  type SettingsTab,
  tabOwningField,
  toSettingsValues,
  unsavedChangesLabel,
} from "../lib/settings-form";
import { type SettingsForm, useSettingsForm } from "../lib/use-settings-form";
import { BillingSettingsForm } from "./billing-settings-form";
import {
  DeadlineSettingsFields,
  FiscalAbroadPanel,
  FiscalSettingsForm,
} from "./fiscal-settings-form";
import { IdentitySettingsForm } from "./identity-settings-form";
import {
  type LocalisationDraft,
  LocalisationSettings,
} from "./localisation-settings";
import { SaveBar } from "./save-bar";
import { SignatureSettings } from "./signature-settings";

const FORM_ID = "settings-form";

/**
 * Value-stable dependency on purpose: a window-focus refetch hands back a new
 * settings object with the same figures, and re-seeding then would clobber an
 * unsaved draft.
 */
function useReseededDraft(
  form: SettingsForm,
  name:
    | "contributionRate"
    | "defaultVatRate"
    | "treasuryBuffer"
    | "cfeExpected",
  value: string,
): void {
  useEffect(() => {
    form.setFieldValue(name, value, {
      dontUpdateMeta: true,
      dontValidate: true,
    });
  }, [form, name, value]);
}

type SignatureProps = {
  src: string;
  isPending: boolean;
  error: string | null;
  onSave: (signature: File) => Promise<boolean>;
  onRemove: () => void;
};

type RatesProps = {
  isRefreshing: boolean;
  /** A save scheduled a background barème read that has not landed yet. */
  isBackgroundRefresh: boolean;
  error: string | null;
  onRefresh: () => void;
};

type LocalisationProps = {
  saved: LocalisationDraft;
  isSaving: boolean;
  error: string | null;
  onSave: (draft: LocalisationDraft) => void;
  onCancel: () => void;
};

type SettingsPageProps = {
  settings: SettingsData;
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  onSubmit: (body: UpdateSettingsData) => Promise<FormSubmitResult>;
  signature: SignatureProps;
  rates: RatesProps;
  localisation: LocalisationProps;
};

export function SettingsPage({
  settings,
  activeTab,
  onTabChange,
  onSubmit,
  signature,
  rates,
  localisation,
}: SettingsPageProps) {
  const format = useMoneyFormat();
  const form = useSettingsForm(settings, onSubmit);
  const savedValues = useMemo(
    () => toSettingsValues(format, settings),
    [format, settings],
  );
  // Money and percent drafts are locale-notated strings: when the saved value
  // or the locale changes, re-seed them so a draft typed in one notation is
  // never parsed with another's separators.
  useReseededDraft(form, "contributionRate", savedValues.contributionRate);
  useReseededDraft(form, "defaultVatRate", savedValues.defaultVatRate);
  useReseededDraft(form, "treasuryBuffer", savedValues.treasuryBuffer);
  useReseededDraft(form, "cfeExpected", savedValues.cfeExpected);

  const isEuVat = hasEuVat(settings.businessCountry);
  const fiscaliteHint = settings.hasFrenchFiscality
    ? SETTINGS_TAB_DETAILS.fiscalite.hint()
    : abroadTaxTerms(isEuVat).name;

  return (
    <div>
      <div className="mb-6.5">
        <h1 className="mb-1 font-heading font-semibold text-2xl text-foreground-hi">
          {m.page_title_settings()}
        </h1>
        <p className="text-muted-foreground-3 text-sm">
          {m.settings_page_subtitle()}
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
                  {SETTINGS_TAB_DETAILS[tab].label()}
                </span>
                <span className="text-muted-foreground-3 text-xs">
                  {tab === "fiscalite"
                    ? fiscaliteHint
                    : SETTINGS_TAB_DETAILS[tab].hint()}
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
              <IdentitySettingsForm
                form={form}
                hasFrenchFiscality={settings.hasFrenchFiscality}
                showEuVatNumber={isEuVat}
              />
            </TabsContent>
            <TabsContent keepMounted value="fiscalite">
              {settings.hasFrenchFiscality ? (
                <>
                  <FiscalSettingsForm
                    contributionRateBp={settings.contributionRateBp}
                    effectiveContributionRateBp={
                      settings.effectiveContributionRateBp
                    }
                    form={form}
                    isBackgroundRefresh={rates.isBackgroundRefresh}
                    isRefreshingRates={rates.isRefreshing}
                    liberatingPaymentRateBp={settings.liberatingPaymentRateBp}
                    onRefreshRates={rates.onRefresh}
                    ratesCheckedAt={settings.ratesCheckedAt}
                    ratesError={rates.error}
                    ratesYear={settings.ratesYear}
                    savedAcre={settings.acre}
                    savedBusinessStartedOn={settings.businessStartedOn}
                  />
                  <DeadlineSettingsFields form={form} />
                </>
              ) : (
                <FiscalAbroadPanel form={form} isEuVat={isEuVat} />
              )}
            </TabsContent>
            <TabsContent keepMounted value="facturation">
              <BillingSettingsForm
                form={form}
                savedWorkdayMinutes={settings.workdayMinutes}
              />
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
          <TabsContent value="regional">
            <LocalisationSettings
              currencyLocked={settings.currencyLocked}
              error={localisation.error}
              isSaving={localisation.isSaving}
              onCancel={localisation.onCancel}
              onSave={localisation.onSave}
              saved={localisation.saved}
            />
          </TabsContent>

          <form.Subscribe
            selector={(state) => ({
              values: state.values,
              isSubmitting: state.isSubmitting,
              invalidField: Object.keys(state.fieldMeta).find(
                (field) =>
                  !state.fieldMeta[field as keyof typeof state.fieldMeta]
                    ?.isValid,
              ),
            })}
          >
            {({ values, isSubmitting, invalidField }) => {
              const changes = countChanges(
                format,
                savedValues,
                values,
                settings,
              );
              const invalidTab =
                invalidField === undefined
                  ? undefined
                  : tabOwningField(invalidField);

              if (changes === 0 && invalidTab === undefined) {
                return null;
              }

              return (
                <SaveBar
                  isSaving={isSubmitting}
                  label={
                    invalidTab === undefined
                      ? unsavedChangesLabel(changes)
                      : m.settings_fix_invalid_tab({
                          tab: SETTINGS_TAB_DETAILS[invalidTab].label(),
                        })
                  }
                  onCancel={() => form.reset(savedValues)}
                >
                  <Button
                    disabled={isSubmitting}
                    form={FORM_ID}
                    onClick={() => {
                      if (
                        invalidTab !== undefined &&
                        invalidTab !== activeTab
                      ) {
                        onTabChange(invalidTab);
                      }
                    }}
                    size="xl"
                    type="submit"
                  >
                    {m.common_save()}
                  </Button>
                </SaveBar>
              );
            }}
          </form.Subscribe>
        </div>
      </Tabs>
    </div>
  );
}
