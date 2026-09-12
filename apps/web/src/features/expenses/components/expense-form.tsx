import type {
  ExpenseCategory,
  ReceiptSuggestionData,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import { Label } from "@opusline/ui/components/label";
import { NativeSelect } from "@opusline/ui/components/native-select";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
import { SheetBody, SheetFooter } from "@opusline/ui/components/sheet";
import { Switch } from "@opusline/ui/components/switch";
import { useId, useRef, useState } from "react";

import { DateField } from "@/components/date-field";
import { useMoneyFormat } from "@/components/money-format-provider";
import {
  currencySymbol,
  formatAmountWithCents,
  formatSignedDraft,
} from "@/lib/billing";
import {
  type FieldErrorMap,
  serverErrorMessage,
  serverStatus,
} from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

import {
  draftProShareBp,
  draftRecurringDay,
  draftTtcCents,
  draftVatTerms,
  type ExpenseDraft,
} from "../lib/expense-draft";
import { EXPENSE_CATEGORIES, expenseCategoryLabel } from "../lib/labels";
import { parseQuickEntry } from "../lib/parse-quick-entry";
import {
  type DraftSources,
  readFieldCount,
  receiptSuggestionChanges,
} from "../lib/receipt-suggestion";
import { receiptRejection } from "../lib/receipts";
import { expenseAmountsFromTtc } from "../lib/vat";
import { ExpenseCalcBox } from "./expense-calc-box";
import { FieldSourceTag } from "./field-source-tag";
import { ProShareField } from "./pro-share-field";
import { QuickEntryInput } from "./quick-entry-input";
import { ReceiptField } from "./receipt-field";
import { type ReceiptScanState, ReceiptScanZone } from "./receipt-scan-zone";
import { VatChoiceField } from "./vat-choice-field";

type ExpenseFormProps = {
  initial: ExpenseDraft;
  mode: "create" | "edit";
  storedReceiptName?: string | null;
  isVatLiable: boolean;
  /** `Y-m-d`, the latest day an expense can be dated. */
  today: string;
  isSaving: boolean;
  error: string | null;
  fieldErrors: FieldErrorMap | null;
  onSubmit: (draft: ExpenseDraft) => void;
  onCancel: () => void;
  /** Reads the receipt server-side; rejects with the API's error. */
  onReadReceipt: (file: File) => Promise<ReceiptSuggestionData>;
};

type EntryMode = "scan" | "type";

export function ExpenseForm({
  initial,
  mode,
  storedReceiptName = null,
  isVatLiable,
  today,
  isSaving,
  error,
  fieldErrors,
  onSubmit,
  onCancel,
  onReadReceipt,
}: ExpenseFormProps) {
  const format = useMoneyFormat();
  const id = useId();
  const [draft, setDraft] = useState(initial);
  const [quickEntry, setQuickEntry] = useState("");
  // A prefilled create (a duplicate, a debit) opens on its fields, not on
  // a drop zone that would overwrite them.
  const [entryMode, setEntryMode] = useState<EntryMode>(
    initial.supplier === "" && initial.ttc === "" ? "scan" : "type",
  );
  const [sources, setSources] = useState<DraftSources>({});
  const [scan, setScan] = useState<ReceiptScanState>({ status: "idle" });
  // A read that outlives its file (removed, replaced) must not land.
  const readToken = useRef(0);
  // Fields the user typed into by hand: the quick line never overwrites them.
  const [touched, setTouched] = useState<Set<keyof ExpenseDraft>>(
    () => new Set(),
  );

  const patch = (changes: Partial<ExpenseDraft>) => {
    const keys = Object.keys(changes) as Array<keyof ExpenseDraft>;

    setDraft((current) => ({ ...current, ...changes }));
    setTouched((current) => new Set([...current, ...keys]));
    setSources((current) => {
      const next = { ...current };

      for (const key of keys) {
        delete next[key];
      }

      return next;
    });
  };

  const readReceipt = async (file: File) => {
    const token = ++readToken.current;
    const rejection = receiptRejection(file);

    setEntryMode("scan");
    setDraft((current) => ({ ...current, receipt: file }));

    if (rejection !== null) {
      setScan({ status: "failed", fileName: file.name, message: rejection });
      return;
    }

    setScan({ status: "busy", fileName: file.name });

    try {
      const suggestion = await onReadReceipt(file);

      if (token !== readToken.current) {
        return;
      }

      const { changes, sources: read } = receiptSuggestionChanges(
        format,
        suggestion,
        isVatLiable,
      );

      if (!suggestion.textFound || readFieldCount(read) === 0) {
        setScan({ status: "unreadable", fileName: file.name });
        return;
      }

      setDraft((current) => ({ ...current, ...changes }));
      setSources(read);
      setScan({
        status: "done",
        fileName: file.name,
        readCount: readFieldCount(read),
        hasCategory: read.category !== undefined,
      });
    } catch (failure) {
      if (token !== readToken.current) {
        return;
      }

      setScan({
        status: "failed",
        fileName: file.name,
        message:
          serverStatus(failure) === 429
            ? m.expenses_scan_throttled()
            : serverErrorMessage(failure, m.expenses_scan_failed()),
      });
    }
  };

  const resetScan = () => {
    readToken.current += 1;
    setScan({ status: "idle" });
    setSources({});
    setDraft((current) => ({ ...current, receipt: null }));
  };

  const applyQuickEntry = (value: string) => {
    setQuickEntry(value);
    setSources({});
    const { ttcDraft, ...fields } = parseQuickEntry(value, today);
    const parsed: Partial<ExpenseDraft> = {
      ...fields,
      ...(ttcDraft !== undefined && {
        ttc: formatSignedDraft(format.locale, ttcDraft),
      }),
    };

    setDraft((current) => ({
      ...current,
      ...Object.fromEntries(
        Object.entries(parsed).filter(
          ([key]) => !touched.has(key as keyof ExpenseDraft),
        ),
      ),
    }));
  };

  const ttcCents = draftTtcCents(format, draft);
  const proShareBp = draftProShareBp(format, draft);
  const vatTerms = draftVatTerms(draft);
  const amounts =
    ttcCents === null
      ? null
      : expenseAmountsFromTtc(
          ttcCents,
          isVatLiable ? vatTerms : { vatTreatment: 3, vatRateBp: 0 },
          proShareBp ?? 10_000,
        );

  const supplierError = fieldErrors?.supplier?.message;
  const spentOnError = fieldErrors?.spentOn?.message;
  const descriptionError = fieldErrors?.description?.message;
  const amountError =
    fieldErrors?.["amountTtc.amount"]?.message ??
    (draft.ttc.trim() !== "" && ttcCents === null
      ? m.expenses_amount_invalid()
      : undefined);
  const proShareError =
    fieldErrors?.proShareBp?.message ??
    (proShareBp === null ? m.expenses_pro_share_invalid() : undefined);
  const recurringDayError =
    draft.isRecurring && draftRecurringDay(draft) === null
      ? m.expenses_recurring_day_invalid()
      : undefined;
  const receiptError =
    draft.receipt === null ? null : receiptRejection(draft.receipt);
  // A picked receipt can still be read, and a failed read retried.
  const fillableReceipt =
    mode === "create" &&
    (scan.status === "idle" || scan.status === "failed") &&
    receiptError === null
      ? draft.receipt
      : null;

  const canSave =
    !isSaving &&
    draft.supplier.trim() !== "" &&
    ttcCents !== null &&
    proShareBp !== null &&
    recurringDayError === undefined &&
    receiptError === null;

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();

        if (canSave) {
          onSubmit(draft);
        }
      }}
    >
      <SheetBody className="flex flex-col gap-4 pb-4">
        {mode === "create" && (
          <>
            <SegmentedControl
              aria-label={m.expenses_entry_mode_aria()}
              className="w-full"
              onValueChange={(value) => {
                if (value[0] === "scan" || value[0] === "type") {
                  setEntryMode(value[0]);
                }
              }}
              size="sm"
              value={[entryMode]}
              variant="raised"
            >
              <SegmentedControlItem value="scan">
                {m.expenses_mode_scan()}
              </SegmentedControlItem>
              <SegmentedControlItem value="type">
                {m.expenses_mode_type()}
              </SegmentedControlItem>
            </SegmentedControl>
            {entryMode === "scan" ? (
              <ReceiptScanZone
                onFile={readReceipt}
                onReset={resetScan}
                state={scan}
              />
            ) : (
              <QuickEntryInput onChange={applyQuickEntry} value={quickEntry} />
            )}
          </>
        )}

        {error !== null && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Field data-invalid={supplierError !== undefined}>
          <FieldLabel htmlFor={`${id}-supplier`}>
            {m.expenses_field_supplier()}
            <FieldSourceTag source={sources.supplier} />
          </FieldLabel>
          <Input
            aria-invalid={supplierError !== undefined}
            id={`${id}-supplier`}
            onChange={(event) => patch({ supplier: event.target.value })}
            value={draft.supplier}
          />
          <FieldError>{supplierError}</FieldError>
        </Field>

        <div className="grid grid-cols-2 gap-3.5">
          <Field data-invalid={spentOnError !== undefined}>
            <FieldLabel htmlFor={`${id}-date`}>
              {m.expenses_field_date()}
              <FieldSourceTag source={sources.spentOn} />
            </FieldLabel>
            <DateField
              aria-invalid={spentOnError !== undefined}
              id={`${id}-date`}
              max={today}
              onChange={(value) => patch({ spentOn: value })}
              value={draft.spentOn}
            />
            <FieldError>{spentOnError}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor={`${id}-category`}>
              {m.expenses_field_category()}
              <FieldSourceTag source={sources.category} />
            </FieldLabel>
            <NativeSelect
              id={`${id}-category`}
              onChange={(event) =>
                patch({
                  category: Number(event.target.value) as ExpenseCategory,
                })
              }
              value={String(draft.category)}
            >
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={String(category)}>
                  {expenseCategoryLabel(category)}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>

        <Field data-invalid={amountError !== undefined}>
          <FieldLabel htmlFor={`${id}-ttc`}>
            {m.expenses_field_amount_ttc()}
            <FieldSourceTag source={sources.ttc} />
          </FieldLabel>
          <InputGroup className="w-52">
            <InputGroupInput
              aria-invalid={amountError !== undefined}
              id={`${id}-ttc`}
              inputMode="decimal"
              onChange={(event) =>
                patch({
                  ttc: formatSignedDraft(format.locale, event.target.value),
                })
              }
              value={draft.ttc}
            />
            <InputGroupSuffix>{currencySymbol(format)}</InputGroupSuffix>
          </InputGroup>
          {amountError !== undefined ? (
            <FieldError>{amountError}</FieldError>
          ) : (
            isVatLiable &&
            amounts !== null && (
              <FieldDescription>
                {m.expenses_field_ht_hint({
                  amount: formatAmountWithCents(format, amounts.htCents),
                })}
              </FieldDescription>
            )
          )}
        </Field>

        {isVatLiable && (
          <>
            <ProShareField
              error={proShareError}
              onChange={(value) => patch({ proShare: value })}
              value={draft.proShare}
            />
            <VatChoiceField
              keptTerms={draft.vatTerms}
              legendTag={<FieldSourceTag source={sources.vatChoice} />}
              onChange={(value) => patch({ vatChoice: value })}
              value={draft.vatChoice}
            />
          </>
        )}

        <Field data-invalid={descriptionError !== undefined}>
          <FieldLabel htmlFor={`${id}-description`}>
            {m.expenses_field_description()}
            <FieldSourceTag source={sources.description} />
          </FieldLabel>
          <Input
            aria-invalid={descriptionError !== undefined}
            id={`${id}-description`}
            onChange={(event) => patch({ description: event.target.value })}
            placeholder={m.expenses_field_description_placeholder()}
            value={draft.description}
          />
          <FieldError>{descriptionError}</FieldError>
        </Field>

        <ExpenseCalcBox
          amounts={amounts}
          category={draft.category}
          isVatLiable={isVatLiable}
          vatTerms={vatTerms}
        />

        <ReceiptField
          onChange={(receipt) =>
            receipt === null && mode === "create"
              ? resetScan()
              : patch({ receipt })
          }
          onFill={
            fillableReceipt === null
              ? undefined
              : () => void readReceipt(fillableReceipt)
          }
          storedFileName={storedReceiptName}
          value={draft.receipt}
        />

        {mode === "create" && (
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex h-9 items-center gap-2.5">
              <Switch
                checked={draft.isRecurring}
                id={`${id}-recurring`}
                onCheckedChange={(isRecurring) => patch({ isRecurring })}
              />
              <Label htmlFor={`${id}-recurring`} size="md">
                {m.expenses_field_recurring()}
              </Label>
            </div>
            {draft.isRecurring && (
              <Field
                className="w-auto"
                data-invalid={recurringDayError !== undefined}
              >
                <FieldLabel htmlFor={`${id}-day`}>
                  {m.expenses_field_recurring_day()}
                </FieldLabel>
                <Input
                  aria-invalid={recurringDayError !== undefined}
                  className="w-16"
                  font="mono"
                  id={`${id}-day`}
                  inputMode="numeric"
                  max={31}
                  min={1}
                  onChange={(event) =>
                    patch({ recurringDay: event.target.value })
                  }
                  type="number"
                  value={draft.recurringDay}
                />
                {recurringDayError !== undefined ? (
                  <FieldError>{recurringDayError}</FieldError>
                ) : (
                  <FieldDescription>
                    {m.expenses_recurring_hint()}
                  </FieldDescription>
                )}
              </Field>
            )}
          </div>
        )}
      </SheetBody>

      <SheetFooter className="flex-row justify-end border-t">
        <Button onClick={onCancel} size="xl" type="button" variant="outline">
          {m.common_cancel()}
        </Button>
        <Button disabled={!canSave} size="xl" type="submit">
          {isSaving ? m.common_saving() : m.common_save()}
        </Button>
      </SheetFooter>
    </form>
  );
}
