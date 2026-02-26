import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
          producao: "border-emerald-500/5 bg-[#e5f8f2] text-emerald-600  dark:text-emerald-400 dark:bg-[#081b15]",
          cancelado: "border-destructive bg-[#fdecec] text-destructive  dark:text-red-400 dark:bg-[#150b0b]",
          aberto: "border-blue-500/5 bg-[#e9f2ff] text-blue-600  dark:text-blue-400 dark:bg-[#0c1522]",
          suspenso: "border-amber-500/5 bg-[#fff5e5] text-amber-600  dark:text-amber-400 dark:bg-[#221808]",
          entregue: "border-sky-500/5 bg-[#f0f9ff] text-sky-600  dark:text-sky-400 dark:bg-[#081622]",
          neutral: "border-slate-500/5 bg-[#f8fafc] text-slate-600  dark:text-slate-400 dark:bg-[#0f172a]",
          // purple: "border-purple-500/5 bg-[#f5f0ff] text-purple-600  dark:text-purple-400 dark:bg-[#150e20]",
          // indigo: "border-indigo-500/5 bg-[#eff2ff] text-indigo-600  dark:text-indigo-400 dark:bg-[#0e1122]",
          // rose:   "border-rose-500/5 bg-[#fff1f2] text-rose-600  dark:text-rose-400 dark:bg-[#200e10]",
          // orange: "border-orange-500/5 bg-[#fff7ed] text-orange-600  dark:text-orange-400 dark:bg-[#221308]",
          // teal:  "border-teal-500/5 bg-[#f0fdfa] text-teal-600  dark:text-teal-400 dark:bg-[#081a17]",
          // cyan: "border-cyan-500/5 bg-[#ecfeff] text-cyan-600  dark:text-cyan-400 dark:bg-[#081a1c]",
          // lime: "border-lime-500/5 bg-[#f7fee7] text-lime-600  dark:text-lime-400 dark:bg-[#121a08]",
          // fuchsia: "border-fuchsia-500/5 bg-[#fdf4ff] text-fuchsia-600  dark:text-fuchsia-400 dark:bg-[#1d0e20]",

      },

    },
    defaultVariants: {
      variant: "aberto",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
