"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Payment = {
  status: string
  data: string
  registro: number
  os: string
  con_nome: string
  previsao: string
  nnota: number
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
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