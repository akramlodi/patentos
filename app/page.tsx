import Link from "next/link";
import Image from "next/image";
import {
  Receipt, Package, Sparkles, BarChart2, CreditCard, Lightbulb,
  CheckCircle,
} from "lucide-react";

const features = [
  { icon: Receipt, title: "Smart Billing", desc: "GST-ready invoices in seconds" },
  { icon: Package, title: "Inventory Alerts", desc: "Never run out of stock again" },
  { icon: Sparkles, title: "AI Business Advisor", desc: "Gemini-powered insights daily" },
  { icon: BarChart2, title: "Analytics", desc: "Know your numbers, always" },
  { icon: CreditCard, title: "Payment Tracking", desc: "Chase less, collect more" },
  { icon: Lightbulb, title: "Patent Vault", desc: "Protect your business ideas" },
];

const steps = [
  { n: "1", title: "Sign Up", desc: "Create your business account in 30 seconds" },
  { n: "2", title: "Add Your Data", desc: "Add products, create invoices, track payments" },
  { n: "3", title: "Let AI Help", desc: "Get insights, suggestions, and alerts daily" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-30">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/PatentOs.png"
            alt="Patentos Logo"
            width={92}
            height={92}
          />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-16">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Gemini AI
            </div>
            <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-4">
              Run your business<br />smarter.
            </h1>
            <p className="text-xl text-slate-500 mb-8 leading-relaxed max-w-lg">
              Billing, inventory, payments, and patent management — powered by AI. Built for Indian MSMEs.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/signup"
                className="px-6 py-3 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-colors shadow-lg shadow-indigo-500/25"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
              >
                View Demo
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8">
              {["No credit card needed", "GST-ready billing", "Free to start"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Mock dashboard */}
          <div className="flex-1 hidden lg:block">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 shadow-2xl shadow-slate-200/80">
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  { label: "Revenue", value: "₹2,84,500", color: "bg-indigo-500", trend: "+12.5%" },
                  { label: "Pending", value: "₹38,200", color: "bg-amber-400", trend: "5 invoices" },
                ].map(({ label, value, color, trend }) => (
                  <div key={label} className="bg-white rounded-xl p-4 border border-slate-100">
                    <div className={`w-8 h-8 ${color} rounded-lg mb-3`} />
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-lg font-bold text-slate-900">{value}</p>
                    <p className="text-xs text-emerald-500 font-medium mt-1">{trend}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100 mb-3">
                <p className="text-xs font-semibold text-slate-500 mb-3">Revenue This Week</p>
                <div className="flex items-end gap-2 h-16">
                  {[40, 30, 55, 35, 75, 90, 25].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-indigo-500 rounded-t-sm"
                      style={{ height: `${h}%`, opacity: 0.5 + i * 0.07 }}
                    />
                  ))}
                </div>
                <div className="flex gap-2 mt-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div key={i} className="flex-1 text-center text-[9px] text-slate-400">{d}</div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-2">Recent Invoices</p>
                <div className="space-y-2">
                  {[
                    { name: "Priya Stores", amount: "₹4,200", tag: "Paid", cls: "bg-emerald-100 text-emerald-700" },
                    { name: "Kumar Traders", amount: "₹11,500", tag: "Pending", cls: "bg-amber-100 text-amber-700" },
                    { name: "Ravi Electronics", amount: "₹8,900", tag: "Overdue", cls: "bg-red-100 text-red-700" },
                  ].map(({ name, amount, tag, cls }) => (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-100" />
                        <span className="text-xs text-slate-600">{name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">{amount}</span>
                        <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-medium ${cls}`}>{tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-8 py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Everything your business needs</h2>
            <p className="text-slate-500 text-lg">One platform, all your business tools</p>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">How it works</h2>
          <div className="flex items-start gap-8">
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} className="flex-1 relative">
                <div className="w-12 h-12 rounded-full bg-indigo-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {n}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
                {i < steps.length - 1 && (
                  <div className="absolute top-6 left-[calc(50%+24px)] right-[-50%] h-px bg-slate-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-8 py-16 bg-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to grow your business?</h2>
          <p className="text-slate-400 mb-8">Join thousands of Indian businesses using Patentos to manage smarter.</p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3.5 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-colors"
          >
            Start for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-slate-100">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/PatentOs.png"
              alt="Patentos Logo"
              width={28}
              height={28}
            />
            <span className="text-slate-400 text-sm">Built for Indian MSMEs</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/login" className="hover:text-slate-700">Login</Link>
            <Link href="/signup" className="hover:text-slate-700">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
