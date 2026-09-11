import type { CraListItemData } from "@opusline/api-client";
import { listCrasQueryKey } from "@opusline/api-client/react-query";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { craItem } from "../lib/fixtures";
import { MissionCraTab } from "./mission-cra-tab";

const MISSION_ID = 10;

/** Seeds the cache the tab reads, so the story needs no network. */
function Example({ cras }: { cras: CraListItemData[] }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Number.POSITIVE_INFINITY },
      },
    });

    client.setQueryData(listCrasQueryKey(), {
      cras,
      counts: { toProduce: 1, sent: 1, signed: 1 },
    });

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-3xl p-6">
        <MissionCraTab
          missionId={MISSION_ID}
          onOpen={() => undefined}
          onOpenAll={() => undefined}
        />
      </div>
    </QueryClientProvider>
  );
}

const meta = {
  title: "Web/Cra/MissionCraTab",
  component: MissionCraTab,
  tags: ["autodocs"],
} satisfies Meta<typeof MissionCraTab>;

export default meta;
type Story = StoryObj<typeof MissionCraTab>;

export const Default: Story = {
  render: () => (
    <Example
      cras={[
        craItem({ id: null, month: "2026-08", status: 0, totalDays: 0 }),
        craItem({ id: 1, month: "2026-07", status: 0, totalDays: 18 }),
        craItem({ id: 2, month: "2026-06", status: 1 }),
        craItem({ id: 3, month: "2026-05", status: 2 }),
        // Another mission's month, which this tab must not list.
        craItem({ id: 4, missionId: 20, month: "2026-07", status: 1 }),
      ]}
    />
  ),
};

/** A mission that requires a CRA but has no month behind it yet. */
export const NoMonthYet: Story = {
  render: () => <Example cras={[craItem({ id: 4, missionId: 20 })]} />,
};
