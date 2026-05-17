"use client";
import { useState } from "react";
import { Plus, Eye, Download, X, Trash2 } from "lucide-react";
import { sampleInvoices } from "@/lib/data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatINR, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type Invoice = typeof sampleInvoices[0];
type InvoiceItem = { name: string; qty: number; price: number };

const tabs = ["All", "Paid", "Pending", "Overdue"] as const;

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("All");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([{ name: "", qty: 1, price: 0 }]);

  const filtered = invoices.filter((inv) => {
    const matchTab = activeTab === "All" || inv.status === activeTab.toLowerCase();
    const matchSearch = inv.customer.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totals = {
    all: invoices.length,
    billed: invoices.reduce((s, i) => s + i.amount, 0),
    paid: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0),
    pending: invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0),
  };

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  const addItem = () => setItems([...items, { name: "", qty: 1, price: 0 }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof InvoiceItem, value: string | number) =>
    setItems(items.map((item, i) => i === idx ? { ...item, [field]: value } : item));

  const saveInvoice = () => {
    if (!customer || items.some((i) => !i.name)) {
      toast.error("Please fill in all fields");
      return;
    }
    const id = `INV-0${String(invoices.length + 1).padStart(2, "0")}`;
    const newInv: Invoice = {
      id,
      customer,
      items: items.map((i) => `${i.name} x${i.qty}`),
      amount: grandTotal,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    };
    setInvoices([newInv, ...invoices]);
    toast.success(`Invoice ${id} created successfully!`);
    setIsOpen(false);
    setCustomer("");
    setItems([{ name: "", qty: 1, price: 0 }]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Billing</h2>
          <p className="text-sm text-slate-500">Manage your invoices and payments</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Invoices", value: String(totals.all), color: "text-slate-900" },
          { label: "Total Billed", value: formatINR(totals.billed), color: "text-slate-900" },
          { label: "Collected", value: formatINR(totals.paid), color: "text-emerald-600" },
          { label: "Outstanding", value: formatINR(totals.pending), color: "text-amber-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <p className="text-sm text-slate-500 mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100">
          <input
            type="text"
            placeholder="Search by customer or invoice #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
          />
          <div className="flex gap-1 ml-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-indigo-500 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wide bg-slate-50">
              {["Invoice #", "Customer", "Items", "Amount", "Status", "Date", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3.5 text-sm font-medium text-indigo-600">{inv.id}</td>
                <td className="px-6 py-3.5 text-sm text-slate-900">{inv.customer}</td>
                <td className="px-6 py-3.5 text-sm text-slate-500">
                  {inv.items[0]}{inv.items.length > 1 ? ` +${inv.items.length - 1} more` : ""}
                </td>
                <td className="px-6 py-3.5 text-sm font-medium text-slate-900">{formatINR(inv.amount)}</td>
                <td className="px-6 py-3.5">
                  <StatusBadge status={inv.status as "paid" | "pending" | "overdue"} />
                </td>
                <td className="px-6 py-3.5 text-sm text-slate-500">{formatDate(inv.date)}</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toast.info(`Viewing ${inv.id}`)}
                      className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toast.success(`Downloading ${inv.id}...`)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">No invoices found</div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Create Invoice</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Customer Name</label>
                <input
                  type="text"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="e.g. Priya Stores"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Line Items</label>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(idx, "name", e.target.value)}
                        placeholder="Product name"
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateItem(idx, "qty", Number(e.target.value))}
                        placeholder="Qty"
                        className="w-16 px-2 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-center"
                        min={1}
                      />
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(idx, "price", Number(e.target.value))}
                        placeholder="Price"
                        className="w-24 px-2 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        min={0}
                      />
                      <span className="text-sm text-slate-500 w-20 text-right shrink-0">
                        {formatINR(item.qty * item.price)}
                      </span>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(idx)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addItem}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
              </div>

              {/* Totals */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>GST (18%)</span>
                  <span>{formatINR(gst)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span>{formatINR(grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveInvoice}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
              >
                Save Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
