import type {
  CatalogItemData,
  CatalogItemInputData,
  LineUnit,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import { NativeSelect } from "@opusline/ui/components/native-select";
import { Panel, PanelTitle } from "@opusline/ui/components/panel";
import { CircleAlert, Plus } from "lucide-react";
import { useId, useState } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import {
  currencySymbol,
  formatAmount,
  formatAmountWithCents,
  formatPercentFromBp,
  formatRateDraft,
  parseAmountToCents,
} from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import {
  LINE_UNIT_LABELS,
  LINE_UNITS,
  vatRateOptions,
} from "../lib/line-units";

const LABEL = "text-muted-foreground-2 text-xs";

type Draft = {
  id: number | null;
  label: string;
  detail: string;
  unit: LineUnit;
  unitPrice: string;
  vatRateBp: number;
};

type CatalogPageProps = {
  items: CatalogItemData[];
  /** Under the franchise no line carries VAT, so the rate column reads « franchise ». */
  vatLiable: boolean;
  isSaving: boolean;
  error: string | null;
  /** Resolves true once saved, so the form closes only on success. */
  onSave: (id: number | null, body: CatalogItemInputData) => Promise<boolean>;
  onRemove: (item: CatalogItemData) => void;
};

export function CatalogPage({
  items,
  vatLiable,
  isSaving,
  error,
  onSave,
  onRemove,
}: CatalogPageProps) {
  const format = useMoneyFormat();
  const [draft, setDraft] = useState<Draft | null>(null);

  const openNew = () =>
    setDraft({
      id: null,
      label: "",
      detail: "",
      unit: 0,
      unitPrice: "",
      vatRateBp: vatLiable ? 2000 : 0,
    });

  const openEdit = (item: CatalogItemData) =>
    setDraft({
      id: item.id,
      label: item.label,
      detail: item.detail ?? "",
      unit: item.unit,
      unitPrice: formatAmount(format, item.unitPrice.amount),
      vatRateBp: item.vatRateBp,
    });

  return (
    <div className="max-w-200">
      <div className="mb-6.5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            className="mb-1 font-heading font-semibold text-2xl text-foreground-hi"
            data-testid="page-heading"
          >
            {m.catalog_title()}
          </h1>
          <p className="max-w-140 text-muted-foreground-3 text-sm">
            {m.catalog_subtitle()}
          </p>
        </div>
        {draft === null ? (
          <Button data-testid="catalog-add" onClick={openNew} size="xl">
            <Plus data-icon="inline-start" />
            {m.catalog_add()}
          </Button>
        ) : null}
      </div>

      {error === null ? null : (
        <Alert className="mb-4" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {draft === null ? null : (
        <CatalogItemForm
          draft={draft}
          isSaving={isSaving}
          onCancel={() => setDraft(null)}
          onChange={setDraft}
          onSave={async (body) => {
            if (await onSave(draft.id, body)) {
              setDraft(null);
            }
          }}
        />
      )}

      {items.length === 0 ? (
        draft === null ? (
          <Empty className="rounded-md border" data-testid="catalog-empty">
            <EmptyHeader>
              <EmptyTitle>{m.catalog_empty_title()}</EmptyTitle>
              <EmptyDescription>
                {m.catalog_empty_description()}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null
      ) : (
        <Panel clip>
          <table className="w-full text-sm">
            <thead className="bg-muted-2 text-left text-muted-foreground-3 text-xs">
              <tr>
                <th className="px-5 py-2.5 font-medium" scope="col">
                  {m.catalog_count({ count: items.length })}
                </th>
                <th
                  className="hidden px-3 py-2.5 font-medium sm:table-cell"
                  scope="col"
                >
                  {m.catalog_unit()}
                </th>
                <th className="px-3 py-2.5 text-right font-medium" scope="col">
                  {m.catalog_price_column()}
                </th>
                <th
                  className="hidden px-3 py-2.5 text-right font-medium sm:table-cell"
                  scope="col"
                >
                  {m.catalog_vat()}
                </th>
                <th className="px-5 py-2.5" scope="col">
                  <span className="sr-only">{m.catalog_actions()}</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <tr
                  data-testid="catalog-item"
                  data-item={item.id}
                  key={item.id}
                >
                  <td className="px-5 py-3 align-top">
                    <div className="text-foreground-hi">{item.label}</div>
                    {item.detail === null ? null : (
                      <div className="mt-0.5 text-muted-foreground-3 text-xs">
                        {item.detail}
                      </div>
                    )}
                  </td>
                  <td className="hidden px-3 py-3 align-top text-foreground-3 sm:table-cell">
                    {LINE_UNIT_LABELS[item.unit]()}
                  </td>
                  <td
                    className="px-3 py-3 text-right align-top font-mono text-foreground-2 tabular-nums"
                    data-amount-cents={item.unitPrice.amount}
                    data-testid="catalog-item-price"
                  >
                    {formatAmountWithCents(format, item.unitPrice.amount)}
                  </td>
                  <td className="hidden px-3 py-3 text-right align-top text-foreground-3 tabular-nums sm:table-cell">
                    {vatLiable
                      ? `${formatPercentFromBp(format.locale, item.vatRateBp)} %`
                      : m.catalog_franchise()}
                  </td>
                  <td className="py-2 pr-3 text-right align-top sm:px-5">
                    <div className="flex flex-col items-end gap-1 sm:flex-row sm:justify-end">
                      <Button
                        data-testid="catalog-item-edit"
                        disabled={isSaving}
                        onClick={() => openEdit(item)}
                        size="sm"
                        variant="ghost"
                      >
                        {m.catalog_edit()}
                      </Button>
                      <Button
                        data-testid="catalog-item-remove"
                        disabled={isSaving}
                        onClick={() => onRemove(item)}
                        size="sm"
                        variant="ghost"
                      >
                        {m.catalog_remove()}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}

function CatalogItemForm({
  draft,
  isSaving,
  onChange,
  onCancel,
  onSave,
}: {
  draft: Draft;
  isSaving: boolean;
  onChange: (draft: Draft) => void;
  onCancel: () => void;
  onSave: (body: CatalogItemInputData) => void;
}) {
  const format = useMoneyFormat();
  const ids = {
    label: useId(),
    detail: useId(),
    unit: useId(),
    price: useId(),
    vat: useId(),
    labelError: useId(),
    priceError: useId(),
  };
  const [showErrors, setShowErrors] = useState(false);
  const cents = parseAmountToCents(format.locale, draft.unitPrice);
  const labelError =
    draft.label.trim() === "" ? m.catalog_label_required() : null;
  const priceError = cents === null ? m.catalog_price_required() : null;
  const update = (patch: Partial<Draft>) => onChange({ ...draft, ...patch });

  const submit = () => {
    if (labelError !== null || cents === null) {
      setShowErrors(true);
      return;
    }

    onSave({
      label: draft.label,
      detail: draft.detail.trim() === "" ? null : draft.detail,
      unit: draft.unit,
      unitPrice: { amount: cents, currency: format.currency },
      vatRateBp: draft.vatRateBp,
    });
  };

  return (
    <Panel className="mb-4 px-5 py-6 sm:px-7" data-testid="catalog-form">
      <PanelTitle className="mb-4">
        {draft.id === null ? m.catalog_form_new() : m.catalog_form_edit()}
      </PanelTitle>
      <form
        className="grid gap-4 sm:grid-cols-6"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Field
          className="sm:col-span-6"
          data-invalid={showErrors && labelError !== null}
        >
          <FieldLabel className={LABEL} htmlFor={ids.label}>
            {m.catalog_label()}
          </FieldLabel>
          <Input
            aria-describedby={
              showErrors && labelError !== null ? ids.labelError : undefined
            }
            aria-invalid={showErrors && labelError !== null}
            data-testid="catalog-form-label"
            id={ids.label}
            maxLength={255}
            onChange={(event) => update({ label: event.target.value })}
            value={draft.label}
          />
          {showErrors && labelError !== null ? (
            <FieldError
              errors={[{ message: labelError }]}
              id={ids.labelError}
            />
          ) : null}
        </Field>
        <Field className="sm:col-span-6">
          <FieldLabel className={LABEL} htmlFor={ids.detail}>
            {m.catalog_detail()}
          </FieldLabel>
          <Input
            data-testid="catalog-form-detail"
            id={ids.detail}
            maxLength={1000}
            onChange={(event) => update({ detail: event.target.value })}
            value={draft.detail}
          />
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel className={LABEL} htmlFor={ids.unit}>
            {m.catalog_unit()}
          </FieldLabel>
          <NativeSelect
            data-testid="catalog-form-unit"
            id={ids.unit}
            onChange={(event) =>
              update({ unit: Number(event.target.value) as LineUnit })
            }
            value={String(draft.unit)}
          >
            {LINE_UNITS.map((unit) => (
              <option key={unit} value={String(unit)}>
                {LINE_UNIT_LABELS[unit]()}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field
          className="sm:col-span-2"
          data-invalid={showErrors && priceError !== null}
        >
          <FieldLabel className={LABEL} htmlFor={ids.price}>
            {m.catalog_unit_price()}
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              aria-describedby={
                showErrors && priceError !== null ? ids.priceError : undefined
              }
              aria-invalid={showErrors && priceError !== null}
              data-testid="catalog-form-price"
              id={ids.price}
              inputMode="decimal"
              onChange={(event) =>
                update({
                  unitPrice: formatRateDraft(format.locale, event.target.value),
                })
              }
              value={draft.unitPrice}
            />
            <InputGroupSuffix>{currencySymbol(format)}</InputGroupSuffix>
          </InputGroup>
          {showErrors && priceError !== null ? (
            <FieldError
              errors={[{ message: priceError }]}
              id={ids.priceError}
            />
          ) : null}
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel className={LABEL} htmlFor={ids.vat}>
            {m.catalog_vat()}
          </FieldLabel>
          <NativeSelect
            data-testid="catalog-form-vat"
            id={ids.vat}
            onChange={(event) =>
              update({ vatRateBp: Number(event.target.value) })
            }
            value={String(draft.vatRateBp)}
          >
            {vatRateOptions(draft.vatRateBp).map((rate) => (
              <option key={rate} value={String(rate)}>
                {formatPercentFromBp(format.locale, rate)} %
              </option>
            ))}
          </NativeSelect>
        </Field>
        <div className="flex flex-wrap justify-end gap-2 sm:col-span-6">
          <Button
            disabled={isSaving}
            onClick={onCancel}
            size="xl"
            type="button"
            variant="outline"
          >
            {m.common_cancel()}
          </Button>
          <Button
            data-testid="catalog-form-save"
            disabled={isSaving}
            size="xl"
            type="submit"
          >
            {m.common_save()}
          </Button>
        </div>
      </form>
    </Panel>
  );
}
