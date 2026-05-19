"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IndianRupee, Clock, Package, Lightbulb, AlertTriangle,
  Receipt, Plus, Sparkles, TrendingUp, TrendingDown,
} from "lucide-react";
import {
  Card, CardHeader, CardFooter, CardTitle, CardDescription, CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, AreaChart, Area, CartesianGrid,
} from "recharts";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { sampleInvoices, sampleAnalytics, sampleMonthlyGrowth } from "@/lib/data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatINR, formatDate } from "@/lib/utils";

const weeklyChartConfig = {
  revenue: { label: "Revenue", color: "#6366F1" },
} satisfies ChartConfig;

const growthChartConfig = {
  revenue: { label: "Revenue", color: "#6366F1" },
  target: { label: "Target", color: "#94a3b8" },
} satisfies ChartConfig;


const lowStockItems = [
  { name: "Samsung Charger 2A", qty: 2 },
  { name: "USB Hub 4-Port", qty: 3 },
  { name: "HDMI Cable 2m", qty: 1 },
];

export default function DashboardPage() {
  const router = useRouter();
  const recentInvoices = sampleInvoices.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">₹2,84,500</CardTitle>
            <CardAction>
              <Badge variant="outline"><TrendingUp />+12.5%</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Trending up this month <TrendingUp className="size-4" /></div>
            <div className="text-muted-foreground">Total revenue for June 2024</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Pending Payments</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">₹38,200</CardTitle>
            <CardAction>
              <Badge variant="outline"><Clock />2 overdue</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">2 invoices are overdue <TrendingDown className="size-4" /></div>
            <div className="text-muted-foreground">Across 5 active invoices</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Products in Stock</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">142 items</CardTitle>
            <CardAction>
              <Badge variant="outline"><AlertTriangle />3 low stock</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">3 products need restocking <Package className="size-4" /></div>
            <div className="text-muted-foreground">Across 10 product SKUs</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Patent Ideas</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">4 ideas</CardTitle>
            <CardAction>
              <Badge variant="outline"><Lightbulb />1 filed</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">1 idea progressed to filed <Lightbulb className="size-4" /></div>
            <div className="text-muted-foreground">Ideas tracked in your vault</div>
          </CardFooter>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-5 gap-4">
        {/* Weekly revenue bar chart */}
        <div className="col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="mb-4">
            <p className="text-lg font-semibold text-slate-900">Revenue This Week</p>
            <p className="text-sm text-slate-500">Daily earnings overview</p>
          </div>
          <ChartContainer config={weeklyChartConfig} className="h-50">
            <BarChart data={sampleAnalytics.weeklyRevenue} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Revenue vs target area chart */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="mb-4">
            <p className="text-lg font-semibold text-slate-900">Revenue vs Target</p>
            <p className="text-sm text-slate-500">6-month performance</p>
          </div>
          <ChartContainer config={growthChartConfig} className="h-50">
            <AreaChart data={sampleMonthlyGrowth} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dashRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dashTgtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-target)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="var(--color-target)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="url(#dashRevGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="target" stroke="var(--color-target)" fill="url(#dashTgtGrad)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ChartContainer>
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

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <p className="text-base font-semibold text-slate-900">Low Stock Alerts</p>
            </div>
            <div className="space-y-2.5">
              {lowStockItems.map(({ name, qty }) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
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
