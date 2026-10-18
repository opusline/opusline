import type { InvoicePaperData } from "@opusline/api-client";
import { type RefObject, useLayoutEffect, useRef, useState } from "react";

import { INVOICE_PAPER as P } from "@/lib/paper";

/** The narrowest the sheet is drawn at (`min-w-150`): below it, it keeps its print proportions. */
const SHEET_MIN_WIDTH_PX = 600;

/** How much a column this wide shrinks the sheet: never enlarges it, like a print preview. */
export function fitScale(columnWidthPx: number): number {
  return columnWidthPx > 0
    ? Math.min(1, columnWidthPx / SHEET_MIN_WIDTH_PX)
    : 1;
}

function useFitScale(column: RefObject<HTMLDivElement | null>): number {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const element = column.current;

    if (element === null) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setScale(fitScale(entry?.contentRect.width ?? 0));
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, [column]);

  return scale;
}

type InvoicePaperProps = {
  paper: InvoicePaperData;
  /** The account's logo, set only when one is stored. */
  logoSrc?: string;
};

/**
 * The invoice as the client receives it, drawn from InvoicePaperData: every
 * word on it was resolved by the API in the document's language, so this sheet
 * and the PDF (resources/views/invoices/document.blade.php) cannot disagree.
 * Paper is white whatever the theme.
 */
