"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Cable, Calendar, Eye, ListTodo, Package, Truck, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export type RomaneioType = {
  registro: string;
  con_nome: string;
  empresa: string;
  sigla: string;
  os: string;
  transportadora: string;
  con_obs: string;
  nnota: string;
  volnumero: string;
  dtentrega: string;
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

type StatusKey = keyof typeof statusConfig;
type TranspKey = keyof typeof transpConfig;

export const columns: ColumnDef<RomaneioType>[] = [
  {
    accessorKey: "transportadora",
    header: () => {
      return (
        <div className="flex items-center gap-2 ml-4">
          <Truck size={16} />
          <span>TRANSP</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const transp = row.original.transportadora;
      const transpKey = (transp?.toUpperCase() || "DEFAULT") as TranspKey;
      const currentStatus = transpConfig[transpKey];

      if (!transp) return;

      return (
        <Badge className="ml-4" variant={currentStatus?.variant ?? "neutral"}>
          {currentStatus?.label ?? "Não Informado"}
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
            <div className="w-42 flex items-center justify-between pl-2">
              <span className="gap-2">{os}</span>
              <Link
                className="rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring focus-visible:ring-offset-0"
                href={url}
                target="_blank"
              >
                <Badge variant={"ML"} className="h-6">
                  <Cable size={16} />
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
        <div className="flex items-center justify-start mr-2 gap-2">
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
        <div className="flex items-center justify-start mr-2 gap-2">
          <span className="">{registro}</span>
          <Badge variant={"neutral"} className="cursor-pointer h-6" onClick={() => modal?.openModal("viewPedido", registro)}>
            <Eye size={16} />
          </Badge>
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
        <div className="flex items-center justify-center gap-2">
          <Package size={16} />
          <span>VOL</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const qtvol = row.original.volnumero;

      if (!qtvol) return;

      return (
        <>
          <div className=" text-center">
            <span>{qtvol}</span>
          </div>
        </>
      );
    },
  },

  {
    accessorKey: "dtentrega",
    header: () => {
      return (
        <div className="flex items-center justify-start mr-2 gap-2">
          <Calendar size={16} />
          <span>ENTREGUE</span>
        </div>
      );
    },
    cell: ({ row }) => {
      return formatDate(row.original.dtentrega);
    },
  },
];
