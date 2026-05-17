# Patentos — Build Specification
### Claude Code Handoff Document (Repo Already Initialized)

---

## Current State of the Repo

The following is **already done** — do NOT redo these steps:

- ✅ Repo created: `patentos`
- ✅ Next.js initialized (App Router, TypeScript, Tailwind CSS)
- ✅ shadcn/ui initialized via `npx shadcn@latest init --preset b2BnxKXeS --template next`

**Your first step:** Run the following to install remaining dependencies only:

```bash
npm install recharts @google/generative-ai lucide-react
npx shadcn@latest add button card input label select dialog toast tabs badge table dropdown-menu separator avatar scroll-area switch
```

Then begin building. Do not re-run `create-next-app` or `shadcn init`.

---

## What We're Building

**Patentos** — an AI-powered business management platform for Indian MSMEs. Handles billing, inventory, payments, analytics, and a lightweight patent idea tracker. AI assistant powered by Google Gemini.

**Goal:** A clean, demoable MVP with realistic sample data that looks great and flows well in a 5-minute demo.

---

## Demo Credentials

```
Email:    demo@paytent.in
Password: demo1234

Business Name: Sharma Electronics
Owner:         Rajesh Sharma
Location:      Bangalore, Karnataka
```

A **"Quick Demo Login"** button on the login page auto-fills these and submits.

---

## Design System

### Theme: Clean Professional Light

Light background, deep navy sidebar, indigo primary accent. Think Zoho Books meets Linear.

### CSS Variables (add to `globals.css`)

```css
:root {
  --bg:             #F8F9FC;
  --card:           #FFFFFF;
  --sidebar:        #0F172A;
  --sidebar-hover:  #1E293B;
  --sidebar-text:   #94A3B8;
  --sidebar-active: #FFFFFF;
  --primary:        #6366F1;
  --primary-light:  #EEF2FF;
  --primary-hover:  #4F46E5;
  --success:        #10B981;
  --success-light:  #ECFDF5;
  --warning:        #F59E0B;
  --warning-light:  #FFFBEB;
  --danger:         #EF4444;
  --danger-light:   #FEF2F2;
  --purple:         #8B5CF6;
  --purple-light:   #F5F3FF;
  --text-primary:   #0F172A;
  --text-secondary: #64748B;
  --border:         #E2E8F0;
  --radius:         0.75rem;
}
```

### Typography

Use `next/font` to load:
- **Display/headings:** `Geist` (already available in Next.js 14+)
- **Body:** `Inter` from Google Fonts

### Reusable Class Patterns

```
Stat card:     bg-white rounded-xl shadow-sm border border-slate-100 p-6
Table:         bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden
Section title: text-lg font-semibold text-slate-900
Sub text:      text-sm text-slate-500
Primary btn:   bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium
Ghost btn:     bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2 text-sm
```

### Status Badge Classes

```
Paid:     bg-emerald-100 text-emerald-700 rounded-full px-2.5 py-0.5 text-xs font-medium
Pending:  bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5 text-xs font-medium
Overdue:  bg-red-100 text-red-700 rounded-full px-2.5 py-0.5 text-xs font-medium
Idea:     bg-slate-100 text-slate-600 rounded-full px-2.5 py-0.5 text-xs font-medium
Research: bg-blue-100 text-blue-700 rounded-full px-2.5 py-0.5 text-xs font-medium
Draft:    bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5 text-xs font-medium
Filed:    bg-indigo-100 text-indigo-700 rounded-full px-2.5 py-0.5 text-xs font-medium
```

---

## Project File Structure

```
patentos/
├── app/
│   ├── globals.css
│   ├── layout.tsx                  ← root layout, wraps AuthProvider
│   ├── page.tsx                    ← Landing page (public)
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── api/
│   │   └── gemini/
│   │       └── route.ts            ← Gemini API proxy route
│   └── dashboard/
│       ├── layout.tsx              ← Sidebar + Topbar shell
│       ├── page.tsx                ← Dashboard home
│       ├── billing/page.tsx
│       ├── inventory/page.tsx
│       ├── payments/page.tsx
│       ├── analytics/page.tsx
│       ├── insights/page.tsx       ← Gemini AI chat
│       ├── patents/page.tsx
│       ├── customers/page.tsx
│       └── settings/page.tsx
├── components/
│   ├── ui/                         ← shadcn auto-generated
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   └── shared/
│       └── StatusBadge.tsx         ← reusable badge component
├── lib/
│   ├── data.ts                     ← all sample data
│   ├── auth-context.tsx            ← AuthContext + AuthProvider
│   └── utils.ts                    ← cn(), formatCurrency(), formatDate()
├── middleware.ts                   ← route protection
└── .env.local                      ← GEMINI_API_KEY
```

