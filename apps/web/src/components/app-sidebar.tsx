import {
  currentUserOptions,
  logoutMutation,
} from "@opusline/api-client/react-query";
import { Avatar, AvatarFallback } from "@opusline/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@opusline/ui/components/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@opusline/ui/components/sidebar";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  ChartLine,
  ChevronsUpDown,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Database,
  Download,
  FileCheck,
  History,
  LogOut,
  PanelLeft,
  ReceiptText,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { initials } from "@/lib/initials";
import { unreadReleaseCount } from "@/lib/releases";
import { APP_VERSION } from "@/lib/version";
import { m } from "@/paraglide/messages.js";

export function AppSidebar() {
  const { pathname } = useLocation();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useSuspenseQuery(currentUserOptions());
  const unreadReleaseNotes = unreadReleaseCount(user.releaseNotesSeenVersion);

  const logout = useMutation({
    ...logoutMutation(),
    onSuccess: async () => {
      queryClient.clear();
      await navigate({ to: "/login" });
    },
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center">
          <SidebarMenuButton render={<Link to="/dashboard" />} size="lg">
            <img alt="" className="size-6 rounded" src="/logo.svg" />
            <span className="font-heading font-semibold text-lg">Opusline</span>
          </SidebarMenuButton>
          <button
            className="flex size-8 flex-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden"
            aria-label={m.sidebar_collapse_menu()}
            onClick={toggleSidebar}
            title={m.sidebar_collapse()}
            type="button"
          >
            <PanelLeft aria-hidden className="size-4" />
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/week")}
                  render={<Link to="/week" />}
                  tooltip={m.nav_week()}
                >
                  <CalendarDays />
                  <span>{m.nav_week()}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/clients")}
                  render={<Link to="/clients" />}
                  tooltip={m.nav_clients()}
                >
                  <Users />
                  <span>{m.nav_clients()}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/cra")}
                  render={<Link to="/cra" />}
                  tooltip={m.nav_cra()}
                >
                  <FileCheck />
                  <span>{m.nav_cra()}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/invoices")}
                  render={<Link to="/invoices" />}
                  tooltip={m.nav_invoices()}
                >
                  <ReceiptText />
                  <span>{m.nav_invoices()}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/*
                The revenue/treasury/deadlines/declarations screens compute
                URSSAF and TVA figures that only exist for a business
                established in France; elsewhere they would just be wrong.
              */}
              {user.hasFrenchFiscality && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname.startsWith("/revenue")}
                      render={<Link to="/revenue" />}
                      tooltip={m.nav_revenue()}
                    >
                      <ChartLine />
                      <span>{m.nav_revenue()}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname.startsWith("/treasury")}
                      render={<Link to="/treasury" />}
                      tooltip={m.nav_treasury()}
                    >
                      <CreditCard />
                      <span>{m.nav_treasury()}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname.startsWith("/deadlines")}
                      render={<Link to="/deadlines" />}
                      tooltip={m.nav_deadlines()}
                    >
                      <Bell />
                      <span>{m.nav_deadlines()}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname.startsWith("/declarations")}
                      render={<Link to="/declarations" />}
                      tooltip={m.nav_declarations()}
                    >
                      <ClipboardList />
                      <span>{m.nav_declarations()}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/settings")}
                  render={<Link to="/settings" />}
                  tooltip={m.nav_settings()}
                >
                  <SlidersHorizontal />
                  <span>{m.nav_settings()}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {user.hasFrenchFiscality && (
          <SidebarGroup className="mt-auto pb-3 group-data-[collapsible=icon]:hidden">
            <SidebarGroupContent>
              <Link
                className="block rounded-lg border border-primary/30 bg-primary/10 px-3.5 py-3 transition-colors hover:bg-primary/15"
                to="/treasury"
              >
                {/*
                No treasury endpoint exists yet — the figure arrives with the
                treasury screen. A dash keeps the tile honest until then.
              */}
                <div className="font-medium text-ring/70 text-xs uppercase tracking-wider-2">
                  {m.treasury_tile_title()}
                </div>
                <div className="mt-2 font-mono text-2xl text-ring leading-none tabular-nums">
                  —
                </div>
                <div className="mt-1.5 text-muted-foreground text-xs">
                  {m.treasury_tile_caption()}
                </div>
              </Link>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border border-t p-0 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-auto rounded-none border-sidebar-border border-b px-3.5 py-2 group-data-[collapsible=icon]:rounded-md group-data-[collapsible=icon]:border-b-0"
              isActive={pathname.startsWith("/release-notes")}
              render={<Link to="/release-notes" />}
              tooltip={m.release_notes_title()}
            >
              <History className="hidden group-data-[collapsible=icon]:block" />
              <span className="flex items-baseline gap-2">
                <span className="font-mono text-muted-foreground text-xs">
                  v{APP_VERSION}
                </span>
                <span className="text-xs">{m.release_notes_title()}</span>
              </span>
            </SidebarMenuButton>
            {unreadReleaseNotes > 0 && (
              <>
                <SidebarMenuBadge
                  aria-hidden
                  className="right-3.5 rounded-full bg-primary font-mono text-2xs text-primary-foreground peer-data-active/menu-button:text-primary-foreground peer-hover/menu-button:text-primary-foreground"
                >
                  {unreadReleaseNotes}
                </SidebarMenuBadge>
                <span
                  aria-hidden
                  className="absolute top-1 right-1 hidden size-1.5 rounded-full bg-primary group-data-[collapsible=icon]:block"
                />
                <span className="sr-only">
                  {m.release_notes_unread_count({
                    count: unreadReleaseNotes,
                  })}
                </span>
              </>
            )}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    className="h-auto rounded-none px-3.5 py-2.75"
                    size="lg"
                  >
                    <Avatar className="size-7.5">
                      <AvatarFallback>{initials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                      <span className="truncate font-medium">{user.name}</span>
                      <span className="truncate text-muted-foreground text-xs">
                        {user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                align="start"
                className="w-59"
                side="top"
                sideOffset={6}
              >
                <div className="mb-1.5 border-b px-3 pt-2.5 pb-3">
                  <div className="text-sm">{user.name}</div>
                  <div className="mt-0.5 text-muted-foreground text-xs">
                    {user.email}
                  </div>
                </div>
                <DropdownMenuItem render={<Link to="/settings" />}>
                  <SlidersHorizontal />
                  {m.account_tax_settings()}
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Download />
                  {m.account_export_data()}
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Database />
                  {m.account_instance_backups()}
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <CircleHelp />
                  {m.account_help_shortcuts()}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="mt-1 border-t not-focus:text-destructive not-focus:*:[svg]:text-destructive"
                  disabled={logout.isPending}
                  onClick={() => logout.mutate({})}
                >
                  <LogOut />
                  {m.account_logout()}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
