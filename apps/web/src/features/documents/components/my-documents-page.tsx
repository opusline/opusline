import type { DocumentCategory, DocumentData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";
import { CircleAlert, CircleCheck } from "lucide-react";

import { DocumentsTab } from "@/components/documents-tab";
import {
  ADMINISTRATIVE_DOCUMENT_CATEGORIES,
  type DocumentUploadResult,
  documentCategoryLabel,
  PERSONAL_DOCUMENT_CATEGORIES,
} from "@/lib/documents";
import { m } from "@/paraglide/messages.js";

/** Which pieces of the pack a client asks for are not filed yet. */
export function missingPackCategories(
  documents: DocumentData[],
): DocumentCategory[] {
  const filed = new Set(documents.map((document) => document.category));

  return ADMINISTRATIVE_DOCUMENT_CATEGORIES.filter(
    (category) => !filed.has(category),
  );
}

type MyDocumentsPageProps = {
  documents: DocumentData[];
  onUpload: (
    file: File,
    category: DocumentCategory,
    fileName: string,
  ) => Promise<DocumentUploadResult>;
  onDelete: (document: DocumentData) => Promise<boolean>;
  downloadHref: (document: DocumentData) => string;
};

export function MyDocumentsPage({
  documents,
  onUpload,
  onDelete,
  downloadHref,
}: MyDocumentsPageProps) {
  const missing = missingPackCategories(documents);
  const packSize = ADMINISTRATIVE_DOCUMENT_CATEGORIES.length;

  return (
    <div className="flex max-w-270 flex-col gap-5">
      <div>
        <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
          {m.my_documents_title()}
        </h1>
        <p className="mt-1.5 text-muted-foreground-3 text-sm">
          {m.my_documents_subtitle()}
        </p>
      </div>

      <StatTileRow className="grid-cols-2 md:grid-cols-3">
        <StatTile
          label={m.my_documents_stat_filed()}
          value={String(documents.length)}
        />
        <StatTile
          label={m.my_documents_stat_pack()}
          sub={m.my_documents_stat_pack_sub()}
          tone={missing.length === 0 ? "brand" : "default"}
          value={`${packSize - missing.length}/${packSize}`}
        />
        <StatTile
          label={m.my_documents_stat_missing()}
          tone={missing.length === 0 ? "quiet" : "warn"}
          value={String(missing.length)}
        />
      </StatTileRow>

      {missing.length > 0 ? (
        <Alert variant="warn">
          <CircleAlert />
          <AlertDescription>
            <strong className="font-medium">
              {m.my_documents_missing_title()}
            </strong>{" "}
            {m.my_documents_missing_body({
              list: missing.map(documentCategoryLabel).join(", "),
            })}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CircleCheck />
          <AlertDescription>
            <strong className="font-medium">
              {m.my_documents_complete_title()}
            </strong>{" "}
            {m.my_documents_complete_body()}
          </AlertDescription>
        </Alert>
      )}

      <DocumentsTab
        assignableCategories={PERSONAL_DOCUMENT_CATEGORIES}
        documents={documents}
        downloadHref={downloadHref}
        emptyLabel={m.my_documents_empty()}
        onDelete={onDelete}
        onUpload={onUpload}
      />
    </div>
  );
}
