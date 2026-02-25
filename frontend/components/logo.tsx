"use client";
import { Blinds } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function Logo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="[&>svg]:size-7 pointer-events-none">
          <Blinds strokeWidth={1.15} />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate  font-bold text-xl">SANTLUX</span>
          </div>
          <div></div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
