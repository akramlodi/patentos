type Status = "paid" | "pending" | "overdue" | "idea" | "research" | "draft" | "filed" | "in-stock" | "low-stock" | "out-of-stock";

const config: Record<Status, { label: string; class: string }> = {
  paid:           { label: "Paid",          class: "bg-emerald-100 text-emerald-700" },
  pending:        { label: "Pending",        class: "bg-amber-100 text-amber-700" },
  overdue:        { label: "Overdue",        class: "bg-red-100 text-red-700" },
  idea:           { label: "Idea",           class: "bg-slate-100 text-slate-600" },
  research:       { label: "Research",       class: "bg-blue-100 text-blue-700" },
  draft:          { label: "Draft",          class: "bg-amber-100 text-amber-700" },
  filed:          { label: "Filed",          class: "bg-indigo-100 text-indigo-700" },
  "in-stock":     { label: "In Stock",       class: "bg-emerald-100 text-emerald-700" },
  "low-stock":    { label: "Low Stock",      class: "bg-amber-100 text-amber-700" },
  "out-of-stock": { label: "Out of Stock",   class: "bg-red-100 text-red-700" },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, class: cls } = config[status];
  return (
    <span className={`${cls} rounded-full px-2.5 py-0.5 text-xs font-medium`}>
      {label}
    </span>
  );
}
