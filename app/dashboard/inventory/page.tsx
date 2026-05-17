"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { sampleProducts } from "@/lib/data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatINR } from "@/lib/utils";
import { toast } from "sonner";

type Product = typeof sampleProducts[0];
type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

function getStatus(qty: number): StockStatus {
  if (qty === 0) return "out-of-stock";
  if (qty < 5) return "low-stock";
  return "in-stock";
}

const categories = ["All", "Mobile Accessories", "Computer Accessories", "Cables", "Lighting", "Power", "Batteries"];
const statusTabs = ["All", "In Stock", "Low Stock", "Out of Stock"] as const;

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusTab, setStatusTab] = useState<typeof statusTabs[number]>("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState({ name: "", category: "Mobile Accessories", qty: 0, price: 0 });
  const [editProduct, setEditProduct] = useState<Partial<Product>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    const status = getStatus(p.qty);
    const matchStatus =
      statusTab === "All" ||
      (statusTab === "In Stock" && status === "in-stock") ||
      (statusTab === "Low Stock" && status === "low-stock") ||
      (statusTab === "Out of Stock" && status === "out-of-stock");
    return matchSearch && matchCat && matchStatus;
  });

  const summaryStats = {
    total: products.length,
    lowStock: products.filter((p) => getStatus(p.qty) === "low-stock").length,
    outOfStock: products.filter((p) => getStatus(p.qty) === "out-of-stock").length,
    totalValue: products.reduce((s, p) => s + p.qty * p.price, 0),
  };

  const saveNewProduct = () => {
    if (!newProduct.name) { toast.error("Product name is required"); return; }
    const id = Math.max(...products.map((p) => p.id)) + 1;
    setProducts([...products, { ...newProduct, id }]);
    toast.success("Product added successfully!");
    setIsAddOpen(false);
    setNewProduct({ name: "", category: "Mobile Accessories", qty: 0, price: 0 });
  };

  const saveEdit = (id: number) => {
    setProducts(products.map((p) => p.id === id ? { ...p, ...editProduct } : p));
    toast.success("Product updated!");
    setEditId(null);
    setEditProduct({});
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Product deleted");
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Inventory</h2>
          <p className="text-sm text-slate-500">Manage your product stock levels</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: String(summaryStats.total), color: "text-slate-900" },
          { label: "Low Stock", value: String(summaryStats.lowStock), color: "text-amber-600" },
          { label: "Out of Stock", value: String(summaryStats.outOfStock), color: "text-red-600" },
          { label: "Total Value", value: formatINR(summaryStats.totalValue), color: "text-emerald-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <p className="text-sm text-slate-500 mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 flex-wrap">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="flex gap-1 ml-auto">
            {statusTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusTab === tab ? "bg-indigo-500 text-white" : "text-slate-600 hover:bg-slate-100"
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
              {["Product", "Category", "Qty", "Price", "Total Value", "Status", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((p) => {
              const status = getStatus(p.qty);
              const isEditing = editId === p.id;
              return (
                <tr
                  key={p.id}
                  className={`transition-colors ${
                    status === "low-stock"
                      ? "border-l-2 border-l-amber-400 bg-amber-50/30 hover:bg-amber-50/50"
                      : status === "out-of-stock"
                      ? "border-l-2 border-l-red-400 bg-red-50/30"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-6 py-3.5 text-sm font-medium text-slate-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editProduct.name ?? p.name}
                        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                        className="px-2 py-1 border border-indigo-300 rounded text-sm w-full"
                      />
                    ) : p.name}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{p.category}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-700">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editProduct.qty ?? p.qty}
                        onChange={(e) => setEditProduct({ ...editProduct, qty: Number(e.target.value) })}
                        className="px-2 py-1 border border-indigo-300 rounded text-sm w-16 text-center"
                        min={0}
                      />
                    ) : p.qty}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-700">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editProduct.price ?? p.price}
                        onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                        className="px-2 py-1 border border-indigo-300 rounded text-sm w-24"
                        min={0}
                      />
                    ) : formatINR(p.price)}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-700">
                    {formatINR((editProduct.qty ?? p.qty) * (editProduct.price ?? p.price))}
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEdit(p.id)}
                            className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setEditId(null); setEditProduct({}); }}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditId(p.id); setEditProduct({ name: p.name, qty: p.qty, price: p.price }); }}
                            className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400">No products found</div>}
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Add Product</h3>
              <button onClick={() => setIsAddOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Product Name", field: "name" as const, type: "text", placeholder: "e.g. Samsung 25W Charger" },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={String(newProduct[field])}
                    onChange={(e) => setNewProduct({ ...newProduct, [field]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  {categories.slice(1).map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantity</label>
                  <input
                    type="number"
                    value={newProduct.qty}
                    onChange={(e) => setNewProduct({ ...newProduct, qty: Number(e.target.value) })}
                    min={0}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (₹)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    min={0}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setIsAddOpen(false)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium">Cancel</button>
              <button onClick={saveNewProduct} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium">Add Product</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Product?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium">Cancel</button>
              <button onClick={() => deleteProduct(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
