import type { DocumentCategory, DocumentData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { Input } from "@opusline/ui/components/input";
import { NativeSelect } from "@opusline/ui/components/native-select";
import { cn } from "@opusline/ui/lib/utils";
import {
  ArrowUpIcon,
  CircleAlert,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { DocumentFilterBar } from "@/components/document-filter-bar";
import { DocumentDownloadButton, DocumentRow } from "@/components/document-row";
import { useLocale } from "@/components/money-format-provider";
import {
  baseName,
  countByCategory,
  DOCUMENT_ACCEPT,
  type DocumentCategoryFilter,
  type DocumentUploadResult,
  documentCategoryLabel,
  extensionOf,
  foldAccents,
  formatFileSize,
  guessDocumentCategory,
  isClientDocument,
  isDocumentCategory,
  matchesDocumentSearch,
  rejectDocumentReason,
} from "@/lib/documents";
import { m } from "@/paraglide/messages.js";

type PendingDocument = {
  key: number;
  file: File;
  category: DocumentCategory;
  name: string;
};

type QueuedUpload = {
  key: number;
  file: File;
  category: DocumentCategory;
  name: string;
  state: "uploading" | "error";
  message?: string;
};

type DocumentsTabProps = {
  documents: DocumentData[];
  emptyLabel: string;
  onUpload: (
    file: File,
    category: DocumentCategory,
    fileName: string,
  ) => Promise<DocumentUploadResult>;
  onDelete: (document: DocumentData) => Promise<boolean>;
  downloadHref: (document: DocumentData) => string;
  canRemove?: (document: DocumentData) => boolean;
  showSourceBadge?: boolean;
  /** The types offered when classifying an upload. */
  assignableCategories: readonly DocumentCategory[];
};

export function DocumentsTab({
  documents,
  emptyLabel,
  onUpload,
  onDelete,
  downloadHref,
  canRemove,
  showSourceBadge,
  assignableCategories,
}: DocumentsTabProps) {
  const locale = useLocale();
  const nextKey = useRef(0);
  const [pending, setPending] = useState<PendingDocument[]>([]);
  const [queue, setQueue] = useState<QueuedUpload[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<string[]>([]);
  const [hasDeleteError, setHasDeleteError] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DocumentCategoryFilter>("all");

  const addFiles = (files: Iterable<File>) => {
    const accepted: PendingDocument[] = [];
    const rejected: string[] = [];

    for (const file of files) {
      const reason = rejectDocumentReason(file);

      if (reason !== null) {
        rejected.push(`${file.name} (${reason})`);
      } else {
        nextKey.current += 1;
        accepted.push({
          key: nextKey.current,
          file,
          category: guessDocumentCategory(file.name, assignableCategories),
          name: baseName(file.name),
        });
      }
    }

    if (accepted.length > 0) {
      setPending((current) => [...current, ...accepted]);
    }
    setRejectedFiles(rejected);
  };

  const startUpload = async (upload: QueuedUpload) => {
    let result: DocumentUploadResult;

    try {
      result = await onUpload(upload.file, upload.category, upload.name);
    } catch {
      result = {
        status: "failed",
        message: m.common_upload_failed(),
      };
    }

    if (result.status === "success") {
      setQueue((current) => current.filter((item) => item.key !== upload.key));
      return;
    }

    setQueue((current) =>
      current.map((item) =>
        item.key === upload.key
          ? { ...item, state: "error", message: result.message }
          : item,
      ),
    );
  };

  const confirmPending = () => {
    const uploads = pending.map((item) => ({
      ...item,
      state: "uploading" as const,
    }));

    setPending([]);
    setQueue((current) => [...current, ...uploads]);

    for (const upload of uploads) {
      void startUpload(upload);
    }
  };

  const retryUpload = (upload: QueuedUpload) => {
    const retried: QueuedUpload = {
      ...upload,
      state: "uploading",
      message: undefined,
    };

    setQueue((current) =>
      current.map((item) => (item.key === upload.key ? retried : item)),
    );
    void startUpload(retried);
  };

  const handleDelete = async (document: DocumentData) => {
    try {
      const hasDeleted = await onDelete(document);
      setHasDeleteError(!hasDeleted);

      if (hasDeleted && document.category === filter) {
        setFilter("all");
      }
    } catch {
      setHasDeleteError(true);
    }
  };

  const categoryCounts = countByCategory(documents);
  const normalizedSearch = foldAccents(search.trim().toLowerCase());
  const visibleDocuments = documents.filter(
    (document) =>
      (filter === "all" || document.category === filter) &&
      (normalizedSearch === "" ||
        matchesDocumentSearch(document, normalizedSearch)),
  );

  return (
    <div className="flex flex-col gap-3.5">
      <label
        className={cn(
          "flex cursor-pointer items-center gap-3.5 rounded-md border border-border-3 border-dashed bg-card px-5 py-4.5 transition-colors",
          "hover:border-muted-foreground-6 has-[input:focus-visible]:border-primary has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-primary/20",
          isDragOver && "border-primary bg-primary/7",
        )}
        onDragLeave={() => setIsDragOver(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragOver(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <input
          accept={DOCUMENT_ACCEPT}
          aria-label={m.documents_add_aria()}
          className="sr-only"
          multiple
          onChange={(event) => {
            addFiles(event.target.files ?? []);
            event.target.value = "";
          }}
          type="file"
        />
        <UploadIcon
          aria-hidden
          className="size-4.5 shrink-0 text-muted-foreground-2"
        />
        <span className="flex min-w-0 flex-col gap-0.75">
          <span className="text-foreground-3 text-sm">
            {m.documents_drop_hint()}
          </span>
          <span className="text-muted-foreground-3 text-xs">
            {m.documents_drop_formats()}
          </span>
        </span>
      </label>

      {rejectedFiles.length > 0 && (
        <Alert variant="warn">
          <CircleAlert />
          <AlertDescription>
            {m.documents_rejected_list({ files: rejectedFiles.join(", ") })}
          </AlertDescription>
        </Alert>
      )}

      {queue.length > 0 && (
        <div className="overflow-hidden rounded-md border bg-card">
          <div className="flex items-center gap-2.5 border-b px-4 py-3">
            <ArrowUpIcon
              aria-hidden
              className="size-3.5 shrink-0 text-muted-foreground-2"
            />
            <span className="text-foreground-3 text-sm">
              {m.documents_uploading_title()}
            </span>
          </div>
          <div className="divide-y">
            {queue.map((upload) => (
              <div
                className="flex items-center gap-3 px-4 py-3"
                key={upload.key}
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex min-w-0 items-baseline gap-2.5">
                    <span className="min-w-0 flex-1 truncate text-foreground-3 text-sm">
                      {upload.file.name}
                    </span>
                    {upload.state === "error" ? (
                      <span
                        className="shrink-0 text-destructive text-xs"
                        role="alert"
                      >
                        {upload.message ?? m.common_upload_failed()}
                      </span>
                    ) : (
                      <span className="shrink-0 text-muted-foreground-3 text-xs">
                        {m.documents_uploading_status({
                          size: formatFileSize(locale, upload.file.size),
                        })}
                      </span>
                    )}
                  </span>
                  <span className="mt-1.5 h-0.75 w-full overflow-hidden rounded-full bg-muted">
                    <span
                      className={cn(
                        "block h-full rounded-full",
                        upload.state === "error"
                          ? "w-full bg-destructive"
                          : "w-1/2 animate-pulse bg-primary",
                      )}
                    />
                  </span>
                </span>
                {upload.state === "error" && (
                  <Button onClick={() => retryUpload(upload)} variant="outline">
                    {m.documents_retry()}
                  </Button>
                )}
                <Button
                  aria-label={m.documents_remove_from_queue({
                    name: upload.file.name,
                  })}
                  onClick={() =>
                    setQueue((current) =>
                      current.filter((item) => item.key !== upload.key),
                    )
                  }
                  size="icon"
                  variant="ghost"
                >
                  <XIcon aria-hidden />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div className="overflow-hidden rounded-md border border-primary/35 bg-card">
          <div className="flex items-center gap-2.5 border-b bg-primary/7 px-4 py-3.5">
            <span className="text-primary-text text-sm">
              {m.documents_pending_count({ count: pending.length })}
            </span>
            <span className="flex-1" />
            <span className="text-muted-foreground-3 text-xs">
              {m.documents_check_confirm()}
            </span>
          </div>
          <div className="divide-y">
            {pending.map((item) => (
              <div className="flex flex-col gap-1.5 px-4 py-3" key={item.key}>
                <div className="flex items-center gap-3">
                  <Input
                    aria-label={m.documents_name_aria({ name: item.file.name })}
                    className="min-w-0 flex-1"
                    onChange={(event) =>
                      setPending((current) =>
                        current.map((candidate) =>
                          candidate.key === item.key
                            ? { ...candidate, name: event.target.value }
                            : candidate,
                        ),
                      )
                    }
                    size="sm"
                    value={item.name}
                  />
                  <NativeSelect
                    aria-label={m.documents_type_aria({ name: item.file.name })}
                    onChange={(event) => {
                      const category = Number(event.target.value);

                      if (isDocumentCategory(category)) {
                        setPending((current) =>
                          current.map((pendingItem) =>
                            pendingItem.key === item.key
                              ? { ...pendingItem, category }
                              : pendingItem,
                          ),
                        );
                      }
                    }}
                    size="sm"
                    value={String(item.category)}
                  >
                    {assignableCategories.map((category) => (
                      <option key={category} value={String(category)}>
                        {documentCategoryLabel(category)}
                      </option>
                    ))}
                  </NativeSelect>
                  <Button
                    aria-label={m.documents_remove_aria({
                      name: item.file.name,
                    })}
                    onClick={() =>
                      setPending((current) =>
                        current.filter(
                          (pendingItem) => pendingItem.key !== item.key,
                        ),
                      )
                    }
                    size="icon-sm"
                    variant="ghost"
                  >
                    <XIcon aria-hidden />
                  </Button>
                </div>
                <span className="text-muted-foreground-3 text-xs">
                  {formatFileSize(locale, item.file.size)} ·{" "}
                  {extensionOf(item.file.name)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t bg-muted px-4 py-3.5">
            <Button onClick={confirmPending} size="xl">
              {m.documents_send_count({ count: pending.length })}
            </Button>
            <Button onClick={() => setPending([])} size="xl" variant="ghost">
              {m.common_cancel()}
            </Button>
          </div>
        </div>
      )}

      {hasDeleteError && (
        <Alert variant="warn">
          <CircleAlert />
          <AlertDescription>{m.common_delete_failed()}</AlertDescription>
        </Alert>
      )}

      {documents.length > 0 ? (
        <>
          <DocumentFilterBar
            counts={categoryCounts}
            filter={filter}
            onFilterChange={setFilter}
            onSearchChange={setSearch}
            search={search}
            searchPlaceholder={m.documents_search_placeholder()}
            total={documents.length}
          />

          {visibleDocuments.length > 0 ? (
            <div className="divide-y overflow-hidden rounded-md border bg-card">
              {visibleDocuments.map((document) => (
                <DocumentRow
                  badges={
                    showSourceBadge &&
                    isClientDocument(document) && (
                      <Badge variant="quiet">
                        {m.documents_source_client_badge()}
                      </Badge>
                    )
                  }
                  document={document}
                  key={document.id}
                >
                  <DocumentDownloadButton
                    document={document}
                    href={downloadHref(document)}
                  />
                  {(canRemove?.(document) ?? true) && (
                    <Button
                      aria-label={m.documents_delete_aria({
                        name: document.fileName,
                      })}
                      onClick={() => void handleDelete(document)}
                      size="icon-lg"
                      variant="ghost"
                    >
                      <Trash2Icon aria-hidden />
                    </Button>
                  )}
                </DocumentRow>
              ))}
            </div>
          ) : (
            <div className="rounded-md border bg-card px-5 py-7 text-center text-muted-foreground-3 text-sm">
              {m.documents_no_match()}
            </div>
          )}
        </>
      ) : (
        pending.length === 0 &&
        queue.length === 0 && (
          <div className="rounded-md border bg-card px-5 py-7 text-center text-muted-foreground-3 text-sm">
            {emptyLabel}
          </div>
        )
      )}
    </div>
  );
}
