import { Button } from "@opusline/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@opusline/ui/components/card";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import "@opusline/ui/globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { useUiLocale } from "@/lib/i18n";
import { m } from "@/paraglide/messages.js";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{m.not_found_title()}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">{m.not_found_hint()}</p>
          <Button render={<Link to="/dashboard" />}>
            {m.not_found_home()}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

const showDevtools = import.meta.env.DEV && import.meta.env.MODE !== "test";

function RootComponent() {
  const uiLocale = useUiLocale();

  return (
    <ThemeProvider key={uiLocale}>
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
