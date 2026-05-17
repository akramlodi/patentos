"use client";
import { useState } from "react";
import Link from "next/link";
import { Zap, BarChart2, Package, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const [form, setForm] = useState({ businessName: "", ownerName: "", email: "", password: "" });
  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(form);
  };

  return (
    <div className="flex h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex w-2/5 bg-slate-900 flex-col justify-between p-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">Patentos</span>
        </div>
        <div>
          <h2 className="text-white text-3xl font-bold leading-tight mb-4">
            Join thousands of<br />Indian businesses
          </h2>
          <p className="text-slate-400 text-base mb-8">
            Start managing your business smarter today.
          </p>
          <div className="space-y-4">
            {[
              { icon: BarChart2, text: "Analytics and insights powered by AI" },
              { icon: Package, text: "Smart inventory tracking with alerts" },
              { icon: Sparkles, text: "Gemini AI as your business advisor" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-600 text-xs">© 2024 Patentos. Built for Indian MSMEs.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Patentos</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm mb-8">Start your free Patentos account today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "businessName", label: "Business Name", placeholder: "Sharma Electronics", type: "text" },
              { name: "ownerName", label: "Owner Name", placeholder: "Rajesh Sharma", type: "text" },
              { name: "email", label: "Email", placeholder: "you@example.com", type: "email" },
              { name: "password", label: "Password", placeholder: "••••••••", type: "password" },
            ].map(({ name, label, placeholder, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
