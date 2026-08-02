import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/semaine")({
  component: SemainePage,
});

function SemainePage() {
  return (
    <div>
      <h1 className="font-heading font-semibold text-2xl text-card-foreground">
        Semaine
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        La vue semaine arrive ici — grille jours × missions, saisie au clavier.
      </p>
    </div>
  );
}
