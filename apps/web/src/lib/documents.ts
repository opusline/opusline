import type { DocumentCategory, DocumentData } from "@opusline/api-client";
import { client as apiClient } from "@opusline/api-client/client";

import { serverFieldErrors } from "@/lib/validation";

/** Every category a document can carry, including the ones only the server assigns. */
export const DOCUMENT_CATEGORIES: readonly DocumentCategory[] = [
  0, 1, 2, 3, 4, 5,
];

/**
 * The subset a user may pick when uploading. "CRA" is absent: Opusline files the CRA
 * it generates itself, and offering it would only invite confusion with "CRA signé",
 * which is the one people upload.
 */
export const ASSIGNABLE_DOCUMENT_CATEGORIES: readonly DocumentCategory[] = [
  0, 1, 2, 3, 4,
];

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  0: "Contrat",
  1: "Devis",
  2: "CRA signé",
  3: "Facture reçue",
  4: "Autre",
  5: "CRA",
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

/** Strips diacritics so a search for "cafe" also matches "café", and vice versa. */
export function foldAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function uploadFailureMessage(error: unknown): string {
  return (
    serverFieldErrors(error)?.file?.message ??
    "L'envoi a échoué. Réessayez dans un instant."
  );
}

type DocumentHandlerOptions = {
  upload: (
    file: File,
    category: DocumentCategory,
    fileName: string,
  ) => Promise<unknown>;
  remove: (document: DocumentData) => Promise<unknown>;
  invalidate: () => Promise<void>;
};

export function documentHandlers({
  upload,
  remove,
  invalidate,
}: DocumentHandlerOptions) {
  return {
    handleUpload: async (
      file: File,
      category: DocumentCategory,
      fileName: string,
    ): Promise<DocumentUploadResult> => {
      try {
        await upload(file, category, fileName);
        await invalidate();
        return { status: "success" };
      } catch (error) {
        return { status: "failed", message: uploadFailureMessage(error) };
      }
    },
    handleDelete: async (document: DocumentData): Promise<boolean> => {
      try {
        await remove(document);
        await invalidate();
        return true;
      } catch {
        return false;
      }
    },
  };
}

export function isClientDocument(document: DocumentData): boolean {
  return document.source === 1;
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
  if (isClientDocument(document)) {
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

export function baseName(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");

  return lastDot <= 0 ? fileName : fileName.slice(0, lastDot);
}

export function extensionOf(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");

  return lastDot <= 0 ? "" : fileName.slice(lastDot + 1).toLowerCase();
}
