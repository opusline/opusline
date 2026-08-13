import type { UrssafPeriodicity, VatRegime } from "@opusline/api-client";
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
import {
  URSSAF_PERIODICITIES,
  URSSAF_PERIODICITY_LABELS,
  VAT_REGIME_DETAILS,
  VAT_REGIMES,
} from "@/lib/fiscality";
import { formatRateBp, parseRateBp } from "../lib/settings-form";
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
  return (
    <SettingsSection
      className="flex flex-col gap-5.5"
      description="Ces valeurs pilotent les provisions et les échéances calculées par l'app."
      title="Fiscalité"
    >
      <div className="flex items-center justify-between gap-4 rounded-md border bg-muted px-4 py-3.5">
        <div>
          <div className="mb-1 text-muted-foreground-2 text-xs">
            Charges provisionnées
          </div>
          <div className="font-mono text-[22px] text-primary-text leading-none tabular-nums">
            {formatRateBp(effectiveContributionRateBp)} %
          </div>
        </div>
        <div className="max-w-58 text-right text-muted-foreground-3 text-xs leading-relaxed">
          Cotisations sociales seules. L'impôt sur le revenu reste dû
          annuellement.
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
                Périodicité URSSAF
              </FieldLabel>
              <SegmentedControl
                aria-label="Périodicité URSSAF"
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
                    {URSSAF_PERIODICITY_LABELS[periodicity]}
                  </SegmentedControlItem>
                ))}
              </SegmentedControl>
            </Field>
          )}
        </form.Field>

        <form.Field
          name="contributionRate"
          validators={{
            onChange: ({ value }: { value: string }) =>
              parseRateBp(value) === null
                ? { message: "Indiquez un taux entre 0 et 100." }
                : undefined,
          }}
        >
          {(field) => (
            <form.Subscribe selector={(state) => state.values.autoRates}>
              {(autoRates) => (
                <FormTextField
                  adornment="%"
                  description="Taux BNC prestations de service, repris de l'URSSAF."
                  disabled={autoRates}
                  field={{
                    name: field.name,
                    state: autoRates
                      ? {
                          ...field.state,
                          value: formatRateBp(contributionRateBp),
                        }
                      : field.state,
                    handleBlur: field.handleBlur,
                    handleChange: field.handleChange,
                  }}
                  font="mono"
                  inputMode="decimal"
                  label="Taux de cotisations"
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
                Versement libératoire de l'impôt
              </div>
              <div className="text-muted-foreground-2 text-xs">
                Ajoute {formatRateBp(liberatingPaymentRateBp)} % aux cotisations
                et supprime l'IR annuel.
              </div>
            </div>
            <Switch
              aria-label="Versement libératoire de l'impôt"
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
              Régime de TVA
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
                  description={VAT_REGIME_DETAILS[regime].hint}
                  key={regime}
                  title={VAT_REGIME_DETAILS[regime].label}
                  value={String(regime)}
                />
              ))}
            </RadioGroup>
            <FieldDescription>
              {VAT_REGIME_DETAILS[field.state.value].note}
            </FieldDescription>
          </FieldSet>
        )}
      </form.Field>
    </SettingsSection>
  );
}
