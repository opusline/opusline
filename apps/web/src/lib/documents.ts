import type {
  DocumentCategory,
  DocumentData,
  Locale,
} from "@opusline/api-client";
import { client as apiClient } from "@opusline/api-client/client";
import { cachedFormatter } from "@/lib/billing";
import { fileRejector } from "@/lib/files";
import { serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

/** Every category a document can carry, including the ones only the server assigns. */
export const DOCUMENT_CATEGORIES: readonly DocumentCategory[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
];

/**
 * The subset a user may pick when uploading. "CRA" is absent: Opusline files the CRA
 * it generates itself, and offering it would only invite confusion with "CRA signé",
 * which is the one people upload.
 */
export const ASSIGNABLE_DOCUMENT_CATEGORIES: readonly DocumentCategory[] = [
  0, 1, 2, 3, 4,
];

/**
 * What a client asks for before signing. The account's own pieces, so the
 * client and mission tabs never offer them, and "Mes documents" offers only
 * these plus "Autre".
 */
export const ADMINISTRATIVE_DOCUMENT_CATEGORIES: readonly DocumentCategory[] = [
  6, 7, 8, 9,
];

export const PERSONAL_DOCUMENT_CATEGORIES: readonly DocumentCategory[] = [
  6, 7, 8, 9, 4,
];

const DOCUMENT_CATEGORY_MESSAGES: Record<DocumentCategory, () => string> = {
  0: m.documents_category_contract,
  1: m.documents_category_quote,
  2: m.documents_category_signed_cra,
  3: m.documents_category_received_invoice,
  4: m.documents_category_other,
  5: m.documents_category_cra,
  6: m.documents_category_kbis,
  7: m.documents_category_urssaf_vigilance,
  8: m.documents_category_insurance,
  9: m.documents_category_rib,
};

export function documentCategoryLabel(category: DocumentCategory): string {
  return DOCUMENT_CATEGORY_MESSAGES[category]();
}

export function isDocumentCategory(value: number): value is DocumentCategory {
  return (DOCUMENT_CATEGORIES as readonly number[]).includes(value);
}

export const DOCUMENT_ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.odt,.ods,.csv";
export const MAX_DOCUMENT_BYTES = 20_480 * 1024;

export type DocumentUploadResult =
  | { status: "success" }
  | { status: "failed"; message: string };

export const rejectDocumentReason = fileRejector({
  accept: DOCUMENT_ACCEPT,
  maxBytes: MAX_DOCUMENT_BYTES,
  rejectType: m.documents_reject_type,
  rejectSize: m.documents_reject_size,
});

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

export function formatFileSize(locale: Locale, bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} o`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} Ko`;
  }

  return `${cachedFormatter(locale, { maximumFractionDigits: 1 }).format(bytes / (1024 * 1024))} Mo`;
}

/** Strips diacritics so a search for "cafe" also matches "café", and vice versa. */
export function foldAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function uploadFailureMessage(error: unknown): string {
  return serverFieldErrors(error)?.file?.message ?? m.common_upload_failed();
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

export function personalDocumentDownloadHref(documentId: number): string {
  return apiClient.buildUrl({
    url: "/documents/{document}/download",
    path: { document: documentId },
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
