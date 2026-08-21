import type {
  DocumentCategory,
  DocumentData,
  DocumentGroupData,
} from "@opusline/api-client";
import type { DocumentUploadResult } from "@/lib/documents";
import { m } from "@/paraglide/messages.js";

import { DocumentLibrarySection } from "./document-library-section";
import { PersonalDocumentsSection } from "./personal-documents-section";

type DocumentsPageProps = {
  personalDocuments: DocumentData[];
  libraryGroups: DocumentGroupData[];
  onUpload: (
    file: File,
    category: DocumentCategory,
    fileName: string,
  ) => Promise<DocumentUploadResult>;
  onDelete: (document: DocumentData) => Promise<boolean>;
};

export function DocumentsPage({
  personalDocuments,
  libraryGroups,
  onUpload,
  onDelete,
}: DocumentsPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-7">
      <div className="min-w-0">
        <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
          {m.documents_page_title()}
        </h1>
        <p className="mt-1 max-w-[62ch] text-pretty text-muted-foreground-3 text-sm">
          {m.documents_page_subtitle()}
        </p>
      </div>

      <PersonalDocumentsSection
        documents={personalDocuments}
        onDelete={onDelete}
        onUpload={onUpload}
      />
      <DocumentLibrarySection groups={libraryGroups} />
    </div>
  );
}
