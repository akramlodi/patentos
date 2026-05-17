"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Receipt, Package, CreditCard, BarChart2,
  Sparkles, Lightbulb, Users, Settings, Zap, LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",   href: "/dashboard" },
  { icon: Receipt,         label: "Billing",      href: "/dashboard/billing" },
  { icon: Package,         label: "Inventory",    href: "/dashboard/inventory" },
  { icon: CreditCard,      label: "Payments",     href: "/dashboard/payments" },
  { icon: BarChart2,       label: "Analytics",    href: "/dashboard/analytics" },
  { icon: Sparkles,        label: "AI Insights",  href: "/dashboard/insights", ai: true },
  { icon: Lightbulb,       label: "Patents",      href: "/dashboard/patents" },
  { icon: Users,           label: "Customers",    href: "/dashboard/customers" },
  { icon: Settings,        label: "Settings",     href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.ownerName
    ? user.ownerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "RS";

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-slate-900 flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">Patentos</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href, ai }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "border-l-2 border-indigo-500 bg-indigo-500/10 text-white pl-[10px]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {ai && (
                <span className="text-[10px] bg-indigo-500 text-white rounded px-1.5 py-0.5 font-semibold">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">
              {user?.businessName ?? "Sharma Electronics"}
            </p>
            <p className="text-slate-500 text-[11px] truncate">
              {user?.email ?? "demo@paytent.in"}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-slate-400 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
