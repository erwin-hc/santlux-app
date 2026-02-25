"use client";
import { Blinds } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function Logo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem  className="[&>svg]:size-6 pointer-events-none flex items-center">
          <Blinds strokeWidth={1.15} className="ml-1"/>
          <div className="grid flex-1 text-left text-sm leading-tight ml-2">
            <span className="truncate  font-bold text-xl">SANTLUX</span>
          </div>
          <div></div>
        {/* <SidebarMenuButton size="lg" className="[&>svg]:size-7 pointer-events-none">
        </SidebarMenuButton> */}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
