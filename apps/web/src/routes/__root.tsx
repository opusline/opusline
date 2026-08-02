import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import "@opusline/ui/globals.css";

import { ThemeProvider } from "@/components/theme-provider";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

const showDevtools = import.meta.env.DEV && import.meta.env.MODE !== "test";

function RootComponent() {
  return (
    <ThemeProvider>
      <Outlet />
      {showDevtools && (
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      )}
    </ThemeProvider>
  );
}
