import type {
  BillingMode,
  ClientWithMissionsData,
  Color,
  EntryRounding,
  MissionData,
  MoneyData,
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
import { FormDateField } from "@/components/form-date-field";
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
import { COLOR_CLASSES, COLORS, colorLabel } from "@/lib/palette";
import { m } from "@/paraglide/messages.js";
import { billingModeLabel } from "../lib/labels";
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

function initialRateDraft(
  format: MoneyFormat,
  money: MoneyData | null,
): string {
  return money === null ? "" : formatAmount(format, money.amount);
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
    initialRateDraft(format, mission.rate),
  );
  const [isRateMissing, setIsRateMissing] = useState(false);
  const [referenceRateDraft, setReferenceRateDraft] = useState(() =>
    initialRateDraft(format, mission.referenceDailyRate),
  );
  const [rounding, setRounding] = useState<EntryRounding>(
    mission.rounding ?? 0,
  );
  const [color, setColor] = useState<Color | null>(mission.color);
  const [craRequired, setCraRequired] = useState(mission.craRequired);

  const isForfait = billingMode === 2;
  const rateCents = isInternal
    ? null
    : parseRateToCents(format.locale, rateDraft);
  // Only a forfait carries one, and only a filled one is sent: an unreadable draft
  // clears the rate rather than failing the save, because it prices nothing.
  const referenceRateCents = isForfait
    ? parseRateToCents(format.locale, referenceRateDraft)
    : null;
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
          return m.missions_rate_missing();
        }

        const body: UpdateMissionData = {
          name: value.name.trim(),
          billingMode,
          status: mission.status,
          rate:
            rateCents === null
              ? null
              : // A stale render-context currency is refused by the API (422);
                // see settings-form.ts for the one case needing the snapshot.
                { amount: rateCents, currency: format.currency },
          referenceDailyRate:
            referenceRateCents === null
              ? null
              : { amount: referenceRateCents, currency: format.currency },
          rounding,
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
        <span className="text-foreground-hi text-sm">
          {m.missions_edit_title()}
        </span>
        <span className="flex-1" />
        <span className="text-muted-foreground-3 text-xs">
          {m.missions_edit_note()}
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
                  label={m.missions_name_label()}
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
                  {m.missions_color_label()}
                </FieldLabel>
                <span className="text-muted-foreground-5 text-xs">
                  {colorLabel(displayedColor)}
                  {color === null &&
                    ` · ${m.missions_color_inherited_from({ client: client.name })}`}
                </span>
              </div>
              <SwatchGroup
                aria-label={m.missions_color_label()}
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
                    aria-label={colorLabel(paletteColor)}
                    className={COLOR_CLASSES[paletteColor]}
                    title={colorLabel(paletteColor)}
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
                    {m.missions_billing_mode_label()}
                  </FieldLabel>
                  <ChipGroup
                    aria-label={m.missions_billing_mode_label()}
                    id="mission-edit-billing-mode"
                    value={[String(billingMode)]}
                    onValueChange={(value) => {
                      const next = value[0];

                      if (typeof next === "string") {
                        setBillingMode(Number(next) as BillingMode);
                        setRateDraft("");
                        setReferenceRateDraft("");
                        setIsRateMissing(false);
                      }
                    }}
                  >
                    {BILLING_MODES.map((mode) => (
                      <Chip key={mode} size="lg" value={String(mode)}>
                        {billingModeLabel(mode)}
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

                {isForfait && (
                  <MissionRateField
                    billingMode={0}
                    hint={m.missions_reference_rate_hint()}
                    id="mission-edit-reference-rate"
                    label={m.missions_reference_rate_label()}
                    labelClassName={EDIT_LABEL_CLASSES}
                    onDraftChange={setReferenceRateDraft}
                    placeholder={m.missions_reference_rate_placeholder()}
                    rateDraft={referenceRateDraft}
                  />
                )}

                <Field>
                  <div className="flex items-center gap-1.5">
                    <FieldLabel
                      className={EDIT_LABEL_CLASSES}
                      htmlFor="mission-edit-rounding"
                    >
                      {m.missions_rounding_label()}
                    </FieldLabel>
                    <HelpTip label={m.missions_rounding_help()}>
                      {entryRoundingHint(billingMode)}
                    </HelpTip>
                  </div>
                  <ChipGroup
                    aria-label={m.missions_rounding_label()}
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
              </>
            )}
          </div>
        </div>

        <div className="rounded-md border bg-card p-5">
          <div className={`${EYEBROW_CLASSES} mb-4`}>
            {m.common_billing_title()}
          </div>
          <div className="flex flex-col gap-3.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-muted-foreground-3 text-sm">
                {m.missions_billed_to()}
              </span>
              <span className="text-foreground-2 text-sm">{client.name}</span>
            </div>
            {isEsn && (
              <>
                <form.Field name="endClientName">
                  {(field) => (
                    <FormTextField
                      field={field}
                      label={m.missions_end_client_label()}
                      labelClassName={EDIT_LABEL_CLASSES}
                      placeholder="Callisto"
                    />
                  )}
                </form.Field>
                <div className="flex items-center gap-3">
                  <Switch
                    aria-label={m.missions_cra_required()}
                    checked={craRequired}
                    id="mission-edit-cra"
                    onCheckedChange={(checked) => setCraRequired(checked)}
                  />
                  <label
                    className="text-foreground-3 text-sm"
                    htmlFor="mission-edit-cra"
                  >
                    {m.missions_cra_required()}
                  </label>
                </div>
              </>
            )}

            <div className="grid gap-3.5 sm:grid-cols-2">
              <form.Field name="startDate">
                {(field) => (
                  <FormDateField
                    field={field}
                    label={m.missions_start_label()}
                    labelClassName={EDIT_LABEL_CLASSES}
                  />
                )}
              </form.Field>
              <form.Field name="endDate">
                {(field) => (
                  <FormDateField
                    field={field}
                    label={m.missions_end_label()}
                    labelClassName={EDIT_LABEL_CLASSES}
                  />
                )}
              </form.Field>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t pt-4">
        <Button disabled={isPending} size="xl" type="submit">
          {m.common_save()}
        </Button>
        <Button
          disabled={isPending}
          onClick={onCancel}
          size="xl"
          type="button"
          variant="ghost"
        >
          {m.common_cancel()}
        </Button>
      </div>
    </form>
  );
}
