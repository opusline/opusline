import type {
  CatalogItemData,
  ClientWithMissionsData,
  DeductibleCreditNoteData,
  DocumentLanguage,
  InvoicePaperData,
  InvoicingSettingsData,
  LineUnit,
  UnbilledTimeData,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@opusline/ui/components/dropdown-menu";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import { NativeSelect } from "@opusline/ui/components/native-select";
import { Panel, PanelTitle } from "@opusline/ui/components/panel";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
import { linkVariants } from "@opusline/ui/components/text-link";
import { Textarea } from "@opusline/ui/components/textarea";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  CircleAlert,
  Clock,
  PenLine,
  X,
} from "lucide-react";
import { type ComponentProps, type ReactNode, useId, useState } from "react";

import { DateField } from "@/components/date-field";
import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import {
  currencySymbol,
  formatAmountWithCents,
  formatPercentFromBp,
  formatQuantityDraft,
  formatRateDraft,
  formatSignedDraft,
} from "@/lib/billing";
import { addCalendarDays, calendarDateNumericLabel } from "@/lib/dates";
import { formatIban } from "@/lib/identifiers";
import { m } from "@/paraglide/messages.js";

import {
  canImportTime,
  catalogLine,
  dueDate,
  formatQuantity,
  freeLine,
  type InvoiceDraft,
  isLineComplete,
  type LineDraft,
  withClient,
  withMission,
  withoutLine,
  withTimeImported,
  withTimeReleased,
} from "../lib/invoice-draft";
import {
  depositRateOptions,
  parsePaymentTermKey,
  paymentTermKey,
  paymentTermLabel,
  paymentTermOptions,
  quoteValidityOptions,
} from "../lib/invoicing-settings";
import {
  LINE_UNIT_LABELS,
  LINE_UNITS,
  vatRateOptions,
} from "../lib/line-units";
import {
  fillDraft,
  parsePastedDocument,
  pasteFillPrompt,
  pasteFillSample,
} from "../lib/paste-fill";
import { InvoicePaper } from "./invoice-paper";
import { PasteFillPanel } from "./paste-fill-panel";
import { SwitchRow } from "./switch-row";

const LABEL = "text-muted-foreground-2 text-xs";

export type EditorKind = "invoice" | "quote";

export type InvoiceEditorPageProps = {
  /** The same editor writes invoices and quotes; the kind decides what it asks and where it leads. */
  kind: EditorKind;
  /** Null for a new document, the draft's id once it is saved. */
  invoiceId: number | null;
  draft: InvoiceDraft;
  onChange: (draft: InvoiceDraft) => void;
  clients: ClientWithMissionsData[];
  catalog: CatalogItemData[];
  settings: InvoicingSettingsData;
  /** The seller's own coordinates the options print, edited in Réglages. */
  seller: { iban: string | null; email: string };
  /** The rate a new line starts at: 0 under the franchise. */
  defaultVatRateBp: number;
  /** The account's today, the day a validation would date the invoice. */
  today: string;
  logoSrc?: string;
  /** The draft as the client would receive it; null until a client is chosen. */
  paper: InvoicePaperData | null;
  /** The chosen mission's unbilled time; null without a mission or while it loads. */
  unbilledTime: UnbilledTimeData | null;
  /** The chosen client's credit notes waiting to be deducted; empty for a quote. */
  deductibleCreditNotes?: DeductibleCreditNoteData[];
  isSaving: boolean;
  error: string | null;
  /** Handed the draft once every line is complete; the route's hook builds the request. */
  onSave: (draft: InvoiceDraft) => void;
  onValidate: (draft: InvoiceDraft) => void;
};

