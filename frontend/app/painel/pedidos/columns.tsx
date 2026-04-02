"use client";

import { Cable, CalendarCog, Eye, ListTodo, Package, Settings2, Truck, User } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { RowData } from "@tanstack/react-table";
import { ModalContextData } from "@/providers/modal-provider";
import { Button } from "@base-ui/react";

import { SwitchEntregue } from "@/components/switch";
import { Checkbox } from "@/components/ui/checkbox";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    isAdmin?: boolean;
    modal?: ModalContextData;
    isSearching?: boolean;
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
  empresa: string;
  volnumero: number;
  pedido: string;
};

export const statusConfig = {
  "*": { variant: "neutral", label: "ABERTO" },
  F: { variant: "producao", label: "PRODUÇÃO" },
  "6": { variant: "producao", label: "PRODUÇÃO" },
  "8": { variant: "producao", label: "PRODUÇÃO" },
  E: { variant: "entregue", label: "ENTREGUE" },
  A: { variant: "cancelado", label: "CANCELADO" },
  S: { variant: "suspenso", label: "SUSPENSO" },
} as const;

export const transpConfig = {
  "11845": { variant: "ML", label: "MERCADO" },
  "806": { variant: "RD", label: "RODONAVES" },
  "018": { variant: "AC", label: "ACEVILLE" },
  "484": { variant: "JD", label: "JADLOG" },
  "13763": { variant: "JT", label: "J&T TRANSP" },
  "13319": { variant: "FR", label: "FRENET" },
  "13233": { variant: "LG", label: "LOGGI" },
  "11795": { variant: "AF", label: "ALFA" },
  default: { variant: "neutral", label: "N/A" },
} as const;

export type StatusKey = keyof typeof statusConfig;
export type TranspKey = keyof typeof transpConfig;

export const columns: ColumnDef<TypePedidos>[] = [
  {
    id: "select",
    accessorKey: "",
    header: ({ table }) => {
      const meta = table.options.meta;
      const rowCount = table.getFilteredRowModel().rows.length;
      const shouldShow = meta?.isSearching && rowCount > 1;

      if (!shouldShow) return null;

      return (
        <>
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </>
      );
    },
    cell: ({ row, table }) => {
      const nota = row.original.nnota;
      const meta = table.options.meta;
      const rowCount = table.getFilteredRowModel().rows.length;
      const shouldShow = meta?.isSearching && rowCount > 1;

      if (!nota) return;

      if (!shouldShow) return null;

      return (
        <>
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        </>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <ListTodo size={16} />
          <span>STATUS</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status");
      const statusKey = String(status) as StatusKey;
      const currentStatus = statusConfig[statusKey];
      return <Badge variant={currentStatus.variant}>{currentStatus.label}</Badge>;
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
    cell: ({ row }) => {
      const nome = row.original.con_nome;
      const empresa = row.original.empresa;

      if (!nome) {
        return (
          <div className="flex items-center gap-2">
            <span>{empresa}</span>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <span>{nome}</span>
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
      const os = row.original.os;
      const url = `https://www.mercadolivre.com.br/vendas/${os}/detalhe`;

      if (!os) return;

      return (
        <>
          {isAdmin ? (
            <div className="w-43 flex items-center justify-between">
              <span className="gap-2">{os}</span>
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
    accessorKey: "registro",
    header: () => {
      return (
        <div className="flex items-center justify-end mr-2 gap-2">
          <ListTodo size={16} />
          <span>REGISTRO</span>
        </div>
      );
    },
    cell: ({ row, table }) => {
      const meta = table.options.meta;
      const modal = meta?.modal;
      const registro = row.original.registro;

      if (!registro) return;

      return (
        <div className="flex items-center justify-end mr-2 gap-2">
          <span className="">{registro}</span>
          <Button
            onClick={() => modal?.openModal("viewPedido", registro)}
            className="rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring focus-visible:ring-offset-0"
          >
            <Badge variant={"neutral"} className="h-6">
              <Eye size={16} />
            </Badge>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "nnota",
    header: () => {
      return (
        <div className="flex items-center justify-end mr-2 gap-2">
          <ListTodo size={16} />
          <span>NF</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const nota = row.original.nnota;
      if (!nota) return;

      return (
        <div className="flex items-center justify-end mr-2">
          <span className="">{nota}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "volnumero",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <Package size={16} />
          <span>VOL</span>
        </div>
      );
    },
    cell: ({ row, table }) => {
      const meta = table.options.meta;
      const isAdmin = meta?.isAdmin;
      const modal = meta?.modal;
      const qtvol = row.original.volnumero;

      if (!qtvol) return;

      return (
        <>
          {isAdmin ? (
            <div className="flex items-center justify-between w-14 mx-2">
              <span>{qtvol}</span>
              <Button
                onClick={() => modal?.openModal("updateVolume", row.original)}
                className="rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring focus-visible:ring-offset-0"
              >
                <Badge variant={"neutral"} className="h-6">
                  <Package strokeWidth={2} />
                </Badge>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-start">
              <span className="mr-2">{qtvol}</span>
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
      const transpKey = (transp?.toUpperCase() || "DEFAULT") as TranspKey;
      const currentStatus = transpConfig[transpKey];

      if (!transp) return;

      return <Badge variant={currentStatus?.variant ?? "neutral"}>{currentStatus?.label ?? "Não Informado"}</Badge>;
    },
  },
  {
    accessorKey: "previsao",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <CalendarCog size={16} />
          <span>PREVISÃO</span>
        </div>
      );
    },
    cell: ({ row, table }) => {
      const meta = table.options.meta;
      const isAdmin = meta?.isAdmin;
      const modal = meta?.modal;
      const previsao = row.original.previsao;

      if (!previsao) return;

      return (
        <>
          {isAdmin ? (
            <div className="flex items-center justify-start">
              <span className="mr-2">{formatDate(previsao)}</span>
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
              <span className="mr-2">{formatDate(previsao)}</span>
              <div className="rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring focus-visible:ring-offset-0"></div>
            </div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "entdata",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <CalendarCog size={16} />
          <span>ENTREGUE</span>
        </div>
      );
    },
    cell: ({ row, table }) => {
      const nota = row.original.nnota;
      const data = row.getValue("entdata") as string;
      const meta = table.options.meta;
      const isAdmin = meta?.isAdmin;
      const modal = meta?.modal;

      if (!nota) return;

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
  // {
  //   accessorKey: "pedido",
  //   header: () => {
  //     return "PEDIDO";
  //   },
  //   cell: ({ row }) => {
  //     return row.original.pedido;
  //   },
  // },
];
