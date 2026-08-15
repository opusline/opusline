import { Button } from "@opusline/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { Link } from "@tanstack/react-router";
import { CalendarIcon } from "lucide-react";
import { m } from "@/paraglide/messages.js";

export function WeekMissionsEmptyState() {
  return (
    <Empty className="rounded-md border border-solid bg-card px-8 py-11">
      <EmptyHeader className="max-w-none gap-2">
        <EmptyMedia className="mb-2.5">
          <div
            aria-hidden
            className="flex h-10.5 w-9.5 items-center justify-center rounded border border-border-4 border-dashed"
          >
            <CalendarIcon
              className="size-4 text-muted-foreground-3"
              strokeWidth={1.8}
            />
          </div>
        </EmptyMedia>
        <EmptyTitle className="font-heading font-semibold text-base text-foreground-hi">
          {m.week_missions_empty_title()}
        </EmptyTitle>
        <EmptyDescription className="max-w-[46ch] text-muted-foreground-3">
          {m.week_missions_empty_description()}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row flex-wrap justify-center gap-2">
        <Button render={<Link to="/clients/new" />} size="2xl">
          {m.clients_create_short()}
        </Button>
        <Button render={<Link to="/clients" />} size="2xl" variant="outline">
          {m.week_view_clients()}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
