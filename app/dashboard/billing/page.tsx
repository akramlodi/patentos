"use client";
import { useState } from "react";
import { Plus, Eye, Download, X, Trash2, ChevronDown, TrendingUp, Clock } from "lucide-react";
import {
  Card, CardHeader, CardFooter, CardTitle, CardDescription, CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore, type Invoice, type InvoiceLineItem } from "@/lib/store-context";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatINR, formatDate } from "@/lib/utils";
import { toast } from "sonner";

const tabs = ["All", "Paid", "Pending", "Overdue"] as const;

export default function BillingPage() {
  const { invoices, setInvoices, products } = useStore();
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("All");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([{ name: "", qty: 1, price: 0 }]);

  const filtered = invoices.filter((inv) => {
    const matchTab = activeTab === "All" || inv.status === activeTab.toLowerCase();
    const matchSearch =
      inv.customer.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totals = {
    all: invoices.length,
    billed: invoices.reduce((s, i) => s + i.amount, 0),
    paid: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0),
    pending: invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0),
  };

  const subtotal = lineItems.reduce((s, i) => s + i.qty * i.price, 0);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  const addLine = () =>
    setLineItems([...lineItems, { name: "", qty: 1, price: 0 }]);

  const removeLine = (idx: number) =>
    setLineItems(lineItems.filter((_, i) => i !== idx));

  const updateLine = (idx: number, field: keyof InvoiceLineItem, value: string | number) =>
    setLineItems(lineItems.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));

  const selectProduct = (idx: number, productName: string) => {
    const product = products.find((p) => p.name === productName);
    setLineItems(
      lineItems.map((item, i) =>
        i === idx
          ? { ...item, name: productName, price: product?.price ?? item.price }
          : item
      )
    );
  };

  const resetModal = () => {
    setCustomer("");
    setLineItems([{ name: "", qty: 1, price: 0 }]);
    setIsOpen(false);
  };

  const saveInvoice = () => {
    if (!customer.trim()) {
      toast.error("Customer name is required");
      return;
    }
    if (lineItems.some((i) => !i.name)) {
      toast.error("Select a product for every line item");
      return;
    }
    const id = `INV-${String(invoices.length + 1).padStart(3, "0")}`;
    const newInv: Invoice = {
      id,
      customer,
      items: lineItems.map((i) => `${i.name} x${i.qty}`),
      lineItems,
      amount: Math.round(grandTotal),
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    };
    setInvoices([newInv, ...invoices]);
    toast.success(`Invoice ${id} created!`);
    resetModal();
  };

  const handleDownload = async (inv: Invoice) => {
    const loadingToast = toast.loading(`Generating ${inv.id}...`);
    try {
      const { downloadInvoicePDF } = await import("@/lib/pdf");
      await downloadInvoicePDF(inv);
      toast.dismiss(loadingToast);
      toast.success(`${inv.id} downloaded!`);
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Failed to generate PDF");
    }
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
      <div className="grid grid-cols-4 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Invoices</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{String(totals.all)}</CardTitle>
            <CardAction><Badge variant="outline">All time</Badge></CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Invoice record count</div>
            <div className="text-muted-foreground">Across all statuses</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Billed</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{formatINR(totals.billed)}</CardTitle>
            <CardAction><Badge variant="outline">Gross</Badge></CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Total amount invoiced</div>
            <div className="text-muted-foreground">Includes all invoices</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Collected</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{formatINR(totals.paid)}</CardTitle>
            <CardAction><Badge variant="outline"><TrendingUp />Paid</Badge></CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Payments collected <TrendingUp className="size-4" /></div>
            <div className="text-muted-foreground">From paid invoices</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Outstanding</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{formatINR(totals.pending)}</CardTitle>
            <CardAction><Badge variant="outline"><Clock />Due</Badge></CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Awaiting collection</div>
            <div className="text-muted-foreground">Pending + overdue amounts</div>
          </CardFooter>
        </Card>
      </div>

      {/* Filters + Table */}
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
                  {inv.items[0]}
                  {inv.items.length > 1 ? ` +${inv.items.length - 1} more` : ""}
                </td>
                <td className="px-6 py-3.5 text-sm font-medium text-slate-900">
                  {formatINR(inv.amount)}
                </td>
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
                      onClick={() => handleDownload(inv)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                      title="Download PDF"
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
          <div className="fixed inset-0 bg-black/50" onClick={resetModal} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Create Invoice</h3>
              <button onClick={resetModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="e.g. Priya Stores"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Line Items</label>
                  <span className="text-xs text-slate-400">
                    {products.length} products available
                  </span>
                </div>

                {/* Column headers */}
                <div className="grid grid-cols-[1fr_64px_80px_80px_24px] gap-2 mb-1.5 px-1">
                  {["Product", "Qty", "Price", "Total", ""].map((h) => (
                    <span key={h} className="text-xs text-slate-400 font-medium">{h}</span>
                  ))}
                </div>

                <div className="space-y-2">
                  {lineItems.map((item, idx) => {
                    const lineTotal = item.qty * item.price;
                    return (
                      <div key={idx} className="grid grid-cols-[1fr_64px_80px_80px_24px] gap-2 items-center">
                        {/* Product select */}
                        <div className="relative">
                          <select
                            value={item.name}
                            onChange={(e) => selectProduct(idx, e.target.value)}
                            className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white pr-8 text-slate-800"
                          >
                            <option value="">Select product…</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.name} disabled={p.qty === 0}>
                                {p.name}
                                {p.qty === 0 ? " (Out of stock)" : p.qty < 5 ? ` (${p.qty} left)` : ""}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Qty */}
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateLine(idx, "qty", Math.max(1, Number(e.target.value)))}
                          min={1}
                          className="px-2 py-2 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />

                        {/* Price (auto-filled, editable) */}
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateLine(idx, "price", Number(e.target.value))}
                          min={0}
                          className="px-2 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />

                        {/* Row total */}
                        <span className="text-xs font-medium text-slate-600 text-right">
                          {lineTotal > 0 ? formatINR(lineTotal) : "—"}
                        </span>

                        {/* Remove */}
                        {lineItems.length > 1 ? (
                          <button
                            onClick={() => removeLine(idx)}
                            className="text-slate-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span />
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={addLine}
                  className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add item
                </button>
              </div>

              {/* Totals */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>GST (18%)</span>
                  <span>{formatINR(gst)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-indigo-600">{formatINR(grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={resetModal}
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
