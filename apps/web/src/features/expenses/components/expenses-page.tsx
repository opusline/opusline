import { Tabs, TabsList, TabsTrigger } from "@opusline/ui/components/tabs";
import type { ReactNode } from "react";

import { m } from "@/paraglide/messages.js";

type ExpensesPageProps = {
  /** The primary call to action; none while the expense sheet is not there yet. */
  action: ReactNode;
  controls: ReactNode;
  children: ReactNode;
};

export function ExpensesPage({
  action,
  controls,
  children,
}: ExpensesPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="whitespace-nowrap font-heading font-semibold text-2xl text-foreground-hi leading-tight">
          {m.expenses_title()}
        </h1>
        {action}
      </div>
      <Tabs value="journal">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b">
          <TabsList variant="underline-inline">
            <TabsTrigger value="journal">
              {m.expenses_tab_journal()}
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap items-center gap-2.5 pb-2">
            {controls}
          </div>
        </div>
      </Tabs>
      {children}
    </div>
  );
}
