"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Send, PanelLeftClose, PanelLeft, Loader2, CheckCircle2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  id: number;
  role: "user" | "assistant";
  agent?: string;
  content: string;
};

type ScriptedMessage = {
  role: "assistant";
  agent: string;
  content: string;
  delay: number;
  stageIndex: number;
};

// ─── Agent config ─────────────────────────────────────────────────────────────

const AGENT_CONFIG: Record<string, { bg: string; text: string; initials: string; ring: string }> = {
  "PatentOS · Coordinator":        { bg: "bg-indigo-100",  text: "text-indigo-700",  initials: "CO", ring: "ring-indigo-200"  },
  "PatentOS · Prior Art Agent":    { bg: "bg-blue-100",    text: "text-blue-700",    initials: "PA", ring: "ring-blue-200"    },
  "PatentOS · Patentability Agent":{ bg: "bg-emerald-100", text: "text-emerald-700", initials: "PB", ring: "ring-emerald-200" },
  "PatentOS · Drafting Agent":     { bg: "bg-amber-100",   text: "text-amber-700",   initials: "DR", ring: "ring-amber-200"   },
  "PatentOS · Filing Agent":       { bg: "bg-rose-100",    text: "text-rose-700",    initials: "FL", ring: "ring-rose-200"    },
};

function agentCfg(agent = "") {
  return AGENT_CONFIG[agent] ?? { bg: "bg-slate-100", text: "text-slate-700", initials: "AI", ring: "ring-slate-200" };
}

// ─── Process stages ───────────────────────────────────────────────────────────

const STAGES = [
  { icon: "🔍", label: "Prior Art Search" },
  { icon: "📋", label: "Patentability Assessment" },
  { icon: "📝", label: "Provisional Draft" },
  { icon: "🧾", label: "Complete Specification" },
  { icon: "📬", label: "IPO Filing" },
  { icon: "🔔", label: "Examination Tracking" },
  { icon: "✅", label: "Patent Grant" },
];

// ─── Scripted conversation ────────────────────────────────────────────────────

