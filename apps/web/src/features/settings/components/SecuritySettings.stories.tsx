import { showTwoFactorQueryKey } from "@opusline/api-client/react-query";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { MoneyFormatProvider } from "@/components/money-format-provider";
import {
  twoFactorOffFixture,
  twoFactorOnFixture,
} from "../lib/security-fixture";
import { SecuritySettings } from "./security-settings";

/** Seeds the status the tab reads, so the story needs no network. */
function Example({ status }: { status: typeof twoFactorOnFixture }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });

    client.setQueryData(showTwoFactorQueryKey(), status);

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MoneyFormatProvider currency="EUR" dateFormat={0} locale="fr-FR">
        <SecuritySettings
          guarded={async (action) => ({
            status: "done",
            value: await action(),
          })}
          webAuthn={{
            isSupported: true,
            createPasskey: async () => "{}",
            failure: () => "failed",
          }}
        />
      </MoneyFormatProvider>
    </QueryClientProvider>
  );
}

const meta = {
  title: "Web/Settings/SecuritySettings",
  component: Example,
  tags: ["autodocs"],
  args: { status: twoFactorOnFixture },
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof Example>;

export const TotpOn: Story = {};

export const AllOff: Story = {
  args: { status: twoFactorOffFixture },
};
