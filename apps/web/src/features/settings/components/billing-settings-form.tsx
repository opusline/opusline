import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";

import { PaymentTermsPicker } from "@/components/payment-terms-picker";
import { formatRateDraft, parseRateToCents } from "@/lib/billing";
import { previewInvoiceNumber } from "../lib/settings-form";
import type { SettingsForm } from "../lib/use-settings-form";

export function BillingSettingsForm({ form }: { form: SettingsForm }) {
  return (
    <div className="rounded-md border bg-card px-7 py-6.5">
      <div className="mb-1 font-heading font-semibold text-[17px] text-foreground-hi">
        Facturation et trésorerie
      </div>
      <p className="mb-5 text-muted-foreground-3 text-sm leading-relaxed">
        Valeurs proposées à la création d'un client, et seuil utilisé par la
        page Trésorerie.
      </p>

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
            value.includes("NNN")
              ? undefined
              : { message: "Le format doit contenir le compteur NNN." },
        }}
      >
        {(field) => {
          const isInvalid = !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel
                className="text-foreground-3 text-sm"
                htmlFor={field.name}
              >
                Numérotation des factures
              </FieldLabel>
              <div className="flex flex-wrap items-center gap-2.5">
                <Input
                  aria-invalid={isInvalid}
                  className="min-w-45 flex-1"
                  font="mono"
                  id={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  value={field.state.value}
                />
                <span className="text-muted-foreground-3 text-sm">
                  Prochaine :{" "}
                  <span className="font-mono text-foreground-3">
                    {previewInvoiceNumber(field.state.value, new Date())}
                  </span>
                </span>
              </div>
              {isInvalid ? (
                <FieldError errors={field.state.meta.errors} />
              ) : (
                <FieldDescription>
                  Jetons disponibles : AAAA (année), MM (mois), NNN (compteur).
                </FieldDescription>
              )}
            </Field>
          );
        }}
      </form.Field>

      <div className="my-5.5 h-px bg-secondary" />

      <form.Field
        name="treasuryBuffer"
        validators={{
          onChange: ({ value }: { value: string }) =>
            value.trim() === "" || parseRateToCents(value) !== null
              ? undefined
              : { message: "Indiquez un montant, ou laissez vide." },
        }}
      >
        {(field) => {
          const isInvalid = !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel
                className="text-foreground-3 text-sm"
                htmlFor={field.name}
              >
                Matelas de trésorerie
              </FieldLabel>
              <div className="relative max-w-45">
                <Input
                  aria-invalid={isInvalid}
                  className="pr-8"
                  font="mono"
                  id={field.name}
                  inputMode="decimal"
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(formatRateDraft(event.target.value))
                  }
                  placeholder="0"
                  value={field.state.value}
                />
                <span className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 text-muted-foreground-2 text-sm">
                  €
                </span>
              </div>
              {isInvalid ? (
                <FieldError errors={field.state.meta.errors} />
              ) : (
                <FieldDescription>
                  Retenu en plus des provisions fiscales dans « Combien je peux
                  me virer ? ». Laissez vide pour aucun matelas.
                </FieldDescription>
              )}
            </Field>
          );
        }}
      </form.Field>
    </div>
  );
}
