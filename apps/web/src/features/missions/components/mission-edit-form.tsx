import type {
  BillingMode,
  ClientWithMissionsData,
  Color,
  EntryRounding,
  MissionData,
  UpdateMissionData,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Chip, ChipGroup } from "@opusline/ui/components/chip";
import { Field, FieldLabel } from "@opusline/ui/components/field";
import { HelpTip } from "@opusline/ui/components/help-tip";
import { Swatch, SwatchGroup } from "@opusline/ui/components/swatch";
import { Switch } from "@opusline/ui/components/switch";
import { useForm } from "@tanstack/react-form";
import { CircleAlert, PencilIcon } from "lucide-react";
import { useState } from "react";
import { FormTextField } from "@/components/form-text-field";
import { useMoneyFormat } from "@/components/money-format-provider";
import {
  formatAmount,
  type MoneyFormat,
  parseRateToCents,
} from "@/lib/billing";
import { isInternalClient } from "@/lib/client-types";
import {
  entryRoundingHint,
  entryRoundingLabel,
  entryRoundingOrder,
} from "@/lib/entry-rounding";
import type { FormSubmitResult } from "@/lib/form";
import { COLOR_CLASSES, COLOR_LABELS, COLORS } from "@/lib/palette";
import { BILLING_MODE_LABELS } from "../lib/labels";
import { MissionRateField } from "./mission-rate-field";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";
const EDIT_LABEL_CLASSES = "text-muted-foreground-3 text-xs";

const BILLING_MODES: BillingMode[] = [0, 1, 2];

type MissionEditFormValues = {
  name: string;
  endClientName: string;
  startDate: string;
  endDate: string;
};

function initialRateDraft(format: MoneyFormat, mission: MissionData): string {
  if (mission.rate === null) {
    return "";
  }

  return formatAmount(format, mission.rate.amount);
}

type MissionEditFormProps = {
  mission: MissionData;
  client: ClientWithMissionsData;
  onSubmit: (body: UpdateMissionData) => Promise<FormSubmitResult>;
  onCancel: () => void;
  isPending?: boolean;
  error?: string | null;
};

