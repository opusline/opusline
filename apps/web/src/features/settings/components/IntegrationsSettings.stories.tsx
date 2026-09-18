import type { IntegrationsData } from "@opusline/api-client";
import { showIntegrationsQueryKey } from "@opusline/api-client/react-query";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { StoryRouter } from "@/test/story-router";
import { IntegrationsSettings } from "./integrations-settings";

/** Seeds the integrations the tab reads, so the story needs no network. */
function Example({ integrations }: { integrations: IntegrationsData }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });

    client.setQueryData(showIntegrationsQueryKey(), integrations);

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <StoryRouter>
        <div className="max-w-160">
          <IntegrationsSettings />
        </div>
      </StoryRouter>
    </QueryClientProvider>
  );
}

const meta = {
  title: "Web/Settings/IntegrationsSettings",
  component: Example,
  tags: ["autodocs"],
  args: {
    integrations: {
      enableBanking: {
        applicationId: null,
        redirectUrl: "https://opusline.example/bank-account",
      },
    },
  },
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof Example>;

export const NotConfigured: Story = {};

export const Configured: Story = {
  args: {
    integrations: {
      enableBanking: {
        applicationId: "6f1c1a52-9d1e-4b9e-8a53-0c1e2f3a4b5c",
        redirectUrl: "https://opusline.example/bank-account",
      },
    },
  },
};
