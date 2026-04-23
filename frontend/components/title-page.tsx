import { LucideIcon } from "lucide-react";

interface PageTitleProps {
  label?: string;
  icon?: LucideIcon;
  loading?: boolean;
}

export function PageTitle({ label = "", icon: Icon, loading }: PageTitleProps) {
  return (
    <div
      className={`dark:text-white text-neutral-500 underline underline-offset-4 flex items-center justify-start gap-2 p-2 pt-0  ${loading ? "animate-pulse opacity-20" : ""}`}
    >
      {Icon && <Icon className="shrink-0" />}
      <span className="text-xl font-semibold tracking-wider">{label}</span>
    </div>
  );
}
