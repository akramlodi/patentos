"use client";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, TrendingUp, AlertTriangle, Crown, AlertCircle, Lightbulb } from "lucide-react";
import { toast } from "sonner";

type Message = { role: "user" | "ai"; content: string };

const insightCards = [
  {
    icon: TrendingUp,
    title: "Revenue Up 📈",
    border: "border-l-emerald-400",
    bg: "bg-emerald-50",
    content:
      "Sales have grown 12.5% this month compared to May. Your Friday and Saturday numbers are especially strong.",
  },
  {
    icon: AlertTriangle,
    title: "Stock Alert ⚠️",
    border: "border-l-amber-400",
    bg: "bg-amber-50",
    content:
      "3 products are running low: Samsung Charger (2), USB Hub (3), HDMI Cable (1). Consider restocking before the weekend rush.",
  },
  {
    icon: Crown,
    title: "Top Customer 👑",
    border: "border-l-indigo-400",
    bg: "bg-indigo-50",
    content:
      "Kumar Traders is your best customer this month — ₹11,500 in purchases. Consider offering them a loyalty discount.",
  },
  {
    icon: AlertCircle,
    title: "Overdue Alert 🔴",
    border: "border-l-red-400",
    bg: "bg-red-50",
    content:
      "Ravi Electronics has ₹8,900 overdue since June 5. A payment reminder has not been sent yet.",
  },
  {
    icon: Lightbulb,
    title: "Tip 💡",
    border: "border-l-purple-400",
    bg: "bg-purple-50",
    content:
      "Your weekend sales are 35% higher. Try running promotions on Thursdays to build momentum earlier.",
  },
];

const starterPrompts = [
  "How can I improve my sales this month?",
  "Which products should I restock first?",
  "Tips to collect overdue payments?",
  "What's my strongest sales category?",
];

export default function InsightsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.response ?? "No response received." }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "AI service unavailable. Please check your API key in .env.local",
        },
      ]);
      toast.error("Failed to reach AI service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left panel — insights */}
      <div className="w-[38%] flex flex-col gap-3 overflow-y-auto">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-semibold text-slate-900">Business Snapshot</h2>
        </div>
        {insightCards.map(({ icon: Icon, title, border, bg, content }) => (
          <div key={title} className={`${bg} border-l-4 ${border} rounded-r-xl p-4`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className="w-4 h-4 text-slate-600" />
              <p className="text-sm font-semibold text-slate-800">{title}</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{content}</p>
          </div>
        ))}
      </div>

      {/* Right panel — chat */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-semibold text-slate-900">Ask Your Business AI</h2>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full px-2.5 py-1 font-medium">
            Powered by Gemini
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-indigo-500" />
              </div>
              <p className="text-slate-500 text-center text-sm max-w-sm">
                Ask me anything about your business — inventory, payments, customers, or growth tips.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                {starterPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="text-left px-3 py-2.5 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors leading-relaxed"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-indigo-500 text-white rounded-tr-sm"
                    : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center h-5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-slate-100">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your business..."
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
