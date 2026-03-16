"use client";

import { Cable, Calendar, CalendarCog, ListTodo, Settings2, Truck, User } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { RowData } from "@tanstack/react-table";
import { ModalContextData } from "@/providers/modal-provider";
import { Button } from "@base-ui/react";
// import { Checkbox } from "@/components/ui/checkbox";
import { SwitchEntregue } from "@/components/switch";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    isAdmin?: boolean;
    modal?: ModalContextData;
  }
}

export type TypePedidos = {
  status: string;
  data: string;
  registro: number;
  os: string;
  con_nome: string;
  previsao: string;
  nnota: number;
  transportadora: string;
  entdata: string;
};

const statusConfig = {
  "*": { variant: "aberto", label: "ABERTO" },
  F: { variant: "producao", label: "PRODUÇÃO" },
  "6": { variant: "producao", label: "PRODUÇÃO" },
  "8": { variant: "producao", label: "PRODUÇÃO" },
  E: { variant: "entregue", label: "ENTREGUE" },
  A: { variant: "cancelado", label: "CANCELADO" },
  S: { variant: "suspenso", label: "SUSPENSO" },
} as const;

const transpConfig = {
  "11845": { variant: "ML", label: "MERCADO" },
  "806": { variant: "RD", label: "RODONAVES" },
  "018": { variant: "AC", label: "ACEVILLE" },
  "484": { variant: "JD", label: "JADLOG" },
  "13763": { variant: "JT", label: "J&T TRANSP" },
  "13319": { variant: "FR", label: "FRENET" },
  "13233": { variant: "LG", label: "LOGGI" },
  "11795": { variant: "AF", label: "ALFA" },
} as const;

type StatusKey = keyof typeof statusConfig;
type TranspKey = keyof typeof transpConfig;

export const columns: ColumnDef<TypePedidos>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="ml-2"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox className="ml-2" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "status",
    header: () => {
      return (
        <div className="flex items-center gap-2 ml-2">
          <ListTodo size={16} />
          <span>STATUS</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status");
      const statusKey = String(status) as StatusKey;
      const currentStatus = statusConfig[statusKey];
      return (
        <Badge className="ml-2" variant={currentStatus.variant}>
          {currentStatus.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "con_nome",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>NOME</span>
        </div>
      );
    },
  },
  {
    accessorKey: "os",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <ListTodo size={16} />
          <span>OS</span>
        </div>
      );
    },
    cell: ({ row, table }) => {
      const meta = table.options.meta;
      const isAdmin = meta?.isAdmin;
      const os = row.getValue("os") as string;
      const url = `https://www.mercadolivre.com.br/vendas/${os}/detalhe`;
      return (
        <>
          {isAdmin ? (
            <div className="w-50 flex items-center justify-between">
              <span className="mr-2">{os}</span>
              <Link
                className="rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring focus-visible:ring-offset-0"
                href={url}
                target="_blank"
              >
                <Badge variant={"ML"} className="h-6">
                  <Cable size={16} strokeWidth={1.5} />
                </Badge>
              </Link>
            </div>
          ) : (
            <span>{os}</span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "previsao",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>PREVISÃO</span>
        </div>
      );
    },
    cell: ({ row, table }) => {
      const meta = table.options.meta;
      const isAdmin = meta?.isAdmin;
      const modal = meta?.modal;
      const data = row.getValue("previsao") as string;

      return (
        <>
          {isAdmin ? (
            <div className="flex items-center justify-start">
              <span className="mr-2">{formatDate(data)}</span>
              <Button
                onClick={() => modal?.openModal("updatePrevisao", row.original)}
                className="rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring focus-visible:ring-offset-0"
              >
                <Badge variant={"neutral"} className="h-6">
                  <CalendarCog strokeWidth={2} />
                </Badge>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-start">
              <span className="mr-2">{formatDate(data)}</span>
              <div className="rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring focus-visible:ring-offset-0"></div>
            </div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "transportadora",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <Truck size={16} />
          <span>TRANSP</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const transp = row.getValue("transportadora") as string | undefined;
      const transpKey = String(transp ?? "").toUpperCase() as TranspKey;
      const currentStatus = transpConfig[transpKey];

      return <Badge variant={currentStatus?.variant ?? "secondary"}>{currentStatus?.label ?? ""}</Badge>;
    },
  },
  {
    accessorKey: "registro",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <ListTodo size={16} />
          <span>PEDIDO</span>
        </div>
      );
    },
  },
  {
    accessorKey: "nnota",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>NF</span>
        </div>
      );
    },
  },
  {
    accessorKey: "entdata",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>ENTREGUE</span>
        </div>
      );
    },
    cell: ({ row, table }) => {
      const data = row.getValue("entdata") as string;
      const meta = table.options.meta;
      const isAdmin = meta?.isAdmin;
      const modal = meta?.modal;

      if (!isAdmin) {
        return data ? formatDate(data) : <Settings2 strokeWidth={1.5} size={16} />;
      }

      const entregue = () => {
        modal?.openModal("updateEntrega", row.original);
      };

      const naoentregue = async () => {
        try {
          const response = await fetch(`/api/pedidos/naoentregue/${row.getValue("nnota")}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: new Date() }),
          });

          if (response.ok) {
            window.dispatchEvent(new Event("refresh-pedidos"));
          }
        } catch (error) {
          console.error("Erro na requisição:", error);
        }
      };

      return data ? (
        <SwitchEntregue handleClick={naoentregue} label={formatDate(data)} isChecked={true} />
      ) : (
        <SwitchEntregue handleClick={entregue} isChecked={false} icon={Settings2} />
      );
    },
  },
];
