import type { DocumentCategory, DocumentData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { Chip, ChipCount, ChipGroup } from "@opusline/ui/components/chip";
import { NativeSelect } from "@opusline/ui/components/native-select";
import { cn } from "@opusline/ui/lib/utils";
import {
  ArrowUpIcon,
  CircleAlert,
  DownloadIcon,
  FileIcon,
  SearchIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useRef, useState } from "react";

import { fullDateLabel } from "@/lib/dates";
import {
  DOCUMENT_ACCEPT,
  DOCUMENT_CATEGORIES,
  DOCUMENT_CATEGORY_LABELS,
  type DocumentUploadResult,
  foldAccents,
  formatFileSize,
  guessDocumentCategory,
  isClientDocument,
  isDocumentCategory,
  rejectDocumentReason,
} from "@/lib/documents";

type PendingDocument = {
  key: number;
  file: File;
  category: DocumentCategory;
};

type QueuedUpload = {
  key: number;
  file: File;
  category: DocumentCategory;
  state: "uploading" | "error";
  message?: string;
};

type CategoryFilter = DocumentCategory | "all";

type DocumentsTabProps = {
  documents: DocumentData[];
  emptyLabel: string;
  onUpload: (
    file: File,
    category: DocumentCategory,
  ) => Promise<DocumentUploadResult>;
  onDelete: (document: DocumentData) => Promise<boolean>;
  downloadHref: (document: DocumentData) => string;
  canRemove?: (document: DocumentData) => boolean;
  showSourceBadge?: boolean;
};

export function DocumentsTab({
  documents,
  emptyLabel,
  onUpload,
  onDelete,
  downloadHref,
  canRemove,
  showSourceBadge,
}: DocumentsTabProps) {
  const nextKey = useRef(0);
  const [pending, setPending] = useState<PendingDocument[]>([]);
  const [queue, setQueue] = useState<QueuedUpload[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<string[]>([]);
  const [hasDeleteError, setHasDeleteError] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CategoryFilter>("all");

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
          category: guessDocumentCategory(file.name),
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
      result = await onUpload(upload.file, upload.category);
    } catch {
      result = {
        status: "failed",
        message: "L'envoi a échoué. Réessayez dans un instant.",
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
      setHasDeleteError(!(await onDelete(document)));
    } catch {
      setHasDeleteError(true);
    }
  };

  const categoryCounts = documents.reduce(
    (counts, document) => {
      counts[document.category] += 1;
      return counts;
    },
    { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 } as Record<DocumentCategory, number>,
  );
  const activeFilter =
    filter !== "all" && categoryCounts[filter] === 0 ? "all" : filter;
  const normalizedSearch = foldAccents(search.trim().toLowerCase());
  const visibleDocuments = documents.filter(
    (document) =>
      (activeFilter === "all" || document.category === activeFilter) &&
      (normalizedSearch === "" ||
        foldAccents(document.fileName.toLowerCase()).includes(
          normalizedSearch,
        )),
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
          aria-label="Ajouter des documents"
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
            Glissez des fichiers ici ou cliquez pour parcourir
          </span>
          <span className="text-muted-foreground-3 text-xs">
            PDF, images ou documents Office — 20 Mo max
          </span>
        </span>
      </label>

      {rejectedFiles.length > 0 && (
        <Alert variant="warn">
          <CircleAlert />
          <AlertDescription>
            Fichiers ignorés : {rejectedFiles.join(", ")}.
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
            <span className="text-foreground-3 text-sm">Envois en cours</span>
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
                        {upload.message ??
                          "L'envoi a échoué. Réessayez dans un instant."}
                      </span>
                    ) : (
                      <span className="shrink-0 text-muted-foreground-3 text-xs">
                        {`${formatFileSize(upload.file.size)} · envoi en cours…`}
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
                    Réessayer
                  </Button>
                )}
                <Button
                  aria-label={`Retirer ${upload.file.name} de la file`}
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
              {`${pending.length} fichier${pending.length > 1 ? "s" : ""} à classer`}
            </span>
            <span className="flex-1" />
            <span className="text-muted-foreground-3 text-xs">
              Vérifiez le type, puis confirmez
            </span>
          </div>
          <div className="divide-y">
            {pending.map((item) => (
              <div className="flex items-center gap-3 px-4 py-3" key={item.key}>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-foreground-hi text-sm">
                    {item.file.name}
                  </span>
                  <span className="text-muted-foreground-3 text-xs">
                    {formatFileSize(item.file.size)}
                  </span>
                </span>
                <NativeSelect
                  aria-label={`Type de ${item.file.name}`}
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
                  {DOCUMENT_CATEGORIES.map((category) => (
                    <option key={category} value={String(category)}>
                      {DOCUMENT_CATEGORY_LABELS[category]}
                    </option>
                  ))}
                </NativeSelect>
                <Button
                  aria-label={`Retirer ${item.file.name}`}
                  onClick={() =>
                    setPending((current) =>
                      current.filter(
                        (pendingItem) => pendingItem.key !== item.key,
                      ),
                    )
                  }
                  size="icon-lg"
                  variant="ghost"
                >
                  <XIcon aria-hidden />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t bg-muted px-4 py-3.5">
            <Button onClick={confirmPending} size="xl">
              {`Envoyer ${pending.length} document${pending.length > 1 ? "s" : ""}`}
            </Button>
            <Button onClick={() => setPending([])} size="xl" variant="ghost">
              Annuler
            </Button>
          </div>
        </div>
      )}

      {hasDeleteError && (
        <Alert variant="warn">
          <CircleAlert />
          <AlertDescription>
            La suppression a échoué. Réessayez dans un instant.
          </AlertDescription>
        </Alert>
      )}

      {documents.length > 0 ? (
        <>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex h-8 min-w-47.5 max-w-70 flex-1 items-center gap-2.5 rounded-full border border-border-2 bg-muted px-3 transition-colors focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20">
              <SearchIcon
                aria-hidden
                className="size-3.25 shrink-0 text-muted-foreground-5"
              />
              <input
                aria-label="Rechercher un document"
                className="min-w-0 flex-1 bg-transparent text-foreground-hi text-sm outline-none placeholder:text-muted-foreground-5"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher"
                value={search}
              />
            </span>
            <ChipGroup
              aria-label="Filtrer par type de document"
              onValueChange={(value) => {
                const [nextFilter] = value;

                if (nextFilter === "all") {
                  setFilter("all");
                  return;
                }

                const category = Number(nextFilter);
                if (isDocumentCategory(category)) {
                  setFilter(category);
                }
              }}
              value={[activeFilter === "all" ? "all" : String(activeFilter)]}
            >
              <Chip
                aria-label={`Tous (${documents.length})`}
                shape="pill"
                value="all"
              >
                Tous
                <ChipCount aria-hidden>{documents.length}</ChipCount>
              </Chip>
              {DOCUMENT_CATEGORIES.filter(
                (category) => categoryCounts[category] > 0,
              ).map((category) => (
                <Chip
                  aria-label={`${DOCUMENT_CATEGORY_LABELS[category]} (${categoryCounts[category]})`}
                  key={category}
                  shape="pill"
                  value={String(category)}
                >
                  {DOCUMENT_CATEGORY_LABELS[category]}
                  <ChipCount aria-hidden>{categoryCounts[category]}</ChipCount>
                </Chip>
              ))}
            </ChipGroup>
          </div>

          {visibleDocuments.length > 0 ? (
            <div className="divide-y overflow-hidden rounded-md border bg-card">
              {visibleDocuments.map((document) => (
                <div
                  className="flex items-center gap-3 px-4 py-3"
                  key={document.id}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border-2 bg-secondary text-muted-foreground-2">
                    <FileIcon aria-hidden className="size-3.75" />
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="min-w-0 truncate text-foreground-hi text-sm">
                        {document.fileName}
                      </span>
                      <Badge>
                        {DOCUMENT_CATEGORY_LABELS[document.category]}
                      </Badge>
                      {showSourceBadge && isClientDocument(document) && (
                        <Badge variant="quiet">client</Badge>
                      )}
                    </span>
                    <span className="text-muted-foreground-3 text-xs">
                      {formatFileSize(document.sizeBytes)} · ajouté le{" "}
                      {fullDateLabel(document.createdAt)}
                    </span>
                  </span>
                  <span className="flex-1" />
                  <Button
                    render={
                      // biome-ignore lint/a11y/useAnchorContent: Button injects the icon content.
                      <a
                        aria-label={`Télécharger ${document.fileName}`}
                        download
                        href={downloadHref(document)}
                      />
                    }
                    size="icon-lg"
                    variant="ghost"
                  >
                    <DownloadIcon aria-hidden />
                  </Button>
                  {(canRemove?.(document) ?? true) && (
                    <Button
                      aria-label={`Supprimer ${document.fileName}`}
                      onClick={() => void handleDelete(document)}
                      size="icon-lg"
                      variant="ghost"
                    >
                      <Trash2Icon aria-hidden />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border bg-card px-5 py-7 text-center text-muted-foreground-3 text-sm">
              Aucun document ne correspond à la recherche.
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
