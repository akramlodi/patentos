"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, TrendingUp, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = login(email, password);
    if (ok) {
      toast.success("Welcome back!");
      router.push("/dashboard");
    } else {
      toast.error("Invalid credentials. Use demo@paytent.in / demo1234");
    }
    setLoading(false);
  };

  const handleDemoLogin = () => {
    setEmail("demo@paytent.in");
    setPassword("demo1234");
    const ok = login("demo@paytent.in", "demo1234");
    if (ok) {
      toast.success("Welcome to Patentos demo!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex w-2/5 bg-slate-900 flex-col justify-between p-10">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/PatentOs.png"
            alt="Patentos Logo"
            width={96}
            height={96}
          />
        </Link>
        <div>
          <h2 className="text-white text-3xl font-bold leading-tight mb-4">
            Run your business<br />smarter with AI
          </h2>
          <p className="text-slate-400 text-base mb-8">
            The all-in-one platform built for Indian MSMEs.
          </p>
          <div className="space-y-4">
            {[
              { icon: TrendingUp, text: "Real-time revenue and analytics" },
              { icon: CheckCircle, text: "GST-ready invoicing in seconds" },
              { icon: Shield, text: "Patent idea vault to protect your IP" },
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
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <Image
              src="/PatentOs.png"
              alt="Patentos Logo"
              width={32}
              height={32}
            />
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-8">Sign in to your Patentos account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-xs">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          >
            Quick Demo Login
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-indigo-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
