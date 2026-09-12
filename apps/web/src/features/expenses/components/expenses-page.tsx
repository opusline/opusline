import { Tabs, TabsList, TabsTrigger } from "@opusline/ui/components/tabs";
import type { ReactNode } from "react";

import { m } from "@/paraglide/messages.js";

export type ExpensesTab = "journal" | "subscriptions";

type ExpensesPageProps = {
  tab: ExpensesTab;
  onTabChange: (tab: ExpensesTab) => void;
  /** The primary call to action of the tab shown. */
  action: ReactNode;
  controls: ReactNode;
  children: ReactNode;
};

function isExpensesTab(value: unknown): value is ExpensesTab {
  return value === "journal" || value === "subscriptions";
}

export function ExpensesPage({
  tab,
  onTabChange,
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
      <Tabs
        onValueChange={(value) => {
          if (isExpensesTab(value)) {
            onTabChange(value);
          }
        }}
        value={tab}
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b">
          <TabsList variant="underline-inline">
            <TabsTrigger value="journal">
              {m.expenses_tab_journal()}
            </TabsTrigger>
            <TabsTrigger value="subscriptions">
              {m.expenses_tab_subscriptions()}
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
