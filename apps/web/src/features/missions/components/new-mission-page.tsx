import type {
  BillingMode,
  ClientWithMissionsData,
  Color,
  CreateMissionData,
  EntryRounding,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Chip, ChipGroup } from "@opusline/ui/components/chip";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { HelpTip } from "@opusline/ui/components/help-tip";
import { Input } from "@opusline/ui/components/input";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
import { Swatch, SwatchGroup } from "@opusline/ui/components/swatch";
import { Switch } from "@opusline/ui/components/switch";
import { cn } from "@opusline/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { CircleAlert, InfoIcon } from "lucide-react";
import { useState } from "react";
import { FormTextField } from "@/components/form-text-field";
import { useMoneyFormat } from "@/components/money-format-provider";
import { formatRate, formatWholeAmount, parseRateToCents } from "@/lib/billing";
import { isInternalClient } from "@/lib/client-types";
import { todayCalendarDate } from "@/lib/dates";
import {
  entryRoundingHint,
  entryRoundingLabel,
  entryRoundingOrder,
} from "@/lib/entry-rounding";
import type { FormSubmitResult } from "@/lib/form";
import {
  COLOR_CLASSES,
  COLOR_LABELS,
  COLOR_WASH_CLASSES,
  COLORS,
} from "@/lib/palette";
import { BILLING_MODE_LABELS } from "../lib/labels";
import { MissionRateField } from "./mission-rate-field";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

const BILLING_MODES: BillingMode[] = [0, 1, 2];

const MONTHLY_BILLABLE_DAYS = 20;
const MONTHLY_BILLABLE_HOURS = 140;
const URSSAF_PROVISION_RATE = 0.26;

type MissionFormValues = {
  name: string;
  endClientName: string;
  startDate: string;
  endDate: string;
};

type NewMissionPageProps = {
  clients: ClientWithMissionsData[];
  hasFrenchFiscality: boolean;
  initialClientSlug?: string;
  onSubmit: (
    clientSlug: string,
    body: CreateMissionData,
  ) => Promise<FormSubmitResult>;
  onCancel: () => void;
  isPending?: boolean;
  error?: string | null;
};

