"use client";
import { Truck, CalendarCog, PiggyBank, ListChecks } from "lucide-react";
import Link from "next/link";
import React, { useEffect, SVGProps, KeyboardEvent } from "react";

const SVGchart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 512 512"
    width="100px"
    height="100px"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path strokeWidth="12" d="M48,320h64l64-256l64,384l64-224l32,96h48" />

    <circle cx="432" cy="320" r="32" strokeWidth="12" />
  </svg>
);

const menuItems = [
  { id: 1, label: "Pedidos", href: "/pedidos" },
  { id: 2, label: "Produção", href: "/producao" },
  { id: 3, label: "Romaneio", href: "/romaneio" },
  { id: 4, label: "Comissão", href: "/comissao" },
];

export default function Page() {
  const itemRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const columns = 2;

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    let nextIndex = index;

    switch (e.key) {
      case "ArrowRight":
        if ((index + 1) % columns !== 0) nextIndex = index + 1;
        break;
      case "ArrowLeft":
        if (index % columns !== 0) nextIndex = index - 1;
        break;
      case "ArrowDown":
        if (index + columns < menuItems.length) nextIndex = index + columns;
        break;
      case "ArrowUp":
        if (index - columns >= 0) nextIndex = index - columns;
        break;
      case "Enter":
        return;
      default:
        return;
    }

    if (nextIndex !== index) {
      e.preventDefault();
      itemRefs.current[nextIndex]?.focus();
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (itemRefs.current[0]) {
        itemRefs.current[0].focus();
      }
    }, 10);

    return () => clearTimeout(timeout);
  }, []);

  const linkClass = `
    custom-ring bg-muted relative rounded-xl p-12 flex flex-col justify-center 
    opacity-50 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-sidebar-ring
    hover:opacity-100 hover:cursor-pointer transition-all
  `;

  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="grid h-full w-full gap-4 grid-cols-1 md:grid-cols-2 md:grid-rows-2">
        <Link
          ref={(el) => {
            itemRefs.current[0] = el;
          }}
          onKeyDown={(e) => handleKeyDown(e, 0)}
          href={"/painel/pedidos"}
          className={linkClass}
        >
          <SVGchart className="absolute bottom-4 right-4 w-36 h-36 text-orange-300 rotate-12 pointer-events-none" />
          <ListChecks className="" size={75} strokeWidth={0.75} />
          <h2 className="text-xl m-2">Pedidos</h2>
        </Link>

        <Link
          ref={(el) => {
            itemRefs.current[1] = el;
          }}
          onKeyDown={(e) => handleKeyDown(e, 1)}
          href={"/painel/producao"}
          className={linkClass}
        >
          <SVGchart className="absolute bottom-4 right-4 w-36 h-36 text-emerald-300 rotate-12 pointer-events-none" />
          <CalendarCog className="" size={75} strokeWidth={0.75} />
          <h2 className="text-xl m-2">Produção</h2>
        </Link>

        <Link
          ref={(el) => {
            itemRefs.current[2] = el;
          }}
          onKeyDown={(e) => handleKeyDown(e, 2)}
          href={"/painel/romaneios"}
          className={linkClass}
        >
          <SVGchart className="absolute bottom-4 right-4 w-36 h-36 text-cyan-300 rotate-12 pointer-events-none" />
          <Truck className="" size={75} strokeWidth={0.75} />
          <h2 className="text-xl m-2">Romaneio</h2>
        </Link>

        <Link
          ref={(el) => {
            itemRefs.current[3] = el;
          }}
          onKeyDown={(e) => handleKeyDown(e, 3)}
          href={"/painel/comissao"}
          className={linkClass}
        >
          <SVGchart className="absolute bottom-4 right-4 w-36 h-36 text-purple-300 rotate-12 pointer-events-none" />
          <PiggyBank className="" size={75} strokeWidth={0.75} />
          <h2 className="text-xl m-2">Comissão</h2>
        </Link>
      </div>
    </div>
  );
}
