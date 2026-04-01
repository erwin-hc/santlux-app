"use client";
import { FileX } from "lucide-react";
import { useModal as useModalHook } from "@/providers/modal-provider";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SkeletonTable from "@/components/skeleton-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  isAdmin?: boolean;
}

export function DataTable<TData extends { dtentrega?: string | Date; transportadora?: string }, TValue>({
  columns,
  data,
  loading,
  isAdmin,
}: DataTableProps<TData, TValue>) {
  const modalContext = useModalHook();

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    meta: { modal: modalContext, isAdmin },
    getCoreRowModel: getCoreRowModel(),
  });

  const dataTitle = data[0]?.dtentrega || formatDate(new Date().toLocaleDateString("pt-BR"));
  const uniqueTransp = Array.from(new Set(data.map((item) => item.transportadora))).sort();

  return (
    <Card className="px-1">
      <CardHeader>
        <div className="flex items-center justify-start gap-4 border-b pb-4">
          <CardTitle>{formatDate(dataTitle as string)}</CardTitle>
          <CardDescription>{data.length} Pedido(s)</CardDescription>
        </div>
      </CardHeader>

      <div className="overflow-hidden rounded-md border mx-6 bg-sidebar">
        <Table className="text-[12px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-[12px] font-semibold ">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {loading ? (
            <TableBody className="divide-y divide-border">
              <TableRow>
                <TableCell colSpan={columns.length} className="m-0">
                  <SkeletonTable />
                  <SkeletonTable />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {table.getRowModel()?.rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="pointer-events-none">
                  <TableCell colSpan={columns.length} className="w-full">
                    <div className="flex justify-start items-center gap-2 min-h-96 px-20  ">
                      <FileX className="text-foreground" strokeWidth={0.75} size={40} />
                      <span>Sem resultados!</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
    </Card>
  );
}