const SCRIPTED: ScriptedMessage[] = [
  {
    role: "assistant", agent: "PatentOS · Coordinator", stageIndex: -1, delay: 900,
    content: "Hey Rajesh! 👋 I can see you've added your **AI-Powered Billing Bot** idea to the Patent Vault. Ready to take it to the next level?\n\nI'm your Patent Filing Coordinator. I'll be managing a set of specialized agents to guide you through the entire Indian patent process — from prior art search all the way to filing with the Indian Patent Office.\n\nShall we begin?",
  },
  {
    role: "assistant", agent: "PatentOS · Coordinator", stageIndex: -1, delay: 3000,
    content: "Great! Here's the full process we'll run through together:\n\n1. 🔍 **Prior Art Search** — Check if similar patents exist globally\n2. 📋 **Patentability Assessment** — Evaluate novelty, inventive step, and industrial applicability\n3. 📝 **Provisional Application Draft** — File early to establish your priority date\n4. 🧾 **Complete Specification Draft** — Full claims, abstract, and drawings\n5. 📬 **IPO Filing** — Submit to the Indian Patent Office (Form 1 + Form 2)\n6. 🔔 **Examination Tracking** — Respond to office actions\n7. ✅ **Grant** — Your patent is live!\n\nI'm spinning up your agents now...",
  },
  {
    role: "assistant", agent: "PatentOS · Prior Art Agent", stageIndex: 0, delay: 2200,
    content: "🔍 **Prior Art Search initiated.**\n\nSearching across:\n- Indian Patent Office database (IPO eSearch)\n- USPTO (US Patent & Trademark Office)\n- EPO Espacenet\n- Google Patents\n- arXiv (ML/AI preprints)\n\nQuery terms: *automated invoice generation*, *ML purchase prediction*, *MSME billing automation*, *recurring transaction detection*",
  },
  {
    role: "assistant", agent: "PatentOS · Prior Art Agent", stageIndex: 0, delay: 3500,
    content: "✅ **Search Complete.** Here's what I found:\n\n| Patent | Title | Relevance |\n|--------|-------|-----------|\n| US10482420B2 | Automated Invoice Prediction via Neural Nets | Medium — covers B2B, not MSME-specific |\n| IN202141032887 | ML-Based GST Invoice System | Low — no predictive layer |\n| EP3812942A1 | Recurring Payment Automation | Low — payments only, not invoice gen |\n\n**Assessment:** No identical prior art found. Your invention's combination of on-device ML + GST compliance + MSME-specific training data appears novel. Proceeding to patentability check.",
  },
  {
    role: "assistant", agent: "PatentOS · Patentability Agent", stageIndex: 1, delay: 2800,
    content: "📋 **Patentability Assessment**\n\nEvaluating under Indian Patents Act, 1970 (as amended):\n\n- **Novelty (§2(1)(l)):** ✅ Novel combination of on-device ML model + GST-compliant auto-invoicing for Indian MSME context\n- **Inventive Step (§2(1)(ja)):** ✅ Non-obvious — fine-tuning a lightweight model on Indian retail transaction data is not a trivial extension of existing systems\n- **Industrial Applicability (§2(1)(ac)):** ✅ Directly applicable to 63 million MSMEs in India\n- **Section 3(k) check (software patents):** ⚠️ Needs careful claim drafting — must emphasize the *technical effect* (prediction accuracy, error reduction) not just the algorithm\n\n**Verdict: Recommended for filing.** I'll flag the §3(k) risk to the Drafting Agent.",
  },
  {
    role: "assistant", agent: "PatentOS · Drafting Agent", stageIndex: 2, delay: 4000,
    content: "📝 **Drafting Provisional Application (Form 2 — Provisional)**\n\nTitle: *A System and Method for Automated GST-Compliant Invoice Generation Using On-Device Machine Learning for Micro, Small and Medium Enterprises*\n\n**Abstract (draft):**\nThe present invention discloses a system and method for automatically generating Goods and Services Tax (GST)-compliant invoices for MSME businesses by analyzing historical purchase transaction data using a lightweight on-device machine learning model. The system identifies recurring purchase patterns, predicts upcoming orders, and dispatches invoices without manual intervention, thereby reducing billing errors and improving cash flow predictability for Indian small businesses.\n\n**Independent Claim 1 (draft):**\nA computer-implemented method comprising: (a) collecting historical transaction records from an MSME point-of-sale system; (b) training a machine learning model on said records to identify recurring customer purchase patterns; (c) generating a GST-compliant invoice upon prediction of a recurring purchase event; (d) dispatching said invoice via digital means to the customer.\n\n⚠️ Note: Claim language will be refined to address §3(k) — emphasizing technical improvement over prior art.",
  },
  {
    role: "assistant", agent: "PatentOS · Filing Agent", stageIndex: 4, delay: 3200,
    content: "📬 **Filing Package Prepared**\n\nDocuments ready for submission to the Indian Patent Office (IPO), Chennai office (Karnataka jurisdiction):\n\n| Document | Status |\n|----------|--------|\n| Form 1 — Application for Grant of Patent | ✅ Ready |\n| Form 2 — Provisional Specification | ✅ Ready |\n| Form 28 — Statement of MSME (fee reduction) | ✅ Ready — qualifies for 80% fee reduction as MSME |\n| Priority Date established | 📅 Today |\n\n**Filing Fee (MSME rate):** ₹1,750 (vs ₹8,800 for large entity)\n\n**Next Steps after provisional filing:**\n- You have **12 months** to file the Complete Specification\n- I'll set a reminder at the 9-month mark\n- Examination request (Form 18) must be filed within 48 months of application date\n\nRajesh, your invention is well-positioned. Want me to generate the final PDF package for your review before we submit?",
  },
  {
    role: "assistant", agent: "PatentOS · Coordinator", stageIndex: 5, delay: 2000,
    content: "🎉 **Process Summary**\n\nHere's where we stand:\n\n- **Prior Art:** No blocking patents found\n- **Patentability:** Recommended ✅\n- **Provisional Draft:** Ready for your review\n- **Filing Package:** Prepared (MSME fee: ₹1,750)\n- **Priority Date:** Secured upon submission\n\nYour patent application for the **AI-Powered Billing Bot** is ready to file. This will give Sharma Electronics exclusive rights to this invention for **20 years** across India.\n\nYou can now ask me anything — refine the claims, understand the examination process, check deadlines, or ask about PCT filing if you want international protection.",
  },
];

