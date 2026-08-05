import type { DocumentCategory, DocumentData } from "@opusline/api-client";
import { client as apiClient } from "@opusline/api-client/client";

import { serverFieldErrors } from "@/lib/validation";

export const DOCUMENT_CATEGORIES: readonly DocumentCategory[] = [0, 1, 2, 3, 4];

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  0: "Contrat",
  1: "Devis",
  2: "CRA signé",
  3: "Facture reçue",
  4: "Autre",
};

export function isDocumentCategory(value: number): value is DocumentCategory {
  return (DOCUMENT_CATEGORIES as readonly number[]).includes(value);
}

export const DOCUMENT_ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.odt,.ods,.csv";
export const MAX_DOCUMENT_BYTES = 20_480 * 1024;

const ACCEPTED_EXTENSIONS = new Set(
  DOCUMENT_ACCEPT.split(",").map((extension) => extension.slice(1)),
);

export type DocumentUploadResult =
  | { status: "success" }
  | { status: "failed"; message: string };

export function rejectDocumentReason(file: File): string | null {
  const extension = file.name.toLowerCase().split(".").pop() ?? "";

  if (!ACCEPTED_EXTENSIONS.has(extension)) {
    return "type de fichier non pris en charge";
  }

  if (file.size > MAX_DOCUMENT_BYTES) {
    return "trop lourd (max 20 Mo)";
  }

  return null;
}

export function guessDocumentCategory(fileName: string): DocumentCategory {
  const name = fileName.toLowerCase();

  if (name.includes("contrat") || name.includes("contract")) {
    return 0;
  }
  if (name.includes("devis")) {
    return 1;
  }
  if (/(^|[^a-z])cra([^a-z]|$)/.test(name)) {
    return 2;
  }
  if (name.includes("facture") || name.includes("invoice")) {
    return 3;
  }

  return 4;
}

const fileSizeFormat = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
});

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} o`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} Ko`;
  }

  return `${fileSizeFormat.format(bytes / (1024 * 1024))} Mo`;
}

export function uploadFailureMessage(error: unknown): string {
  return (
    serverFieldErrors(error)?.file?.message ??
    "L'envoi a échoué. Réessayez dans un instant."
  );
}

export function clientDocumentDownloadHref(
  clientSlug: string,
  documentId: number,
): string {
  return apiClient.buildUrl({
    url: "/clients/{client}/documents/{document}/download",
    path: { client: clientSlug, document: documentId },
  });
}

export function missionDocumentDownloadHref(
  clientSlug: string,
  missionSlug: string,
  document: DocumentData,
): string {
  if (document.source === 1) {
    return clientDocumentDownloadHref(clientSlug, document.id);
  }

  return apiClient.buildUrl({
    url: "/clients/{client}/missions/{mission}/documents/{document}/download",
    path: {
      client: clientSlug,
      mission: missionSlug,
      document: document.id,
    },
  });
}
