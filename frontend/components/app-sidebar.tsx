"use client";
// import * as React from "react";
import { Truck, CalendarCog, PiggyBank, ListTodo, LayoutDashboard, User } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { Logo } from "./logo";
import { useSession } from "next-auth/react";
import { useIsAdmin } from "@/hooks/use-admin";
import NavAdmin from "./nav-adm";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Painel",
      url: "/painel",
      icon: LayoutDashboard,
    },
    {
      title: "Pedidos",
      url: "/painel/pedidos",
      icon: ListTodo,
    },
    {
      title: "Produção",
      url: "/painel/producao",
      icon: CalendarCog,
    },
    {
      title: "Romaneio",
      url: "/painel/romaneios",
      icon: Truck,
    },
    {
      title: "Comissão",
      url: "/painel/comissao",
      icon: PiggyBank,
    },
  ],
  navAdm: [
    {
      title: "Usuários",
      url: "/usuarios",
      icon: User,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  const isAdmin = useIsAdmin();

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isLoading = status === "loading";

  const user = {
    email: session?.user?.email || "",
    username: session?.user?.username || "",
    isAdmin: session?.user?.isAdmin || false,
  };

  return (
    <Sidebar collapsible="icon" {...props} className="pr-1">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {isLoading ? (
          <div className="flex gap-4 ml-3 pt-3">
            <Skeleton className="h-5 w-5 rounded-full shrink-0" />
            {!isCollapsed && (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-2 w-16" />
              </div>
            )}
          </div>
        ) : isAdmin ? (
          <NavAdmin items={data.navAdm} />
        ) : null}
      </SidebarContent>

      <SidebarFooter>
        {user.email ? (
          <NavUser user={user} />
        ) : (
          <div className="flex gap-4 ">
            <Skeleton className="h-8 w-8 rounded-lg shrink-0" />

            {!isCollapsed && (
              <div className="flex flex-col items-start gap-2">
                <Skeleton className="h-3 w-31.25" />
                <Skeleton className="h-3 w-24" />
              </div>
            )}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
