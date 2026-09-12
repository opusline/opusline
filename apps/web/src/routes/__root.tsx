import { Button } from "@opusline/ui/components/button";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";

import { lazy, Suspense } from "react";

import "@opusline/ui/globals.css";

import { FallbackCard } from "@/components/fallback-card";
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
      <FallbackCard hint={m.not_found_hint()} title={m.not_found_title()}>
        <Button render={<Link to="/week" />}>{m.not_found_home()}</Button>
      </FallbackCard>
    </main>
  );
}

const showDevtools = import.meta.env.DEV && import.meta.env.MODE !== "test";

/**
 * Imported lazily behind a build-time-dead flag, never statically: with the
 * flag false Rollup drops the dynamic imports too, so a production build
 * carries zero devtools bytes. The static imports used to be tree-shaken away
 * by luck, and a devtools package update quietly moved ~16 kB gzip into the
 * entry chunk — the bundle budget in CI is what catches that; this shape is
 * what prevents it.
 */
const Devtools = showDevtools
  ? lazy(async () => {
      const [{ TanStackDevtools }, { TanStackRouterDevtoolsPanel }] =
        await Promise.all([
          import("@tanstack/react-devtools"),
          import("@tanstack/react-router-devtools"),
        ]);

      return {
        default: () => (
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
        ),
      };
    })
  : null;

function RootComponent() {
  const uiLocale = useUiLocale();

  return (
    <ThemeProvider key={uiLocale}>
      <Outlet />
      {Devtools !== null && (
        <Suspense fallback={null}>
          <Devtools />
        </Suspense>
      )}
    </ThemeProvider>
  );
}
