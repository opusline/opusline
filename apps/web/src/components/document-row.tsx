import type { DocumentData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { DownloadIcon, FileIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useLocale } from "@/components/money-format-provider";
import { fullDateLabel } from "@/lib/dates";
import { documentCategoryLabel, formatFileSize } from "@/lib/documents";
import { m } from "@/paraglide/messages.js";

type DocumentRowProps = {
  document: DocumentData;
  /** Extra badges shown after the category, e.g. where the document was inherited from. */
  badges?: ReactNode;
  /** The row's action cluster, right-aligned. */
  children: ReactNode;
};

export function DocumentRow({ document, badges, children }: DocumentRowProps) {
  const locale = useLocale();

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border-2 bg-secondary text-muted-foreground-2">
        <FileIcon aria-hidden className="size-3.75" />
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="min-w-0 truncate text-foreground-hi text-sm">
            {document.fileName}
          </span>
          <Badge>{documentCategoryLabel(document.category)}</Badge>
          {badges}
        </span>
        <span className="text-muted-foreground-3 text-xs">
          {m.documents_added_on({
            size: formatFileSize(locale, document.sizeBytes),
            date: fullDateLabel(locale, document.createdAt),
          })}
        </span>
      </span>
      <span className="flex-1" />
      {children}
    </div>
  );
}

type DocumentDownloadButtonProps = {
  document: DocumentData;
  href: string;
};

export function DocumentDownloadButton({
  document,
  href,
}: DocumentDownloadButtonProps) {
  return (
    <Button
      render={
        <a
          aria-label={m.documents_download_aria({ name: document.fileName })}
          download
          href={href}
        />
      }
      size="icon-lg"
      variant="ghost"
    >
      <DownloadIcon aria-hidden />
    </Button>
  );
}
