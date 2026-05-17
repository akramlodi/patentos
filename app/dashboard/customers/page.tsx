"use client";
import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, X } from "lucide-react";
import { sampleCustomers, sampleInvoices } from "@/lib/data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatINR, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type Customer = typeof sampleCustomers[0];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(
    [...sampleCustomers].sort((a, b) => b.spent - a.spent)
  );
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", location: "" });

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  const totals = {
    total: customers.length,
    topCustomer: customers[0]?.name ?? "-",
    totalRevenue: customers.reduce((s, c) => s + c.spent, 0),
    avgSpend: Math.round(customers.reduce((s, c) => s + c.spent, 0) / customers.length),
  };

  const getCustomerInvoices = (name: string) =>
    sampleInvoices.filter((inv) => inv.customer === name).slice(0, 3);

  const saveCustomer = () => {
    if (!form.name) { toast.error("Customer name is required"); return; }
    const newC: Customer = {
      id: customers.length + 1,
      name: form.name,
      phone: form.phone,
      location: form.location,
      orders: 0,
      spent: 0,
      lastPurchase: new Date().toISOString().split("T")[0],
    };
    setCustomers([...customers, newC]);
    toast.success("Customer added successfully!");
    setIsOpen(false);
    setForm({ name: "", phone: "", location: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Customers</h2>
          <p className="text-sm text-slate-500">Manage your customer relationships</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: String(totals.total) },
          { label: "Top Customer", value: totals.topCustomer },
          { label: "Total Revenue", value: formatINR(totals.totalRevenue) },
          { label: "Avg. Spend", value: formatINR(totals.avgSpend) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <p className="text-sm text-slate-500 mb-1">{label}</p>
            <p className="text-xl font-bold text-slate-900 truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wide bg-slate-50">
              {["Name", "Location", "Phone", "Orders", "Total Spent", "Last Purchase", ""].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((c) => (
              <>
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 text-sm font-medium text-slate-900">{c.name}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{c.location}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{c.phone}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-700">{c.orders}</td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-slate-900">{formatINR(c.spent)}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{formatDate(c.lastPurchase)}</td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      View
                      {expandedId === c.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
                {expandedId === c.id && (
                  <tr key={`${c.id}-expand`}>
                    <td colSpan={7} className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Recent Invoices</p>
                      {getCustomerInvoices(c.name).length === 0 ? (
                        <p className="text-sm text-slate-400">No invoices found</p>
                      ) : (
                        <div className="space-y-2">
                          {getCustomerInvoices(c.name).map((inv) => (
                            <div key={inv.id} className="flex items-center gap-4 bg-white rounded-lg px-4 py-2.5 border border-slate-100">
                              <span className="text-sm font-mono text-indigo-600 w-20">{inv.id}</span>
                              <span className="text-sm text-slate-600 flex-1">{inv.items[0]}</span>
                              <span className="text-sm font-semibold text-slate-900">{formatINR(inv.amount)}</span>
                              <StatusBadge status={inv.status as "paid" | "pending" | "overdue"} />
                              <span className="text-xs text-slate-400">{formatDate(inv.date)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400">No customers found</div>}
      </div>

      {/* Add Customer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Add Customer</h3>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { name: "name", label: "Customer Name", placeholder: "e.g. Priya Stores" },
                { name: "phone", label: "Phone Number", placeholder: "9876543210" },
                { name: "location", label: "Location", placeholder: "e.g. Bangalore" },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={form[name as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setIsOpen(false)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium">Cancel</button>
              <button onClick={saveCustomer} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium">Add Customer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
