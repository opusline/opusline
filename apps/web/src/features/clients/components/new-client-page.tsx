import type { ClientType, Color, CreateClientData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { ChipGroup, ChipOption } from "@opusline/ui/components/chip";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { Separator } from "@opusline/ui/components/separator";
import { Swatch, SwatchGroup } from "@opusline/ui/components/swatch";
import { Textarea } from "@opusline/ui/components/textarea";
import { cn } from "@opusline/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { CircleAlert, InfoIcon } from "lucide-react";
import { useState } from "react";

import { initials } from "@/lib/initials";

import { type ClientFormValues, toClientPayload } from "../lib/client-form";
import {
  CLIENT_TYPE_HINTS,
  CLIENT_TYPE_OPTION_LABELS,
  CLIENT_TYPES,
  COLOR_CLASSES,
  COLOR_LABELS,
  COLORS,
  paymentTermsLabel,
  randomColor,
} from "../lib/labels";
import { PaymentTermsPicker } from "./payment-terms-picker";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

type NewClientPageProps = {
  onSubmit: (
    body: CreateClientData,
  ) => Promise<Record<string, { message: string }> | null | undefined>;
  onCancel: () => void;
  isPending?: boolean;
  error?: string | null;
};

export function NewClientPage({
  onSubmit,
  onCancel,
  isPending,
  error,
}: NewClientPageProps) {
  const [defaultColor] = useState<Color>(randomColor);

  const form = useForm({
    defaultValues: {
      name: "",
      type: 0,
      siret: "",
      vatNumber: "",
      billingAddress: "",
      billingContactName: "",
      billingEmail: "",
      color: defaultColor,
      paymentTermsDays: 45,
    } as ClientFormValues,
    validators: {
      onSubmitAsync: async ({ value }) => {
        const fieldErrors = await onSubmit(toClientPayload(value));

        return fieldErrors ? { fields: fieldErrors } : null;
      },
    },
  });

  return (
    <div className="grid max-w-5xl items-start gap-4 md:grid-cols-2">
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2 text-muted-foreground-2 text-sm">
          <Link
            className="text-link transition-colors hover:text-link-hover"
            to="/clients"
          >
            Clients
          </Link>
          <span>/</span>
          <span className="text-muted-foreground">Nouveau</span>
        </div>
        <h1 className="mb-1 font-heading font-semibold text-2xl text-foreground-hi">
          Nouveau client
        </h1>
        <p className="mb-5 text-muted-foreground-3 text-sm">
          Le type détermine qui figure sur la facture et si un CRA est attendu.
        </p>

        <form
          className="flex flex-col gap-5 rounded-md border bg-card p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          {error ? (
            <Alert variant="warn">
              <CircleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    className="text-foreground-3"
                    htmlFor={field.name}
                  >
                    Raison sociale
                  </FieldLabel>
                  <Input
                    aria-invalid={isInvalid}
                    id={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Nordlys"
                    value={field.state.value}
                  />
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="type">
            {(field) => (
              <Field>
                <FieldLabel
                  className="text-foreground-3"
                  htmlFor={`${field.name}-options`}
                >
                  Type de relation
                </FieldLabel>
                <ChipGroup
                  aria-label="Type de relation"
                  className="items-stretch"
                  id={`${field.name}-options`}
                  value={[String(field.state.value)]}
                  onValueChange={(value) => {
                    const next = value[0];

                    if (typeof next === "string") {
                      field.handleChange(Number(next) as ClientType);
                    }
                  }}
                >
                  {CLIENT_TYPES.map((clientType) => (
                    <ChipOption
                      className="min-w-48 flex-1"
                      key={clientType}
                      value={String(clientType)}
                      label={CLIENT_TYPE_OPTION_LABELS[clientType]}
                      hint={CLIENT_TYPE_HINTS[clientType]}
                    />
                  ))}
                </ChipGroup>
              </Field>
            )}
          </form.Field>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="siret">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className="text-foreground-3"
                      htmlFor={field.name}
                    >
                      SIRET
                    </FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      font="mono"
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="123 456 789 00012"
                      value={field.state.value}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="vatNumber">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className="text-foreground-3"
                      htmlFor={field.name}
                    >
                      TVA intracommunautaire
                    </FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      font="mono"
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="FR12 123456789"
                      value={field.state.value}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <form.Field name="billingAddress">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    className="text-foreground-3"
                    htmlFor={field.name}
                  >
                    Adresse de facturation
                  </FieldLabel>
                  <Textarea
                    aria-invalid={isInvalid}
                    id={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder={"12 rue de la Paix\n44000 Nantes"}
                    value={field.state.value}
                  />
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              );
            }}
          </form.Field>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="billingContactName">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className="text-foreground-3"
                      htmlFor={field.name}
                    >
                      Contact facturation
                    </FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Camille Dupont"
                      value={field.state.value}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="billingEmail">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className="text-foreground-3"
                      htmlFor={field.name}
                    >
                      Email d'envoi des factures
                    </FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="factures@nordlys.example"
                      type="email"
                      value={field.state.value}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <form.Field name="color">
            {(field) => (
              <Field>
                <div className="flex items-baseline gap-2">
                  <FieldLabel
                    className="text-foreground-3"
                    htmlFor={`${field.name}-swatches`}
                  >
                    Couleur par défaut
                  </FieldLabel>
                  <span className="text-muted-foreground-3 text-xs">
                    {COLOR_LABELS[field.state.value]} · héritée par ses missions
                  </span>
                </div>
                <SwatchGroup
                  aria-label="Couleur par défaut"
                  id={`${field.name}-swatches`}
                  value={[String(field.state.value)]}
                  onValueChange={(value) => {
                    const next = value[0];

                    if (typeof next === "string") {
                      field.handleChange(Number(next) as Color);
                    }
                  }}
                >
                  {COLORS.map((color) => (
                    <Swatch
                      key={color}
                      aria-label={COLOR_LABELS[color]}
                      className={COLOR_CLASSES[color]}
                      title={COLOR_LABELS[color]}
                      value={String(color)}
                    />
                  ))}
                </SwatchGroup>
              </Field>
            )}
          </form.Field>

          <form.Field name="paymentTermsDays">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    className="text-foreground-3"
                    htmlFor={`${field.name}-options`}
                  >
                    Délai de paiement
                  </FieldLabel>
                  <PaymentTermsPicker
                    id={`${field.name}-options`}
                    onChange={field.handleChange}
                    value={field.state.value}
                  />
                  <p className="text-muted-foreground-3 text-xs">
                    Sert à calculer la date d'échéance et à signaler les
                    retards. Par défaut : 45 jours.
                  </p>
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              );
            }}
          </form.Field>

          <div className="flex gap-2 pt-1">
            <Button disabled={isPending} size="2xl" type="submit">
              Créer le client
            </Button>
            <Button
              disabled={isPending}
              onClick={onCancel}
              size="2xl"
              type="button"
              variant="ghost"
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>

      <form.Subscribe selector={(state) => state.values}>
        {(values) => (
          <div className="flex min-w-0 flex-col gap-3.5">
            <div>
              <div className={cn(EYEBROW_CLASSES, "mb-2.5")}>
                Aperçu dans la liste
              </div>
              <div className="flex items-center gap-3 rounded-md border bg-card px-5 py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border-2 bg-secondary font-medium text-muted-foreground-4 text-xs">
                  {initials(values.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className={cn(
                        "size-2.5 shrink-0 rounded-sm",
                        COLOR_CLASSES[values.color],
                      )}
                    />
                    <span
                      className={cn(
                        "truncate text-sm",
                        values.name.trim() === ""
                          ? "text-muted-foreground-5"
                          : "font-medium text-foreground-hi",
                      )}
                    >
                      {values.name.trim() === ""
                        ? "Nom du client"
                        : values.name}
                    </span>
                  </div>
                  <div className="mt-0.75 text-muted-foreground-3 text-xs">
                    Paiement à {paymentTermsLabel(values.paymentTermsDays)}
                  </div>
                </div>
              </div>
            </div>

            {values.type === 1 && (
              <div className="rounded-md border border-primary/32 bg-primary/7 px-5 py-4">
                <div className="flex gap-2.5">
                  <InfoIcon
                    aria-hidden
                    className="mt-px size-4 shrink-0 text-primary-text-strong"
                    strokeWidth={2}
                  />
                  <div>
                    <div className="mb-1.5 font-medium text-primary-text text-sm">
                      Facturation via intermédiaire
                    </div>
                    <div className="text-foreground-4 text-sm leading-relaxed">
                      Les missions de ce client demanderont un{" "}
                      <strong className="font-medium text-foreground-2">
                        client final
                      </strong>
                      , et activeront le CRA mensuel par défaut.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-md border bg-card px-5 py-4">
              <div className={cn(EYEBROW_CLASSES, "mb-3")}>
                Ce qui reste à faire
              </div>
              <div className="flex flex-col gap-3">
                {[
                  "Créer le client",
                  "Lui associer une mission et son tarif",
                  "La mission apparaît en ligne dans la semaine",
                ].map((step, index) => (
                  <div className="flex items-start gap-2.5" key={step}>
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-xs",
                        index === 0
                          ? "border-primary/45 bg-primary/15 text-primary-text"
                          : "border-border-3 text-muted-foreground-3",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        index === 0
                          ? "text-foreground-3"
                          : "text-muted-foreground-3",
                      )}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </form.Subscribe>
    </div>
  );
}
