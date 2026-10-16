import type { ClientData, QuoteStatus } from "@opusline/api-client";
import { Button, buttonVariants } from "@opusline/ui/components/button";
import { Chip, ChipGroup } from "@opusline/ui/components/chip";
import { Input } from "@opusline/ui/components/input";
import { Label } from "@opusline/ui/components/label";
import { NativeSelect } from "@opusline/ui/components/native-select";
import { Panel } from "@opusline/ui/components/panel";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, FileText, UploadIcon, X } from "lucide-react";
import { useId, useRef, useState } from "react";

import { DateField } from "@/components/date-field";
import { useMoneyFormat } from "@/components/money-format-provider";
import { parseAmountToCents } from "@/lib/billing";
import {
  formatFileSize,
  ISSUED_DOCUMENT_ACCEPT,
  rejectIssuedDocumentReason,
} from "@/lib/documents";
import { m } from "@/paraglide/messages.js";
import { quoteStatusLabel } from "../lib/quote-status";

/** Sent, accepted, refused: a quote the client already holds is never a draft. */
const STATUSES: QuoteStatus[] = [1, 2, 3];

export type ExternalQuoteSubmit = {
  clientId: number;
  title: string | null;
  number: string;
  amountHtCents: number;
  issuedOn: string;
  status: QuoteStatus;
  /** The PDF the other tool produced, filed once the quote is recorded. */
  file: File | null;
};

type ExternalQuotePageProps = {
  clients: ClientData[];
  /** `Y-m-d` in the account timezone: the latest day a quote can have been issued. */
  accountToday: string;
  isSaving: boolean;
  error: string | null;
  onSubmit: (input: ExternalQuoteSubmit) => void;
};

/**
 * Records a quote issued in another tool. Opusline follows the client's answer
 * and what gets invoiced from it; the reference and the figure are what that
 * tool printed, and the PDF is its own.
 */
