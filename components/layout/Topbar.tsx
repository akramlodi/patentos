"use client";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const titleMap: Record<string, string> = {
  "/dashboard":            "Dashboard",
  "/dashboard/billing":    "Billing",
  "/dashboard/inventory":  "Inventory",
  "/dashboard/payments":   "Payments",
  "/dashboard/analytics":  "Analytics",
  "/dashboard/insights":   "AI Insights",
  "/dashboard/patents":    "Patent Vault",
  "/dashboard/customers":  "Customers",
  "/dashboard/settings":   "Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const title = titleMap[pathname] ?? "Dashboard";

  const initials = user?.ownerName
    ? user.ownerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "RS";

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
          />
        </div>
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
      </div>
    </header>
  );
}
