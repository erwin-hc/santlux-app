"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export type Payment = {
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

type StatusKey = keyof typeof statusConfig ;

export const columns: ColumnDef<Payment>[] = [
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
    accessorKey: "data",
    header: "Data",
  },
  {
    accessorKey: "registro",
    header: "Registro",
  },
  {
    accessorKey: "os",
    header: "OS",
  },  
  {
    accessorKey: "con_nome",
    header: "Nome",
  },
  {
    accessorKey: "previsao",
    header: "Previsao",
  },    
  {
    accessorKey: "nnota",
    header: "Nota",
  },
]