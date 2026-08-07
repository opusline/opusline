import type { DocumentData } from "@opusline/api-client";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { ComponentProps } from "react";
import { expect, it, vi } from "vitest";

import { MAX_DOCUMENT_BYTES } from "@/lib/documents";
import { DocumentsTab } from "./documents-tab";

function documentPayload(overrides: Partial<DocumentData> = {}): DocumentData {
  return {
    id: 1,
    fileName: "contrat-cadre-nordlys.pdf",
    category: 0,
    source: 1,
    sizeBytes: 1_240_000,
    createdAt: "2025-03-05T10:00:00+00:00",
    ...overrides,
  };
}

function renderTab(
  overrides: Partial<ComponentProps<typeof DocumentsTab>> = {},
) {
  const props: ComponentProps<typeof DocumentsTab> = {
    documents: [],
    emptyLabel: "Aucun document pour ce client.",
    onUpload: vi.fn(async () => ({ status: "success" }) as const),
    onDelete: vi.fn(async () => true),
    downloadHref: (document) => `/download/${document.id}`,
    ...overrides,
  };

  render(<DocumentsTab {...props} />);

  return props;
}

function pickFiles(files: File[]) {
  fireEvent.change(screen.getByLabelText("Ajouter des documents"), {
    target: { files },
  });
}

it("lists documents with category badge, meta and download link", () => {
  renderTab({
    documents: [
      documentPayload(),
      documentPayload({
        id: 2,
        fileName: "devis-callisto.pdf",
        category: 1,
        sizeBytes: 845_000,
      }),
    ],
  });

  // The category label also appears in the filter chips — scope to the row.
  const row = screen.getByText("contrat-cadre-nordlys.pdf").closest("div");
  expect(row).not.toBeNull();
  expect(within(row as HTMLElement).getByText("Contrat")).toBeInTheDocument();
  expect(
    screen.getByText(/1,2 Mo · ajouté le 5 mars 2025/),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Télécharger devis-callisto.pdf" }),
  ).toHaveAttribute("href", "/download/2");
});

it("filters the list from the category chips", () => {
  renderTab({
    documents: [
      documentPayload(),
      documentPayload({ id: 2, fileName: "devis-callisto.pdf", category: 1 }),
    ],
  });

  fireEvent.click(screen.getByRole("button", { name: "Devis (1)" }));

  expect(screen.getByText("devis-callisto.pdf")).toBeInTheDocument();
  expect(
    screen.queryByText("contrat-cadre-nordlys.pdf"),
  ).not.toBeInTheDocument();
});

it("filters the list from the search input", () => {
  renderTab({
    documents: [
      documentPayload(),
      documentPayload({ id: 2, fileName: "devis-callisto.pdf", category: 1 }),
    ],
  });

  fireEvent.change(screen.getByLabelText("Rechercher un document"), {
    target: { value: "callisto" },
  });

  expect(screen.getByText("devis-callisto.pdf")).toBeInTheDocument();
  expect(
    screen.queryByText("contrat-cadre-nordlys.pdf"),
  ).not.toBeInTheDocument();
});

it("stages picked files for classification with a guessed type", () => {
  renderTab();

  pickFiles([new File(["x"], "contrat-2025.pdf", { type: "application/pdf" })]);

  expect(screen.getByText("1 fichier à classer")).toBeInTheDocument();
  expect(screen.getByLabelText("Type de contrat-2025.pdf")).toHaveValue("0");
});