---

## `/lib/data.ts` — Complete Sample Data

This is the single source of truth for all demo data. Paste this entire file:

```typescript
// lib/data.ts

export const sampleUser = {
  uid: "demo-001",
  businessName: "Sharma Electronics",
  ownerName: "Rajesh Sharma",
  email: "demo@paytent.in",
  phone: "9876543210",
  address: "14, Gandhi Nagar, Bangalore - 560001",
  gst: "29AABCS1429B1Z1",
};

export const sampleProducts = [
  { id: 1, name: "Samsung 25W Charger", category: "Mobile Accessories", qty: 45, price: 899 },
  { id: 2, name: "USB Hub 4-Port", category: "Computer Accessories", qty: 3, price: 649 },
  { id: 3, name: "LED Bulb 9W", category: "Lighting", qty: 120, price: 85 },
  { id: 4, name: "HDMI Cable 2m", category: "Cables", qty: 1, price: 299 },
  { id: 5, name: "Extension Board 4-Socket", category: "Power", qty: 28, price: 450 },
  { id: 6, name: "Samsung Charger 2A", category: "Mobile Accessories", qty: 2, price: 299 },
  { id: 7, name: "Wireless Mouse", category: "Computer Accessories", qty: 15, price: 1299 },
  { id: 8, name: "AA Battery 4-Pack", category: "Batteries", qty: 60, price: 120 },
  { id: 9, name: "Power Strip 6-Socket", category: "Power", qty: 18, price: 750 },
  { id: 10, name: "Phone Stand Adjustable", category: "Mobile Accessories", qty: 22, price: 349 },
];

export const sampleInvoices = [
  { id: "INV-001", customer: "Priya Stores", items: ["Samsung 25W Charger x2", "USB Hub x1"], amount: 4200, status: "paid", date: "2024-06-10" },
  { id: "INV-002", customer: "Kumar Traders", items: ["LED Bulb 9W x10", "Extension Board x3"], amount: 11500, status: "pending", date: "2024-06-09" },
  { id: "INV-003", customer: "Meena Fashion", items: ["Wireless Mouse x2"], amount: 2800, status: "paid", date: "2024-06-08" },
  { id: "INV-004", customer: "Ravi Electronics", items: ["HDMI Cable 2m x5", "Power Strip x2"], amount: 8900, status: "overdue", date: "2024-06-05" },
  { id: "INV-005", customer: "Sunita Medicals", items: ["AA Battery 4-Pack x6"], amount: 3100, status: "paid", date: "2024-06-03" },
  { id: "INV-006", customer: "Deepak Hardware", items: ["Extension Board x5", "LED Bulb x20"], amount: 6500, status: "paid", date: "2024-06-01" },
  { id: "INV-007", customer: "Anjali Boutique", items: ["Phone Stand x3", "USB Hub x2"], amount: 2347, status: "pending", date: "2024-05-30" },
  { id: "INV-008", customer: "Priya Stores", items: ["Samsung 25W Charger x5"], amount: 4495, status: "paid", date: "2024-05-28" },
  { id: "INV-009", customer: "Kumar Traders", items: ["Wireless Mouse x4", "AA Battery x10"], amount: 6396, status: "paid", date: "2024-05-25" },
  { id: "INV-010", customer: "Ravi Electronics", items: ["Power Strip x3", "HDMI Cable x8"], amount: 4650, status: "overdue", date: "2024-05-20" },
];

export const sampleCustomers = [
  { id: 1, name: "Priya Stores", phone: "9876543210", location: "Bangalore", orders: 8, spent: 32400, lastPurchase: "2024-06-10" },
  { id: 2, name: "Kumar Traders", phone: "9845671230", location: "Mysore", orders: 12, spent: 68900, lastPurchase: "2024-06-09" },
  { id: 3, name: "Meena Fashion", phone: "9901234567", location: "Bangalore", orders: 5, spent: 14200, lastPurchase: "2024-06-08" },
  { id: 4, name: "Ravi Electronics", phone: "9823456789", location: "Hubli", orders: 9, spent: 45600, lastPurchase: "2024-06-05" },
  { id: 5, name: "Sunita Medicals", phone: "9765432109", location: "Belgaum", orders: 6, spent: 18900, lastPurchase: "2024-06-03" },
  { id: 6, name: "Deepak Hardware", phone: "9654321098", location: "Bangalore", orders: 4, spent: 9800, lastPurchase: "2024-05-28" },
  { id: 7, name: "Anjali Boutique", phone: "9543210987", location: "Mangalore", orders: 3, spent: 7200, lastPurchase: "2024-05-20" },
];

export const samplePatents = [
  {
    id: 1,
    title: "AI-Powered Billing Bot",
    description: "Automated invoicing system using ML to predict customer purchase patterns and auto-generate invoices for recurring buyers.",
    status: "draft",
    date: "2024-05-20",
    tags: ["AI", "Billing", "Automation"],
  },
  {
    id: 2,
    title: "Smart Inventory Alert System",
    description: "IoT-based system that automatically triggers purchase orders when stock falls below a configurable threshold value.",
    status: "filed",
    date: "2024-04-10",
    tags: ["IoT", "Inventory", "Automation"],
  },
  {
    id: 3,
    title: "QR-Based Payment Tracker",
    description: "Mobile-first payment collection system using QR codes integrated with UPI for small and medium-sized retailers.",
    status: "research",
    date: "2024-06-01",
    tags: ["Payments", "Mobile", "UPI"],
  },
  {
    id: 4,
    title: "Voice-Activated Store Manager",
    description: "Vernacular language voice assistant for shop owners to manage billing and inventory hands-free in regional languages.",
    status: "idea",
    date: "2024-06-08",
    tags: ["Voice", "AI", "Regional Languages"],
  },
];

export const sampleAnalytics = {
  weeklyRevenue: [
    { day: "Mon", revenue: 12400 },
    { day: "Tue", revenue: 9800 },
    { day: "Wed", revenue: 15600 },
    { day: "Thu", revenue: 11200 },
    { day: "Fri", revenue: 22800 },
    { day: "Sat", revenue: 28400 },
    { day: "Sun", revenue: 8900 },
  ],
  monthlyRevenue: [
    { month: "Jan", revenue: 190000, expenses: 140000 },
    { month: "Feb", revenue: 210000, expenses: 155000 },
    { month: "Mar", revenue: 180000, expenses: 130000 },
    { month: "Apr", revenue: 240000, expenses: 172000 },
    { month: "May", revenue: 220000, expenses: 160000 },
    { month: "Jun", revenue: 284500, expenses: 190000 },
  ],
  categoryBreakdown: [
    { name: "Mobile Accessories", value: 38, color: "#6366F1" },
    { name: "Computer Accessories", value: 22, color: "#8B5CF6" },
    { name: "Cables", value: 15, color: "#10B981" },
    { name: "Lighting", value: 14, color: "#F59E0B" },
    { name: "Power", value: 11, color: "#EF4444" },
  ],
  topProducts: [
    { name: "Samsung 25W Charger", units: 142, revenue: 127658, trend: 18 },
    { name: "LED Bulb 9W", units: 380, revenue: 32300, trend: 5 },
    { name: "Extension Board 4-Socket", units: 64, revenue: 28800, trend: -2 },
    { name: "Wireless Mouse", units: 22, revenue: 28578, trend: 12 },
    { name: "USB Hub 4-Port", units: 38, revenue: 24662, trend: -8 },
  ],
  dailySales: [
    3200, 4100, 2800, 5600, 4900, 8200, 9100,
    3400, 6200, 5100, 7800, 8900, 6700, 9200,
  ],
};
```

