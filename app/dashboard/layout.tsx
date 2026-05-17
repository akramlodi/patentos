import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-[240px] min-h-screen">
        <Topbar />
        <main className="flex-1 overflow-auto bg-[#F8F9FC] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
