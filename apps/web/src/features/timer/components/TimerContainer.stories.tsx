import type {
  ClientWithMissionsData,
  TimerStateData,
} from "@opusline/api-client";
import {
  listClientsQueryKey,
  showTimerQueryKey,
} from "@opusline/api-client/react-query";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { TimerContainer } from "./timer-container";
import { TimerProvider } from "./timer-provider";

const client: ClientWithMissionsData = {
  id: 1,
  slug: "nordlys",
  name: "Nordlys",
  type: 1,
  notes: null,
  siret: null,
  vatNumber: null,
  billingAddressLine1: null,
  billingAddressLine2: null,
  billingPostalCode: null,
  billingCity: null,
  billingCountry: null,
  billingContactName: null,
  billingEmail: null,
  color: 0,
  paymentTermsDays: 45,
  archivedAt: null,
  createdAt: "2025-03-01T00:00:00+00:00",
  missions: [
    {
      id: 1,
      slug: "callisto-front",
      clientId: 1,
      name: "Callisto front",
      endClientName: "Callisto",
      billingMode: 0,
      rate: { amount: 55_000, currency: "EUR" },
      rounding: 0,
      status: 0,
      craRequired: true,
      color: null,
      notes: null,
      startDate: "2025-03-03",
      endDate: null,
    },
    {
      id: 2,
      slug: "callisto-socle-api",
      clientId: 1,
      name: "Callisto socle API",
      endClientName: "Callisto",
      billingMode: 1,
      rate: { amount: 8_000, currency: "EUR" },
      rounding: 1,
      status: 0,
      craRequired: false,
      color: 3,
      notes: null,
      startDate: "2025-04-01",
      endDate: null,
    },
  ],
};

const runningTimer: TimerStateData = {
  timer: {
    id: 1,
    missionId: 1,
    missionName: "Callisto front",
    missionColor: 0,
    state: 0,
    startedAt: new Date(Date.now() - 25 * 60_000).toISOString(),
    elapsedSeconds: 25 * 60,
    note: null,
  },
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
    seeded.setQueryData(listClientsQueryKey(), { clients: [client] });

    return seeded;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TimerProvider workdayMinutes={420}>
        <div className="flex justify-end p-4">
          <TimerContainer workdayMinutes={420} />
        </div>
      </TimerProvider>
    </QueryClientProvider>
  );
}

const meta = {
  title: "Web/TimerContainer",
  component: TimerContainer,
  tags: ["autodocs"],
} satisfies Meta<typeof TimerContainer>;

export default meta;
type Story = StoryObj<typeof TimerContainer>;

export const Idle: Story = {
  render: () => <Example timerState={{ timer: null, lastMissionId: null }} />,
};

export const Running: Story = {
  render: () => <Example timerState={runningTimer} />,
};

const pausedTimer: TimerStateData = {
  timer: {
    id: 2,
    missionId: 1,
    missionName: "Callisto front",
    missionColor: 0,
    state: 1,
    startedAt: new Date(Date.now() - 42 * 60_000).toISOString(),
    elapsedSeconds: 25 * 60,
    note: null,
  },
  lastMissionId: 1,
};

export const Paused: Story = {
  render: () => <Example timerState={pausedTimer} />,
};