export function ExternalQuotePage({
  clients,
  accountToday,
  isSaving,
  error,
  onSubmit,
}: ExternalQuotePageProps) {
  const format = useMoneyFormat();
  const ids = {
    client: useId(),
    title: useId(),
    number: useId(),
    amount: useId(),
    issued: useId(),
    file: useId(),
  };
  const picker = useRef<HTMLInputElement>(null);
  const [clientId, setClientId] = useState<number | null>(
    clients[0]?.id ?? null,
  );
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [amountDraft, setAmountDraft] = useState("");
  const [issuedOn, setIssuedOn] = useState(accountToday);
  const [status, setStatus] = useState<QuoteStatus>(1);
  const [file, setFile] = useState<File | null>(null);
  const [rejected, setRejected] = useState<string | null>(null);

  const amountHtCents = parseAmountToCents(format.locale, amountDraft);
  const isNumberMissing = number.trim() === "";
  const canSubmit =
    clientId !== null &&
    amountHtCents !== null &&
    !isNumberMissing &&
    issuedOn !== "" &&
    !isSaving;

  const pick = (candidate: File | undefined) => {
    if (candidate === undefined) {
      return;
    }

    const reason = rejectIssuedDocumentReason(candidate);

    setRejected(
      reason === null
        ? null
        : m.invoices_document_rejected({ name: candidate.name, reason }),
    );

    if (reason === null) {
      setFile(candidate);
    }
  };

  return (
    <div className="pb-16">
      <div className="mb-6 flex items-center gap-3">
        <Link
          aria-label={m.quote_document_back()}
          className={buttonVariants({ size: "icon-lg", variant: "ghost" })}
          to="/invoicing/quotes"
        >
          <ChevronLeft />
        </Link>
        <Link
          className="text-muted-foreground-3 text-sm hover:text-foreground-hi"
          to="/invoicing/quotes"
        >
          {m.invoicing_nav_quotes()}
        </Link>
      </div>

      <Panel className="max-w-2xl px-6 py-6" padding="none">
        <h1
          className="font-heading font-semibold text-foreground-hi text-xl"
          data-testid="page-heading"
        >
          {m.external_quote_title()}
        </h1>
        <p className="mt-1 text-muted-foreground-3 text-sm text-pretty">
          {m.external_quote_intro()}
        </p>

        {clients.length === 0 ? (
          <p
            className="mt-5 text-muted-foreground-3 text-sm"
            data-testid="external-quote-no-clients"
          >
            {m.external_quote_no_clients()}
          </p>
        ) : (
          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();

              if (!canSubmit || amountHtCents === null || clientId === null) {
                return;
              }

              onSubmit({
                clientId,
                title: title.trim() === "" ? null : title.trim(),
                number: number.trim(),
                amountHtCents,
                issuedOn,
                status,
                file,
              });
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={ids.client}>{m.editor_client()}</Label>
              <NativeSelect
                data-testid="external-quote-client"
                id={ids.client}
                onChange={(event) => setClientId(Number(event.target.value))}
                value={clientId === null ? "" : String(clientId)}
              >
                {clients.map((candidate) => (
                  <option key={candidate.id} value={String(candidate.id)}>
                    {candidate.name}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={ids.title}>
                {m.external_quote_title_label()}
              </Label>
              <Input
                data-testid="external-quote-title"
                id={ids.title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={m.external_quote_title_placeholder()}
                value={title}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={ids.number}>
                  {m.invoices_reference_label()}
                </Label>
                <Input
                  data-testid="external-quote-reference"
                  id={ids.number}
                  onChange={(event) => setNumber(event.target.value)}
                  placeholder={m.external_quote_reference_placeholder()}
                  value={number}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={ids.amount}>
                  {m.invoices_amount_ht_label()}
                </Label>
                <Input
                  aria-invalid={amountDraft !== "" && amountHtCents === null}
                  data-testid="external-quote-amount"
                  id={ids.amount}
                  inputMode="decimal"
                  onChange={(event) => setAmountDraft(event.target.value)}
                  value={amountDraft}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={ids.issued}>
                  {m.invoices_add_issued_label()}
                </Label>
                <DateField
                  id={ids.issued}
                  max={accountToday}
                  onChange={setIssuedOn}
                  value={issuedOn}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{m.invoices_add_status_label()}</Label>
                <ChipGroup
                  aria-label={m.invoices_add_status_label()}
                  onValueChange={(value) => {
                    const picked = value[0];

                    if (typeof picked === "string") {
                      setStatus(Number(picked) as QuoteStatus);
                    }
                  }}
                  value={[String(status)]}
                >
                  {STATUSES.map((candidate) => (
                    <Chip
                      data-status={candidate}
                      data-testid="external-quote-status"
                      key={candidate}
                      value={String(candidate)}
                    >
                      {quoteStatusLabel(candidate)}
                    </Chip>
                  ))}
                </ChipGroup>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={ids.file}>{m.external_quote_pdf_label()}</Label>
              <input
                accept={ISSUED_DOCUMENT_ACCEPT}
                className="hidden"
                data-testid="external-quote-file"
                id={ids.file}
                onChange={(event) => {
                  pick(event.target.files?.[0]);
                  event.target.value = "";
                }}
                ref={picker}
                type="file"
              />
              {file === null ? (
                <button
                  className="flex w-full cursor-pointer items-center gap-3.5 rounded-md border border-border-3 border-dashed px-5 py-4 text-left transition-colors hover:border-muted-foreground-6 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20"
                  data-testid="external-quote-file-pick"
                  onClick={() => picker.current?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    pick(event.dataTransfer.files[0]);
                  }}
                  type="button"
                >
                  <span className="flex size-9.5 shrink-0 items-center justify-center rounded-md bg-muted">
                    <UploadIcon
                      aria-hidden
                      className="size-4 text-muted-foreground-3"
                    />
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.75">
                    <span className="text-foreground-hi text-sm">
                      {m.external_quote_pdf_pick()}
                    </span>
                    <span className="text-muted-foreground-3 text-xs">
                      {m.external_quote_pdf_hint()}
                    </span>
                  </span>
                </button>
              ) : (
                <div
                  className="flex items-center gap-3 rounded-md border px-4 py-3"
                  data-testid="external-quote-file-chosen"
                >
                  <FileText
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground-3"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-foreground-hi text-sm">
                      {file.name}
                    </span>
                    <span className="block text-muted-foreground-3 text-xs">
                      {formatFileSize(format.locale, file.size)}
                    </span>
                  </span>
                  <Button
                    aria-label={m.external_quote_pdf_remove()}
                    onClick={() => setFile(null)}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <X />
                  </Button>
                </div>
              )}
              {rejected !== null && (
                <p className="text-destructive text-sm" role="alert">
                  {rejected}
                </p>
              )}
            </div>

            {error !== null && (
              <p className="text-destructive text-sm" role="alert">
                {error}
              </p>
            )}

            <div className="mt-2 flex flex-wrap justify-end gap-2">
              <Link
                className={buttonVariants({ size: "xl", variant: "ghost" })}
                data-testid="external-quote-cancel"
                to="/invoicing/quotes"
              >
                {m.common_cancel()}
              </Link>
              <Button
                data-testid="external-quote-submit"
                disabled={!canSubmit}
                size="xl"
                type="submit"
              >
                {isSaving
                  ? m.external_quote_saving()
                  : m.external_quote_submit()}
              </Button>
            </div>
          </form>
        )}
      </Panel>
    </div>
  );
}