export function MissionEditForm({
  mission,
  client,
  onSubmit,
  onCancel,
  isPending,
  error,
}: MissionEditFormProps) {
  const format = useMoneyFormat();
  const isEsn = client.type === 1;
  const isInternal = isInternalClient(client.type);

  const [billingMode, setBillingMode] = useState<BillingMode>(
    mission.billingMode,
  );
  const [rateDraft, setRateDraft] = useState(() =>
    initialRateDraft(format, mission),
  );
  const [isRateMissing, setIsRateMissing] = useState(false);
  const [rounding, setRounding] = useState<EntryRounding>(
    mission.rounding ?? 0,
  );
  const [color, setColor] = useState<Color | null>(mission.color);
  const [craRequired, setCraRequired] = useState(mission.craRequired);

  const isForfait = billingMode === 2;
  const rateCents = isInternal
    ? null
    : parseRateToCents(format.locale, rateDraft);
  const displayedColor = color ?? client.color;

  const form = useForm({
    defaultValues: {
      name: mission.name,
      endClientName: mission.endClientName ?? "",
      startDate: mission.startDate ?? "",
      endDate: mission.endDate ?? "",
    } as MissionEditFormValues,
    validators: {
      onSubmitAsync: async ({ value }) => {
        if (!isInternal && rateCents === null) {
          setIsRateMissing(true);
          return "Le tarif est manquant ou invalide.";
        }

        const body: UpdateMissionData = {
          name: value.name.trim(),
          billingMode,
          status: mission.status,
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
          notes: mission.notes,
          startDate: value.startDate === "" ? null : value.startDate,
          endDate: value.endDate === "" ? null : value.endDate,
        };

        const result = await onSubmit(body);

        return result.status === "invalid"
          ? { fields: result.fieldErrors }
          : null;
      },
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="mb-5 flex items-center gap-3 border-b pb-3.5">
        <PencilIcon
          aria-hidden
          className="size-3.75 shrink-0 text-muted-foreground-2"
          strokeWidth={1.8}
        />
        <span className="text-foreground-hi text-sm">Modifier la mission</span>
        <span className="flex-1" />
        <span className="text-muted-foreground-3 text-xs">
          Les entrées passées ne sont pas affectées
        </span>
      </div>

      {error ? (
        <Alert className="mb-3.5" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid items-start gap-3.5 md:grid-cols-2">
        <div className="rounded-md border bg-card p-5">
          <div className={`${EYEBROW_CLASSES} mb-4`}>Mission</div>
          <div className="flex flex-col gap-3.5">
            <form.Field name="name">
              {(field) => (
                <FormTextField
                  field={field}
                  label="Nom de la mission"
                  labelClassName={EDIT_LABEL_CLASSES}
                />
              )}
            </form.Field>

            <Field>
              <div className="flex items-baseline gap-2">
                <FieldLabel
                  className={EDIT_LABEL_CLASSES}
                  htmlFor="mission-edit-swatches"
                >
                  Couleur de la ligne
                </FieldLabel>
                <span className="text-muted-foreground-5 text-xs">
                  {COLOR_LABELS[displayedColor]}
                  {color === null && ` · héritée de ${client.name}`}
                </span>
              </div>
              <SwatchGroup
                aria-label="Couleur de la ligne"
                id="mission-edit-swatches"
                value={[String(displayedColor)]}
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
            </Field>

            {!isInternal && (
              <>
                <Field>
                  <FieldLabel
                    className={EDIT_LABEL_CLASSES}
                    htmlFor="mission-edit-billing-mode"
                  >
                    Mode de facturation
                  </FieldLabel>
                  <ChipGroup
                    aria-label="Mode de facturation"
                    id="mission-edit-billing-mode"
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
                      <Chip key={mode} size="lg" value={String(mode)}>
                        {BILLING_MODE_LABELS[mode]}
                      </Chip>
                    ))}
                  </ChipGroup>
                </Field>

                <MissionRateField
                  billingMode={billingMode}
                  id="mission-edit-rate"
                  isRateMissing={isRateMissing}
                  labelClassName={EDIT_LABEL_CLASSES}
                  onDraftChange={(draft) => {
                    setRateDraft(draft);
                    setIsRateMissing(false);
                  }}
                  rateDraft={rateDraft}
                />

                {!isForfait && (
                  <Field>
                    <div className="flex items-center gap-1.5">
                      <FieldLabel
                        className={EDIT_LABEL_CLASSES}
                        htmlFor="mission-edit-rounding"
                      >
                        Arrondi des entrées
                      </FieldLabel>
                      <HelpTip label="Qu'est-ce que l'arrondi ?">
                        {entryRoundingHint(billingMode)}
                      </HelpTip>
                    </div>
                    <ChipGroup
                      aria-label="Arrondi des entrées"
                      id="mission-edit-rounding"
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
                          size="lg"
                          value={String(entryRounding)}
                        >
                          {entryRoundingLabel(entryRounding, billingMode)}
                        </Chip>
                      ))}
                    </ChipGroup>
                  </Field>
                )}
              </>
            )}
          </div>
        </div>

        <div className="rounded-md border bg-card p-5">
          <div className={`${EYEBROW_CLASSES} mb-4`}>Facturation</div>
          <div className="flex flex-col gap-3.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-muted-foreground-3 text-sm">Facturé à</span>
              <span className="text-foreground-2 text-sm">{client.name}</span>
            </div>
            {isEsn && (
              <>
                <form.Field name="endClientName">
                  {(field) => (
                    <FormTextField
                      field={field}
                      label="Client final"
                      labelClassName={EDIT_LABEL_CLASSES}
                      placeholder="Callisto"
                    />
                  )}
                </form.Field>
                <div className="flex items-center gap-3">
                  <Switch
                    aria-label="CRA mensuel requis"
                    checked={craRequired}
                    id="mission-edit-cra"
                    onCheckedChange={(checked) => setCraRequired(checked)}
                  />
                  <label
                    className="text-foreground-3 text-sm"
                    htmlFor="mission-edit-cra"
                  >
                    CRA mensuel requis
                  </label>
                </div>
              </>
            )}

            <div className="grid gap-3.5 sm:grid-cols-2">
              <form.Field name="startDate">
                {(field) => (
                  <FormTextField
                    field={field}
                    font="mono"
                    label="Début"
                    labelClassName={EDIT_LABEL_CLASSES}
                    type="date"
                  />
                )}
              </form.Field>
              <form.Field name="endDate">
                {(field) => (
                  <FormTextField
                    field={field}
                    font="mono"
                    label="Fin prévue"
                    labelClassName={EDIT_LABEL_CLASSES}
                    type="date"
                  />
                )}
              </form.Field>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t pt-4">
        <Button disabled={isPending} size="xl" type="submit">
          Enregistrer
        </Button>
        <Button
          disabled={isPending}
          onClick={onCancel}
          size="xl"
          type="button"
          variant="ghost"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
