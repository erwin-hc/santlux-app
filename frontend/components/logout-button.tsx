"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  async function handleLogout() {
    await signOut({ redirect: false });

    window.location.href = "/";
  }

  return (
    <Button
      variant="secondary"
      onClick={handleLogout}
      className="cursor-pointer w-full"
    >
      <LogOut />
      Sair
    </Button>
  );
}
