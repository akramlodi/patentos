"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { sampleProducts, sampleInvoices } from "./data";

export type Product = {
  id: number;
  name: string;
  category: string;
  qty: number;
  price: number;
};

export type InvoiceLineItem = {
  name: string;
  qty: number;
  price: number;
};

export type Invoice = {
  id: string;
  customer: string;
  items: string[];
  lineItems?: InvoiceLineItem[];
  amount: number;
  status: string;
  date: string;
};

type StoreCtx = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
};

const StoreContext = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);

  return (
    <StoreContext.Provider value={{ products, setProducts, invoices, setInvoices }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
};
