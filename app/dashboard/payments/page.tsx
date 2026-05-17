"use client";
import { useState } from "react";
import { sampleInvoices } from "@/lib/data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatINR, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type Invoice = typeof sampleInvoices[0];
const tabs = ["All", "Paid", "Pending", "Overdue"] as const;

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Invoice[]>(sampleInvoices);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("All");

  const totals = {
    collected: payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0),
    pending: payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0),
    overdue: payments.filter((p) => p.status === "overdue").reduce((s, p) => s + p.amount, 0),
  };

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

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Collected", value: formatINR(totals.collected), color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
          { label: "Pending", value: formatINR(totals.pending), color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
          { label: "Overdue", value: formatINR(totals.overdue), color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-xl p-5`}>
            <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
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

      {/* Payment Cards */}
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
