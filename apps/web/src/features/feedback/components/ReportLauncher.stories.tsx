import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { ReportLauncher } from "./report-launcher";

function Example({ canDraftWithClaude }: { canDraftWithClaude: boolean }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { mutations: { retry: false } } }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-150">
        <ReportLauncher
          canDraftWithClaude={canDraftWithClaude}
          context={{
            route: "/week",
            browser:
              "Mozilla/5.0 (X11; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0",
            locale: "en-US",
          }}
        />
      </div>
    </QueryClientProvider>
  );
}

const meta = {
  title: "Web/Feedback/ReportLauncher",
  component: Example,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof Example>;

/** Pinned to the corner of every signed-in screen; opens the report form. */
export const Default: Story = { args: { canDraftWithClaude: false } };

/** With an Anthropic key, Claude asks what is missing, then drafts the report. */
export const DraftWithClaude: Story = { args: { canDraftWithClaude: true } };
