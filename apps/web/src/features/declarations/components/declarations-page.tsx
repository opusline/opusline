import type { DeclarationsData } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

import { UrssafDeclarationCard } from "./urssaf-declaration-card";
import { VatDeclarationCard } from "./vat-declaration-card";

export function DeclarationsPage({ data }: { data: DeclarationsData }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] items-start gap-4">
      {/* The design gives the page no visible title — the topbar carries it —
          but the cards start at h2, so the outline still needs its level 1. */}
      <h1 className="sr-only">{m.nav_declarations()}</h1>
      {data.urssaf !== null && <UrssafDeclarationCard urssaf={data.urssaf} />}
      {data.vat !== null && <VatDeclarationCard vat={data.vat} />}
    </div>
  );
}
