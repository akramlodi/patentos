"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Receipt, Package, CreditCard, BarChart2,
  Sparkles, Lightbulb, Users, Settings, Zap, LogOut,
} from "lucide-react";
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
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",  href: "/dashboard" },
  { icon: Receipt,         label: "Billing",     href: "/dashboard/billing" },
  { icon: Package,         label: "Inventory",   href: "/dashboard/inventory" },
  { icon: CreditCard,      label: "Payments",    href: "/dashboard/payments" },
  { icon: BarChart2,       label: "Analytics",   href: "/dashboard/analytics" },
  { icon: Sparkles,        label: "AI Insights", href: "/dashboard/insights", ai: true },
  { icon: Lightbulb,       label: "Patents",     href: "/dashboard/patents" },
  { icon: Users,           label: "Customers",   href: "/dashboard/customers" },
  { icon: Settings,        label: "Settings",    href: "/dashboard/settings" },
];

function UserFooter() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const initials = user?.ownerName
    ? user.ownerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "RS";

  return (
    <div className="flex items-center gap-2.5 px-2 py-1">
      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
        <span className="text-white text-xs font-bold">{initials}</span>
      </div>
      {!collapsed && (
        <div className="flex-1 min-w-0">
          <p className="text-sidebar-accent-foreground text-xs font-semibold truncate leading-tight">
            {user?.businessName ?? "Sharma Electronics"}
          </p>
          <p className="text-sidebar-foreground/60 text-[11px] truncate leading-tight mt-0.5">
            {user?.email ?? "demo@paytent.in"}
          </p>
        </div>
      )}
      {!collapsed && (
        <button
          onClick={logout}
          className="p-1.5 text-sidebar-foreground/50 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent rounded-md transition-colors shrink-0"
          title="Logout"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      {/* Header — Logo */}
      <SidebarHeader className="border-b border-sidebar-border px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="hover:bg-transparent data-active:bg-transparent"
              tooltip="Patentos"
            >
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-sidebar-accent-foreground font-bold text-base tracking-tight">
                  Patentos
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ icon: Icon, label, href, ai }) => {
                const isActive =
                  pathname === href ||
                  (href !== "/dashboard" && pathname.startsWith(href));

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={label}
                      className="text-sidebar-foreground"
                    >
                      <Link href={href}>
                        <Icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {ai && (
                      <SidebarMenuBadge className="bg-indigo-500/20 text-indigo-400 text-[9px] font-bold group-data-[collapsible=icon]:hidden">
                        AI
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — User */}
      <SidebarFooter className="border-t border-sidebar-border px-0 py-3">
        <UserFooter />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
