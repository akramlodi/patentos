"use client";
import { useState } from "react";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, CartesianGrid } from "recharts";
import {
  ChartContainer, ChartTooltip, ChartLegend, ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { sampleInvoices, samplePaymentTrend } from "@/lib/data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatINR, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Card, CardHeader, CardFooter, CardTitle, CardDescription, CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, AlertTriangle } from "lucide-react";

type Invoice = typeof sampleInvoices[0];
const tabs = ["All", "Paid", "Pending", "Overdue"] as const;

const trendConfig = {
  collected: { label: "Collected", color: "#10B981" },
  pending: { label: "Pending", color: "#F59E0B" },
  overdue: { label: "Overdue", color: "#EF4444" },
} satisfies ChartConfig;

const PAYMENT_COLORS = ["#10B981", "#F59E0B", "#EF4444"];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Invoice[]>(sampleInvoices);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("All");

  const totals = {
    collected: payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0),
    pending: payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0),
    overdue: payments.filter((p) => p.status === "overdue").reduce((s, p) => s + p.amount, 0),
  };

  const donutData = [
    { name: "Collected", value: totals.collected },
    { name: "Pending", value: totals.pending },
    { name: "Overdue", value: totals.overdue },
  ];

  const filtered = payments.filter((p) => {
    if (activeTab === "All") return true;
    return p.status === activeTab.toLowerCase();
  });

  const markAsPaid = (id: string) => {
    setPayments(payments.map((p) => p.id === id ? { ...p, status: "paid" } : p));
    toast.success("Payment marked as collected!");
  };

  const sendReminder = (customer: string) => {
    toast.success(`Reminder sent to ${customer}!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Payments</h2>
        <p className="text-sm text-slate-500">Track and manage payment collections</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Collected</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{formatINR(totals.collected)}</CardTitle>
            <CardAction><Badge variant="outline"><TrendingUp />Received</Badge></CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Payments received <TrendingUp className="size-4" /></div>
            <div className="text-muted-foreground">From paid invoices</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{formatINR(totals.pending)}</CardTitle>
            <CardAction><Badge variant="outline"><Clock />Awaiting</Badge></CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Awaiting payment</div>
            <div className="text-muted-foreground">Send reminders if needed</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Overdue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{formatINR(totals.overdue)}</CardTitle>
            <CardAction><Badge variant="outline"><AlertTriangle />Overdue</Badge></CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Past due date <TrendingDown className="size-4" /></div>
            <div className="text-muted-foreground">Send urgent reminders</div>
          </CardFooter>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-5 gap-4">
        {/* Donut: current distribution */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <p className="text-lg font-semibold text-slate-900 mb-1">Payment Distribution</p>
          <p className="text-sm text-slate-500 mb-2">Current split by status</p>
          <ChartContainer config={{}} className="h-44">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={2}
                dataKey="value"
              >
                {donutData.map((_, i) => (
                  <Cell key={i} fill={PAYMENT_COLORS[i]} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return (
                    <div className="bg-white border border-slate-100 rounded-lg shadow-lg px-3 py-2 text-xs">
                      <p className="font-semibold text-slate-900">{d?.name}</p>
                      <p className="text-slate-500">{formatINR(d?.value)}</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ChartContainer>
          <div className="flex justify-center gap-5 mt-1">
            {donutData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PAYMENT_COLORS[i] }} />
                <span className="text-slate-600">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Area: 6-month collection trend */}
        <div className="col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <p className="text-lg font-semibold text-slate-900 mb-1">6-Month Collection Trend</p>
          <p className="text-sm text-slate-500 mb-4">Collected vs pending vs overdue</p>
          <ChartContainer config={trendConfig} className="h-44">
            <AreaChart data={samplePaymentTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="payCollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-collected)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-collected)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="payPendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-pending)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-pending)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <ChartTooltip content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-white border border-slate-100 rounded-lg shadow-lg px-3 py-2 text-xs space-y-1">
                    <p className="font-semibold text-slate-700 mb-1">{label}</p>
                    {payload.map((p) => (
                      <div key={p.dataKey as string} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        <span className="text-slate-500">{trendConfig[p.dataKey as keyof typeof trendConfig]?.label}:</span>
                        <span className="font-medium text-slate-900">{formatINR(p.value as number)}</span>
                      </div>
                    ))}
                  </div>
                );
              }} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area type="monotone" dataKey="collected" stroke="var(--color-collected)" fill="url(#payCollGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="pending" stroke="var(--color-pending)" fill="url(#payPendGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="overdue" stroke="var(--color-overdue)" fill="none" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-indigo-500 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Payment cards */}
      <div className="space-y-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className={`bg-white rounded-xl shadow-sm border p-5 flex items-center gap-4 transition-all ${
              p.status === "overdue" ? "border-red-200" : "border-slate-100"
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-base font-semibold text-slate-900">{p.customer}</p>
                <span className="text-sm text-slate-400 font-mono">{p.id}</span>
              </div>
              <p className="text-sm text-slate-500">
                {p.items[0]}{p.items.length > 1 ? ` +${p.items.length - 1} more` : ""}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {p.status === "paid" ? `Paid on ${formatDate(p.date)}` : `Due: ${formatDate(p.date)}`}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <p className="text-xl font-bold text-slate-900">{formatINR(p.amount)}</p>
              <StatusBadge status={p.status as "paid" | "pending" | "overdue"} />
            </div>

            <div className="flex flex-col gap-2 ml-2">
              {p.status === "overdue" && (
                <button
                  onClick={() => sendReminder(p.customer)}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                >
                  Send Reminder
                </button>
              )}
              {p.status === "pending" && (
                <button
                  onClick={() => markAsPaid(p.id)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-100">
            No payments found
          </div>
        )}
      </div>
    </div>
  );
}
