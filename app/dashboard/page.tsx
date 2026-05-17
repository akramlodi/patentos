"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IndianRupee, Clock, Package, Lightbulb, TrendingUp, AlertTriangle,
  Receipt, Plus, Sparkles,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";
import { sampleInvoices, sampleAnalytics } from "@/lib/data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatINR, formatDate } from "@/lib/utils";

const statCards = [
  {
    label: "Total Revenue",
    value: "₹2,84,500",
    sub: "Total this month",
    trend: "+12.5% ↑",
    trendColor: "text-emerald-600",
    icon: IndianRupee,
    iconBg: "bg-indigo-100 text-indigo-600",
  },
  {
    label: "Pending Payments",
    value: "₹38,200",
    sub: "Across 5 invoices",
    trend: "2 overdue",
    trendColor: "text-red-500",
    icon: Clock,
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    label: "Products in Stock",
    value: "142 items",
    sub: "Across 10 products",
    trend: "⚠ 3 low stock",
    trendColor: "text-amber-600",
    icon: Package,
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Patent Ideas",
    value: "4 ideas",
    sub: "Tracked in vault",
    trend: "1 filed",
    trendColor: "text-indigo-600",
    icon: Lightbulb,
    iconBg: "bg-purple-100 text-purple-600",
  },
];

const lowStockItems = [
  { name: "Samsung Charger 2A", qty: 2 },
  { name: "USB Hub 4-Port", qty: 3 },
  { name: "HDMI Cable 2m", qty: 1 },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-lg shadow-lg px-3 py-2 text-sm">
        <p className="text-slate-500 text-xs">{label}</p>
        <p className="font-semibold text-slate-900">{formatINR(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export default function DashboardPage() {
  const router = useRouter();
  const recentInvoices = sampleInvoices.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, trend, trendColor, icon: Icon, iconBg }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
            <p className="text-xs text-slate-400">{sub}</p>
            <p className={`text-xs font-medium mt-2 ${trendColor}`}>{trend}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-5 gap-4">
        {/* Weekly revenue bar chart */}
        <div className="col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="mb-4">
            <p className="text-lg font-semibold text-slate-900">Revenue This Week</p>
            <p className="text-sm text-slate-500">Daily earnings overview</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sampleAnalytics.weeklyRevenue}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 6-month line chart */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="mb-4">
            <p className="text-lg font-semibold text-slate-900">6-Month Overview</p>
            <p className="text-sm text-slate-500">Revenue vs Expenses</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sampleAnalytics.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis hide />
              <Tooltip formatter={(v) => formatINR(Number(v))} />
              <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expenses" stroke="#E2E8F0" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Recent invoices */}
        <div className="col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <p className="text-lg font-semibold text-slate-900">Recent Invoices</p>
            <Link href="/dashboard/billing" className="text-sm text-indigo-600 hover:underline font-medium">
              View All
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wide bg-slate-50">
                <th className="px-6 py-3 text-left font-medium">Customer</th>
                <th className="px-6 py-3 text-left font-medium">Amount</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 text-sm font-medium text-slate-900">{inv.customer}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-700">{formatINR(inv.amount)}</td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={inv.status as "paid" | "pending" | "overdue"} />
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{formatDate(inv.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick actions + low stock */}
        <div className="col-span-2 space-y-4">
          {/* Quick actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <p className="text-lg font-semibold text-slate-900 mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Receipt, label: "New Invoice", onClick: () => router.push("/dashboard/billing") },
                { icon: Plus, label: "Add Product", onClick: () => router.push("/dashboard/inventory") },
                { icon: Sparkles, label: "AI Insights", onClick: () => router.push("/dashboard/insights") },
                { icon: Lightbulb, label: "Patent Idea", onClick: () => router.push("/dashboard/patents") },
              ].map(({ icon: Icon, label, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-slate-700 hover:text-indigo-600"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Low stock */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <p className="text-base font-semibold text-slate-900">Low Stock Alerts</p>
            </div>
            <div className="space-y-2.5">
              {lowStockItems.map(({ name, qty }) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{name}</span>
                  </div>
                  <span className="text-xs font-medium text-amber-600">{qty} units</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
