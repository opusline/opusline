import type { UrssafPeriodicity, VatRegime } from "@opusline/api-client";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@opusline/ui/components/field";
import { RadioCard, RadioGroup } from "@opusline/ui/components/radio-group";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
import { Switch } from "@opusline/ui/components/switch";
import { FormTextField } from "@/components/form-text-field";
import { useMoneyFormat } from "@/components/money-format-provider";
import {
  abroadTaxTerms,
  URSSAF_PERIODICITIES,
  urssafPeriodicityLabel,
  VAT_REGIME_MESSAGES,
  VAT_REGIMES,
} from "@/lib/fiscality";
import { m } from "@/paraglide/messages.js";
import { formatRateBp, ratePercentValidator } from "../lib/settings-form";
import type { SettingsForm } from "../lib/use-settings-form";
import { RateSource } from "./rate-source";
import { SettingsSection } from "./settings-section";

type FiscalSettingsFormProps = {
  form: SettingsForm;
  contributionRateBp: number;
  effectiveContributionRateBp: number;
  liberatingPaymentRateBp: number;
  ratesCheckedAt: string | null;
  ratesYear: number | null;
  savedAcre: boolean;
  savedBusinessStartedOn: string | null;
  isRefreshingRates: boolean;
  ratesError: string | null;
  onRefreshRates: () => void;
};

export function FiscalSettingsForm({
  form,
  contributionRateBp,
  effectiveContributionRateBp,
  liberatingPaymentRateBp,
  ratesCheckedAt,
  ratesYear,
  savedAcre,
  savedBusinessStartedOn,
  isRefreshingRates,
  ratesError,
  onRefreshRates,
}: FiscalSettingsFormProps) {
  const format = useMoneyFormat();

  return (
    <SettingsSection
      description={m.settings_fiscality_description()}
      title={m.settings_tab_fiscality_label()}
    >
      <div className="flex flex-col gap-5.5">
        <div className="flex items-center justify-between gap-4 rounded-md border bg-muted px-4 py-3.5">
          <div>
            <div className="mb-1 text-muted-foreground-2 text-xs">
              {m.settings_provisioned_rate_label()}
            </div>
            <div className="font-mono text-primary-text text-xl leading-none tabular-nums">
              {formatRateBp(format.locale, effectiveContributionRateBp)} %
            </div>
          </div>
          <div className="max-w-58 text-right text-muted-foreground-3 text-xs leading-relaxed">
            {m.settings_provisioned_rate_hint()}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <form.Field name="urssafPeriodicity">
            {(field) => (
              <Field>
                <FieldLabel
                  className="text-foreground-3 text-sm"
                  htmlFor={field.name}
                >
                  {m.settings_urssaf_periodicity_label()}
                </FieldLabel>
                <SegmentedControl
                  aria-label={m.settings_urssaf_periodicity_label()}
                  id={field.name}
                  onValueChange={(value) => {
                    const next = value[0];

                    if (typeof next === "string") {
                      field.handleChange(Number(next) as UrssafPeriodicity);
                    }
                  }}
                  value={[String(field.state.value)]}
                >
                  {URSSAF_PERIODICITIES.map((periodicity) => (
                    <SegmentedControlItem
                      key={periodicity}
                      value={String(periodicity)}
                    >
                      {urssafPeriodicityLabel(periodicity)}
                    </SegmentedControlItem>
                  ))}
                </SegmentedControl>
              </Field>
            )}
          </form.Field>

          <form.Field
            name="contributionRate"
            validators={{ onChange: ratePercentValidator(format.locale) }}
          >
            {(field) => (
              <form.Subscribe selector={(state) => state.values.autoRates}>
                {(autoRates) => (
                  <FormTextField
                    adornment="%"
                    description={m.settings_contribution_rate_hint()}
                    disabled={autoRates}
                    field={{
                      name: field.name,
                      state: autoRates
                        ? {
                            ...field.state,
                            value: formatRateBp(
                              format.locale,
                              contributionRateBp,
                            ),
                          }
                        : field.state,
                      handleBlur: field.handleBlur,
                      handleChange: field.handleChange,
                    }}
                    font="mono"
                    inputMode="decimal"
                    label={m.settings_contribution_rate_label()}
                    labelClassName="text-foreground-3 text-sm"
                  />
                )}
              </form.Subscribe>
            )}
          </form.Field>
        </div>

        <div className="h-px bg-secondary" />

        <RateSource
          form={form}
          isRefreshing={isRefreshingRates}
          onRefresh={onRefreshRates}
          ratesCheckedAt={ratesCheckedAt}
          ratesYear={ratesYear}
          refreshError={ratesError}
          savedAcre={savedAcre}
          savedBusinessStartedOn={savedBusinessStartedOn}
        />

        <div className="h-px bg-secondary" />

        <form.Field name="liberatingPayment">
          {(field) => (
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="mb-1 text-foreground-3 text-sm">
                  {m.settings_liberating_payment_label()}
                </div>
                <div className="text-muted-foreground-2 text-xs">
                  {m.settings_liberating_payment_hint({
                    rate: formatRateBp(format.locale, liberatingPaymentRateBp),
                  })}
                </div>
              </div>
              <Switch
                aria-label={m.settings_liberating_payment_label()}
                checked={field.state.value}
                onCheckedChange={field.handleChange}
              />
            </div>
          )}
        </form.Field>

        <div className="h-px bg-secondary" />

        <form.Field name="vatRegime">
          {(field) => (
            <FieldSet>
              <FieldLegend className="text-foreground-3 text-sm">
                {m.settings_vat_regime_legend()}
              </FieldLegend>
              <RadioGroup
                name={field.name}
                onValueChange={(value) =>
                  field.handleChange(Number(value) as VatRegime)
                }
                value={String(field.state.value)}
              >
                {VAT_REGIMES.map((regime) => (
                  <RadioCard
                    description={VAT_REGIME_MESSAGES[regime].hint()}
                    key={regime}
                    title={VAT_REGIME_MESSAGES[regime].label()}
                    value={String(regime)}
                  />
                ))}
              </RadioGroup>
              <FieldDescription>
                {VAT_REGIME_MESSAGES[field.state.value].note()}
              </FieldDescription>
            </FieldSet>
          )}
        </form.Field>
      </div>
    </SettingsSection>
  );
}