---

## `/lib/auth-context.tsx`

```typescript
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
      return true;
    }
    // Accept any other credentials too (demo flexibility)
    const stored = localStorage.getItem("patentos_user");
    if (stored) {
      setUser(JSON.parse(stored));
      return true;
    }
    return false;
  };

  const signup = (data: User & { password: string }) => {
    const u = { email: data.email, businessName: data.businessName, ownerName: data.ownerName };
    setUser(u);
    localStorage.setItem("patentos_user", JSON.stringify(u));
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("patentos_user");
    router.push("/login");
  };

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
```

---

## `middleware.ts`

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC = ["/", "/login", "/signup"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.some((p) => pathname === p || pathname.startsWith("/api"))) {
    return NextResponse.next();
  }
  // Check auth cookie (set on login)
  const auth = req.cookies.get("patentos_auth");
  if (!auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
```

> **Note:** Also set a cookie `patentos_auth=1` in the login handler and delete it on logout alongside clearing localStorage.

---

## `/app/api/gemini/route.ts`

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { message } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemContext = `You are a friendly and practical AI business advisor for Sharma Electronics, 
a small electronics retail shop in Bangalore, India. 
Key business facts:
- Monthly revenue: ₹2,84,500 (up 12.5% from last month)
- Pending payments: ₹38,200 across 5 invoices
- Low stock items: Samsung Charger (2 units), USB Hub (3 units), HDMI Cable (1 unit)
- Top customer: Kumar Traders (₹68,900 total spending)
- Best selling product: Samsung 25W Charger
- Total products: 10 | Total customers: 7 | Total invoices: 10
Keep responses concise (under 130 words), practical, and encouraging. 
Use Indian business context. Format with short paragraphs, no markdown headers.`;

  const result = await model.generateContent(`${systemContext}\n\nUser question: ${message}`);
  return Response.json({ response: result.response.text() });
}
```

```env
# .env.local
GEMINI_API_KEY=your_key_here
```

---

## Page-by-Page Build Guide

---

### PAGE 1 — Landing Page (`/app/page.tsx`)

Public marketing page. Should look polished enough that a judge believes this is a real product.

**Sections (top to bottom):**

**1. Navbar**
- Logo: lightning bolt icon + "Patentos" in bold
- Right: "Login" (ghost) + "Get Started" (primary) buttons

**2. Hero**
- Left side: headline + subheadline + CTAs
- Headline: `Run your business smarter.`
- Subheadline: `Billing, inventory, payments, and patent management — powered by AI. Built for Indian MSMEs.`
- Buttons: "Get Started Free" → `/signup`, "View Demo" → `/login`
- Right side: a mock dashboard screenshot using divs/SVG — a fake card grid with colored bar chart blocks. Use indigo/green/amber colored boxes to simulate charts. Make it look like the dashboard at a glance.

**3. Features Grid (6 cards, 3 columns)**
```
🧾 Smart Billing           GST-ready invoices in seconds
📦 Inventory Alerts        Never run out of stock again
🤖 AI Business Advisor     Gemini-powered insights daily
📊 Analytics               Know your numbers, always
💳 Payment Tracking        Chase less, collect more
💡 Patent Vault            Protect your business ideas
```
Each card: white bg, rounded-xl, icon in indigo circle, title, description.

**4. How It Works (3 steps horizontal)**
```
1. Sign Up          Create your business account in 30 seconds
2. Add Your Data    Add products, create invoices, track payments
3. Let AI Help      Get insights, suggestions, and alerts daily
```

**5. CTA Banner**
Dark navy background, centered text: "Ready to grow your business?" + "Start for Free" button (indigo)

**6. Footer**
Logo, tagline, Login and Signup links, "Built for Indian MSMEs"

---

### PAGE 2 — Login (`/app/login/page.tsx`)

**Layout:** Two columns. Left 40%: dark navy panel with logo, tagline, and 3 feature bullets. Right 60%: the form.

**Form:**
- Heading: "Welcome back"
- Subheading: "Sign in to your Patentos account"
- Email field
- Password field
- "Sign In" button (full width, primary)
- Divider: "or"
- **"Quick Demo Login"** button (full width, ghost style, with a ⚡ icon) — auto-fills email/password and submits
- "Don't have an account? Sign up" link

**On submit:** validate against demo credentials OR any stored user. Set cookie `patentos_auth=1`, update AuthContext, redirect to `/dashboard`.

---

### PAGE 3 — Signup (`/app/signup/page.tsx`)

Same two-column layout as Login.

**Form:**
- Heading: "Create your account"
- Business Name, Owner Name, Email, Password fields
- "Create Account" button
- "Already have an account? Sign in" link

**On submit:** store user, set cookie, redirect to `/dashboard`.

---

### PAGE 4 — Dashboard Layout (`/app/dashboard/layout.tsx`)

This wraps all `/dashboard/*` pages. Renders:
1. `<Sidebar />` — fixed left, 240px
2. Main area: `<Topbar />` on top, then `{children}` below in a scrollable area with `bg-[#F8F9FC]` and `p-6`

**`Sidebar.tsx` spec:**
- Background: `#0F172A`
- Width: 240px, fixed, full height
- Top: logo section — lightning bolt icon (indigo) + "Patentos" text in white, bold
- Nav links (with Lucide icons):
  ```
  LayoutDashboard    Dashboard         /dashboard
  Receipt            Billing           /dashboard/billing
  Package            Inventory         /dashboard/inventory
  CreditCard         Payments          /dashboard/payments
  BarChart2          Analytics         /dashboard/analytics
  Sparkles           AI Insights       /dashboard/insights   ← small "AI" badge in indigo
  Lightbulb          Patents           /dashboard/patents
  Users              Customers         /dashboard/customers
  Settings           Settings          /dashboard/settings
  ```
- Active state: `border-l-2 border-indigo-500 bg-indigo-500/10 text-white`
- Inactive state: `text-slate-400 hover:text-white hover:bg-white/5`
- Bottom: user avatar (initials in indigo circle), business name in white (small), `LogOut` icon button

**`Topbar.tsx` spec:**
- White bg, border-b, h-16, px-6
- Left: current page title (passed as prop or derived from pathname)
- Right: search input (placeholder "Search...", cosmetic), Bell icon with red badge "3", user avatar

---

### PAGE 5 — Dashboard Home (`/app/dashboard/page.tsx`)

The showpiece page. Four visual rows.

**Row 1: 4 Stat Cards**

```
Card 1 — Total Revenue
  Icon: IndianRupee (indigo bg)
  Value: ₹2,84,500
  Sub: Total this month
  Trend: +12.5% ↑ (green)

Card 2 — Pending Payments
  Icon: Clock (amber bg)
  Value: ₹38,200
  Sub: Across 5 invoices
  Trend: 2 overdue (red)

Card 3 — Products in Stock
  Icon: Package (green bg)
  Value: 142 items
  Sub: Across 10 products
  Trend: ⚠ 3 low stock (amber)

Card 4 — Patent Ideas
  Icon: Lightbulb (purple bg)
  Value: 4 ideas
  Sub: Tracked in vault
  Trend: 1 filed (indigo)
```

**Row 2: Two charts side by side**

Left (60%): **Weekly Revenue Bar Chart**
- Use `BarChart` from Recharts
- Data: Mon–Sun from `sampleAnalytics.weeklyRevenue`
- Bar fill: `#6366F1`, `radius={[4,4,0,0]}`
- Custom tooltip showing `₹{value}`
- Title: "Revenue This Week" with subtitle "Daily earnings overview"

Right (40%): **6-Month Line Chart**
- Use `LineChart` from Recharts
- Data: `sampleAnalytics.monthlyRevenue`
- Revenue line: `#6366F1` (solid), Expenses line: `#E2E8F0` (dashed)
- Title: "6-Month Overview"

**Row 3: Two columns (60/40)**

Left: **Recent Invoices table**
- Show last 5 from `sampleInvoices`
- Columns: Customer, Amount, Status badge, Date
- "View All" link → `/dashboard/billing`

Right: **Quick Actions + Low Stock**

Quick Actions (2×2 button grid):
```
🧾 New Invoice    → opens CreateInvoiceModal OR navigates to /dashboard/billing
📦 Add Product    → navigates to /dashboard/inventory
🤖 AI Insights    → navigates to /dashboard/insights
💡 Patent Idea    → navigates to /dashboard/patents
```

Low Stock Alerts section below buttons:
```
Title: "Low Stock Alerts" with amber warning icon
- Samsung Charger 2A — 2 units
- USB Hub 4-Port — 3 units
- HDMI Cable 2m — 1 unit
```
Each as a small row: amber dot, product name, "X units" in amber text.

---

### PAGE 6 — Billing (`/app/dashboard/billing/page.tsx`)

**State:** `invoices` initialized from `sampleInvoices`, managed with `useState`.

**Layout:**

Header row: "Billing" title, "Create Invoice" primary button (opens modal)

Summary cards (4, smaller than dashboard cards):
```
Total Invoices: 10
Total Billed:   ₹2,84,500  (sum of all)
Paid:           ₹2,46,300  (sum of paid)
Pending:        ₹38,200    (sum of pending + overdue)
```

Filter bar: Search input + status tabs (All | Paid | Pending | Overdue) using shadcn `Tabs`

**Invoice Table:**
Columns: `Invoice #` | `Customer` | `Items` | `Amount` | `Status` | `Date` | `Actions`

- Items column: show first item + "+N more" if multiple
- Amount: `₹{n.toLocaleString('en-IN')}`
- Status: badge component
- Actions: Eye icon (view), Download icon (cosmetic, show toast "Downloading...")

**Create Invoice Modal (shadcn Dialog):**
- Customer name (text input)
- Line items section: Add item rows with [Product name, Qty, Unit price] → auto-calculates subtotal per row
- "Add Item" button to add more rows
- Tax: 18% GST shown as separate line
- Grand total shown large at bottom
- "Save Invoice" → generates new INV-0XX id, adds to list, closes modal, shows success toast
- "Cancel" button

---

### PAGE 7 — Inventory (`/app/dashboard/inventory/page.tsx`)

**State:** `products` initialized from `sampleProducts`.

**Computed statuses:**
- `qty === 0` → `out-of-stock`
- `qty < 5` → `low-stock`
- else → `in-stock`

Header: "Inventory" title + "Add Product" button

Summary cards:
```
Total Products: 10
Low Stock:      3   (amber)
Out of Stock:   0   (red)
Total Value:    ₹1,24,800  (sum of qty × price)
```

Search input + category filter dropdown + status tabs (All | In Stock | Low Stock | Out of Stock)

**Product Table:**
Columns: `Product` | `Category` | `Qty` | `Price` | `Total Value` | `Status` | `Actions`

- Low stock rows: highlight entire row with subtle amber left border or amber row bg
- Actions: Edit (pencil icon → opens edit modal, inline row edit acceptable), Delete (trash → confirm dialog, then remove from state)

**Add Product Modal:**
- Product Name, Category (select), Quantity (number), Price (number)
- Save → add to list + success toast

---

### PAGE 8 — Payments (`/app/dashboard/payments/page.tsx`)

**State:** Derived from `sampleInvoices`.

Summary cards:
```
Collected:  ₹2,46,300  (green)
Pending:    ₹27,347    (amber)
Overdue:    ₹13,550    (red)
```

Tabs: All | Paid | Pending | Overdue

**Payment Cards** (not table — use a card list for visual variety):

Each card shows:
- Customer name (bold) + Invoice number (muted)
- Amount (large, right side)
- Due date or paid date
- Status badge
- For Overdue: red "Send Reminder" button → shows toast "Reminder sent to {customer}!"
- For Pending: "Mark as Paid" button → updates status in state + success toast

---

### PAGE 9 — AI Insights (`/app/dashboard/insights/page.tsx`)

The standout feature page.

**Layout: Two columns**

**Left panel (38%) — Auto Insight Cards**

Title: "Business Snapshot" with Sparkles icon

5 static insight cards:
```
Card 1 — Revenue Up 📈  (green left border)
  Sales have grown 12.5% this month compared to May.
  Your Friday and Saturday numbers are especially strong.

Card 2 — Stock Alert ⚠️  (amber left border)
  3 products are running low: Samsung Charger (2), USB Hub (3), HDMI Cable (1).
  Consider restocking before the weekend rush.

Card 3 — Top Customer 👑  (indigo left border)
  Kumar Traders is your best customer this month — ₹11,500 in purchases.
  Consider offering them a loyalty discount.

Card 4 — Overdue Alert 🔴  (red left border)
  Ravi Electronics has ₹8,900 overdue since June 5.
  A payment reminder has not been sent yet.

Card 5 — Tip 💡  (purple left border)
  Your weekend sales are 35% higher. Try running promotions on Thursdays to build momentum earlier.
```

**Right panel (62%) — Gemini Chat**

Title: "Ask Your Business AI" with Sparkles icon and a small "Powered by Gemini" tag

Starter prompt pills (shown when chat is empty):
```
"How can I improve my sales this month?"
"Which products should I restock first?"
"Tips to collect overdue payments?"
"What's my strongest sales category?"
```

Chat area:
- User messages: right-aligned, indigo bg, white text, rounded-2xl
- AI messages: left-aligned, white bg, border, text-slate-700, rounded-2xl
- AI avatar: small Sparkles icon in indigo circle
- Typing indicator: 3 animated dots while waiting

Input bar at bottom:
- Text input: "Ask anything about your business..."
- Send button (indigo, arrow icon)
- On send → POST to `/api/gemini` with `{ message }` → display response

**Error handling:** If API fails, show "AI service unavailable. Please check your API key in .env.local" in the chat as an error message.

---

### PAGE 10 — Analytics (`/app/dashboard/analytics/page.tsx`)

Data-heavy page showing the full picture.

**Row 1: KPI Cards (3 columns, 2 rows = 6 cards)**
```
Total Revenue (YTD)    ₹14,28,000
Total Customers        7
Total Invoices         10
Best Selling Product   Samsung 25W Charger
Avg. Invoice Value     ₹5,990
Collection Rate        86.5%
```

**Row 2: Two large charts**

Left (55%): Monthly Revenue + Expenses Grouped Bar Chart
- X: Jan–Jun, two bars per month (Revenue in indigo, Expenses in slate-200)
- Title: "Monthly Revenue vs Expenses"

Right (45%): Category Sales Donut Chart
- `PieChart` with `innerRadius` (donut shape)
- Legend below
- Colors from `sampleAnalytics.categoryBreakdown`
- Title: "Sales by Category"

**Row 3: Product Performance Table**
Columns: `Product` | `Units Sold` | `Revenue` | `Trend`

Trend column: green "↑ +X%" or red "↓ X%" with colored text.

Use `sampleAnalytics.topProducts` data.

**Row 4: Daily Sales Sparkline**
- Title: "Last 14 Days"
- Small responsive `LineChart` with no axes labels — just the curve
- Fill gradient from indigo-500 to transparent

---

### PAGE 11 — Patent Vault (`/app/dashboard/patents/page.tsx`)

**State:** `patents` initialized from `samplePatents`.

Header: "Patent Vault" title + subtitle + "Add Idea" button

**AI Suggestion Banner** (at top, indigo-tinted box):
```
🤖 AI Suggestion
Based on current market trends, AI-based billing automation and vernacular
voice assistants are gaining strong traction in MSME tech. Your "AI Billing Bot"
idea aligns with emerging patent filings. Consider a prior art search before
drafting.
```
Style: `bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-indigo-800 text-sm`

**Status Pipeline Bar:**
A horizontal step indicator showing count per stage:
```
💡 Idea (1)  →  🔍 Research (1)  →  📝 Draft (1)  →  📬 Filed (1)
```
Each stage: rounded pill, colored bg matching its status, count badge.

**Patent Cards Grid (3 columns):**

Each card:
- White bg, rounded-xl, border, shadow-sm, p-5
- Status badge (top right)
- Title (text-base font-semibold mt-2)
- Description (text-sm text-slate-500, line-clamp-2)
- Tags: small gray pills at bottom
- Footer: date added, "Edit Status" dropdown (select new status → updates in state)

**Add Patent Modal:**
- Title (text input)
- Description (textarea, 3 rows)
- Status (select: Idea / Research / Draft / Filed)
- Tags (text input, comma-separated, split into array on save)
- Save → add to list + success toast

---

### PAGE 12 — Customers (`/app/dashboard/customers/page.tsx`)

**State:** `customers` initialized from `sampleCustomers`.

Header: "Customers" title + "Add Customer" button

Summary cards:
```
Total Customers: 7
Top Customer: Kumar Traders
Total Revenue: ₹1,97,000  (sum of all .spent)
Avg. Spend: ₹28,143
```

Search input

**Customer Table:**
Columns: `Name` | `Location` | `Phone` | `Orders` | `Total Spent` | `Last Purchase` | `Actions`

- Total Spent: bold, `₹{n.toLocaleString('en-IN')}`
- Sort by Total Spent (descending by default)
- Actions: View icon → expands row showing their last 3 invoices (filter `sampleInvoices` by customer name)

**Add Customer Modal:**
- Name, Phone, Location fields
- Save → add with orders=0, spent=0, lastPurchase=today

---

### PAGE 13 — Settings (`/app/dashboard/settings/page.tsx`)

**Layout:** Vertical sections separated by dividers, no tabs needed for MVP.

**Section 1 — Business Profile**
- Editable fields: Business Name, Owner Name, Email, Phone, Address, GST Number
- Pre-filled from `sampleUser` data
- "Save Changes" button → success toast "Profile updated!"

**Section 2 — Appearance**
- Row: "Dark Mode" label + description + `Switch` toggle (shadcn Switch)
- Toggle wires up `dark` class on `<html>` (can be cosmetic — just toggle the class)

**Section 3 — Notifications**
Three rows with Switch toggles, all defaulting to ON:
- Low stock alerts
- Payment due reminders
- Patent deadline reminders

**Section 4 — Demo**
- "Reset Sample Data" button (ghost) → reloads the page, resets all state to original sample data

**Section 5 — Account**
- Logout button (red variant) → calls `auth.logout()` → clears cookie + localStorage → redirects to `/login`

---

## Shared Components

### `StatusBadge.tsx`

```typescript
type Status = "paid" | "pending" | "overdue" | "idea" | "research" | "draft" | "filed" | "in-stock" | "low-stock" | "out-of-stock";

const config = {
  paid:        { label: "Paid",         class: "bg-emerald-100 text-emerald-700" },
  pending:     { label: "Pending",      class: "bg-amber-100 text-amber-700" },
  overdue:     { label: "Overdue",      class: "bg-red-100 text-red-700" },
  idea:        { label: "Idea",         class: "bg-slate-100 text-slate-600" },
  research:    { label: "Research",     class: "bg-blue-100 text-blue-700" },
  draft:       { label: "Draft",        class: "bg-amber-100 text-amber-700" },
  filed:       { label: "Filed",        class: "bg-indigo-100 text-indigo-700" },
  "in-stock":  { label: "In Stock",     class: "bg-emerald-100 text-emerald-700" },
  "low-stock": { label: "Low Stock",    class: "bg-amber-100 text-amber-700" },
  "out-of-stock": { label: "Out of Stock", class: "bg-red-100 text-red-700" },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, class: cls } = config[status];
  return <span className={`${cls} rounded-full px-2.5 py-0.5 text-xs font-medium`}>{label}</span>;
}
```

### `lib/utils.ts` additions

```typescript
export const formatINR = (n: number) =>
  `₹${n.toLocaleString("en-IN")}`;

export const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};
```

---

## Build Order for Claude Code

Build in this exact sequence to avoid dependency issues:

```
1.  globals.css + design tokens
2.  lib/data.ts
3.  lib/utils.ts
4.  lib/auth-context.tsx
5.  middleware.ts
6.  components/shared/StatusBadge.tsx
7.  components/layout/Sidebar.tsx
8.  components/layout/Topbar.tsx
9.  app/layout.tsx  (wrap with AuthProvider)
10. app/dashboard/layout.tsx  (Sidebar + Topbar shell)
11. app/login/page.tsx
12. app/signup/page.tsx
13. app/dashboard/page.tsx  (Dashboard home — most complex)
14. app/dashboard/billing/page.tsx
15. app/dashboard/inventory/page.tsx
16. app/dashboard/payments/page.tsx
17. app/api/gemini/route.ts
18. app/dashboard/insights/page.tsx
19. app/dashboard/analytics/page.tsx
20. app/dashboard/patents/page.tsx
21. app/dashboard/customers/page.tsx
22. app/dashboard/settings/page.tsx
23. app/page.tsx  (Landing page — last)
```

---

## Demo Presentation Script (~5 minutes)

| Step | Action |
|------|--------|
| 1 | Open landing page → show hero and features briefly |
| 2 | Click "View Demo" → login page → click "Quick Demo Login" |
| 3 | Dashboard → point out stat cards, revenue chart, recent invoices, low stock alerts |
| 4 | Billing → create a new invoice for "Test Customer" with 2 products live |
| 5 | Inventory → show low stock highlights, add a new product |
| 6 | AI Insights → click a starter prompt or type "What should I focus on this week?" |
| 7 | Analytics → show the monthly chart and category donut |
| 8 | Patents → show the 4 cards, add a new idea on the spot |
| 9 | Settings → show business profile |

---

## Final Notes

- All mutations (create invoice, add product, etc.) update **local React state only** — no database required for the MVP.
- Never hard-code pixel values — use Tailwind spacing only.
- All currency displays use `formatINR()` from utils.
- Recharts must be wrapped in `<ResponsiveContainer width="100%" height={...}>` for responsive behavior.
- Every form submit should show a shadcn `toast` confirmation.
- Keep all console errors clean before the demo — run `npm run build` at the end to catch type errors.
```
