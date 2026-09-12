import { type DragEvent, useState } from "react";

/**
 * Drop-target props for an element that is not itself a file input — a table
 * row, a card — so a receipt can land on the expense it belongs to. Spread
 * them; `data-drag-over` styles the hover the way the Dropzone primitive does.
 */
export function useFileDrop(onFiles: (files: FileList) => void) {
  const [isDragOver, setIsDragOver] = useState(false);

  return {
    "data-drag-over": isDragOver ? "" : undefined,
    onDragOver: (event: DragEvent) => {
      event.preventDefault();
      setIsDragOver(true);
    },
    onDragLeave: () => setIsDragOver(false),
    onDrop: (event: DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      if (event.dataTransfer.files.length > 0) {
        onFiles(event.dataTransfer.files);
      }
    },
  };
}
