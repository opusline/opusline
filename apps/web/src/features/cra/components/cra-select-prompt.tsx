import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { CalendarCheckIcon } from "lucide-react";

import { m } from "@/paraglide/messages.js";

/**
 * Shown when the aside has months but none is open — which only happens when every
 * one of them is still owed, since the screen opens on the newest month that already
 * exists. Without it the right-hand column is simply blank next to a populated list.
 */
export function CraSelectPrompt() {
  return (
    <Empty className="px-6 py-10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarCheckIcon />
        </EmptyMedia>
        <EmptyTitle>{m.cra_select_title()}</EmptyTitle>
        <EmptyDescription>{m.cra_select_description()}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
