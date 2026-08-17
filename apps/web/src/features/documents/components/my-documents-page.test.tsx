import type { DocumentData } from "@opusline/api-client";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { MyDocumentsPage, missingPackCategories } from "./my-documents-page";

function document(overrides: Partial<DocumentData> = {}): DocumentData {
  return {
    id: 1,
    fileName: "kbis.pdf",
    category: 6,
    source: 2,
    sizeBytes: 20_480,
    createdAt: "2026-08-01T09:00:00+00:00",
    ...overrides,
  };
}

function renderPage(documents: DocumentData[]) {
  return render(
    <MyDocumentsPage
      documents={documents}
      downloadHref={(entry) => `/api/documents/${entry.id}/download`}
      onDelete={async () => true}
      onUpload={async () => ({ status: "success" }) as const}
    />,
  );
}

it("counts the four pieces of the pack as missing when nothing is filed", () => {
  expect(missingPackCategories([])).toEqual([6, 7, 8, 9]);
});

it("stops counting a piece once it is filed", () => {
  expect(missingPackCategories([document({ category: 6 })])).toEqual([7, 8, 9]);
});

it("ignores a piece that is not part of the pack", () => {
  // "Autre" is fileable here but is not one of the four a client asks for.
  expect(missingPackCategories([document({ category: 4 })])).toEqual([
    6, 7, 8, 9,
  ]);
});

it("names the pieces still missing rather than only counting them", () => {
  renderPage([document({ category: 6 })]);

  expect(screen.getByText("Votre dossier est incomplet")).toBeInTheDocument();
  expect(
    screen.getByText(/Attestation URSSAF, Assurance RC Pro, RIB/),
  ).toBeInTheDocument();
});

it("says the pack is complete once all four are filed", () => {
  renderPage([
    document({ id: 1, category: 6 }),
    document({ id: 2, category: 7 }),
    document({ id: 3, category: 8 }),
    document({ id: 4, category: 9 }),
  ]);

  expect(screen.getByText("Votre dossier est complet")).toBeInTheDocument();
  expect(screen.getByText("4/4")).toBeInTheDocument();
});

it("shows how much of the pack is filed", () => {
  renderPage([document({ category: 6 }), document({ id: 2, category: 9 })]);

  expect(screen.getByText("2/4")).toBeInTheDocument();
});
