"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell,
  AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar,
} from "recharts";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import {
  sampleAnalytics, sampleCategoryRadar, sampleKPIRadial, sampleMonthlyGrowth,
} from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Card, CardHeader, CardFooter, CardTitle, CardDescription, CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const monthlyChartConfig = {
  revenue: { label: "Revenue", color: "#6366F1" },
  expenses: { label: "Expenses", color: "#94a3b8" },
} satisfies ChartConfig;

const radarChartConfig = {
  revenue: { label: "Revenue", color: "#6366F1" },
  units: { label: "Units", color: "#10B981" },
  profit: { label: "Profit", color: "#F59E0B" },
} satisfies ChartConfig;

const sparklineConfig = {
  v: { label: "Sales", color: "#6366F1" },
} satisfies ChartConfig;

const growthConfig = {
  revenue: { label: "Revenue", color: "#6366F1" },
  target: { label: "Target", color: "#94a3b8" },
} satisfies ChartConfig;

const sparklineData = sampleAnalytics.dailySales.map((v, i) => ({ day: i + 1, v }));

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Revenue (YTD)</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">₹14,28,000</CardTitle>
            <CardAction><Badge variant="outline"><TrendingUp />YTD</Badge></CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Trending up <TrendingUp className="size-4" /></div>
            <div className="text-muted-foreground">Jan – Jun 2024 cumulative</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">7</CardTitle>
            <CardAction><Badge variant="outline">Active</Badge></CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Active accounts</div>
            <div className="text-muted-foreground">Building customer relationships</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Invoices</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">10</CardTitle>
            <CardAction><Badge variant="outline">All time</Badge></CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Invoice count</div>
            <div className="text-muted-foreground">Across all statuses</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Best Selling Product</CardDescription>
            <CardTitle className="text-xl font-semibold @[250px]/card:text-2xl truncate">Samsung 25W Charger</CardTitle>
            <CardAction><Badge variant="outline"><TrendingUp />Top</Badge></CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">142 units sold <TrendingUp className="size-4" /></div>
            <div className="text-muted-foreground">Mobile Accessories category</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Avg. Invoice Value</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">₹5,990</CardTitle>
            <CardAction><Badge variant="outline">Per invoice</Badge></CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Average order value</div>
            <div className="text-muted-foreground">Based on 10 invoices</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Collection Rate</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">86.5%</CardTitle>
            <CardAction><Badge variant="outline"><TrendingUp />Strong</Badge></CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Of billed amount collected <TrendingUp className="size-4" /></div>
            <div className="text-muted-foreground">Strong collection performance</div>
          </CardFooter>
        </Card>
      </div>

      {/* Row 1: Monthly bar + Category donut */}
      <div className="grid grid-cols-11 gap-4">
        <div className="col-span-6 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <p className="text-lg font-semibold text-slate-900 mb-1">Monthly Revenue vs Expenses</p>
          <p className="text-sm text-slate-500 mb-4">Jan – Jun 2024</p>
          <ChartContainer config={monthlyChartConfig} className="h-60">
            <BarChart data={sampleAnalytics.monthlyRevenue} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="col-span-5 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <p className="text-lg font-semibold text-slate-900 mb-1">Sales by Category</p>
          <p className="text-sm text-slate-500 mb-2">Revenue share %</p>
          <ChartContainer config={{}} className="h-48">
            <PieChart>
              <Pie
                data={sampleAnalytics.categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {sampleAnalytics.categoryBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return (
                    <div className="bg-white border border-slate-100 rounded-lg shadow-lg px-3 py-2 text-xs">
                      <p className="font-semibold text-slate-900">{d?.name}</p>
                      <p className="text-slate-500">{d?.value}%</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ChartContainer>
          <div className="space-y-1.5 mt-1">
            {sampleAnalytics.categoryBreakdown.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="text-slate-600 flex-1">{c.name}</span>
                <span className="font-semibold text-slate-900">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Radar + Radial */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <p className="text-lg font-semibold text-slate-900 mb-1">Category Performance</p>
          <p className="text-sm text-slate-500 mb-4">Revenue, units & profit scores (0–100)</p>
          <ChartContainer config={radarChartConfig} className="h-72">
            <RadarChart data={sampleCategoryRadar} margin={{ top: 8, right: 24, left: 24, bottom: 8 }}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "#64748b" }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Radar dataKey="revenue" name="revenue" stroke="var(--color-revenue)" fill="var(--color-revenue)" fillOpacity={0.2} />
              <Radar dataKey="units" name="units" stroke="var(--color-units)" fill="var(--color-units)" fillOpacity={0.15} />
              <Radar dataKey="profit" name="profit" stroke="var(--color-profit)" fill="var(--color-profit)" fillOpacity={0.15} />
            </RadarChart>
          </ChartContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <p className="text-lg font-semibold text-slate-900 mb-1">Business Health KPIs</p>
          <p className="text-sm text-slate-500 mb-4">Performance indicators out of 100</p>
          <ChartContainer config={{}} className="h-56">
            <RadialBarChart
              data={sampleKPIRadial}
              cx="50%"
              cy="50%"
              innerRadius={28}
              outerRadius={96}
              startAngle={90}
              endAngle={-270}
              barSize={13}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="value"
                cornerRadius={6}
                background={{ fill: "#f1f5f9" }}
              >
                {sampleKPIRadial.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </RadialBar>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return (
                    <div className="bg-white border border-slate-100 rounded-lg shadow-lg px-3 py-2 text-xs">
                      <p className="font-semibold text-slate-900">{d?.name}</p>
                      <p className="text-slate-500">{d?.value}%</p>
                    </div>
                  );
                }}
              />
            </RadialBarChart>
          </ChartContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
            {sampleKPIRadial.map((k) => (
              <div key={k.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: k.fill }} />
                <span className="text-slate-600 flex-1 truncate">{k.name}</span>
                <span className="font-semibold text-slate-900">{k.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product performance table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <p className="text-lg font-semibold text-slate-900">Product Performance</p>
          <p className="text-sm text-slate-500">Top 5 products by revenue</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wide bg-slate-50">
              {["Product", "Units Sold", "Revenue", "Trend"].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sampleAnalytics.topProducts.map((p) => (
              <tr key={p.name} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3.5 text-sm font-medium text-slate-900">{p.name}</td>
                <td className="px-6 py-3.5 text-sm text-slate-700">{p.units}</td>
                <td className="px-6 py-3.5 text-sm font-semibold text-slate-900">{formatINR(p.revenue)}</td>
                <td className="px-6 py-3.5">
                  <div className={`flex items-center gap-1 text-sm font-medium ${p.trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {p.trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {p.trend >= 0 ? "+" : ""}{p.trend}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Row 3: Daily sparkline + Revenue vs target */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <p className="text-lg font-semibold text-slate-900 mb-1">Last 14 Days</p>
          <p className="text-sm text-slate-500 mb-4">Daily sales trend</p>
          <ChartContainer config={sparklineConfig} className="h-24">
            <AreaChart data={sparklineData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-v)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-v)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="var(--color-v)" fill="url(#sparkGrad)" strokeWidth={2} dot={false} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <p className="text-lg font-semibold text-slate-900 mb-1">Revenue vs Target</p>
          <p className="text-sm text-slate-500 mb-4">Monthly performance vs goal</p>
          <ChartContainer config={growthConfig} className="h-24">
            <AreaChart data={sampleMonthlyGrowth} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="url(#analyticsRevGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="target" stroke="var(--color-target)" fill="none" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
