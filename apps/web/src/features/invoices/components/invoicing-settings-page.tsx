import type {
  DocumentLanguage,
  InvoicingMode,
  InvoicingSettingsData,
  OperationCategory,
  SettingsData,
  UpdateInvoicingSettingsData,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Chip, ChipGroup } from "@opusline/ui/components/chip";
import { Field, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { NativeSelect } from "@opusline/ui/components/native-select";
import {
  Panel,
  PanelDescription,
  PanelTitle,
} from "@opusline/ui/components/panel";
import { RadioCard, RadioGroup } from "@opusline/ui/components/radio-group";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
import { Switch } from "@opusline/ui/components/switch";
import { linkVariants } from "@opusline/ui/components/text-link";
import { Textarea } from "@opusline/ui/components/textarea";
import { Link } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { type ReactNode, useId, useState } from "react";

import { CompanyLogoField } from "@/components/company-logo-field";
import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { SaveBar } from "@/components/save-bar";
import { formatAmountWithCents } from "@/lib/billing";
import { calendarDateLabel, calendarDateNumericLabel } from "@/lib/dates";
import { formatIban } from "@/lib/identifiers";
import type { CompanyLogoSlot } from "@/lib/logos";
import { m } from "@/paraglide/messages.js";

import {
  formatRate,
  hasUnsavedChanges,
  type InvoicingSettingsDraft,
  isPenaltyRateInvalid,
  legalReferenceTitle,
  OPERATION_CATEGORY_LABELS,
  parsePaymentTermKey,
  paymentTermKey,
  paymentTermLabel,
  paymentTermOptions,
  penaltyRateBp,
  quoteValidityOptions,
  semesterStart,
  toInvoicingDraft,
  toInvoicingPayload,
} from "../lib/invoicing-settings";

const LABEL = "text-muted-foreground-2 text-xs";

type InvoicingSettingsPageProps = {
  settings: InvoicingSettingsData;
  /** The account's identity, shown read-only: it is edited in Réglages. */
  identity: SettingsData;
  logo: CompanyLogoSlot;
  isSaving: boolean;
  error: string | null;
  /** `onSaved` receives the stored settings, which the draft re-seeds from. */
  onSave: (
    body: UpdateInvoicingSettingsData,
    onSaved: (saved: InvoicingSettingsData) => void,
  ) => void;
};

export function InvoicingSettingsPage({
  settings,
  identity,
  logo,
  isSaving,
  error,
  onSave,
}: InvoicingSettingsPageProps) {
  const { locale } = useMoneyFormat();
  const [draft, setDraft] = useState(() => toInvoicingDraft(locale, settings));
  const [seed, setSeed] = useState({ locale, settings });

  // A refetch (another tab saved, the locale changed) only replaces a draft
  // holding no edit of its own.
  if (seed.locale !== locale || seed.settings !== settings) {
    setSeed({ locale, settings });

    if (!hasUnsavedChanges(seed.locale, seed.settings, draft)) {
      setDraft(toInvoicingDraft(locale, settings));
    }
  }

  const update = (patch: Partial<InvoicingSettingsDraft>) =>
    setDraft((current) => ({ ...current, ...patch }));
  const isDirty = hasUnsavedChanges(locale, settings, draft);
  const isRateInvalid = isPenaltyRateInvalid(locale, draft.latePenaltyRate);

  return (
    <div className="max-w-180 pb-24">
      <div className="mb-6.5">
        <h1
          className="mb-1 font-heading font-semibold text-2xl text-foreground-hi"
          data-testid="page-heading"
        >
          {m.invoicing_settings_title()}
        </h1>
        <p className="text-muted-foreground-3 text-sm">
          {m.invoicing_settings_subtitle()}
        </p>
      </div>

      {error === null ? null : (
        <Alert className="mb-4" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4">
        <ModeSection mode={draft.mode} onChange={(mode) => update({ mode })} />
        <IdentitySection identity={identity} logo={logo} />
        <TermsSection draft={draft} settings={settings} update={update} />
        <MentionsSection
          draft={draft}
          update={update}
          vatLiable={settings.vatLiable}
        />
        <LegalReferenceSection settings={settings} />
      </div>

      {isDirty ? (
        <div className="sticky bottom-4 z-10">
          <SaveBar
            isSaving={isSaving}
            label={m.invoicing_settings_unsaved()}
            onCancel={() => setDraft(toInvoicingDraft(locale, settings))}
          >
            <Button
              data-testid="invoicing-settings-save"
              disabled={isSaving || isRateInvalid}
              onClick={() =>
                onSave(toInvoicingPayload(locale, draft, settings), (saved) =>
                  setDraft(toInvoicingDraft(locale, saved)),
                )
              }
              size="xl"
            >
              {m.common_save()}
            </Button>
          </SaveBar>
        </div>
      ) : null}
    </div>
  );
}

function Section({
  title,
  description,
  aside,
  children,
}: {
  title: string;
  description?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Panel className="px-5 py-6 sm:px-7" padding="none">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <PanelTitle>{title}</PanelTitle>
        {aside}
      </div>
      {description === undefined ? null : (
        <PanelDescription className="-mt-2 mb-4">
          {description}
        </PanelDescription>
      )}
      {children}
    </Panel>
  );
}

function ModeSection({
  mode,
  onChange,
}: {
  mode: InvoicingMode;
  onChange: (mode: InvoicingMode) => void;
}) {
  return (
    <Section title={m.invoicing_mode_title()}>
      <RadioGroup
        aria-label={m.invoicing_mode_title()}
        className="grid gap-3 sm:grid-cols-2"
        onValueChange={(value) => onChange(Number(value) as InvoicingMode)}
        value={String(mode)}
      >
        <RadioCard
          data-testid="invoicing-mode"
          data-mode="opusline"
          description={m.invoicing_mode_opusline_detail()}
          title={m.invoicing_mode_opusline()}
          value="0"
        />
        <RadioCard
          data-testid="invoicing-mode"
          data-mode="elsewhere"
          description={m.invoicing_mode_elsewhere_detail()}
          title={m.invoicing_mode_elsewhere()}
          value="1"
        />
      </RadioGroup>
      <p className="mt-3 text-muted-foreground-3 text-xs leading-relaxed">
        {m.invoicing_mode_hint()}
      </p>
    </Section>
  );
}

function addressLine(identity: SettingsData): string {
  const city = [identity.companyPostalCode, identity.companyCity]
    .filter(Boolean)
    .join(" ");

  return [identity.companyAddressLine1, identity.companyAddressLine2, city]
    .filter(Boolean)
    .join(", ");
}

function IdentitySection({
  identity,
  logo,
}: {
  identity: SettingsData;
  logo: CompanyLogoSlot;
}) {
  // A micro-entrepreneur's name always carries « EI » (loi du 14 février 2022).
  const name =
    identity.tradeName === null
      ? null
      : identity.hasFrenchFiscality
        ? `${identity.tradeName} EI`
        : identity.tradeName;
  const rows: Array<[string, string | null]> = [
    [m.invoicing_identity_name(), name],
    ...(identity.hasFrenchFiscality
      ? ([["SIRET", identity.siret]] as Array<[string, string | null]>)
      : []),
    [m.invoicing_identity_address(), addressLine(identity) || null],
    [
      m.invoicing_identity_vat(),
      identity.vatLiable
        ? identity.vatNumber
        : m.invoicing_identity_vat_exempt(),
    ],
    ["IBAN", identity.iban === null ? null : formatIban(identity.iban)],
  ];

  return (
    <Section
      aside={
        <Link
          className={linkVariants({ size: "sm" })}
          to="/settings"
          search={{ tab: "identite" }}
        >
          {m.invoicing_identity_edit()} →
        </Link>
      }
      title={m.invoicing_identity_title()}
    >
      <dl className="grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-[auto_1fr]">
        {rows.map(([label, value]) => (
          <div className="contents" key={label}>
            <dt className="text-muted-foreground-3">{label}</dt>
            <dd className="min-w-0 break-words text-foreground-2">
              {value ?? "—"}
            </dd>
          </div>
        ))}
      </dl>

      <CompanyLogoField
        className="mt-5 border-t pt-5"
        logo={logo}
        testId="invoicing-logo"
      />
    </Section>
  );
}

function TermsSection({
  draft,
  settings,
  update,
}: {
  draft: InvoicingSettingsDraft;
  settings: InvoicingSettingsData;
  update: (patch: Partial<InvoicingSettingsDraft>) => void;
}) {
  const { locale } = useMoneyFormat();
  const termId = useId();
  const validityId = useId();
  const penaltyId = useId();
  const { minimumPenaltyRateBp, statutoryPenaltyRateBp } =
    settings.legalReference;
  const hintId = useId();
  const typedRateBp = penaltyRateBp(locale, draft.latePenaltyRate);
  const isInvalid = isPenaltyRateInvalid(locale, draft.latePenaltyRate);
  const isBelowFloor =
    typedRateBp !== null && typedRateBp < minimumPenaltyRateBp;

  return (
    <Section title={m.invoicing_terms_title()}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel className={LABEL} htmlFor={termId}>
            {m.invoicing_terms_default()}
          </FieldLabel>
          <NativeSelect
            data-testid="invoicing-payment-term"
            id={termId}
            onChange={(event) => update({ paymentTerm: event.target.value })}
            value={draft.paymentTerm}
          >
            {paymentTermOptions(parsePaymentTermKey(draft.paymentTerm)).map(
              (term) => (
                <option key={paymentTermKey(term)} value={paymentTermKey(term)}>
                  {paymentTermLabel(term)}
                </option>
              ),
            )}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel className={LABEL} htmlFor={validityId}>
            {m.invoicing_quote_validity()}
          </FieldLabel>
          <NativeSelect
            data-testid="invoicing-quote-validity"
            id={validityId}
            onChange={(event) =>
              update({ quoteValidityDays: Number(event.target.value) })
            }
            value={String(draft.quoteValidityDays)}
          >
            {quoteValidityOptions(draft.quoteValidityDays).map((days) => (
              <option key={days} value={String(days)}>
                {m.invoicing_days({ count: days })}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </div>
      <p className="mt-3 text-muted-foreground-3 text-xs leading-relaxed">
        {m.invoicing_terms_note()}
      </p>

      <div className="mt-5 border-t pt-5">
        <Field>
          <FieldLabel className={LABEL} htmlFor={penaltyId}>
            {m.invoicing_penalty_label()}
          </FieldLabel>
          <div className="flex flex-wrap items-center gap-2.5">
            <Input
              aria-describedby={hintId}
              aria-invalid={isInvalid}
              className="w-40"
              data-testid="invoicing-penalty-rate"
              id={penaltyId}
              inputMode="decimal"
              onChange={(event) =>
                update({ latePenaltyRate: event.target.value })
              }
              placeholder={m.invoicing_penalty_placeholder()}
              value={draft.latePenaltyRate}
            />
            <ChipGroup aria-label={m.invoicing_penalty_label()}>
              <Chip
                onClick={() =>
                  update({
                    latePenaltyRate: formatRate(locale, minimumPenaltyRateBp),
                  })
                }
                size="sm"
              >
                {m.invoicing_penalty_floor({
                  rate: formatRate(locale, minimumPenaltyRateBp),
                })}
              </Chip>
              <Chip
                onClick={() =>
                  update({
                    latePenaltyRate: formatRate(locale, statutoryPenaltyRateBp),
                  })
                }
                size="sm"
              >
                {m.invoicing_penalty_statutory({
                  rate: formatRate(locale, statutoryPenaltyRateBp),
                })}
              </Chip>
            </ChipGroup>
          </div>
        </Field>
        <p
          className={
            isInvalid || isBelowFloor
              ? "mt-2 text-destructive-strong text-xs leading-relaxed"
              : "mt-2 text-muted-foreground-3 text-xs leading-relaxed"
          }
          data-testid="invoicing-penalty-hint"
          data-below-floor={isBelowFloor}
          data-invalid={isInvalid}
          id={hintId}
        >
          {isInvalid
            ? m.invoicing_penalty_invalid()
            : isBelowFloor
              ? m.invoicing_penalty_below_floor({
                  rate: formatRate(locale, minimumPenaltyRateBp),
                })
              : m.invoicing_penalty_hint()}
        </p>
      </div>
    </Section>
  );
}

function SwitchRow({
  label,
  checked,
  onChange,
  testId,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  testId: string;
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Base UI's Switch renders a hidden input beside its span, so the wrapping label is its control
    <label className="flex cursor-pointer items-center justify-between gap-4 py-1.5 text-foreground-2 text-sm">
      {label}
      <Switch
        checked={checked}
        data-testid={testId}
        onCheckedChange={onChange}
      />
    </label>
  );
}

function MentionsSection({
  draft,
  update,
  vatLiable,
}: {
  draft: InvoicingSettingsDraft;
  update: (patch: Partial<InvoicingSettingsDraft>) => void;
  vatLiable: boolean;
}) {
  const categoryId = useId();
  const mentionsId = useId();

  return (
    <Section title={m.invoicing_mentions_title()}>
      <Field>
        <FieldLabel className={LABEL} htmlFor={categoryId}>
          {m.invoicing_category_label()}
        </FieldLabel>
        <NativeSelect
          className="sm:max-w-80"
          data-testid="invoicing-operation-category"
          id={categoryId}
          onChange={(event) =>
            update({
              operationCategory: Number(
                event.target.value,
              ) as OperationCategory,
            })
          }
          value={String(draft.operationCategory)}
        >
          {([0, 1, 2] as const).map((category) => (
            <option key={category} value={String(category)}>
              {OPERATION_CATEGORY_LABELS[category]()}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <p className="mt-2 text-muted-foreground-3 text-xs leading-relaxed">
        {m.invoicing_category_hint()}
      </p>

      <div className="mt-4 flex flex-col border-t pt-3">
        <SwitchRow
          checked={draft.showIbanOnInvoices}
          label={m.invoicing_show_iban()}
          onChange={(showIbanOnInvoices) => update({ showIbanOnInvoices })}
          testId="invoicing-show-iban"
        />
        <SwitchRow
          checked={draft.showEmailOnDocuments}
          label={m.invoicing_show_email()}
          onChange={(showEmailOnDocuments) => update({ showEmailOnDocuments })}
          testId="invoicing-show-email"
        />
        {vatLiable ? (
          <SwitchRow
            checked={draft.vatOnDebits}
            label={m.invoicing_vat_on_debits()}
            onChange={(vatOnDebits) => update({ vatOnDebits })}
            testId="invoicing-vat-on-debits"
          />
        ) : null}
      </div>

      <Field className="mt-4">
        <FieldLabel className={LABEL} htmlFor={mentionsId}>
          {m.invoicing_custom_mentions()}
        </FieldLabel>
        <Textarea
          data-testid="invoicing-custom-mentions"
          id={mentionsId}
          maxLength={2000}
          onChange={(event) => update({ customMentions: event.target.value })}
          rows={3}
          value={draft.customMentions}
        />
      </Field>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-foreground-2 text-sm">
          {m.invoicing_document_language()}
        </span>
        <SegmentedControl
          aria-label={m.invoicing_document_language()}
          onValueChange={(value) => {
            const next = value[0];

            if (next === "0" || next === "1") {
              update({ documentLanguage: Number(next) as DocumentLanguage });
            }
          }}
          size="sm"
          value={[String(draft.documentLanguage)]}
        >
          <SegmentedControlItem data-testid="invoicing-language-fr" value="0">
            {m.invoicing_language_french()}
          </SegmentedControlItem>
          <SegmentedControlItem data-testid="invoicing-language-en" value="1">
            {m.invoicing_language_english()}
          </SegmentedControlItem>
        </SegmentedControl>
      </div>
    </Section>
  );
}

function LegalReferenceSection({
  settings,
}: {
  settings: InvoicingSettingsData;
}) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const reference = settings.legalReference;
  const rate = (basisPoints: number) =>
    `${formatRate(format.locale, basisPoints)} %`;
  const rows: Array<[string, string]> = [
    [m.invoicing_legal_einvoicing(), m.invoicing_legal_einvoicing_value()],
    [m.invoicing_legal_interest_rate(), rate(reference.legalInterestRateBp)],
    [m.invoicing_legal_minimum_penalty(), rate(reference.minimumPenaltyRateBp)],
    [
      m.invoicing_legal_ecb_rate({
        date: calendarDateLabel(
          format.locale,
          semesterStart(reference.semester),
        ),
      }),
      rate(reference.ecbRateBp),
    ],
    [
      m.invoicing_legal_statutory_rate(),
      rate(reference.statutoryPenaltyRateBp),
    ],
    [
      m.invoicing_legal_recovery_fee(),
      formatAmountWithCents(
        { locale: format.locale, currency: reference.recoveryFee.currency },
        reference.recoveryFee.amount,
      ),
    ],
    [m.invoicing_legal_term_without_clause(), m.invoicing_days({ count: 30 })],
    [m.invoicing_legal_maximum_term(), m.invoicing_legal_maximum_term_value()],
  ];
  const sources: Array<[string, string | undefined]> = [
    [
      m.invoicing_source_legal_interest_rate(),
      reference.sources.legal_interest_rate,
    ],
    [m.invoicing_source_late_penalties(), reference.sources.late_penalties],
    [
      m.invoicing_source_mandatory_mentions(),
      reference.sources.mandatory_mentions,
    ],
  ];

  return (
    <Section
      description={m.invoicing_legal_meta({
        checkedOn: calendarDateNumericLabel(dateFormat, reference.checkedOn),
        nextOn: calendarDateNumericLabel(dateFormat, reference.nextRevisionOn),
      })}
      title={legalReferenceTitle(reference)}
    >
      <dl className="flex flex-col divide-y text-sm">
        {rows.map(([label, value]) => (
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.25"
            key={label}
          >
            <dt className="text-muted-foreground-3">{label}</dt>
            <dd className="text-foreground-2 tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 mb-1.5 text-muted-foreground-2 text-xs">
        {m.invoicing_legal_sources()}
      </p>
      <ul className="flex flex-col gap-1">
        {sources.map(([label, url]) =>
          url === undefined ? null : (
            <li key={label}>
              <a
                className={linkVariants({ size: "sm" })}
                href={url}
                rel="noreferrer"
                target="_blank"
              >
                {label} ↗
              </a>
            </li>
          ),
        )}
      </ul>
    </Section>
  );
}
