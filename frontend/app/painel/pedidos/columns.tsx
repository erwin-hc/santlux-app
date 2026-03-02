"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export type TypePedidos = {
  status: string
  data: string
  registro: number
  os: string
  con_nome: string
  previsao: string
  nnota: number
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
    header: "Status",
    cell: ({row}) => {    
      const status = row.getValue("status");
      const statusKey = String(status) as StatusKey;
      const currentStatus = statusConfig[statusKey] || statusConfig['*'];
      return <Badge variant={currentStatus.variant}><small className="font-bold tracking-wider">{currentStatus.label}</small></Badge>
    }
  },
  {
    accessorKey: "con_nome",
    header: "Nome",
  },
  {
    accessorKey: "registro",
    header: "Registro",
  },
  {
    accessorKey: "os",
    header: "OS",
    cell: ({row})=> {
      const os = row.getValue("os") as string
      const url = `https://www.mercadolivre.com.br/vendas/${os}/detalhe`
      return <Link className="p-2" href={url} target="_blank">{os}</Link>
    }
  },  
  {
    accessorKey: "previsao",
    header: "Previsao",
      cell: ({row}) => {
      const data = row.getValue("previsao") as string
      return formatDate(data) 
    }
  },
    {
    accessorKey: "transportadora",
    header: "Transp.",
    cell: ({row}) => {    
      const transp = row.getValue("transportadora");
      const transpKey = String(transp) as TranspKey;
      const currentStatus = transpConfig[transpKey] || transpConfig['484'];
      return <Badge variant={currentStatus.variant}><small className="font-bold tracking-wider">{currentStatus.label}</small></Badge>
    }
  },    
  {
    accessorKey: "nnota",
    header: "Nota",
  },
]