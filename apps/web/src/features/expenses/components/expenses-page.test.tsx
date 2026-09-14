import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { ExpensesPage } from "./expenses-page";

it.each([
  ["journal", "Abonnements", "subscriptions"],
  ["subscriptions", "Journal", "journal"],
] as const)(
  "hands the tab picked from %s over to the page",
  (tab, trigger, picked) => {
    const onTabChange = vi.fn();

    render(
      <ExpensesPage
        action={null}
        controls={null}
        onTabChange={onTabChange}
        tab={tab}
      >
        {null}
      </ExpensesPage>,
    );

    fireEvent.click(screen.getByRole("tab", { name: trigger }));

    expect(onTabChange).toHaveBeenCalledWith(picked);
  },
);
