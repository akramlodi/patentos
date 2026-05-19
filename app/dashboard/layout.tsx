import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { StoreProvider } from "@/lib/store-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <SidebarProvider style={{ "--sidebar-width-icon": "3.5rem" } as React.CSSProperties}>
        <AppSidebar />
        <SidebarInset className="bg-[#F8F9FC]">
          <Topbar />
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </StoreProvider>
  );
}
