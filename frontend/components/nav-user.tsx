"use client";
import { ChevronsUpDown, UserRoundCog, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { LogoutButton } from "./logout-button";
import { getNameInitials, formatFullName } from "@/lib/utils";
import { useIsAdmin } from "@/hooks/use-admin";

export function NavUser({
  user,
}: {
  user: {
    username: string;
    email: string;
    isAdmin: boolean;
  };
}) {
  const { isMobile } = useSidebar();
  const isAdmin = useIsAdmin();

  const admin = () =>
    isAdmin ? (
      <div className="flex gap-2 items-center py-2">
        <UserRoundCog size={16} />
        <span>Administrador</span>
      </div>
    ) : (
      <div className="flex gap-2 items-center py-2">
        <User size={16} />
        <span>Usuário Padrão</span>
      </div>
    );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">{getNameInitials(user.username)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ">
                <span className="truncate font-medium">{formatFullName(user.username)}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg "
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal ">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{getNameInitials(user.username)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-medium">{formatFullName(user.username)}</span>
                  <span className="truncate text-xs">{user.email}</span>
                  <span className="truncate text-xs">{admin()}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="my-3 mx-1">
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
