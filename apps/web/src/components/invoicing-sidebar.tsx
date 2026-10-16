import { showInvoiceSummaryOptions } from "@opusline/api-client/react-query";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ArrowLeft,
  FilePen,
  FileUp,
  PanelLeft,
  Plus,
  ReceiptText,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import { type ReactNode, useEffect } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

/**
 * The Facturation section's own navigation, standing in for the app sidebar
 * on every `/invoicing` screen — the design treats invoicing as an app of its
 * own, with a way back out.
 */
export function InvoicingSidebar({ toolbar }: { toolbar?: ReactNode }) {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const format = useMoneyFormat();
  const summary = useQuery(showInvoiceSummaryOptions());
  const toCollect = summary.data?.toCollect;
  const late = summary.data?.overdue.count ?? 0;
  const openCount = toCollect?.count ?? 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: a navigation is the signal.
  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center">
          <SidebarMenuButton
            render={<Link to="/invoicing/invoices" />}
            size="lg"
          >
            <img alt="" className="size-6 rounded" src="/logo.svg" />
            <span className="flex flex-col leading-tight">
              <span className="flex items-center gap-2">
                <span className="font-heading font-semibold text-lg">
                  {m.invoicing_section_title()}
                </span>
                <Badge data-testid="invoicing-beta" variant="brand">
                  {m.beta_badge()}
                </Badge>
              </span>
              <span className="text-muted-foreground text-xs">Opusline</span>
            </span>
          </SidebarMenuButton>
          {isMobile ? toolbar : null}
          <button
            aria-label={m.sidebar_collapse_menu()}
            className="flex size-8 flex-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden"
            onClick={toggleSidebar}
            title={m.sidebar_collapse()}
            type="button"
          >
            <PanelLeft aria-hidden className="size-4" />
          </button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                className="mt-2 w-full group-data-[collapsible=icon]:hidden"
                data-testid="invoicing-new"
                size="lg"
              >
                <Plus data-icon="inline-start" />
                {m.invoicing_new()}
              </Button>
            }
          />
          <NewMenuContent />
        </DropdownMenu>
        <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    data-testid="invoicing-new-collapsed"
                    tooltip={m.invoicing_new()}
                  >
                    <Plus />
                    <span>{m.invoicing_new()}</span>
                  </SidebarMenuButton>
                }
              />
              <NewMenuContent side="right" />
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  data-route="/invoicing/invoices"
                  data-testid="invoicing-nav-link"
                  isActive={pathname.startsWith("/invoicing/invoices")}
                  render={<Link to="/invoicing/invoices" />}
                  tooltip={m.nav_invoices()}
                >
                  <ReceiptText />
                  {/* The count sits inside the label: collapsed to icons, the
                      sidebar hides an item's last span, which must be the label. */}
                  <span>
                    {m.nav_invoices()}
                    {openCount === 0 ? null : (
                      <>
                        {" "}
                        <span className="sr-only">
                          {m.invoicing_open_invoices({ count: openCount })}
                        </span>
                      </>
                    )}
                  </span>
                </SidebarMenuButton>
                {openCount === 0 ? null : (
                  <SidebarMenuBadge aria-hidden className="font-mono text-xs">
                    {openCount}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  data-route="/invoicing/catalog"
                  data-testid="invoicing-nav-link"
                  isActive={pathname.startsWith("/invoicing/catalog")}
                  render={<Link to="/invoicing/catalog" />}
                  tooltip={m.invoicing_nav_catalog()}
                >
                  <Tag />
                  <span>{m.invoicing_nav_catalog()}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  data-route="/invoicing/settings"
                  data-testid="invoicing-nav-link"
                  isActive={pathname.startsWith("/invoicing/settings")}
                  render={<Link to="/invoicing/settings" />}
                  tooltip={m.invoicing_nav_settings()}
                >
                  <SlidersHorizontal />
                  <span>{m.invoicing_nav_settings()}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto pb-3 group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent>
            <Link
              className="block rounded-lg border border-primary/30 bg-primary/10 px-3.5 py-3 transition-colors hover:bg-primary/15"
              data-testid="invoicing-to-collect"
              data-open={openCount}
              data-late={late}
              to="/invoicing/invoices"
            >
              <div className="font-medium text-primary-text text-xs uppercase tracking-wider-2">
                {m.invoicing_to_collect()}
              </div>
              <div className="mt-2 font-mono text-2xl text-ring leading-none tabular-nums">
                {toCollect === undefined
                  ? "—"
                  : formatWholeAmount(format, toCollect.amount.amount)}
              </div>
              <div className="mt-1.5 text-muted-foreground text-xs">
                {late === 0
                  ? m.invoicing_open_invoices({ count: openCount })
                  : m.invoicing_open_invoices_late({
                      count: openCount,
                      late: String(late),
                    })}
              </div>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              data-testid="invoicing-exit"
              render={<Link to="/week" />}
              tooltip={m.invoicing_exit()}
            >
              <ArrowLeft />
              <span>{m.invoicing_exit()}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function NewMenuContent({ side }: { side?: "right" }) {
  const { setOpenMobile } = useSidebar();
  // Opening the dialog from the list only changes the search, which the
  // pathname effect above does not see, so the item closes the sheet itself.
  const closeMobileSidebar = () => setOpenMobile(false);

  return (
    <DropdownMenuContent
      align="start"
      className="w-64"
      side={side}
      sideOffset={6}
    >
      <DropdownMenuItem
        data-testid="invoicing-new-item"
        data-kind="invoice"
        render={<Link to="/invoicing/invoices/new" />}
      >
        <FilePen />
        <span className="flex flex-col">
          <span>{m.invoicing_new_invoice()}</span>
          <span className="text-muted-foreground text-xs">
            {m.invoicing_new_invoice_detail()}
          </span>
        </span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        data-testid="invoicing-new-item"
        data-kind="external-invoice"
        onClick={closeMobileSidebar}
        render={<Link search={{ add: "external" }} to="/invoicing/invoices" />}
      >
        <FileUp />
        <span className="flex flex-col">
          <span>{m.invoicing_new_external_invoice()}</span>
          <span className="text-muted-foreground text-xs">
            {m.invoicing_new_external_invoice_detail()}
          </span>
        </span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