export function InvoicePaper({ paper, logoSrc }: InvoicePaperProps) {
  const column = useRef<HTMLDivElement>(null);
  const scale = useFitScale(column);

  return (
    // A column narrower than the sheet shrinks it whole, like a print preview,
    // rather than cutting its right edge: `zoom` also shrinks the box it takes.
    <div ref={column}>
      <div
        className="min-w-150"
        data-scale={scale}
        style={scale < 1 ? { zoom: scale } : undefined}
      >
        <article
          className="flex min-h-200 flex-col overflow-hidden rounded-xs text-xs leading-normal shadow-2xl"
          data-testid="invoice-paper"
          lang={paper.language === 1 ? "en" : "fr"}
          style={{ background: P.sheet, color: P.ink }}
        >
          <div className="h-0.75 flex-none" style={{ background: P.bar }} />
          <div className="flex flex-1 flex-col px-8.5 pt-9 pb-6.5">
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                {paper.hasLogo && logoSrc !== undefined ? (
                  <img
                    alt=""
                    className="mb-4.5 max-h-14 max-w-40 object-contain object-left"
                    src={logoSrc}
                  />
                ) : null}
                <div
                  className="font-semibold text-lg tracking-tight"
                  data-testid="invoice-paper-title"
                  style={{ color: P.strong }}
                >
                  {paper.title}
                </div>
                <div className="mt-2 flex flex-col gap-0.5">
                  {paper.meta.map((row) => (
                    <div key={row.label}>
                      <span className="font-semibold">
                        {row.label}
                        {paper.labelSeparator}
                      </span>{" "}
                      {row.value}
                    </div>
                  ))}
                </div>
              </div>
              {paper.stamp === null ? null : (
                <span
                  className="inline-flex h-5.5 flex-none items-center rounded-xs border px-2.25 text-2xs uppercase tracking-wider-2"
                  data-testid="invoice-paper-stamp"
                  style={{ borderColor: P.stamp, color: P.stampInk }}
                >
                  {paper.stamp}
                </span>
              )}
            </div>

            <div className="my-4.5 h-px" style={{ background: P.rule }} />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="font-semibold" style={{ color: P.strong }}>
                  {paper.seller.name}
                </div>
                {paper.seller.lines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
              <div className="text-right">
                <div className="font-semibold" style={{ color: P.strong }}>
                  {paper.buyer.name}
                </div>
                {paper.buyer.lines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            </div>

            {paper.documentTitle === null ? null : (
              <div
                className="mt-6.5 mb-1 font-semibold text-sm"
                style={{ color: P.strong }}
              >
                {paper.documentTitle}
              </div>
            )}
            {paper.description === null ? null : (
              <div
                className="mb-1.5 whitespace-pre-wrap"
                style={{ color: P.soft }}
              >
                {paper.description}
              </div>
            )}

            <table className="mt-2.5 w-full tabular-nums">
              <thead>
                <tr
                  className="text-2xs"
                  style={{ background: P.head, color: P.body }}
                >
                  <th className="px-2 py-1.75 text-left font-semibold">
                    {paper.head.description}
                  </th>
                  <th className="px-1.5 py-1.75 text-right font-semibold">
                    {paper.head.quantity}
                  </th>
                  <th className="px-1.5 py-1.75 text-right font-semibold">
                    {paper.head.unitPrice}
                  </th>
                  <th className="px-1.5 py-1.75 text-right font-semibold">
                    {paper.head.vat}
                  </th>
                  <th className="px-2 py-1.75 text-right font-semibold">
                    {paper.head.total}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paper.lines.length === 0 ? (
                  <tr style={{ borderBottom: `1px solid ${P.ruleSoft}` }}>
                    <td
                      className="px-2 py-4"
                      colSpan={5}
                      style={{ color: P.faint }}
                    >
                      {paper.noLinesLabel}
                    </td>
                  </tr>
                ) : (
                  paper.lines.map((line, index) => (
                    <tr
                      // biome-ignore lint/suspicious/noArrayIndexKey: lines carry no id on an unsaved draft, and two may share a label
                      key={index}
                      style={{ borderBottom: `1px solid ${P.ruleSoft}` }}
                    >
                      <td className="px-2 py-2.25 align-top">
                        <div
                          className="font-semibold"
                          style={{ color: P.strong }}
                        >
                          {line.label}
                        </div>
                        {line.detail === null ? null : (
                          <div
                            className="mt-0.5 whitespace-pre-wrap"
                            style={{ color: P.quiet }}
                          >
                            {line.detail}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-1.5 py-2.25 text-right align-top">
                        {line.quantity}
                      </td>
                      <td className="whitespace-nowrap px-1.5 py-2.25 text-right align-top">
                        {line.unitPrice}
                      </td>
                      <td className="whitespace-nowrap px-1.5 py-2.25 text-right align-top">
                        {line.vat}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2.25 text-right align-top">
                        {line.total}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-5 tabular-nums">
              <table
                className="text-2xs"
                style={{ border: `1px solid ${P.rule}` }}
              >
                <thead>
                  <tr style={{ background: P.head }}>
                    <th className="px-2 py-1.25 text-left font-semibold">
                      {paper.vatHead.base}
                    </th>
                    <th className="px-2 py-1.25 text-left font-semibold">
                      {paper.vatHead.rate}
                    </th>
                    <th className="px-2 py-1.25 text-left font-semibold">
                      {paper.vatHead.amount}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paper.vatRows.map((row) => (
                    <tr key={row.rate}>
                      <td className="px-2 py-1.25">{row.base}</td>
                      <td className="px-2 py-1.25">{row.rate}</td>
                      <td className="px-2 py-1.25">{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                className="min-w-57.5"
                data-testid="invoice-paper-totals"
                style={{ border: `1px solid ${P.rule}` }}
              >
                {paper.totals.map((total) => (
                  <div
                    className="flex justify-between gap-4 px-2.5 py-1.5"
                    key={total.label}
                    style={
                      total.emphasis
                        ? {
                            background: P.emphasis,
                            color: P.strong,
                            fontWeight: 600,
                          }
                        : { borderBottom: `1px solid ${P.ruleSoft}` }
                    }
                  >
                    <span>{total.label}</span>
                    <span>{total.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {paper.paymentTitle === null ? null : (
              <div className="mt-6" style={{ border: `1px solid ${P.rule}` }}>
                <div
                  className="px-2.5 py-1.5 font-semibold text-2xs"
                  style={{ background: P.head }}
                >
                  {paper.paymentTitle}
                </div>
                <div className="flex flex-col gap-0.5 px-2.5 py-2">
                  {paper.payment.map((row) => (
                    <div key={row.label}>
                      <span className="font-semibold">
                        {row.label}
                        {paper.labelSeparator}
                      </span>{" "}
                      {row.value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {paper.signature === null ? null : (
              <div
                className="mt-6 ml-auto h-22.5 w-60 px-2.5 py-2 text-2xs"
                data-testid="invoice-paper-signature"
                style={{ border: `1px dashed ${P.stamp}`, color: P.stampInk }}
              >
                <div className="font-semibold" style={{ color: P.strong }}>
                  {paper.signature.title}
                </div>
                <div className="mt-0.5">{paper.signature.caption}</div>
              </div>
            )}

            <p
              className="mt-5.5 text-2xs leading-relaxed text-pretty"
              data-testid="invoice-paper-legal"
              style={{ color: P.quiet }}
            >
              {paper.legal}
            </p>
            <div className="flex-1" />
            <div
              className="mt-6 pt-2 text-right text-2xs"
              style={{ borderTop: `1px solid ${P.ruleSoft}`, color: P.faint }}
            >
              {paper.footer}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
