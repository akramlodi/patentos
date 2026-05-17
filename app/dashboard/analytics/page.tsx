"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { sampleAnalytics } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

const kpiCards = [
  { label: "Total Revenue (YTD)", value: "₹14,28,000", sub: "Jan – Jun 2024" },
  { label: "Total Customers", value: "7", sub: "Active accounts" },
  { label: "Total Invoices", value: "10", sub: "All time" },
  { label: "Best Selling Product", value: "Samsung 25W Charger", sub: "142 units sold" },
  { label: "Avg. Invoice Value", value: "₹5,990", sub: "Per invoice" },
  { label: "Collection Rate", value: "86.5%", sub: "Of billed amount" },
];

const sparklineData = sampleAnalytics.dailySales.map((v, i) => ({ day: i + 1, v }));

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="text-slate-500 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="font-semibold" style={{ color: p.name === "revenue" ? "#6366F1" : "#94a3b8" }}>
            {p.name === "revenue" ? "Revenue" : "Expenses"}: {formatINR(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        {kpiCards.map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <p className="text-sm text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-900 truncate">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-11 gap-4">
        {/* Monthly Revenue vs Expenses */}
        <div className="col-span-6 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <p className="text-lg font-semibold text-slate-900 mb-1">Monthly Revenue vs Expenses</p>
          <p className="text-sm text-slate-500 mb-4">Jan – Jun 2024</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sampleAnalytics.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis hide />
              <Tooltip content={<BarTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-slate-500 capitalize">{value === "revenue" ? "Revenue" : "Expenses"}</span>
                )}
              />
              <Bar dataKey="revenue" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category donut */}
        <div className="col-span-5 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <p className="text-lg font-semibold text-slate-900 mb-1">Sales by Category</p>
          <p className="text-sm text-slate-500 mb-4">Revenue share</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sampleAnalytics.categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {sampleAnalytics.categoryBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {sampleAnalytics.categoryBreakdown.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <span className="text-slate-600 flex-1">{c.name}</span>
                <span className="font-semibold text-slate-900">{c.value}%</span>
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

      {/* Daily sales sparkline */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <p className="text-lg font-semibold text-slate-900 mb-1">Last 14 Days</p>
        <p className="text-sm text-slate-500 mb-4">Daily sales trend</p>
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={sparklineData}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Line type="monotone" dataKey="v" stroke="#6366F1" strokeWidth={2} dot={false} />
            <Tooltip formatter={(v) => formatINR(Number(v))} labelFormatter={() => ""} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
