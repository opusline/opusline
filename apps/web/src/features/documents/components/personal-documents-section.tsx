import type { DocumentCategory, DocumentData } from "@opusline/api-client";

import { DocumentsTab } from "@/components/documents-tab";
import {
  type DocumentUploadResult,
  PERSONAL_DOCUMENT_CATEGORIES,
  userDocumentDownloadHref,
} from "@/lib/documents";
import { m } from "@/paraglide/messages.js";

import { DocumentsSectionHeading } from "./documents-section-heading";

type PersonalDocumentsSectionProps = {
  documents: DocumentData[];
  onUpload: (
    file: File,
    category: DocumentCategory,
    fileName: string,
  ) => Promise<DocumentUploadResult>;
  onDelete: (document: DocumentData) => Promise<boolean>;
};

export function PersonalDocumentsSection({
  documents,
  onUpload,
  onDelete,
}: PersonalDocumentsSectionProps) {
  return (
    <section className="flex flex-col gap-3.5">
      <DocumentsSectionHeading>
        {m.documents_personal_heading()}
      </DocumentsSectionHeading>
      <DocumentsTab
        assignableCategories={PERSONAL_DOCUMENT_CATEGORIES}
        documents={documents}
        downloadHref={(document) => userDocumentDownloadHref(document.id)}
        emptyLabel={m.documents_personal_empty()}
        onDelete={onDelete}
        onUpload={onUpload}
      />
    </section>
  );
}
