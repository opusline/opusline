import { Button } from "@opusline/ui/components/button";
import type { ReactNode } from "react";

/**
 * The floating footer both settings save flows share: status text, Annuler,
 * and the caller's own save button — the bulk form submits through it, the
 * Localisation card clicks.
 */
export function SaveBar({
  label,
  isSaving,
  onCancel,
  children,
}: {
  label: ReactNode;
  isSaving: boolean;
  onCancel: () => void;
  children: ReactNode;
}) {
  return (
    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 rounded-md border bg-card px-5 py-4 shadow-2xl shadow-black/50">
      <span aria-live="polite" className="text-muted-foreground text-sm">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <Button
          disabled={isSaving}
          onClick={onCancel}
          size="xl"
          type="button"
          variant="outline"
        >
          Annuler
        </Button>
        {children}
      </div>
    </div>
  );
}
