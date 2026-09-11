import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { MoneyFormatProvider } from "@/components/money-format-provider";
import { INVOICE_DOCUMENT, invoiceDetail } from "../lib/fixtures";
import { InvoiceDocumentPanel } from "./invoice-document-panel";

function renderPanel(
  props: Partial<Parameters<typeof InvoiceDocumentPanel>[0]> = {},
) {
  const onUpload = vi.fn();
  const onRemove = vi.fn();
  const panel = (
    extra: Partial<Parameters<typeof InvoiceDocumentPanel>[0]> = {},
  ) => (
    <MoneyFormatProvider currency="EUR" dateFormat={0} locale="fr-FR">
      <InvoiceDocumentPanel
        document={null}
        error={null}
        invoice={invoiceDetail({ status: 1 }).invoice}
        isPending={false}
        onRemove={onRemove}
        onUpload={onUpload}
        {...props}
        {...extra}
      />
    </MoneyFormatProvider>
  );

  const { rerender } = render(panel());

  return {
    onUpload,
    onRemove,
    /** The upload is the parent's to run, so its state arrives as new props. */
    uploading: (extra: Partial<Parameters<typeof InvoiceDocumentPanel>[0]>) =>
      rerender(panel(extra)),
  };
}

function picker(): HTMLInputElement {
  const input = document.querySelector<HTMLInputElement>('input[type="file"]');

  if (input === null) {
    throw new Error("the panel renders no file picker");
  }

  return input;
}

const pdf = (name = "facture.pdf") =>
  new File(["%PDF-1.4"], name, { type: "application/pdf" });

it("offers nothing on a draft, which was never issued", () => {
  renderPanel({ invoice: invoiceDetail({ status: 0 }).invoice });

  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

it("asks for the document while the invoice carries none", () => {
  renderPanel();

  expect(
    screen.getByRole("button", { name: /Ajouter la facture/ }),
  ).toBeInTheDocument();
});

it("files the picked document", () => {
  const { onUpload } = renderPanel();
  const file = pdf();

  fireEvent.change(picker(), { target: { files: [file] } });

  expect(onUpload).toHaveBeenCalledWith(file);
});

it("opens the picker from the dropzone", () => {
  renderPanel();
  const opened = vi.spyOn(picker(), "click");

  fireEvent.click(screen.getByRole("button", { name: /Ajouter la facture/ }));

  expect(opened).toHaveBeenCalled();
});

it("opens the picker from the replace button", () => {
  renderPanel({ document: INVOICE_DOCUMENT });
  const opened = vi.spyOn(picker(), "click");

  fireEvent.click(screen.getByRole("button", { name: "Remplacer" }));

  expect(opened).toHaveBeenCalled();
});

it("files a document dropped onto the zone", () => {
  const { onUpload } = renderPanel();
  const file = pdf();
  const zone = screen.getByRole("button", { name: /Ajouter la facture/ });

  fireEvent.dragOver(zone);
  fireEvent.drop(zone, { dataTransfer: { files: [file] } });

  expect(onUpload).toHaveBeenCalledWith(file);
});

it("stops offering the controls while a write is in flight", () => {
  renderPanel({ document: INVOICE_DOCUMENT, isPending: true });

  expect(screen.getByRole("button", { name: "Remplacer" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Retirer" })).toBeDisabled();
});

it("ignores a drop that carries no file", () => {
  const { onUpload } = renderPanel();
  const zone = screen.getByRole("button", { name: /Ajouter la facture/ });

  fireEvent.dragLeave(zone);
  fireEvent.drop(zone, { dataTransfer: { files: [] } });

  expect(onUpload).not.toHaveBeenCalled();
});

it("refuses a file an invoice would never be, without calling the API", () => {
  const { onUpload } = renderPanel();

  fireEvent.change(picker(), {
    target: { files: [new File(["a,b"], "lignes.csv", { type: "text/csv" })] },
  });

  expect(onUpload).not.toHaveBeenCalled();
  expect(screen.getByRole("alert")).toHaveTextContent("lignes.csv");
});

it("refuses a file heavier than the API accepts", () => {
  const { onUpload } = renderPanel();
  const heavy = new File(["x"], "facture.pdf", { type: "application/pdf" });
  Object.defineProperty(heavy, "size", { value: 21 * 1024 * 1024 });

  fireEvent.change(picker(), { target: { files: [heavy] } });

  expect(onUpload).not.toHaveBeenCalled();
  expect(screen.getByRole("alert")).toHaveTextContent("trop lourd");
});

it("shows what is filed, with a way to download it", () => {
  renderPanel({ document: INVOICE_DOCUMENT });

  expect(screen.getByText("F-2026-014.pdf")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Télécharger F-2026-014.pdf" }),
  ).toHaveAttribute("href", expect.stringContaining("/invoices/1/document"));
});

it("unfiles the document on request", () => {
  const { onRemove } = renderPanel({ document: INVOICE_DOCUMENT });

  fireEvent.click(screen.getByRole("button", { name: "Retirer" }));

  expect(onRemove).toHaveBeenCalled();
});

it("surfaces what the server refused", () => {
  renderPanel({ error: "Le document n'a pas pu être classé." });

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Le document n'a pas pu être classé.",
  );
});

it("shows no bar while nothing is uploading", () => {
  renderPanel();

  expect(document.querySelector('[data-slot="progress"]')).toBeNull();
});

it("says how far the picked file has got", () => {
  const { uploading } = renderPanel();

  fireEvent.change(picker(), { target: { files: [pdf()] } });
  uploading({ isPending: true, isUploading: true, uploadPercent: 40 });

  const bar = document.querySelector('[data-slot="progress"]');

  expect(bar).toHaveAttribute("role", "progressbar");
  expect(bar).toHaveAttribute("aria-valuenow", "40");
  expect(screen.getByText(/Envoi de/)).toBeInTheDocument();
});

it("stops naming a figure once the bytes are gone and the API is still storing them", () => {
  const { uploading } = renderPanel();

  fireEvent.change(picker(), { target: { files: [pdf()] } });
  uploading({ isPending: true, isUploading: true, uploadPercent: null });

  expect(screen.getByText("Classement en cours…")).toBeInTheDocument();
  expect(document.querySelector('[data-slot="progress"]')).not.toHaveAttribute(
    "aria-valuenow",
  );
});
