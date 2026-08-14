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
  LogOut,
  PanelLeft,
  ReceiptText,
  SlidersHorizontal,
  Users,
} from "lucide-react";

import { initials } from "@/lib/initials";

export function AppSidebar() {
  const { pathname } = useLocation();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useSuspenseQuery(currentUserOptions());

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
            aria-label="Réduire le menu"
            onClick={toggleSidebar}
            title="Réduire"
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
                  isActive={pathname.startsWith("/semaine")}
                  render={<Link to="/semaine" />}
                  tooltip="Semaine"
                >
                  <CalendarDays />
                  <span>Semaine</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/clients")}
                  render={<Link to="/clients" />}
                  tooltip="Clients"
                >
                  <Users />
                  <span>Clients</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/cra")}
                  render={<Link to="/cra" />}
                  tooltip="CRA"
                >
                  <FileCheck />
                  <span>CRA</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/factures")}
                  render={<Link to="/factures" />}
                  tooltip="Factures"
                >
                  <ReceiptText />
                  <span>Factures</span>
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
                      isActive={pathname.startsWith("/revenus")}
                      render={<Link to="/revenus" />}
                      tooltip="Revenus"
                    >
                      <ChartLine />
                      <span>Revenus</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname.startsWith("/virement")}
                      render={<Link to="/virement" />}
                      tooltip="Virement"
                    >
                      <CreditCard />
                      <span>Virement</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname.startsWith("/echeances")}
                      render={<Link to="/echeances" />}
                      tooltip="Échéances"
                    >
                      <Bell />
                      <span>Échéances</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname.startsWith("/declarations")}
                      render={<Link to="/declarations" />}
                      tooltip="Déclarations"
                    >
                      <ClipboardList />
                      <span>Déclarations</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/reglages")}
                  render={<Link to="/reglages" />}
                  tooltip="Réglages"
                >
                  <SlidersHorizontal />
                  <span>Réglages</span>
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
                to="/virement"
              >
                {/*
                No treasury endpoint exists yet — the figure arrives with the
                Trésorerie screen. A dash keeps the tile honest until then.
              */}
                <div className="font-medium text-ring/70 text-xs uppercase tracking-wider-2">
                  Virable en sécurité
                </div>
                <div className="mt-2 font-mono text-2xl text-ring leading-none tabular-nums">
                  —
                </div>
                <div className="mt-1.5 text-muted-foreground text-xs">
                  provisions déduites
                </div>
              </Link>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border border-t p-0 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
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
                <DropdownMenuItem render={<Link to="/reglages" />}>
                  <SlidersHorizontal />
                  Réglages fiscaux
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Download />
                  Exporter mes données
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Database />
                  Instance et sauvegardes
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <CircleHelp />
                  Aide et raccourcis
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="mt-1 border-t not-focus:text-destructive not-focus:*:[svg]:text-destructive"
                  disabled={logout.isPending}
                  onClick={() => logout.mutate({})}
                >
                  <LogOut />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
