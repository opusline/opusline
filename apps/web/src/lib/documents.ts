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

const DOCUMENT_CATEGORY_MESSAGES: Record<DocumentCategory, () => string> = {
  0: m.documents_category_contract,
  1: m.documents_category_quote,
  2: m.documents_category_signed_cra,
  3: m.documents_category_received_invoice,
  4: m.documents_category_other,
  5: m.documents_category_cra,
  6: m.documents_category_kbis,
  7: m.documents_category_certificate,
  8: m.documents_category_insurance,
  9: m.documents_category_bank_details,
  10: m.documents_category_terms_of_sale,
};

/**
 * Every category a document can carry, including the ones only the server assigns.
 * Derived from the label map so a new enum case is one edit, not two that can drift.
 */
export const DOCUMENT_CATEGORIES: readonly DocumentCategory[] = Object.keys(
  DOCUMENT_CATEGORY_MESSAGES,
).map(Number) as DocumentCategory[];

/** What an unrecognised file is filed as: "Other". */
const FALLBACK_DOCUMENT_CATEGORY: DocumentCategory = 4;

/**
 * The subset a user may pick when uploading to a client or a mission. "CRA" is absent:
 * Opusline files the CRA it generates itself, and offering it would only invite confusion
 * with "CRA signé", which is the one people upload.
 */
export const ASSIGNABLE_DOCUMENT_CATEGORIES: readonly DocumentCategory[] = [
  0,
  1,
  2,
  3,
  FALLBACK_DOCUMENT_CATEGORY,
];

/** The vocabulary of the freelance's own administrative pieces. */
export const PERSONAL_DOCUMENT_CATEGORIES: readonly DocumentCategory[] = [
  6,
  7,
  8,
  9,
  10,
  FALLBACK_DOCUMENT_CATEGORY,
];

/** A chip row selection: one category, or every one of them. */
export type DocumentCategoryFilter = DocumentCategory | "all";

export function documentCategoryLabel(category: DocumentCategory): string {
  return DOCUMENT_CATEGORY_MESSAGES[category]();
}

export function isDocumentCategory(value: number): value is DocumentCategory {
  return (DOCUMENT_CATEGORIES as readonly number[]).includes(value);
}

export function countByCategory(
  documents: DocumentData[],
): Record<DocumentCategory, number> {
  const counts = Object.fromEntries(
    DOCUMENT_CATEGORIES.map((category) => [category, 0]),
  ) as Record<DocumentCategory, number>;

  for (const document of documents) {
    counts[document.category] += 1;
  }

  return counts;
}

/** Whether a document answers a search, on its name or on its type. */
export function matchesDocumentSearch(
  document: DocumentData,
  foldedNeedle: string,
): boolean {
  return (
    foldAccents(document.fileName.toLowerCase()).includes(foldedNeedle) ||
    foldAccents(
      documentCategoryLabel(document.category).toLowerCase(),
    ).includes(foldedNeedle)
  );
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

const CATEGORY_HINTS: ReadonlyArray<[DocumentCategory, RegExp]> = [
  [0, /contrat|contract/],
  [1, /devis|quote/],
  [2, /(^|[^a-z])cra([^a-z]|$)/],
  [3, /facture|invoice/],
  [6, /kbis|sirene/],
  [7, /attestation|vigilance|urssaf/],
  [8, /assurance|rc[\s._-]?pro|insurance/],
  [9, /(^|[^a-z])rib([^a-z]|$)|iban/],
  [10, /(^|[^a-z])cgv([^a-z]|$)|conditions/],
];

export function guessDocumentCategory(
  fileName: string,
  assignable: readonly DocumentCategory[],
): DocumentCategory {
  const name = foldAccents(fileName.toLowerCase());
  const hit = CATEGORY_HINTS.find(
    ([category, pattern]) =>
      assignable.includes(category) && pattern.test(name),
  );

  return hit?.[0] ?? FALLBACK_DOCUMENT_CATEGORY;
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

export function userDocumentDownloadHref(documentId: number): string {
  return apiClient.buildUrl({
    url: "/user/documents/{document}/download",
    path: { document: documentId },
  });
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
