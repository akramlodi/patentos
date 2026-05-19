"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, X, Lightbulb, Search, FileText, Send, ArrowRight, Sparkles } from "lucide-react";
import { samplePatents } from "@/lib/data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

type Patent = typeof samplePatents[0];
type PatentStatus = "idea" | "research" | "draft" | "filed";

const stages: { status: PatentStatus; label: string; icon: string }[] = [
  { status: "idea", label: "Idea", icon: "💡" },
  { status: "research", label: "Research", icon: "🔍" },
  { status: "draft", label: "Draft", icon: "📝" },
  { status: "filed", label: "Filed", icon: "📬" },
];

const stageColors: Record<PatentStatus, string> = {
  idea:     "bg-slate-100 text-slate-600",
  research: "bg-blue-100 text-blue-700",
  draft:    "bg-amber-100 text-amber-700",
  filed:    "bg-indigo-100 text-indigo-700",
};

export default function PatentsPage() {
  const [patents, setPatents] = useState<Patent[]>(samplePatents);
  const [activeFilter, setActiveFilter] = useState<PatentStatus | "all">("all");
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", status: "idea" as PatentStatus, tags: "" });

  const displayPatents = activeFilter === "all" ? patents : patents.filter((p) => p.status === activeFilter);

  const updateStatus = (id: number, status: string) => {
    setPatents(patents.map((p) => p.id === id ? { ...p, status } : p));
    toast.success("Patent status updated!");
  };

  const savePatent = () => {
    if (!form.title) { toast.error("Title is required"); return; }
    const newPatent: Patent = {
      id: patents.length + 1,
      title: form.title,
      description: form.description,
      status: form.status,
      date: new Date().toISOString().split("T")[0],
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    setPatents([newPatent, ...patents]);
    toast.success("Patent idea saved to vault!");
    setIsOpen(false);
    setForm({ title: "", description: "", status: "idea", tags: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Patent Vault</h2>
          <p className="text-sm text-slate-500">Track and protect your business ideas</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Idea
        </button>
      </div>

      {/* AI Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-indigo-800 text-sm">
        <div className="flex items-start gap-4">
          <div className="text-xl shrink-0">🤖</div>
          <div className="flex-1">
            <p className="font-semibold mb-1">AI Suggestion</p>
            <p className="leading-relaxed">
              Based on current market trends, AI-based billing automation and vernacular voice assistants are
              gaining strong traction in MSME tech. Your &quot;AI Billing Bot&quot; idea aligns with emerging patent filings.
              Run a full prior art search before drafting.
            </p>
          </div>
          <Link
            href="/dashboard/patents/process"
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors shrink-0 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Start Filing Process
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Status pipeline */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setActiveFilter("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === "all"
              ? "bg-slate-800 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <span>All</span>
          <span className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">
            {patents.length}
          </span>
        </button>
        {stages.map(({ status, label, icon }) => {
          const count = patents.filter((p) => p.status === status).length;
          const isActive = activeFilter === status;
          return (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${stageColors[status]} ${
                isActive ? "ring-2 ring-offset-1 ring-current" : "hover:opacity-80"
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
              <span className="w-5 h-5 rounded-full bg-white/60 flex items-center justify-center text-xs font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Patent cards grid */}
      <div className="grid grid-cols-3 gap-4">
        {displayPatents.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-100">
            No patents in this stage yet.
          </div>
        )}
        {displayPatents.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
              </div>
              <StatusBadge status={p.status as PatentStatus} />
            </div>

            <h3 className="text-base font-semibold text-slate-900 mb-2">{p.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">{p.description}</p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {p.tags.map((tag) => (
                <span key={tag} className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">{tag}</span>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">{formatDate(p.date)}</span>
              <select
                value={p.status}
                onChange={(e) => updateStatus(p.id, e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white text-slate-600 cursor-pointer"
              >
                {stages.map((s) => (
                  <option key={s.status} value={s.status}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add Patent Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Add Patent Idea</h3>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Smart Billing Assistant"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your idea..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as PatentStatus })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  {stages.map((s) => <option key={s.status} value={s.status}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="AI, Billing, Automation"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setIsOpen(false)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium">Cancel</button>
              <button onClick={savePatent} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium">Save Idea</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
