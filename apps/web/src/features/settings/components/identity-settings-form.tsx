import { Switch } from "@opusline/ui/components/switch";
import { House } from "lucide-react";

import { AddressFields } from "@/components/address-fields";
import { FormTextField } from "@/components/form-text-field";
import {
  COMPANY_ADDRESS_NAMES,
  HOME_ADDRESS_NAMES,
} from "../lib/settings-form";
import type { SettingsForm } from "../lib/use-settings-form";

const EYEBROW =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-[.09em]";
const LABEL = "text-muted-foreground-2 text-xs";

export function IdentitySettingsForm({ form }: { form: SettingsForm }) {
  return (
    <div className="rounded-md border bg-card px-7 py-6.5">
      <div className="mb-1 font-heading font-semibold text-[17px] text-foreground-hi">
        Identité et coordonnées
      </div>
      <p className="mb-5.5 text-muted-foreground-3 text-sm leading-relaxed">
        Composent l'en-tête de vos CRA et de vos factures.
      </p>

      <div className="mb-5 flex items-center gap-3 rounded-md border bg-muted px-3.5 py-3">
        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-md bg-primary/15">
          <House aria-hidden className="size-3.75 text-primary-text" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-foreground-hi text-sm">
            Auto-entrepreneur
          </span>
          <span className="mt-0.5 block text-muted-foreground-3 text-xs">
            Seul statut géré pour l'instant. Les sociétés arriveront plus tard.
          </span>
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="tradeName">
          {(field) => (
            <FormTextField
              field={field}
              label="Nom commercial"
              labelClassName={LABEL}
              placeholder="Nom sous lequel vous facturez"
            />
          )}
        </form.Field>

        <form.Field name="siret">
          {(field) => (
            <FormTextField
              field={field}
              font="mono"
              label="SIRET"
              labelClassName={LABEL}
              placeholder="000 000 000 00000"
            />
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.vatRegime}>
          {(vatRegime) =>
            vatRegime === 0 ? (
              <div>
                <span className={`mb-1.5 block ${LABEL}`}>
                  TVA intracommunautaire
                </span>
                <div className="flex h-10 items-center rounded-md border border-border-3 border-dashed bg-muted px-3 text-muted-foreground-3 text-sm">
                  Non assujetti · franchise en base
                </div>
              </div>
            ) : (
              <form.Field name="vatNumber">
                {(field) => (
                  <FormTextField
                    field={field}
                    font="mono"
                    label="TVA intracommunautaire"
                    labelClassName={LABEL}
                    placeholder="FR00 000000000"
                  />
                )}
              </form.Field>
            )
          }
        </form.Subscribe>

        <form.Field name="signatureCity">
          {(field) => (
            <FormTextField
              field={field}
              label="Lieu de signature"
              labelClassName={LABEL}
              placeholder="Ville"
            />
          )}
        </form.Field>

        <form.Field name="contactEmail">
          {(field) => (
            <FormTextField
              field={field}
              label="Email"
              labelClassName={LABEL}
              placeholder="contact@exemple.fr"
              type="email"
            />
          )}
        </form.Field>

        <form.Field name="phone">
          {(field) => (
            <FormTextField
              field={field}
              label="Téléphone"
              labelClassName={LABEL}
              placeholder="00 00 00 00 00"
            />
          )}
        </form.Field>
      </div>

      <div className="mt-6.5 mb-3 flex items-baseline justify-between gap-3">
        <span className={EYEBROW}>Adresse de la société</span>
        <span className="text-muted-foreground-3 text-xs">
          Figure sur les documents
        </span>
      </div>
      <AddressFields
        complementLabel="Complément d'adresse"
        gapClassName="gap-4"
        labelClassName={LABEL}
        names={COMPANY_ADDRESS_NAMES}
        renderField={(name, render) => (
          <form.Field name={name}>{(field) => render(field)}</form.Field>
        )}
        setFieldValue={(name, value) => form.setFieldValue(name, value)}
        streetLabel="Adresse"
        withPlaceholders
      />

      <div className="mt-6.5 mb-3 flex items-baseline justify-between gap-3">
        <span className={EYEBROW}>Adresse personnelle</span>
        <form.Field name="homeAddressSameAsCompany">
          {(field) => (
            // biome-ignore lint/a11y/noLabelWithoutControl: Base UI's Switch renders a hidden input beside its span, so the wrapping label is its control
            <label className="flex cursor-pointer items-center gap-2 text-muted-foreground-3 text-xs">
              <Switch
                checked={field.state.value}
                onCheckedChange={field.handleChange}
              />
              Identique à la société
            </label>
          )}
        </form.Field>
      </div>

      <form.Subscribe
        selector={(state) => state.values.homeAddressSameAsCompany}
      >
        {(isSame) =>
          isSame ? (
            <div className="rounded-md border bg-muted px-3.5 py-3 text-muted-foreground-3 text-sm leading-relaxed">
              Vous êtes domicilié à l'adresse de la société.
            </div>
          ) : (
            <>
              <AddressFields
                complementLabel="Complément d'adresse"
                gapClassName="gap-4"
                labelClassName={LABEL}
                names={HOME_ADDRESS_NAMES}
                renderField={(name, render) => (
                  <form.Field name={name}>
                    {(field) => render(field)}
                  </form.Field>
                )}
                setFieldValue={(name, value) => form.setFieldValue(name, value)}
                streetLabel="Adresse"
                withPlaceholders
              />
              <p className="mt-2.5 text-muted-foreground-3 text-xs leading-relaxed">
                Utilisée pour les démarches URSSAF et impôts, jamais imprimée
                sur les CRA ni les factures.
              </p>
            </>
          )
        }
      </form.Subscribe>

      <form.Subscribe selector={(state) => state.values.signatureCity}>
        {(city) => (
          <p className="mt-4.5 text-muted-foreground-3 text-xs">
            « Fait à {city.trim() === "" ? "…" : city} » apparaîtra sur les
            documents signés.
          </p>
        )}
      </form.Subscribe>
    </div>
  );
}
