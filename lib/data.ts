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
