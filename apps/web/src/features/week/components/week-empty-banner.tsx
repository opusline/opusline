import { Button } from "@opusline/ui/components/button";

type WeekEmptyBannerProps = {
  previousWeekEntryCount: number;
  isRepeating: boolean;
  onRepeat: () => void;
};

export function WeekEmptyBanner({
  previousWeekEntryCount,
  isRepeating,
  onRepeat,
}: WeekEmptyBannerProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-primary/30 bg-primary/6 px-5 py-3.5">
      <div>
        <p className="text-primary-text text-sm">Semaine vide</p>
        <p className="text-muted-foreground text-sm">
          Vos missions actives n'ont aucune entrée. Repartez de la semaine
          précédente plutôt que tout ressaisir.
        </p>
      </div>
      <Button disabled={isRepeating} onClick={onRepeat} size="xl">
        {isRepeating
          ? "Reprise en cours…"
          : previousWeekEntryCount === 1
            ? "Reprendre l'entrée"
            : `Reprendre les ${previousWeekEntryCount} entrées`}
      </Button>
    </div>
  );
}