// ─── Markdown renderer ────────────────────────────────────────────────────────

function inlineMd(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0, k = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<strong key={k++}>{m[1]}</strong>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

function MdContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0, k = 0;

  while (i < lines.length) {
    const t = lines[i].trim();
    if (!t) { i++; continue; }

    if (t.startsWith("|")) {
      const tbl: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { tbl.push(lines[i].trim()); i++; }
      const rows = tbl.filter(r => !/^[\|\-\s]+$/.test(r));
      if (!rows.length) continue;
      const hdr = rows[0].slice(1, -1).split("|").map(c => c.trim());
      blocks.push(
        <div key={k++} className="overflow-x-auto my-2 rounded-lg border border-slate-200">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-indigo-50 text-indigo-800">
                {hdr.map((h, ci) => <th key={ci} className="text-left px-3 py-2 font-semibold border-b border-indigo-100">{inlineMd(h)}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  {row.slice(1, -1).split("|").map((c, ci) => (
                    <td key={ci} className="px-3 py-2 text-slate-700 border-b border-slate-100 last:border-b-0">{inlineMd(c.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (t.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) { items.push(lines[i].trim().slice(2)); i++; }
      blocks.push(
        <ul key={k++} className="list-disc list-inside space-y-1 my-1">
          {items.map((item, ii) => <li key={ii} className="text-sm text-slate-700 leading-relaxed">{inlineMd(item)}</li>)}
        </ul>
      );
      continue;
    }

    if (/^\d+\./.test(t)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\./.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^\d+\.\s*/, "")); i++; }
      blocks.push(
        <ol key={k++} className="list-decimal list-inside space-y-1.5 my-1">
          {items.map((item, ii) => <li key={ii} className="text-sm text-slate-700 leading-relaxed">{inlineMd(item)}</li>)}
        </ol>
      );
      continue;
    }

    blocks.push(
      <p key={k++} className="text-sm text-slate-700 leading-relaxed">{inlineMd(t)}</p>
    );
    i++;
  }

  return <div className="space-y-2">{blocks}</div>;
}

// ─── Thinking indicator ───────────────────────────────────────────────────────

function ThinkingIndicator({ agent }: { agent: string }) {
  const cfg = agentCfg(agent);
  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ring-2 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
        {cfg.initials}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-400">{agent}</p>
        <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm">
          {[0, 150, 300].map((d) => (
            <div key={d} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PatentProcessPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingAgent, setThinkingAgent] = useState("PatentOS · Coordinator");
  const [simulationDone, setSimulationDone] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1);
  const [showTimeline, setShowTimeline] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  useEffect(() => {
    let alive = true;
    const tids: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>(res => { const t = setTimeout(res, ms); tids.push(t); });

    async function run() {
      await wait(600);
      for (const msg of SCRIPTED) {
        if (!alive) return;
        setIsThinking(true);
        setThinkingAgent(msg.agent);
        await wait(msg.delay);
        if (!alive) return;
        setIsThinking(false);
        setMessages(p => [...p, { id: idRef.current++, role: "assistant", agent: msg.agent, content: msg.content }]);
        if (msg.stageIndex >= 0) setCurrentStage(msg.stageIndex);
        await wait(350);
      }
      if (alive) setSimulationDone(true);
    }

    run();
    return () => { alive = false; tids.forEach(clearTimeout); };
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setMessages(p => [...p, { id: idRef.current++, role: "user", content: text }]);
    setInput("");
    setIsLoading(true);
    setIsThinking(true);
    setThinkingAgent("PatentOS · Coordinator");
    try {
      const res = await fetch("/api/patent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setIsThinking(false);
      setMessages(p => [...p, {
        id: idRef.current++,
        role: "assistant",
        agent: "PatentOS · Coordinator",
        content: data.response ?? "Sorry, something went wrong.",
      }]);
    } catch {
      setIsThinking(false);
      setMessages(p => [...p, {
        id: idRef.current++,
        role: "assistant",
        agent: "PatentOS · Coordinator",
        content: "Connection error. Please try again.",
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <div className="-m-6 flex flex-col overflow-hidden" style={{ height: "calc(100vh - 4rem)" }}>

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-slate-100 shrink-0">
        <Link
          href="/dashboard/patents"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Patent Vault
        </Link>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-slate-900 leading-tight">Patent Filing Assistant</h1>
          <p className="text-xs text-slate-400">AI-Powered Billing Bot · Sharma Electronics, Bangalore</p>
        </div>
        <button
          onClick={() => setShowTimeline(v => !v)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded-lg px-2.5 py-1.5 transition-colors"
        >
          {showTimeline ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeft className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{showTimeline ? "Hide" : "Show"} Timeline</span>
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Timeline panel ── */}
        {showTimeline && (
          <div className="w-56 shrink-0 bg-white border-r border-slate-100 flex flex-col overflow-y-auto">
            <p className="px-4 pt-5 pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Process Timeline
            </p>
            <div className="px-3 pb-6">
              {STAGES.map((stage, idx) => {
                const done    = currentStage > idx;
                const active  = currentStage === idx;
                const pending = currentStage < idx;
                return (
                  <div key={idx} className="flex gap-3">
                    {/* Line + circle */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm z-10
                        ${done   ? "bg-emerald-500 text-white ring-2 ring-emerald-200"
                                 : active ? "bg-indigo-500 text-white ring-2 ring-indigo-200"
                                 : "bg-white border-2 border-slate-200 text-slate-400"}`}>
                        {done
                          ? <CheckCircle2 className="w-4 h-4" />
                          : active
                          ? <span>{stage.icon}</span>
                          : <span className="text-xs font-semibold">{idx + 1}</span>}
                      </div>
                      {idx < STAGES.length - 1 && (
                        <div className={`w-0.5 h-8 mt-0.5 ${done ? "bg-emerald-300" : "bg-slate-100"}`} />
                      )}
                    </div>
                    {/* Text */}
                    <div className={`pb-1 pt-1.5 min-w-0 ${active ? "" : ""}`}>
                      <p className={`text-xs font-medium leading-tight
                        ${done ? "text-emerald-700" : active ? "text-indigo-700 font-semibold" : "text-slate-400"}`}>
                        {stage.label}
                      </p>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {done ? "Complete ✓" : active ? "In progress…" : "Pending"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Chat area ── */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[#F8F9FC]">

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

            {messages.map((msg) => {
              if (msg.role === "user") {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-xl">
                      <p className="text-xs text-slate-400 text-right mb-1 pr-1">You</p>
                      <div className="bg-indigo-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                );
              }

              const cfg = agentCfg(msg.agent);
              return (
                <div key={msg.id} className="flex items-start gap-3 max-w-3xl">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ring-2 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
                    {cfg.initials}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-semibold text-slate-500">🤖 {msg.agent}</p>
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm border border-slate-100">
                      <MdContent content={msg.content} />
                    </div>
                  </div>
                </div>
              );
            })}

            {isThinking && <ThinkingIndicator agent={thinkingAgent} />}

            {simulationDone && !isThinking && (
              <div className="flex justify-center py-2">
                <span className="text-xs text-slate-400 bg-white border border-slate-100 rounded-full px-4 py-1.5 shadow-sm">
                  Simulation complete — ask PatentOS anything below
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-6 py-4 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={
                  simulationDone
                    ? "Ask about claims, PCT filing, §3(k), examination…"
                    : "Simulation in progress…"
                }
                disabled={!simulationDone || isLoading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all placeholder:text-slate-400"
              />
              <button
                onClick={sendMessage}
                disabled={!simulationDone || isLoading || !input.trim()}
                className="w-10 h-10 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
              >
                {isLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">
              {simulationDone
                ? "Powered by PatentOS · Gemini 2.5 Flash Lite"
                : "Agents are working through your filing…"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
