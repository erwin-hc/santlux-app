import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"; // Importe SidebarProvider
import ThemeToggle from "@/components/theme-toggle";
import { cookies } from "next/headers";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen} style={{ "--sidebar-width": "170px" } as React.CSSProperties}>
      <AppSidebar variant="floating" />
      <SidebarInset>
        <header className="sticky top-0 left-0 z-30 bg-background border-b flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 cursor-pointer custom-ring" variant={"ghost"} />
            <ThemeToggle />

            <DynamicBreadcrumb />
          </div>
        </header>

        <div className="flex flex-1 flex-col pt-2 px-4 tracking-wider">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
