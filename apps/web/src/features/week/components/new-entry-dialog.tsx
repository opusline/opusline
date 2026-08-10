import type { TimeEntryData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { Chip, ChipGroup } from "@opusline/ui/components/chip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import { Input } from "@opusline/ui/components/input";
import { Label } from "@opusline/ui/components/label";
import { cn } from "@opusline/ui/lib/utils";
import { useEffect, useId, useState } from "react";
import { matchingNotes, NoteSuggestions } from "@/components/note-suggestions";
import { addCalendarDays, isCalendarDate } from "@/lib/dates";
import {
  formatBilledDays,
  formatBilledHours,
  isHourly,
  parseDuration,
} from "@/lib/durations";
import { isoWeekOf, isoWeekTitle, shortDateLabel } from "@/lib/weeks";
import { durationErrorHint, durationUnitHint } from "../lib/labels";
import type { MissionOption } from "../lib/week-grid";
import { BillableToggle } from "./billable-toggle";

export type NewEntrySubmit = {
  missionId: number;
  date: string;
  durationMinutes: number;
  note: string | null;
  billable: boolean;
  replaceEntryIds: number[];
};

export type NewEntryDialogProps = {
  open: boolean;
  missionOptions: MissionOption[];
  timeEntries: TimeEntryData[];
  knownRange: { from: string; to: string };
  today: string;
  workdayMinutes: number;
  noteSuggestions: string[];
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: NewEntrySubmit) => Promise<boolean>;
};

