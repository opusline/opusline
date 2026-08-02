import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  return (
    <div>
      <h1 className="font-heading font-semibold text-2xl text-card-foreground">
        Clients
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        La liste des clients arrive ici — avec ESN et clients finaux.
      </p>
    </div>
  );
}
