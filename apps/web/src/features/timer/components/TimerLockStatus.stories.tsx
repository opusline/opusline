import type { TimerData, TimerStateData } from "@opusline/api-client";
import { showTimerQueryKey } from "@opusline/api-client/react-query";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { TimerLockStatus } from "./timer-lock-status";
import { TimerProvider } from "./timer-provider";

const timer: TimerData = {
  id: 1,
  missionId: 1,
  missionName: "Callisto front",
  missionColor: 0,
  state: 0,
  startedAt: new Date(Date.now() - 134 * 60_000).toISOString(),
  elapsedSeconds: 134 * 60,
  note: null,
};

const runningTimer: TimerStateData = { timer, lastMissionId: 1 };

const pausedTimer: TimerStateData = {
  timer: { ...timer, state: 1 },
  lastMissionId: 1,
};

function Example({ timerState }: { timerState: TimerStateData }) {
  const [queryClient] = useState(() => {
    const seeded = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Number.POSITIVE_INFINITY },
      },
    });

    seeded.setQueryData(showTimerQueryKey(), timerState);

    return seeded;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TimerProvider workdayMinutes={420}>
        <div className="max-w-100 p-4">
          <TimerLockStatus />
        </div>
      </TimerProvider>
    </QueryClientProvider>
  );
}

const meta = {
  title: "Web/Timer/TimerLockStatus",
  component: TimerLockStatus,
  tags: ["autodocs"],
} satisfies Meta<typeof TimerLockStatus>;

export default meta;
type Story = StoryObj<typeof TimerLockStatus>;

export const Running: Story = {
  render: () => <Example timerState={runningTimer} />,
};

/** Nothing to report: a paused timer is not going anywhere while the app is locked. */
export const Paused: Story = {
  render: () => <Example timerState={pausedTimer} />,
};

export const NoTimer: Story = {
  render: () => <Example timerState={{ timer: null, lastMissionId: null }} />,
};
