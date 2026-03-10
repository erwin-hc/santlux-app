"use client";

import { ThemeSwitcher } from "@/components/ui/shadcn-io/theme-switcher";
import { useTheme } from "next-themes";

type ThemeValue = "light" | "dark" | "system";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <ThemeSwitcher
      defaultValue="system"
      onChange={setTheme}
      value={theme as ThemeValue}
    />
  );
};

export default ThemeToggle;