export function InvoiceEditorPage({
  kind,
  invoiceId,
  draft,
  onChange,
  clients,
  catalog,
  settings,
  seller,
  defaultVatRateBp,
  today,
  logoSrc,
  paper,
  unbilledTime,
  deductibleCreditNotes = [],
  isSaving,
  error,
  onSave,
  onValidate,
}: InvoiceEditorPageProps) {
  const isQuote = kind === "quote";
  const format = useMoneyFormat();
  const [showErrors, setShowErrors] = useState(false);
  const update = (patch: Partial<InvoiceDraft>) =>
    onChange({ ...draft, ...patch });
  const linesIncomplete = draft.lines.some(
    (line) => !isLineComplete(format, line),
  );
  const total = paper?.totals.find((row) => row.emphasis)?.value ?? null;

  const fillFromText = (text: string) => {
    const pasted = parsePastedDocument(text);

    if (pasted === null) {
      return null;
    }

    const result = fillDraft(format, draft, pasted, {
      kind,
      clients,
      settings,
      defaultVatRateBp,
    });
    onChange(result.draft);

    return result.filled;
  };

  const submit = (action: (draft: InvoiceDraft) => void) => {
    if (draft.clientId === null || linesIncomplete) {
      setShowErrors(true);
      return;
    }

    setShowErrors(false);
    action(draft);
  };

  return (
    <div className="pb-16">
      <nav className="mb-2 flex items-center gap-1.5 text-muted-foreground-3 text-sm">
        {isQuote ? (
          <Link className={linkVariants()} to="/invoicing/quotes">
            {m.invoicing_nav_quotes()}
          </Link>
        ) : (
          <Link className={linkVariants()} to="/invoicing/invoices">
            {m.nav_invoices()}
          </Link>
        )}
        <ChevronRight aria-hidden className="size-3.5" />
      </nav>
      <div className="mb-6.5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            className="font-heading font-semibold text-2xl text-foreground-hi"
            data-testid="page-heading"
          >
            {isQuote
              ? invoiceId === null
                ? m.editor_new_quote()
                : m.editor_edit_quote()
              : invoiceId === null
                ? m.editor_new_invoice()
                : m.editor_edit_invoice()}
          </h1>
          {draft.timeEntryIds.length > 0 ? (
            <p className="mt-1 text-muted-foreground-3 text-sm">
              {m.editor_from_time()}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {total === null ? null : (
            <span
              className="font-mono text-foreground-2 text-sm tabular-nums"
              data-testid="editor-total"
            >
              {m.editor_total({ amount: total })}
            </span>
          )}
          <Button
            data-testid="editor-save"
            disabled={isSaving || draft.clientId === null}
            onClick={() => submit(onSave)}
            size="xl"
            variant="outline"
          >
            {m.editor_save_draft()}
          </Button>
          <Button
            data-testid="editor-validate"
            disabled={isSaving || draft.clientId === null}
            onClick={() => submit(onValidate)}
            size="xl"
          >
            {isQuote ? m.editor_validate_quote() : m.editor_validate()}
          </Button>
        </div>
      </div>

      {error === null ? null : (
        <Alert className="mb-4" data-testid="editor-error" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {showErrors && linesIncomplete ? (
        <Alert
          className="mb-4"
          data-testid="editor-lines-incomplete"
          variant="warn"
        >
          <CircleAlert />
          <AlertDescription>{m.editor_lines_incomplete()}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <PasteFillPanel
            onFill={fillFromText}
            prompt={pasteFillPrompt(
              kind,
              clients
                .filter((client) => client.archivedAt === null)
                .map((client) => client.name),
              currencySymbol(format),
            )}
            sample={pasteFillSample(kind)}
          />
          <GeneralSection
            clients={clients}
            draft={draft}
            isQuote={isQuote}
            nextNumber={
              isQuote ? settings.nextQuoteNumber : settings.nextInvoiceNumber
            }
            onChange={onChange}
            settings={settings}
            today={today}
          />
          <LinesSection
            catalog={catalog}
            defaultVatRateBp={defaultVatRateBp}
            draft={draft}
            isQuote={isQuote}
            onChange={onChange}
            showErrors={showErrors}
            unbilledTime={unbilledTime}
            vatLiable={settings.vatLiable}
          />
          {isQuote ? null : (
            <Section title={m.editor_section_payment()}>
              {seller.iban === null ? (
                <p className="text-muted-foreground-3 text-sm">
                  {m.editor_payment_no_iban()}
                </p>
              ) : (
                <>
                  <p className="text-foreground-2 text-sm">
                    {m.editor_payment_transfer({
                      iban: formatIban(seller.iban),
                    })}
                  </p>
                  <p className="mt-1 mb-3 text-muted-foreground-3 text-xs">
                    {m.editor_payment_reference()}
                  </p>
                  <SwitchRow
                    checked={draft.showIban}
                    label={m.editor_show_iban()}
                    onChange={(showIban) => update({ showIban })}
                    testId="editor-show-iban"
                  />
                </>
              )}
            </Section>
          )}
          {isQuote || deductibleCreditNotes.length === 0 ? null : (
            <Section title={m.editor_credit_notes()}>
              <p className="mb-3 text-muted-foreground-3 text-xs">
                {m.editor_credit_notes_hint()}
              </p>
              <div className="flex flex-col gap-2">
                {deductibleCreditNotes.map((deductible) => (
                  <SwitchRow
                    checked={draft.creditNoteIds.includes(
                      deductible.creditNote.id,
                    )}
                    key={deductible.creditNote.id}
                    label={m.editor_deduct_credit_note({
                      number: deductible.creditNote.number,
                      amount: formatAmountWithCents(
                        format,
                        deductible.amount.amount,
                      ),
                      invoice: deductible.invoiceNumber,
                    })}
                    onChange={(deducts) =>
                      update({
                        creditNoteIds: deducts
                          ? [...draft.creditNoteIds, deductible.creditNote.id]
                          : draft.creditNoteIds.filter(
                              (id) => id !== deductible.creditNote.id,
                            ),
                      })
                    }
                    testId="editor-deduct-credit-note"
                  />
                ))}
              </div>
            </Section>
          )}
          <OptionsSection
            draft={draft}
            email={seller.email}
            isQuote={isQuote}
            onChange={onChange}
            today={today}
          />
        </div>

        <div className="min-w-0 xl:sticky xl:top-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-muted-foreground-3 text-xs">
              {m.editor_preview()}
            </span>
            <SegmentedControl
              aria-label={m.invoicing_document_language()}
              onValueChange={(value) => {
                const next = value[0];

                if (next === "0" || next === "1") {
                  update({ language: Number(next) as DocumentLanguage });
                }
              }}
              size="sm"
              value={[String(draft.language)]}
            >
              <SegmentedControlItem data-testid="editor-language-fr" value="0">
                FR
              </SegmentedControlItem>
              <SegmentedControlItem data-testid="editor-language-en" value="1">
                EN
              </SegmentedControlItem>
            </SegmentedControl>
          </div>
          {paper === null ? (
            <Panel
              className="flex min-h-60 items-center justify-center text-center text-muted-foreground-3 text-sm"
              data-testid="editor-preview-empty"
            >
              {isQuote
                ? m.editor_quote_preview_pick_client()
                : m.editor_preview_pick_client()}
            </Panel>
          ) : (
            // The sheet keeps its print proportions: a phone scrolls across it.
            <div className="overflow-x-auto">
              <div className="min-w-150">
                <InvoicePaper logoSrc={logoSrc} paper={paper} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Panel padding="section">
      <PanelTitle className="mb-4">{title}</PanelTitle>
      {children}
    </Panel>
  );
}

function GeneralSection({
  draft,
  onChange,
  clients,
  settings,
  isQuote,
  nextNumber,
  today,
}: {
  draft: InvoiceDraft;
  onChange: (draft: InvoiceDraft) => void;
  clients: ClientWithMissionsData[];
  settings: InvoicingSettingsData;
  isQuote: boolean;
  nextNumber: string;
  today: string;
}) {
  const dateFormat = useDateFormat();
  const ids = {
    client: useId(),
    mission: useId(),
    title: useId(),
    description: useId(),
    periodStart: useId(),
    periodEnd: useId(),
  };
  const update = (patch: Partial<InvoiceDraft>) =>
    onChange({ ...draft, ...patch });
  const client = clients.find((candidate) => candidate.id === draft.clientId);
  const pickable = clients.filter(
    (candidate) =>
      candidate.archivedAt === null || candidate.id === draft.clientId,
  );
  const isIncomplete =
    client !== undefined &&
    (client.billingAddressLine1 === null || client.billingCity === null);

  return (
    <Section title={m.editor_section_general()}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel className={LABEL} htmlFor={ids.client}>
            {m.editor_client()}
          </FieldLabel>
          <NativeSelect
            data-testid="editor-client"
            id={ids.client}
            onChange={(event) => {
              const picked = clients.find(
                (candidate) => candidate.id === Number(event.target.value),
              );

              if (picked !== undefined) {
                onChange(withClient(draft, picked, settings));
              }
            }}
            value={draft.clientId === null ? "" : String(draft.clientId)}
          >
            <option disabled value="">
              {m.editor_client_pick()}
            </option>
            {pickable.map((candidate) => (
              <option key={candidate.id} value={String(candidate.id)}>
                {candidate.name}
              </option>
            ))}
          </NativeSelect>
          {isIncomplete ? (
            <FieldDescription data-testid="editor-client-incomplete">
              {m.editor_client_incomplete()}
            </FieldDescription>
          ) : null}
        </Field>
        <Field>
          <FieldLabel className={LABEL} htmlFor={ids.mission}>
            {isQuote ? m.editor_mission_plain() : m.editor_mission()}
          </FieldLabel>
          <NativeSelect
            data-testid="editor-mission"
            disabled={client === undefined}
            id={ids.mission}
            onChange={(event) =>
              onChange(
                withMission(
                  draft,
                  event.target.value === "" ? null : Number(event.target.value),
                ),
              )
            }
            value={draft.missionId === null ? "" : String(draft.missionId)}
          >
            <option value="">{m.editor_mission_none()}</option>
            {(client?.missions ?? []).map((mission) => (
              <option key={mission.id} value={String(mission.id)}>
                {mission.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel className={LABEL} htmlFor={ids.title}>
            {m.editor_title()}
          </FieldLabel>
          <Input
            data-testid="editor-title"
            id={ids.title}
            maxLength={255}
            onChange={(event) => update({ title: event.target.value })}
            value={draft.title}
          />
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel className={LABEL} htmlFor={ids.description}>
            {m.editor_description()}
          </FieldLabel>
          <Textarea
            data-testid="editor-description"
            id={ids.description}
            maxLength={2000}
            onChange={(event) => update({ description: event.target.value })}
            rows={2}
            value={draft.description}
          />
        </Field>
        <div>
          <div className={LABEL}>{m.editor_issue_date()}</div>
          <div className="mt-1.5 text-foreground-2 text-sm">
            {m.editor_issue_date_value()} ·{" "}
            {calendarDateNumericLabel(dateFormat, today)}
          </div>
        </div>
        <div>
          <div className={LABEL}>{m.editor_number()}</div>
          <div className="mt-1.5 text-foreground-2 text-sm">
            {m.editor_number_value()}
          </div>
        </div>
        <p
          className="text-muted-foreground-3 text-xs sm:col-span-2"
          data-testid="editor-number-note"
        >
          {isQuote
            ? m.editor_quote_number_note({ number: nextNumber })
            : m.editor_number_note({ number: nextNumber })}
        </p>
        {isQuote ? null : (
          <fieldset className="sm:col-span-2">
            <legend className={LABEL}>{m.editor_period()}</legend>
            <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel className="sr-only" htmlFor={ids.periodStart}>
                  {m.editor_period_start()}
                </FieldLabel>
                <DateField
                  clearable
                  data-testid="editor-period-start"
                  id={ids.periodStart}
                  max={draft.periodEnd || undefined}
                  onChange={(periodStart) => update({ periodStart })}
                  value={draft.periodStart}
                />
              </Field>
              <Field>
                <FieldLabel className="sr-only" htmlFor={ids.periodEnd}>
                  {m.editor_period_end()}
                </FieldLabel>
                <DateField
                  clearable
                  data-testid="editor-period-end"
                  id={ids.periodEnd}
                  min={draft.periodStart || undefined}
                  onChange={(periodEnd) => update({ periodEnd })}
                  value={draft.periodEnd}
                />
              </Field>
            </div>
            <p className="mt-1.5 text-muted-foreground-3 text-xs">
              {m.editor_period_hint()}
            </p>
          </fieldset>
        )}
      </div>
    </Section>
  );
}

function LinesSection({
  draft,
  onChange,
  catalog,
  unbilledTime,
  defaultVatRateBp,
  vatLiable,
  isQuote,
  showErrors,
}: {
  draft: InvoiceDraft;
  onChange: (draft: InvoiceDraft) => void;
  catalog: CatalogItemData[];
  unbilledTime: UnbilledTimeData | null;
  defaultVatRateBp: number;
  vatLiable: boolean;
  isQuote: boolean;
  showErrors: boolean;
}) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const updateLine = (key: string, patch: Partial<LineDraft>) =>
    onChange({
      ...draft,
      lines: draft.lines.map((line) =>
        line.key === key ? { ...line, ...patch } : line,
      ),
    });
  const addLine = (line: LineDraft) =>
    onChange({ ...draft, lines: [...draft.lines, line] });

  const importTime = (time: UnbilledTimeData) =>
    onChange(
      withTimeImported(format, draft, time, {
        vatRateBp: defaultVatRateBp,
        detail:
          time.firstEntryOn === null || time.lastEntryOn === null
            ? ""
            : m.editor_time_line_detail({
                from: calendarDateNumericLabel(dateFormat, time.firstEntryOn),
                to: calendarDateNumericLabel(dateFormat, time.lastEntryOn),
              }),
      }),
    );

  return (
    <Section title={m.editor_section_lines()}>
      {draft.lines.length === 0 ? null : (
        <ol className="mb-4 flex flex-col gap-3">
          {draft.lines.map((line, index) => (
            <LineRow
              index={index}
              invalid={showErrors && !isLineComplete(format, line)}
              key={line.key}
              line={line}
              onChange={(patch) => updateLine(line.key, patch)}
              onRemove={() => onChange(withoutLine(draft, line.key))}
              vatLiable={vatLiable}
            />
          ))}
        </ol>
      )}
      {draft.timeEntryIds.length === 0 ? null : (
        <div
          className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted px-3 py-2 text-foreground-2 text-xs"
          data-entries={draft.timeEntryIds.length}
          data-testid="editor-time-linked"
        >
          <span className="flex items-center gap-1.5">
            <Clock aria-hidden className="size-3.5" />
            {m.editor_time_linked({ count: draft.timeEntryIds.length })}
          </span>
          <Button
            data-testid="editor-time-release"
            onClick={() => onChange(withTimeReleased(draft))}
            size="sm"
            variant="ghost"
          >
            {m.editor_time_release()}
          </Button>
        </div>
      )}
      <div
        className={
          isQuote ? "grid gap-2 sm:grid-cols-2" : "grid gap-2 sm:grid-cols-3"
        }
      >
        {isQuote ? null : (
          <TimeImport
            canImport={canImportTime(draft)}
            hasMission={draft.missionId !== null}
            onImport={importTime}
            time={unbilledTime}
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <AddCard
                detail={m.editor_from_catalog_hint()}
                icon={<BookOpen aria-hidden className="size-4" />}
                testId="editor-add-catalog"
                title={m.editor_from_catalog()}
              />
            }
          />
          <DropdownMenuContent align="start" className="w-72" sideOffset={6}>
            {catalog.length === 0 ? (
              <div className="px-2 py-1.5 text-muted-foreground-3 text-sm">
                {m.editor_catalog_empty()}
              </div>
            ) : (
              catalog.map((item) => (
                <DropdownMenuItem
                  data-item={item.id}
                  data-testid="editor-catalog-item"
                  key={item.id}
                  onClick={() => addLine(catalogLine(format, item))}
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{item.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {formatAmountWithCents(format, item.unitPrice.amount)} /{" "}
                      {LINE_UNIT_LABELS[item.unit]()}
                    </span>
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <AddCard
          detail={m.editor_free_line_hint()}
          icon={<PenLine aria-hidden className="size-4" />}
          onClick={() => addLine(freeLine(defaultVatRateBp))}
          testId="editor-add-free"
          title={m.editor_free_line()}
        />
      </div>
    </Section>
  );
}

function TimeImport({
  time,
  hasMission,
  canImport,
  onImport,
}: {
  time: UnbilledTimeData | null;
  hasMission: boolean;
  canImport: boolean;
  onImport: (time: UnbilledTimeData) => void;
}) {
  const { locale } = useMoneyFormat();
  const hasTime = time !== null && time.timeEntryIds.length > 0;
  const detail = !hasMission
    ? m.editor_import_time_hint()
    : !hasTime
      ? m.editor_import_time_empty()
      : time.unit === 1
        ? m.editor_import_time_hours({
            quantity: formatQuantity(locale, time.quantityMilli),
          })
        : m.editor_import_time_days({
            quantity: formatQuantity(locale, time.quantityMilli),
          });

  return (
    <AddCard
      detail={detail}
      disabled={!hasTime || !canImport}
      icon={<Clock aria-hidden className="size-4" />}
      onClick={() => {
        if (time !== null) {
          onImport(time);
        }
      }}
      testId="editor-import-time"
      title={m.editor_import_time()}
    />
  );
}

/** Also a menu trigger: whatever the trigger passes lands on the button. */
function AddCard({
  icon,
  title,
  detail,
  testId,
  ...button
}: ComponentProps<"button"> & {
  icon: ReactNode;
  title: string;
  detail: string;
  testId: string;
}) {
  return (
    <button
      className="flex items-start gap-2.5 rounded-md border border-dashed bg-card px-3 py-2.5 text-left transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
      data-testid={testId}
      type="button"
      {...button}
    >
      <span className="mt-0.5 text-muted-foreground-3">{icon}</span>
      <span className="flex min-w-0 flex-col">
        <span className="text-foreground-hi text-sm">{title}</span>
        <span className="text-muted-foreground-3 text-xs">{detail}</span>
      </span>
    </button>
  );
}

function LineRow({
  line,
  index,
  invalid,
  vatLiable,
  onChange,
  onRemove,
}: {
  line: LineDraft;
  index: number;
  invalid: boolean;
  vatLiable: boolean;
  onChange: (patch: Partial<LineDraft>) => void;
  onRemove: () => void;
}) {
  const format = useMoneyFormat();
  const ids = {
    label: useId(),
    detail: useId(),
    quantity: useId(),
    unit: useId(),
    price: useId(),
    vat: useId(),
  };
  const number = String(index + 1);

  return (
    <li
      className="rounded-md border bg-card-2 p-3"
      data-invalid={invalid}
      data-line={index}
      data-testid="editor-line"
    >
      <div className="flex items-start gap-2">
        <span className="mt-2 w-5 flex-none text-center font-mono text-muted-foreground-3 text-xs">
          {number}
        </span>
        <div className="grid min-w-0 flex-1 gap-2">
          <Field>
            <FieldLabel className="sr-only" htmlFor={ids.label}>
              {m.editor_line_label()}
            </FieldLabel>
            <Input
              aria-invalid={invalid && line.label.trim() === ""}
              data-testid="editor-line-label"
              id={ids.label}
              maxLength={255}
              onChange={(event) => onChange({ label: event.target.value })}
              placeholder={m.editor_line_label()}
              value={line.label}
            />
          </Field>
          <Field>
            <FieldLabel className="sr-only" htmlFor={ids.detail}>
              {m.editor_line_detail()}
            </FieldLabel>
            <Input
              data-testid="editor-line-detail"
              id={ids.detail}
              maxLength={1000}
              onChange={(event) => onChange({ detail: event.target.value })}
              placeholder={m.editor_line_detail()}
              value={line.detail}
            />
          </Field>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Field>
              <FieldLabel className={LABEL} htmlFor={ids.quantity}>
                {m.editor_line_quantity()}
              </FieldLabel>
              <Input
                aria-invalid={invalid}
                data-testid="editor-line-quantity"
                id={ids.quantity}
                inputMode="decimal"
                onChange={(event) =>
                  onChange({
                    quantity: formatQuantityDraft(
                      format.locale,
                      event.target.value,
                    ),
                  })
                }
                value={line.quantity}
              />
            </Field>
            <Field>
              <FieldLabel className={LABEL} htmlFor={ids.unit}>
                {m.editor_line_unit()}
              </FieldLabel>
              <NativeSelect
                data-testid="editor-line-unit"
                id={ids.unit}
                onChange={(event) =>
                  onChange({ unit: Number(event.target.value) as LineUnit })
                }
                value={String(line.unit)}
              >
                {LINE_UNITS.map((unit) => (
                  <option key={unit} value={String(unit)}>
                    {LINE_UNIT_LABELS[unit]()}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel className={LABEL} htmlFor={ids.price}>
                {m.editor_line_price()}
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  aria-invalid={invalid}
                  data-testid="editor-line-price"
                  id={ids.price}
                  inputMode="decimal"
                  onChange={(event) =>
                    onChange({
                      unitPrice: formatSignedDraft(
                        format.locale,
                        event.target.value,
                      ),
                    })
                  }
                  value={line.unitPrice}
                />
                <InputGroupSuffix>{currencySymbol(format)}</InputGroupSuffix>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel className={LABEL} htmlFor={ids.vat}>
                {m.editor_line_vat()}
              </FieldLabel>
              {vatLiable ? (
                <NativeSelect
                  data-testid="editor-line-vat"
                  id={ids.vat}
                  onChange={(event) =>
                    onChange({ vatRateBp: Number(event.target.value) })
                  }
                  value={String(line.vatRateBp)}
                >
                  {vatRateOptions(line.vatRateBp).map((rate) => (
                    <option key={rate} value={String(rate)}>
                      {formatPercentFromBp(format.locale, rate)} %
                    </option>
                  ))}
                </NativeSelect>
              ) : (
                <div
                  className="flex h-8 items-center text-muted-foreground-3 text-sm"
                  id={ids.vat}
                >
                  {m.editor_franchise()}
                </div>
              )}
            </Field>
          </div>
        </div>
        <Button
          aria-label={m.editor_line_remove({ number })}
          data-testid="editor-line-remove"
          onClick={onRemove}
          size="icon"
          variant="ghost"
        >
          <X />
        </Button>
      </div>
    </li>
  );
}

function OptionsSection({
  draft,
  onChange,
  email,
  isQuote,
  today,
}: {
  draft: InvoiceDraft;
  onChange: (draft: InvoiceDraft) => void;
  email: string;
  isQuote: boolean;
  today: string;
}) {
  const dateFormat = useDateFormat();
  const ids = {
    term: useId(),
    penalty: useId(),
    mentions: useId(),
    validity: useId(),
    deposit: useId(),
  };
  const update = (patch: Partial<InvoiceDraft>) =>
    onChange({ ...draft, ...patch });
  const { locale } = useMoneyFormat();

  return (
    <Section title={m.editor_section_options()}>
      <div className="grid gap-4 sm:grid-cols-2">
        {isQuote ? (
          <>
            <Field>
              <FieldLabel className={LABEL} htmlFor={ids.validity}>
                {m.editor_validity()}
              </FieldLabel>
              <NativeSelect
                data-testid="editor-validity"
                id={ids.validity}
                onChange={(event) =>
                  update({ validityDays: Number(event.target.value) })
                }
                value={String(draft.validityDays)}
              >
                {quoteValidityOptions(draft.validityDays).map((days) => (
                  <option key={days} value={String(days)}>
                    {m.invoicing_days({ count: days })}
                  </option>
                ))}
              </NativeSelect>
              <FieldDescription data-testid="editor-validity-hint">
                {m.editor_validity_hint({
                  date: calendarDateNumericLabel(
                    dateFormat,
                    addCalendarDays(today, draft.validityDays),
                  ),
                })}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel className={LABEL} htmlFor={ids.deposit}>
                {m.editor_deposit()}
              </FieldLabel>
              <NativeSelect
                data-testid="editor-deposit"
                id={ids.deposit}
                onChange={(event) =>
                  update({
                    depositRateBp:
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                  })
                }
                value={
                  draft.depositRateBp === null
                    ? ""
                    : String(draft.depositRateBp)
                }
              >
                <option value="">{m.editor_deposit_none()}</option>
                {depositRateOptions(draft.depositRateBp).map((rate) => (
                  <option key={rate} value={String(rate)}>
                    {m.editor_deposit_rate({
                      rate: formatPercentFromBp(locale, rate),
                    })}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          </>
        ) : (
          <>
            <Field className="sm:col-span-2">
              <FieldLabel className={LABEL} htmlFor={ids.term}>
                {m.editor_term()}
              </FieldLabel>
              <NativeSelect
                data-testid="editor-term"
                id={ids.term}
                onChange={(event) =>
                  update({ paymentTerm: event.target.value })
                }
                value={draft.paymentTerm}
              >
                {paymentTermOptions(parsePaymentTermKey(draft.paymentTerm)).map(
                  (term) => (
                    <option
                      key={paymentTermKey(term)}
                      value={paymentTermKey(term)}
                    >
                      {paymentTermLabel(term)}
                    </option>
                  ),
                )}
              </NativeSelect>
              <FieldDescription data-testid="editor-term-hint">
                {m.editor_term_hint({
                  due: calendarDateNumericLabel(
                    dateFormat,
                    dueDate(today, draft.paymentTerm),
                  ),
                })}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel className={LABEL} htmlFor={ids.penalty}>
                {m.editor_penalty()}
              </FieldLabel>
              <Input
                data-testid="editor-penalty"
                id={ids.penalty}
                inputMode="decimal"
                onChange={(event) =>
                  update({
                    latePenaltyRate: formatRateDraft(
                      locale,
                      event.target.value,
                    ),
                  })
                }
                placeholder={m.invoicing_penalty_placeholder()}
                value={draft.latePenaltyRate}
              />
            </Field>
          </>
        )}
        <Field className="sm:col-span-2">
          <FieldLabel className={LABEL} htmlFor={ids.mentions}>
            {m.editor_mentions()}
          </FieldLabel>
          <Textarea
            data-testid="editor-mentions"
            id={ids.mentions}
            maxLength={2000}
            onChange={(event) => update({ customMentions: event.target.value })}
            rows={2}
            value={draft.customMentions}
          />
        </Field>
        <div className="sm:col-span-2">
          <SwitchRow
            checked={draft.showEmail}
            label={m.editor_show_email({ email })}
            onChange={(showEmail) => update({ showEmail })}
            testId="editor-show-email"
          />
        </div>
      </div>
    </Section>
  );
}
