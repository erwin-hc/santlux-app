"use client"

import { Cable, SquarePen } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { RowData } from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    isAdmin?: boolean
  }
}

export type TypePedidos = {
  status: string
  data: string
  registro: number
  os: string
  con_nome: string
  previsao: string
  nnota: number
  transportadora: string
}

const statusConfig = {
  '*': { variant: "aberto", label: "ABERTO" },
  'F': { variant: "producao", label: "PRODUÇÃO" },
  '6': { variant: "producao", label: "PRODUÇÃO" },
  '8': { variant: "producao", label: "PRODUÇÃO" },
  'E': { variant: "entregue", label: "ENTREGUE" },
  'A': { variant: "cancelado", label: "CANCELADO" },
  'S': { variant: "suspenso", label: "SUSPENSO" },
} as const;

const transpConfig = {
  '11845': { variant: "ML", label: "MERCADO" },
  '806': { variant: "RD", label: "RODONAVES" },
  '018': { variant: "AC", label: "ACEVILLE" },
  '484': { variant: "JD", label: "JADLOG" },
  '13763': { variant: "JT", label: "J&T TRANSP" },
  '13319': { variant: "FR", label: "FRENET" },
  '13233': { variant: "LG", label: "LOGGI" },
} as const;

type StatusKey = keyof typeof statusConfig;
type TranspKey = keyof typeof transpConfig;

export const columns: ColumnDef<TypePedidos>[] = [
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({row}) => {    
      const status = row.getValue("status");
      const statusKey = String(status) as StatusKey;
      const currentStatus = statusConfig[statusKey];
      return <Badge variant={currentStatus.variant}><small className="font-bold tracking-wider">{currentStatus.label}</small></Badge>
    }
  },
  {
    accessorKey: "con_nome",
    header: "NOME",
  },
  {
    accessorKey: "os",
    header: "OS",
    cell: ({row, table})=> {
      const meta = table.options.meta;
      const isAdmin = meta?.isAdmin;      
      const os = row.getValue("os") as string
      const url = `https://www.mercadolivre.com.br/vendas/${os}/detalhe`
      return (
        <>
        {isAdmin ? (
        <div className="flex items-center justify-start">
          <span className="mr-2">{os}</span>
          <Link className="p-1 rounded-lg rigcinza" href={url} target="_blank">
            <Badge variant={"ML"} className="h-6 m-0"><Cable strokeWidth={1.50} size={28} /></Badge>
          </Link>
        </div>
        ) : (<span>{os}</span>)}
        </>
      )
    }
  },  
  {
    accessorKey: "previsao",
    header: "PREVISÃO",
      cell: ({row, table}) => {
      const meta = table.options.meta;
      const isAdmin = meta?.isAdmin; 
      const data = row.getValue("previsao") as string
      return (
        <>
          {isAdmin ? (
            <div className="flex items-center justify-start">
              <span className="mr-2">{formatDate(data)}</span>
              <Link href={''} className="p-1 rounded-lg rigcinza" >
                <Badge variant={"FR"} className="h-6 m-0"><SquarePen strokeWidth={1.50} size={28} /></Badge>
              </Link >
            </div>
          ) : (formatDate(data))}  
        
        </>
        
       )
    }
  },
    {
    accessorKey: "transportadora",
    header: "TRANSP.",
    cell: ({row}) => {    
      const transp = row.getValue("transportadora");
      const transpKey = String(transp) as TranspKey;
      const currentStatus = transpConfig[transpKey];
      return <Badge variant={currentStatus.variant}><small className="font-bold tracking-wider">{currentStatus.label}</small></Badge>
    }
  },    
  {
    accessorKey: "nnota",
    header: "NOTA",
  },
]