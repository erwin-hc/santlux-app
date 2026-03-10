"use client"
import { Truck, CalendarCog, PiggyBank, ListChecks } from "lucide-react";
import Link from "next/link";
import { SVGProps } from 'react';
import React, { useEffect } from "react";

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
    
    <path 
      strokeWidth="12" 
      d="M48,320h64l64-256l64,384l64-224l32,96h48" 
    />
    
    <circle cx="432" cy="320" r="32" strokeWidth="12" />
  </svg>
);


export default function Page() {

  const linkRef = React.useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    
    const timeout = setTimeout(() => {
      if (linkRef.current) {
        linkRef.current.focus();
      }
    }, 10); 

    return () => clearTimeout(timeout);
  }, []);

  return (    
    <div className="flex flex-1 flex-col p-4">
      
      <div className="grid h-full w-full gap-4 grid-cols-1 md:grid-cols-2 md:grid-rows-2">
  
       <Link ref={linkRef} href={'/painel/pedidos'} 
        className="custom-ring bg-muted relative rounded-xl p-12 flex flex-col justify-center 
             opacity-50 focus:opacity-100 focus:outline-none focus:ring-3
             hover:opacity-100 hover:cursor-pointer"
                       
        >
            <SVGchart className="absolute bottom-4 right-4 w-36 h-36 text-orange-300 rotate-12 pointer-events-none" />
            <ListChecks className="" size={75} strokeWidth={0.75}/>
            <h2 className="text-xl m-2">Pedidos</h2>            
        </Link>

        <Link href={'/painel/producao'} className="custom-ring bg-muted relative rounded-xl md:min-h-0 p-12 flex flex-col justify-center opacity-50
                        hover:opacity-100 hover:cursor-pointer">
            <SVGchart className="absolute bottom-4 right-4 w-36 h-36 text-emerald-300 rotate-12 pointer-events-none" />
            <CalendarCog className="" size={75} strokeWidth={0.75}/>
            <h2 className="text-xl m-2">Produção</h2>
        </Link>

        <Link href={'/painel/romaneios'} className="custom-ring bg-muted relative rounded-xl md:min-h-0 p-12 flex flex-col justify-center opacity-50
                        hover:opacity-100 hover:cursor-pointer">
            <SVGchart className="absolute bottom-4 right-4 w-36 h-36 text-cyan-300 rotate-12 pointer-events-none" />
            <Truck className="" size={75} strokeWidth={0.75}/>
            <h2 className="text-xl m-2">Romaneio</h2>
        </Link>

        <Link href={'/painel/comissao'} className="custom-ring bg-muted relative rounded-xl md:min-h-0 p-12 flex flex-col justify-center opacity-50
                        hover:opacity-100 hover:cursor-pointer">
            <SVGchart className="absolute bottom-4 right-4 w-36 h-36 text-purple-300 rotate-12 pointer-events-none" />
            <PiggyBank className="" size={75} strokeWidth={0.75}/>
            <h2 className="text-xl m-2">Comissão</h2>
        </Link>

      </div>

    </div>
  );
}