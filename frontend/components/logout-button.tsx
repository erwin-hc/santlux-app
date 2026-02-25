"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer w-full">
      <LogOut  />
      Sair
    </Button>
  );
}
