import { listCrasQueryKey } from "@opusline/api-client/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { craItem } from "../lib/fixtures";
import { MissionCraTab } from "./mission-cra-tab";

const MISSION_ID = 10;

function renderTab(cras = defaultCras()) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Number.POSITIVE_INFINITY },
    },
  });
  queryClient.setQueryData(listCrasQueryKey(), {
    cras,
    counts: { toProduce: 1, sent: 1, signed: 0 },
  });

  const onOpen = vi.fn();
  const onOpenAll = vi.fn();

  render(
    <QueryClientProvider client={queryClient}>
      <MissionCraTab
        missionId={MISSION_ID}
        onOpen={onOpen}
        onOpenAll={onOpenAll}
      />
    </QueryClientProvider>,
  );

  return { onOpen, onOpenAll };
}

function defaultCras() {
  return [
    craItem({ id: null, month: "2026-08", status: 0, totalDays: 0 }),
    craItem({ id: 1, month: "2026-07", status: 1 }),
    craItem({ id: 4, missionId: 20, month: "2026-07", status: 1 }),
  ];
}

it("lists only the months of the mission it was asked about", () => {
  renderTab();

  expect(screen.getByText("Août 2026")).toBeInTheDocument();
  expect(screen.getByText("Juillet 2026")).toBeInTheDocument();
  expect(screen.getAllByRole("button")).toHaveLength(3);
});

it("marks a month that has no report behind it yet", () => {
  renderTab();

  expect(screen.getByText("À produire")).toBeInTheDocument();
  expect(screen.getByText("Envoyé")).toBeInTheDocument();
});

it("hands the picked month back", () => {
  const { onOpen } = renderTab();

  fireEvent.click(screen.getByText("Juillet 2026"));

  expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
});

it("says so when the mission owes no month yet", () => {
  renderTab([craItem({ id: 4, missionId: 20 })]);

  expect(screen.getByText(/Aucun mois à reporter/)).toBeInTheDocument();
});