it("uploads each confirmed file with its chosen category", async () => {
  const { onUpload } = renderTab();
  const file = new File(["x"], "piece.pdf", { type: "application/pdf" });

  pickFiles([file]);
  fireEvent.change(screen.getByLabelText("Type de piece.pdf"), {
    target: { value: "2" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Envoyer 1 document" }));

  await waitFor(() => {
    expect(onUpload).toHaveBeenCalledWith(file, 2, "piece");
  });
  await waitFor(() => {
    expect(screen.queryByText("Envois en cours")).not.toBeInTheDocument();
  });
});

it("keeps a failed upload in the queue and retries it", async () => {
  const onUpload = vi
    .fn<
      (
        file: File,
        category: number,
      ) => Promise<
        { status: "success" } | { status: "failed"; message: string }
      >
    >()
    .mockResolvedValueOnce({ status: "failed", message: "Fichier invalide." })
    .mockResolvedValue({ status: "success" });
  renderTab({ onUpload });

  pickFiles([new File(["x"], "piece.pdf", { type: "application/pdf" })]);
  fireEvent.click(screen.getByRole("button", { name: "Envoyer 1 document" }));

  expect(await screen.findByText("Fichier invalide.")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));

  await waitFor(() => {
    expect(screen.queryByText("Envois en cours")).not.toBeInTheDocument();
  });
  expect(onUpload).toHaveBeenCalledTimes(2);
});

it("turns a rejected upload promise into a retryable error row", async () => {
  renderTab({
    onUpload: vi.fn(async () => {
      throw new Error("network down");
    }),
  });

  pickFiles([new File(["x"], "piece.pdf", { type: "application/pdf" })]);
  fireEvent.click(screen.getByRole("button", { name: "Envoyer 1 document" }));

  expect(
    await screen.findByText("L'envoi a échoué. Réessayez dans un instant."),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Réessayer" })).toBeInTheDocument();
});

it("refuses an oversized file with an explanation", () => {
  renderTab();
  const oversized = new File(["x"], "gros-fichier.pdf", {
    type: "application/pdf",
  });
  Object.defineProperty(oversized, "size", {
    value: MAX_DOCUMENT_BYTES + 1,
  });

  pickFiles([oversized]);

  expect(
    screen.getByText(/gros-fichier\.pdf \(trop lourd \(max 20 Mo\)\)/),
  ).toBeInTheDocument();
  expect(screen.queryByText("1 fichier à classer")).not.toBeInTheDocument();
});

it("marks inherited client documents and hides their delete button", () => {
  renderTab({
    documents: [
      documentPayload(),
      documentPayload({ id: 2, fileName: "cra-mars.pdf", source: 0 }),
    ],
    showSourceBadge: true,
    canRemove: (document) => document.source === 0,
  });

  expect(screen.getByText("client")).toBeInTheDocument();
  expect(
    screen.queryByRole("button", {
      name: "Supprimer contrat-cadre-nordlys.pdf",
    }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Supprimer cra-mars.pdf" }),
  ).toBeInTheDocument();
});

it("deletes a document from its row action", async () => {
  const document = documentPayload();
  const { onDelete } = renderTab({ documents: [document] });

  fireEvent.click(
    screen.getByRole("button", {
      name: "Supprimer contrat-cadre-nordlys.pdf",
    }),
  );

  await waitFor(() => {
    expect(onDelete).toHaveBeenCalledWith(document);
  });
});

it("warns when a deletion fails", async () => {
  renderTab({
    documents: [documentPayload()],
    onDelete: vi.fn(async () => false),
  });

  fireEvent.click(
    screen.getByRole("button", {
      name: "Supprimer contrat-cadre-nordlys.pdf",
    }),
  );

  expect(
    await screen.findByText(
      "La suppression a échoué. Réessayez dans un instant.",
    ),
  ).toBeInTheDocument();
});

it("uploads under the name typed into the rename field", async () => {
  const { onUpload } = renderTab();
  const file = new File(["x"], "scan001.pdf", { type: "application/pdf" });

  pickFiles([file]);
  fireEvent.change(screen.getByLabelText("Nom du document scan001.pdf"), {
    target: { value: "Contrat Nordlys" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Envoyer 1 document" }));

  await waitFor(() => {
    expect(onUpload).toHaveBeenCalledWith(file, 4, "Contrat Nordlys");
  });
});
