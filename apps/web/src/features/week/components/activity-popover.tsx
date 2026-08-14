import { Button } from "@opusline/ui/components/button";
import { Input } from "@opusline/ui/components/input";
import { Label } from "@opusline/ui/components/label";
import { Trash2Icon } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useId, useState } from "react";
import { matchingNotes, NoteSuggestions } from "@/components/note-suggestions";
import { formatWorkedTime } from "@/lib/durations";
import type { WeekCell } from "../lib/week-grid";
import { BillableToggle } from "./billable-toggle";

export type EntryPatch = { note?: string | null; billable?: boolean };

export type ActivityPopoverProps = {
  cell: WeekCell;
  canBill: boolean;
  noteSuggestions: string[];
  onUpdateEntry: (entryId: number, patch: EntryPatch) => void;
  onDeleteEntry: (entryId: number) => void;
  onClose: () => void;
};

export function ActivityPopover({
  cell,
  canBill,
  noteSuggestions,
  onUpdateEntry,
  onDeleteEntry,
  onClose,
}: ActivityPopoverProps) {
  const isSingle = cell.entries.length === 1;
  const only = isSingle ? cell.entries[0] : null;

  return (
    <div className="flex flex-col gap-2.5">
      {cell.entries.map((entry) => (
        <ActivityField
          autoFocus={isSingle}
          canBill={canBill && !isSingle}
          entry={entry}
          key={entry.id}
          durationLabel={
            isSingle ? null : formatWorkedTime(entry.durationMinutes)
          }
          noteSuggestions={noteSuggestions}
          onDelete={isSingle ? null : () => onDeleteEntry(entry.id)}
          onSave={(patch) => onUpdateEntry(entry.id, patch)}
          onSubmit={onClose}
        />
      ))}
      <div className="flex items-center justify-between gap-3 border-border border-t pt-2.5">
        {canBill && only !== null ? (
          <BillableToggle
            billable={only.billable}
            onChange={(billable) => onUpdateEntry(only.id, { billable })}
          />
        ) : (
          <span />
        )}
        <Button onClick={onClose} variant="outline">
          OK
        </Button>
      </div>
    </div>
  );
}

type ActivityFieldProps = {
  entry: WeekCell["entries"][number];
  autoFocus: boolean;
  canBill: boolean;
  durationLabel: string | null;
  noteSuggestions: string[];
  onSave: (patch: EntryPatch) => void;
  onDelete: (() => void) | null;
  onSubmit: () => void;
};

function ActivityField({
  entry,
  autoFocus,
  canBill,
  durationLabel,
  noteSuggestions,
  onSave,
  onDelete,
  onSubmit,
}: ActivityFieldProps) {
  const fieldId = useId();
  const [note, setNote] = useState(entry.note ?? "");

  const save = (value: string) => {
    const trimmed = value.trim();

    if (trimmed !== (entry.note ?? "")) {
      onSave({ note: trimmed === "" ? null : trimmed });
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      save(note);
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label tone="quiet" htmlFor={fieldId}>
          Activité
        </Label>
        {durationLabel !== null && (
          <span className="whitespace-nowrap font-mono text-muted-foreground-3 text-xs tabular-nums">
            {durationLabel}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <Input
          autoFocus={autoFocus}
          id={fieldId}
          onBlur={(event) => save(event.target.value)}
          onChange={(event) => setNote(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Revue PR, cadrage…"
          size="sm"
          value={note}
        />
        {onDelete !== null && (
          <Button
            aria-label="Supprimer cette entrée"
            onClick={onDelete}
            size="icon-sm"
            variant="ghost"
          >
            <Trash2Icon aria-hidden />
          </Button>
        )}
      </div>
      {canBill && (
        <BillableToggle
          billable={entry.billable}
          onChange={(billable) => onSave({ billable })}
        />
      )}
      <NoteSuggestions
        keepFocus
        onPick={(suggestion) => {
          setNote(suggestion);
          save(suggestion);
        }}
        suggestions={matchingNotes(noteSuggestions, note)}
      />
    </div>
  );
}