export function NewMissionPage({
  clients,
  hasFrenchFiscality,
  initialClientSlug,
  onSubmit,
  onCancel,
  isPending,
  error,
}: NewMissionPageProps) {
  const format = useMoneyFormat();
  const activeClients = clients.filter((client) => client.archivedAt === null);

  const [selectedSlug, setSelectedSlug] = useState(
    () =>
      activeClients.find((client) => client.slug === initialClientSlug)?.slug ??
      activeClients[0]?.slug ??
      "",
  );
  const selectedClient = activeClients.find(
    (client) => client.slug === selectedSlug,
  );

  const [billingMode, setBillingMode] = useState<BillingMode>(0);
  const [rateDraft, setRateDraft] = useState("");
  const [isRateMissing, setIsRateMissing] = useState(false);
  const [rounding, setRounding] = useState<EntryRounding>(0);
  const [color, setColor] = useState<Color | null>(null);
  const [craRequired, setCraRequired] = useState(
    () => selectedClient?.type === 1,
  );

  const isEsn = selectedClient?.type === 1;
  const isInternal =
    selectedClient !== undefined && isInternalClient(selectedClient.type);
  const isForfait = billingMode === 2;
  const rateCents = isInternal
    ? null
    : parseRateToCents(format.locale, rateDraft);

  const form = useForm({
    defaultValues: {
      name: "",
      endClientName: "",
      startDate: todayCalendarDate(),
      endDate: "",
    } as MissionFormValues,
    validators: {
      onSubmitAsync: async ({ value }) => {
        if (selectedClient === undefined) {
          return "Sélectionnez un client.";
        }

        if (!isInternal && rateCents === null) {
          setIsRateMissing(true);
          return "Le tarif est manquant ou invalide.";
        }

        const body: CreateMissionData = {
          name: value.name.trim(),
          billingMode,
          rate:
            rateCents === null
              ? null
              : { amount: rateCents, currency: format.currency },
          rounding: isForfait ? null : rounding,
          craRequired: isEsn ? craRequired : null,
          endClientName:
            isEsn && value.endClientName.trim() !== ""
              ? value.endClientName.trim()
              : null,
          color,
          startDate: value.startDate === "" ? null : value.startDate,
          endDate: value.endDate === "" ? null : value.endDate,
        };

        const result = await onSubmit(selectedClient.slug, body);

        return result.status === "invalid"
          ? { fields: result.fieldErrors }
          : null;
      },
    },
  });

  const pickClient = (slug: string) => {
    setSelectedSlug(slug);
    const client = activeClients.find((candidate) => candidate.slug === slug);
    setCraRequired(client?.type === 1);
    setColor(null);

    if (client !== undefined && isInternalClient(client.type)) {
      setBillingMode(0);
      setRateDraft("");
      setIsRateMissing(false);
    }
  };

  if (activeClients.length === 0) {
    return (
      <div className="max-w-lg">
        <h1 className="mb-1 font-heading font-semibold text-2xl text-foreground-hi">
          Nouvelle mission
        </h1>
        <p className="mb-5 text-muted-foreground-3 text-sm">
          Une mission appartient à un client. Créez d'abord un client actif.
        </p>
        <Button render={<Link to="/clients/new" />} size="2xl">
          Créer un client
        </Button>
      </div>
    );
  }

  const barColor = color ?? selectedClient?.color ?? 0;
  const monthlyCents =
    rateCents === null
      ? null
      : isForfait
        ? rateCents
        : billingMode === 0
          ? rateCents * MONTHLY_BILLABLE_DAYS
          : rateCents * MONTHLY_BILLABLE_HOURS;
  const provisionCents =
    monthlyCents === null
      ? null
      : Math.round(monthlyCents * URSSAF_PROVISION_RATE);

  return (
    <div className="grid max-w-270 items-start gap-4 md:grid-cols-2">
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2 text-muted-foreground-2 text-sm">
          <Link
            className="text-link transition-colors hover:text-link-hover"
            to="/clients"
          >
            Clients
          </Link>
          <span>/</span>
          <span className="text-muted-foreground">Nouvelle mission</span>
        </div>
        <h1 className="mb-1 font-heading font-semibold text-2xl text-foreground-hi">
          Nouvelle mission
        </h1>
        <p className="mb-5 text-muted-foreground-3 text-sm">
          Une mission = une ligne dans la grille de la semaine, et un tarif qui
          la valorise.
        </p>

        <form
          className="flex flex-col gap-4 rounded-md border bg-card px-6 py-5"
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
            {(field) => (
              <FormTextField
                field={field}
                label="Nom de la mission"
                labelClassName="text-foreground-3"
                placeholder="Callisto front"
              />
            )}
          </form.Field>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <FieldLabel
                className="text-foreground-3"
                htmlFor="mission-client-options"
              >
                Client
              </FieldLabel>
              <Link
                className="text-link text-xs transition-colors hover:text-link-hover"
                to="/clients/new"
              >
                + Nouveau client
              </Link>
            </div>
            <ChipGroup
              aria-label="Client"
              id="mission-client-options"
              value={[selectedSlug]}
              onValueChange={(value) => {
                const next = value[0];

                if (typeof next === "string") {
                  pickClient(next);
                }
              }}
            >
              {activeClients.map((client) => (
                <Chip key={client.slug} size="lg" value={client.slug}>
                  {client.name}
                </Chip>
              ))}
            </ChipGroup>
          </div>

          <div className="h-px bg-border" />

          {!isInternal && (
            <Field>
              <FieldLabel
                className="text-foreground-3"
                htmlFor="mission-billing-mode"
              >
                Mode de facturation
              </FieldLabel>
              <SegmentedControl
                aria-label="Mode de facturation"
                id="mission-billing-mode"
                value={[String(billingMode)]}
                onValueChange={(value) => {
                  const next = value[0];

                  if (typeof next === "string") {
                    setBillingMode(Number(next) as BillingMode);
                    setRateDraft("");
                    setIsRateMissing(false);
                  }
                }}
              >
                {BILLING_MODES.map((mode) => (
                  <SegmentedControlItem key={mode} value={String(mode)}>
                    {BILLING_MODE_LABELS[mode]}
                  </SegmentedControlItem>
                ))}
              </SegmentedControl>
            </Field>
          )}

          {!isInternal && (
            <div className="grid items-start gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
              <MissionRateField
                billingMode={billingMode}
                className={cn("min-w-0", isForfait && "sm:col-span-2")}
                id="mission-rate"
                isRateMissing={isRateMissing}
                labelClassName="text-foreground-3"
                onDraftChange={(draft) => {
                  setRateDraft(draft);
                  setIsRateMissing(false);
                }}
                rateDraft={rateDraft}
              />
              {!isForfait && (
                <Field className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <FieldLabel
                      className="text-foreground-3"
                      htmlFor="mission-rounding"
                    >
                      Arrondi des entrées
                    </FieldLabel>
                    <HelpTip label="Qu'est-ce que l'arrondi ?">
                      {entryRoundingHint(billingMode)}
                    </HelpTip>
                  </div>
                  <ChipGroup
                    aria-label="Arrondi des entrées"
                    id="mission-rounding"
                    value={[String(rounding)]}
                    onValueChange={(value) => {
                      const next = value[0];

                      if (typeof next === "string") {
                        setRounding(Number(next) as EntryRounding);
                      }
                    }}
                  >
                    {entryRoundingOrder(billingMode).map((entryRounding) => (
                      <Chip
                        key={entryRounding}
                        size="xl"
                        value={String(entryRounding)}
                      >
                        {entryRoundingLabel(entryRounding, billingMode)}
                      </Chip>
                    ))}
                  </ChipGroup>
                </Field>
              )}
            </div>
          )}

          {isForfait && !isInternal && (
            <div className="flex gap-2.5 rounded-md border bg-muted px-4 py-3.5">
              <InfoIcon
                aria-hidden
                className="mt-px size-3.75 shrink-0 text-muted-foreground-2"
                strokeWidth={1.9}
              />
              <div className="text-muted-foreground text-sm leading-relaxed">
                Au forfait, le temps est suivi pour votre marge mais n'entre pas
                dans le montant facturé.
              </div>
            </div>
          )}

          {!isInternal && <div className="h-px bg-border" />}

          {isEsn && (
            <form.Field name="endClientName">
              {(field) => {
                const isInvalid = !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className="text-foreground-3"
                      htmlFor={field.name}
                    >
                      Client final{" "}
                      <span className="text-muted-foreground-5">
                        (facturé par {selectedClient?.name})
                      </span>
                    </FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Callisto"
                      value={field.state.value}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="startDate">
              {(field) => (
                <FormTextField
                  field={field}
                  font="mono"
                  label="Début"
                  labelClassName="text-foreground-3"
                  type="date"
                />
              )}
            </form.Field>
            <form.Field name="endDate">
              {(field) => {
                const isInvalid = !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className="text-foreground-3"
                      htmlFor={field.name}
                    >
                      Fin prévue{" "}
                      <span className="text-muted-foreground-5">
                        (optionnel)
                      </span>
                    </FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      font="mono"
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      type="date"
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

          <div>
            <div className="mb-2 flex items-baseline gap-2">
              <FieldLabel
                className="text-foreground-3"
                htmlFor="mission-color-swatches"
              >
                Couleur de la ligne
              </FieldLabel>
              <span className="text-muted-foreground-3 text-xs">
                {COLOR_LABELS[barColor]} ·{" "}
                {color === null
                  ? `héritée de ${selectedClient?.name}`
                  : "propre à la mission"}
              </span>
            </div>
            <SwatchGroup
              aria-label="Couleur de la ligne"
              id="mission-color-swatches"
              value={[String(barColor)]}
              onValueChange={(value) => {
                const next = value[0];

                if (typeof next === "string") {
                  setColor(Number(next) as Color);
                }
              }}
            >
              {COLORS.map((paletteColor) => (
                <Swatch
                  key={paletteColor}
                  aria-label={COLOR_LABELS[paletteColor]}
                  className={COLOR_CLASSES[paletteColor]}
                  title={COLOR_LABELS[paletteColor]}
                  value={String(paletteColor)}
                />
              ))}
            </SwatchGroup>
          </div>

          {isEsn && (
            <>
              <div className="h-px bg-border" />
              <div className="flex items-center gap-3">
                <Switch
                  aria-label="CRA mensuel requis"
                  checked={craRequired}
                  id="mission-cra"
                  onCheckedChange={(checked) => setCraRequired(checked)}
                />
                <div>
                  <label
                    className="text-foreground-3 text-sm"
                    htmlFor="mission-cra"
                  >
                    CRA mensuel requis
                  </label>
                  <div className="mt-0.5 text-muted-foreground-3 text-xs">
                    Exigé par {selectedClient?.name} en fin de mois · export PDF
                    pré-rempli.
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-2 pt-1">
            <Button disabled={isPending} size="2xl" type="submit">
              Créer la mission
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

      <form.Subscribe selector={(state) => state.values.name}>
        {(missionName) => (
          <div className="flex min-w-0 flex-col gap-3.5">
            <div>
              <div className={cn(EYEBROW_CLASSES, "mb-2.5")}>
                Aperçu dans la semaine
              </div>
              <div className="overflow-hidden rounded-md border bg-card">
                <div className="grid grid-cols-[1fr_6rem_6rem]">
                  <div className={cn(EYEBROW_CLASSES, "border-b px-4 py-3.5")}>
                    Mission
                  </div>
                  <div
                    className={cn(
                      EYEBROW_CLASSES,
                      "border-b border-l px-2.5 py-3.5",
                    )}
                  >
                    Lun
                  </div>
                  <div
                    className={cn(
                      EYEBROW_CLASSES,
                      "border-b border-l px-2.5 py-3.5",
                    )}
                  >
                    Mar
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.75 px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className={cn(
                          "h-3 w-0.75 shrink-0 rounded-sm",
                          COLOR_CLASSES[barColor],
                        )}
                      />
                      <span
                        className={cn(
                          "truncate text-sm",
                          missionName.trim() === ""
                            ? "text-muted-foreground-5"
                            : "text-foreground-hi",
                        )}
                      >
                        {missionName.trim() === ""
                          ? "Nom de la mission"
                          : missionName}
                      </span>
                    </div>
                    <span className="truncate pl-3 text-muted-foreground-2 text-xs">
                      {selectedClient?.name}
                      {rateCents !== null &&
                        ` · ${formatRate(format, rateCents, billingMode)}`}
                    </span>
                  </div>
                  <div className="border-l p-2.5">
                    <div
                      className={cn(
                        "rounded-sm border p-2 text-center",
                        COLOR_WASH_CLASSES[barColor],
                      )}
                    >
                      <div className="font-mono text-sm tabular-nums">
                        {billingMode === 1 ? "1,5 h" : "1 j"}
                      </div>
                    </div>
                  </div>
                  <div className="border-l p-2.5" />
                </div>
              </div>
            </div>

            <div className="rounded-md border bg-card p-5">
              <div className={cn(EYEBROW_CLASSES, "mb-3")}>
                {isForfait ? "Montant de la mission" : "Projection mensuelle"}
              </div>
              <div className="whitespace-nowrap font-mono text-2xl text-primary-text tabular-nums leading-none">
                {monthlyCents === null
                  ? "—"
                  : formatWholeAmount(format, monthlyCents)}
                <span className="ml-1.5 text-muted-foreground-3 text-sm">
                  HT
                </span>
              </div>
              <div className="mt-2.5 text-muted-foreground-3 text-sm">
                {isForfait
                  ? "montant du forfait, facturé en une fois"
                  : billingMode === 0
                    ? `sur ${MONTHLY_BILLABLE_DAYS} jours facturés · hypothèse d'un mois plein`
                    : `sur ${MONTHLY_BILLABLE_HOURS} h facturées · hypothèse d'un mois plein`}
              </div>
              {/*
                URSSAF provisions only exist for a business established in
                France — abroad the projection stops at the gross figure.
              */}
              {hasFrenchFiscality && (
                <>
                  <div className="mt-3 flex justify-between gap-3 border-t pt-3 text-sm">
                    <span className="text-muted-foreground-3">
                      Provision URSSAF · 26 %
                    </span>
                    <span className="whitespace-nowrap font-mono text-foreground-2 tabular-nums">
                      {provisionCents === null
                        ? "—"
                        : formatWholeAmount(format, provisionCents)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground-3">
                      Net estimé{" "}
                      <span className="text-muted-foreground-5">
                        · TVA en sus, à reverser
                      </span>
                    </span>
                    <span className="whitespace-nowrap font-mono text-foreground-hi tabular-nums">
                      {monthlyCents === null || provisionCents === null
                        ? "—"
                        : formatWholeAmount(
                            format,
                            monthlyCents - provisionCents,
                          )}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="rounded-md border bg-card px-5 py-4">
              <div className="text-muted-foreground text-sm leading-relaxed">
                Le mode de facturation fixe l'unité de saisie :{" "}
                <strong className="font-medium text-foreground-2">jours</strong>{" "}
                pour un TJM,{" "}
                <strong className="font-medium text-foreground-2">
                  heures
                </strong>{" "}
                sinon. Il reste modifiable plus tard sans toucher aux entrées
                passées.
              </div>
            </div>
          </div>
        )}
      </form.Subscribe>
    </div>
  );
}
