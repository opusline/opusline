import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/virement")({
  component: VirementPage,
});

function VirementPage() {
  return (
    <div>
      <h1 className="font-heading font-semibold text-2xl text-card-foreground">
        Combien je peux me virer ?
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Le calculateur de virement arrive ici — provisions TVA et URSSAF
        déduites.
      </p>
    </div>
  );
}
