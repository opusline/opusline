import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/missions")({
  component: MissionsPage,
});

function MissionsPage() {
  return (
    <div>
      <h1 className="font-heading font-semibold text-2xl text-card-foreground">
        Missions
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        La liste des missions arrive ici — TJM ou horaire, client, statut.
      </p>
    </div>
  );
}