export function NewEntryDialog({
  open,
  missionOptions,
  timeEntries,
  knownRange,
  today,
  workdayMinutes,
  noteSuggestions,
  isSaving,
  onOpenChange,
  onSubmit,
}: NewEntryDialogProps) {
  const [mission, setMission] = useState<MissionOption | null>(null);

  useEffect(() => {
    if (!open) {
      setMission(null);
    }
  }, [open]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-lg"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between gap-4 border-border border-b px-5 py-4">
          <DialogTitle className="font-heading font-semibold text-foreground-hi text-lg">
            Nouvelle entrée
          </DialogTitle>
          <StepIndicator step={mission === null ? 1 : 2} />
        </DialogHeader>
        {mission === null ? (
          <MissionStep missions={missionOptions} onPick={setMission} />
        ) : (
          <EntryStep
            isSaving={isSaving}
            knownRange={knownRange}
            mission={mission}
            noteSuggestions={noteSuggestions}
            onBack={() => setMission(null)}
            onSubmit={onSubmit}
            timeEntries={timeEntries}
            today={today}
            workdayMinutes={workdayMinutes}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <span
      aria-label={`Étape ${step} sur 2`}
      className="flex gap-1.5"
      role="img"
    >
      {[1, 2].map((index) => (
        <span
          className={cn(
            "h-1 w-5 rounded-full",
            index <= step ? "bg-primary" : "bg-secondary-2",
          )}
          key={index}
        />
      ))}
    </span>
  );
}

function MissionStep({
  missions,
  onPick,
}: {
  missions: MissionOption[];
  onPick: (mission: MissionOption) => void;
}) {
  if (missions.length === 0) {
    return (
      <p className="px-5 py-4.5 text-muted-foreground-3 text-sm">
        Créez d'abord une mission — c'est elle qui porte le tarif.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-5 py-4.5">
      <p className="text-muted-foreground text-sm">Sur quelle mission ?</p>
      <ul className="flex flex-col gap-2">
        {missions.map((mission) => (
          <li key={mission.missionId}>
            <button
              className="flex w-full items-center gap-3 rounded-md border border-border-2 bg-card-2 px-3.5 py-3 text-left transition-colors hover:border-muted-foreground-6 hover:bg-accent"
              onClick={() => onPick(mission)}
              type="button"
            >
              <span
                aria-hidden
                className={cn(
                  "h-8 w-0.75 shrink-0 rounded-sm",
                  mission.colorClass,
                )}
              />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-foreground-hi text-sm">
                  {mission.name}
                </span>
                <span className="truncate text-muted-foreground-3 text-xs">
                  {mission.subtitle}
                </span>
              </span>
              {!mission.isInGrid && (
                <span className="shrink-0 rounded-full border border-border-2 px-2 py-0.5 text-muted-foreground-3 text-xs">
                  hors grille
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

type EntryStepProps = Omit<
  NewEntryDialogProps,
  "open" | "missionOptions" | "onOpenChange"
> & { mission: MissionOption; onBack: () => void };

function EntryStep({
  mission,
  timeEntries,
  knownRange,
  today,
  workdayMinutes,
  noteSuggestions,
  isSaving,
  onBack,
  onSubmit,
}: EntryStepProps) {
  const dateId = useId();
  const durationId = useId();
  const noteId = useId();

  const [date, setDate] = useState(today);
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [billable, setBillable] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shortcuts = [
    { date: today, label: "Aujourd'hui" },
    { date: addCalendarDays(today, -1), label: "Hier" },
    { date: addCalendarDays(today, -2), label: "Avant-hier" },
  ];

  const isDateValid = isCalendarDate(date);
  const isDateKnown =
    isDateValid && date >= knownRange.from && date <= knownRange.to;
  const existing = isDateKnown
    ? timeEntries.filter(
        (entry) => entry.missionId === mission.missionId && entry.date === date,
      )
    : [];
  const existingLabel = existing
    .map((entry) =>
      entry.valuedDayFraction === null
        ? formatBilledHours(entry.valuedMinutes ?? 0)
        : formatBilledDays(entry.valuedDayFraction),
    )
    .join(" + ");

  const submit = () => {
    if (!isDateValid) {
      setError("Indiquez une date.");

      return;
    }

    const parsed = parseDuration(duration, {
      billingMode: mission.billingMode,
      workdayMinutes,
    });

    if (parsed.kind !== "minutes") {
      setError(
        parsed.kind === "clear"
          ? "Indiquez une durée."
          : durationErrorHint(parsed.reason),
      );

      return;
    }

    onSubmit({
      billable,
      date,
      durationMinutes: parsed.minutes,
      missionId: mission.missionId,
      note: note.trim() === "" ? null : note.trim(),
      replaceEntryIds: replaceExisting ? existing.map((entry) => entry.id) : [],
    });
  };

  return (
    <>
      <div className="flex flex-col gap-5 px-5 py-4.5">
        <div className="flex items-center gap-3 rounded-md border border-border-2 bg-card-2 px-3.5 py-3">
          <span
            aria-hidden
            className={cn("h-4 w-0.75 shrink-0 rounded-sm", mission.colorClass)}
          />
          <span className="min-w-0 flex-1 truncate text-foreground-hi text-sm">
            {mission.name}
          </span>
          <Button onClick={onBack} variant="outline">
            Changer
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground-3 text-xs" htmlFor={dateId}>
            Date
          </Label>
          <ChipGroup
            aria-label="Raccourcis de date"
            onValueChange={(value) => {
              const picked = value.find((candidate) => candidate !== undefined);

              if (picked !== undefined) {
                setDate(picked);
                setReplaceExisting(false);
              }
            }}
            value={[date]}
          >
            {shortcuts.map((shortcut) => (
              <Chip key={shortcut.date} value={shortcut.date}>
                {shortcut.label}
              </Chip>
            ))}
          </ChipGroup>
          <Input
            className="w-fit"
            font="mono"
            id={dateId}
            onChange={(event) => {
              setDate(event.target.value);
              setReplaceExisting(false);
            }}
            size="sm"
            type="date"
            value={date}
          />
          <p className="text-muted-foreground-3 text-sm">
            {isDateValid
              ? `${shortDateLabel(date)} · ${isoWeekTitle(
                  isoWeekOf(date),
                ).toLowerCase()}`
              : "Date incomplète"}
          </p>
        </div>

        {existing.length > 0 && (
          <div className="flex flex-col gap-2.5 rounded-md border border-border bg-muted px-3.5 py-3">
            <p className="text-foreground-2 text-sm">
              Une entrée de {existingLabel} existe déjà ce jour-là.
            </p>
            <ChipGroup
              aria-label="Que faire de l'entrée existante"
              onValueChange={(value) =>
                setReplaceExisting(value.includes("replace"))
              }
              value={[replaceExisting ? "replace" : "add"]}
            >
              <Chip value="add">Cumuler</Chip>
              <Chip value="replace">Remplacer</Chip>
            </ChipGroup>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label
            className="text-muted-foreground-3 text-xs"
            htmlFor={durationId}
          >
            Durée
          </Label>
          <Input
            aria-describedby={`${durationId}-hint`}
            aria-invalid={error !== null || undefined}
            className="w-32"
            font="mono"
            id={durationId}
            onChange={(event) => {
              setDuration(event.target.value);
              setError(null);
            }}
            placeholder={isHourly(mission.billingMode) ? "1,5" : "0,5"}
            size="sm"
            value={duration}
          />
          <p
            className="text-muted-foreground-3 text-xs"
            id={`${durationId}-hint`}
          >
            {durationUnitHint(mission.billingMode)}
          </p>
          {error !== null && (
            <p className="text-destructive text-xs" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground-3 text-xs" htmlFor={noteId}>
            Activité
          </Label>
          <Input
            id={noteId}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Revue PR, cadrage…"
            size="sm"
            value={note}
          />
          <NoteSuggestions
            onPick={setNote}
            suggestions={matchingNotes(noteSuggestions, note)}
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 border-border border-t bg-muted px-5 py-3.5">
        {mission.hasRate ? (
          <BillableToggle billable={billable} onChange={setBillable} />
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <Button onClick={onBack} variant="ghost">
            Retour
          </Button>
          <Button disabled={isSaving} onClick={submit} size="2xl">
            {isSaving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </div>
    </>
  );
}
