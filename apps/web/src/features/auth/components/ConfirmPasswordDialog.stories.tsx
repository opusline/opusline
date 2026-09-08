import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { ConfirmPasswordDialog } from "./confirm-password-dialog";

function Example() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmPasswordDialog onCancel={() => {}} onConfirmed={() => {}} open />
    </QueryClientProvider>
  );
}

const meta = {
  title: "Web/Auth/ConfirmPasswordDialog",
  component: Example,
  tags: ["autodocs"],
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof Example>;

export const Open: Story = {};