/**
 * The Fiscalité tab for a business established outside France: the French
 * machinery is explained away, and the pinned régime leaves the default rate
 * as the only tax control — named TVA inside the EU, where that is exactly
 * what it is.
 */
export function FiscalAbroadPanel({
  form,
  isEuVat,
}: {
  form: SettingsForm;
  isEuVat: boolean;
}) {
  const format = useMoneyFormat();
  const terms = abroadTaxTerms(isEuVat);

  return (
    <>
      <Empty className="rounded-md border border-solid bg-card px-7 py-9">
        <EmptyHeader>
          <EmptyTitle className="font-semibold text-base text-foreground-hi">
            {m.settings_fiscality_abroad_title()}
          </EmptyTitle>
          <EmptyDescription className="text-muted-foreground-3 text-sm">
            {m.settings_fiscality_abroad_description()}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>

      <SettingsSection
        className="mt-4"
        description={m.settings_default_rate_description()}
        title={terms.name}
      >
        <form.Field
          name="defaultVatRate"
          validators={{ onChange: ratePercentValidator(format.locale) }}
        >
          {(field) => (
            <FormTextField
              adornment="%"
              description={terms.zeroHint}
              field={field}
              fieldClassName="max-w-45"
              font="mono"
              inputMode="decimal"
              label={terms.rateLabel}
              labelClassName="text-foreground-3 text-sm"
            />
          )}
        </form.Field>
      </SettingsSection>
    </>
  );
}
