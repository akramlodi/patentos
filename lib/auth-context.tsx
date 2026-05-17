"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

type User = { email: string; businessName: string; ownerName: string };
type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (data: User & { password: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("patentos_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (email: string, password: string) => {
    if (email === "demo@paytent.in" && password === "demo1234") {
      const u = { email, businessName: "Sharma Electronics", ownerName: "Rajesh Sharma" };
      setUser(u);
      localStorage.setItem("patentos_user", JSON.stringify(u));
      document.cookie = "patentos_auth=1; path=/; max-age=86400; SameSite=Lax";
      return true;
    }
    const stored = localStorage.getItem("patentos_user");
    if (stored) {
      setUser(JSON.parse(stored));
      document.cookie = "patentos_auth=1; path=/; max-age=86400; SameSite=Lax";
      return true;
    }
    return false;
  };

  const signup = (data: User & { password: string }) => {
    const u = { email: data.email, businessName: data.businessName, ownerName: data.ownerName };
    setUser(u);
    localStorage.setItem("patentos_user", JSON.stringify(u));
    document.cookie = "patentos_auth=1; path=/; max-age=86400; SameSite=Lax";
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("patentos_user");
    document.cookie = "patentos_auth=; path=/; max-age=0";
    router.push("/login");
  };

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
