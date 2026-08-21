import { currentUserOptions } from "@opusline/api-client/react-query";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@opusline/ui/components/sidebar";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useEffect } from "react";
import { AddressAutocompleteProvider } from "@/components/address-autocomplete-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { MoneyFormatProvider } from "@/components/money-format-provider";
import { InvoiceDrawerProvider } from "@/features/invoices/components/invoice-drawer-provider";
import { ModeToggle } from "@/features/theme/components/mode-toggle";
import {
  useThemeControl,
  useThemeSync,
} from "@/features/theme/lib/use-theme-preference";
import { TimerContainer } from "@/features/timer/components/timer-container";
import { TimerProvider } from "@/features/timer/components/timer-provider";
import { syncLocale } from "@/lib/i18n";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async ({ context, location }) => {
    try {
      const user = await context.queryClient.ensureQueryData({
        ...currentUserOptions(),
        retry: false,
      });

      return { user };
    } catch {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: AuthedLayout,
});

const pageTitles: Record<string, () => string> = {
  "/week": m.page_title_week,
  "/clients": m.page_title_clients,
  "/cra": m.page_title_cra,
  "/revenue": m.page_title_revenue,
  "/treasury": m.page_title_treasury,
  "/bank-account": m.page_title_bank,
  "/deadlines": m.page_title_deadlines,
  "/declarations": m.page_title_declarations,
  "/documents": m.page_title_documents,
  "/release-notes": m.page_title_release_notes,
  "/settings": m.page_title_settings,
};

function ExpandSidebarButton() {
  const { state, isMobile, toggleSidebar } = useSidebar();

  if (!isMobile && state === "expanded") {
    return null;
  }

  return (
    <button
      className="flex h-8 w-7 flex-none items-center justify-center rounded-md border text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
      aria-label={m.sidebar_expand_menu()}
      onClick={toggleSidebar}
      title={m.sidebar_expand_menu()}
      type="button"
    >
      <Menu aria-hidden className="size-3.5" />
    </button>
  );
}

function AuthedLayout() {
  const { user: loadedUser } = Route.useRouteContext();
  const { data: user = loadedUser } = useQuery(currentUserOptions());
  const { pathname } = useLocation();

  useThemeSync(user);

  useEffect(() => {
    syncLocale(user.locale);
  }, [user.locale]);

  const { theme, resolvedTheme, setTheme } = useThemeControl();

  const pageTitle = Object.entries(pageTitles).find(([prefix]) =>
    pathname.startsWith(prefix),
  )?.[1]?.();

  return (
    <MoneyFormatProvider
      currency={user.currency}
      dateFormat={user.dateFormat}
      locale={user.locale}
    >
      <AddressAutocompleteProvider businessCountry={user.businessCountry}>
        <TimerProvider workdayMinutes={user.workdayMinutes}>
          <InvoiceDrawerProvider timezone={user.timezone}>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-14 items-center gap-4 border-b px-4">
                  <ExpandSidebarButton />
                  {pageTitle ? (
                    <span className="font-medium text-sm">{pageTitle}</span>
                  ) : null}
                  <div className="flex-1" />
                  <ModeToggle
                    onChange={setTheme}
                    resolvedTheme={resolvedTheme}
                    theme={theme}
                  />
                  <TimerContainer workdayMinutes={user.workdayMinutes} />
                </header>
                <div className="p-6">
                  <Outlet />
                </div>
              </SidebarInset>
            </SidebarProvider>
          </InvoiceDrawerProvider>
        </TimerProvider>
      </AddressAutocompleteProvider>
    </MoneyFormatProvider>
  );
}
