import { createFileRoute } from "@tanstack/react-router";

import { requireFrenchFiscality } from "@/lib/fiscality";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/treasury")({
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: VirementPage,
});

function VirementPage() {
  return (
    <div>
      <h1 className="font-heading font-semibold text-2xl text-card-foreground">
        {m.treasury_title()}
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        {m.treasury_placeholder()}
      </p>
    </div>
  );
}
