import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  `inline-flex 
   items-center 
   justify-center 
   rounded-md 
   px-2 py-0.5 
   text-xs 
   font-bold 
   w-fit 
   whitespace-nowrap 
   shrink-0 
   [&>svg]:size-3.5 gap-1 
   [&>svg]:pointer-events-none 
   transition-[color,box-shadow] overflow-hidden`,

  {
    variants: {
      variant: {
        producao: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/35",
        cancelado: "bg-red-500/20 text-red-600 dark:text-red-400 dark:bg-red-500/35",
        aberto: "bg-blue-500/20 text-blue-600 dark:text-blue-400 dark:bg-blue-500/35",
        suspenso: "bg-amber-500/20 text-amber-600 dark:text-amber-400 dark:bg-amber-500/35",
        entregue: "bg-sky-500/20 text-sky-600 dark:text-sky-400 dark:bg-sky-500/35",
        neutral: "bg-slate-500/20 text-slate-600 dark:text-slate-400 dark:bg-slate-500/35",

        ML: "bg-amber-500/20 text-amber-600 dark:text-amber-400 dark:bg-amber-500/35",
        RD: "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 dark:bg-indigo-500/35",
        AC: "bg-rose-500/20 text-rose-600 dark:text-rose-400 dark:bg-rose-500/35",
        JD: "bg-orange-500/20 text-orange-600 dark:text-orange-400 dark:bg-orange-500/35",
        JT: "bg-teal-500/20 text-teal-600 dark:text-teal-400 dark:bg-teal-500/35",
        FR: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 dark:bg-cyan-500/35",
        LG: "bg-lime-500/20 text-lime-600 dark:text-lime-400 dark:bg-lime-500/35",
        AF: "bg-orange-500/20 text-orange-600 dark:text-orange-400 dark:bg-orange-500/35",
      },
    },
    defaultVariants: {
      variant: "aberto",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
