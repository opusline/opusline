import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@opusline/ui/components/field";
import { NativeSelect } from "@opusline/ui/components/native-select";

import { FormTextField } from "@/components/form-text-field";
import { useMoneyFormat } from "@/components/money-format-provider";
import { PaymentTermsPicker } from "@/components/payment-terms-picker";
import { currencySymbol, formatRateDraft } from "@/lib/billing";
import { formatWorkedTime } from "@/lib/durations";
import {
  hasInvoiceNumberCounter,
  parseBufferCents,
  previewInvoiceNumber,
} from "../lib/settings-form";
import type { SettingsForm } from "../lib/use-settings-form";
import { SettingsSection } from "./settings-section";

// Half-hour steps from 5 h to 10 h; an off-list saved value is offered too.
const WORKDAY_OPTIONS = Array.from(
  { length: 11 },
  (_, step) => 300 + step * 30,
);

function workdayOptions(saved: number): number[] {
  return WORKDAY_OPTIONS.includes(saved)
    ? WORKDAY_OPTIONS
    : [saved, ...WORKDAY_OPTIONS].sort((left, right) => left - right);
}

export function BillingSettingsForm({
  form,
  savedWorkdayMinutes,
}: {
  form: SettingsForm;
  savedWorkdayMinutes: number;
}) {
  const format = useMoneyFormat();

  return (
    <SettingsSection
      description="Valeurs proposées à la création d'un client, et seuil utilisé par la page Trésorerie."
      title="Facturation et trésorerie"
    >
      <form.Field name="defaultPaymentTermsDays">
        {(field) => {
          const isInvalid = !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel
                className="text-foreground-3 text-sm"
                htmlFor={`${field.name}-options`}
              >
                Délai de paiement par défaut
              </FieldLabel>
              <PaymentTermsPicker
                id={`${field.name}-options`}
                isInvalid={isInvalid}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
                value={field.state.value}
                variant="inline"
              />
              {isInvalid ? (
                <FieldError errors={field.state.meta.errors} />
              ) : (
                <FieldDescription>
                  Au-delà de 60 jours, pensez aux pénalités de retard légales.
                </FieldDescription>
              )}
            </Field>
          );
        }}
      </form.Field>

      <div className="my-5.5 h-px bg-secondary" />

      <form.Field
        name="invoiceNumberFormat"
        validators={{
          onChange: ({ value }: { value: string }) =>
            hasInvoiceNumberCounter(value)
              ? undefined
              : { message: "Le format doit contenir un seul compteur NNN." },
        }}
      >
        {(field) => (
          <FormTextField
            beside={
              <span
                aria-live="polite"
                className="text-muted-foreground-3 text-sm"
                id={`${field.name}-preview`}
              >
                Prochaine :{" "}
                <span className="font-mono text-foreground-3">
                  {previewInvoiceNumber(field.state.value, new Date())}
                </span>
              </span>
            }
            describedBy={`${field.name}-preview`}
            description="Jetons disponibles : AAAA (année), MM (mois), NNN (compteur)."
            field={field}
            font="mono"
            inputClassName="min-w-45 flex-1"
            label="Numérotation des factures"
            labelClassName="text-foreground-3 text-sm"
          />
        )}
      </form.Field>

      <div className="my-5.5 h-px bg-secondary" />

      <form.Field
        name="treasuryBuffer"
        validators={{
          onChange: ({ value }: { value: string }) =>
            value.trim() === "" ||
            parseBufferCents(format.locale, value) !== null
              ? undefined
              : { message: "Indiquez un montant, ou laissez vide." },
        }}
      >
        {(field) => (
          <FormTextField
            adornment={currencySymbol(format)}
            beside={
              <span
                className="min-w-50 flex-1 text-muted-foreground-3 text-xs"
                id={`${field.name}-hint`}
              >
                Somme gardée sur le compte pro avant tout virement vers votre
                compte personnel.
              </span>
            }
            controlClassName="w-37.5 shrink-0"
            describedBy={`${field.name}-hint`}
            field={{
              name: field.name,
              state: field.state,
              handleBlur: field.handleBlur,
              handleChange: (value: string) =>
                field.handleChange(formatRateDraft(format.locale, value)),
            }}
            font="mono"
            inputMode="decimal"
            label="Matelas de trésorerie"
            labelClassName="text-foreground-3 text-sm"
            placeholder="0"
          />
        )}
      </form.Field>

      <div className="my-5.5 h-px bg-secondary" />

      <form.Field name="workdayMinutes">
        {(field) => (
          <Field>
            <FieldLabel
              className="text-foreground-3 text-sm"
              htmlFor={field.name}
            >
              Durée d'une journée de travail
            </FieldLabel>
            <NativeSelect
              className="w-70"
              id={field.name}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(Number(event.target.value))
              }
              value={String(field.state.value)}
            >
              {workdayOptions(savedWorkdayMinutes).map((minutes) => (
                <option key={minutes} value={String(minutes)}>
                  {formatWorkedTime(minutes)}
                </option>
              ))}
            </NativeSelect>
            <FieldDescription>
              Convertit le temps suivi en fractions de journée sur les missions
              au TJM. Le changement s'applique aussi à l'historique déjà saisi.
            </FieldDescription>
          </Field>
        )}
      </form.Field>
    </SettingsSection>
  );
}
