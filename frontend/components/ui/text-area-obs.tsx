import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textAreaVariants = cva(
  `flex 
   items-center 
   justify-start 
   p-2
   whitespace-pre-wrap 
   border 
   text-xs 
   font-bold 
   shrink-0 
   backdrop-blur-sm
   [&>svg]:size-3.5 gap-1 
   [&>svg]:pointer-events-none 
   transition-[color,box-shadow] overflow-hidden`,

  {
    variants: {
      variant: {
        producao: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/15 dark:border-emerald-400/20",
        cancelado: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-500/15 dark:border-red-400/20",
        aberto: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-500/15 dark:border-blue-400/20",
        suspenso: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/15 dark:border-amber-400/20",
        entregue: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 dark:bg-sky-500/15 dark:border-sky-400/20",
        neutral: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400 dark:bg-slate-500/15 dark:border-slate-400/20",

        ML: "border-amber-400/30 bg-amber-400/10 text-amber-700 dark:text-amber-300 dark:bg-amber-400/10 dark:border-amber-400/20",
        RD: "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 dark:bg-indigo-500/15 dark:border-indigo-400/20",
        AC: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 dark:bg-rose-500/15 dark:border-rose-400/20",
        JD: "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 dark:bg-orange-500/15 dark:border-orange-400/20",
        JT: "border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 dark:bg-teal-500/15 dark:border-teal-400/20",
        FR: "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 dark:bg-cyan-500/15 dark:border-cyan-400/20",
        LG: "border-lime-500/30 bg-lime-500/10 text-lime-600 dark:text-lime-400 dark:bg-lime-500/15 dark:border-lime-400/20",
        AF: "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 dark:bg-orange-500/15 dark:border-orange-400/20",
      },
    },
    defaultVariants: {
      variant: "aberto",
    },
  },
);

function TextAreaObs({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof textAreaVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return <Comp data-slot="badge" className={cn(textAreaVariants({ variant }), className)} {...props} />;
}

export { TextAreaObs, textAreaVariants };
