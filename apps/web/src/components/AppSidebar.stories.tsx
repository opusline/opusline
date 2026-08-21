import type { UserData } from "@opusline/api-client";
import { showTreasuryQueryKey } from "@opusline/api-client/react-query";
import { SidebarProvider } from "@opusline/ui/components/sidebar";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { seedCurrentUser } from "@/test/current-user";
import { treasuryData } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";
import { AppSidebar } from "./app-sidebar";

function Example({
  user = {},
  hasTreasury = true,
}: {
  user?: Partial<UserData>;
  hasTreasury?: boolean;
}) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });

    seedCurrentUser(client, { name: "Théo Marchand", ...user });

    if (hasTreasury) {
      client.setQueryData(showTreasuryQueryKey(), treasuryData());
    }

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <StoryRouter>
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </StoryRouter>
    </QueryClientProvider>
  );
}

const meta = {
  title: "Web/AppSidebar",
  component: AppSidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppSidebar>;

export default meta;
type Story = StoryObj<typeof AppSidebar>;

export const Default: Story = {
  render: () => <Example />,
};

export const FiscalNavigationHidden: Story = {
  render: () => <Example user={{ hasFrenchFiscality: false }} />,
};

export const WithUnreadReleaseNotes: Story = {
  render: () => <Example user={{ releaseNotesSeenVersion: "0.8.0" }} />,
};

/** Until the figure arrives, the tile shows a dash rather than a zero. */
export const TreasuryTileLoading: Story = {
  render: () => <Example hasTreasury={false} />,
};
